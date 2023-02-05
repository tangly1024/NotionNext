import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'
import BLOG from '@/blog.config'

const ArchiveIndex = props => {
  const { theme, locale } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  const { siteInfo } = props
  const meta = {
    title: `${locale.NAV.ARCHIVE} | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'archive',
    type: 'website'
  }

  return <ThemeComponents.LayoutArchive {...props} meta={meta} />
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
