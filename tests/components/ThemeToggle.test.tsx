import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '@/components/ThemeToggle'
import { ThemeProvider } from '@/context/ThemeContext'
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

// Wrapper component for testing
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

describe('ThemeToggle', () => {
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

  describe('Rendering', () => {
    it('should render theme toggle button', async () => {
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
      })
    })

    it('should show current theme label', async () => {
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('System')).toBeInTheDocument()
      })
    })

    it('should show theme icon', async () => {
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /toggle theme/i })
        expect(button.querySelector('svg')).toBeInTheDocument()
      })
    })

    it('should have proper ARIA attributes', async () => {
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /toggle theme/i })
        expect(button).toHaveAttribute('aria-expanded', 'false')
        expect(button).toHaveAttribute('aria-haspopup', 'true')
      })
    })
  })

  describe('Dropdown functionality', () => {
    it('should open dropdown when clicked', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(button)

      expect(screen.getByText('Light')).toBeInTheDocument()
      expect(screen.getByText('Dark')).toBeInTheDocument()
      expect(screen.getByText('System')).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('should close dropdown when clicking outside', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <div data-testid="outside">Outside</div>
          <ThemeToggle />
        </div>,
        { wrapper: TestWrapper }
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(button)

      expect(screen.getByText('Light')).toBeInTheDocument()

      await user.click(screen.getByTestId('outside'))

      expect(screen.queryByText('Light')).not.toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('should close dropdown when pressing Escape key', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(button)

      expect(screen.getByText('Light')).toBeInTheDocument()

      await user.keyboard('{Escape}')

      expect(screen.queryByText('Light')).not.toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('should toggle dropdown when button is clicked twice', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /toggle theme/i })
      
      // First click - open
      await user.click(button)
      expect(screen.getByText('Light')).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'true')

      // Second click - close
      await user.click(button)
      expect(screen.queryByText('Light')).not.toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Theme selection', () => {
    it('should change theme to light when light option is clicked', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(button)

      const lightOption = screen.getByRole('menuitem', { name: /light/i })
      await user.click(lightOption)

      expect(screen.queryByText('Light')).not.toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('should change theme to dark when dark option is clicked', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(button)

      const darkOption = screen.getByRole('menuitem', { name: /dark/i })
      await user.click(darkOption)

      expect(screen.queryByText('Dark')).not.toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('should change theme to system when system option is clicked', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(button)

      const systemOption = screen.getByRole('menuitem', { name: /system/i })
      await user.click(systemOption)

      expect(screen.queryByText('System')).not.toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Keyboard navigation', () => {
    it('should select theme when pressing Enter on option', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(button)

      const lightOption = screen.getByRole('menuitem', { name: /light/i })
      fireEvent.keyDown(lightOption, { key: 'Enter' })

      expect(screen.queryByText('Light')).not.toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('should select theme when pressing Space on option', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(button)

      const darkOption = screen.getByRole('menuitem', { name: /dark/i })
      fireEvent.keyDown(darkOption, { key: ' ' })

      expect(screen.queryByText('Dark')).not.toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Visual states', () => {
    it('should show checkmark for selected theme', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(button)

      const systemOption = screen.getByRole('menuitem', { name: /system/i })
      expect(systemOption.querySelector('svg')).toBeInTheDocument()
    })

    it('should rotate chevron when dropdown is open', async () => {
      const user = userEvent.setup()
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /toggle theme/i })
      const chevron = button.querySelector('svg:last-child')
      
      expect(chevron).not.toHaveClass('rotate-180')

      await user.click(button)

      expect(chevron).toHaveClass('rotate-180')
    })
  })

  describe('Responsive design', () => {
    it('should hide theme label on small screens', async () => {
      render(<ThemeToggle />, { wrapper: TestWrapper })

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /toggle theme/i })
        const label = button.querySelector('.hidden.sm\\:inline')
        expect(label).toHaveClass('hidden', 'sm:inline')
      })
    })
  })
}) 