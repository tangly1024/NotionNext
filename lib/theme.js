import { useContext, createContext, useState, useEffect } from 'react'
import localStorage from 'localStorage'

const ThemeContext = createContext()

export function ThemeProvider ({ children }) {
  // 初始值
  const defaultTheme = localStorage.getItem('theme')
  const [theme, changeTheme] = useState()
  useEffect(() => {
    changeTheme(defaultTheme)
  })

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
