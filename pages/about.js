import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import Custom404 from '@/pages/404'
import React from 'react'
import { ArticleLayout } from '@/themes'

/**
 * 关于页面，默认取notion中slug为about的文章
 * @param {*} param0
 * @returns
 */
const About = (props) => {
  if (!props.post) {
    return <Custom404 />
  }
  return <ArticleLayout {...props} />
}

export async function getStaticProps () {
  const from = 'about-props'
  const {
    allPosts,
    categories,
    tags,
    postCount,
    latestPosts
  } = await getGlobalNotionData({
    from,
    includePage: true
  })
  const post = allPosts.find(p => p.slug === 'about')

  if (!post) {
    return {
      props: {},
      revalidate: 1
    }
  }

  post.blockMap = await getPostBlocks(post.id, 'slug')

  const index = allPosts.indexOf(post)
  const prev = allPosts.slice(index - 1, index)[0] ?? allPosts.slice(-1)[0]
  const next = allPosts.slice(index + 1, index + 2)[0] ?? allPosts[0]

  return {
    props: {
      post,
      tags,
      prev,
      next,
      categories,
      postCount,
      latestPosts
    },
    revalidate: 1
  }
}

export default About
