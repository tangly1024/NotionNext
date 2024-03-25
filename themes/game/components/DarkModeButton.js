import { useGlobal } from '@/lib/global'
import { useImperativeHandle } from 'react'

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
      onClick={toggleDarkMode}
      className={`${className || ''} flex items-center`}>
      <i
        className={`w-6 mr-2 fas ${isDarkMode ? 'fa-sun' : 'fa-moon px-0.5'}`}
      />
      {isDarkMode ? 'Dark Mode' : 'Light Mode'}{' '}
    </div>
  )
}
export default DarkModeButton
