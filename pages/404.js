import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'
import Enhanced404Page from '@/components/Enhanced404Page'

/**
 * 404页面 - SEO优化版本
 * @param {*} props
 * @returns
 */
const NoFound = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  const useEnhanced404 = siteConfig('SEO_ENHANCED_404', true, props.NOTION_CONFIG)
  
  // 如果启用增强404页面，使用我们的优化版本
  if (useEnhanced404) {
    return (
      <Enhanced404Page
        locale={props.locale}
        siteInfo={props.siteInfo}
        recentPosts={props.recentPosts || []}
        popularPosts={props.popularPosts || []}
        categories={props.categories || []}
        tags={props.tags || []}
      />
    )
  }
  
  // 否则使用主题默认的404页面
  return <DynamicLayout theme={theme} layoutName='Layout404' {...props} />
}

export async function getStaticProps(req) {
  const { locale } = req

  const props = (await getGlobalData({ from: '404', locale })) || {}
  
  // 为增强404页面获取额外数据
  if (siteConfig('SEO_ENHANCED_404', true)) {
    try {
      // 获取最新文章
      const recentPosts = props.allPages?.slice(0, 6) || []
      
      // 获取热门文章（基于标题长度作为简单的热门度指标）
      const popularPosts = props.allPages
        ?.sort((a, b) => (b.title?.length || 0) - (a.title?.length || 0))
        ?.slice(0, 6) || []
      
      // 获取分类统计
      const categoryStats = {}
      props.allPages?.forEach(post => {
        if (post.category) {
          categoryStats[post.category] = (categoryStats[post.category] || 0) + 1
        }
      })
      
      const categories = Object.entries(categoryStats)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
      
      // 获取标签统计
      const tagStats = {}
      props.allPages?.forEach(post => {
        if (post.tags) {
          post.tags.forEach(tag => {
            tagStats[tag] = (tagStats[tag] || 0) + 1
          })
        }
      })
      
      const tags = Object.entries(tagStats)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20)
      
      props.recentPosts = recentPosts
      props.popularPosts = popularPosts
      props.categories = categories
      props.tags = tags
    } catch (error) {
      console.warn('Error preparing 404 page data:', error)
    }
  }
  
  return { props }
}

export default NoFound
