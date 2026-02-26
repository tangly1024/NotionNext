import { useGlobal } from '@/lib/global'
import { saveDarkModeToLocalStorage } from '@/themes/theme'
import { Moon, Sun } from '@/components/HeroIcons'
import { useImperativeHandle } from 'react'

/**
 * 深色模式按钮
 */
const DarkModeButton = (props) => {
  const { cRef, className } = props
  const { isDarkMode, updateDarkMode } = useGlobal()

  /**
   * 对外暴露方法
   */
  useImperativeHandle(cRef, () => {
    return {
      handleChangeDarkMode: () => {
        handleChangeDarkMode()
      }
    }
  })

  // 用户手动设置主题
  const handleChangeDarkMode = () => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
  }

  return <div onClick={handleChangeDarkMode} className={`${className || ''} cursor-pointer hover: scale-100 hover:bg-black hover:bg-opacity-10 rounded-full w-10 h-10 flex justify-center items-center duration-200 transition-all`}>
    <div id='darkModeButton' className=' cursor-pointer hover: scale-50 w-10 h-10 '> {isDarkMode ? <Sun /> : <Moon />}</div>
  </div>
}
export default DarkModeButton
