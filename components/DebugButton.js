import { useGlobal } from '@/lib/global'
import { ThemeMap } from '@/themes'
import { useState } from 'react'

/**
 *
 * @returns 调试面板
 */
export function DebugButton () {
  const [show, setShow] = useState(false)
  const GlobalConfig = useGlobal()
  const { theme, setTheme } = GlobalConfig
  const allThemes = Object.keys(ThemeMap)
  function toggleShow () {
    setShow(!show)
  }

  /**
   * 切换主题
   */
  function changeTheme () {
    const currentIndex = allThemes.indexOf(theme)
    const newIndex = currentIndex < allThemes.length - 1 ? currentIndex + 1 : 0
    setTheme(allThemes[newIndex])
  }

  return <>
  <div className={`w-full text-sm font-sans h-72 p-5 bg-white fixed right-0 bottom-0 z-40 shadow-card duration-200 ${show ? '' : '-bottom-72'}`}>
    <div className='flex space-x-1'>
        <div className='font-bold'>当前主题:</div>
        <div>{theme}</div>
    </div>
    <div className='flex space-x-1'>
        <div className='font-bold'>所有主题:</div>
        <div>{allThemes.join(',')}</div>
    </div>
    <div className='flex space-x-1'>
        <div className='bg-blue-500 text-white p-2 cursor-pointer' onClick={changeTheme}>更换主题</div>
    </div>
    <div>
        <div className='font-bold w-18'>所有配置:</div>
        <div><p>{JSON.stringify(GlobalConfig)}</p></div>
    </div>
  </div>

  <div className="fixed right-20 bottom-12 z-50">
        <div className="bg-gray-50 text-sm dark:bg-black dark:text-white shadow-2xl p-2.5 rounded-md bg-opacity-75 cursor-pointer" onClick={toggleShow}>调试按钮</div>
    </div>
  </>
}
