import { compressImage } from '@/lib/db/notion/mapImage'
import { isBrowser } from '../lib/utils'

let _prevBlobUrl = null

/**
 * 为文章页面动态更新 PWA manifest
 * 用 Blob URL 替换静态 manifest，使文章可作为独立 PWA 安装
 * @see https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
 */
export function PWA(post, siteInfo) {
  if (!isBrowser || !post) {
    return
  }

  const icon = post?.pageCoverThumbnail
    ? compressImage(post.pageCoverThumbnail, 192)
    : '/icon-192x192.png'

  const manifestData = {
    id: post?.id,
    name: post?.title + ' | ' + siteInfo.title,
    short_name: post?.title,
    description: post?.summary || siteInfo.description,
    icons: [
      {
        src: icon,
        type: 'image/png',
        sizes: '192x192'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    start_url: window.location.href,
    scope: '/',
    display: 'standalone',
    background_color: '#181818',
    theme_color: '#181818'
  }

  // Revoke previous blob URL to prevent memory leak
  if (_prevBlobUrl) {
    URL.revokeObjectURL(_prevBlobUrl)
  }

  const existingManifest = document.querySelector('link[rel="manifest"]')
  if (existingManifest) {
    existingManifest.remove()
  }

  const blobUrl = URL.createObjectURL(
    new Blob([JSON.stringify(manifestData)], {
      type: 'application/json'
    })
  )
  _prevBlobUrl = blobUrl

  const manifest = document.createElement('link')
  manifest.rel = 'manifest'
  manifest.href = blobUrl
  document.head.appendChild(manifest)
}
