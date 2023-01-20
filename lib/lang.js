import zhCN from './lang/zh-CN'
import enUS from './lang/en-US'
import zhHK from './lang/zh-HK'
import zhTW from './lang/zh-TW'
import frFR from '@/lib/lang/fr-FR'
import cookie from 'react-cookies'
import { getQueryVariable, isBrowser, mergeDeep } from './utils'

const lang = {
  'en-US': enUS,
  'zh-CN': zhCN,
  'zh-HK': zhHK,
  'zh-TW': zhTW,
  'fr-FR': frFR
}

export default lang

/**
 * 获取当前语言字典
 * @returns 不同语言对应字典
 */
export function generateLocaleDict(langString) {
  let userLocale = lang['en-US']

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
    case 'fr-fr':
      userLocale = lang['fr-FR']
      break
    default:
      userLocale = lang['en-US']
  }
  return mergeDeep({}, lang['en-US'], userLocale)
}

/**
 * 初始化站点翻译
 * 根据用户当前浏览器语言进行切换
 */
export function initLocale(lang, locale, changeLang, changeLocale) {
  if (isBrowser()) {
    const queryLang = getQueryVariable('lang') || loadLangFromCookies() || window.navigator.language
    let currentLang = lang
    if (queryLang !== lang) {
      currentLang = queryLang
    }
    changeLang(currentLang)
    saveLangToCookies(currentLang)

    const targetLocale = generateLocaleDict(currentLang)
    if (JSON.stringify(locale) !== JSON.stringify(currentLang)) {
      changeLocale(targetLocale)
    }
  }
}
/**
 * 读取语言
 * @returns {*}
 */
export const loadLangFromCookies = () => {
  return cookie.load('lang')
}

/**
     * 保存语言
     * @param newTheme
     */
export const saveLangToCookies = (lang) => {
  cookie.save('lang', lang, { path: '/' })
}
