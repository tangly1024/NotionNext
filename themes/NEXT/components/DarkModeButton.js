import { useGlobal } from '@/lib/global'
import { loadDarkModeFromCookies, saveDarkModeToCookies } from '@/lib/theme'

const DarkModeButton = () => {
  const { updateDarkMode } = useGlobal()
  const isDarkMode = loadDarkModeFromCookies()

  // 用户手动设置主题
  const handleChangeDarkMode = () => {
    const newTheme = (isDarkMode ? 'dark' : 'light')
    saveDarkModeToCookies(newTheme)
    updateDarkMode(newTheme)
  }
  return <div className='z-10 duration-200 text-xs cursor-pointer py-1.5 px-1'>
    <i id='darkModeButton' className={`hover:scale-125 transform duration-200 fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}
       onClick={handleChangeDarkMode} />
  </div>
}
export default DarkModeButton
