import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'

/**
 * 标签首页
 * @param {*} props
 * @returns
 */
const TagIndex = props => {
  const { locale } = useGlobal()
  const { siteInfo, Layout } = props

  const meta = {
    title: `${locale.COMMON.TAGS} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'tag',
    type: 'website'
  }
  props = { ...props, meta }

  return <Layout {...props} />
}

export async function getStaticProps() {
  const from = 'tag-index-props'
  const props = await getGlobalNotionData({ from })
  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}

export default TagIndex
