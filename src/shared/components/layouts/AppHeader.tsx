import { useMatches } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sun, Moon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { useThemeStore } from '@/core/store/theme.store'
import { useLanguageStore, LOCALES } from '@/core/store/language.store'
import type { Locale } from '@/core/store/language.store'
import brFlag from '@/assets/img/geral/bra.png'
import usaFlag from '@/assets/img/geral/eua.png'
import esFlag from '@/assets/img/geral/esp.png'

type RouteHandle = { breadcrumb?: string }

const FLAG_LABEL: Record<Locale, { flag: string; label: string }> = {
  'pt-BR': { flag: brFlag, label: 'Português' },
  'en-US': { flag: usaFlag, label: 'English' },
  'es-ES': { flag: esFlag, label: 'Español' },
}

export function AppHeader() {
  const { t } = useTranslation()
  const matches = useMatches()
  const { theme, toggleTheme } = useThemeStore()
  const { currentLanguage, setLanguage } = useLanguageStore()

  const breadcrumbs = matches
    .filter((m) => (m.handle as RouteHandle)?.breadcrumb)
    .map((m) => ({
      path: m.pathname,
      label: t((m.handle as RouteHandle).breadcrumb!),
    }))

  const languages = LOCALES.map((code) => ({ code, ...FLAG_LABEL[code] }))

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 py-2 shadow-sm">
      {breadcrumbs.length > 0 ? (
        <nav className="flex items-center text-xl" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.path} className="flex items-center">
              {index > 0 && <span className="mx-2 font-bold text-foreground">/</span>}
              {index < breadcrumbs.length - 1 ? (
                <span className="text-muted-foreground font-medium">{crumb.label}</span>
              ) : (
                <span className="text-foreground font-bold">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-12">
        <button
          className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-3 mr-4 border-r border-border pr-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={[
                'transition-all hover:opacity-100 rounded-sm overflow-hidden',
                currentLanguage === lang.code
                  ? 'opacity-100 ring-2 ring-primary ring-offset-1'
                  : 'opacity-40 grayscale-[50%]',
              ].join(' ')}
              title={lang.label}
              onClick={() => setLanguage(lang.code)}
            >
              <img src={lang.flag} alt={lang.label} className="w-6 h-4 object-cover block" />
            </button>
          ))}
        </div>

        <Avatar className="w-9 h-9 border border-border cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src="https://github.com/shadcn.png" alt="Foto do usuário" />
          <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
            LS
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
