import { HashTag } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import WordCount from '@/components/WordCount'
import { formatDateFmt } from '@/lib/utils/formatDate'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import { compressImage, mapImgUrl } from '@/lib/notion/mapImage'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import mediumZoom from '@fisch0920/medium-zoom'
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'
import { useEffect, useRef, memo } from 'react'
import { NotionRenderer } from 'react-notion-x'

// 使用 memo 优化性能
const PostInfo = memo(({ post }) => {
  return (
    <div id='post-info'>
      {/* 第一行：原创标签、分类、标签 */}
      <div id='post-firstinfo'>
        <div className='meta-firstline'>
          <div className='meta-group'>
            <a className='post-meta-original'>原创</a>
            {post?.category && (
              <span className='post-meta-categories'>
                <i className='fas fa-inbox post-meta-icon'></i>
                <Link
                  href={`/category/${encodeURIComponent(post.category)}`}
                  passHref
                  legacyBehavior
                >
                  <a><span>{post.category}</span></a>
                </Link>
              </span>
            )}
          </div>
          {post?.tagItems && (
            <span className='article-meta tags'>
              {post.tagItems.map((tag, index) => (
                <Link
                  key={index}
                  href={`/tag/${encodeURIComponent(tag.name)}`}
                  passHref
                  legacyBehavior
                >
                  <a className='article-meta__tags'>
                    <span>
                      <i className='fas fa-hashtag'></i>
                      {tag.name}
                    </span>
                  </a>
                </Link>
              ))}
            </span>
          )}
        </div>
      </div>

      {/* 第二行：文章标题 */}
      <h1 className='post-title'>{post?.title}</h1>

      {/* 第三、四行：发布时间和更新时间 */}
      <div className='meta-secondline'>
        <span className='post-meta-date'>
          <i className='fas fa-calendar-days post-meta-icon'></i>
          <span className='post-meta-label'>发表于</span>
          <time>{post?.publishDay}</time>
          <span className='post-meta-separator'></span>
          <i className='fas fa-history post-meta-icon'></i>
          <span className='post-meta-label'>更新于</span>
          <time>{post?.lastEditedDay}</time>
        </span>
      </div>

      {/* 第五行：字数统计、阅读时长、阅读量 */}
      <div className='meta-secondline'>
        <span className='post-meta-wordcount'>
          <i className='fas fa-file-word post-meta-icon'></i>
          <span className='post-meta-label'>字数总计:</span>
          <span className='word-count'>{post?.wordCount || 0}</span>
          <span className='post-meta-separator'></span>
          <i className='fas fa-clock post-meta-icon'></i>
          <span className='post-meta-label'>阅读时长:</span>
          <span>{post?.readTime || 1} 分钟</span>
        </span>
        <span className='post-meta-separator'></span>
        <span className='post-meta-pv-cv'>
          <i className='fas fa-eye post-meta-icon'></i>
          <span className='post-meta-label'>阅读量:</span>
          <span>{post?.views || 0}</span>
        </span>
        {post?.location && (
          <>
            <span className='post-meta-separator'></span>
            <span className='post-meta-position'>
              <i className='fas fa-location-dot'></i>
              {post.location}
            </span>
          </>
        )}
      </div>
    </div>
  )
})

PostInfo.displayName = 'PostInfo'

