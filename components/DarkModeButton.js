import { useGlobal } from '@/lib/global'
import { saveDarkModeToCookies } from '@/themes/theme'

const DarkModeButton = (props) => {
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

  return <div onClick={handleChangeDarkMode} className={'px-1 dark:text-gray-200 text-gray-800 z-10 duration-200 text-xl hover:scale-110 cursor-pointer transform ' + props.className}>
    <i id='darkModeButton' className={`${isDarkMode ? 'far fa-sun' : 'far fa-moon'}`}/>
  </div>
}
export default DarkModeButton
