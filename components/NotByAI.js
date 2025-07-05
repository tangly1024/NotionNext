import { useGlobal } from '@/lib/global'

const LANGS = {
  'en-US': 'en',
  'zh-CN': 'zh',
  'zh-HK': 'zh-HK',
  'zh-TW': 'zh-TW',
  'fr-FR': 'fr',
  'tr-TR': 'tr',
  'ja-JP': 'ja'
}

/**
 * 获取当前not-by-ai文件路径
 * 如果匹配到完整的“国家-地区”语言，则显示国家的语言
 * @returns string
 */
export function generateNotByAiPath(langString) {
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

  // 如果还没匹配到，则返回最接近的
  if (!userLocale) {
    const fallbackLocale = supportedLocales.find(locale =>
      locale.startsWith('en')
    )
    userLocale = LANGS[fallbackLocale]
  }

  return userLocale ?? 'zh'
}

/**
 * 版权声明
 * @returns
 */
export default function NotByAI() {
  const { lang, isDarkMode } = useGlobal()

  return (
    <img
      className='transform hover:scale-110 duration-150'
      src={`/svg/not-by-ai/${generateNotByAiPath(lang)}/Written-By-Human-Not-By-AI-Badge-${isDarkMode ? 'black' : 'white'}.svg`}
      alt='not-by-ai'
    />
  )
}
