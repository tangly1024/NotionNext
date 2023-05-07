import BLOG from '@/blog.config'
import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 获取博客的评论数，用与在列表中展示
 * @returns {JSX.Element}
 * @constructor
 */

const TwikooCommentCounter = (props) => {
  const loadTwikoo = async (posts) => {
    posts.forEach(post => {
      post.slug = post.slug.startsWith('/') ? post.slug : `/${post.slug}`
    })
    try {
      await loadExternalResource(BLOG.COMMENT_TWIKOO_CDN_URL, 'js')
      const twikoo = window.twikoo
      twikoo.getCommentsCount({
        envId: BLOG.COMMENT_TWIKOO_ENV_ID, // 环境 ID
        // region: 'ap-guangzhou', // 环境地域，默认为 ap-shanghai，如果您的环境地域不是上海，需传此参数
        urls: posts.map(post => post.slug), // 不包含协议、域名、参数的文章路径列表，必传参数
        includeReply: true // 评论数是否包括回复，默认：false
      }).then(function (res) {
        console.log(res)
        posts.forEach(post => {
          const matchingRes = res.find(r => r.url === post.slug)
          if (matchingRes) {
            // 修改评论数量div
            const textElements = document.querySelectorAll(`.comment-count-text-${post.id}`)
            textElements.forEach(element => {
              element.innerHTML = matchingRes.count
            })
            // 取消隐藏
            const wrapperElements = document.querySelectorAll(`.comment-count-wrapper-${post.id}`)
            wrapperElements.forEach(element => {
              element.classList.remove('hidden')
            })
          }
        })
      }).catch(function (err) {
        // 发生错误
        console.error(err)
      })
    } catch (error) {
      console.error('twikoo 加载失败', error)
    }
  }

  const router = useRouter()

  useEffect(() => {
    if (props?.posts && props?.posts?.length > 0) {
      loadTwikoo(props.posts)
    }
  }, [router.events])
  return null
}

export default TwikooCommentCounter
