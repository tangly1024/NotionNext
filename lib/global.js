import lang from './lang'
import { useContext, createContext, useState, useEffect } from 'react'
import cookie from 'react-cookies'
import Router from 'next/router'
const GlobalContext = createContext()

/**
 * 全局变量Provider，包括语言本地化、样式主题、搜索词
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function GlobalContextProvider ({ children }) {
  const [locale, changeLocale] = useState(generateLocaleDict('en-US'))
  const [theme, changeTheme] = useState(loadUserThemeFromCookies())
  const [onLoading, changeLoadingState] = useState(false)
  Router.events.on('routeChangeStart', (...args) => {
    changeLoadingState(true)
  })

  Router.events.on('routeChangeComplete', (...args) => {
    changeLoadingState(false)
  })

  // 服务端静态渲染，在渲染hooks后根据前端变量做初始化工作
  useEffect(() => {
    initTheme(theme, changeTheme)
    initLocale(locale, changeLocale)
  })

  return (
    <GlobalContext.Provider value={{ onLoading, locale, theme, changeTheme }}>
      {children}
    </GlobalContext.Provider>
  )
}

/**
 * 获取当前语言字典
 * @returns 不同语言对应字典
 */
const generateLocaleDict = (langString) => {
  let userLocale = lang['en-US']
  if (!langString) {
    return userLocale
  }
  if (langString.slice(0, 2).toLowerCase() === 'zh') {
    switch (langString.toLowerCase()) {
      case 'zh-cn':
      case 'zh-sg':
        userLocale = lang['zh-CN']
        break
      case 'zh-hk':
        userLocale = lang['zh-HK']
        break
      case 'zh-tw':
        userLocale = lang['zh-TW']
        break
      default:
        userLocale = lang['zh-CN']
    }
  }
  const resLocale = mergeDeep({}, lang['en-US'], userLocale)
  return resLocale
}

/**
 * 初始化语言
 * 根据用户当前浏览器语言进行切换
 */
const initLocale = (locale, changeLocale) => {
  if (window) {
    const targetLocale = generateLocaleDict(window.navigator.language)
    if (JSON.stringify(locale) !== JSON.stringify(targetLocale)) {
      changeLocale(targetLocale)
    }
  }
}
/**
 * 初始化主题
 * @param theme 用户默认主题state
 * @param changeTheme 更改主题ChangeState函数
 * @description 读取cookie中存的用户主题
 */
const initTheme = (theme, changeTheme) => {
  if (!theme) {
    const date = new Date()
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    const useDark = prefersDarkMode || (date.getHours() >= 18 || date.getHours() < 6)
    const htmlElement = document.getElementsByTagName('html')

    if (useDark) {
      changeTheme('dark')
      saveTheme('dark')
      htmlElement.classList?.remove('light')
      htmlElement.classList?.add('dark')
    } else {
      changeTheme('light')
      saveTheme('light')
      htmlElement.classList?.remove('dark')
      htmlElement.classList?.add('light')
    }
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
