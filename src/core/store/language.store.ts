import { create } from 'zustand';
import i18n from '@/core/i18n';

type Locale = 'pt-BR' | 'en-US' | 'es-ES';

interface LanguageStore {
  currentLanguage: Locale;
  setLanguage: (lang: Locale) => void;
}

export const useLanguageStore = create<LanguageStore>(set => ({
  currentLanguage: (localStorage.getItem('app-language') as Locale) || 'pt-BR',
  setLanguage: (lang) => {
    localStorage.setItem('app-language', lang);
    i18n.changeLanguage(lang);
    set({ currentLanguage: lang });
  }
}));
