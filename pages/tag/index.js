import BLOG from '@/blog.config'
import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { compactPostForLatest } from '@/lib/utils/compactPost'
import { DynamicLayout } from '@/themes/theme'
import { useRouter } from 'next/router'

/**
 * 标签首页
 * @param {*} props
 * @returns
 */
const TagIndex = props => {
  const router = useRouter()
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutTagIndex' {...props} />
}

export async function getStaticProps(req) {
  const { locale } = req

  const from = 'tag-index-props'
  const props = await getGlobalData({ from, locale })
  props.latestPosts = props.latestPosts?.map(post => compactPostForLatest(post))
  props.allNavPages = []
  delete props.allPages
  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default TagIndex
