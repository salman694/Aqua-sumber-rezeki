import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data with Indonesian Rupiah (IDR)
const getInitialData = () => {
  const salt = bcrypt.genSaltSync(10);
  const adminPassword = bcrypt.hashSync('admin123', salt);
  const userPassword = bcrypt.hashSync('user123', salt);

  return {
    users: [
      {
        id: 'user-admin',
        name: 'Aqua Admin',
        email: 'admin@aquazone.com',
        password: adminPassword,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        phone: '+62 812-3456-7890',
        address: 'Jl. Samudra Bahari No. 88, Jakarta',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-jon',
        name: 'Jon Karter',
        email: 'jon@karter.com',
        password: userPassword,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        phone: '+62 819-8765-4321',
        address: 'Sunset Boulevard Suite 12, Bali',
        createdAt: new Date().toISOString()
      }
    ],
    categories: [
      { id: 'cat-1', name: 'Fish' },
      { id: 'cat-2', name: 'Tank' },
      { id: 'cat-3', name: 'Substrates' },
      { id: 'cat-4', name: 'Cleaning Kit' }
    ],
    products: [
      {
        id: 'prod-oranda-goldfish',
        name: 'Oranda Goldfish',
        genus: 'Oranda',
        category: 'Fish',
        price: 185000,
        stock: 35,
        rating: 4.5,
        ratingCount: 128,
        description: 'Ikan Mas Koki Oranda terkenal dengan jambul (wen) berbentuk buah rasberi di atas kepalanya. Perenang yang anggun dan jinak dengan sirip ekor melambai indah.',
        image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
        specifications: {
          weight: '4.8 OZ (136g)',
          size: '4.9 inch (12.5cm)',
          temperature: '18-20°C',
          tankSize: '18 gal (68L)',
          age: '2 Years',
          diet: 'Omnivore'
        },
        similarSpecies: [
          {
            id: 'prod-pufferfish',
            name: 'Pufferfish',
            price: 275000,
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80'
          },
          {
            id: 'prod-betta',
            name: 'Betta Fish',
            price: 220000,
            image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=400&q=80'
          },
          {
            id: 'prod-guppy',
            name: 'Fancy Guppy',
            price: 130000,
            image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=400&q=80'
          }
        ],
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-warsee-fish',
        name: 'Warsee Fish',
        genus: 'Apistogramma',
        category: 'Fish',
        price: 240000,
        stock: 20,
        rating: 4.7,
        ratingCount: 94,
        description: 'Cichlid kerdil air tawar yang menawan dengan kilau sisik pirus-keemasan. Sangat cocok untuk akuarium biotope tanaman hias.',
        image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
        specifications: {
          weight: '3.2 OZ (90g)',
          size: '3.5 inch (8.9cm)',
          temperature: '22-26°C',
          tankSize: '15 gal (57L)',
          age: '1.5 Years',
          diet: 'Herbivore'
        },
        similarSpecies: [
          {
            id: 'prod-oranda-goldfish',
            name: 'Oranda Goldfish',
            price: 185000,
            image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80'
          },
          {
            id: 'prod-clownfish',
            name: 'Clownfish',
            price: 310000,
            image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=400&q=80'
          }
        ],
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-clownfish',
        name: 'Ocellaris Clownfish',
        genus: 'Amphiprion',
        category: 'Fish',
        price: 310000,
        stock: 40,
        rating: 4.9,
        ratingCount: 210,
        description: 'Ikan laut ikonik yang terkenal hidup bersimbiosis dengan anemon laut. Berwarna oranye cerah dengan strip putih bergaris hitam tegas.',
        image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80',
        specifications: {
          weight: '2.5 OZ (70g)',
          size: '3.0 inch (7.6cm)',
          temperature: '24-27°C',
          tankSize: '20 gal (75L)',
          age: '1 Year',
          diet: 'Omnivore'
        },
        similarSpecies: [
          {
            id: 'prod-oranda-goldfish',
            name: 'Oranda Goldfish',
            price: 185000,
            image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80'
          },
          {
            id: 'prod-warsee-fish',
            name: 'Warsee Fish',
            price: 240000,
            image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=400&q=80'
          }
        ],
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-pufferfish',
        name: 'Figure Eight Pufferfish',
        genus: 'Tetraodon',
        category: 'Fish',
        price: 275000,
        stock: 15,
        rating: 4.6,
        ratingCount: 77,
        description: 'Ikan buntal air payau yang cerdas dan penuh rasa ingin tahu, dengan motif bintik mata menyerupai angka 8 di punggungnya.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        specifications: {
          weight: '3.0 OZ (85g)',
          size: '3.1 inch (7.8cm)',
          temperature: '24-26°C',
          tankSize: '20 gal (75L)',
          age: '2.5 Years',
          diet: 'Carnivore'
        },
        similarSpecies: [
          {
            id: 'prod-betta',
            name: 'Betta Fish',
            price: 220000,
            image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=400&q=80'
          },
          {
            id: 'prod-guppy',
            name: 'Fancy Guppy',
            price: 130000,
            image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=400&q=80'
          }
        ],
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-betta',
        name: 'Halfmoon Royal Betta',
        genus: 'Betta',
        category: 'Fish',
        price: 220000,
        stock: 25,
        rating: 4.8,
        ratingCount: 165,
        description: 'Cupang hias jantan Halfmoon dengan bentangan sirip ekor 180 derajat memukau bergradasi merah ruby dan biru kobalt berpendar.',
        image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
        specifications: {
          weight: '1.2 OZ (34g)',
          size: '2.8 inch (7.1cm)',
          temperature: '24-28°C',
          tankSize: '5 gal (19L)',
          age: '1 Year',
          diet: 'Carnivore'
        },
        similarSpecies: [
          {
            id: 'prod-guppy',
            name: 'Fancy Guppy',
            price: 130000,
            image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=400&q=80'
          },
          {
            id: 'prod-oranda-goldfish',
            name: 'Oranda Goldfish',
            price: 185000,
            image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80'
          }
        ],
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-guppy',
        name: 'Dragon Mosaic Guppy',
        genus: 'Poecilia',
        category: 'Fish',
        price: 130000,
        stock: 50,
        rating: 4.6,
        ratingCount: 88,
        description: 'Ikan guppy hias yang aktif dan ramah komunitas dengan motif renda mosaik di sirip punggung dan ekor kipasnya.',
        image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80',
        specifications: {
          weight: '0.6 OZ (17g)',
          size: '1.8 inch (4.5cm)',
          temperature: '22-26°C',
          tankSize: '10 gal (38L)',
          age: '1 Year',
          diet: 'Omnivore'
        },
        similarSpecies: [
          {
            id: 'prod-betta',
            name: 'Betta Fish',
            price: 220000,
            image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=400&q=80'
          }
        ],
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-tank-60p',
        name: 'Ultra-Clear Rimless Tank 60P',
        genus: 'Crystal Glass',
        category: 'Tank',
        price: 1350000,
        stock: 12,
        rating: 4.9,
        ratingCount: 52,
        description: 'Akuarium kaca rimless low-iron bening ekstra jernih (60x30x36cm). Transmisi cahaya 91% dengan lem silikon presisi standar aquascape Jerman.',
        image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
        specifications: {
          weight: '12.5 kg',
          size: '60x30x36 cm',
          temperature: 'Ambient',
          tankSize: '64 Liter net',
          age: 'Lifetime Glass',
          diet: 'Water Safe'
        },
        similarSpecies: [],
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-sub-stratum',
        name: 'Fluval Plant & Shrimp Stratum 4KG',
        genus: 'Volcanic Soil',
        category: 'Substrates',
        price: 385000,
        stock: 30,
        rating: 4.8,
        ratingCount: 140,
        description: 'Pasir tanah vulkanik kaya mineral alami dari kaki Gunung Aso Jepang. Merangsang pertumbuhan akar tanaman air dan menjaga air tetap jernih.',
        image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        specifications: {
          weight: '4.0 kg',
          size: 'Butiran 2-4mm',
          temperature: 'Semua Suhu',
          tankSize: 'Hingga 75 Liter',
          age: 'Aktif 2 Tahun',
          diet: 'Trace Minerals'
        },
        similarSpecies: [],
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-clean-kit',
        name: 'Pro Electric Siphon & Gravel Cleaner',
        genus: 'Maintenance Kit',
        category: 'Cleaning Kit',
        price: 450000,
        stock: 18,
        rating: 4.7,
        ratingCount: 96,
        description: 'Vakum penyedot kotoran kerikil akuarium 3-in-1 bertenaga baterai / adaptor AC. Aliran 520 L/jam untuk kuras dan saring kotoran tanpa repot.',
        image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
        specifications: {
          weight: '700 gram',
          size: 'Panjang 75cm',
          temperature: 'Semua Suhu',
          tankSize: '20-400 Liter',
          age: 'Garansi 2 Tahun',
          diet: 'Electric Powered'
        },
        similarSpecies: [],
        featured: false,
        createdAt: new Date().toISOString()
      }
    ],
    orders: [
      {
        id: 'ord-1001',
        userId: 'user-jon',
        userName: 'Jon Karter',
        userEmail: 'jon@karter.com',
        userPhone: '+62 819-8765-4321',
        shippingAddress: 'Sunset Boulevard Suite 12, Bali',
        items: [
          {
            productId: 'prod-oranda-goldfish',
            name: 'Oranda Goldfish',
            price: 185000,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80'
          },
          {
            productId: 'prod-sub-stratum',
            name: 'Fluval Plant & Shrimp Stratum 4KG',
            price: 385000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80'
          }
        ],
        subtotal: 755000,
        shippingFee: 25000,
        totalAmount: 780000,
        paymentMethod: 'QRIS / Instant Transfer',
        status: 'Delivered',
        notes: 'Kemasan aerasi oksigen khusus hidup ya!',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'ord-1002',
        userId: 'user-jon',
        userName: 'Jon Karter',
        userEmail: 'jon@karter.com',
        userPhone: '+62 819-8765-4321',
        shippingAddress: 'Sunset Boulevard Suite 12, Bali',
        items: [
          {
            productId: 'prod-warsee-fish',
            name: 'Warsee Fish',
            price: 240000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=400&q=80'
          }
        ],
        subtotal: 240000,
        shippingFee: 25000,
        totalAmount: 265000,
        paymentMethod: 'Cash on Delivery (COD)',
        status: 'Processing',
        notes: 'Kabari jika kurir sudah dekat.',
        createdAt: new Date().toISOString()
      }
    ]
  };
};

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      this.data = initial;
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading db file, resetting to initial data', err);
        const initial = getInitialData();
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
        this.data = initial;
      }
    }
  }

  save() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to save database file:', err);
    }
  }

  // Users
  findUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  createUser({ name, email, password, role = 'user', phone = '', address = '', avatar = '' }) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const defaultAvatar = avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

    const newUser = {
      id: `user-${uuidv4().slice(0, 8)}`,
      name,
      email,
      password: hashedPassword,
      role,
      avatar: defaultAvatar,
      phone,
      address,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  getAllUsers() {
    return this.data.users.map(({ password, ...rest }) => rest);
  }

  // Products
  getAllProducts({ category, search, sort } = {}) {
    let list = [...this.data.products];

    if (category && category !== 'All' && category !== 'Semua') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.genus && p.genus.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id);
  }

  createProduct(productData) {
    const id = `prod-${uuidv4().slice(0, 8)}`;
    const newProduct = {
      id,
      name: productData.name || 'Produk Akuatik Baru',
      genus: productData.genus || 'Species',
      category: productData.category || 'Fish',
      price: parseFloat(productData.price) || 0,
      stock: parseInt(productData.stock) || 10,
      rating: parseFloat(productData.rating) || 5.0,
      ratingCount: 1,
      description: productData.description || '',
      image: productData.image || 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
      specifications: {
        weight: productData.specifications?.weight || '3.5 OZ',
        size: productData.specifications?.size || '4.0 inch',
        temperature: productData.specifications?.temperature || '22-26°C',
        tankSize: productData.specifications?.tankSize || '15 gal min',
        age: productData.specifications?.age || '1 Year',
        diet: productData.specifications?.diet || 'Omnivore'
      },
      similarSpecies: productData.similarSpecies || [],
      featured: !!productData.featured,
      createdAt: new Date().toISOString()
    };

    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  updateProduct(id, updates) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = this.data.products[index];
    this.data.products[index] = {
      ...existing,
      ...updates,
      price: updates.price !== undefined ? parseFloat(updates.price) : existing.price,
      stock: updates.stock !== undefined ? parseInt(updates.stock) : existing.stock,
      specifications: {
        ...existing.specifications,
        ...(updates.specifications || {})
      },
      updatedAt: new Date().toISOString()
    };

    this.save();
    return this.data.products[index];
  }

  deleteProduct(id) {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Categories
  getCategories() {
    return this.data.categories;
  }

  // Orders
  createOrder({ userId, userName, userEmail, userPhone, shippingAddress, items, subtotal, shippingFee, totalAmount, paymentMethod, notes }) {
    const newOrder = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      userName,
      userEmail,
      userPhone,
      shippingAddress,
      items,
      subtotal: parseFloat(subtotal) || 0,
      shippingFee: parseFloat(shippingFee) || 25000,
      totalAmount: parseFloat(totalAmount) || 0,
      paymentMethod: paymentMethod || 'Cash on Delivery (COD)',
      status: 'Pending',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    // Deduct stock
    for (const item of items) {
      const prod = this.getProductById(item.productId);
      if (prod && prod.stock >= item.quantity) {
        prod.stock -= item.quantity;
      }
    }

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  getOrdersByUserId(userId) {
    return this.data.orders.filter(o => o.userId === userId);
  }

  getAllOrders() {
    return this.data.orders;
  }

  getOrderById(id) {
    return this.data.orders.find(o => o.id === id);
  }

  updateOrderStatus(orderId, status) {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.save();
    return order;
  }

  // Admin Stats
  getStats() {
    const totalOrders = this.data.orders.length;
    const totalRevenue = this.data.orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalProducts = this.data.products.length;
    const totalUsers = this.data.users.length;
    const lowStock = this.data.products.filter(p => p.stock < 10);
    const recentOrders = this.data.orders.slice(0, 5);

    return {
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(0)),
      totalProducts,
      totalUsers,
      lowStockCount: lowStock.length,
      lowStockProducts: lowStock,
      recentOrders
    };
  }
}

export const db = new Database();
