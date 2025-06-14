import BLOG from '@/blog.config'
import { getQueryVariable, isBrowser, mergeDeep } from '@/lib/utils'
import enUS from './lang/en-US'
import frFR from './lang/fr-FR'
import jaJP from './lang/ja-JP'
import trTR from './lang/tr-TR'
import zhCN from './lang/zh-CN'
import zhHK from './lang/zh-HK'
import zhTW from './lang/zh-TW'
import { extractLangPrefix } from './utils/pageId'
import { useRouter } from 'next/router'

/**
 * 在这里配置所有支持的语言
 * 国家-地区
 */
const LANGS = {
  'en-US': enUS,
  'zh-CN': zhCN,
  'zh-HK': zhHK,
  'zh-TW': zhTW,
  'fr-FR': frFR,
  'tr-TR': trTR,
  'ja-JP': jaJP
}

export default LANGS

/**
 * 获取当前语言字典
 * 如果匹配到完整的“国家-地区”语言，则显示国家的语言
 * @returns 不同语言对应字典
 */
export function generateLocaleDict(langString) {
  const supportedLocales = Object.keys(LANGS)
  let userLocale

  // 将语言字符串拆分为语言和地区代码，例如将 "zh-CN" 拆分为 "zh" 和 "CN"
  const [language, region] = langString?.split(/[-_]/)

  // 优先匹配语言和地区都匹配的情况
  const specificLocale = `${language}-${region}`
  if (supportedLocales.includes(specificLocale)) {
    userLocale = LANGS[specificLocale]
  }

  // 然后尝试匹配只有语言匹配的情况
  if (!userLocale) {
    const languageOnlyLocales = supportedLocales.filter(locale =>
      locale.startsWith(language)
    )
    if (languageOnlyLocales.length > 0) {
      userLocale = LANGS[languageOnlyLocales[0]]
    }
  }

  // 如果还没匹配到，则返回最接近的语言包
  if (!userLocale) {
    const fallbackLocale = supportedLocales.find(locale =>
      locale.startsWith('en')
    )
    userLocale = LANGS[fallbackLocale]
  }

  return mergeDeep({}, LANGS['en-US'], userLocale)
}

/**
 * 站点翻译
 * 借助router中的locale机制，根据locale自动切换对应的语言
 */
export function initLocale(locale, changeLang, updateLocale) {
  if (isBrowser) {
    // 如果有query参数切换语言则优先
    const queryLang =
      getQueryVariable('locale') || getQueryVariable('lang') || locale
    if (queryLang) {
      const match = queryLang.match(/[a-zA-Z]{2}(?:-[a-zA-Z]{2})?/)
      if (match) {
        const targetLang = match[0]
        changeLang(targetLang)
        const targetLocale = generateLocaleDict(targetLang)
        updateLocale(targetLocale)
      }
    }
  }
}

/**
 *  检测用户的预研偏好，跳转至对应的多语言网站
 * @param {*} lang
 * @param {*} pageId
 *
 */
export const redirectUserLang = (lang, pageId) => {
  if (!isBrowser) {
    return
  }
  // 只在首页处理跳转
  if (!window.location.pathname === '/') {
    return
  }
  // 没有开启多语言
  if (BLOG.NOTION_PAGE_ID.indexOf(',') < 0) {
    return
  }

  const userLang =
    getQueryVariable('locale') ||
    getQueryVariable('lang') ||
    window?.navigator?.language
  const siteIds = pageId?.split(',') || []

  // 默认是进首页; 如果检测到有一个多语言匹配了用户浏览器，则自动跳转过去
  for (let index = 0; index < siteIds.length; index++) {
    const siteId = siteIds[index]
    const prefix = extractLangPrefix(siteId)
    if (prefix === userLang) {
      if (window.location.pathname.indexOf(prefix) < 0) {
        window.location.href = '/' + prefix
      }
    }
  }
}