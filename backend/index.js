import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { db } from './db.js';
import { authenticateToken, requireAdmin, JWT_SECRET } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Upload directory setup
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/* =========================================================
   AUTH ROUTES
========================================================= */
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = db.createUser({
      name,
      email,
      password,
      role: 'user',
      phone: phone || '',
      address: address || ''
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        phone: newUser.phone,
        address: newUser.address
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone || '',
        address: user.address || ''
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password, ...safeUser } = user;
  res.json({ user: safeUser });
});

/* =========================================================
   PRODUCT ROUTES
========================================================= */
app.get('/api/products', (req, res) => {
  const { category, search, sort } = req.query;
  const products = db.getAllProducts({ category, search, sort });
  res.json({ products });
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

app.post('/api/products', authenticateToken, requireAdmin, (req, res) => {
  try {
    const newProduct = db.createProduct(req.body);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully', product: updated });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

/* =========================================================
   CATEGORY ROUTES
========================================================= */
app.get('/api/categories', (req, res) => {
  const categories = db.getCategories();
  res.json({ categories });
});

/* =========================================================
   ORDER ROUTES
========================================================= */
app.post('/api/orders', authenticateToken, (req, res) => {
  try {
    const { items, shippingAddress, userPhone, paymentMethod, notes, subtotal, shippingFee, totalAmount } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cannot create empty order' });
    }

    const order = db.createOrder({
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: userPhone || '',
      shippingAddress: shippingAddress || 'Default Address',
      items,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      notes
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders/my-orders', authenticateToken, (req, res) => {
  const orders = db.getOrdersByUserId(req.user.id);
  res.json({ orders });
});

app.get('/api/orders', authenticateToken, requireAdmin, (req, res) => {
  const orders = db.getAllOrders();
  res.json({ orders });
});

app.put('/api/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ message: 'Order status updated', order: updated });
});

/* =========================================================
   ADMIN STATS & USERS
========================================================= */
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  const stats = db.getStats();
  res.json({ stats });
});

app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  const users = db.getAllUsers();
  res.json({ users });
});

/* =========================================================
   FILE UPLOAD ROUTE
========================================================= */
app.post('/api/upload', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl, filename: req.file.filename });
});

/* =========================================================
   HEALTH CHECK
========================================================= */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`AquaZone Server running on http://localhost:${PORT}`);
});
