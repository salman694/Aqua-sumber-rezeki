import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Sparkles, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, register, quickLogin } = useAuth();
  const { t } = useLanguage();
  const [tab, setTab] = useState(defaultTab); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, phone, address });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Autentikasi gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (role) => {
    setLoading(true);
    setError('');
    try {
      await quickLogin(role);
      onClose();
    } catch (err) {
      setError(err.message || 'Quick login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-white">
      <div className="relative w-full max-w-md bg-[#0e121a] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              🐠
            </div>
            <h3 className="text-base font-bold text-white">
              {tab === 'login' ? t('authLoginTitle') : t('authRegisterTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick Demo Login Buttons */}
        <div className="my-4 p-3 rounded-2xl bg-[#141824] border border-white/5 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1.5">
            <Sparkles size={12} className="text-amber-400" />
            <span>{t('quickDemoAccess')}</span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuick('user')}
              className="py-2 px-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-[11px] font-bold text-blue-300 flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <UserCheck size={14} />
              <span>Jon Karter (User)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuick('admin')}
              className="py-2 px-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-[11px] font-bold text-purple-300 flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Shield size={14} />
              <span>Admin (Owner)</span>
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-white/10 mb-4 text-xs font-semibold">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-2 text-center transition-colors cursor-pointer border-b-2 ${
              tab === 'login' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t('tabLogin')}
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-2 text-center transition-colors cursor-pointer border-b-2 ${
              tab === 'register' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t('tabRegister')}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {tab === 'register' && (
            <div>
              <label className="block text-slate-400 mb-1">{t('fullNameLabel')}</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141822] border border-white/10 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1">{t('emailLabel')}</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141822] border border-white/10 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">{t('passwordLabel')}</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141822] border border-white/10 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {tab === 'register' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1">{t('phoneLabel')}</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 8..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141822] border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">{t('deliveryAddressLabel')}</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Kota, Alamat pengiriman..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141822] border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-2xl bg-[#0084ff] hover:bg-blue-600 font-bold text-white shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Memproses...' : tab === 'login' ? t('submitLogin') : t('submitRegister')}
          </button>
        </form>
      </div>
    </div>
  );
};
