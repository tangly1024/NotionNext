import { APPEARANCE, LANG, NOTION_PAGE_ID, THEME } from '@/blog.config'
import {
  THEMES,
  getThemeConfig,
  initDarkMode,
  saveDarkModeToLocalStorage
} from '@/themes/theme'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { generateLocaleDict, initLocale, redirectUserLang } from './utils/lang'

/**
 * 全局上下文
 */
const GlobalContext = createContext()
let globalSnapshot = {}

export const getGlobalSnapshot = () => globalSnapshot

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
  const [THEME_CONFIG, SET_THEME_CONFIG] = useState(null) // 主题配置
  const [runtimeConfigOverrides, setRuntimeConfigOverrides] = useState({})
  const [isLiteMode, setLiteMode] = useState(false)

  const defaultDarkMode = NOTION_CONFIG?.APPEARANCE || APPEARANCE
  const [isDarkMode, updateDarkMode] = useState(defaultDarkMode === 'dark') // 默认深色模式
  const [onLoading, setOnLoading] = useState(false) // 抓取文章数据
  const router = useRouter()

  // 登录验证相关
  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const { isLoaded, isSignedIn, user } = enableClerk
    ? /* eslint-disable-next-line react-hooks/rules-of-hooks */
      useUser()
    : { isLoaded: true, isSignedIn: false, user: false }

  // 是否全屏
  const fullWidth = post?.fullWidth ?? false

  // 切换主题
  const switchTheme = useCallback(() => {
    const query = router.query
    const currentTheme = query.theme || theme
    const currentIndex = THEMES.indexOf(currentTheme)
    const newIndex = currentIndex < THEMES.length - 1 ? currentIndex + 1 : 0
    const newTheme = THEMES[newIndex]
    query.theme = newTheme
    router.push({ pathname: router.pathname, query })
    return newTheme
  }, [router, theme, THEMES])

  // 抓取主题配置
  const updateThemeConfig = useCallback(async theme => {
    const config = await getThemeConfig(theme)
    SET_THEME_CONFIG(config)
  }, [])

  // 切换深色模式
  const toggleDarkMode = useCallback(() => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
  }, [isDarkMode])

  const changeLang = useCallback(lang => {
    if (lang) {
      updateLang(lang)
      updateLocale(generateLocaleDict(lang))
    }
  }, [])

  const updateRuntimeConfigOverride = useCallback((key, value) => {
    if (!key) return
    setRuntimeConfigOverrides(prev => ({ ...prev, [key]: value }))
  }, [])

  // 添加路由变化时的语言处理
  useEffect(() => {
    initLocale(router.locale, changeLang, updateLocale)
    // 处理极简模式
    setLiteMode(router.query.lite === 'true')
  }, [router.locale, router.query.lite])


  // 首次加载成功
  useEffect(() => {
    initDarkMode(updateDarkMode, defaultDarkMode)
    // 处理多语言自动重定向
    if (
      NOTION_CONFIG?.REDIRECT_LANG &&
      JSON.parse(NOTION_CONFIG?.REDIRECT_LANG)
    ) {
      redirectUserLang(undefined, NOTION_PAGE_ID)
    }
    setOnLoading(false)
  }, [NOTION_CONFIG?.REDIRECT_LANG, defaultDarkMode])

  const currentTheme = useMemo(() => {
    return router?.query?.theme || theme
  }, [router?.query?.theme, theme])

  useEffect(() => {
    updateThemeConfig(currentTheme)
  }, [currentTheme])

  useEffect(() => {
    let timer = null
    const handleStart = () => {
      // 仅当路由切换较慢时显示加载遮罩，避免快速切换时闪烁
      clearTimeout(timer)
      timer = setTimeout(() => setOnLoading(true), 500)
    }
    const handleStop = () => {
      clearTimeout(timer)
      setOnLoading(false)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeError', handleStop)
    router.events.on('routeChangeComplete', handleStop)
    return () => {
      clearTimeout(timer)
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router.events])

  const contextValue = useMemo(() => ({
    isLiteMode,
    isLoaded,
    isSignedIn,
    user,
    fullWidth,
    NOTION_CONFIG,
    THEME_CONFIG,
    runtimeConfigOverrides,
    updateRuntimeConfigOverride,
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
  }), [isLiteMode, isLoaded, isSignedIn, user, fullWidth, NOTION_CONFIG, THEME_CONFIG, runtimeConfigOverrides, updateRuntimeConfigOverride, toggleDarkMode, onLoading, setOnLoading, lang, changeLang, locale, updateLocale, isDarkMode, updateDarkMode, theme, setTheme, switchTheme, siteInfo, categoryOptions, tagOptions])
  globalSnapshot = contextValue

  return (
    <GlobalContext.Provider
      value={contextValue}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => useContext(GlobalContext)
