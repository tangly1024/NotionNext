import { useGlobal } from '@/lib/global'
import React from 'react'
import { Draggable } from './Draggable'
import { ALL_THEME } from '@/lib/theme'
/**
 *
 * @returns 主题切换
 */
const ThemeSwitch = () => {
  const { theme, changeTheme } = useGlobal()

  const onSelectChange = (e) => {
    changeTheme(e.target.value)
  }

  return (<>
        <Draggable>
            <div id="draggableBox" style={{ left: '10px', top: '85vh' }} className="fixed text-white bg-black z-50 rounded-lg shadow-card">
                <div className="py-2 flex items-center text-sm">
                    <i className='fas fa-arrows cursor-move px-2' />
                    {/* <div className='uppercase font-sans whitespace-nowrap cursor-pointer ' onClick={switchTheme}> {theme}</div> */}
                    <select value={theme} onChange={onSelectChange} name="cars" className='text-white bg-black uppercase cursor-pointer'>
                        {ALL_THEME.map(t => {
                          return <option key={t} value={t}>{t}</option>
                        })}
                    </select>
                </div>
            </div>
        </Draggable>
    </>
  )
}

export default ThemeSwitch
