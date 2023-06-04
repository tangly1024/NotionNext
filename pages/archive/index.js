import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import BLOG from '@/blog.config'
import Loading from '@/components/Loading'

const ArchiveIndex = props => {
  const { theme, locale } = useGlobal()
  const { siteInfo } = props
  const meta = {
    title: `${locale.NAV.ARCHIVE} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'archive',
    type: 'website'
  }

  const LayoutArchive = dynamic(() => import(`@/themes/${theme}`).then(async (m) => { return m.LayoutArchive }), { ssr: true, loading: () => <Loading /> })
  return <LayoutArchive {...props} meta={meta} />
}

export async function getStaticProps() {
  const props = await getGlobalNotionData({ from: 'archive-index' })
  // 处理分页
  props.posts = props.allPages.filter(page => page.type === 'Post' && page.status === 'Published')
  delete props.allPages

  const postsSortByDate = Object.create(props.posts)

  postsSortByDate.sort((a, b) => {
    const dateA = new Date(a?.date?.start_date || a.createdTime)
    const dateB = new Date(b?.date?.start_date || b.createdTime)
    return dateB - dateA
  })

  const archivePosts = {}

  postsSortByDate.forEach(post => {
    const date = post.date?.start_date?.slice(0, 7) || post.createdTime
    if (archivePosts[date]) {
      archivePosts[date].push(post)
    } else {
      archivePosts[date] = [post]
    }
  })

  props.archivePosts = archivePosts
  delete props.allPages

  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}

export default ArchiveIndex
