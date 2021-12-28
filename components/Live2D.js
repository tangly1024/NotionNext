/* eslint-disable no-undef */
import { useEffect } from 'react'

export default function Live2D () {
  useEffect(() => {
    if (window) {
      initLive2D()
    }
  })
  return <div className='fixed left-0 bottom-0 hidden md:block lg:ml-24 2xl:ml-36'>
    <canvas id="live2d" width="280" height="250"></canvas>
  </div>
}

function initLive2D () {
  // 封装异步加载资源的方法
  function loadExternalResource (url, type) {
    return new Promise((resolve, reject) => {
      let tag

      if (type === 'css') {
        tag = document.createElement('link')
        tag.rel = 'stylesheet'
        tag.href = url
      } else if (type === 'js') {
        tag = document.createElement('script')
        tag.src = url
      }
      if (tag) {
        tag.onload = () => resolve(url)
        tag.onerror = () => reject(url)
        document.head.appendChild(tag)
      }
    })
  }

  // 加载 waifu.css live2d.min.js waifu-tips.js
  if (screen.width >= 768) {
    Promise.all([
      // loadExternalResource('https://cdn.zhangxinxu.com/sp/demo/live2d/live2d/js/live2d.js', 'js')
      loadExternalResource('https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js', 'js')
    ]).then(() => {
      // https://github.com/xiazeyu/live2d-widget-models
      loadlive2d('live2d', 'https://raw.githubusercontent.com/xiazeyu/live2d-widget-models/master/packages/live2d-widget-model-wanko/assets/wanko.model.json')
    })
  }
}
