import { generateLocaleDict, initLocale } from './lang'
import { createContext, useContext, useEffect, useState } from 'react'
import Router from 'next/router'
import BLOG from '@/blog.config'
import { initDarkMode, initTheme, saveThemeToCookies } from '@/lib/theme'
import { ALL_THEME } from '@/themes'

const GlobalContext = createContext()
let hasInit = false

/**
 * 全局变量Provider，包括语言本地化、样式主题、搜索词
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function GlobalContextProvider ({ children }) {
  const [locale, updateLocale] = useState(generateLocaleDict('en-US'))
  const [isDarkMode, updateDarkMode] = useState(false)
  const [onLoading, changeLoadingState] = useState(false)
  const [theme, setTheme] = useState(BLOG.THEME)
  Router.events.on('routeChangeStart', (...args) => {
    changeLoadingState(true)
  })

  Router.events.on('routeChangeComplete', (...args) => {
    changeLoadingState(false)
  })

  function switchTheme () {
    const currentIndex = ALL_THEME.indexOf(theme)
    const newIndex = currentIndex < ALL_THEME.length - 1 ? currentIndex + 1 : 0
    changeTheme(ALL_THEME[newIndex])
  }

  function changeTheme (theme) {
    Router.query.theme = ''
    if (ALL_THEME.indexOf(theme) > -1) {
      setTheme(theme)
    } else {
      setTheme(BLOG.THEME)
    }
    saveThemeToCookies(theme)
  }

  useEffect(() => {
    if (!hasInit) {
      const userTheme = getQueryVariable('theme')
      if (userTheme && ALL_THEME.indexOf(userTheme) > -1) {
        setTheme(userTheme)
      }
      initLocale(locale, updateLocale)
      initDarkMode(isDarkMode, updateDarkMode)
      initTheme(theme, changeTheme)
      hasInit = true
    }
  })

  return (
    <GlobalContext.Provider value={{ onLoading, locale, updateLocale, isDarkMode, updateDarkMode, theme, setTheme, switchTheme, changeTheme }}>
      {children}
    </GlobalContext.Provider>
  )
}

/**
 * 查询url中的query参数
 * @param {}} variable
 * @returns
 */
function getQueryVariable (variable) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] === variable) { return pair[1] }
  }
  return (false)
}

/**
 * 深度合并两个对象
 * @param target
 * @param sources
 */
export function mergeDeep (target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return mergeDeep(target, ...sources)
}

/**
 * 对象检查
 * @param item
 * @returns {boolean}
 */
export function isObject (item) {
  return (item && typeof item === 'object' && !Array.isArray(item))
}

export const useGlobal = () => useContext(GlobalContext)
