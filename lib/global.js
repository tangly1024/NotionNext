import { generateLocaleDict, initLocale } from './lang'
import { createContext, useContext, useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import BLOG from '@/blog.config'
import { ALL_THEME, initDarkMode, initTheme, saveThemeToCookies } from '@/lib/theme'
import NProgress from 'nprogress'
import LoadingCover from '@/components/LoadingCover'
import { isBrowser } from './utils'

const GlobalContext = createContext()

/**
 * 全局变量Provider，包括语言本地化、样式主题、搜索词
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function GlobalContextProvider({ children }) {
  const [lang, updateLang] = useState(BLOG.LANG) // 默认语言
  const [locale, updateLocale] = useState(generateLocaleDict(BLOG.LANG)) // 默认语言
  const [theme, setTheme] = useState(BLOG.THEME) // 默认博客主题
  const [isDarkMode, updateDarkMode] = useState(BLOG.APPEARANCE === 'dark') // 默认深色模式
  const [onLoading, setOnLoading] = useState(false) // 抓取文章数据
  const [onReading, setOnReading] = useState(false) // 网页资源加载
  const router = useRouter()

  useEffect(() => {
    initLocale(lang, locale, updateLang, updateLocale)
    initDarkMode(isDarkMode, updateDarkMode)
    initTheme(theme, changeTheme)
    if (isBrowser()) {
      // 监听用户刷新页面
      const handleBeforeUnload = (event) => {
        // setOnReading(true)
      }
      // 监听页面元素加载完
      setOnReading(false)
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }
  }, [])

  useEffect(() => {
    const handleStart = (url) => {
      NProgress.start()
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
          changeTheme,
          setOnReading
        }}>
            <LoadingCover onReading={onReading} setOnReading={setOnReading}/>
            {children}
        </GlobalContext.Provider>
  )
}

export const useGlobal = () => useContext(GlobalContext)