// 主组件
const NotionPage = ({ post, className }) => {
  // 配置
  const POST_DISABLE_GALLERY_CLICK = siteConfig('POST_DISABLE_GALLERY_CLICK')
  const POST_DISABLE_DATABASE_CLICK = siteConfig('POST_DISABLE_DATABASE_CLICK')
  const SPOILER_TEXT_TAG = siteConfig('SPOILER_TEXT_TAG')
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig('ANALYTICS_BUSUANZI_ENABLE')
  const IMAGE_ZOOM_IN_WIDTH = siteConfig('IMAGE_ZOOM_IN_WIDTH', 1200)

  // 图片缩放
  const zoom = useRef(
    isBrowser
      ? mediumZoom({
        background: 'rgba(0, 0, 0, 0.2)',
        margin: getMediumZoomMargin()
      })
      : null
  ).current

  // 错误处理
  useEffect(() => {
    const handleError = error => {
      console.error('NotionPage Error:', error)
      // 可以添加错误提示或重试逻辑
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  // 初始化
  useEffect(() => {
    try {
      autoScrollToHash()
    } catch (error) {
      console.error('Auto scroll error:', error)
    }
  }, [])

  // 处理图片和数据库
  useEffect(() => {
    try {
      if (POST_DISABLE_GALLERY_CLICK) {
        processGalleryImg(zoom)
      }

      if (POST_DISABLE_DATABASE_CLICK) {
        processDisableDatabaseUrl()
      }

      // 图片放大处理
      const observer = new MutationObserver((mutationsList, observer) => {
        try {
          mutationsList.forEach(mutation => {
            if (
              mutation.type === 'attributes' &&
              mutation.attributeName === 'class' &&
              mutation.target.classList.contains('medium-zoom-image--opened')
            ) {
              setTimeout(() => {
                const src = mutation?.target?.getAttribute('src')
                if (src) {
                  mutation.target.setAttribute(
                    'src',
                    compressImage(src, IMAGE_ZOOM_IN_WIDTH)
                  )
                }
              }, 800)
            }
          })
        } catch (error) {
          console.error('Image zoom error:', error)
        }
      })

      observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class']
      })

      return () => observer.disconnect()
    } catch (error) {
      console.error('Post processing error:', error)
    }
  }, [post, zoom, POST_DISABLE_GALLERY_CLICK, POST_DISABLE_DATABASE_CLICK])

  // Spoiler 文本功能
  useEffect(() => {
    if (SPOILER_TEXT_TAG) {
      try {
        import('lodash/escapeRegExp').then(escapeRegExp => {
          Promise.all([
            loadExternalResource('/js/spoilerText.js', 'js'),
            loadExternalResource('/css/spoiler-text.css', 'css')
          ]).then(() => {
            window.textToSpoiler &&
              window.textToSpoiler(escapeRegExp.default(SPOILER_TEXT_TAG))
          })
        })
      } catch (error) {
        console.error('Spoiler text error:', error)
      }
    }
  }, [post, SPOILER_TEXT_TAG])

  return (
    <div className='article-container'>
      <style jsx global>{`
        .article-container {
          max-width: 100%;
          margin: 0 auto;
          background: var(--bg-white);
          min-height: calc(100vh - 80px);
          transition: all 0.3s ease;
        }
        
        #post-info {
          margin-bottom: 2.5rem;
          padding: 1.5rem;
          border-radius: 1rem;
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 20px var(--shadow-color);
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        #post-info:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .meta-firstline {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 1.2rem;
        }

        .meta-group {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .post-meta-original {
          background: linear-gradient(120deg, #1abc9c, #3498db);
          color: #fff;
          padding: 0.3rem 0.8rem;
          border-radius: 0.4rem;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
          transform-origin: center;
        }

        .post-meta-categories {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.8rem;
          background: #2d2d2d;
          border-radius: 0.4rem;
          transition: all 0.3s ease;
          color: #ffffff;
        }

        .post-meta-categories:hover {
          transform: translateY(-2px);
          background: #363636;
        }

        .post-meta-categories .post-meta-icon {
          color: #ffffff;
          opacity: 0.9;
        }

        .post-meta-categories a {
          color: #ffffff;
          font-weight: 500;
        }

        .dark-mode .post-meta-categories {
          background: #18171d;
          color: #ffffff;
        }

        .dark-mode .post-meta-categories:hover {
          background: #242424;
        }

        .article-meta.tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .dark-mode .post-meta-categories {
          background: rgba(229, 231, 235, 0.1);
          border: 1px solid rgba(229, 231, 235, 0.2);
        }

        .dark-mode .post-meta-categories:hover {
          background: rgba(229, 231, 235, 0.15);
        }

        .post-meta-separator {
          margin: 0 0.5rem;
          color: #ddd;
        }

        .post-meta-icon {
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .article-meta__tags {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.8rem;
          border-radius: 0.4rem;
          font-size: 0.85rem;
          font-weight: 500;
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          border: 1px solid rgba(139, 92, 246, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }

        .article-meta__tags:hover {
          transform: translateY(-2px) scale(1.02);
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }

        .post-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin: 1.2rem 0;
          color: var(--text-title);
          line-height: 1.4;
          letter-spacing: -0.02em;
          transition: all 0.3s ease;
        }

        .meta-secondline {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.2rem;
          color: var(--text-gray-600);
          font-size: 0.9rem;
          margin-top: 1.2rem;
          padding-top: 1.2rem;
          border-top: 1px solid var(--border-color);
        }

        .post-meta-date {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.3s ease;
        }

        .post-meta-date:hover {
          color: #3498db;
        }

        .post-meta-label {
          margin: 0 0.3rem;
          color: var(--text-gray-600);
          font-weight: 500;
        }

        .post-meta-wordcount, .post-meta-pv-cv, .post-meta-position {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.3s ease;
        }

        .post-meta-wordcount:hover, .post-meta-pv-cv:hover, .post-meta-position:hover {
          color: #3498db;
        }

        /* 暗色模式样式 */
        .dark-mode #post-info {
          background: var(--bg-card);
          box-shadow: 0 8px 20px var(--shadow-color);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(20px);
        }

        .dark-mode .post-title {
          color: var(--text-title);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .dark-mode .meta-firstline,
        .dark-mode .meta-secondline {
          color: rgba(255, 255, 255, 0.8);
        }

        .dark-mode .post-meta-original {
          background: linear-gradient(120deg, #00b894, #0984e3);
          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          box-shadow: 0 4px 12px rgba(9, 132, 227, 0.4);
          font-weight: 600;
        }

        .dark-mode .post-meta-categories {
          color: rgba(255, 255, 255, 0.8);
        }

        .dark-mode .post-meta-categories:hover {
          color: #74b9ff;
        }

        .dark-mode .article-meta__tags {
          background: rgba(167, 139, 250, 0.15);
          color: #a78bfa;
          border: 1px solid rgba(167, 139, 250, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dark-mode .article-meta__tags:hover {
          background: rgba(167, 139, 250, 0.25);
          color: #ffffff;
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 4px 12px rgba(167, 139, 250, 0.3);
          border-color: rgba(167, 139, 250, 0.4);
        }

        .dark-mode .post-meta-separator {
          color: rgba(255, 255, 255, 0.4);
        }

        .dark-mode .post-meta-label {
          color: rgba(255, 255, 255, 0.7);
        }

        .dark-mode .post-meta-icon {
          color: var(--text-gray-600);
          filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
        }

        .dark-mode .post-meta-wordcount:hover,
        .dark-mode .post-meta-pv-cv:hover,
        .dark-mode .post-meta-position:hover,
        .dark-mode .post-meta-date:hover {
          color: #a78bfa;
          transform: translateY(-1px);
        }

        .dark-mode time,
        .dark-mode .word-count {
          color: var(--text-gray-600);
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
          font-weight: 500;
        }

        /* 深色模式下的悬浮效果 */
        .dark-mode #post-info:hover {
          background: rgba(35, 35, 40, 0.98);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          transform: translateY(-2px);
        }

        /* 深色模式下的响应式调整 */
        @media (max-width: 768px) {
          #post-info {
            padding: 1rem;
            margin-bottom: 2rem;
          }

          .post-title {
            font-size: 1.8rem;
          }

          .meta-firstline {
            gap: 0.6rem;
          }

          .meta-secondline {
            gap: 1rem;
          }
        }

        .dark-mode #post-info {
          background: var(--bg-card);
          box-shadow: 0 8px 20px var(--shadow-color);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(20px);
        }

        /* 深色模式优化 */
        :root {
          --text-gray-600: #666;
          --border-color: rgba(0, 0, 0, 0.08);
          --hover-color: #3498db;
          --bg-tag: rgba(52, 152, 219, 0.1);
          --text-tag: #3498db;
          --bg-card: rgba(255, 255, 255, 0.6);
          --shadow-color: rgba(0, 0, 0, 0.05);
          --text-title: #2c3e50;
        }

        .dark-mode {
          --text-gray-600: #e1e1e6;
          --border-color: rgba(255, 255, 255, 0.15);
          --hover-color: #f0abfc;
          --bg-tag: rgba(240, 171, 252, 0.15);
          --text-tag: #f0abfc;
          --bg-card: rgba(30, 30, 35, 0.95);
          --shadow-color: rgba(0, 0, 0, 0.3);
          --text-title: #ffffff;
        }

        .dark-mode #post-info {
          background: rgba(28, 28, 35, 0.95);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark-mode .post-meta-original {
          background: linear-gradient(120deg, #f0abfc, #e879f9);
          color: #ffffff;
          text-shadow: none;
          box-shadow: 0 4px 12px rgba(240, 171, 252, 0.3);
          font-weight: 600;
        }

        .dark-mode .post-meta-original:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(240, 171, 252, 0.4);
        }

        .dark-mode .article-meta__tags {
          background: rgba(167, 139, 250, 0.15);
          color: #a78bfa;
          border: 1px solid rgba(167, 139, 250, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dark-mode .article-meta__tags:hover {
          background: rgba(167, 139, 250, 0.25);
          color: #ffffff;
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 4px 12px rgba(167, 139, 250, 0.3);
          border-color: rgba(167, 139, 250, 0.4);
        }

        .dark-mode .post-meta-categories,
        .dark-mode .post-meta-date,
        .dark-mode .post-meta-wordcount,
        .dark-mode .post-meta-pv-cv,
        .dark-mode .post-meta-position,
        .dark-mode .post-meta-icon,
        .dark-mode time,
        .dark-mode .word-count {
          color: #e1e1e6;
          transition: all 0.3s ease;
        }

        .dark-mode .post-meta-label {
          color: #ffffff;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .dark-mode .post-meta-original {
          background: linear-gradient(120deg, #f472b6, #ec4899) !important;
          color: #ffffff !important;
        }

        .dark-mode .article-meta__tags {
          background: rgba(244, 114, 182, 0.15) !important;
          color: #f472b6 !important;
          border: 1px solid rgba(244, 114, 182, 0.3) !important;
        }

        .dark-mode .article-meta__tags:hover {
          background: rgba(244, 114, 182, 0.25) !important;
          color: #ffffff !important;
        }

        .dark-mode .post-meta-categories:hover,
        .dark-mode .post-meta-date:hover,
        .dark-mode .post-meta-wordcount:hover,
        .dark-mode .post-meta-pv-cv:hover,
        .dark-mode .post-meta-position:hover {
          color: #a78bfa;
          transform: translateY(-1px);
        }

        .dark-mode .post-meta-separator {
          color: rgba(255, 255, 255, 0.4) !important;
        }

        .dark-mode #post-info {
          background: rgba(28, 28, 35, 0.95) !important;
          border: 1px solid rgba(244, 114, 182, 0.2) !important;
        }

        .dark-mode #post-info:hover {
          background: rgba(35, 35, 40, 0.98) !important;
          border-color: rgba(244, 114, 182, 0.3) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
        }

        .dark-mode .post-title {
          color: #ffffff !important;
        }

        /* 深色模式下的响应式调整 */
        @media (max-width: 768px) {
          .dark-mode #post-info {
            background: rgba(28, 28, 35, 0.98);
          }
        }

        .dark-mode #post-info .post-meta-label,
        .dark-mode .meta-secondline .post-meta-label,
        .dark-mode #post-info time,
        .dark-mode #post-info .word-count,
        .dark-mode #post-info .post-meta-pv-cv span {
          color: #ffffff !important;
          font-weight: 600 !important;
          opacity: 1;
        }

        .meta-secondline time,
        .meta-secondline .word-count,
        .meta-secondline span:not(.post-meta-separator):not(.post-meta-icon) {
          font-weight: 600;
        }

        .dark-mode #post-info .post-meta-categories,
        .dark-mode #post-info .post-meta-date,
        .dark-mode #post-info .post-meta-wordcount,
        .dark-mode #post-info .post-meta-pv-cv,
        .dark-mode #post-info .post-meta-position,
        .dark-mode #post-info .post-meta-icon,
        .dark-mode #post-info time,
        .dark-mode #post-info .word-count {
          color: #e1e1e6;
          transition: all 0.3s ease;
        }
      `}</style>

      <article className='bg-white dark:bg-[#18171d] rounded-lg backdrop-blur-lg'>
        <div className='mx-auto max-w-4xl px-6 py-8'>
          <PostInfo post={post} />

          {/* Notion 内容 */}
          <div className='notion-content'>
            <NotionRenderer
              recordMap={post?.blockMap}
              mapPageUrl={mapPageUrl}
              mapImageUrl={mapImgUrl}
              components={{
                Code,
                Collection,
                Equation,
                Modal,
                Pdf,
                Tweet
              }}
            />
          </div>
          <AdEmbed />
          <PrismMac />
        </div>
      </article>
    </div>
  )
}

/**
 * 页面的数据库链接禁止跳转，只能查看
 */
const processDisableDatabaseUrl = () => {
  if (isBrowser) {
    try {
      const links = document.querySelectorAll('.notion-table a')
      links.forEach(link => {
        if (link && link.parentNode) {
          link.style.pointerEvents = 'none'
          link.style.cursor = 'default'
        }
      })
    } catch (error) {
      console.error('Disable database URL error:', error)
    }
  }
}

/**
 * gallery视图，点击后是放大图片还是跳转到gallery的内部页面
 */
const processGalleryImg = zoom => {
  if (!isBrowser || !zoom) return

  setTimeout(() => {
    try {
      // 处理图片缩放
      const imgList = document?.querySelectorAll('.notion-collection-card-cover img')
      if (imgList?.length) {
        imgList.forEach(img => {
          if (img) {
            zoom.attach(img)
          }
        })
      }

      // 处理卡片点击
      const cards = document.getElementsByClassName('notion-collection-card')
      if (cards?.length) {
        Array.from(cards).forEach(card => {
          if (card) {
            card.style.pointerEvents = 'none'
            card.style.cursor = 'default'
          }
        })
      }
    } catch (error) {
      console.error('Process gallery image error:', error)
    }
  }, 800)
}

/**
 * 根据url参数自动滚动到锚位置
 */
const autoScrollToHash = () => {
  if (!isBrowser) return

  setTimeout(() => {
    try {
      const hash = window?.location?.hash
      if (!hash) return

      const targetId = hash.substring(1)
      const tocNode = document.getElementById(targetId)

      if (tocNode?.className?.includes('notion')) {
        tocNode.scrollIntoView({
          block: 'start',
          behavior: 'smooth',
          inline: 'nearest'
        })
      }
    } catch (error) {
      console.error('Auto scroll error:', error)
    }
  }, 180)
}

/**
 * 将id映射成博文内部链接。
 * @param {*} id
 * @returns
 */
const mapPageUrl = id => {
  // return 'https://www.notion.so/' + id.replace(/-/g, '')
  return '/' + id.replace(/-/g, '')
}

/**
 * 缩放
 * @returns
 */
function getMediumZoomMargin() {
  const width = window.innerWidth

  if (width < 500) {
    return 8
  } else if (width < 800) {
    return 20
  } else if (width < 1280) {
    return 30
  } else if (width < 1600) {
    return 40
  } else if (width < 1920) {
    return 48
  } else {
    return 72
  }
}

// 代码
const Code = dynamic(
  () =>
    import('react-notion-x/build/third-party/code').then(async m => {
      return m.Code
    }),
  { ssr: false }
)

// 公式
const Equation = dynamic(
  () =>
    import('@/components/Equation').then(async m => {
      // 化学方程式
      await import('@/lib/plugins/mhchem')
      return m.Equation
    }),
  { ssr: false }
)

// 原版文档
// const Pdf = dynamic(
//   () => import('react-notion-x/build/third-party/pdf').then(m => m.Pdf),
//   {
//     ssr: false
//   }
// )
const Pdf = dynamic(() => import('@/components/Pdf').then(m => m.Pdf), {
  ssr: false
})

// 美化代码 from: https://github.com/txs
const PrismMac = dynamic(() => import('@/components/PrismMac'), {
  ssr: false
})

/**
 * tweet嵌入
 */
const TweetEmbed = dynamic(() => import('react-tweet-embed'), {
  ssr: false
})

/**
 * 文内google广告
 */
const AdEmbed = dynamic(
  () => import('@/components/GoogleAdsense').then(m => m.AdEmbed),
  { ssr: true }
)

const Collection = dynamic(
  () =>
    import('react-notion-x/build/third-party/collection').then(
      m => m.Collection
    ),
  {
    ssr: true
  }
)

const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then(m => m.Modal),
  { ssr: false }
)

const Tweet = ({ id }) => {
  return <TweetEmbed tweetId={id} />
}

export default NotionPage
