import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Standart til — O‘zbekcha (uz)
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('app_language') || 'uz';
  });

  const setLanguage = (lang) => {
    if (['uz', 'ru', 'en'].includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('app_language', lang);
    }
  };

  const t = (key) => {
    const langDict = translations[language] || translations.uz;
    return langDict[key] || translations.uz[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

