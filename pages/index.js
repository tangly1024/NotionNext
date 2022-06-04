import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import * as ThemeMap from '@/themes'
import { useGlobal } from '@/lib/global'
const Index = props => {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  return <ThemeComponents.LayoutIndex {...props} />
}

export async function getStaticProps() {
  const from = 'index'
  const props = await getGlobalNotionData({ from, pageType: ['Post'] })
  const { allPosts, siteInfo } = props
  const meta = {
    title: `${siteInfo?.title} | ${siteInfo?.description}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: '',
    type: 'website'
  }

  // 处理分页
  const page = 1
  let postsToShow
  if (BLOG.POST_LIST_STYLE !== 'page') {
    postsToShow = Array.from(allPosts)
  } else {
    postsToShow = allPosts?.slice(
      BLOG.POSTS_PER_PAGE * (page - 1),
      BLOG.POSTS_PER_PAGE * page
    )
    if (BLOG.POST_LIST_PREVIEW === 'true') {
      for (const i in postsToShow) {
        const post = postsToShow[i]
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
  }
  props.posts = postsToShow

  return {
    props: {
      meta,
      ...props
    },
    revalidate: 5
  }
}

export default Index
