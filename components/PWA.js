import { compressImage } from '@/lib/notion/mapImage'
import { isBrowser } from '../lib/utils'

/**
 * 初始化PWA
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
 * @param {*} props
 * @returns
 */
export function PWA(post, siteInfo) {
  if (!isBrowser || !post) {
    return
  }
  // 将 manifest 数据转换为 JSON 字符串
  const manifestData = {
    id: post?.id,
    name: post?.title + ' | ' + siteInfo.title,
    short_name: post?.title,
    description: post?.summary || siteInfo.description,
    icons: [
      {
        src: compressImage(post?.pageCoverThumbnail, 192),
        type: 'image/png',
        sizes: '192x192'
      }
    ],
    form_factor: 'phone',
    start_url: window.location.href,
    scope: window.location.href,
    display: 'standalone',
    background_color: '#181818',
    theme_color: '#181818'
  }

  // 删除已有的 manifest link 元素（如果存在）
  const existingManifest = document.querySelector('link[rel="manifest"]')
  if (existingManifest && existingManifest.parentNode && existingManifest.parentNode.contains(existingManifest)) {
    existingManifest.parentNode.removeChild(existingManifest)
  }

  // 创建 manifest 元素
  const manifest = document.createElement('link')
  manifest.rel = 'manifest'

  // 设置 manifest 的 href 为一个 Blob URL
  const blobUrl = URL.createObjectURL(
    new Blob([JSON.stringify(manifestData)], {
      type: 'application/json'
    })
  )
  // 这里会报错，因为前端收到的事一个转义了双引号的字符串，无法解析成json，不知道怎么解决
  manifest.href = blobUrl

  // 将 manifest 添加到 head 中
  document.head.appendChild(manifest)

  // 不要忘记在适当的时候释放 Blob URL，避免内存泄漏
  // 例如，在页面卸载或不再需要该 Blob URL 时
  window.addEventListener('unload', () => {
    URL.revokeObjectURL(blobUrl)
  })
}

/**
 * 截去url结尾的 / ， 便于和slug拼接
 * @param {*} str
 * @returns
 */
// function getRootPath() {
//   const protocol = window.location.protocol
//   const hostname = window.location.hostname
//   const port = window.location.port

//   // 如果端口号存在且不是默认的80或443，则包含端口号
//   if (port && port !== '80' && port !== '443') {
//     return protocol + '//' + hostname + ':' + port
//   } else {
//     return protocol + '//' + hostname
//   }
// }
