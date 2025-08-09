import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@/context/ThemeContext'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: 'light' | 'dark' | 'system'
}

function AllTheProviders({ children, theme = 'system' }: { children: React.ReactNode; theme?: 'light' | 'dark' | 'system' }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => render(ui, { wrapper: ({ children }) => <AllTheProviders theme={options.theme}>{children}</AllTheProviders>, ...options })

export * from '@testing-library/react'
export { customRender as render } 