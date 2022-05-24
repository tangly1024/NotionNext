import zhCN from './lang/zh-CN'
import enUS from './lang/en-US'
import zhHK from './lang/zh-HK'
import zhTW from './lang/zh-TW'
import { isBrowser, mergeDeep } from './utils'
const lang = {
  'en-US': enUS,
  'zh-CN': zhCN,
  'zh-HK': zhHK,
  'zh-TW': zhTW
}

export default lang

/**
 * 获取当前语言字典
 * @returns 不同语言对应字典
 */
export function generateLocaleDict (langString) {
  let userLocale = lang['en-US']
  if (!langString) {
    return userLocale
  }
  if (langString.slice(0, 2).toLowerCase() === 'zh') {
    switch (langString.toLowerCase()) {
      case 'zh-cn':
      case 'zh-sg':
        userLocale = lang['zh-CN']
        break
      case 'zh-hk':
        userLocale = lang['zh-HK']
        break
      case 'zh-tw':
        userLocale = lang['zh-TW']
        break
      default:
        userLocale = lang['zh-CN']
    }
  }
  return mergeDeep({}, lang['en-US'], userLocale)
}

/**
 * 初始化语言
 * 根据用户当前浏览器语言进行切换
 */
export function initLocale (locale, changeLocale) {
  if (isBrowser()) {
    const targetLocale = generateLocaleDict(window.navigator.language)
    if (JSON.stringify(locale) !== JSON.stringify(targetLocale)) {
      changeLocale(targetLocale)
    }
  }
}
