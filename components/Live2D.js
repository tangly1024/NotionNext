import Head from 'next/head'
import { useEffect } from 'react'

export default function Live2D () {
  useEffect(() => {
    if (window) {
      initLive2D()
    }
  })
  return <>
    <Head><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css"/></Head>
  </>
}

function initLive2D () {
  // 注意：live2d_path 参数应使用绝对路径
  const live2dPath = 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/'
  // const live2d_path = "/live2d-widget/";

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
      loadExternalResource(live2dPath + 'waifu.css', 'css'),
      loadExternalResource(live2dPath + 'live2d.min.js', 'js'),
      loadExternalResource(live2dPath + 'waifu-tips.js', 'js')
    ]).then(() => {
      // eslint-disable-next-line no-undef
      initWidget({
        waifuPath: live2dPath + 'waifu-tips.json',
        // apiPath: "https://live2d.fghrsh.net/api/",
        cdnPath: 'https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/'
      })
    })
  }
  // initWidget 第一个参数为 waifu-tips.json 的路径，第二个参数为 API 地址
  // API 后端可自行搭建，参考 https://github.com/fghrsh/live2d_api
  // 初始化看板娘会自动加载指定目录下的 waifu-tips.json
}
