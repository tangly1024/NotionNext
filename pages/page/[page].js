import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'

const Page = props => {
  const { theme } = useGlobal()
  const { siteInfo } = props
  const ThemeComponents = ThemeMap[theme]
  if (!siteInfo) {
    return <></>
  }
  const meta = {
    title: `${props.page} | Page | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'page/' + props.page,
    type: 'website'
  }
  return <ThemeComponents.LayoutPage {...props} meta={meta} />
}

export async function getStaticPaths() {
  const from = 'page-paths'
  const { postCount } = await getGlobalNotionData({ from })
  const totalPages = Math.ceil(postCount / BLOG.POSTS_PER_PAGE)
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export async function getStaticProps({ params: { page } }) {
  const from = `page-${page}`
  const props = await getGlobalNotionData({ from })
  props.page = page
  // 处理分页
  props.posts = props.allPosts.slice(
    BLOG.POSTS_PER_PAGE * (page - 1),
    BLOG.POSTS_PER_PAGE * page
  )
  if (BLOG.POST_LIST_PREVIEW === 'true') {
    for (const i in props.posts) {
      const post = props.posts[i]
      if (post.password && post.password !== '') {
        continue
      }
      const blockMap = await getPostBlocks(
        post.id,
        'slug',
        BLOG.POST_PREVIEW_LINES
      )
      if (blockMap) {
        post.blockMap = blockMap
      }
    }
  }

  return {
    props,
    revalidate: 1
  }
}

export default Page
