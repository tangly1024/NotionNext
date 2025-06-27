import { useGlobal } from '@/lib/global'
import { useImperativeHandle } from 'react'
import { Moon, Sun } from './HeroIcons'

/**
 * 深色模式按钮
 */
const DarkModeButton = props => {
  const { cRef, className } = props
  const { isDarkMode, toggleDarkMode } = useGlobal()

  /**
   * 对外暴露方法
   */
  useImperativeHandle(cRef, () => {
    return {
      handleChangeDarkMode: () => {
        toggleDarkMode()
      }
    }
  })

  return (
    <div
      className={`${className || ''} flex justify-center dark:text-gray-200 text-gray-800`}>
      <div
        onClick={toggleDarkMode}
        id='darkModeButton'
        className=' hover:scale-110 cursor-pointer transform duration-200 w-5 h-5'>
        {' '}
        {isDarkMode ? <Sun /> : <Moon />}
      </div>
    </div>
  )
}
export default DarkModeButton
