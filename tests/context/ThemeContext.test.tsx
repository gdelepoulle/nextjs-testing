import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/context/ThemeContext'
import * as themeUtils from '@/utils/theme'

// Mock theme utilities
jest.mock('@/utils/theme', () => ({
  getSystemTheme: jest.fn(),
  getStoredTheme: jest.fn(),
  setStoredTheme: jest.fn(),
  getResolvedTheme: jest.fn(),
  applyTheme: jest.fn(),
  setupThemeListener: jest.fn(),
}))

const mockThemeUtils = themeUtils as jest.Mocked<typeof themeUtils>

// Test component to access theme context
function TestComponent() {
  const theme = useTheme()
  return (
    <div>
      <div data-testid="theme">{theme.theme}</div>
      <div data-testid="resolved-theme">{theme.resolvedTheme}</div>
      <div data-testid="system-theme">{theme.systemTheme}</div>
      <button onClick={() => theme.setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => theme.setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => theme.setTheme('system')} data-testid="set-system">
        Set System
      </button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mocks
    mockThemeUtils.getSystemTheme.mockReturnValue('light')
    mockThemeUtils.getStoredTheme.mockReturnValue('system')
    mockThemeUtils.getResolvedTheme.mockImplementation((theme) => {
      if (theme === 'system') return 'light'
      return theme
    })
    mockThemeUtils.setupThemeListener.mockReturnValue(() => {})
  })

  describe('ThemeProvider', () => {
    it('should render children when mounted', async () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Test Child</div>
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('child')).toBeInTheDocument()
      })
    })

    it('should initialize with stored theme', async () => {
      mockThemeUtils.getStoredTheme.mockReturnValue('dark')
      mockThemeUtils.getResolvedTheme.mockReturnValue('dark')

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('dark')
      })
    })

    it('should initialize with system theme when no stored theme', async () => {
      mockThemeUtils.getStoredTheme.mockReturnValue('system')
      mockThemeUtils.getSystemTheme.mockReturnValue('dark')
      mockThemeUtils.getResolvedTheme.mockReturnValue('dark')

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('system')
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
      })
    })

    it('should apply theme on mount', async () => {
      mockThemeUtils.getStoredTheme.mockReturnValue('light')

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(mockThemeUtils.applyTheme).toHaveBeenCalledWith('light')
      })
    })

    it('should set up theme listener on mount', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(mockThemeUtils.setupThemeListener).toHaveBeenCalled()
      })
    })

    it('should hide content until mounted to prevent hydration mismatch', () => {
      const { container } = render(
        <ThemeProvider>
          <div data-testid="child">Test Child</div>
        </ThemeProvider>
      )

      // Should be hidden initially
      expect(container.firstChild).toHaveStyle({ visibility: 'hidden' })
    })
  })

  describe('useTheme hook', () => {
    it('should provide theme state and actions', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toBeInTheDocument()
        expect(screen.getByTestId('resolved-theme')).toBeInTheDocument()
        expect(screen.getByTestId('system-theme')).toBeInTheDocument()
      })
    })

    it('should throw error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestComponent />)
      }).toThrow('useTheme must be used within a ThemeProvider')

      consoleSpy.mockRestore()
    })

    it('should update theme when setTheme is called', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('system')
      })

      act(() => {
        screen.getByTestId('set-dark').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('dark')
        expect(mockThemeUtils.applyTheme).toHaveBeenCalledWith('dark')
        expect(mockThemeUtils.setStoredTheme).toHaveBeenCalledWith('dark')
      })
    })

    it('should update theme to light when setTheme is called', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('system')
      })

      act(() => {
        screen.getByTestId('set-light').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('light')
        expect(mockThemeUtils.applyTheme).toHaveBeenCalledWith('light')
        expect(mockThemeUtils.setStoredTheme).toHaveBeenCalledWith('light')
      })
    })

    it('should update theme to system when setTheme is called', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('system')
      })

      act(() => {
        screen.getByTestId('set-system').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('system')
        expect(mockThemeUtils.applyTheme).toHaveBeenCalledWith('system')
        expect(mockThemeUtils.setStoredTheme).toHaveBeenCalledWith('system')
      })
    })
  })

  describe('System theme changes', () => {
    it('should update system theme when system preference changes', async () => {
      let themeChangeCallback: ((theme: 'light' | 'dark') => void) | null = null
      
      mockThemeUtils.setupThemeListener.mockImplementation((callback) => {
        themeChangeCallback = callback
        return () => {}
      })

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('system-theme')).toHaveTextContent('light')
      })

      // Simulate system theme change
      act(() => {
        if (themeChangeCallback) {
          themeChangeCallback('dark')
        }
      })

      await waitFor(() => {
        expect(screen.getByTestId('system-theme')).toHaveTextContent('dark')
      })
    })

    it('should apply system theme when current theme is system', async () => {
      let themeChangeCallback: ((theme: 'light' | 'dark') => void) | null = null
      
      mockThemeUtils.setupThemeListener.mockImplementation((callback) => {
        themeChangeCallback = callback
        return () => {}
      })

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('system')
      })

      // Simulate system theme change
      act(() => {
        if (themeChangeCallback) {
          themeChangeCallback('dark')
        }
      })

      await waitFor(() => {
        expect(mockThemeUtils.applyTheme).toHaveBeenCalledWith('system')
      })
    })
  })
}) 