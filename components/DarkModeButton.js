import { useTheme } from '@/lib/theme'
import localStorage from 'localStorage'

const DarkModeButton = () => {
  const { theme, changeTheme } = useTheme()
  // 用户手动设置主题
  const handleChangeDarkMode = () => {
    const newTheme = (theme === 'light' ? 'dark' : 'light')
    localStorage.setItem('theme', newTheme)
    changeTheme(newTheme)
  }
  return <div className='z-10 p-1 duration-200 mr-2 h-12 text-xl cursor-pointer dark:text-gray-300 '>
    <i className={'fa p-2.5 hover:scale-125 transform duration-200 ' + (theme === 'dark' ? 'fa-sun-o' : 'fa-moon-o') } onClick={handleChangeDarkMode} />
  </div>
}
export default DarkModeButton
