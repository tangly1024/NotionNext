import { useGlobal } from '@/lib/global'
import { saveDarkModeToCookies } from '@/lib/theme'
import CONFIG_HEXO from '../config_hexo'

export default function FloatDarkModeButton () {
  if (!CONFIG_HEXO.WIDGET_DARK_MODE) {
    return <></>
  }

  const { isDarkMode, updateDarkMode } = useGlobal()
  // 用户手动设置主题
  const handleChangeDarkMode = () => {
    const newStatus = !isDarkMode
    saveDarkModeToCookies(newStatus)
    updateDarkMode(newStatus)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
  }

  return (
    <div
      onClick={handleChangeDarkMode}
      className={'justify-center items-center w-7 h-7 text-center transform hover:scale-105 duration-200'
      }
    >
      <i id="darkModeButton" className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas text-xs`}/>
    </div>
  )
}
