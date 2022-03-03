import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'

const ArchiveIndex = (props) => {
  const { ThemeComponents } = useGlobal()
  return <ThemeComponents.LayoutArchive {...props}/>
}

export async function getStaticProps () {
  const { allPosts, categories, tags, postCount, customNav } =
    await getGlobalNotionData({ from: 'archive-index' })

  return {
    props: {
      posts: allPosts,
      tags,
      categories,
      postCount,
      customNav
    },
    revalidate: 1
  }
}

export default ArchiveIndex
