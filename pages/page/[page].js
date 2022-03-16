import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'

const Page = (props) => {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  if (!props?.meta) {
    return <ThemeComponents.Layout404 {...props}/>
  }
  return <ThemeComponents.LayoutPage {...props} />
}

export async function getStaticPaths () {
  const from = 'page-paths'
  const { postCount } = await getGlobalNotionData({ from })
  const totalPages = Math.ceil(postCount / BLOG.POSTS_PER_PAGE)
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({ params: { page: '' + (i + 2) } })),
    fallback: true
  }
}

export async function getStaticProps ({ params: { page } }) {
  const from = `page-${page}`
  const {
    allPosts,
    latestPosts,
    categories,
    tags,
    postCount,
    customNav
  } = await getGlobalNotionData({ from })
  const meta = {
    title: `${page} | Page | ${BLOG.TITLE}`,
    description: BLOG.DESCRIPTION,
    type: 'website'
  }

  // 处理分页
  const postsToShow = allPosts.slice(
    BLOG.POSTS_PER_PAGE * (page - 1),
    BLOG.POSTS_PER_PAGE * page
  )
  if (BLOG.POST_LIST_PREVIEW === 'true') {
    for (const i in postsToShow) {
      const post = postsToShow[i]
      const blockMap = await getPostBlocks(post.id, 'slug', BLOG.POST_PREVIEW_LINES)
      if (blockMap) {
        post.blockMap = blockMap
      }
    }
  }

  return {
    props: {
      page,
      posts: postsToShow,
      postCount,
      latestPosts,
      tags,
      categories,
      meta,
      customNav
    },
    revalidate: 1
  }
}

export default Page
