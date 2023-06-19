import cookie from 'react-cookies'
import BLOG from '@/blog.config'
import { getQueryParam, getQueryVariable } from './utils'
import dynamic from 'next/dynamic'

/**
 * 所有主题枚举
 */
export const ALL_THEME = [
  'hexo',
  'matery',
  'next',
  'medium',
  'fukasawa',
  'nobelium',
  'example',
  'simple'
]

/**
 * 加载主题文件
 * @param {*} router
 * @returns
 */
export const getLayoutByTheme = (router) => {
  const theme = getQueryParam(router.asPath, 'theme') || BLOG.THEME
  let Layout = null
  // 根据路由 pages的文件名加载主题文件
  switch (router.pathname) {
    case '/':
      Layout = dynamic(() => import(`@/themes/${theme}/LayoutIndex`), { ssr: true })
      break
    case '/page/[page]':
      Layout = dynamic(() => import(`@/themes/${theme}/LayoutPage`), { ssr: true })
      break
    case '/archive':
      Layout = dynamic(() => import(`@/themes/${theme}/LayoutArchive`), { ssr: true })
      break
    case '/search':
      Layout = dynamic(() => import(`@/themes/${theme}/LayoutSearch`), { ssr: true })
      break
    case '/search/[keyword]':
      Layout = dynamic(() => import(`@/themes/${theme}/LayoutSearch`), { ssr: true })
      break
    case '/search/[keyword]/page/[page]':
      Layout = dynamic(() => import(`@/themes/${theme}/LayoutSearch`), { ssr: true })
      break
    case '/404':
      Layout = dynamic(() => import(`@/themes/${theme}/Layout404`), { ssr: true })
      break
    case '/tag':
      Layout = dynamic(() => import(`@/themes/${theme}/LayoutTagIndex`), { ssr: true })
      break
    case '/tag/[tag]':
      Layout = dynamic(() => import(`@/themes/${theme}/LayoutTag`), { ssr: true })
      break
    case '/tag/[tag]/page/[page]':
      Layout = dynamic(() => import(`@/themes/${theme}/LayoutTag`), { ssr: true })
      break
    case '/category':
      Layout = dynamic(() => import(`@/themes/${theme}/LayoutCategoryIndex`), { ssr: true })
      break
    case '/category/[category]':
      Layout = dynamic(() => import(`@/themes/${theme}/LayoutCategory`), { ssr: true })
      break
    case '/category/[category]/page/[page]':
      Layout = dynamic(() => import(`@/themes/${theme}/LayoutCategory`), { ssr: true })
      break
    default:
      Layout = dynamic(() => import(`@/themes/${theme}/LayoutSlug`), { ssr: true })
      break
  }
  return Layout
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
