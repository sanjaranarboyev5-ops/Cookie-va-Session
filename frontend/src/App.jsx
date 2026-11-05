import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { RefreshCw, Cookie } from 'lucide-react';

const MainContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Cookie className="w-8 h-8 animate-bounce" />
          </div>
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400 absolute -bottom-1 -right-1" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white">
          Cookie & Session Auth
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Sessiya va xavfsizlik parametrlari tekshirilmoqda...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  if (authView === 'register') {
    return <Register onSwitchToLogin={() => setAuthView('login')} />;
  }

  return <Login onSwitchToRegister={() => setAuthView('register')} />;
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

