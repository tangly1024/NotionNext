import { useGlobal } from '@/lib/global'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import * as ThemeMap from '@/themes'

const Tag = props => {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  const { locale } = useGlobal()
  const { tag, siteInfo, posts } = props

  if (!posts) {
    return <ThemeComponents.Layout404 {...props} />
  }

  const meta = {
    title: `${tag} | ${locale.COMMON.TAGS} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'tag/' + tag,
    type: 'website'
  }
  return <ThemeComponents.LayoutTag {...props} meta={meta} />
}

export async function getStaticProps({ params: { tag } }) {
  const props = await getGlobalNotionData({
    from: 'tag-props',
    includePage: false,
    tagsCount: 0
  })
  const { allPosts } = props
  props.posts = allPosts.filter(
    post => post && post.tags && post.tags.includes(tag)
  )
  props.tag = tag
  return {
    props,
    revalidate: 1
  }
}

/**
 * 获取所有的标签
 * @returns
 * @param tags
 */
function getTagNames(tags) {
  const tagNames = []
  tags.forEach(tag => {
    tagNames.push(tag.name)
  })
  return tagNames
}

export async function getStaticPaths() {
  const from = 'tag-static-path'
  const { tags } = await getGlobalNotionData({ from })
  const tagNames = getTagNames(tags)

  return {
    paths: Object.keys(tagNames).map(index => ({
      params: { tag: tagNames[index] }
    })),
    fallback: true
  }
}

export default Tag
