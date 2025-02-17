import { useImperativeHandle } from 'react'
import { useTheme } from 'next-themes'

/**
 * 深色模式按钮
 */
const DarkModeButton = props => {
  const { cRef, className } = props
  const { resolvedTheme, setTheme } = useTheme()
  const isDarkMode = resolvedTheme === 'dark'

  function handleChangeDarkMode() {
    setTheme(isDarkMode ? 'light' : 'dark')
  }

  /**
   * 对外暴露方法
   */
  useImperativeHandle(cRef, () => {
    return {
      handleChangeDarkMode: handleChangeDarkMode
    }
  })

  return (
    <div
      onClick={handleChangeDarkMode}
      className={`${className || ''} flex items-center`}>
      <i
        className={`w-6 mr-2 fas ${isDarkMode ? 'fa-sun' : 'fa-moon px-0.5'}`}
      />
      {isDarkMode ? 'Dark Mode' : 'Light Mode'}{' '}
    </div>
  )
}
export default DarkModeButton
