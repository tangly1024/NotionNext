import BLOG from '@/blog.config'
import React from 'react'
import Valine from 'valine'

const ValineComponent = (props) => {
  const { path } = props
  React.useEffect(() => {
    const valine = Valine({
      el: '#vcomments',
      appId: BLOG.COMMENT_VALINE_APP_ID,
      appKey: BLOG.COMMENT_VALINE_APP_KEY,
      avatar: '',
      path: path,
      recordIP: false,
      placeholder: BLOG.COMMENT_VALINE_PLACEHOLDER,
      serverURLs: BLOG.COMMENT_VALINE_SERVER_URLS,
      visitor: true
    })
    if (!valine) {
      console.error('valine插件加载失败')
    }
  })
  return <div id='vcomments'></div>
}

export default ValineComponent
