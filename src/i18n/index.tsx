import React, { ReactNode, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import enTranslation from '../locales/en/translation.json';
import urTranslation from '../locales/roman-urdu/translation.json';
import type { Language } from './types';

// Direct translation maps — bypass i18next's broken language resolution
// i18next v26 has issues with hyphenated language codes like 'roman-urdu'
// (it treats 'roman' as the base language and 'urdu' as a region, causing fallback to 'en')
const EN_MAP = enTranslation as Record<string, string>;
const UR_MAP = urTranslation as Record<string, string>;

// Minimal i18next init for backward compatibility (settings panel etc.)
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: EN_MAP },
    'roman-urdu': { translation: UR_MAP }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false, prefix: '{', suffix: '}' }
});

// Context for language state
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
}

const LanguageContext = React.createContext<LanguageContextType>({
  language: 'roman-urdu',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'roman-urdu';
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
    // Also update i18next language for any code that uses i18n.t() directly
    i18n.changeLanguage(lang);
  };

  const t = (key: string, options?: Record<string, string | number>): string => {
    // Direct lookup: use roman-urdu map if language is roman-urdu
    const map = language === 'roman-urdu' ? UR_MAP : EN_MAP;
    let text = map[key];
    
    // Fallback to English if not found in roman-urdu
    if (!text && language === 'roman-urdu') {
      text = EN_MAP[key];
    }
    
    // Return key as last resort
    if (!text) text = key;
    
    // Handle interpolation {variable}
    if (options && text) {
      Object.entries(options).forEach(([k, v]) => {
        text = (text as string).replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    
    return text || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </LanguageContext.Provider>
  );
}

export function useTranslate() {
  return React.useContext(LanguageContext);
}

