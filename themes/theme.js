import BLOG, { LAYOUT_MAPPINGS } from '@/blog.config'
import getConfig from 'next/config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { getQueryParam, getQueryVariable, isBrowser } from '../lib/utils'

// 在next.config.js中扫描所有主题
export const { THEMES = [] } = getConfig()?.publicRuntimeConfig || {}
const baseLayoutCache = new Map()
const layoutByThemeCache = new Map()
let domFixTimer = null

const normalizeThemeName = themeValue => {
  if (!themeValue || typeof themeValue !== 'string') return BLOG.THEME
  const firstTheme = themeValue.split(',')[0].trim()
  if (!firstTheme) return BLOG.THEME
  return THEMES.includes(firstTheme) ? firstTheme : BLOG.THEME
}

const scheduleFixThemeDOM = (delay = 120) => {
  if (!isBrowser) return
  if (domFixTimer) {
    clearTimeout(domFixTimer)
  }
  domFixTimer = setTimeout(() => {
    fixThemeDOM()
    domFixTimer = null
  }, delay)
}

async function importThemeConfig(themeFolderName) {
  try {
    const mod = await import(`@/themes/${themeFolderName}`)
    return mod?.THEME_CONFIG ?? null
  } catch (err) {
    console.error(`Failed to load theme config "${themeFolderName}":`, err)
    return null
  }
}

/**
 * 获取主题配置（始终动态加载，与运行时 BLOG.THEME / URL ?theme 一致；不依赖编译期别名）。
 * @param {string} themeQuery - 主题查询参数（支持多个主题用逗号分隔）
 * @returns {Promise<object|null>} 主题配置对象
 */
export const getThemeConfig = async themeQuery => {
  const themeName = normalizeThemeName(themeQuery)
  let cfg = await importThemeConfig(themeName)
  if (cfg) {
    return cfg
  }
  const fallback = normalizeThemeName(BLOG.THEME)
  if (fallback !== themeName) {
    cfg = await importThemeConfig(fallback)
    if (cfg) {
      console.warn(
        `[theme] "${themeName}" config unavailable, using fallback "${fallback}".`
      )
      return cfg
    }
  }
  console.error('[theme] No theme configuration could be loaded.')
  return null
}

/**
 * 获取当前主题（query 主题优先，且做合法性校验）
 */
const getCurrentTheme = (router, fallbackTheme) => {
  const queryTheme = getQueryParam(router?.asPath, 'theme')
  if (queryTheme) {
    return normalizeThemeName(queryTheme)
  }
  return normalizeThemeName(fallbackTheme || BLOG.THEME)
}

/**
 * 加载全局布局
 * @param {*} theme
 * @returns
 */
export const getBaseLayoutByTheme = theme => {
  const normalizedTheme = normalizeThemeName(theme)
  if (baseLayoutCache.has(normalizedTheme)) {
    return baseLayoutCache.get(normalizedTheme)
  }
  const DynamicBaseLayout = dynamic(
    () =>
      import(`@/themes/${normalizedTheme}`).then(m => {
        const Base = m['LayoutBase']
        if (!Base) {
          throw new Error(
            `[theme] LayoutBase missing in themes/${normalizedTheme}`
          )
        }
        return Base
      }),
    { ssr: true }
  )
  baseLayoutCache.set(normalizedTheme, DynamicBaseLayout)
  return DynamicBaseLayout
}

/**
 * 动态获取布局
 * @param {*} props
 */
export const DynamicLayout = props => {
  const { theme, layoutName } = props
  const SelectedLayout = useLayoutByTheme({ layoutName, theme })
  return <SelectedLayout {...props} />
}

/**
 * 加载主题文件
 * @param {*} layoutName
 * @param {*} theme
 * @returns
 */
