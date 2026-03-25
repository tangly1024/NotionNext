import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData, resolvePostProps } from '@/lib/db/SiteDataApi'
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
  const { allPages } = await fetchGlobalAllData({ from })
  const paths = allPages
    ?.filter(row => checkSlugHasMorThanTwoSlash(row))
    .map(row => ({
      params: {
        prefix: row.slug.split('/')[0],
        slug: row.slug.split('/')[1],
        suffix: row.slug.split('/').slice(2)
      }
    }))
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
  const props = await resolvePostProps({
    prefix,
    slug,
    suffix,
    locale,
  })

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
