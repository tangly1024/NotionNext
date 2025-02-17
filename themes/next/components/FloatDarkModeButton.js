import CONFIG from '../config'
import { siteConfig } from '@/lib/config'
import { useTheme } from 'next-themes'

export default function FloatDarkModeButton() {
  const { resolvedTheme, setTheme } = useTheme()

  if (!siteConfig('NEXT_WIDGET_DARK_MODE', null, CONFIG)) {
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
        ' text-black dark:border-gray-500 flex justify-center items-center dark:text-gray-200 py-2 px-3'
      }>
      <i
        id='darkModeButton'
        className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas hover:scale-150 transform duration-200`}
      />
    </div>
  )
}
