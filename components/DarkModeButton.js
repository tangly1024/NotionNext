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
  return <div className='z-10 duration-200 text-xl cursor-pointer'>
    <FontAwesomeIcon icon={userTheme === 'dark' ? faSun : faMoon} id='darkModeButton' className='mx-2 my-2 hover:scale-125 transform duration-200'
       onClick={handleChangeDarkMode} />
  </div>
}
export default DarkModeButton
