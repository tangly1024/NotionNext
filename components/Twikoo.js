import BLOG from '@/blog.config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'
// import twikoo from 'twikoo'

/**
 * Giscus评论 @see https://giscus.app/zh-CN
 * Contribute by @txs https://github.com/txs/NotionNext/commit/1bf7179d0af21fb433e4c7773504f244998678cb
 * @returns {JSX.Element}
 * @constructor
 */

const Twikoo = ({ isDarkMode }) => {
  const loadTwikoo = async () => {
    try {
      const url = await loadExternalResource(BLOG.COMMENT_TWIKOO_CDN_URL, 'js')
      console.log('twikoo 加载成功', url)
      const twikoo = window.twikoo
      twikoo.init({
        envId: BLOG.COMMENT_TWIKOO_ENV_ID, // 腾讯云环境填 envId；Vercel 环境填地址（https://xxx.vercel.app）
        el: '#twikoo', // 容器元素
        lang: BLOG.LANG // 用于手动设定评论区语言，支持的语言列表 https://github.com/imaegoo/twikoo/blob/main/src/client/utils/i18n/index.js
        // region: 'ap-guangzhou', // 环境地域，默认为 ap-shanghai，腾讯云环境填 ap-shanghai 或 ap-guangzhou；Vercel 环境不填
        // path: location.pathname, // 用于区分不同文章的自定义 js 路径，如果您的文章路径不是 location.pathname，需传此参数
      })

      twikoo.getCommentsCount({
        envId: BLOG.COMMENT_TWIKOO_ENV_ID, // 环境 ID
        // region: 'ap-guangzhou', // 环境地域，默认为 ap-shanghai，如果您的环境地域不是上海，需传此参数
        urls: [ // 不包含协议、域名、参数的文章路径列表，必传参数
          '/article/notion-next',
          '/article/notion-next-guide'
        ],
        includeReply: false // 评论数是否包括回复，默认：false
      }).then(function (res) {
        console.log(res)
        // 返回示例: [
        //   { url: '/2020/10/post-1.html', count: 10 },
        //   { url: '/2020/11/post-2.html', count: 0 },
        //   { url: '/2020/12/post-3.html', count: 20 }
        // ]
      }).catch(function (err) {
        // 发生错误
        console.error(err)
      })
    } catch (error) {
      console.error('twikoo 加载失败', error)
    }
  }

  useEffect(() => {
    loadTwikoo()
  }, [])
  return (
        <div id="twikoo"></div>
  )
}

export default Twikoo
