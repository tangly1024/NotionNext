import { useGlobal } from '@/lib/global'
import React from 'react'
import { Draggable } from './Draggable'
import { THEMES } from '@/themes/theme'
import { useRouter } from 'next/router'
import DarkModeButton from './DarkModeButton'
/**
 *
 * @returns 主题切换
 */
const ThemeSwitch = () => {
  const { theme } = useGlobal()
  const router = useRouter()

  // 修改当前路径url中的 theme 参数
  // 例如 http://localhost?theme=hexo 跳转到 http://localhost?theme=newTheme
  const onSelectChange = (e) => {
    const newTheme = e.target.value
    const query = router.query
    query.theme = newTheme
    router.push({ pathname: router.pathname, query })
  }

  return (<>
        <Draggable>
            <div id="draggableBox" style={{ left: '10px', top: '80vh' }} className="fixed z-50 dark:text-white bg-gray-50 dark:bg-black rounded-2xl drop-shadow-lg">
                <div className="p-3 w-full flex items-center text-sm group duration-200 transition-all">
                    <DarkModeButton className='mr-2' />
                    <div className='w-0 group-hover:w-20 transition-all duration-200 overflow-hidden'>
                        <select value={theme} onChange={onSelectChange} name="themes" className='appearance-none outline-none dark:text-white bg-gray-50 dark:bg-black uppercase cursor-pointer'>
                            {THEMES?.map(t => {
                              return <option key={t} value={t}>{t}</option>
                            })}
                        </select>
                    </div>
                    <i className="fa-solid fa-palette pl-2"></i>
                </div>
            </div>
        </Draggable>
    </>
  )
}

export default ThemeSwitch
