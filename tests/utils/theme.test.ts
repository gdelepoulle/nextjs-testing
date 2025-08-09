import {
  getSystemTheme,
  getStoredTheme,
  setStoredTheme,
  getResolvedTheme,
  applyTheme,
  getThemeColors,
  setupThemeListener,
} from '@/utils/theme'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock matchMedia
const matchMediaMock = jest.fn()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
})

// Mock document.documentElement
const documentElementMock = {
  classList: {
    remove: jest.fn(),
    add: jest.fn(),
  },
  style: {
    setProperty: jest.fn(),
  },
}
Object.defineProperty(document, 'documentElement', {
  value: documentElementMock,
})

describe('Theme Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
  })

  describe('getSystemTheme', () => {
    it('should return light theme when system prefers light', () => {
      matchMediaMock.mockReturnValue({
        matches: false,
      })

      expect(getSystemTheme()).toBe('light')
    })

    it('should return dark theme when system prefers dark', () => {
      matchMediaMock.mockReturnValue({
        matches: true,
      })

      expect(getSystemTheme()).toBe('dark')
    })

    it('should return light theme when window is undefined', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      expect(getSystemTheme()).toBe('light')

      global.window = originalWindow
    })
  })

  describe('getStoredTheme', () => {
    it('should return stored theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark')

      expect(getStoredTheme()).toBe('dark')
    })

    it('should return system when no theme is stored', () => {
      localStorageMock.getItem.mockReturnValue(null)

      expect(getStoredTheme()).toBe('system')
    })

    it('should return system when localStorage throws error', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      expect(getStoredTheme()).toBe('system')
    })

    it('should return system when window is undefined', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      expect(getStoredTheme()).toBe('system')

      global.window = originalWindow
    })
  })

  describe('setStoredTheme', () => {
    it('should store theme in localStorage', () => {
      setStoredTheme('dark')

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'dark')
    })

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      expect(() => setStoredTheme('dark')).not.toThrow()
    })

    it('should not throw when window is undefined', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      expect(() => setStoredTheme('dark')).not.toThrow()

      global.window = originalWindow
    })
  })

  describe('getResolvedTheme', () => {
    it('should return light theme when theme is light', () => {
      expect(getResolvedTheme('light')).toBe('light')
    })

    it('should return dark theme when theme is dark', () => {
      expect(getResolvedTheme('dark')).toBe('dark')
    })

    it('should return system theme when theme is system', () => {
      matchMediaMock.mockReturnValue({
        matches: true,
      })

      expect(getResolvedTheme('system')).toBe('dark')
    })
  })

  describe('applyTheme', () => {
    it('should apply light theme classes and styles', () => {
      applyTheme('light')

      expect(documentElementMock.classList.remove).toHaveBeenCalledWith('light', 'dark')
      expect(documentElementMock.classList.add).toHaveBeenCalledWith('light')
      expect(documentElementMock.style.setProperty).toHaveBeenCalledWith('--color-background', '#ffffff')
      expect(documentElementMock.style.setProperty).toHaveBeenCalledWith('--color-foreground', '#171717')
    })

    it('should apply dark theme classes and styles', () => {
      applyTheme('dark')

      expect(documentElementMock.classList.remove).toHaveBeenCalledWith('light', 'dark')
      expect(documentElementMock.classList.add).toHaveBeenCalledWith('dark')
      expect(documentElementMock.style.setProperty).toHaveBeenCalledWith('--color-background', '#0a0a0a')
      expect(documentElementMock.style.setProperty).toHaveBeenCalledWith('--color-foreground', '#ededed')
    })

    it('should apply system theme correctly', () => {
      matchMediaMock.mockReturnValue({
        matches: true,
      })

      applyTheme('system')

      expect(documentElementMock.classList.add).toHaveBeenCalledWith('dark')
    })
  })

  describe('getThemeColors', () => {
    it('should return light theme colors', () => {
      const colors = getThemeColors('light')

      expect(colors.background).toBe('#ffffff')
      expect(colors.foreground).toBe('#171717')
      expect(colors.primary).toBe('#3b82f6')
    })

    it('should return dark theme colors', () => {
      const colors = getThemeColors('dark')

      expect(colors.background).toBe('#0a0a0a')
      expect(colors.foreground).toBe('#ededed')
      expect(colors.primary).toBe('#60a5fa')
    })
  })

  describe('setupThemeListener', () => {
    it('should set up theme listener and return cleanup function', () => {
      const mockAddEventListener = jest.fn()
      const mockRemoveEventListener = jest.fn()
      
      matchMediaMock.mockReturnValue({
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      })

      const callback = jest.fn()
      const cleanup = setupThemeListener(callback)

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))
      expect(typeof cleanup).toBe('function')

      cleanup()
      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })

    it('should return no-op function when window is undefined', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      const callback = jest.fn()
      const cleanup = setupThemeListener(callback)

      expect(typeof cleanup).toBe('function')
      expect(() => cleanup()).not.toThrow()

      global.window = originalWindow
    })

    it('should call callback when theme changes', () => {
      const mockAddEventListener = jest.fn()
      const mockRemoveEventListener = jest.fn()
      
      matchMediaMock.mockReturnValue({
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      })

      const callback = jest.fn()
      setupThemeListener(callback)

      // Simulate theme change
      const changeHandler = mockAddEventListener.mock.calls[0][1]
      changeHandler({ matches: true })

      expect(callback).toHaveBeenCalledWith('dark')
    })
  })
}) 