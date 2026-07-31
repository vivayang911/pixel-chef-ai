import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { getTranslation, type Lang } from './translations'

/* ---------- detect browser language ---------- */
function detectLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem('pixel-chef-lang') as Lang | null
  if (stored === 'en' || stored === 'zh' || stored === 'ja') return stored
  const nav = navigator.language.toLowerCase()
  if (nav.startsWith('zh')) return 'zh'
  if (nav.startsWith('ja')) return 'ja'
  return 'en'
}

/* ---------- Context ---------- */
interface LanguageCtx {
  lang: Lang
  setLang: (l: Lang) => void
  cycleLang: () => void
  t: (path: string, params?: Record<string, unknown>) => string
}

const Ctx = createContext<LanguageCtx | null>(null)

/* ---------- Provider ---------- */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem('pixel-chef-lang', l)
    setLangState(l)
  }, [])

  const cycleLang = useCallback(() => {
    const order: Lang[] = ['en', 'zh', 'ja']
    const idx = order.indexOf(lang)
    setLang(order[(idx + 1) % order.length])
  }, [lang, setLang])

  const t = useCallback(
    (path: string, params?: Record<string, unknown>): string => {
      const raw = getTranslation(lang, path)
      if (typeof raw === 'function') {
        return (raw as (p: Record<string, unknown>) => string)(params ?? {})
      }
      if (typeof raw === 'string') return raw
      return path
    },
    [lang],
  )

  return (
    <Ctx.Provider value={{ lang, setLang, cycleLang, t }}>
      {children}
    </Ctx.Provider>
  )
}

/* ---------- Hook ---------- */
export function useLanguage() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

/** escape hatch for non-component code */
export { translations } from './translations'
export type { Lang }
