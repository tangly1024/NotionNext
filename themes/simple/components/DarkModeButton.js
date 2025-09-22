import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import { saveDarkModeToLocalStorage } from '@/themes/theme'
import CONFIG from '../config'

/**
 * 暗黑模式切换按钮 - Simple主题版本
 */
export default function DarkModeButton() {
  const { isDarkMode, updateDarkMode } = useGlobal()

  // 如果配置中禁用了暗黑模式，则不显示按钮
  if (!siteConfig('SIMPLE_DARK_MODE', true, CONFIG)) {
    return null
  }

  // 切换暗黑模式
  const handleToggleDarkMode = () => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
  }

  return (
    <div
      onClick={handleToggleDarkMode}
      className="cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
      aria-label={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
    >
      <i
        className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas text-blue-400 dark:text-blue-300`}
      />
    </div>
  )
}