import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  id: {
    // Brand & Header
    brandTag: 'Toko Akuatik & Ikan Eksotis Premium',
    searchPlaceholder: 'Cari ikan eksotis, aquarium tank, perlengkapan...',
    demoLabel: 'Demo:',
    userDemo: 'Jon Karter (User)',
    adminDemo: 'Admin',
    adminPanel: 'Admin Panel',

    // Categories
    cat_all: 'Semua',
    cat_fish: 'Ikan',
    cat_tank: 'Akuarium',
    cat_substrates: 'Substrat',
    cat_cleaning_kit: 'Alat Pembersih',

    // Sort options
    sortBy: 'Urutkan:',
    sort_featured: 'Paling Populer',
    sort_price_low: 'Harga: Rendah ke Tinggi',
    sort_price_high: 'Harga: Tinggi ke Rendah',
    sort_rating: 'Rating Tertinggi',

    // Product Card & Detail
    noProductsTitle: 'Tidak ada produk ditemukan',
    noProductsDesc: 'Coba ubah kategori atau kata kunci pencarian Anda.',
    addToCartQuick: 'Tambah ke Keranjang',
    perUnit: 'per ekor/unit',
    specifications: 'Spesifikasi',
    spec_weight: 'Berat',
    spec_size: 'Ukuran',
    spec_temperature: 'Suhu Air',
    spec_tankSize: 'Ukuran Akuarium',
    spec_age: 'Usia',
    spec_diet: 'Makanan Khusus',
    similarSpecies: 'Spesies Serupa',
    addToCart: 'Tambah ke Keranjang',
    addedSuccess: 'Berhasil Ditambahkan!',
    loadingCatalog: 'Memuat Katalog Toko Ikan AquaZone...',

    // Mobile Detail
    mobileDetailTitle: 'Spesifikasi Detail',

    // Cart Modal
    cartTitle: 'Keranjang Belanja',
    cartProductTypes: 'jenis produk',
    cartEmptyTitle: 'Keranjang masih kosong',
    cartEmptyDesc: 'Pilih ikan eksotis atau perlengkapan akuarium untuk memulai.',
    exploreShop: 'Jelajahi Toko',
    orderSuccessTitle: 'Pesanan Berhasil!',
    orderNumber: 'Nomor Pesanan:',
    orderSuccessDesc: 'Ikan dan perlengkapan akuarium Anda sedang disiapkan dengan standar keamanan karantina & aerasi hidup khusus.',
    recipient: 'Penerima:',
    totalPayment: 'Total Pembayaran:',
    paymentMethodLabel: 'Metode:',
    statusLabel: 'Status:',
    backToShop: 'Kembali ke Toko',
    deliveryAddressLabel: 'Alamat Pengiriman (Aman dengan Kemasan Oksigen):',
    addressPlaceholder: 'Masukkan alamat pengiriman lengkap...',
    phoneLabel: 'Nomor WhatsApp:',
    subtotalLabel: 'Subtotal:',
    shippingFeeLabel: 'Ongkir Khusus Aerasi Oksigen Hidup:',
    checkoutNow: 'Bayar Sekarang',
    processingOrder: 'Memproses Pesanan...',

    // Admin Dashboard
    adminTitle: 'AquaZone Admin Panel',
    adminSubtitle: 'Kelola katalog ikan, pesanan pelanggan, dan inventaris toko',
    totalRevenue: 'Total Pendapatan',
    totalOrders: 'Total Pesanan',
    totalProducts: 'Jumlah Produk',
    lowStock: 'Stok Menipis',
    tabProducts: 'Manajemen Produk',
    tabOrders: 'Pesanan Pelanggan',
    tabUsers: 'Pengguna',
    addProductBtn: 'Tambah Produk',
    searchProductAdmin: 'Cari produk berdasarkan nama atau kategori...',
    thProduct: 'Produk',
    thCategory: 'Kategori',
    thPrice: 'Harga',
    thStock: 'Stok',
    thSpecs: 'Spesifikasi',
    thAction: 'Aksi',
    thOrderId: 'ID Pesanan',
    thCustomer: 'Pelanggan',
    thItems: 'Item',
    thTotal: 'Total',
    thStatus: 'Status',
    thChangeStatus: 'Ubah Status',
    modalAddProductTitle: 'Tambah Produk Baru',
    modalEditProductTitle: 'Edit Produk Akuatik',
    prodNameLabel: 'Nama Produk:',
    prodGenusLabel: 'Genus / Sub-title:',
    prodCategoryLabel: 'Kategori:',
    prodPriceLabel: 'Harga (Rp):',
    prodStockLabel: 'Stok:',
    prodImageLabel: 'Gambar Produk:',
    uploadFromComputer: 'Pilih File dari Komputer (JPG, PNG, WEBP)',
    pasteImageUrl: 'Gunakan URL Gambar',
    dragOrClick: 'Klik untuk memilih file gambar dari komputer',
    supportedFormats: 'Mendukung format .JPG, .JPEG, .PNG, dan .WEBP',
    uploading: 'Sedang mengunggah gambar...',
    changeImage: 'Ganti Gambar',
    prodSpecsLabel: '6 Spesifikasi Detail:',
    prodDescLabel: 'Deskripsi:',
    cancelBtn: 'Batal',
    saveProductBtn: 'Simpan Produk',

    // Order History Modal
    orderHistoryTitle: 'Riwayat Pesanan Saya',
    noOrdersTitle: 'Belum ada pesanan',
    noOrdersDesc: 'Ikan yang Anda pesan akan muncul di sini.',
    loadingOrders: 'Memuat pesanan...',

    // Profile Drawer
    profileTitle: 'Profil Pengguna',
    quickSwitchRole: 'Ganti Peran Instan (Demo)',
    openAdminDashboard: 'Buka Admin Dashboard',
    openOrderHistory: 'Riwayat Pesanan Saya',
    loginRegisterBtn: 'Login / Register Akun Baru',
    logoutBtn: 'Keluar dari Akun',

    // Auth Modal
    authLoginTitle: 'Masuk ke AquaZone',
    authRegisterTitle: 'Daftar Akun Baru',
    quickDemoAccess: 'Akses Cepat (Demo Langsung):',
    tabLogin: 'Masuk',
    tabRegister: 'Daftar',
    fullNameLabel: 'Nama Lengkap:',
    emailLabel: 'Email:',
    passwordLabel: 'Kata Sandi:',
    submitLogin: 'Masuk Sekarang',
    submitRegister: 'Daftar Akun'
  },

  en: {
    // Brand & Header
    brandTag: 'Premium Exotic Fish & Aquatic Lifestyle Store',
    searchPlaceholder: 'Search exotic fish, aquarium tanks, substrates...',
    demoLabel: 'Demo:',
    userDemo: 'Jon Karter (User)',
    adminDemo: 'Admin',
    adminPanel: 'Admin Panel',

    // Categories
    cat_all: 'All',
    cat_fish: 'Fish',
    cat_tank: 'Tank',
    cat_substrates: 'Substrates',
    cat_cleaning_kit: 'Cleaning Kit',

    // Sort options
    sortBy: 'Sort by:',
    sort_featured: 'Most Popular',
    sort_price_low: 'Price: Low to High',
    sort_price_high: 'Price: High to Low',
    sort_rating: 'Highest Rating',

    // Product Card & Detail
    noProductsTitle: 'No products found',
    noProductsDesc: 'Try changing category or search keyword.',
    addToCartQuick: 'Add to Cart',
    perUnit: 'per unit',
    specifications: 'Specifications',
    spec_weight: 'Weight',
    spec_size: 'Size',
    spec_temperature: 'Temperature',
    spec_tankSize: 'Tank Size',
    spec_age: 'Age',
    spec_diet: 'Special Diet',
    similarSpecies: 'Similar Species',
    addToCart: 'Add to cart',
    addedSuccess: 'Added to Cart!',
    loadingCatalog: 'Loading AquaZone Fish Store...',

    // Mobile Detail
    mobileDetailTitle: 'Detailed Specifications',

    // Cart Modal
    cartTitle: 'Shopping Basket',
    cartProductTypes: 'item types',
    cartEmptyTitle: 'Basket is currently empty',
    cartEmptyDesc: 'Choose exotic fish or aquarium supplies to get started.',
    exploreShop: 'Explore Store',
    orderSuccessTitle: 'Order Placed Successfully!',
    orderNumber: 'Order Number:',
    orderSuccessDesc: 'Your fish and aquarium equipment are being packed with live quarantine & specialized oxygen aeration standards.',
    recipient: 'Recipient:',
    totalPayment: 'Total Payment:',
    paymentMethodLabel: 'Method:',
    statusLabel: 'Status:',
    backToShop: 'Back to Store',
    deliveryAddressLabel: 'Shipping Address (Live Oxygen Packaging):',
    addressPlaceholder: 'Enter complete shipping address...',
    phoneLabel: 'WhatsApp / Phone Number:',
    subtotalLabel: 'Subtotal:',
    shippingFeeLabel: 'Live Oxygen Aeration Shipping:',
    checkoutNow: 'Checkout Now',
    processingOrder: 'Processing Order...',

    // Admin Dashboard
    adminTitle: 'AquaZone Admin Panel',
    adminSubtitle: 'Manage fish catalog, customer orders, and shop inventory',
    totalRevenue: 'Total Revenue',
    totalOrders: 'Total Orders',
    totalProducts: 'Total Products',
    lowStock: 'Low Stock Alert',
    tabProducts: 'Product Management',
    tabOrders: 'Customer Orders',
    tabUsers: 'Users',
    addProductBtn: 'Add Product',
    searchProductAdmin: 'Search products by name or category...',
    thProduct: 'Product',
    thCategory: 'Category',
    thPrice: 'Price',
    thStock: 'Stock',
    thSpecs: 'Specifications',
    thAction: 'Action',
    thOrderId: 'Order ID',
    thCustomer: 'Customer',
    thItems: 'Items',
    thTotal: 'Total',
    thStatus: 'Status',
    thChangeStatus: 'Change Status',
    modalAddProductTitle: 'Add New Product',
    modalEditProductTitle: 'Edit Aquatic Product',
    prodNameLabel: 'Product Name:',
    prodGenusLabel: 'Genus / Sub-title:',
    prodCategoryLabel: 'Category:',
    prodPriceLabel: 'Price (Rp):',
    prodStockLabel: 'Stock:',
    prodImageLabel: 'Product Image:',
    uploadFromComputer: 'Upload from Computer (JPG, PNG, WEBP)',
    pasteImageUrl: 'Use Image URL',
    dragOrClick: 'Click to choose image file from computer',
    supportedFormats: 'Supports .JPG, .JPEG, .PNG, and .WEBP',
    uploading: 'Uploading image...',
    changeImage: 'Change Image',
    prodSpecsLabel: '6 Detailed Specifications:',
    prodDescLabel: 'Description:',
    cancelBtn: 'Cancel',
    saveProductBtn: 'Save Product',

    // Order History Modal
    orderHistoryTitle: 'My Order History',
    noOrdersTitle: 'No orders yet',
    noOrdersDesc: 'The aquatic species you order will appear here.',
    loadingOrders: 'Loading orders...',

    // Profile Drawer
    profileTitle: 'User Profile',
    quickSwitchRole: 'Instant Role Switch (Demo)',
    openAdminDashboard: 'Open Admin Dashboard',
    openOrderHistory: 'My Order History',
    loginRegisterBtn: 'Login / Register New Account',
    logoutBtn: 'Log Out',

    // Auth Modal
    authLoginTitle: 'Sign In to AquaZone',
    authRegisterTitle: 'Create New Account',
    quickDemoAccess: 'Quick Access (Instant Demo):',
    tabLogin: 'Sign In',
    tabRegister: 'Register',
    fullNameLabel: 'Full Name:',
    emailLabel: 'Email Address:',
    passwordLabel: 'Password:',
    submitLogin: 'Sign In Now',
    submitRegister: 'Create Account'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('aquazone_lang') || 'id';
  });

  useEffect(() => {
    localStorage.setItem('aquazone_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['id']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
