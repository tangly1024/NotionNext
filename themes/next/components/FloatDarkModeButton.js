import { useGlobal } from '@/lib/global'
import { saveDarkModeToLocalStorage } from '@/themes/theme'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

export default function FloatDarkModeButton () {
  const { isDarkMode, updateDarkMode } = useGlobal()

  if (!siteConfig('NEXT_WIDGET_DARK_MODE', null, CONFIG)) {
    return <></>
  }

  // 用户手动设置主题
  const handleChangeDarkMode = () => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
  }

  return (
    <div
      onClick={handleChangeDarkMode}
      className={ ' text-black dark:border-gray-500 flex justify-center items-center dark:text-gray-200 py-2 px-3'
      }
    >
      <i
        id="darkModeButton"
        className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas hover:scale-150 transform duration-200`}
      />
    </div>
  )
}
