import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import React from 'react'
import Valine from 'valine'

const ValineComponent = (props) => {
  const router = useRouter()
  const initValine = (url) => {
    const valine = new Valine({
      el: '#v-comments',
      appId: BLOG.COMMENT_VALINE_APP_ID,
      appKey: BLOG.COMMENT_VALINE_APP_KEY,
      avatar: '',
      path: url || router.asPath,
      recordIP: true,
      placeholder: BLOG.COMMENT_VALINE_PLACEHOLDER,
      serverURLs: BLOG.COMMENT_VALINE_SERVER_URLS,
      visitor: true
    })
    if (!valine) {
      console.error('valine错误')
    }
  }

  const updateValine = url => {
    // 移除旧的评论区，否则会重复渲染。
    const wrapper = document.getElementById('v-wrapper')
    const comments = document.getElementById('v-comments')
    wrapper.removeChild(comments)
    const newComments = document.createElement('div')
    newComments.id = 'v-comments'
    newComments.name = new Date()
    wrapper.appendChild(newComments)
    initValine(url)
  }

  React.useEffect(() => {
    initValine()
    router.events.on('routeChangeComplete', updateValine)
    return () => {
      router.events.off('routeChangeComplete', updateValine)
    }
  }, [])
  return <div id='v-wrapper'>
      <div id='v-comments'></div>
  </div>
}

export default ValineComponent
