import { useGlobal } from '@/lib/global'
import { loadUserThemeFromCookies, saveTheme } from '@/lib/theme'
import CONFIG_NEXT from '../config_next'

export default function FloatDarkModeButton () {
  if (!CONFIG_NEXT.WIDGET_DARK_MODE) {
    return <></>
  }

  const { changeTheme } = useGlobal()
  const userTheme = loadUserThemeFromCookies()
  // 用户手动设置主题
  const handleChangeDarkMode = () => {
    const newTheme = userTheme === 'light' ? 'dark' : 'light'
    saveTheme(newTheme)
    changeTheme(newTheme)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(userTheme)
    htmlElement.classList?.add(newTheme)
  }

  return (
    <div
      onClick={handleChangeDarkMode}
      className={ ' text-black dark:border-gray-500 flex justify-center items-center dark:text-gray-200 py-2 px-3'
      }
    >
      <i
        id="darkModeButton"
        className={`${userTheme === 'dark' ? 'fa-sun' : 'fa-moon'} fas hover:scale-150 transform duration-200`}
      />
    </div>
  )
}
