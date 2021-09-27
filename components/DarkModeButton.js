import { useTheme } from '@/lib/theme'
import localStorage from 'localStorage'

const DarkModeButton = () => {
  const { theme, changeTheme } = useTheme()
  const handleChangeDarkMode = () => {
    const newTheme = (theme === 'light' ? 'dark' : 'light')
    changeTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }
  return <div onClick={handleChangeDarkMode}
        className=' justify-center align-middle font-bold text-xl rounded cursor-pointer text-gray-600 hover:scale-125 transform duration-200
                dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-100 dark:hover:text-black'>
     <span className={'fa px-1 ' + (theme === 'dark' ? ' fa-sun-o' : ' fa-moon-o')} />
   </div>
}
export default DarkModeButton
