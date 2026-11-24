import React, { useState, useEffect } from 'react';
import { api } from './api';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useLanguage } from './context/LanguageContext';
import { formatRupiah } from './utils/currency';
import { CartModal } from './components/CartModal';
import { AdminDashboard } from './components/AdminDashboard';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { AuthModal } from './components/AuthModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { SearchModal } from './components/SearchModal';
import {
  Shield, ShoppingBag, Search, ChevronRight, Star, Plus, Minus,
  Check, RefreshCw, X, Globe, Home, Store, SlidersHorizontal, ArrowRight
} from 'lucide-react';

export default function App() {
  const { user, isAdmin, quickLogin } = useAuth();
  const { cartCount, cartTotal, addToCart } = useCart();
  const { language, toggleLanguage, t } = useLanguage();

  // App Data States
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  // Mobile specific states
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [detailQty, setDetailQty] = useState(1);
  const [detailAdded, setDetailAdded] = useState(false);
  const [quickAddedId, setQuickAddedId] = useState(null);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Category list mapping with translation keys
  const categoryTabs = [
    { key: 'All', labelKey: 'cat_all' },
    { key: 'Fish', labelKey: 'cat_fish' },
    { key: 'Tank', labelKey: 'cat_tank' },
    { key: 'Substrates', labelKey: 'cat_substrates' },
    { key: 'Cleaning Kit', labelKey: 'cat_cleaning_kit' }
  ];

  // Fetch initial catalog
  const loadCatalog = async () => {
    try {
      setLoading(true);
      const prods = await api.getProducts();
      setProducts(prods);

      // Default selected product: Oranda Goldfish (matching screenshot)
      if (prods.length > 0) {
        const defaultFish = prods.find((p) => p.id === 'prod-oranda-goldfish') || prods[0];
        setSelectedProduct(defaultFish);
      }
    } catch (err) {
      console.error('Error loading catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setDetailQty(1);
    if (window.innerWidth < 1024) {
      setIsMobileDetailOpen(true);
    }
  };

  const handleSelectSimilarProduct = (similarId) => {
    const found = products.find((p) => p.id === similarId);
    if (found) {
      setSelectedProduct(found);
      setDetailQty(1);
    } else {
      api.getProduct(similarId)
        .then((res) => {
          if (res) {
            setSelectedProduct(res);
            setDetailQty(1);
          }
        })
        .catch(console.error);
    }
  };

  const handleDetailAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, detailQty);
    setDetailAdded(true);
    setTimeout(() => setDetailAdded(false), 1500);
  };

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setQuickAddedId(product.id);
    setTimeout(() => setQuickAddedId(null), 1200);
  };

  // Filter & Sort Products
  let filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.genus && p.genus.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  const activeSpecs = selectedProduct?.specifications || {
    weight: '4.8 OZ (136g)',
    size: '4.9 inch (12.5cm)',
    temperature: '18-20°C',
    tankSize: '18 gal (68L)',
    age: '2 Years',
    diet: 'Omnivore'
  };

  return (
    <div className="min-h-screen bg-[#070a10] text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Oceanic Ambient Glow Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#152033_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
      </div>

      {/* Global Responsive Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#090d15]/90 backdrop-blur-xl border-b border-white/10 px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-lg sm:text-xl shadow-[0_0_20px_rgba(0,132,255,0.45)]">
            🐠
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
              AQUAZONE
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">
              {t('brandTag')}
            </p>
          </div>
        </div>

        {/* Desktop Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-[#121622] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden w-8 h-8 rounded-xl bg-[#121622] border border-white/10 flex items-center justify-center text-slate-300 active:scale-95 transition-all"
            title="Cari"
          >
            <Search size={15} />
          </button>

          {/* Language Switcher Pill (ID / EN) */}
          <button
            onClick={toggleLanguage}
            title="Ganti Bahasa / Switch Language"
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#121622] hover:bg-[#1a202e] border border-white/10 text-[11px] sm:text-xs font-bold text-slate-200 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Globe size={13} className="text-cyan-400 shrink-0" />
            <span>{language === 'id' ? 'ID' : 'EN'}</span>
          </button>

          {/* Quick Demo Role Switcher (Desktop) */}
          <div className="hidden lg:flex items-center bg-[#121622] px-2 py-1 rounded-xl border border-white/5 space-x-1 text-xs">
            <span className="text-slate-400 font-medium text-[11px]">{t('demoLabel')}</span>
            <button
              onClick={() => quickLogin('user')}
              className={`px-2 py-0.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                !isAdmin ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Jon Karter
            </button>
            <button
              onClick={() => quickLogin('admin')}
              className={`px-2 py-0.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                isAdmin ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Admin Dashboard Button */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm transition-all"
            >
              <Shield size={14} />
              <span className="hidden sm:inline">{t('adminPanel')}</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#121622] border border-white/10 hover:border-white/20 text-slate-200 hover:text-white cursor-pointer transition-all group"
          >
            <div className="relative">
              <ShoppingBag size={16} className="group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#0084ff] text-[9px] font-bold text-white flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-emerald-400 hidden sm:inline">
              {formatRupiah(cartTotal)}
            </span>
          </button>

          {/* Profile Badge Pill */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center space-x-2 py-1 pl-1 pr-2 sm:pr-3 rounded-full bg-[#121622] border border-white/10 hover:border-white/20 cursor-pointer transition-all"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover border border-white/20"
            />
            <span className="text-xs font-semibold text-slate-200 hidden md:inline">
              {user?.name || 'Jon Karter'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Search Expandable Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-[#0c1018] px-4 py-2.5 border-b border-white/10 animate-fade-in">
          <div className="relative w-full">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-[#141824] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main E-Commerce Web Container (with pb-24 for mobile bottom bar clearance) */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 md:pb-8">
        {loading ? (
          <div className="py-32 text-center text-slate-400 flex flex-col items-center space-y-3">
            <RefreshCw className="animate-spin text-blue-500" size={32} />
            <p className="text-sm font-semibold text-slate-300">{t('loadingCatalog')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* =========================================================
                LEFT / MAIN COLUMN: CATEGORIES & PRODUCT CARDS (7 COLS)
                ========================================================= */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-4 sm:space-y-6">
              {/* Category Pills & Sort Controls */}
              <div className="flex items-center justify-between flex-wrap gap-2.5 pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 w-full sm:w-auto">
                  {categoryTabs.map((cat) => {
                    const isActive = selectedCategory === cat.key;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setSelectedCategory(cat.key)}
                        className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                          isActive
                            ? 'bg-[#0084ff] text-white shadow-[0_0_20px_rgba(0,132,255,0.45)]'
                            : 'bg-[#121622] text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
                        }`}
                      >
                        {t(cat.labelKey)}
                      </button>
                    );
                  })}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center space-x-2 ml-auto">
                  <span className="text-xs text-slate-400 hidden sm:inline">{t('sortBy')}</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#121622] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="featured">{t('sort_featured')}</option>
                    <option value="price-low">{t('sort_price_low')}</option>
                    <option value="price-high">{t('sort_price_high')}</option>
                    <option value="rating">{t('sort_rating')}</option>
                  </select>
                </div>
              </div>

              {/* Product Cards Grid: 1 col on mobile, 2 cols on tablet/desktop */}
              {filteredProducts.length === 0 ? (
                <div className="py-24 text-center text-slate-500 bg-[#0d1119] rounded-3xl border border-white/5 space-y-2">
                  <p className="text-sm font-semibold text-slate-400">{t('noProductsTitle')}</p>
                  <p className="text-xs">{t('noProductsDesc')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {filteredProducts.map((product) => {
                    const isSelected = selectedProduct?.id === product.id;
                    const isJustAdded = quickAddedId === product.id;

                    return (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className={`group relative rounded-3xl overflow-hidden bg-[#0d111a] border transition-all duration-300 shadow-xl cursor-pointer active:scale-[0.99] ${
                          isSelected
                            ? 'border-blue-500 shadow-[0_0_30px_rgba(0,132,255,0.25)] ring-1 ring-blue-500'
                            : 'border-white/5 hover:border-blue-500/40 hover:shadow-[0_10px_35px_rgba(0,132,255,0.15)]'
                        }`}
                      >
                        {/* Price Tag in Rupiah (Top Left) */}
                        <div className="absolute top-3.5 left-3.5 z-10">
                          <span className="text-xs font-extrabold text-white tracking-wide drop-shadow-md bg-black/60 px-2.5 py-1 rounded-xl backdrop-blur-md border border-white/10">
                            {formatRupiah(product.price)}
                          </span>
                        </div>

                        {/* Quick Bag Button (Top Right) */}
                        <div className="absolute top-3 right-3.5 z-10">
                          <button
                            onClick={(e) => handleQuickAdd(e, product)}
                            title={t('addToCartQuick')}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                              isJustAdded
                                ? 'bg-emerald-500 text-white scale-110 shadow-lg'
                                : 'bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-blue-600 hover:border-blue-500'
                            }`}
                          >
                            {isJustAdded ? (
                              <Check size={16} className="stroke-[3]" />
                            ) : (
                              <ShoppingBag size={15} className="stroke-[2]" />
                            )}
                          </button>
                        </div>

                        {/* Product Image Showcase */}
                        <div className="w-full h-48 sm:h-56 relative overflow-hidden flex items-center justify-center bg-radial from-[#182335]/40 to-transparent">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0d111a] via-transparent to-transparent opacity-85" />
                        </div>

                        {/* Bottom Frosted Glass Capsule Bar */}
                        <div className="absolute bottom-3 left-3 right-3 z-10">
                          <div className="w-full py-2.5 px-3.5 sm:px-4 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/10 flex items-center justify-between shadow-lg group-hover:bg-white/[0.14] transition-colors">
                            <span className="text-xs sm:text-sm font-semibold text-slate-100 truncate pr-2">
                              {product.name}
                            </span>
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black shrink-0 transition-transform group-hover:translate-x-0.5">
                              <ChevronRight size={14} className="stroke-[3]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* =========================================================
                RIGHT COLUMN: LIVE SPECIFICATIONS & ORDER PANEL (5 COLS)
                (Sticky Desktop Showcase matching the Right Screen!)
                ========================================================= */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-5 sticky top-20">
              {selectedProduct ? (
                <div className="relative rounded-3xl bg-[#0c1018]/90 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl flex flex-col space-y-5 text-white">
                  {/* Subtitle & Huge Title */}
                  <div className="relative min-h-[160px]">
                    <div className="relative z-10 max-w-[60%]">
                      <span className="text-xs text-slate-400 font-medium tracking-wide">
                        {selectedProduct.genus || 'Species'}
                      </span>
                      <h2 className="text-2xl font-black text-white tracking-tight uppercase mt-0.5 leading-tight">
                        {selectedProduct.name}
                      </h2>

                      <div className="mt-3">
                        <span className="text-xl font-bold text-emerald-400">
                          {formatRupiah(selectedProduct.price)}
                        </span>
                        <span className="block text-xs text-slate-400">
                          {t('perUnit')}
                        </span>
                      </div>
                    </div>

                    {/* Floating Realistic Fish Graphic Showcase */}
                    <div className="absolute -top-4 -right-4 w-[200px] h-[200px] pointer-events-none flex items-center justify-center">
                      <div className="relative w-full h-full animate-aquatic-float">
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,132,255,0.3)]"
                        />
                        <div className="absolute inset-0 bg-radial from-blue-500/15 to-transparent blur-xl pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Specifications Header & Rating */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <h3 className="text-sm font-bold text-white">
                      {t('specifications')}
                    </h3>
                    <div className="flex items-center space-x-1.5 py-1 px-3 rounded-full bg-[#151924] border border-white/5 text-xs text-slate-200">
                      <span className="font-bold">{selectedProduct.rating || 4.5}</span>
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                    </div>
                  </div>

                  {/* 6 Specification Grid Cards */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="rounded-2xl bg-[#131722] border border-white/5 p-2.5 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">{t('spec_weight')}</span>
                      <span className="text-xs font-bold text-white mt-1 truncate">{activeSpecs.weight}</span>
                    </div>

                    <div className="rounded-2xl bg-[#131722] border border-white/5 p-2.5 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">{t('spec_size')}</span>
                      <span className="text-xs font-bold text-white mt-1 truncate">{activeSpecs.size}</span>
                    </div>

                    <div className="rounded-2xl bg-[#131722] border border-white/5 p-2.5 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">{t('spec_temperature')}</span>
                      <span className="text-xs font-bold text-white mt-1 truncate">{activeSpecs.temperature}</span>
                    </div>

                    <div className="rounded-2xl bg-[#131722] border border-white/5 p-2.5 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">{t('spec_tankSize')}</span>
                      <span className="text-xs font-bold text-white mt-1 truncate">{activeSpecs.tankSize}</span>
                    </div>

                    <div className="rounded-2xl bg-[#131722] border border-white/5 p-2.5 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">{t('spec_age')}</span>
                      <span className="text-xs font-bold text-white mt-1 truncate">{activeSpecs.age}</span>
                    </div>

                    <div className="rounded-2xl bg-[#131722] border border-white/5 p-2.5 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">{t('spec_diet')}</span>
                      <span className="text-xs font-bold text-white mt-1 truncate">{activeSpecs.diet}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedProduct.description && (
                    <p className="text-xs text-slate-400 leading-relaxed bg-[#11151e]/60 p-3 rounded-2xl border border-white/5">
                      {selectedProduct.description}
                    </p>
                  )}

                  {/* Similar Species Carousel / Grid */}
                  <div className="pt-1">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                      {t('similarSpecies')}
                    </h4>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(selectedProduct.similarSpecies && selectedProduct.similarSpecies.length > 0
                        ? selectedProduct.similarSpecies
                        : [
                            {
                              id: 'prod-pufferfish',
                              name: 'Pufferfish',
                              price: 275000,
                              image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80'
                            },
                            {
                              id: 'prod-betta',
                              name: 'Betta Fish',
                              price: 220000,
                              image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=300&q=80'
                            },
                            {
                              id: 'prod-guppy',
                              name: 'Fancy Guppy',
                              price: 130000,
                              image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=300&q=80'
                            }
                          ]
                      ).map((similar) => (
                        <div
                          key={similar.id}
                          onClick={() => handleSelectSimilarProduct(similar.id)}
                          className="group rounded-2xl bg-[#131722] border border-white/5 p-2 flex flex-col items-center hover:border-blue-500/40 hover:bg-[#191f2c] transition-all cursor-pointer"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center mb-1">
                            <img
                              src={similar.image}
                              alt={similar.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <span className="text-[10px] font-medium text-slate-300 truncate w-full text-center">
                            {similar.name}
                          </span>
                          {similar.price && (
                            <span className="text-[9px] text-emerald-400 font-bold">
                              {formatRupiah(similar.price)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quantity & Order Actions Bar */}
                  <div className="pt-2 flex items-center space-x-3">
                    {/* Quantity Stepper */}
                    <div className="flex items-center space-x-2 bg-[#121622] rounded-2xl px-2 py-1.5 border border-white/10">
                      <button
                        onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-white">{detailQty}</span>
                      <button
                        onClick={() => setDetailQty(detailQty + 1)}
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleDetailAddToCart}
                      className={`flex-1 h-12 rounded-2xl flex items-center justify-between px-6 font-semibold text-sm transition-all shadow-lg cursor-pointer active:scale-98 ${
                        detailAdded
                          ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                          : 'bg-[#181d28] hover:bg-[#202736] border border-white/10 text-white'
                      }`}
                    >
                      {detailAdded ? (
                        <span className="flex items-center justify-center w-full space-x-2">
                          <Check size={18} className="stroke-[3]" />
                          <span>{t('addedSuccess')}</span>
                        </span>
                      ) : (
                        <>
                          <span className="text-slate-200">{t('addToCart')}</span>
                          <span className="text-slate-400 font-mono tracking-tighter text-sm flex items-center">
                            &gt;&gt;&gt;
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>

      {/* =========================================================
          MODERN MOBILE FLOATING GLASS NAVIGATION BAR (md:hidden)
          ========================================================= */}
      <nav className="fixed bottom-3 inset-x-4 max-w-sm mx-auto z-40 md:hidden pointer-events-none">
        <div className="bg-[#0f141f]/95 backdrop-blur-2xl border border-white/15 rounded-full py-1.5 px-3 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex items-center justify-around pointer-events-auto">
          {/* Home Tab */}
          <button
            onClick={() => {
              setSelectedCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center w-12 py-1 text-slate-400 hover:text-blue-400 transition-colors active:scale-90"
          >
            <Home size={18} />
            <span className="text-[9px] font-semibold mt-0.5">Home</span>
          </button>

          {/* Search Tab */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center w-12 py-1 text-slate-400 hover:text-blue-400 transition-colors active:scale-90"
          >
            <Search size={18} />
            <span className="text-[9px] font-semibold mt-0.5">Search</span>
          </button>

          {/* Categories Tab */}
          <button
            onClick={() => {
              setSelectedCategory('Fish');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center w-12 py-1 text-slate-400 hover:text-blue-400 transition-colors active:scale-90"
          >
            <Store size={18} />
            <span className="text-[9px] font-semibold mt-0.5">Store</span>
          </button>

          {/* Basket Tab with Live Count Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center justify-center w-12 py-1 text-slate-400 hover:text-blue-400 transition-colors active:scale-90"
          >
            <div className="relative">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#0084ff] text-[9px] font-bold text-white flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-semibold mt-0.5">Basket</span>
          </button>
        </div>
      </nav>

      {/* =========================================================
          MODERN MOBILE PRODUCT DETAIL BOTTOM SHEET (< 1024px)
          ========================================================= */}
      {isMobileDetailOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md lg:hidden animate-fade-in text-white">
          <div className="w-full max-w-lg bg-[#0c1018] border-t border-white/15 rounded-t-[32px] p-5 max-h-[92vh] overflow-y-auto no-scrollbar shadow-[0_-10px_40px_rgba(0,0,0,0.9)] flex flex-col space-y-4 animate-slide-up">
            {/* Top Drag Indicator Pill */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto -mt-1 mb-1" />

            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-xs font-bold tracking-widest uppercase text-slate-400">
                {t('mobileDetailTitle')}
              </span>
              <button
                onClick={() => setIsMobileDetailOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Showcase Fish Image & Info */}
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center shrink-0 relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,132,255,0.3)] animate-aquatic-float"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs text-slate-400">{selectedProduct.genus || 'Species'}</span>
                <h3 className="text-base font-black text-white uppercase truncate">{selectedProduct.name}</h3>
                <span className="text-base font-bold text-emerald-400 block mt-0.5">
                  {formatRupiah(selectedProduct.price)}
                </span>
                <div className="flex items-center space-x-1 mt-1 text-[11px] text-amber-400">
                  <Star size={12} className="fill-amber-400" />
                  <span className="font-bold text-slate-200">{selectedProduct.rating || 4.5}</span>
                </div>
              </div>
            </div>

            {/* 6 Specifications Grid (Matching Screenshot!) */}
            <div>
              <span className="text-[11px] font-bold text-slate-300 block mb-2">{t('specifications')}:</span>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-[#141822] border border-white/5 p-2">
                  <span className="text-[10px] text-slate-400 block">{t('spec_weight')}</span>
                  <span className="text-xs font-bold text-white block mt-0.5 truncate">{activeSpecs.weight}</span>
                </div>
                <div className="rounded-xl bg-[#141822] border border-white/5 p-2">
                  <span className="text-[10px] text-slate-400 block">{t('spec_size')}</span>
                  <span className="text-xs font-bold text-white block mt-0.5 truncate">{activeSpecs.size}</span>
                </div>
                <div className="rounded-xl bg-[#141822] border border-white/5 p-2">
                  <span className="text-[10px] text-slate-400 block">{t('spec_temperature')}</span>
                  <span className="text-xs font-bold text-white block mt-0.5 truncate">{activeSpecs.temperature}</span>
                </div>
                <div className="rounded-xl bg-[#141822] border border-white/5 p-2">
                  <span className="text-[10px] text-slate-400 block">{t('spec_tankSize')}</span>
                  <span className="text-xs font-bold text-white block mt-0.5 truncate">{activeSpecs.tankSize}</span>
                </div>
                <div className="rounded-xl bg-[#141822] border border-white/5 p-2">
                  <span className="text-[10px] text-slate-400 block">{t('spec_age')}</span>
                  <span className="text-xs font-bold text-white block mt-0.5 truncate">{activeSpecs.age}</span>
                </div>
                <div className="rounded-xl bg-[#141822] border border-white/5 p-2">
                  <span className="text-[10px] text-slate-400 block">{t('spec_diet')}</span>
                  <span className="text-xs font-bold text-white block mt-0.5 truncate">{activeSpecs.diet}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedProduct.description && (
              <p className="text-xs text-slate-400 leading-relaxed bg-[#11151e]/60 p-3 rounded-2xl border border-white/5">
                {selectedProduct.description}
              </p>
            )}

            {/* Similar Species Carousel */}
            {selectedProduct.similarSpecies && selectedProduct.similarSpecies.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-300 block mb-2">{t('similarSpecies')}:</span>
                <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                  {selectedProduct.similarSpecies.map((similar) => (
                    <div
                      key={similar.id}
                      onClick={() => handleSelectSimilarProduct(similar.id)}
                      className="w-20 shrink-0 p-1.5 rounded-xl bg-[#141822] border border-white/5 flex flex-col items-center cursor-pointer active:scale-95 transition-all"
                    >
                      <img
                        src={similar.image}
                        alt={similar.name}
                        className="w-12 h-12 rounded-lg object-cover mb-1"
                      />
                      <span className="text-[9px] text-slate-300 truncate w-full text-center">
                        {similar.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Actions: Stepper + Add to Cart */}
            <div className="pt-2 flex items-center space-x-2.5 pb-safe">
              <div className="flex items-center space-x-1.5 bg-[#141822] rounded-2xl px-2 py-2 border border-white/10 shrink-0">
                <button
                  onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-300"
                >
                  <Minus size={13} />
                </button>
                <span className="w-5 text-center text-xs font-bold">{detailQty}</span>
                <button
                  onClick={() => setDetailQty(detailQty + 1)}
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-300"
                >
                  <Plus size={13} />
                </button>
              </div>

              <button
                onClick={() => {
                  handleDetailAddToCart();
                  setTimeout(() => setIsMobileDetailOpen(false), 900);
                }}
                className="flex-1 py-3.5 rounded-2xl bg-[#0084ff] hover:bg-blue-600 font-bold text-xs sm:text-sm text-white shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-98"
              >
                <ShoppingBag size={16} />
                <span>{t('addToCart')} ({formatRupiah(selectedProduct.price * detailQty)})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={() => {
          loadCatalog();
        }}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefreshCatalog={loadCatalog}
      />

      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
}
