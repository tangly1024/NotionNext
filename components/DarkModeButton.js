import { loadUserThemeFromCookies, saveTheme, useGlobal } from '@/lib/global'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const DarkModeButton = () => {
  const { changeTheme } = useGlobal()
  const userTheme = loadUserThemeFromCookies()

  // 用户手动设置主题
  const handleChangeDarkMode = () => {
    const newTheme = (userTheme === 'light' ? 'dark' : 'light')
    saveTheme(newTheme)
    changeTheme(newTheme)
  }
  return <div className='z-10 duration-200 text-xs cursor-pointer py-1.5 px-1'>
    <FontAwesomeIcon icon={userTheme === 'dark' ? faSun : faMoon} id='darkModeButton' className='hover:scale-125 transform duration-200'
       onClick={handleChangeDarkMode} />
  </div>
}
export default DarkModeButton
