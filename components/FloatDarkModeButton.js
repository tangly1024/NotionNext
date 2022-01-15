import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { loadUserThemeFromCookies, saveTheme } from '@/lib/theme'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function FloatDarkModeButton () {
  if (!BLOG.widget?.showDarkMode) {
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
      <FontAwesomeIcon
        icon={userTheme === 'dark' ? faSun : faMoon}
        id="darkModeButton"
        className="hover:scale-150 transform duration-200"
      />
    </div>
  )
}
