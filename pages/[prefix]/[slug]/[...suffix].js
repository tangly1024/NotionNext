import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPost } from '@/lib/db/getSiteData'
import { checkSlugHasMorThanTwoSlash, processPostData } from '@/lib/utils/post'
import { idToUuid } from 'notion-utils'
import Slug from '..'

/**
 * 根据notion的slug访问页面
 * 解析三级以上目录 /article/2023/10/29/test
 * @param {*} props
 * @returns
 */
const PrefixSlug = props => {
  return <Slug {...props} />
}

/**
 * 编译渲染页面路径
 * @returns
 */
export async function getStaticPaths() {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: true
    }
  }

  const from = 'slug-paths'
  const { allPages } = await getGlobalData({ from })

  // 【关键修复1】添加健壮性检查，防止 allPages 为空时构建崩溃
  if (!allPages || allPages.length === 0) {
    return {
      paths: [],
      fallback: true
    }
  }

  const paths = allPages
    .filter(row => checkSlugHasMorThanTwoSlash(row))
    .map(row => {
      const slugParts = row.slug.split('/');
      if (slugParts.length >= 3) {
        return {
          params: {
            prefix: slugParts[0],
            slug: slugParts[1],
            suffix: slugParts.slice(2)
          }
        };
      }
      return null;
    })
    .filter(Boolean); // 过滤掉无效路径

  return {
    paths: paths,
    fallback: true
  }
}

/**
 * 抓取页面数据
 * @param {*} param0
 * @returns
 */
export async function getStaticProps({
  params: { prefix, slug, suffix },
  locale
}) {
  const fullSlug = [prefix, slug, ...(suffix || [])].join('/');
  const from = `slug-props-${fullSlug}`
  const props = await getGlobalData({ from, locale })

  // 在列表内查找文章
  props.post = props?.allPages?.find(p => {
    return (
      p.type.indexOf('Menu') < 0 &&
      (p.slug === suffix.join('/') ||
        p.slug === fullSlug ||
        p.id === idToUuid(fullSlug))
    )
  })

  // 【关键修复2】修正提取 pageId 的逻辑
  // 处理非列表内文章的信息
  if (!props?.post) {
    // pageId 应该是 URL 的最后一部分
    const pageId = suffix?.length > 0 ? suffix[suffix.length - 1] : null;
    if (pageId && pageId.length >= 32) {
      try {
        const post = await getPost(pageId)
        props.post = post
      } catch (error) {
          console.error('Failed to get post by pageId', pageId, error)
      }
    }
  }

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
