import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Moon, Sun, Globe, LogOut, User as UserIcon, Cookie } from 'lucide-react';

const Navbar = ({ onOpenInspector }) => {
  const { user, isAuthenticated, logout, updatePreferences } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (isAuthenticated) {
      updatePreferences({ language: newLang });
    }
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme(nextTheme);
    if (isAuthenticated) {
      updatePreferences({ theme: nextTheme });
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Cookie className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Cookie & Session Auth
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                MongoDB Atlas
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Express-Session • Connect-Mongo • HttpOnly
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="relative flex items-center">
            <label htmlFor="language-select" className="sr-only">
              {t('language')}
            </label>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium">
              <Globe className="w-4 h-4 mr-1.5 text-indigo-500" />
              <select
                id="language-select"
                value={language}
                onChange={handleLanguageChange}
                aria-label={t('language')}
                className="bg-transparent border-none outline-none cursor-pointer pr-1 text-xs sm:text-sm font-medium"
              >
                <option value="uz" className="dark:bg-slate-800">O'zbek (UZ)</option>
                <option value="ru" className="dark:bg-slate-800">Русский (RU)</option>
                <option value="en" className="dark:bg-slate-800">English (EN)</option>
              </select>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={handleThemeToggle}
            type="button"
            title={theme === 'light' ? t('darkMode') : t('lightMode')}
            aria-label={theme === 'light' ? t('darkMode') : t('lightMode')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-200"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* User Profile / Logout */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                  ID: {user.id}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={logout}
                title={t('logout')}
                aria-label={t('logout')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/50 text-xs sm:text-sm font-semibold border border-rose-200 dark:border-rose-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('logout')}</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

