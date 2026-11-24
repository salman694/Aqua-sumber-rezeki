import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aquazone_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('aquazone_token');
      if (storedToken) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      } else {
        // Automatically login as Jon Karter by default so user immediately experiences the app exactly like the screenshot!
        try {
          const res = await api.login('jon@karter.com', 'user123');
          localStorage.setItem('aquazone_token', res.token);
          setToken(res.token);
          setUser(res.user);
        } catch (e) {
          console.warn('Auto-login fallback skipped:', e);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    localStorage.setItem('aquazone_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    localStorage.setItem('aquazone_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('aquazone_token');
    setToken('');
    setUser(null);
  };

  const quickLogin = async (role) => {
    if (role === 'admin') {
      return await login('admin@aquazone.com', 'admin123');
    } else {
      return await login('jon@karter.com', 'user123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        quickLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
