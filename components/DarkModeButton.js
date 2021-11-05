import { loadUserThemeFromCookies, saveTheme, useGlobal } from '@/lib/global'

const DarkModeButton = () => {
  const { changeTheme } = useGlobal()
  const userTheme = loadUserThemeFromCookies()
  // 用户手动设置主题
  const handleChangeDarkMode = () => {
    const newTheme = (userTheme === 'light' ? 'dark' : 'light')
    saveTheme(newTheme)
    changeTheme(newTheme)
  }
  return <div className='z-10 duration-200 text-xl cursor-pointer'>
    <i id='darkModeButton' className={'fa p-2.5 hover:scale-125 transform duration-200 ' + (userTheme === 'dark' ? 'fa-sun-o' : 'fa-moon-o')}
       onClick={handleChangeDarkMode} />
  </div>
}
export default DarkModeButton
