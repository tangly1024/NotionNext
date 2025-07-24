import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPost } from '@/lib/db/getSiteData'
import { checkSlugHasOneSlash, processPostData } from '@/lib/utils/post'
import { parseCustomUrl, isCustomCategoryPath, getAllCustomCategoryPaths } from '@/lib/utils/categoryMapping'
import { idToUuid } from 'notion-utils'
import Slug from '..'

/**
 * 根据notion的slug访问页面
 * 解析二级目录 /article/about
 * @param {*} props
 * @returns
 */
const PrefixSlug = props => {
  return <Slug {...props} />
}

export async function getStaticPaths() {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: true
    }
  }

  const from = 'slug-paths'
  const { allPages } = await getGlobalData({ from })

  const paths = []

  // 1. 原有的 prefix/slug 路径（例如 article/test）
  const originalPaths = allPages
    ?.filter(row => checkSlugHasOneSlash(row))
    .map(row => ({
      params: { prefix: row.slug.split('/')[0], slug: row.slug.split('/')[1] }
    }))
  
  if (originalPaths) {
    paths.push(...originalPaths)
  }

  // 2. 自定义分类路径（例如 movie/qiwushi）
  const customCategoryPaths = getAllCustomCategoryPaths()
  const postsWithCategory = allPages?.filter(page => 
    page.type === 'Post' && 
    page.status === 'Published' && 
    page.category
  )

  postsWithCategory?.forEach(post => {
    const { category, slug: postSlug } = parseCustomUrl('', '')
    
    // 为每个有分类的文章生成自定义URL路径
    customCategoryPaths.forEach(categoryPath => {
      // 检查这个文章的分类是否匹配当前的自定义分类路径
      const { category: mappedCategory } = parseCustomUrl(categoryPath, '')
      
      if (post.category === mappedCategory) {
        const slug = post.slug?.split('/').pop() || post.id
        paths.push({
          params: { 
            prefix: categoryPath, 
            slug: slug 
          }
        })
      }
    })
  })

  return {
    paths: paths,
    fallback: true
  }
}

export async function getStaticProps({ params: { prefix, slug }, locale }) {
  const from = `slug-props-${prefix}-${slug}`
  const props = await getGlobalData({ from, locale })

  let post = null

  // 检查是否为自定义分类路径
  if (isCustomCategoryPath(prefix)) {
    // 解析自定义URL
    const { category: chineseCategory } = parseCustomUrl(prefix, slug)
    
    // 根据分类和slug查找文章
    post = props?.allPages?.find(p => {
      return (
        p.type === 'Post' &&
        p.status === 'Published' &&
        p.category === chineseCategory &&
        (p.slug === slug || 
         p.slug?.endsWith('/' + slug) || 
         p.id === slug ||
         p.id === idToUuid(slug))
      )
    })
  } else {
    // 原有逻辑：处理 prefix/slug 格式
    const fullSlug = prefix + '/' + slug
    
    post = props?.allPages?.find(p => {
      return (
        p.type.indexOf('Menu') < 0 &&
        (p.slug === slug || p.slug === fullSlug || p.id === idToUuid(fullSlug))
      )
    })
  }

  // 处理非列表内文章的信息
  if (!post) {
    const pageId = slug.slice(-1)[0]
    if (pageId && pageId.length >= 32) {
      post = await getPost(pageId)
    }
  }

  props.post = post

  if (!props?.post) {
    // 无法获取文章
    props.post = null
  } else {
    await processPostData(props, from)
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

export default PrefixSlug
