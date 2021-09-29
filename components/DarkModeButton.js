import { useTheme } from '@/lib/theme'
import localStorage from 'localStorage'

const DarkModeButton = () => {
  const { theme, changeTheme } = useTheme()
  const handleChangeDarkMode = () => {
    const newTheme = (theme === 'light' ? 'dark' : 'light')
    changeTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }
  return <div className='z-10 p-1 border hover:shadow-xl duration-200 dark:border-gray-500 mr-2 h-12 my-2 bg-white dark:bg-gray-600 dark:bg-opacity-70 bg-opacity-70 dark:hover:bg-gray-100 text-xl cursor-pointer dark:text-gray-300 dark:hover:text-black'>
    <i className={'fa p-2.5 hover:scale-125 transform duration-200 ' + (theme === 'dark' ? ' fa-sun-o' : ' fa-moon-o') } onClick={handleChangeDarkMode} />
  </div>
}
export default DarkModeButton
