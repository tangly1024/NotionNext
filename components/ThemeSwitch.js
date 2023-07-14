import { useGlobal } from '@/lib/global'
import React from 'react'
import { Draggable } from './Draggable'
import { ALL_THEME } from '@/themes/theme'
import { useRouter } from 'next/router'
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
            <div id="draggableBox" style={{ left: '10px', top: '85vh' }} className="fixed text-white bg-black z-50 rounded-lg shadow-card">
                <div className="py-2 flex items-center text-sm px-2">
                    <select value={theme} onChange={onSelectChange} name="cars" className='text-white bg-black uppercase cursor-pointer'>
                        {ALL_THEME.map(t => {
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
