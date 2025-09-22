import { useGlobal } from '@/lib/global'
import { saveDarkModeToLocalStorage } from '@/themes/theme'
import { useRouter } from 'next/router'

/**
 * 通用暗黑模式切换按钮组件
 * 统一各主题的暗黑模式实现
 */
const UnifiedDarkModeButton = ({ 
  className = '',
  showText = false,
  iconSize = 'text-sm',
  variant = 'default' // 'default', 'float', 'minimal'
}) => {
  const { isDarkMode, updateDarkMode } = useGlobal()
  const router = useRouter()

  // 切换暗黑模式
  const handleToggleDarkMode = () => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
  }

  // 根据variant返回不同的样式
  const getButtonStyles = () => {
    const baseStyles = 'cursor-pointer transition-all duration-200'
    
    switch (variant) {
      case 'float':
        return `${baseStyles} justify-center items-center w-7 h-7 text-center transform hover:scale-105`
      case 'minimal':
        return `${baseStyles} z-10 py-1.5 px-1`
      default:
        return `${baseStyles} inline-flex items-center`
    }
  }

  // 获取图标
  const renderIcon = () => {
    if (variant === 'float') {
      // hexo主题风格的浮动按钮
      return (
        <i
          className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas ${iconSize}`}
        />
      )
    }

    // starter/proxio主题风格的SVG图标
    return (
      <>
        <span className={`block ${router.route === '/' ? 'text-white' : ''} dark:hidden`}>
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.3125 1.50001C12.675 1.31251 12.0375 1.16251 11.3625 1.05001C10.875 0.975006 10.35 1.23751 10.1625 1.68751C9.93751 2.13751 10.05 2.70001 10.425 3.00001C13.0875 5.47501 14.0625 9.11251 12.975 12.525C11.775 16.3125 8.25001 18.975 4.16251 19.0875C3.63751 19.0875 3.22501 19.425 3.07501 19.9125C2.92501 20.4 3.15001 20.925 3.56251 21.1875C4.50001 21.75 5.43751 22.2 6.37501 22.5C7.46251 22.8375 8.58751 22.9875 9.71251 22.9875C11.625 22.9875 13.5 22.5 15.1875 21.5625C17.85 20.1 19.725 17.7375 20.55 14.8875C22.1625 9.26251 18.975 3.37501 13.3125 1.50001ZM18.9375 14.4C18.2625 16.8375 16.6125 18.825 14.4 20.0625C12.075 21.3375 9.41251 21.6 6.90001 20.85C6.63751 20.775 6.33751 20.6625 6.07501 20.55C10.05 19.7625 13.35 16.9125 14.5875 13.0125C15.675 9.56251 15 5.92501 12.7875 3.07501C17.5875 4.68751 20.2875 9.67501 18.9375 14.4Z" />
          </svg>
        </span>

        <span className="hidden text-white dark:block">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2172_3070)">
              <path d="M12 6.89999C9.18752 6.89999 6.90002 9.18749 6.90002 12C6.90002 14.8125 9.18752 17.1 12 17.1C14.8125 17.1 17.1 14.8125 17.1 12C17.1 9.18749 14.8125 6.89999 12 6.89999ZM12 15.4125C10.125 15.4125 8.58752 13.875 8.58752 12C8.58752 10.125 10.125 8.58749 12 8.58749C13.875 8.58749 15.4125 10.125 15.4125 12C15.4125 13.875 13.875 15.4125 12 15.4125Z" />
              <path d="M12 4.2375C12.45 4.2375 12.8625 3.8625 12.8625 3.375V1.5C12.8625 1.05 12.4875 0.637497 12 0.637497C11.55 0.637497 11.1375 1.0125 11.1375 1.5V3.4125C11.175 3.8625 11.55 4.2375 12 4.2375Z" />
              <path d="M12 19.7625C11.55 19.7625 11.1375 20.1375 11.1375 20.625V22.5C11.1375 22.95 11.5125 23.3625 12 23.3625C12.45 23.3625 12.8625 22.9875 12.8625 22.5V20.5875C12.8625 20.1375 12.45 19.7625 12 19.7625Z" />
              <path d="M22.5 11.1375H20.5875C20.1375 11.1375 19.725 11.5125 19.725 12C19.725 12.45 20.1 12.8625 20.5875 12.8625H22.5C22.95 12.8625 23.3625 12.4875 23.3625 12C23.3625 11.55 22.95 11.1375 22.5 11.1375Z" />
              <path d="M4.23751 12C4.23751 11.55 3.86251 11.1375 3.37501 11.1375H1.50001C1.05001 11.1375 0.637512 11.5125 0.637512 12C0.637512 12.45 1.01251 12.8625 1.50001 12.8625H3.41251C3.86251 12.8625 4.23751 12.45 4.23751 12Z" />
              <path d="M18.675 5.32501L19.875 4.12501C20.2125 3.78751 20.2125 3.26251 19.875 2.92501C19.725 2.77501 19.5 2.66251 19.275 2.66251C19.05 2.66251 18.825 2.73751 18.675 2.92501L17.475 4.12501C17.1375 4.46251 17.1375 4.98751 17.475 5.32501C17.8125 5.66251 18.3375 5.66251 18.675 5.32501Z" />
              <path d="M5.32501 17.5125L4.12501 18.675C3.78751 19.0125 3.78751 19.5375 4.12501 19.875C4.27501 20.025 4.50001 20.1375 4.72501 20.1375C4.95001 20.1375 5.17501 20.0625 5.32501 19.875L6.52501 18.675C6.86251 18.3375 6.86251 17.8125 6.52501 17.475C6.18751 17.175 5.62501 17.175 5.32501 17.5125Z" />
              <path d="M19.875 17.475C19.5375 17.1375 19.0125 17.1375 18.675 17.475C18.3375 17.8125 18.3375 18.3375 18.675 18.675L19.875 19.875C20.025 20.025 20.25 20.1375 20.475 20.1375C20.7 20.1375 20.925 20.0625 21.075 19.875C21.4125 19.5375 21.4125 19.0125 21.075 18.675L19.875 17.475Z" />
              <path d="M6.52501 5.32501C6.86251 5.66251 7.38751 5.66251 7.72501 5.32501C8.06251 4.98751 8.06251 4.46251 7.72501 4.12501L6.52501 2.92501C6.37501 2.77501 6.15001 2.66251 5.92501 2.66251C5.70001 2.66251 5.47501 2.73751 5.32501 2.92501C4.98751 3.26251 4.98751 3.78751 5.32501 4.12501L6.52501 5.32501Z" />
            </g>
            <defs>
              <clipPath id="clip0_2172_3070">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </span>
      </>
    )
  }

  const buttonText = showText ? (isDarkMode ? '浅色模式' : '深色模式') : null

  return (
    <div
      onClick={handleToggleDarkMode}
      className={`${getButtonStyles()} ${className}`}
      aria-label={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleToggleDarkMode()
        }
      }}
    >
      {renderIcon()}
      {buttonText && <span className="ml-2">{buttonText}</span>}
    </div>
  )
}

export default UnifiedDarkModeButton