import { generateLocaleDict, initLocale } from './lang'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import BLOG from '@/blog.config'
import { THEMES, initDarkMode } from '@/themes/theme'
import NProgress from 'nprogress'
import { getQueryVariable, isBrowser } from './utils'

const GlobalContext = createContext()

/**
 * 全局变量Provider，包括语言本地化、样式主题、搜索词
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function GlobalContextProvider(props) {
  const { children, siteInfo, categoryOptions, tagOptions } = props
  const router = useRouter()
  const [lang, updateLang] = useState(BLOG.LANG) // 默认语言
  const [locale, updateLocale] = useState(generateLocaleDict(BLOG.LANG)) // 默认语言
  const [theme, setTheme] = useState(BLOG.THEME) // 默认博客主题
  const [isDarkMode, updateDarkMode] = useState(BLOG.APPEARANCE === 'dark') // 默认深色模式
  const [onLoading, setOnLoading] = useState(false) // 抓取文章数据

  useEffect(() => {
    initLocale(lang, locale, updateLang, updateLocale)
    initDarkMode(updateDarkMode)
    initTheme()
  }, [])

  useEffect(() => {
    const handleStart = (url) => {
      NProgress.start()
      const { theme } = router.query
      if (theme && !url.includes(`theme=${theme}`)) {
        const newUrl = `${url}${url.includes('?') ? '&' : '?'}theme=${theme}`
        router.push(newUrl)
      }
      setOnLoading(true)
    }
    const handleStop = () => {
      NProgress.done()
      setOnLoading(false)
    }
    const queryTheme = getQueryVariable('theme') || BLOG.THEME
    setTheme(queryTheme)
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeError', handleStop)
    router.events.on('routeChangeComplete', handleStop)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

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

  return (
        <GlobalContext.Provider value={{
          onLoading,
          setOnLoading,
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

/**
 * 切换主题时的特殊处理
 * @param {*} setTheme
 */
const initTheme = () => {
  if (isBrowser) {
    setTimeout(() => {
      const elements = document.querySelectorAll('[id^="theme-"]')
      if (elements?.length > 1) {
        elements[elements.length - 1].scrollIntoView()
        // 删除前面的元素，只保留最后一个元素
        for (let i = 0; i < elements.length - 1; i++) {
          elements[i].parentNode.removeChild(elements[i])
        }
      }
    }, 500)
  }
}

export const useGlobal = () => useContext(GlobalContext)
