import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Key, Lock, Clock, Cookie as CookieIcon, CheckCircle2, RefreshCw, Cpu, Database } from 'lucide-react';

const SessionCard = ({ onOpenInspector }) => {
  const { user, sessionInfo, logout } = useAuth();
  const { t } = useLanguage();

  // Session muddati uchun jonli hisoblagich (countdown timer)
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!sessionInfo?.expires) {
      setTimeLeft('23:59:59');
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const expireTime = new Date(sessionInfo.expires).getTime();
      const diff = expireTime - now;

      if (diff <= 0) {
        setTimeLeft('Tugagan (Expired)');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [sessionInfo?.expires]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 shadow-2xl border border-indigo-800/40">
      
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-indigo-800/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" />
            Cookie & Session Auth
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {t('dashboardTitle')}
          </h2>
          <p className="text-sm text-indigo-200/80 mt-1">
            {t('dashboardSubtitle')}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenInspector}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t('checkSessionBtn')}</span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/80 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all"
          >
            {t('logout')}
          </button>
        </div>
      </div>

      {/* Grid of Key Info Parameters (Foydalanuvchi ismi, ID, Autentifikatsiya, Session ID, Cookie nomi, HttpOnly, SameSite, Muddati) */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        
        {/* 1. Foydalanuvchi Ismi & ID */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-medium mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('userName')} & {t('userId')}</span>
          </div>
          <div className="text-lg font-bold text-white truncate">
            {user?.name || '---'}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-mono text-indigo-300/80">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">ID:</span>
            <span className="truncate" title={user?.id}>{user?.id || '---'}</span>
          </div>
        </div>

        {/* 2. Authentication Holati */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-medium mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t('authStatus')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-base font-bold text-emerald-400">
              {t('authenticated')}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 mt-1">
            MongoDB Atlas orqali tasdiqlangan
          </div>
        </div>

        {/* 3. Session ID va Holati */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-medium mb-1">
            <Key className="w-4 h-4 text-amber-400" />
            <span>{t('sessionId')} & {t('sessionStatus')}</span>
          </div>
          <div className="text-sm font-mono font-bold text-amber-300 truncate" title={sessionInfo?.id}>
            {sessionInfo?.id || 'Yuklanmoqda...'}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs text-indigo-200">
              {t('sessionActive')}
            </span>
          </div>
        </div>

        {/* 4. Cookie Nomi, HttpOnly, SameSite, Muddati */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-medium mb-1">
            <CookieIcon className="w-4 h-4 text-indigo-400" />
            <span>{t('cookieName')} & Xavfsizlik</span>
          </div>
          <div className="text-sm font-mono font-bold text-white flex items-center justify-between">
            <span className="text-indigo-300">{sessionInfo?.cookieName || 'connect.sid'}</span>
            <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Lax
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
            <span className="inline-flex items-center gap-1 text-[11px]">
              <span className="text-emerald-400 font-bold">HttpOnly:</span> true
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-300">
              <Clock className="w-3 h-3" />
              {timeLeft}
            </span>
          </div>
        </div>

      </div>

      {/* Security Architecture Tags */}
      <div className="relative z-10 mt-6 pt-4 border-t border-indigo-900/60 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Himoya qatlamlari:</span>
        <span className="px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-800 text-indigo-200">
          🍪 Cookie: connect.sid
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-800 text-indigo-200">
          🛡️ HttpOnly (XSS Himoyasi)
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-800 text-indigo-200">
          🔒 SameSite: Lax (CSRF Himoyasi)
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-800 text-indigo-200">
          💾 MongoDB sessions collection
        </span>
      </div>

    </div>
  );
};

export default SessionCard;

