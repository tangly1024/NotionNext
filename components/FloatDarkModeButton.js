import { useEffect, useState } from 'react'
import { useGlobal } from '@/lib/global'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BLOG from '@/blog.config'
import { loadUserThemeFromCookies, saveTheme } from '@/lib/theme'

export default function FloatDarkModeButton () {
  if (!BLOG.widget?.showDarkMode) {
    return <></>
  }
  const [show, switchShow] = useState(false)
  const scrollListener = () => {
    const scrollY = window.pageYOffset
    const shouldShow = scrollY > 100
    if (shouldShow !== show) {
      switchShow(shouldShow)
    }
  }
  useEffect(() => {
    scrollListener()
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [show])

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
      id='float-dark-mode-button'
      onClick={handleChangeDarkMode}
      className={
        (show ? '' : ' hidden ') +
        ' animate__fadeInRight animate__animated animate__faster  fixed right-1 bottom-28 z-10 duration-500 text-xs cursor-pointer ' +
        ' text-black dark:border-gray-500 flex justify-center items-center w-8 h-8 glassmorphism dark:bg-gray-700 dark:text-gray-200'
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
