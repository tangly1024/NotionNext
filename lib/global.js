import BLOG from '@/blog.config'
import lang from './lang'
import { useContext, createContext, useState, useEffect } from 'react'
import cookie from 'react-cookies'

const GlobalContext = createContext()

/**
 * 全局变量Provider，包括语言本地化、样式主题、搜索词
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function GlobalContextProvider ({ children }) {
  const locale = getCurrentLocale()
  const [theme, changeTheme] = useState(loadUserThemeFromCookies())
  useEffect(() => { initTheme(theme, changeTheme) })

  return (
    <GlobalContext.Provider value={{ locale, theme, changeTheme }}>{children}</GlobalContext.Provider>
  )
}

/**
 * 获取当前语言字典
 * @returns 不同语言对应字典
 */
const getCurrentLocale = () => {
  if (BLOG.lang.slice(0, 2).toLowerCase() === 'zh') {
    switch (BLOG.lang.toLowerCase()) {
      case 'zh-cn':
      case 'zh-sg':
        return lang['zh-CN']
      case 'zh-hk':
        return lang['zh-HK']
      case 'zh-tw':
        return lang['zh-TW']
      default:
        return lang['zh-TW']
    }
  } else {
    return lang.en
  }
}

/**
 * 初始化主题
 * @param theme 用户默认主题state
 * @param changeTheme 更改主题ChangeState函数
 * @description 主题样式相关 由于Server采用服务端静态渲染，无法获取前端Cookie配置，故在渲染hooks中做初始化主题
 */
const initTheme = (theme, changeTheme) => {
  if (!theme) {
    const date = new Date()
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    const useDark = prefersDarkMode || (date.getHours() >= 18 || date.getHours() < 6)
    if (useDark) {
      changeTheme('dark')
      saveTheme('dark')
    } else {
      changeTheme('light')
      saveTheme('light')
    }
  }
  const baseLayoutClass = document.getElementById('wrapper').classList
  if (!baseLayoutClass.contains(theme)) {
    baseLayoutClass.add(theme)
  }
}

/**
 * 读取默认主题
 * @returns {*}
 */
export const loadUserThemeFromCookies = () => {
  return cookie.load('theme')
}

/**
 * 保存默认主题
 * @param newTheme
 */
export const saveTheme = (newTheme) => {
  cookie.save('theme', newTheme, { path: '/' })
}

export const useGlobal = () => useContext(GlobalContext)
