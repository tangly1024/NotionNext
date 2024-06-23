import { useGlobal } from '@/lib/global'
import LANGS from '@/lib/lang'
import { getQueryParam } from '@/lib/utils'
import { THEMES } from '@/themes/theme'
import { useRouter } from 'next/router'
import { useState } from 'react'
import DarkModeButton from './DarkModeButton'
import { Draggable } from './Draggable'
/**
 *
 * @returns 主题切换
 */
const ThemeSwitch = () => {
  const { theme, lang, changeLang, locale, isDarkMode, toggleDarkMode } =
    useGlobal()
  const router = useRouter()
  const currentTheme = getQueryParam(router.asPath, 'theme') || theme
  //   const currentLang = getQueryParam(router.asPath, 'lang') || lang
  const [isLoading, setIsLoading] = useState(false)

  // 修改当前路径url中的 theme 参数
  // 例如 http://localhost?theme=hexo 跳转到 http://localhost?theme=newTheme
  const onThemeSelectChange = e => {
    document.ontouchmove =
      document.ontouchend =
      document.onmousemove =
      document.onmouseup =
        null
    setIsLoading(true)
    const newTheme = e.target.value
    const query = router.query
    query.theme = newTheme
    router.push({ pathname: router.pathname, query }).then(() => {
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    })
  }

  const onLangSelectChange = e => {
    document.ontouchmove =
      document.ontouchend =
      document.onmousemove =
      document.onmouseup =
        null
    const newLang = e.target.value
    changeLang(newLang)
  }

  return (
    <>
      <Draggable>
        <div
          id='draggableBox'
          style={{ left: '0px', top: '80vh' }}
          className='fixed group hover:scale-105 transition-all space-y-2 overflow-hidden z-50 p-3 flex flex-col items-start dark:text-white bg-white dark:bg-black rounded-xl shadow-lg '>
          {/* 主题切换按钮 */}
          <div className='text-sm flex items-center group-hover:w-32 transition-all duration-200'>
            <i className='fa-solid fa-palette w-5' />
            <div className='w-0 group-hover:w-24 transition-all duration-200 overflow-hidden'>
              <label htmlFor='themeSelect' className='sr-only'>
                {locale.COMMON.THEME}
              </label>
              <select
                id='themeSelect'
                value={currentTheme}
                onChange={onThemeSelectChange}
                name='themes'
                className='pl-1 bg-gray-50 dark:bg-black appearance-none outline-none dark:text-white uppercase cursor-pointer'>
                {THEMES?.map(t => {
                  return (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          {/* 深色按钮 */}
          <div className='text-sm flex items-center w-0 group-hover:w-32 transition-all duration-200'>
            <DarkModeButton />
            <div
              onClick={toggleDarkMode}
              className='cursor-pointer w-0 group-hover:w-24 transition-all duration-200 overflow-hidden whitespace-nowrap pl-1 h-auto'>
              {isDarkMode ? locale.MENU.DARK_MODE : locale.MENU.LIGHT_MODE}
            </div>
          </div>

          {/* 翻译按钮 */}
          <div className='text-sm flex items-center group-hover:w-32 transition-all duration-200'>
            <i className='fa-solid fa-language w-5' />
            <div className='w-0 group-hover:w-24 transition-all duration-200 overflow-hidden'>
              <label htmlFor='langSelect' className='sr-only'>
                选择语言：
              </label>
              <select
                id='langSelect'
                value={lang}
                onChange={onLangSelectChange}
                name='themes'
                className='pl-1 bg-gray-50 dark:bg-black appearance-none outline-none dark:text-white uppercase cursor-pointer'>
                {Object.keys(LANGS)?.map(t => {
                  return (
                    <option key={t} value={t}>
                      {LANGS[t].LOCALE}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </div>
      </Draggable>

      {/* 切换主题加载时的全屏遮罩 */}
      <div
        className={`${isLoading ? 'opacity-90 ' : 'opacity-0'} 
            w-screen h-screen glassmorphism bg-black text-white shadow-text flex justify-center items-center
            transition-all fixed top-0 left-0 pointer-events-none duration-1000 z-50 shadow-inner`}>
        <i className='text-3xl mr-5 fas fa-spinner animate-spin' />
      </div>
    </>
  )
}

export default ThemeSwitch
