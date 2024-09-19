import { useGlobal } from '@/lib/global'
import { getQueryParam } from '@/lib/utils'
import { THEMES } from '@/themes/theme'
import { useRouter } from 'next/router'
import { useState } from 'react'
import DarkModeButton from './DarkModeButton'
import { Draggable } from './Draggable'
import LazyImage from './LazyImage'
import SideBarDrawer from './SideBarDrawer'
/**
 *
 * @returns 主题切换
 */
const ThemeSwitch = () => {
  const { theme, locale, isDarkMode, toggleDarkMode } = useGlobal()
  const router = useRouter()
  const currentTheme = getQueryParam(router.asPath, 'theme') || theme
  const [sideBarVisible, setSideBarVisible] = useState(false)

  const changeTheme = newTheme => {
    const query = router.query
    query.theme = newTheme
    router.push({ pathname: router.pathname, query }).then(() => {})
  }

  return (
    <>
      {/* 悬浮的主题切换按钮 */}
      <Draggable stick={true}>
        <div
          id='draggableBox'
          style={{ left: '0px', top: '80vh' }}
          className='border fixed group flex flex-col items-start space-y-2 overflow-hidden z-20 p-3
                    dark:text-white bg-white dark:bg-black 
                      rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl   '>
          {/* 主题切换按钮 */}
          <div className='text-sm flex items-center group-hover:w-44 h-4 text-center duration-200'>
            <i
              className='cursor-pointer fa-solid fa-palette w-5 '
              onClick={() => {
                setSideBarVisible(true)
              }}
              onTouchStart={() => {
                setSideBarVisible(true)
              }}
            />
            <div className='w-0 group-hover:w-32 duration-200 overflow-hidden'>
              <label htmlFor='themeSelect' className='sr-only'>
                {locale.COMMON.THEME}
              </label>
              {/* 点击弹出主题切换面板 */}
              <div
                onClick={() => {
                  setSideBarVisible(true)
                }}
                className='uppercase cursor-pointer'
                title='Click To Switch Theme'
                alt='Click To Switch Theme'>
                {currentTheme}
              </div>
            </div>
          </div>
        </div>
      </Draggable>

      <SideBarDrawer
        className='p-10'
        isOpen={sideBarVisible}
        showOnPC={true}
        onClose={() => {
          setSideBarVisible(false)
        }}>
        {/* 开关 */}
        <div className='flex items-center justify-between font-bold dark:text-white'>
          {/* 深色模式切换 */}
          <div className='border text-sm flex items-center w-32 duration-200 hover:bg-green-500 p-2'>
            <DarkModeButton />
            <div
              onClick={toggleDarkMode}
              className='cursor-pointer w-24 duration-200 overflow-hidden whitespace-nowrap pl-1 h-auto'>
              {isDarkMode ? locale.MENU.DARK_MODE : locale.MENU.LIGHT_MODE}
            </div>
          </div>

          {/* 关闭 */}
          <div
            className='hover:bg-green-500 px-2 py-1 duration-200 cursor-pointer'
            onClick={() => {
              setSideBarVisible(false)
            }}>
            <i className='fas fa-times' />
          </div>
        </div>

        <hr className='my-4' />

        <div>点击下方主题进行切换.</div>
        <div> Click below to switch the theme.</div>

        {/* 陈列所有主题 */}
        <div>
          {THEMES?.map(t => {
            return (
              <div
                className='my-6'
                key={t}
                onClick={() => {
                  changeTheme(t)
                }}>
                <div className='text-lg dark:text-white font-bold uppercase mb-4'>
                  {t}
                </div>
                <LazyImage
                  src={`/images/themes-preview/${t}.png`}
                  className='cursor-pointer shadow-lg rounded-xl hover:scale-110 duration-200'
                />
              </div>
            )
          })}
        </div>
      </SideBarDrawer>
    </>
  )
}

export default ThemeSwitch
