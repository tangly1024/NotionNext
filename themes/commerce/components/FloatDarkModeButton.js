import CONFIG from '../config'
import { useTheme } from 'next-themes'

export default function FloatDarkModeButton() {
  const { resolvedTheme, setTheme } = useTheme()
  if (!CONFIG.WIDGET_DARK_MODE) {
    return <></>
  }

  const isDarkMode = resolvedTheme === 'dark'

  function handleChangeDarkMode() {
    setTheme(isDarkMode ? 'light' : 'dark')
  }

  return (
    <div
      onClick={handleChangeDarkMode}
      className={
        'justify-center items-center w-7 h-7 text-center transform hover:scale-105 duration-200'
      }>
      <i
        id='darkModeButton'
        className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas text-xs`}
      />
    </div>
  )
}
