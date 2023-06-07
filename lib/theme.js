import cookie from 'react-cookies'
import BLOG from '@/blog.config'
import { isBrowser, getQueryVariable } from './utils'

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
 * 初始化主题， 优先级 query > cookies > blog.config.js
 * @param {*} theme
 * @param {*} changeTheme
 */
export const initTheme = (theme, changeTheme) => {
  if (isBrowser()) {
    // const queryTheme = getQueryVariable('theme') || loadThemeFromCookies() || BLOG.THEME
    const queryTheme = getQueryVariable('theme') || BLOG.THEME
    let currentTheme = theme
    if (queryTheme !== theme && ALL_THEME.indexOf(queryTheme) > -1) {
      currentTheme = queryTheme
    }
    changeTheme(currentTheme)
    saveThemeToCookies(currentTheme)
  }
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
