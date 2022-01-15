import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'
import { TagIndexLayout } from '@/themes'

const TagIndex = (props) => {
  return <TagIndexLayout {...props} />
}

export async function getStaticProps () {
  const from = 'tag-index-props'
  const {
    categories,
    tags,
    postCount,
    latestPosts
  } = await getGlobalNotionData({
    from,
    includePage: true,
    tagsCount: 0
  })

  return {
    props: {
      tags,
      categories,
      postCount,
      latestPosts
    },
    revalidate: 1
  }
}

export default TagIndex
