import { useRouter } from 'next/router'
import { useState } from 'react'

/**
 * 语言切换按钮
 * 支持多语言切换，显示下拉菜单
 */
const LanguageSwitcher = () => {
  const router = useRouter()
  const { locale, locales, asPath } = router
  const [isOpen, setIsOpen] = useState(false)

  // 语言代码到显示名称的映射
  const languageNames = {
    'zh-CN': '中文',
    'zh-TW': '繁體中文',
    'zh-HK': '繁體中文(香港)',
    'en': 'English',
    'en-US': 'English',
    'ja-JP': '日本語',
    'fr-FR': 'Français',
    'tr-TR': 'Türkçe'
  }

  // 语言代码到国旗 emoji 的映射
  const languageFlags = {
    'zh-CN': '🇨🇳',
    'zh-TW': '🇹🇼',
    'zh-HK': '🇭🇰',
    'en': '🇺🇸',
    'en-US': '🇺🇸',
    'ja-JP': '🇯🇵',
    'fr-FR': '🇫🇷',
    'tr-TR': '🇹🇷'
  }

  // 如果只有一种语言，不显示切换按钮
  if (!locales || locales.length <= 1) {
    return null
  }

  // 切换语言
  const handleLanguageChange = (newLocale) => {
    // 构建新的路径
    let newPath = asPath

    // 如果当前路径已经包含 locale 前缀，则替换
    if (locale && locale !== 'zh-CN') {
      newPath = asPath.replace(`/${locale}`, `/${newLocale}`)
    } else if (newLocale !== 'zh-CN') {
      // 如果要切换到非默认语言，添加 locale 前缀
      newPath = `/${newLocale}${asPath}`
    }

    // 使用 router.push 进行导航
    router.push(newPath, newPath, { locale: newLocale })
    setIsOpen(false)
  }

  const currentLanguage = languageNames[locale] || locale
  const currentFlag = languageFlags[locale] || '🌐'

  return (
    <div className='relative inline-block text-left'>
      {/* 语言切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
        title='切换语言 / Switch Language'
        aria-label='Language Switcher'>
        <span className='text-xl'>{currentFlag}</span>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <>
          {/* 点击外部关闭菜单的遮罩层 */}
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
          />

          {/* 语言选项列表 */}
          <div className='absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20'>
            <div className='py-1' role='menu'>
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLanguageChange(loc)}
                  className={`
                    w-full text-left px-4 py-2 text-sm flex items-center justify-between
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150
                    ${locale === loc ? 'bg-gray-50 dark:bg-gray-700 font-semibold' : ''}
                  `}
                  role='menuitem'>
                  <span className='flex items-center'>
                    <span className='mr-2 text-lg'>{languageFlags[loc] || '🌐'}</span>
                    <span className='text-gray-900 dark:text-gray-100'>
                      {languageNames[loc] || loc}
                    </span>
                  </span>
                  {locale === loc && (
                    <span className='text-blue-600 dark:text-blue-400'>
                      <i className='fas fa-check' />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSwitcher
