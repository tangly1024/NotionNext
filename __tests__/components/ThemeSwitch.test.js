// __tests__/components/ThemeSwitch.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeSwitch from '@/components/ThemeSwitch'
import { useRouter } from 'next/router'

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/lib/global', () => ({
  useGlobal: () => ({
    theme: 'hexo',
    locale: { COMMON: { THEME: 'Theme' }, MENU: { DARK_MODE: 'Dark', LIGHT_MODE: 'Light' } },
    isDarkMode: false,
    toggleDarkMode: jest.fn()
  })
}))

jest.mock('@/themes/theme', () => ({
  THEMES: ['hexo', 'medium', 'next']
}))

describe('ThemeSwitch Component', () => {
  const mockPush = jest.fn()
  
  beforeEach(() => {
    useRouter.mockReturnValue({
      pathname: '/',
      query: {},
      asPath: '/',
      push: mockPush.mockResolvedValue(true)
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders theme switch button', () => {
    render(<ThemeSwitch />)
    const button = screen.getByRole('button', { hidden: true })
    expect(button).toBeInTheDocument()
  })

  it('displays current theme', () => {
    render(<ThemeSwitch />)
    expect(screen.getByText('hexo')).toBeInTheDocument()
  })

  it('opens sidebar when palette icon clicked', () => {
    render(<ThemeSwitch />)
    const paletteIcon = document.querySelector('.fa-palette')
    
    fireEvent.click(paletteIcon)
    
    // Sidebar should be visible
    expect(screen.getByText('Click below to switch the theme.')).toBeInTheDocument()
  })

  it('displays all available themes', () => {
    render(<ThemeSwitch />)
    const paletteIcon = document.querySelector('.fa-palette')
    fireEvent.click(paletteIcon)
    
    expect(screen.getByText('HEXO')).toBeInTheDocument()
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
    expect(screen.getByText('NEXT')).toBeInTheDocument()
  })

  it('changes theme when theme is clicked', () => {
    render(<ThemeSwitch />)
    const paletteIcon = document.querySelector('.fa-palette')
    fireEvent.click(paletteIcon)
    
    const mediumTheme = screen.getByText('MEDIUM')
    fireEvent.click(mediumTheme)
    
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/',
      query: { theme: 'medium' }
    })
  })
})