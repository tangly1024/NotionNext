import { useGlobal } from '@/lib/global'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'
import Loading from '@/components/Loading'
const layout = 'LayoutTag'
/**
 * 加载默认主题
 */
const DefaultLayout = dynamic(() => import(`@/themes/${BLOG.THEME}/${layout}`), { ssr: true })

const Tag = props => {
  const { theme } = useGlobal()
  const { locale } = useGlobal()
  const { tag, siteInfo } = props
  const [Layout, setLayout] = useState(DefaultLayout)

  // 切换主题
  useEffect(() => {
    const loadLayout = async () => {
      const newLayout = await dynamic(() => import(`@/themes/${theme}/${layout}`))
      setLayout(newLayout)
    }
    loadLayout()
  }, [theme])

  const meta = {
    title: `${tag} | ${locale.COMMON.TAGS} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'tag/' + tag,
    type: 'website'
  }
  props = { ...props, meta }

  return <Suspense fallback={<Loading/>}>
    <Layout {...props} />
  </Suspense>
}

export async function getStaticProps({ params: { tag } }) {
  const from = 'tag-props'
  const props = await getGlobalNotionData({ from })

  // 过滤状态
  props.posts = props.allPages.filter(page => page.type === 'Post' && page.status === 'Published').filter(post => post && post.tags && post.tags.includes(tag))

  // 处理文章页数
  props.postCount = props.posts.length

  // 处理分页
  if (BLOG.POST_LIST_STYLE === 'scroll') {
    // 滚动列表 给前端返回所有数据
  } else if (BLOG.POST_LIST_STYLE === 'page') {
    props.posts = props.posts?.slice(0, BLOG.POSTS_PER_PAGE)
  }

  props.tag = tag
  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
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
  const { tagOptions } = await getGlobalNotionData({ from })
  const tagNames = getTagNames(tagOptions)

  return {
    paths: Object.keys(tagNames).map(index => ({
      params: { tag: tagNames[index] }
    })),
    fallback: true
  }
}

export default Tag
