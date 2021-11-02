import { useContext, createContext, useState, useEffect } from 'react'
import localStorage from 'localStorage'

const ThemeContext = createContext()

/**
 * 提供日间模式、夜间模式主题的切换 light/dark
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function ThemeProvider ({ children }) {
  // 用户自定义主题设置在变量中
  const userTheme = localStorage.getItem('theme')
  const [theme, changeTheme] = useState(userTheme)
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDarkMode) {
      changeTheme('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      changeTheme(userTheme)
    }
  })
  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
