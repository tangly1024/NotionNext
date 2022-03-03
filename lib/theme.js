import cookie from 'react-cookies'

/**
 * 初始化主题
 * @param theme 用户默认主题state
 * @param updateDarkMode 更改主题ChangeState函数
 * @description 读取cookie中存的用户主题
 */
export const initTheme = (isDarkMode, updateDarkMode) => {
  // 若未指定主题，则从时间和浏览器偏好中决定初始主题
  if (!isDarkMode) {
    const date = new Date()
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    const useDark = prefersDarkMode || (date.getHours() >= 18 || date.getHours() < 6)
    if (useDark) {
      isDarkMode = true
    } else {
      isDarkMode = false
    }
  }
  if (typeof window !== 'undefined') {
    const htmlElement = document.getElementsByTagName('html')
    htmlElement.className = ''
    updateDarkMode(isDarkMode)
    saveDarkModeToCookies(isDarkMode)
    htmlElement.classList?.add(isDarkMode)
  }
}

/**
 * 读取默认主题
 * @returns {*}
 */
export const loadDarkModeFromCookies = () => {
  return cookie.load('theme')
}

/**
   * 保存默认主题
   * @param newTheme
   */
export const saveDarkModeToCookies = (newTheme) => {
  cookie.save('theme', newTheme, { path: '/' })
}
