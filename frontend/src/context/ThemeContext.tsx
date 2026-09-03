import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Theme = 'dark' | 'light' | 'blue' | 'purple'

interface ThemeCtx {
  theme: Theme
  setTheme: (t: Theme) => void
}

const Ctx = createContext<ThemeCtx>({ theme: 'dark', setTheme: () => {} })

export const useTheme = () => useContext(Ctx)

// ── CSS variable maps ─────────────────────────────────────────────────────────
const THEMES: Record<Theme, Record<string, string>> = {
  dark: {
    '--bg':          '#080808',
    '--bg-2':        '#111111',
    '--bg-3':        '#1a1a1a',
    '--border':      'rgba(255,255,255,0.07)',
    '--surface':     'rgba(255,255,255,0.04)',
    '--surface-hover':'rgba(255,255,255,0.07)',
    '--text':        '#e8e8e8',
    '--text-2':      '#a1a1aa',
    '--text-3':      '#52525b',
    '--accent':      '#7c3aed',
    '--accent-light':'#a78bfa',
    '--accent-hover':'#6d28d9',
    '--accent-bg':   'rgba(124,58,237,0.12)',
    '--glow':        'rgba(124,58,237,0.25)',
    '--grid-line':   'rgba(255,255,255,0.025)',
    '--devhamz-stroke':'rgba(139,92,246,0.10)',
    '--sidebar-bg':  'rgba(8,8,8,0.95)',
  },
  light: {
    '--bg':          '#f4f4f5',
    '--bg-2':        '#ffffff',
    '--bg-3':        '#e4e4e7',
    '--border':      'rgba(0,0,0,0.08)',
    '--surface':     'rgba(0,0,0,0.04)',
    '--surface-hover':'rgba(0,0,0,0.07)',
    '--text':        '#18181b',
    '--text-2':      '#52525b',
    '--text-3':      '#a1a1aa',
    '--accent':      '#7c3aed',
    '--accent-light':'#6d28d9',
    '--accent-hover':'#5b21b6',
    '--accent-bg':   'rgba(124,58,237,0.08)',
    '--glow':        'rgba(124,58,237,0.15)',
    '--grid-line':   'rgba(0,0,0,0.04)',
    '--devhamz-stroke':'rgba(124,58,237,0.07)',
    '--sidebar-bg':  'rgba(244,244,245,0.97)',
  },
  blue: {
    '--bg':          '#050d1a',
    '--bg-2':        '#0a1628',
    '--bg-3':        '#0f1f38',
    '--border':      'rgba(56,189,248,0.12)',
    '--surface':     'rgba(56,189,248,0.04)',
    '--surface-hover':'rgba(56,189,248,0.08)',
    '--text':        '#e0f2fe',
    '--text-2':      '#7dd3fc',
    '--text-3':      '#38bdf8',
    '--accent':      '#0ea5e9',
    '--accent-light':'#38bdf8',
    '--accent-hover':'#0284c7',
    '--accent-bg':   'rgba(14,165,233,0.15)',
    '--glow':        'rgba(14,165,233,0.30)',
    '--grid-line':   'rgba(56,189,248,0.04)',
    '--devhamz-stroke':'rgba(56,189,248,0.10)',
    '--sidebar-bg':  'rgba(5,13,26,0.97)',
  },
  purple: {
    '--bg':          '#0a050f',
    '--bg-2':        '#13082a',
    '--bg-3':        '#1e0f3d',
    '--border':      'rgba(167,139,250,0.14)',
    '--surface':     'rgba(167,139,250,0.05)',
    '--surface-hover':'rgba(167,139,250,0.09)',
    '--text':        '#ede9fe',
    '--text-2':      '#c4b5fd',
    '--text-3':      '#a78bfa',
    '--accent':      '#8b5cf6',
    '--accent-light':'#a78bfa',
    '--accent-hover':'#7c3aed',
    '--accent-bg':   'rgba(139,92,246,0.18)',
    '--glow':        'rgba(139,92,246,0.35)',
    '--grid-line':   'rgba(167,139,250,0.04)',
    '--devhamz-stroke':'rgba(167,139,250,0.13)',
    '--sidebar-bg':  'rgba(10,5,15,0.97)',
  },
}

function applyTheme(t: Theme) {
  const root = document.documentElement
  Object.entries(THEMES[t]).forEach(([k, v]) => root.style.setProperty(k, v))
  root.setAttribute('data-theme', t)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const saved = (localStorage.getItem('genzpt-theme') ?? 'dark') as Theme
  const [theme, setThemeState] = useState<Theme>(saved)

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('genzpt-theme', t)
    applyTheme(t)
  }

  useEffect(() => { applyTheme(theme) }, [theme])

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>
}
