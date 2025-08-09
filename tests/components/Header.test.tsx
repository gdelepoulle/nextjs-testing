import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import Header from '@/components/Header'
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

describe('Header', () => {
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
    it('should render header with logo', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Cools stuff to look at')).toBeInTheDocument()
      })
    })

    it('should render navigation links', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('Blog')).toBeInTheDocument()
        expect(screen.getByText('About')).toBeInTheDocument()
        expect(screen.getByText('Gallery')).toBeInTheDocument()
      })
    })

    it('should render theme toggle', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
      })
    })

    it('should have proper navigation structure', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        const nav = screen.getByRole('navigation')
        expect(nav).toBeInTheDocument()
        expect(nav).toHaveClass('hidden', 'md:flex')
      })
    })
  })

  describe('Navigation links', () => {
    it('should have correct href attributes', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        const homeLink = screen.getByText('Home').closest('a')
        const blogLink = screen.getByText('Blog').closest('a')
        const aboutLink = screen.getByText('About').closest('a')
        const galleryLink = screen.getByText('Gallery').closest('a')

        expect(homeLink).toHaveAttribute('href', '/')
        expect(blogLink).toHaveAttribute('href', '/blog')
        expect(aboutLink).toHaveAttribute('href', '/about')
        expect(galleryLink).toHaveAttribute('href', '/gallery')
      })
    })

    it('should have proper styling classes', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        const links = screen.getAllByRole('link')
        links.forEach(link => {
          if (link.textContent !== 'Cools stuff to look at') {
            expect(link).toHaveClass(
              'text-gray-700',
              'hover:text-gray-900',
              'dark:text-gray-300',
              'dark:hover:text-white',
              'px-3',
              'py-2',
              'rounded-md',
              'text-sm',
              'font-medium',
              'transition-colors'
            )
          }
        })
      })
    })
  })

  describe('Logo and branding', () => {
    it('should have logo link to home page', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        const logoLink = screen.getByText('Cools stuff to look at').closest('a')
        expect(logoLink).toHaveAttribute('href', '/')
      })
    })

    it('should have proper logo styling', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        const logo = screen.getByText('Cools stuff to look at')
        expect(logo).toHaveClass('text-xl', 'font-bold', 'text-gray-900', 'dark:text-white')
      })
    })
  })

  describe('Layout and structure', () => {
    it('should have proper header structure', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        const header = screen.getByRole('banner')
        expect(header).toHaveClass(
          'bg-white',
          'shadow-sm',
          'border-b',
          'border-gray-200',
          'dark:bg-gray-900',
          'dark:border-gray-700'
        )
      })
    })

    it('should have responsive container', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        const container = document.querySelector('.max-w-7xl.mx-auto')
        expect(container).toBeInTheDocument()
        expect(container).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')
      })
    })

    it('should have proper flex layout', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        const flexContainer = document.querySelector('.flex.justify-between.items-center.h-16')
        expect(flexContainer).toBeInTheDocument()
      })
    })
  })

  describe('Theme integration', () => {
    it('should render theme toggle in header', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        const themeToggle = screen.getByRole('button', { name: /toggle theme/i })
        expect(themeToggle).toBeInTheDocument()
        
        // Check if it's positioned correctly in the header
        const header = screen.getByRole('banner')
        expect(header).toContainElement(themeToggle)
      })
    })

    it('should have theme toggle positioned on the right side', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        const rightSideContainer = document.querySelector('.flex.items-center.space-x-4')
        expect(rightSideContainer).toBeInTheDocument()
        
        const themeToggle = screen.getByRole('button', { name: /toggle theme/i })
        expect(rightSideContainer).toContainElement(themeToggle)
      })
    })
  })

  describe('Responsive design', () => {
    it('should hide navigation on mobile', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        const nav = screen.getByRole('navigation')
        expect(nav).toHaveClass('hidden', 'md:flex')
      })
    })

    it('should show theme toggle on all screen sizes', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        const themeToggle = screen.getByRole('button', { name: /toggle theme/i })
        // Theme toggle should not have hidden classes
        expect(themeToggle).not.toHaveClass('hidden')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByRole('banner')).toBeInTheDocument()
        expect(screen.getByRole('navigation')).toBeInTheDocument()
      })
    })

    it('should have accessible navigation links', async () => {
      render(<Header />, { wrapper: TestWrapper })

      await waitFor(() => {
        const links = screen.getAllByRole('link')
        links.forEach(link => {
          expect(link).toHaveAttribute('href')
        })
      })
    })
  })
}) 