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
            <div id="draggableBox" style={{ left: '10px', top: '85vh' }} className="fixed dark:text-white bg-gray-50 dark:bg-black z-50 border dark:border-gray-800 rounded-xl shadow-card">
                <div className="py-2 flex items-center text-sm px-2">
                    <DarkModeButton className='mr-1'/>
                    <select value={theme} onChange={onSelectChange} name="cars" className=' outline-none dark:text-white bg-gray-50 dark:bg-black uppercase cursor-pointer'>
                        {THEMES?.map(t => {
                          return <option key={t} value={t}>{t}</option>
                        })}
                    </select>
                    <i className='fas fa-palette pl-1' />
                </div>
            </div>
        </Draggable>
    </>
  )
}

export default ThemeSwitch
