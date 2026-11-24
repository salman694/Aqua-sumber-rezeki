import React, { useState, useEffect, useRef } from 'react';
import {
  X, Plus, Edit2, Trash2, Package, ShoppingCart, Users, DollarSign,
  AlertTriangle, RefreshCw, Search, Upload, Image, Check, AlertCircle
} from 'lucide-react';
import { api } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { formatRupiah } from '../utils/currency';

export const AdminDashboard = ({ isOpen, onClose, onRefreshCatalog }) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'users'
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    genus: '',
    category: 'Fish',
    price: 185000,
    stock: 20,
    rating: 4.5,
    description: '',
    image: '',
    specifications: {
      weight: '4.8 OZ (136g)',
      size: '4.9 inch (12.5cm)',
      temperature: '18-20°C',
      tankSize: '18 gal (68L)',
      age: '2 Years',
      diet: 'Omnivore'
    }
  });

  const fileInputRef = useRef(null);
  const [imageMode, setImageMode] = useState('file'); // 'file' | 'url'
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError('Hanya mendukung file gambar .JPG, .JPEG, .PNG, atau .WEBP');
      return;
    }

    setUploadingImage(true);
    setUploadError('');
    try {
      const uploadedUrl = await api.uploadImage(file);
      setFormData(prev => ({ ...prev, image: uploadedUrl }));
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Gagal mengunggah gambar');
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, productsData, ordersData, usersData] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getAllOrders(),
        api.getAdminUsers()
      ]);
      setStats(statsData);
      setProducts(productsData);
      setOrders(ordersData);
      setUsers(usersData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      genus: '',
      category: 'Fish',
      price: 200000,
      stock: 20,
      rating: 4.8,
      description: 'Ikan hias eksotis berkualitas tinggi dengan corak memukau.',
      image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80',
      specifications: {
        weight: '4.0 OZ (113g)',
        size: '4.5 inch (11.4cm)',
        temperature: '22-26°C',
        tankSize: '20 gal (75L)',
        age: '1.5 Years',
        diet: 'Omnivore'
      }
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      genus: prod.genus || '',
      category: prod.category,
      price: prod.price,
      stock: prod.stock,
      rating: prod.rating,
      description: prod.description || '',
      image: prod.image,
      specifications: {
        weight: prod.specifications?.weight || '4.0 OZ',
        size: prod.specifications?.size || '4.0 inch',
        temperature: prod.specifications?.temperature || '22-26°C',
        tankSize: prod.specifications?.tankSize || '15 gal min',
        age: prod.specifications?.age || '1 Year',
        diet: prod.specifications?.diet || 'Omnivore'
      }
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, formData);
      } else {
        await api.createProduct(formData);
      }
      setIsProductModalOpen(false);
      await fetchData();
      if (onRefreshCatalog) onRefreshCatalog();
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      try {
        await api.deleteProduct(id);
        await fetchData();
        if (onRefreshCatalog) onRefreshCatalog();
      } catch (err) {
        alert('Error deleting product: ' + err.message);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      await fetchData();
    } catch (err) {
      alert('Error updating order status: ' + err.message);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in text-white">
      <div className="relative w-full max-w-5xl h-[92vh] bg-[#0c1017] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>{t('adminTitle')}</span>
                <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                  ADMIN
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {t('adminSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="bg-[#141824] p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">{t('totalRevenue')}</span>
                <span className="text-base sm:text-lg font-bold text-emerald-400">{formatRupiah(stats.totalRevenue)}</span>
              </div>
            </div>

            <div className="bg-[#141824] p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <ShoppingCart size={20} />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">{t('totalOrders')}</span>
                <span className="text-base sm:text-lg font-bold text-blue-400">{stats.totalOrders}</span>
              </div>
            </div>

            <div className="bg-[#141824] p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <Package size={20} />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">{t('totalProducts')}</span>
                <span className="text-base sm:text-lg font-bold text-white">{stats.totalProducts}</span>
              </div>
            </div>

            <div className="bg-[#141824] p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">{t('lowStock')}</span>
                <span className="text-base sm:text-lg font-bold text-amber-400">{stats.lowStockCount} item</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('tabProducts')} ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('tabOrders')} ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t('tabUsers')} ({users.length})
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md cursor-pointer transition-all"
            >
              <Plus size={16} />
              <span>{t('addProductBtn')}</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-3">
          {loading ? (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center space-y-2">
              <RefreshCw className="animate-spin text-blue-500" size={28} />
              <span className="text-xs">Memuat data admin...</span>
            </div>
          ) : activeTab === 'products' ? (
            /* Products Tab */
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchProductAdmin')}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#141822] border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="py-2.5 px-3">{t('thProduct')}</th>
                      <th className="py-2.5 px-3">{t('thCategory')}</th>
                      <th className="py-2.5 px-3">{t('thPrice')}</th>
                      <th className="py-2.5 px-3">{t('thStock')}</th>
                      <th className="py-2.5 px-3">{t('thSpecs')}</th>
                      <th className="py-2.5 px-3 text-right">{t('thAction')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 px-3 flex items-center space-x-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-white/5"
                          />
                          <div>
                            <span className="font-bold text-white block">{p.name}</span>
                            <span className="text-[10px] text-slate-400">{p.genus || 'Species'}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-blue-300">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-emerald-400">
                          {formatRupiah(p.price)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            p.stock < 10 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {p.stock} pcs
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[10px] text-slate-400">
                          {p.specifications?.temperature || '-'} | {p.specifications?.tankSize || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'orders' ? (
            /* Orders Tab */
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="py-2.5 px-3">{t('thOrderId')}</th>
                      <th className="py-2.5 px-3">{t('thCustomer')}</th>
                      <th className="py-2.5 px-3">{t('thItems')}</th>
                      <th className="py-2.5 px-3">{t('thTotal')}</th>
                      <th className="py-2.5 px-3">{t('thStatus')}</th>
                      <th className="py-2.5 px-3 text-right">{t('thChangeStatus')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-400">
                          {ord.id}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-white block">{ord.userName}</span>
                          <span className="text-[10px] text-slate-400">{ord.userPhone || ord.userEmail}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          {ord.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-emerald-400">
                          {formatRupiah(ord.totalAmount)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : ord.status === 'Shipped'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : ord.status === 'Processing'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-[#141822] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Users Tab */
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {users.map((u) => (
                  <div key={u.id} className="p-3.5 rounded-2xl bg-[#141824] border border-white/5 flex items-center space-x-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-12 h-12 rounded-full object-cover bg-black/40 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm truncate">{u.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          u.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 block truncate">{u.email}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{u.address || 'No address registered'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-white">
          <div className="w-full max-w-xl bg-[#0f141d] border border-white/10 rounded-3xl p-6 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold">
                {editingProduct ? t('modalEditProductTitle') : t('modalAddProductTitle')}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('prodNameLabel')}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Oranda Goldfish"
                    className="w-full px-3 py-2 rounded-xl bg-[#141824] border border-white/10 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('prodGenusLabel')}</label>
                  <input
                    type="text"
                    value={formData.genus}
                    onChange={(e) => setFormData({ ...formData, genus: e.target.value })}
                    placeholder="Contoh: Oranda"
                    className="w-full px-3 py-2 rounded-xl bg-[#141824] border border-white/10 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{t('prodCategoryLabel')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141824] border border-white/10 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Fish">Fish (Ikan)</option>
                    <option value="Tank">Tank (Akuarium)</option>
                    <option value="Substrates">Substrates (Substrat)</option>
                    <option value="Cleaning Kit">Cleaning Kit (Pembersih)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('prodPriceLabel')}</label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141824] border border-white/10 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{t('prodStockLabel')}</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141824] border border-white/10 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Selection (Upload File JPG/PNG or Enter URL) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-400 font-semibold">{t('prodImageLabel')}</label>
                  {/* Mode Selector Pill */}
                  <div className="flex bg-[#0a0e14] p-0.5 rounded-lg border border-white/10 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setImageMode('file')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                        imageMode === 'file' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      📁 {t('uploadFromComputer')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                        imageMode === 'url' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🔗 {t('pasteImageUrl')}
                    </button>
                  </div>
                </div>

                {imageMode === 'file' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5 ${
                        uploadingImage
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/15 hover:border-blue-500 hover:bg-white/[0.02] bg-[#141824]'
                      }`}
                    >
                      {uploadingImage ? (
                        <div className="py-2 flex flex-col items-center space-y-2">
                          <RefreshCw className="animate-spin text-blue-400" size={24} />
                          <span className="text-xs text-blue-300 font-medium">{t('uploading')}</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-blue-600/15 text-blue-400 flex items-center justify-center mb-0.5">
                            <Upload size={18} />
                          </div>
                          <span className="text-xs font-semibold text-slate-200 block">
                            {t('dragOrClick')}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {t('supportedFormats')}
                          </span>
                        </>
                      )}
                    </div>

                    {uploadError && (
                      <p className="text-[11px] text-red-400 mt-1 flex items-center space-x-1">
                        <AlertCircle size={12} />
                        <span>{uploadError}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/... atau link gambar JPG/PNG"
                      className="w-full px-3 py-2 rounded-xl bg-[#141824] border border-white/10 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* Image Preview Box */}
                {formData.image && (
                  <div className="flex items-center space-x-3 p-2 rounded-xl bg-[#0b0e14] border border-white/10">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-14 h-14 rounded-lg object-cover bg-black border border-white/10"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-slate-200 block truncate">
                        Preview Gambar Produk
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate font-mono">
                        {formData.image}
                      </span>
                    </div>
                    {imageMode === 'file' && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 cursor-pointer"
                      >
                        {t('changeImage')}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 6 Specifications Grid */}
              <div className="p-3 rounded-2xl bg-[#141824] border border-white/5 space-y-2">
                <span className="font-bold text-slate-200 block">{t('prodSpecsLabel')}</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">{t('spec_weight')}:</label>
                    <input
                      type="text"
                      value={formData.specifications.weight}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, weight: e.target.value }
                      })}
                      className="w-full px-2 py-1 rounded bg-[#0a0d14] border border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">{t('spec_size')}:</label>
                    <input
                      type="text"
                      value={formData.specifications.size}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, size: e.target.value }
                      })}
                      className="w-full px-2 py-1 rounded bg-[#0a0d14] border border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">{t('spec_temperature')}:</label>
                    <input
                      type="text"
                      value={formData.specifications.temperature}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, temperature: e.target.value }
                      })}
                      className="w-full px-2 py-1 rounded bg-[#0a0d14] border border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">{t('spec_tankSize')}:</label>
                    <input
                      type="text"
                      value={formData.specifications.tankSize}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, tankSize: e.target.value }
                      })}
                      className="w-full px-2 py-1 rounded bg-[#0a0d14] border border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">{t('spec_age')}:</label>
                    <input
                      type="text"
                      value={formData.specifications.age}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, age: e.target.value }
                      })}
                      className="w-full px-2 py-1 rounded bg-[#0a0d14] border border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">{t('spec_diet')}:</label>
                    <input
                      type="text"
                      value={formData.specifications.diet}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, diet: e.target.value }
                      })}
                      className="w-full px-2 py-1 rounded bg-[#0a0d14] border border-white/10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{t('prodDescLabel')}</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#141824] border border-white/10 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 font-semibold cursor-pointer"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg cursor-pointer"
                >
                  {t('saveProductBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
