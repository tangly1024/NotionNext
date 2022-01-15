import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { LayoutIndex } from '@/themes'

const Index = (props) => {
  return <LayoutIndex {...props}/>
}

export async function getStaticProps () {
  const from = 'index'
  const { allPosts, latestPosts, categories, tags, postCount } = await getGlobalNotionData({ from })
  const meta = {
    title: `${BLOG.title}`,
    description: BLOG.description,
    type: 'website'
  }

  // 处理分页
  const page = 1
  let postsToShow
  if (BLOG.postListStyle !== 'page') {
    postsToShow = Array.from(allPosts)
  } else {
    postsToShow = allPosts.slice(
      BLOG.postsPerPage * (page - 1),
      BLOG.postsPerPage * page
    )
    for (const i in postsToShow) {
      const post = postsToShow[i]
      const blockMap = await getPostBlocks(post.id, 'slug', BLOG.home.previewLines)
      if (blockMap) {
        post.blockMap = blockMap
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
      meta
    },
    revalidate: 1
  }
}

export default Index
