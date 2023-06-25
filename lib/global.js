import { generateLocaleDict, initLocale } from './lang'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import BLOG from '@/blog.config'
import { ALL_THEME, initDarkMode } from '@/themes/theme'
import NProgress from 'nprogress'
import { getQueryVariable, isBrowser } from './utils'

const GlobalContext = createContext()

/**
 * 全局变量Provider，包括语言本地化、样式主题、搜索词
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function GlobalContextProvider({ children }) {
  const router = useRouter()
  const [lang, updateLang] = useState(BLOG.LANG) // 默认语言
  const [locale, updateLocale] = useState(generateLocaleDict(BLOG.LANG)) // 默认语言
  const [theme, setTheme] = useState(BLOG.THEME) // 默认博客主题
  const [isDarkMode, updateDarkMode] = useState(BLOG.APPEARANCE === 'dark') // 默认深色模式
  const [onLoading, setOnLoading] = useState(false) // 抓取文章数据
  //   const [onReading, setOnReading] = useState(false) // 网页资源加载

  useEffect(() => {
    initLocale(lang, locale, updateLang, updateLocale)
    initDarkMode(isDarkMode, updateDarkMode)
    initTheme()
    if (isBrowser()) {
      // 监听用户刷新页面
      const handleBeforeUnload = (event) => {
        // setOnReading(true)
      }
      // 监听页面元素加载完
      //   setOnReading(false)
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }
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
    const currentIndex = ALL_THEME.indexOf(theme)
    const newIndex = currentIndex < ALL_THEME.length - 1 ? currentIndex + 1 : 0
    const newTheme = ALL_THEME[newIndex]
    const query = { ...router.query, theme: newTheme }
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
          switchTheme
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
  if (isBrowser()) {
    setTimeout(() => {
      const elements = document.querySelectorAll('[id^="theme-"]')
      if (elements?.length > 1) {
        elements[elements.length - 1].scrollIntoView()
        // 删除前面的元素，只保留最后一个元素
        elements[0].parentNode.removeChild(elements[0])
        if (Object.prototype.hasOwnProperty.call(elements, 'pop')) {
          elements.pop()
        }
      }
    }, 500)
  }
}

export const useGlobal = () => useContext(GlobalContext)
