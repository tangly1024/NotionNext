import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'
import SEO404 from './SEO404'

/**
 * 增强的404页面组件
 * 集成SEO优化、相关内容推荐和智能重定向
 */
export default function Enhanced404Page({ 
  locale, 
  siteInfo, 
  recentPosts = [], 
  popularPosts = [],
  categories = [],
  tags = []
}) {
  const router = useRouter()
  const [relatedContent, setRelatedContent] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 404页面发生时记录错误
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      const referrer = document.referrer
      const userAgent = navigator.userAgent

      // 记录404错误到监控系统
      fetch('/api/seo/404-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: currentPath,
          referrer,
          userAgent,
          timestamp: Date.now()
        })
      }).catch(error => {
        console.warn('Failed to log 404 error:', error)
      })

      // 生成相关内容推荐
      generateRelatedContent(currentPath)
    }
  }, [])

  /**
   * 生成相关内容推荐
   */
  const generateRelatedContent = (errorPath) => {
    const content = []

    // 基于URL路径分析推荐内容
    if (errorPath.includes('/post/') || errorPath.includes('/article/')) {
      // 推荐最新文章
      content.push(...recentPosts.slice(0, 3).map(post => ({
        type: 'recent_post',
        title: post.title,
        url: post.slug,
        description: post.summary || post.description,
        date: post.date
      })))
    }

    if (errorPath.includes('/category/')) {
      // 推荐热门分类
      content.push(...categories.slice(0, 5).map(category => ({
        type: 'category',
        title: `${category.name} (${category.count}篇文章)`,
        url: `/category/${category.name}`,
        description: `浏览${category.name}分类下的所有文章`
      })))
    }

    if (errorPath.includes('/tag/')) {
      // 推荐热门标签
      content.push(...tags.slice(0, 8).map(tag => ({
        type: 'tag',
        title: `#${tag.name}`,
        url: `/tag/${tag.name}`,
        description: `${tag.count}篇相关文章`
      })))
    }

    // 如果没有特定推荐，显示热门文章
    if (content.length === 0) {
      content.push(...popularPosts.slice(0, 5).map(post => ({
        type: 'popular_post',
        title: post.title,
        url: post.slug,
        description: post.summary || post.description,
        views: post.views
      })))
    }

    setRelatedContent(content)
  }

  /**
   * 处理搜索
   */
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="enhanced-404-page">
      {/* SEO优化组件 */}
      <SEO404 locale={locale} siteInfo={siteInfo} />
      
      <div className="container mx-auto px-4 py-8">
        {/* 主要错误信息 */}
        <div className="text-center mb-12">
          <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            页面未找到
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            抱歉，您访问的页面不存在。可能是链接已过期或URL输入错误。
          </p>
        </div>

        {/* 搜索功能 */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章、标签或分类..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="搜索网站内容"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? '搜索中...' : '搜索'}
            </button>
          </form>
        </div>

        {/* 相关内容推荐 */}
        {relatedContent.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              您可能感兴趣的内容
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedContent.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-3">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    <a 
                      href={item.url}
                      className="text-gray-800 hover:text-blue-600 transition-colors"
                    >
                      {item.title}
                    </a>
                  </h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {item.description}
                    </p>
                  )}
                  {item.date && (
                    <div className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString('zh-CN')}
                    </div>
                  )}
                  {item.views && (
                    <div className="text-xs text-gray-500">
                      {item.views} 次阅读
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 快速导航 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            快速导航
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <a
              href="/"
              className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-2xl mb-2">🏠</div>
              <div className="font-semibold">首页</div>
            </a>
            <a
              href="/archive"
              className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-2xl mb-2">📚</div>
              <div className="font-semibold">文章归档</div>
            </a>
            <a
              href="/category"
              className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="text-2xl mb-2">📂</div>
              <div className="font-semibold">分类浏览</div>
            </a>
            <a
              href="/tag"
              className="block p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="text-2xl mb-2">🏷️</div>
              <div className="font-semibold">标签云</div>
            </a>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            如果您认为这是一个错误，请联系我们
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← 返回上一页
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 获取内容类型颜色
 */
function getTypeColor(type) {
  const colors = {
    recent_post: 'bg-blue-100 text-blue-800',
    popular_post: 'bg-red-100 text-red-800',
    category: 'bg-green-100 text-green-800',
    tag: 'bg-purple-100 text-purple-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

/**
 * 获取内容类型标签
 */
function getTypeLabel(type) {
  const labels = {
    recent_post: '最新文章',
    popular_post: '热门文章',
    category: '分类',
    tag: '标签'
  }
  return labels[type] || '推荐'
}