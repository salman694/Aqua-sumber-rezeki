import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CheckCircle2, ArrowRight, MapPin, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatRupiah } from '../utils/currency';
import { api } from '../api';

export const CartModal = ({ isOpen, onClose, onOrderSuccess }) => {
  const { items, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user, isLoggedIn } = useAuth();
  const { t } = useLanguage();

  const [address, setAddress] = useState(user?.address || 'Jl. Samudra Bahari No. 12, Denpasar, Bali');
  const [phone, setPhone] = useState(user?.phone || '+62 819-8765-4321');
  const [paymentMethod, setPaymentMethod] = useState('QRIS / Instant Transfer');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isOpen) return null;

  // Shipping fee in Rupiah (Rp 25.000)
  const shippingFee = items.length > 0 ? 25000 : 0;
  const grandTotal = cartTotal + shippingFee;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!isLoggedIn) {
      setError('Silakan login terlebih dahulu / Please login first to complete your order.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const order = await api.createOrder({
        items,
        subtotal: cartTotal,
        shippingFee,
        totalAmount: grandTotal,
        shippingAddress: address,
        userPhone: phone,
        paymentMethod,
        notes
      });

      clearCart();
      setPlacedOrder(order);
      if (onOrderSuccess) onOrderSuccess(order);
    } catch (err) {
      setError(err.message || 'Gagal memproses pesanan.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setPlacedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0e121a] border-t sm:border border-white/10 rounded-t-[32px] sm:rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden text-white animate-slide-up sm:animate-fade-in">
        {/* Mobile Pull Handle Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-white/20 rounded-full mx-auto -mt-1 mb-2" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">{t('cartTitle')}</span>
            <span className="text-xs bg-blue-600/30 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
              {items.length} {t('cartProductTypes')}
            </span>
          </div>
          <button
            onClick={resetAndClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success View */}
        {placedOrder ? (
          <div className="py-8 text-center flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-bold text-white">{t('orderSuccessTitle')}</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              {t('orderNumber')} <span className="font-mono text-blue-400 font-bold">{placedOrder.id}</span>
              <br />
              {t('orderSuccessDesc')}
            </p>
            <div className="bg-[#141924] rounded-2xl p-4 w-full border border-white/5 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">{t('recipient')}</span>
                <span className="font-semibold text-white">{placedOrder.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('totalPayment')}</span>
                <span className="font-bold text-emerald-400">{formatRupiah(placedOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('paymentMethodLabel')}</span>
                <span className="text-slate-200">{placedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('statusLabel')}</span>
                <span className="text-blue-400 font-semibold">{placedOrder.status}</span>
              </div>
            </div>
            <button
              onClick={resetAndClose}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg transition-all cursor-pointer"
            >
              {t('backToShop')}
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart */
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="text-4xl">🐟</div>
            <p className="text-base font-semibold text-slate-300">{t('cartEmptyTitle')}</p>
            <p className="text-xs text-slate-500">{t('cartEmptyDesc')}</p>
            <button
              onClick={onClose}
              className="mt-3 px-6 py-2.5 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 cursor-pointer"
            >
              {t('exploreShop')}
            </button>
          </div>
        ) : (
          /* Cart Items & Form */
          <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-xs text-red-300">
                {error}
              </div>
            )}

            {/* Items List */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="p-3 rounded-2xl bg-[#141822] border border-white/5 flex items-center justify-between space-x-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-black/40 border border-white/5"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                    <span className="text-xs text-emerald-400 font-bold">
                      {formatRupiah(item.price)}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {item.specifications?.tankSize || item.category}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center space-x-1.5 bg-[#0a0d14] rounded-lg p-1 border border-white/10">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-slate-500 hover:text-red-400 p-1.5 cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Delivery & Checkout Details */}
            <form onSubmit={handleCheckout} className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center space-x-1">
                  <MapPin size={12} />
                  <span>{t('deliveryAddressLabel')}</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('addressPlaceholder')}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#141822] border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 flex items-center space-x-1">
                    <Phone size={12} />
                    <span>{t('phoneLabel')}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 8..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#141822] border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">{t('paymentMethodLabel')}</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#141822] border border-white/10 focus:border-blue-500 focus:outline-none text-white cursor-pointer"
                  >
                    <option value="QRIS / Instant Transfer">QRIS (Gopay / OVO / Dana / BCA)</option>
                    <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                    <option value="Virtual Account BCA/Mandiri/BRI">Virtual Account (BCA / Mandiri / BRI)</option>
                    <option value="Credit / Debit Card">Credit / Debit Card</option>
                  </select>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3.5 rounded-2xl bg-[#141924] border border-white/5 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{t('subtotalLabel')}</span>
                  <span className="font-semibold text-white">{formatRupiah(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t('shippingFeeLabel')}</span>
                  <span className="font-semibold text-white">{formatRupiah(shippingFee)}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-bold">
                  <span className="text-white">{t('totalPayment')}</span>
                  <span className="text-emerald-400">{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#0084ff] hover:bg-blue-600 font-bold text-white shadow-[0_4px_20px_rgba(0,132,255,0.4)] transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>{t('processingOrder')}</span>
                ) : (
                  <>
                    <span>{t('checkoutNow')} ({formatRupiah(grandTotal)})</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
