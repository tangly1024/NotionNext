import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

const ValineComponent = ({ path }) => {
  const loadValine = async () => {
    try {
      await loadExternalResource(siteConfig('COMMENT_VALINE_CDN'), 'js')
      const Valine = window.Valine
      // eslint-disable-next-line no-unused-vars
      const valine = new Valine({
        el: '#valine', // 容器元素
        lang: siteConfig('LANG'), // 用于手动设定评论区语言，支持的语言列表 https://github.com/imaegoo/twikoo/blob/main/src/client/utils/i18n/index.js
        appId: siteConfig('COMMENT_VALINE_APP_ID'),
        appKey: siteConfig('COMMENT_VALINE_APP_KEY'),
        avatar: '',
        path,
        recordIP: true,
        placeholder: siteConfig('COMMENT_VALINE_PLACEHOLDER'),
        serverURLs: siteConfig('COMMENT_VALINE_SERVER_URLS'),
        visitor: true
      })
    } catch (error) {
      console.error('twikoo 加载失败', error)
    }
  }

  useEffect(() => {
    loadValine()
  }, [])

  return <div id="valine"></div>

  //   const updateValine = url => {
  //     // 移除旧的评论区，否则会重复渲染。
  //     const wrapper = document.getElementById('v-wrapper')
  //     const comments = document.getElementById('v-comments')
  //     wrapper.removeChild(comments)
  //     const newComments = document.createElement('div')
  //     newComments.id = 'v-comments'
  //     newComments.name = new Date()
  //     wrapper.appendChild(newComments)
  //     initValine(url)
  //   }

  //   useEffect(() => {
  //     initValine()
  //     router.events.on('routeChangeComplete', updateValine)
  //     return () => {
  //       router.events.off('routeChangeComplete', updateValine)
  //     }
  //   }, [])

//   return <div id='v-wrapper'>
//       <div id='v-comments'></div>
//   </div>
}

export default ValineComponent
