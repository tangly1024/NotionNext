import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { ALL_THEME } from '@/lib/theme'

/**
 *
 * @returns 主题切换
 */
export function ThemeSwitch () {
  const GlobalConfig = useGlobal()
  const router = useRouter()
  const { theme, setTheme } = GlobalConfig
  const themeOptions = []
  ALL_THEME.forEach(t => {
    themeOptions.push({ value: t, text: t })
  })

  function switchTheme () {
    const currentIndex = ALL_THEME.indexOf(theme)
    const newIndex = currentIndex < ALL_THEME.length - 1 ? currentIndex + 1 : 0
    changeTheme(ALL_THEME[newIndex])
  }
  /**
   * 切换主题
   */
  function changeTheme (theme) {
    router.query.theme = ''
    setTheme(theme)
  }

  return (
    <div draggable="true" className="fixed left-4 bottom-12 text-white bg-black rounded z-50">
      <div className="p-2 cursor-pointer" onClick={switchTheme}>
        <i className="fas fa-sync mr-1" />
        切换主题：{theme}
      </div>
    </div>
  )
}
