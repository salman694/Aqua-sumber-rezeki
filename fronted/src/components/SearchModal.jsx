import React, { useState, useEffect } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatRupiah } from '../utils/currency';

export const SearchModal = ({ isOpen, onClose, products, onSelectProduct }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  const results = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    (p.genus && p.genus.toLowerCase().includes(query.toLowerCase())) ||
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fade-in text-white">
      <div className="w-full max-w-lg bg-[#0e121a] border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
          <Search size={18} className="text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500"
          />
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              {t('noProductsTitle')}
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="p-2.5 rounded-2xl bg-[#141822] hover:bg-[#1a2130] border border-white/5 flex items-center justify-between space-x-3 cursor-pointer transition-colors"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-xl object-cover bg-black/40 border border-white/5"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                    <span className="text-emerald-400 font-bold">{formatRupiah(product.price)}</span>
                    <span>•</span>
                    <span>{product.category}</span>
                    <span>•</span>
                    <span>{product.specifications?.temperature || ''}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-500" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
