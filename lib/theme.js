import { useContext, createContext, useState, useEffect, useRef } from 'react'
import cookie from 'react-cookies'

const ThemeContext = createContext()

/**
 * 提供日间模式、夜间模式主题的切换 light/dark
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function ThemeProvider ({ children }) {
  const [theme, changeTheme] = useState(loadUserThemeFromCookies())

  // 由于Server采用服务端静态渲染，无法获取前端Cookie配置，故在渲染hooks中做初始化主题
  useEffect(() => {
    // 若用户当前会话无指定主题，将根据深色偏好及访问时间决定默认主题
    if (!theme) {
      const date = new Date()
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      const useDark = prefersDarkMode || (date.getHours() >= 18 || date.getHours() < 6)
      if (useDark) {
        changeTheme('dark')
        saveTheme('dark')
      }
    }

    const baseLayoutClass = document.getElementById('wrapper').classList
    if (!baseLayoutClass.contains(theme)) {
      baseLayoutClass.add(theme)
    }
  })

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>{children}</ThemeContext.Provider>
  )
}

export const loadUserThemeFromCookies = () => {
  return cookie.load('theme')
}

export const saveTheme = (newTheme) => {
  cookie.save('theme', newTheme, { path: '/' })
}

export const useTheme = () => useContext(ThemeContext)