export const useLayoutByTheme = ({ layoutName, theme }) => {
  const router = useRouter()
  const themeQuery = getCurrentTheme(router, theme)
  const cacheKey = `${themeQuery}:${layoutName}`

  if (layoutByThemeCache.has(cacheKey)) {
    scheduleFixThemeDOM(themeQuery === BLOG.THEME ? 80 : 240)
    return layoutByThemeCache.get(cacheKey)
  }

  const DynamicLayoutComponent = dynamic(
    () =>
      import(`@/themes/${themeQuery}`).then(componentsSource => {
        const Selected =
          componentsSource[layoutName] || componentsSource.LayoutSlug
        if (!Selected) {
          throw new Error(
            `[theme] Layout "${layoutName}" missing in themes/${themeQuery}`
          )
        }
        return Selected
      }),
    { ssr: true }
  )
  layoutByThemeCache.set(cacheKey, DynamicLayoutComponent)
  scheduleFixThemeDOM(themeQuery === BLOG.THEME ? 80 : 240)
  return DynamicLayoutComponent
}

/**
 * 根据路径 获取对应的layout名称
 * @param {*} path
 * @returns
 */
const getLayoutNameByPath = path => {
  const layoutName = LAYOUT_MAPPINGS[path] || 'LayoutSlug'
  //   console.log('path-layout',path,layoutName)
  return layoutName
}

/**
 * 切换主题时的特殊处理
 * 删除多余的元素
 */
const fixThemeDOM = () => {
  if (isBrowser) {
    const elements = document.querySelectorAll('[id^="theme-"]')
    if (elements?.length > 1) {
      for (let i = 0; i < elements.length - 1; i++) {
        if (
          elements[i] &&
          elements[i].parentNode &&
          elements[i].parentNode.contains(elements[i])
        ) {
          elements[i].parentNode.removeChild(elements[i])
        }
      }
      elements[0]?.scrollIntoView()
    }
  }
}

/**
 * 初始化主题 , 优先级 query > cookies > systemPrefer
 * @param isDarkMode
 * @param updateDarkMode 更改主题ChangeState函数
 * @description 读取cookie中存的用户主题
 */
export const initDarkMode = (updateDarkMode, defaultDarkMode) => {
  // 查看用户设备浏览器是否深色模型
  let newDarkMode = isPreferDark()

  // 查看localStorage中用户记录的是否深色模式
  const userDarkMode = loadDarkModeFromLocalStorage()
  if (userDarkMode) {
    newDarkMode = userDarkMode === 'dark' || userDarkMode === 'true'
    saveDarkModeToLocalStorage(newDarkMode) // 用户手动的才保存
  }

  // 如果站点强制设置默认深色，则优先级改过用
  if (defaultDarkMode === 'true') {
    newDarkMode = true
  }

  // url查询条件中是否深色模式
  const queryMode = getQueryVariable('mode')
  if (queryMode) {
    newDarkMode = queryMode === 'dark'
  }

  updateDarkMode(newDarkMode)
  document
    .getElementsByTagName('html')[0]
    .setAttribute('class', newDarkMode ? 'dark' : 'light')
}

/**
 * 是否优先深色模式， 根据系统深色模式以及当前时间判断
 * @returns {*}
 */
export function isPreferDark() {
  if (BLOG.APPEARANCE === 'dark') {
    return true
  }
  if (BLOG.APPEARANCE === 'auto') {
    // 系统深色模式或时间是夜间时，强行置为夜间模式
    const date = new Date()
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    return (
      prefersDarkMode ||
      (BLOG.APPEARANCE_DARK_TIME &&
        (date.getHours() >= BLOG.APPEARANCE_DARK_TIME[0] ||
          date.getHours() < BLOG.APPEARANCE_DARK_TIME[1]))
    )
  }
  return false
}

/**
 * 读取深色模式
 * @returns {*}
 */
export const loadDarkModeFromLocalStorage = () => {
  return localStorage.getItem('darkMode')
}

/**
 * 保存深色模式
 * @param newTheme
 */
export const saveDarkModeToLocalStorage = newTheme => {
  localStorage.setItem('darkMode', newTheme)
}
