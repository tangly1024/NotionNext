import { generateLocaleDict, initLocale } from './lang'
import { createContext, useContext, useEffect, useState } from 'react'
import Router from 'next/router'
import BLOG from '@/blog.config'
import { initDarkMode, initTheme, saveThemeToCookies } from '@/lib/theme'
import { ALL_THEME } from '@/themes'

const GlobalContext = createContext()

/**
 * 全局变量Provider，包括语言本地化、样式主题、搜索词
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function GlobalContextProvider({ children }) {
  const [lang, updateLang] = useState(BLOG.LANG)
  const [locale, updateLocale] = useState(generateLocaleDict(BLOG.LANG))
  const [theme, setTheme] = useState(BLOG.THEME)
  const [isDarkMode, updateDarkMode] = useState(false)
  const [onLoading, changeLoadingState] = useState(false)

  useEffect(() => {
    initLocale(lang, locale, updateLang, updateLocale)
    initDarkMode(isDarkMode, updateDarkMode)
    initTheme(theme, changeTheme)
  }, [])

  Router.events.on('routeChangeStart', (...args) => {
    changeLoadingState(true)
  })

  Router.events.on('routeChangeComplete', (...args) => {
    changeLoadingState(false)
  })

  function switchTheme() {
    const currentIndex = ALL_THEME.indexOf(theme)
    const newIndex = currentIndex < ALL_THEME.length - 1 ? currentIndex + 1 : 0
    const newTheme = ALL_THEME[newIndex]
    changeTheme(newTheme)
    return newTheme
  }

  function changeTheme(theme) {
    Router.query.theme = ''
    if (ALL_THEME.indexOf(theme) > -1) {
      setTheme(theme)
    } else {
      setTheme(BLOG.THEME)
    }
    saveThemeToCookies(theme)
  }

  return (
    <GlobalContext.Provider value={{ onLoading, changeLoadingState, locale, updateLocale, isDarkMode, updateDarkMode, theme, setTheme, switchTheme, changeTheme }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => useContext(GlobalContext)
