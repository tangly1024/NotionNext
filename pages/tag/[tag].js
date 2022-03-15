import { useGlobal } from '@/lib/global'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import * as ThemeMap from '@/themes'

const Tag = (props) => {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  return <ThemeComponents.LayoutTag {...props} />
}

export async function getStaticProps ({ params }) {
  const tag = params.tag
  const from = 'tag-props'
  const {
    allPosts,
    categories,
    tags,
    postCount,
    latestPosts,
    customNav
  } = await getGlobalNotionData({
    from,
    includePage: false,
    tagsCount: 0
  })
  const filteredPosts = allPosts.filter(
    post => post && post.tags && post.tags.includes(tag)
  )
  return {
    props: {
      tags,
      posts: filteredPosts,
      tag,
      categories,
      postCount,
      latestPosts,
      customNav
    },
    revalidate: 1
  }
}

/**
 * 获取所有的标签
 * @returns
 * @param tags
 */
function getTagNames (tags) {
  const tagNames = []
  tags.forEach(tag => {
    tagNames.push(tag.name)
  })
  return tagNames
}

export async function getStaticPaths () {
  const from = 'tag-static-path'
  const { tags } = await getGlobalNotionData({ from, tagsCount: 0 })
  const tagNames = getTagNames(tags)

  return {
    paths: Object.keys(tagNames).map(index => ({ params: { tag: tagNames[index] } })),
    fallback: true
  }
}

export default Tag
