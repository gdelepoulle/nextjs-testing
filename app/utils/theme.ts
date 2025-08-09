import { ThemeMode } from '@/types/theme'

const THEME_STORAGE_KEY = 'theme-preference'

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined' || !('matchMedia' in window)) return 'light'
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined' || !('localStorage' in window)) return 'system'
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return (stored as ThemeMode) || 'system'
  } catch {
    return 'system'
  }
}

export function setStoredTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined' || !('localStorage' in window)) return
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Ignore storage errors
  }
}

export function getResolvedTheme(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemTheme()
  }
  return theme
}

export function applyTheme(theme: ThemeMode): void {
  const resolvedTheme = getResolvedTheme(theme)
  const root = document.documentElement
  
  // Remove existing theme classes
  root.classList.remove('light', 'dark')
  
  // Add new theme class
  root.classList.add(resolvedTheme)
  
  // Update CSS custom properties
  const colors = getThemeColors(resolvedTheme)
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })
}

export function getThemeColors(theme: 'light' | 'dark'): Record<string, string> {
  const lightColors = {
    background: '#ffffff',
    foreground: '#171717',
    primary: '#3b82f6',
    secondary: '#6b7280',
    accent: '#f59e0b',
    border: '#e5e7eb',
    muted: '#f3f4f6',
    card: '#ffffff',
    cardForeground: '#171717',
    popover: '#ffffff',
    popoverForeground: '#171717',
  }
  
  const darkColors = {
    background: '#0a0a0a',
    foreground: '#ededed',
    primary: '#60a5fa',
    secondary: '#9ca3af',
    accent: '#fbbf24',
    border: '#374151',
    muted: '#1f2937',
    card: '#111827',
    cardForeground: '#f9fafb',
    popover: '#111827',
    popoverForeground: '#f9fafb',
  }
  
  return theme === 'dark' ? darkColors : lightColors
}

export function setupThemeListener(callback: (theme: 'light' | 'dark') => void): () => void {
  if (typeof window === 'undefined') return () => {}
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light')
  }
  
  mediaQuery.addEventListener('change', handleChange)
  
  return () => {
    mediaQuery.removeEventListener('change', handleChange)
  }
} 