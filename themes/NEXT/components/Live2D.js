/* eslint-disable no-undef */
import CONFIG_NEXT from '../config_next'
import { loadExternalResource } from '@/lib/utils'

let hasLoad = false
export default function Live2D () {
  if (!CONFIG_NEXT.WIDGET_PET) {
    return <></>
  }

  if (typeof window !== 'undefined' && !hasLoad) {
    initLive2D()
    hasLoad = true
  }

  return <div className='fixed right-0 bottom-0 hidden md:block lg:mr-24 2xl:mr-40 z-20'>
    <canvas id="live2d" className='animate__slideInLeft animate__animated' width="280" height="250"/>
  </div>
}

function initLive2D () {
  // 加载 waifu.css live2d.min.js waifu-tips.js
  if (screen.width >= 768) {
    Promise.all([
      // loadExternalResource('https://cdn.zhangxinxu.com/sp/demo/live2d/live2d/js/live2d.js', 'js')
      loadExternalResource('https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js', 'js')
    ]).then(() => {
      // https://github.com/xiazeyu/live2d-widget-models
      loadlive2d('live2d', CONFIG_NEXT.WIDGET_PET_LINK)
    })
  }
}
