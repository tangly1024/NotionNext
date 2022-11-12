import { useGlobal } from '@/lib/global'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import * as ThemeMap from '@/themes'
import BLOG from '@/blog.config'

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

export async function getStaticProps({ params: { tag, page } }) {
  const from = 'tag-page-props'
  const props = await getGlobalNotionData({ from })
  // 过滤状态
  props.posts = props.allPages.filter(page => page.type === 'Post' && page.status === 'Published')
  // 过滤标签
  props.posts = props.posts.filter(post => post && post.tags && post.tags.includes(tag))
  // 处理文章页数
  props.postCount = props.posts.length
  // 处理分页
  props.posts = props.posts.slice(BLOG.POSTS_PER_PAGE * (page - 1), BLOG.POSTS_PER_PAGE * page - 1)

  props.tag = tag
  props.page = page

  return {
    props,
    revalidate: 1
  }
}

export async function getStaticPaths() {
  const from = 'tag-page-static-path'
  const { tags } = await getGlobalNotionData({ from })
  const tagNames = []
  tags.forEach(tag => {
    tagNames.push(tag.name)
  })

  return {
    paths: Object.keys(tagNames).map(index => ({
      params: { tag: tagNames[index], page: '1' }
    })),
    fallback: true
  }
}

export default Tag
