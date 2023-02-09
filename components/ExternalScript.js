import BLOG from '@/blog.config'
import { loadExternalResource } from '@/lib/utils'
import React from 'react'

/**
 * 自定义引入外部JS 和 CSS
 * @returns
 */
const ExternalScript = () => {
  React.useEffect(() => {
    if (BLOG.CUSTOM_EXTERNAL_JS && BLOG.CUSTOM_EXTERNAL_JS.length > 0) {
      for (const url of BLOG.CUSTOM_EXTERNAL_JS) {
        loadExternalResource(url, 'js')
      }
    }
    if (BLOG.CUSTOM_EXTERNAL_CSS && BLOG.CUSTOM_EXTERNAL_CSS.length > 0) {
      for (const url of BLOG.CUSTOM_EXTERNAL_CSS) {
        loadExternalResource(url, 'css')
      }
    }
    // 静态导入本地自定义样式
    loadExternalResource('/css/all.min.css', 'css')
    loadExternalResource('/css/custom.css', 'css')
    loadExternalResource('/js/custom.js', 'js')

    // 渲染所有字体
    BLOG.FONT_URL?.forEach(e => {
      loadExternalResource(e, 'css')
    })
  }, [])
  return null
}

export default ExternalScript
