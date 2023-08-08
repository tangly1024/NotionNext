import BLOG from '@/blog.config'
// import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * Giscus评论 @see https://giscus.app/zh-CN
 * Contribute by @txs https://github.com/txs/NotionNext/commit/1bf7179d0af21fb433e4c7773504f244998678cb
 * @returns {JSX.Element}
 * @constructor
 */

const Twikoo = ({ isDarkMode }) => {
  useEffect(() => {
    window?.twikoo?.init({
      envId: BLOG.COMMENT_TWIKOO_ENV_ID, // 腾讯云环境填 envId；Vercel 环境填地址（https://xxx.vercel.app）
      el: '#twikoo', // 容器元素
      lang: BLOG.LANG // 用于手动设定评论区语言，支持的语言列表 https://github.com/imaegoo/twikoo/blob/main/src/client/utils/i18n/index.js
      // region: 'ap-guangzhou', // 环境地域，默认为 ap-shanghai，腾讯云环境填 ap-shanghai 或 ap-guangzhou；Vercel 环境不填
      // path: location.pathname, // 用于区分不同文章的自定义 js 路径，如果您的文章路径不是 location.pathname，需传此参数
    })
  }, [isDarkMode])
  return (
        <div id="twikoo"></div>
  )
}

export default Twikoo
