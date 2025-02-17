import CONFIG from '../config'
import { siteConfig } from '@/lib/config'
import { useTheme } from 'next-themes'

export default function FloatDarkModeButton() {
  const { resolvedTheme, setTheme } = useTheme()

  if (!siteConfig('WIDGET_DARK_MODE', null, CONFIG)) {
    return <></>
  }

  const isDarkMode = resolvedTheme === 'dark'

  function handleChangeDarkMode() {
    setTheme(isDarkMode ? 'light' : 'dark')
  }

  return (
    <div
      className={'justify-center items-center text-center'}
      onClick={handleChangeDarkMode}>
      <i
        id='darkModeButton'
        className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas transform hover:scale-105 duration-200
                 text-white bg-indigo-700  w-10 h-10  py-2.5 rounded-full dark:bg-black cursor-pointer`}
      />
    </div>
  )
}
