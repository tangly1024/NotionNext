import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { LayoutIndex, THEME_CONFIG } from '@/themes'

const Index = (props) => {
  return <LayoutIndex {...props}/>
}

export async function getStaticProps () {
  const from = 'index'
  const { allPosts, latestPosts, categories, tags, postCount, customNav } = await getGlobalNotionData({ from, pageType: ['Post'] })
  const meta = {
    title: `${BLOG.TITLE}`,
    description: BLOG.DESCRIPTION,
    type: 'website'
  }

  // 处理分页
  const page = 1
  let postsToShow
  if (BLOG.POST_LIST_STYLE !== 'page') {
    postsToShow = Array.from(allPosts)
  } else {
    postsToShow = allPosts.slice(
      BLOG.POSTS_PER_PAGE * (page - 1),
      BLOG.POSTS_PER_PAGE * page
    )
    if (THEME_CONFIG.POST_LIST_PREVIEW || BLOG.POST_LIST_PREVIEW) {
      for (const i in postsToShow) {
        const post = postsToShow[i]
        const blockMap = await getPostBlocks(post.id, 'slug', BLOG.POST_PREVIEW_LINES)
        if (blockMap) {
          post.blockMap = blockMap
        }
      }
    }
  }

  return {
    props: {
      posts: postsToShow,
      latestPosts,
      postCount,
      tags,
      categories,
      meta,
      customNav
    },
    revalidate: 1
  }
}

export default Index
