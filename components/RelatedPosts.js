import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getRelatedPosts, generateRelatedPostsStructuredData } from '../lib/seo/relatedPosts'

/**
 * 相关文章推荐组件
 * 显示与当前文章相关的推荐文章
 */
export default function RelatedPosts({
  currentPost,
  allPosts = [],
  maxResults = 6,
  title = '相关文章',
  showSummary = true,
  showDate = true,
  showTags = false,
  layout = 'grid', // 'grid' | 'list' | 'carousel'
  className = '',
  baseUrl = '',
  enableStructuredData = true
}) {
  const [relatedPosts, setRelatedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!currentPost || !allPosts.length) {
      setIsLoading(false)
      return
    }

    // 获取相关文章
    const related = getRelatedPosts(currentPost, allPosts, {
      maxResults,
      minScore: 0.1
    })

    setRelatedPosts(related)
    setIsLoading(false)
  }, [currentPost, allPosts, maxResults])

  if (isLoading) {
    return <RelatedPostsSkeleton layout={layout} count={maxResults} />
  }

  if (!relatedPosts.length) {
    return null
  }

  const structuredData = enableStructuredData 
    ? generateRelatedPostsStructuredData(relatedPosts, baseUrl)
    : null

  return (
    <div className={`related-posts ${className}`}>
      {/* 结构化数据 */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* 标题 */}
      <div className="related-posts-header mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <div className="w-12 h-1 bg-blue-500 rounded"></div>
      </div>

      {/* 文章列表 */}
      <div className={`related-posts-content ${getLayoutClass(layout)}`}>
        {relatedPosts.map((post, index) => (
          <RelatedPostCard
            key={post.id || index}
            post={post}
            showSummary={showSummary}
            showDate={showDate}
            showTags={showTags}
            layout={layout}
          />
        ))}
      </div>

      {/* 样式 */}
      <style jsx>{`
        .related-posts {
          margin: 2rem 0;
        }
        
        .grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .list-layout {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .carousel-layout {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding-bottom: 1rem;
          scroll-snap-type: x mandatory;
        }
        
        .carousel-layout > * {
          flex: 0 0 300px;
          scroll-snap-align: start;
        }
        
        @media (max-width: 768px) {
          .grid-layout {
            grid-template-columns: 1fr;
          }
          
          .carousel-layout > * {
            flex: 0 0 280px;
          }
        }
      `}</style>
    </div>
  )
}

/**
 * 相关文章卡片组件
 */
function RelatedPostCard({ post, showSummary, showDate, showTags, layout }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRelevanceColor = (score) => {
    if (score >= 0.7) return 'bg-green-100 text-green-800'
    if (score >= 0.4) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <article className={`related-post-card ${layout}-card`}>
      <Link href={`/${post.slug}`} className="block h-full">
        <div className="card-content h-full">
          {/* 封面图片 */}
          {post.pageCover && (
            <div className="card-image">
              <img
                src={post.pageCover}
                alt={post.title}
                className="w-full h-48 object-cover rounded-t-lg"
                loading="lazy"
              />
            </div>
          )}

          <div className="card-body p-4 flex flex-col flex-1">
            {/* 标题 */}
            <h4 className="card-title text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
              {post.title}
            </h4>

            {/* 摘要 */}
            {showSummary && post.summary && (
              <p className="card-summary text-gray-600 text-sm mb-3 line-clamp-3 flex-1">
                {post.summary}
              </p>
            )}

            {/* 元信息 */}
            <div className="card-meta flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                {/* 发布日期 */}
                {showDate && post.publishDay && (
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {formatDate(post.publishDay)}
                  </span>
                )}

                {/* 分类 */}
                {post.category && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {post.category}
                  </span>
                )}
              </div>

              {/* 相关性评分 */}
              {post.relevanceScore && (
                <span className={`px-2 py-1 rounded-full text-xs ${getRelevanceColor(post.relevanceScore)}`}>
                  {Math.round(post.relevanceScore * 100)}% 相关
                </span>
              )}
            </div>

            {/* 标签 */}
            {showTags && post.tags && post.tags.length > 0 && (
              <div className="card-tags flex flex-wrap gap-1 mt-2">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-gray-500 text-xs">+{post.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>

      <style jsx>{`
        .related-post-card {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease-in-out;
          overflow: hidden;
          height: 100%;
        }
        
        .related-post-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transform: translateY(-2px);
        }
        
        .card-content {
          display: flex;
          flex-direction: column;
        }
        
        .list-card .card-content {
          flex-direction: row;
        }
        
        .list-card .card-image {
          flex: 0 0 200px;
        }
        
        .list-card .card-image img {
          height: 120px;
          border-radius: 0.5rem 0 0 0.5rem;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .list-card .card-content {
            flex-direction: column;
          }
          
          .list-card .card-image {
            flex: none;
          }
          
          .list-card .card-image img {
            height: 200px;
            border-radius: 0.5rem 0.5rem 0 0;
          }
        }
      `}</style>
    </article>
  )
}

/**
 * 相关文章骨架屏
 */
function RelatedPostsSkeleton({ layout, count }) {
  return (
    <div className="related-posts-skeleton">
      <div className="skeleton-header mb-6">
        <div className="skeleton-title w-32 h-8 bg-gray-200 rounded mb-2"></div>
        <div className="skeleton-line w-12 h-1 bg-gray-200 rounded"></div>
      </div>

      <div className={`skeleton-content ${getLayoutClass(layout)}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-image w-full h-48 bg-gray-200 rounded-t-lg mb-4"></div>
            <div className="skeleton-body p-4">
              <div className="skeleton-title w-full h-6 bg-gray-200 rounded mb-2"></div>
              <div className="skeleton-title w-3/4 h-6 bg-gray-200 rounded mb-3"></div>
              <div className="skeleton-text w-full h-4 bg-gray-200 rounded mb-2"></div>
              <div className="skeleton-text w-full h-4 bg-gray-200 rounded mb-2"></div>
              <div className="skeleton-text w-2/3 h-4 bg-gray-200 rounded mb-3"></div>
              <div className="skeleton-meta flex justify-between">
                <div className="skeleton-date w-24 h-4 bg-gray-200 rounded"></div>
                <div className="skeleton-score w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .skeleton-card {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          overflow: hidden;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
      `}</style>
    </div>
  )
}

/**
 * 获取布局样式类名
 */
function getLayoutClass(layout) {
  switch (layout) {
    case 'list':
      return 'list-layout'
    case 'carousel':
      return 'carousel-layout'
    case 'grid':
    default:
      return 'grid-layout'
  }
}

/**
 * 相关文章Hook
 */
export function useRelatedPosts(currentPost, allPosts, options = {}) {
  const [relatedPosts, setRelatedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentPost || !allPosts?.length) {
      setIsLoading(false)
      return
    }

    try {
      const related = getRelatedPosts(currentPost, allPosts, options)
      setRelatedPosts(related)
      setError(null)
    } catch (err) {
      setError(err)
      setRelatedPosts([])
    } finally {
      setIsLoading(false)
    }
  }, [currentPost, allPosts, options])

  return {
    relatedPosts,
    isLoading,
    error,
    hasRelatedPosts: relatedPosts.length > 0
  }
}