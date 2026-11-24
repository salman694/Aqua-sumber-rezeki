import React, { useState, useEffect } from 'react';
import { X, Package, RefreshCw } from 'lucide-react';
import { api } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { formatRupiah } from '../utils/currency';

export const OrderHistoryModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getMyOrders()
        .then(setOrders)
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-white">
      <div className="relative w-full max-w-lg bg-[#0e121a] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Package size={20} className="text-blue-400" />
            <h3 className="text-base font-bold text-white">{t('orderHistoryTitle')}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center space-y-2">
              <RefreshCw className="animate-spin text-blue-500" size={24} />
              <span className="text-xs">{t('loadingOrders')}</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Package size={36} className="mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">{t('noOrdersTitle')}</p>
              <p className="text-xs text-slate-500">{t('noOrdersDesc')}</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-[#141824] border border-white/5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-400">{ord.id}</span>
                    <span className="block text-[10px] text-slate-400">
                      {new Date(ord.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
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
                </div>

                {/* Items */}
                <div className="space-y-2 border-y border-white/5 py-2.5">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-9 h-9 rounded-lg object-cover bg-black/40 border border-white/5"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-white truncate block">{item.name}</span>
                        <span className="text-[10px] text-slate-400">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-200">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{t('totalPayment')}</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {formatRupiah(ord.totalAmount)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
