import cookie from 'react-cookies'
import BLOG from '@/blog.config'
import { getQueryParam, getQueryVariable } from '../lib/utils'
import dynamic from 'next/dynamic'
// 使用 __THEME__ 变量来动态导入主题组件
import * as ThemeComponents from '@theme-components'
/**
 * 所有主题枚举
 */
export const ALL_THEME = [
  'hexo', 'matery', 'next', 'medium', 'fukasawa', 'nobelium', 'example', 'simple', 'gitbook'
]

/**
 * 加载主题文件
 * 如果是
 * @param {*} router
 * @returns
 */
export const getLayoutByTheme = (router) => {
  const themeQuery = getQueryParam(router.asPath, 'theme') || BLOG.THEME
  const layout = getLayoutNameByPath(router.pathname)
  if (themeQuery !== BLOG.THEME) {
    return dynamic(() => import(`@/themes/${themeQuery}/${layout}`), { ssr: true })
  } else {
    return ThemeComponents[layout]
  }
}

/**
 * 路径 对应的Layout名称
 * @param {*} path
 * @returns
 */
export const getLayoutNameByPath = (path) => {
  switch (path) {
    case '/':
      return 'LayoutIndex'
    case '/page/[page]':
      return 'LayoutPage'
    case '/archive':
      return 'LayoutArchive'
    case '/search':
      return 'LayoutSearch'
    case '/search/[keyword]':
      return 'LayoutSearch'
    case '/search/[keyword]/page/[page]':
      return 'LayoutSearch'
    case '/404':
      return 'Layout404'
    case '/tag':
      return 'LayoutTagIndex'
    case '/tag/[tag]':
      return 'LayoutTag'
    case '/tag/[tag]/page/[page]':
      return 'LayoutTag'
    case '/category':
      return 'LayoutCategoryIndex'
    case '/category/[category]':
      return 'LayoutCategory'
    case '/category/[category]/page/[page]':
      return 'LayoutCategory'
    default:
      return 'LayoutSlug'
  }
}

/**
 * 初始化主题 , 优先级 query > cookies > systemPrefer
 * @param isDarkMode
 * @param updateDarkMode 更改主题ChangeState函数
 * @description 读取cookie中存的用户主题
 */
export const initDarkMode = (isDarkMode, updateDarkMode) => {
  const queryMode = getQueryVariable('mode')
  if (queryMode) {
    isDarkMode = queryMode === 'dark'
  } else if (!isDarkMode) {
    isDarkMode = isPreferDark()
  }
  updateDarkMode(isDarkMode)
  saveDarkModeToCookies(isDarkMode)
  document.getElementsByTagName('html')[0].setAttribute('class', isDarkMode ? 'dark' : 'light')
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
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDarkMode || (BLOG.APPEARANCE_DARK_TIME && (date.getHours() >= BLOG.APPEARANCE_DARK_TIME[0] || date.getHours() < BLOG.APPEARANCE_DARK_TIME[1]))
  }
  return false
}

/**
 * 读取深色模式
 * @returns {*}
 */
export const loadDarkModeFromCookies = () => {
  return cookie.load('darkMode')
}

/**
   * 保存深色模式
   * @param newTheme
   */
export const saveDarkModeToCookies = (newTheme) => {
  cookie.save('darkMode', newTheme, { path: '/' })
}

/**
 * 读取默认主题
 * @returns {*}
 */
export const loadThemeFromCookies = () => {
  return cookie.load('theme')
}

/**
   * 保存默认主题
   * @param newTheme
   */
export const saveThemeToCookies = (newTheme) => {
  cookie.save('theme', newTheme, { path: '/' })
}
