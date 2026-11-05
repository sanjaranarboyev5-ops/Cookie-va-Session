import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { setTheme } = useTheme();
  const { setLanguage } = useLanguage();

  // Foydalanuvchi sozlamalarini kontekstga tatbiq etish
  const applyUserSettings = useCallback((userData) => {
    if (!userData) return;
    if (userData.theme) {
      setTheme(userData.theme);
    }
    if (userData.language) {
      setLanguage(userData.language);
    }
  }, [setTheme, setLanguage]);

  // Avtorizatsiya holatini tekshirish
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.isAuthenticated) {
        setUser(res.data.user);
        setSessionInfo(res.data.session);
        setIsAuthenticated(true);
        applyUserSettings(res.data.user);
      } else {
        setUser(null);
        setSessionInfo(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setUser(null);
      setSessionInfo(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [applyUserSettings]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = async (name, password) => {
    try {
      const res = await api.post('/auth/login', { name, password });
      if (res.data.success) {
        setUser(res.data.user);
        setSessionInfo(res.data.session);
        setIsAuthenticated(true);
        applyUserSettings(res.data.user);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Login xatosi' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Tizimga kirishda xatolik';
      return { success: false, message: msg };
    }
  };

  // Register
  const register = async (name, password, preferredLang = 'uz', preferredTheme = 'light') => {
    try {
      const res = await api.post('/auth/register', {
        name,
        password,
        language: preferredLang,
        theme: preferredTheme,
      });
      if (res.data.success) {
        setUser(res.data.user);
        setSessionInfo(res.data.session);
        setIsAuthenticated(true);
        applyUserSettings(res.data.user);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Ro\'yxatdan o\'tish xatosi' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Ro\'yxatdan o\'tishda xatolik';
      return { success: false, message: msg };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API ogohlantirish:', err.message);
    } finally {
      setUser(null);
      setSessionInfo(null);
      setIsAuthenticated(false);
    }
  };

  // Til yoki Rangni saqlash (Har bir akkaunt uchun MongoDB'da saqlanadi)
  const updatePreferences = async (newPreferences) => {
    try {
      const res = await api.put('/user/preferences', newPreferences);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        applyUserSettings(res.data.user);
        return { success: true };
      }
    } catch (err) {
      console.error('Sozlamalarni saqlashda xatolik:', err);
    }
    return { success: false };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionInfo,
        isAuthenticated,
        isLoading,
        checkAuth,
        login,
        register,
        logout,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

