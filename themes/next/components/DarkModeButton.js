import { useTheme } from 'next-themes'

const DarkModeButton = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const isDarkMode = resolvedTheme === 'dark'

  function handleChangeDarkMode() {
    setTheme(isDarkMode ? 'light' : 'dark')
  }

  return (
    <div className='z-10 duration-200 text-xs cursor-pointer py-1.5 px-1'>
      <i
        id='darkModeButton'
        className={`hover:scale-125 transform duration-200 fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}
        onClick={handleChangeDarkMode}
      />
    </div>
  )
}
export default DarkModeButton
