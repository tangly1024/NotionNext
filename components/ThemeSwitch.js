import { useGlobal } from '@/lib/global'
import React from 'react'
import { Draggable } from './Draggable'
/**
 *
 * @returns 主题切换
 */
export function ThemeSwitch() {
  const { theme, switchTheme } = useGlobal()

  return (<>
        <Draggable>
            <div id="draggableBox" style={{ left: '10px', top: '90vh' }} className="fixed text-white bg-black z-50 rounded-lg shadow-card">
                <div className="p-2 flex items-center">
                    <i className="fas fa-palette mr-1 cursor-move" />
                    <div className='uppercase font-sans whitespace-nowrap' >{theme} <i className='fas fa-sync cursor-pointer border-l pl-2' title='click to change theme' alt='click to change theme' onClick={switchTheme} /></div>
                </div>
            </div>
        </Draggable>
    </>
  )
}
