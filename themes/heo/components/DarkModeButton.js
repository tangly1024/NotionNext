import { useGlobal } from '@/lib/global'
import { Moon, Sun } from '@/components/HeroIcons'
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
        handleChangeDarkMode()
      }
    }
  })

  const handleChangeDarkMode = () => {
    toggleDarkMode()
  }

  return (
    <button
      type='button'
      id='darkModeButton'
      aria-label={
        isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
      }
      aria-pressed={isDarkMode}
      onClick={handleChangeDarkMode}
      className={`${className || ''} relative flex h-8 w-16 shrink-0 cursor-pointer items-center overflow-hidden rounded-full border border-black/10 bg-gray-200 p-2 shadow-sm transition-colors duration-300 dark:border-white/10 dark:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heo-color-primary)] focus-visible:ring-offset-2`}
    >
      <span
        aria-hidden='true'
        className={`absolute flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 motion-reduce:transition-none ${
          isDarkMode ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {isDarkMode ? <Moon /> : <Sun />}
      </span>
    </button>
  )
}

export default DarkModeButton