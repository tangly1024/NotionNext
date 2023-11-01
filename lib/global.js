import { generateLocaleDict, initLocale } from './lang'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { THEMES, initDarkMode } from '@/themes/theme'

import BLOG from '@/blog.config'
import NProgress from 'nprogress'
import { isBrowser } from './utils'

const GlobalContext = createContext()

/**
 * 定义全局变量，包括语言、主题、深色模式、加载状态
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function GlobalContextProvider(props) {
  const { children, siteInfo, categoryOptions, tagOptions, NOTION_CONFIG } = props
  console.log('config', NOTION_CONFIG)
  const router = useRouter()
  const [lang, updateLang] = useState(NOTION_CONFIG.LANG || BLOG.LANG) // 默认语言
  const [locale, updateLocale] = useState(generateLocaleDict(NOTION_CONFIG.LANG || BLOG.LANG)) // 默认语言
  const [theme, setTheme] = useState(NOTION_CONFIG.THEME || BLOG.THEME) // 默认博客主题
  const [isDarkMode, updateDarkMode] = useState(NOTION_CONFIG.APPEARANCE || BLOG.APPEARANCE === 'dark') // 默认深色模式
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

  useEffect(() => {
    initLocale(lang, locale, updateLang, updateLocale)
    initDarkMode(updateDarkMode)
    checkThemeDOM()
  }, [])

  // 加载默认主题
  //   useEffect(() => {
  //     const queryTheme = getQueryVariable('theme') || theme
  //     setTheme(queryTheme)
  //   }, [router])

  // 加载进度条
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
          onLoading,
          setOnLoading,
          lang,
          updateLang,
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
const checkThemeDOM = () => {
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
