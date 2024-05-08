import {
  THEMES,
  initDarkMode,
  saveDarkModeToLocalStorage
} from '@/themes/theme'
import { APPEARANCE, LANG, NOTION_PAGE_ID, THEME } from 'blog.config'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  generateLocaleDict,
  initLocale,
  redirectUserLang,
  saveLangToLocalStorage
} from './lang'
const GlobalContext = createContext()

/**
 * 定义全局变量，包括语言、主题、深色模式、加载状态
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function GlobalContextProvider(props) {
  const {
    post,
    children,
    siteInfo,
    categoryOptions,
    tagOptions,
    NOTION_CONFIG
  } = props
  const [lang, updateLang] = useState(NOTION_CONFIG?.LANG || LANG) // 默认语言
  const [locale, updateLocale] = useState(
    generateLocaleDict(NOTION_CONFIG?.LANG || LANG)
  ) // 默认语言
  const [theme, setTheme] = useState(NOTION_CONFIG?.THEME || THEME) // 默认博客主题
  const defaultDarkMode = NOTION_CONFIG?.APPEARANCE || APPEARANCE
  const [isDarkMode, updateDarkMode] = useState(defaultDarkMode === 'dark') // 默认深色模式
  const [onLoading, setOnLoading] = useState(false) // 抓取文章数据
  const router = useRouter()

  // 是否全屏
  const fullWidth = post?.fullWidth ?? false

  // 切换主题
  function switchTheme() {
    const query = router.query
    const currentTheme = query.theme || theme
    const currentIndex = THEMES.indexOf(currentTheme)
    const newIndex = currentIndex < THEMES.length - 1 ? currentIndex + 1 : 0
    const newTheme = THEMES[newIndex]
    query.theme = newTheme
    router.push({ pathname: router.pathname, query })
    return newTheme
  }

  // 切换深色模式
  const toggleDarkMode = () => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
  }

  /**
   * 更新语言
   * 这里是代码级别的多语言，整个站点和文章内容的多语言不在此处理
   */
  function changeLang(lang) {
    if (lang) {
      saveLangToLocalStorage(lang)
      updateLang(lang)
      updateLocale(generateLocaleDict(lang))
    }
  }

  useEffect(() => {
    initDarkMode(updateDarkMode, defaultDarkMode)
    initLocale(lang, locale, updateLang, updateLocale)
    redirectUserLang(NOTION_PAGE_ID)
  }, [])

  // 加载进度条
  useEffect(() => {
    const handleStart = url => {
      const { theme } = router.query
      if (theme && !url.includes(`theme=${theme}`)) {
        const newUrl = `${url}${url.includes('?') ? '&' : '?'}theme=${theme}`
        router.push(newUrl)
      }
      setOnLoading(true)
    }
    const handleStop = () => {
      setOnLoading(false)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeError', handleStop)
    router.events.on('routeChangeComplete', handleStop)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  return (
    <GlobalContext.Provider
      value={{
        fullWidth,
        NOTION_CONFIG,
        toggleDarkMode,
        onLoading,
        setOnLoading,
        lang,
        changeLang,
        locale,
        updateLocale,
        isDarkMode,
        updateDarkMode,
        theme,
        setTheme,
        switchTheme,
        siteInfo,
        categoryOptions,
        tagOptions
      }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => useContext(GlobalContext)
