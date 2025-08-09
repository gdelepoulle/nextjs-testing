'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeContextType, ThemeMode } from '../types/theme'
import {
  getSystemTheme,
  getStoredTheme,
  setStoredTheme,
  getResolvedTheme,
  applyTheme,
  setupThemeListener,
} from '../utils/theme'

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'light',
  systemTheme: 'light',
})

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>('system')
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    const storedTheme = getStoredTheme()
    const currentSystemTheme = getSystemTheme()
    
    setThemeState(storedTheme)
    setSystemTheme(currentSystemTheme)
    setMounted(true)
    
    // Apply initial theme
    applyTheme(storedTheme)
  }, [])

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return
    
    const cleanup = setupThemeListener((newSystemTheme) => {
      setSystemTheme(newSystemTheme)
      if (theme === 'system') {
        applyTheme('system')
      }
    })
    
    return cleanup
  }, [theme, mounted])

  // Apply theme when it changes
  useEffect(() => {
    if (!mounted) return
    
    applyTheme(theme)
    setStoredTheme(theme)
  }, [theme, mounted])

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
  }

  const resolvedTheme = getResolvedTheme(theme)

  const value: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 