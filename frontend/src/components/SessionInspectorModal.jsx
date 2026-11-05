import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { X, RefreshCw, CheckCircle2, Shield, Lock, Terminal, Cpu } from 'lucide-react';

const SessionInspectorModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessionStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/auth/session-status');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSessionStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('inspectorTitle')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('inspectorDesc')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('close')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm font-medium">{t('checkingSession')}</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-sm">
              {error}
            </div>
          ) : data ? (
            <>
              {/* Status Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Holat</span>
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {data.session?.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Cookie Nomi</span>
                  <span className="text-xs font-mono font-bold text-indigo-500 mt-0.5 block truncate">
                    {data.session?.cookieName}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">HttpOnly</span>
                  <span className="text-xs font-bold text-emerald-500 mt-0.5 block">
                    {data.session?.cookieConfig?.httpOnly ? 'true (Himoyalangan)' : 'false'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">SameSite</span>
                  <span className="text-xs font-bold text-indigo-500 mt-0.5 block">
                    {data.session?.cookieConfig?.sameSite}
                  </span>
                </div>
              </div>

              {/* JSON Live Response */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-indigo-500" />
                    Express-Session Server Response (JSON):
                  </span>
                  <button
                    onClick={fetchSessionStatus}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Qayta so'rov yuborish
                  </button>
                </div>

                <div className="bg-slate-900 rounded-2xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner border border-slate-800">
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
              </div>

              {/* Security explainer note */}
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs text-slate-700 dark:text-indigo-200 leading-relaxed">
                <div className="font-bold text-indigo-900 dark:text-indigo-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Xavfsizlik Arxitekturasi tushuntirishi:
                </div>
                {t('cookieSecurityDesc')}
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors"
          >
            {t('close')}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SessionInspectorModal;

