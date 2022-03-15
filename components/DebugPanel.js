import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Select from './Select'
/**
 *
 * @returns 调试面板
 */
export function DebugPanel () {
  const [show, setShow] = useState(false)
  const GlobalConfig = useGlobal()
  const router = useRouter()
  const { theme, setTheme } = GlobalConfig
  const allThemes = Object.keys(ThemeMap)
  const themeOptions = []
  allThemes.forEach(t => {
    themeOptions.push({ value: t, text: t })
  })

  function toggleShow () {
    setShow(!show)
  }

  function switchTheme () {
    const currentIndex = allThemes.indexOf(theme)
    const newIndex = currentIndex < allThemes.length - 1 ? currentIndex + 1 : 0
    changeTheme(allThemes[newIndex])
  }

  useEffect(() => {
    const theme = router.query.theme
    if (theme && allThemes.indexOf(theme) > -1) {
      changeTheme(theme)
    }
  })

  /**
   * 切换主题
   */
  function changeTheme (theme) {
    router.query.theme = ''
    setTheme(theme)
  }

  function filterResult (text) {
    switch (text) {
      case 'true':
        return <span className='text-green-500'>true</span>
      case 'false':
        return <span className='text-red-500'>false</span>
      case '':
        return '-'
    }
    return text
  }

  return (
    <>
      {/* 调试按钮 */}
      <div
        className={`${
          show ? 'right-96' : ''
        } fixed right-0 bottom-36 duration-200 z-50`}
      >
        <div
          style={{ writingMode: 'vertical-lr' }}
          className="bg-black text-white shadow-2xl p-2.5 rounded-l-xl cursor-pointer"
          onClick={toggleShow}
        >
          {show
            ? (
            <i className="fas fa-times">&nbsp;关闭调试</i>
              )
            : (
            <i className="fas fa-tools">&nbsp;打开调试</i>
              )}
        </div>
      </div>

      <div
        className={` ${
          show ? 'shadow-card' : '-right-96'
        } w-96 overflow-y-scroll font-sans h-full p-5 bg-white fixed right-0 bottom-0 z-50 duration-200`}
      >
        <div className="flex space-x-1 my-12">
          <Select
            label="主题切换"
            value={theme}
            options={themeOptions}
            onChange={changeTheme}
          />
          <div className="p-2 cursor-pointer" onClick={switchTheme}>
            <i className="fas fa-sync" />
          </div>
        </div>

        <div>
          <div className="font-bold w-18 border-b my-2">
            站点配置[blog.config.js]
          </div>
          <div className="text-xs">
            {Object.keys(BLOG).map(k => (
              <div key={k} className="justify-between flex py-1">
                <span className="bg-blue-400 p-0.5 rounded text-white mr-2">
                  {k}
                </span>
                <span className="whitespace-nowrap">
                  {filterResult(BLOG[k] + '')}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="font-bold w-18 border-b my-2">
            主题配置{'(config_' + theme + '.js)'}:
          </div>
          <div className="text-xs">
            {Object.keys(ThemeMap[theme].THEME_CONFIG).map(k => (
              <>
                <div key={k} className="justify-between flex py-1">
                  <span className="bg-indigo-500 p-0.5 rounded text-white mr-2">
                    {k}
                  </span>
                  <span className="whitespace-nowrap">
                    {filterResult(ThemeMap[theme].THEME_CONFIG[k] + '')}
                  </span>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
