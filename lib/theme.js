import cookie from 'react-cookies'

/**
 * 初始化主题
 * @param theme 用户默认主题state
 * @param changeTheme 更改主题ChangeState函数
 * @description 读取cookie中存的用户主题
 */
export const initTheme = (theme, changeTheme) => {
  // 若未指定主题，则从时间和浏览器偏好中决定初始主题
  if (!theme) {
    const date = new Date()
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    const useDark = prefersDarkMode || (date.getHours() >= 18 || date.getHours() < 6)
    if (useDark) {
      theme = 'dark'
    } else {
      theme = 'light'
    }
  }
  if (typeof window !== 'undefined') {
    const htmlElement = document.getElementsByTagName('html')
    htmlElement.className = ''
    changeTheme(theme)
    saveTheme(theme)
    htmlElement.classList?.add(theme)
  }
}

/**
 * 读取默认主题
 * @returns {*}
 */
export const loadUserThemeFromCookies = () => {
  return cookie.load('theme')
}

/**
   * 保存默认主题
   * @param newTheme
   */
export const saveTheme = (newTheme) => {
  cookie.save('theme', newTheme, { path: '/' })
}
