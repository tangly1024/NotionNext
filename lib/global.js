import { generateLocaleDict, initLocale } from './lang'
import { createContext, useContext, useEffect, useState } from 'react'
import Router from 'next/router'
import BLOG from '@/blog.config'
import { ALL_THEME, initDarkMode } from '@/lib/theme'

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

  useEffect(() => {
    if (!hasInit) {
      initLocale(locale, updateLocale)
      initDarkMode(isDarkMode, updateDarkMode)
      hasInit = true
    }
    // 读取浏览器参数中的主题
    const userTheme = Router?.router?.query?.theme
    if (userTheme && ALL_THEME.indexOf(userTheme) > -1 && theme !== userTheme) {
      setTheme(userTheme)
    }
  })

  return (
    <GlobalContext.Provider value={{ onLoading, locale, updateLocale, isDarkMode, updateDarkMode, theme, setTheme }}>
      {children}
    </GlobalContext.Provider>
  )
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
