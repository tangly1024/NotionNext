import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { LayoutArchive } from '@/themes'

export async function getStaticProps () {
  const { allPosts, categories, tags, postCount } =
    await getGlobalNotionData({ from: 'archive-index' })

  return {
    props: {
      posts: allPosts,
      tags,
      categories,
      postCount
    },
    revalidate: 1
  }
}

const ArchiveIndex = (props) => {
  return <LayoutArchive {...props}/>
}

export default ArchiveIndex
