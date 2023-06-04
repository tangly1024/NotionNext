/* eslint-disable no-undef */
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

export default function Live2D() {
  const { theme, switchTheme } = useGlobal()

  useEffect(() => {
    if (BLOG.WIDGET_PET) {
      //   setLive2DLoaded(true)
      //   console.log('加载宠物挂件')
      Promise.all([
        loadExternalResource('https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js', 'js')
      ]).then((e) => {
        if (window?.loadlive2d) {
          // https://github.com/xiazeyu/live2d-widget-models
          loadlive2d('live2d', BLOG.WIDGET_PET_LINK)
        }
      })
    }
  }, [theme])

  function handleClick() {
    if (BLOG.WIDGET_PET_SWITCH_THEME) {
      switchTheme()
    }
  }

  if (!BLOG.WIDGET_PET || !JSON.parse(BLOG.WIDGET_PET)) {
    return <></>
  }

  return <canvas id="live2d" className='cursor-pointer' width="280" height="250" onClick={handleClick} alt='切换主题' title='切换主题' />
}
