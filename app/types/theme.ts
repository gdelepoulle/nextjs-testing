export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeColors {
  background: string
  foreground: string
  primary: string
  secondary: string
  accent: string
  border: string
  muted: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
}

export interface ThemeConfig {
  name: ThemeMode
  colors: ThemeColors
}

export interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  resolvedTheme: 'light' | 'dark'
  systemTheme: 'light' | 'dark'
} 