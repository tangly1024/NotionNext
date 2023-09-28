import BLOG from '@/blog.config'
import { loadExternalResource } from '@/lib/utils'
// import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * Giscus评论 @see https://giscus.app/zh-CN
 * Contribute by @txs https://github.com/txs/NotionNext/commit/1bf7179d0af21fb433e4c7773504f244998678cb
 * @returns {JSX.Element}
 * @constructor
 */

const Artalk = ({ siteInfo }) => {
  useEffect(() => {
    loadExternalResource(BLOG.COMMENT_ARTALK_CSS, 'css')
    window?.Artalk?.init({
      server: BLOG.COMMENT_ARTALK_SERVER, // 后端地址
      el: '#artalk', // 容器元素
      locale: BLOG.LANG,
      //   pageKey: '/post/1', // 固定链接 (留空自动获取)
      //   pageTitle: '关于引入 Artalk 的这档子事', // 页面标题 (留空自动获取)
      site: siteInfo?.title // 你的站点名
    })
  }, [])
  return (
        <div id="artalk"></div>
  )
}

export default Artalk
