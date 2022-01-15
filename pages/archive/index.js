import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { ArchiveLayout } from '@/themes'

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
  return <ArchiveLayout {...props}/>
}

export default ArchiveIndex
