import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import Script from 'next/script'

/**
 * 获取博客的评论数，用与在列表中展示
 * @returns {JSX.Element}
 * @constructor
 */

const TwikooCommentCounter = (props) => {
  const commentsDataRef = useRef([])
  const { theme } = useGlobal()
  const router = useRouter()
  const scriptLoadedRef = useRef(false)

  const twikooCDNURL = siteConfig('COMMENT_TWIKOO_CDN_URL')
  const twikooENVID = siteConfig('COMMENT_TWIKOO_ENV_ID')

  // 监控主题变化时的的评论数
  useEffect(() => {
    updateCommentCount()
  }, [theme])

  /**
   * 当twikoo脚本加载完成后获取评论数
   */
  const onTwikooScriptLoad = () => {
    scriptLoadedRef.current = true
    if (props?.posts && props?.posts?.length > 0) {
      fetchTwikooData(props.posts)
    }
  }

  /**
   * 获取twikoo评论数
   * @param {*} posts
   */
  const fetchTwikooData = (posts) => {
    if (!window.twikoo || !scriptLoadedRef.current) return

    const processedPosts = [...posts]
    processedPosts.forEach(post => {
      post.slug = post.slug.startsWith('/') ? post.slug : `/${post.slug}`
    })

    try {
      window.twikoo.getCommentsCount({
        envId: twikooENVID, // 环境 ID
        // region: 'ap-guangzhou', // 环境地域，默认为 ap-shanghai，如果您的环境地域不是上海，需传此参数
        urls: processedPosts?.map(post => post.slug), // 不包含协议、域名、参数的文章路径列表，必传参数
        includeReply: true // 评论数是否包括回复，默认：false
      }).then(function (res) {
        commentsDataRef.current = res
        updateCommentCount()
      }).catch(function (err) {
        // 发生错误
        console.error('twikoo 获取评论数失败', err)
      })
    } catch (error) {
      console.error('twikoo 调用失败', error)
    }
  }

  const updateCommentCount = () => {
    if (!commentsDataRef.current || commentsDataRef.current.length === 0) {
      return
    }
    props.posts?.forEach(post => {
      const matchingRes = commentsDataRef.current.find(r => r.url === post.slug)
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
  }

  // 使用Script组件懒加载twikoo脚本
  return (
    <>
      <Script
        id="twikoo-counter-script"
        src={twikooCDNURL}
        strategy="lazyOnload"
        onLoad={onTwikooScriptLoad}
      />
    </>
  )
}

export default TwikooCommentCounter
