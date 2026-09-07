import { Moon, Sun } from '@/components/HeroIcons'
import { useGlobal } from '@/lib/global'

export default function DarkModeButton() {
  const { isDarkMode, toggleDarkMode } = useGlobal()

  return (
    <button
      type='button'
      className='editorial-icon-button'
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
      <span className='editorial-icon'>
        {isDarkMode ? <Sun /> : <Moon />}
      </span>
    </button>
  )
}
