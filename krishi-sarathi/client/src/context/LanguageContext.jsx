import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../translations/en.js';
import hi from '../translations/hi.js';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('ks_language') || 'hi'; // default to Hindi for farmer portal
  });

  useEffect(() => {
    localStorage.setItem('ks_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'hi' ? 'en' : 'hi'));
  };

  const t = language === 'hi' ? hi : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export default LanguageContext;
