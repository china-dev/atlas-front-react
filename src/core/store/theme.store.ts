import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('app-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme: Theme) => {
  if (theme === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
};

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const useThemeStore = create<ThemeStore>(set => ({
  theme: initialTheme,
  setTheme: (theme) => {
    localStorage.setItem('app-theme', theme);
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () =>
    set(state => {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('app-theme', next);
      applyTheme(next);
      return { theme: next };
    })
}));
