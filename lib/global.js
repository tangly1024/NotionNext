import { generateLocaleDict, initLocale } from './lang'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { THEMES, initDarkMode, saveDarkModeToCookies } from '@/themes/theme'
import { APPEARANCE, LANG, THEME } from 'blog.config'
const GlobalContext = createContext()

/**
 * 定义全局变量，包括语言、主题、深色模式、加载状态
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function GlobalContextProvider(props) {
  const { children, siteInfo, categoryOptions, tagOptions, NOTION_CONFIG } = props
  const router = useRouter()
  const [lang, updateLang] = useState(NOTION_CONFIG?.LANG || LANG) // 默认语言
  const [locale, updateLocale] = useState(generateLocaleDict(NOTION_CONFIG?.LANG || LANG)) // 默认语言
  const [theme, setTheme] = useState(NOTION_CONFIG?.THEME || THEME) // 默认博客主题
  const [isDarkMode, updateDarkMode] = useState(NOTION_CONFIG?.APPEARANCE || APPEARANCE === 'dark') // 默认深色模式
  const [onLoading, setOnLoading] = useState(false) // 抓取文章数据

  // 切换主题
  function switchTheme() {
    const currentIndex = THEMES.indexOf(theme)
    const newIndex = currentIndex < THEMES.length - 1 ? currentIndex + 1 : 0
    const newTheme = THEMES[newIndex]
    const query = router.query
    query.theme = newTheme
    router.push({ pathname: router.pathname, query })
    return newTheme
  }

  // 切换深色模式
  const toggleDarkMode = () => {
    const newStatus = !isDarkMode
    saveDarkModeToCookies(newStatus)
    updateDarkMode(newStatus)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
  }

  /**
   * 更新语言
   */
  function changeLang(lang) {
    if (lang) {
      updateLang(lang)
      updateLocale(generateLocaleDict(lang))
    }
  }

  useEffect(() => {
    initDarkMode(updateDarkMode)
    initLocale(lang, locale, updateLang, updateLocale)
  }, [])

  // 加载进度条
  useEffect(() => {
    const handleStart = (url) => {
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
        <GlobalContext.Provider value={{
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
