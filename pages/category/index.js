import BLOG from '@/blog.config'
import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { compactPostForLatest } from '@/lib/utils/compactPost'
import { DynamicLayout } from '@/themes/theme'

/**
 * 分类首页
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    <DynamicLayout theme={theme} layoutName='LayoutCategoryIndex' {...props} />
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'category-index-props', locale })
  props.latestPosts = props.latestPosts?.map(post => compactPostForLatest(post))
  props.allNavPages = []
  delete props.allPages
  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}
