import React from 'react';
import { X, LogOut, Shield, ShoppingBag, UserCheck, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const ProfileDrawer = ({
  isOpen,
  onClose,
  onOpenAdmin,
  onOpenOrders,
  onOpenAuth
}) => {
  const { user, isAdmin, isLoggedIn, logout, quickLogin } = useAuth();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end bg-black/75 backdrop-blur-sm animate-fade-in text-white p-3 sm:p-0">
      <div className="w-full max-w-sm h-full sm:h-auto max-h-[95vh] bg-[#0d1119] border border-white/10 rounded-3xl sm:rounded-l-3xl p-6 shadow-2xl flex flex-col justify-between">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('profileTitle')}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* User Info Card */}
          <div className="pt-5 pb-4 flex items-center space-x-3.5">
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-800 border-2 border-blue-500/40 shrink-0">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base truncate">{user?.name || 'Jon Karter'}</h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isAdmin ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'
                }`}>
                  {isAdmin ? 'ADMIN' : 'USER'}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'jon@karter.com'}</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.address || 'Denpasar, Bali'}</p>
            </div>
          </div>

          {/* Quick Role Switcher */}
          <div className="mt-2 p-3 rounded-2xl bg-[#141824] border border-white/5 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              {t('quickSwitchRole')}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={async () => {
                  await quickLogin('user');
                  onClose();
                }}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  !isAdmin
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <UserCheck size={14} />
                <span>Jon Karter</span>
              </button>
              <button
                onClick={async () => {
                  await quickLogin('admin');
                  onClose();
                }}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  isAdmin
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Shield size={14} />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-5 space-y-2 text-xs font-medium">
            {isAdmin && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="w-full p-3 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Shield size={16} />
                  <span>{t('openAdminDashboard')}</span>
                </div>
                <ExternalLink size={14} />
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenOrders();
              }}
              className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <ShoppingBag size={16} />
                <span>{t('openOrderHistory')}</span>
              </div>
              <ExternalLink size={14} />
            </button>

            {!isLoggedIn && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full p-3 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <span>{t('loginRegisterBtn')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer / Logout */}
        <div className="pt-4 border-t border-white/10">
          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>{t('logoutBtn')}</span>
            </button>
          ) : (
            <div className="text-center text-xs text-slate-500">
              AquaZone v1.0 • Exotic Aquatics
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
