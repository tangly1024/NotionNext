import cookie from 'react-cookies'
import BLOG from '@/blog.config'

/**
 * 初始化主题
 * @param isDarkMode
 * @param updateDarkMode 更改主题ChangeState函数
 * @description 读取cookie中存的用户主题
 */
export const initDarkMode = (isDarkMode, updateDarkMode) => {
  if (typeof window !== 'undefined') {
    if (!isDarkMode) {
      isDarkMode = isPreferDark()
    }
    updateDarkMode(isDarkMode)
    saveDarkModeToCookies(isDarkMode)
    document.getElementsByTagName('html')[0].setAttribute('class', isDarkMode ? 'dark' : 'light')
  }
}

/**
 * 从cookie中读取 用户默认主题
 * @param {*} theme
 * @param {*} changeTheme
 */
export const initTheme = (theme, changeTheme) => {
  const userTheme = loadThemeFromCookies()
  if (userTheme !== theme) {
    changeTheme(userTheme)
  }
}

/**
 * 是否优先深色模式
 * @returns {*}
 */
export function isPreferDark () {
  if (BLOG.APPEARANCE === 'dark') {
    return true
  }
  if (BLOG.APPEARANCE === 'auto') {
    // 系统深色模式或时间是夜间时，强行置为夜间模式
    const date = new Date()
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDarkMode || (date.getHours() >= 18 || date.getHours() < 6)
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
