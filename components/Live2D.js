/* eslint-disable no-undef */
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

export default function Live2D() {
  const { theme, switchTheme } = useGlobal()
  const showPet = JSON.parse(BLOG.WIDGET_PET)

  useEffect(() => {
    if (showPet) {
      Promise.all([
        loadExternalResource('https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js', 'js')
      ]).then((e) => {
        if (typeof window?.loadlive2d !== 'undefined') {
          // https://github.com/xiazeyu/live2d-widget-models
          try {
            loadlive2d('live2d', BLOG.WIDGET_PET_LINK)
          } catch (error) {
            console.error('读取PET模型', error)
          }
        }
      })
    }
  }, [theme])

  function handleClick() {
    if (JSON.parse(BLOG.WIDGET_PET_SWITCH_THEME)) {
      switchTheme()
    }
  }

  if (!showPet) {
    return <></>
  }

  return <canvas id="live2d" width="280" height="250" onClick={handleClick}
        className="cursor-grab"
        onMouseDown={(e) => e.target.classList.add('cursor-grabbing')}
        onMouseUp={(e) => e.target.classList.remove('cursor-grabbing')}
    />
}
