import BLOG from '@/blog.config'
import lang from './lang'
import { useContext, createContext } from 'react'

let locale = {}
if (BLOG.lang.slice(0, 2).toLowerCase() === 'zh') {
  switch (BLOG.lang.toLowerCase()) {
    case 'zh-cn':
    case 'zh-sg':
      locale = lang['zh-CN']
      break
    case 'zh-hk':
      locale = lang['zh-HK']
      break
    case 'zh-tw':
      locale = lang['zh-TW']
      break
    default:
      locale = lang['zh-TW']
      break
  }
} else {
  locale = lang.en
}

const LocaleContext = createContext()

export function LocaleProvider({ children }) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  )
}

export const useLocale = () => useContext(LocaleContext)
