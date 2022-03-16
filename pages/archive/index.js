import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'

const ArchiveIndex = (props) => {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
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
