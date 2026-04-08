import { create } from 'zustand'
import i18n from '@/core/i18n'

export type Locale = 'pt-BR' | 'en-US' | 'es-ES'

export const LOCALES = ['pt-BR', 'en-US', 'es-ES'] as const satisfies readonly Locale[]

interface LanguageStore {
  currentLanguage: Locale
  setLanguage: (lang: Locale) => void
}

const stored = localStorage.getItem('app-language')
const validLocale: Locale = (LOCALES as readonly string[]).includes(stored ?? '')
  ? (stored as Locale)
  : 'pt-BR'

export const useLanguageStore = create<LanguageStore>((set) => ({
  currentLanguage: validLocale,
  setLanguage: (lang) => {
    localStorage.setItem('app-language', lang)
    i18n.changeLanguage(lang)
    set({ currentLanguage: lang })
  },
}))
