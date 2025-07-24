import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { getCategoryFromUrlPath, isCustomCategoryPath, getAllCustomCategoryPaths, getAllChineseCategories } from '@/lib/utils/categoryMapping'
import { DynamicLayout } from '@/themes/theme'

/**
 * 分类页
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export async function getStaticProps({ params: { category }, locale }) {
  const from = 'category-props'
  let props = await getGlobalData({ from, locale })

  // 确定实际的分类名（中文）
  let actualCategory = category
  if (isCustomCategoryPath(category)) {
    actualCategory = getCategoryFromUrlPath(category)
  }

  // 过滤状态
  props.posts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  
  // 处理过滤 - 使用实际的中文分类名进行过滤
  props.posts = props.posts.filter(
    post => post && post.category && post.category.includes(actualCategory)
  )
  
  // 处理文章页数
  props.postCount = props.posts.length
  
  // 处理分页
  if (siteConfig('POST_LIST_STYLE') === 'scroll') {
    // 滚动列表 给前端返回所有数据
  } else if (siteConfig('POST_LIST_STYLE') === 'page') {
    props.posts = props.posts?.slice(
      0,
      siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
    )
  }

  delete props.allPages

  // 传递原始的URL参数和实际的分类名
  props = { 
    ...props, 
    category: actualCategory, // 实际的中文分类名
    categoryUrlPath: category, // URL中的路径
    isCustomCategoryPath: isCustomCategoryPath(category)
  }

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export async function getStaticPaths() {
  const from = 'category-paths'
  const { categoryOptions } = await getGlobalData({ from })
  
  const paths = []
  
  // 1. 原有的中文分类路径
  const originalPaths = Object.keys(categoryOptions).map(category => ({
    params: { category: categoryOptions[category]?.name }
  }))
  paths.push(...originalPaths)
  
  // 2. 自定义英文分类路径
  const customPaths = getAllCustomCategoryPaths().map(englishPath => ({
    params: { category: englishPath }
  }))
  paths.push(...customPaths)
  
  return {
    paths: paths,
    fallback: true
  }
}
