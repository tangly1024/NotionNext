import ArticleDetail from '@/components/ArticleDetail'
import BaseLayout from '@/layouts/BaseLayout'
import { useGlobal } from '@/lib/global'
import { getAllCategories, getAllPosts, getAllTags, getPostBlocks } from '@/lib/notion'
import { getNotionPageData } from '@/lib/notion/getNotionData'
import Custom404 from '@/pages/404'
import { getPageTableOfContents } from 'notion-utils'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import React from 'react'
import BLOG from '@/blog.config'

/**
 * 关于页面，默认取notion中slug为about的文章
 * @param {*} param0
 * @returns
 */
const About = ({ post, blockMap, tags, prev, next, allPosts, categories }) => {
  if (!post) {
    return <Custom404 />
  }
  const { locale } = useGlobal()
  post.title = locale.NAV.ABOUT
  const meta = {
    title: `${locale.NAV.ABOUT} | ${BLOG.title} `,
    description: post.summary,
    type: 'post',
    tags: []
  }

  return <BaseLayout meta={meta} tags={tags} post={post} totalPosts={allPosts} categories={categories}>
      <ArticleDetail post={post} blockMap={blockMap} allPosts={allPosts}/>
  </BaseLayout>
}

export async function getStaticProps () {
  const from = 'about-props'
  const notionPageData = await getNotionPageData({ from })
  let allPosts = await getAllPosts({ notionPageData, from, includePage: true })
  const post = allPosts.find(p => p.slug === 'about')

  if (!post) {
    return { props: {}, revalidate: 1 }
  }

  const blockMap = await getPostBlocks(post.id, 'slug')
  post.toc = []
  if (blockMap) {
    post.content = Object.keys(blockMap.block)
    post.toc = getPageTableOfContents(post, blockMap)
  }

  allPosts = allPosts.filter(post => post.type[0] === 'Post')
  const tagOptions = notionPageData.tagOptions
  const tags = await getAllTags({ allPosts, tagOptions })
  const categories = await getAllCategories(allPosts)
  const index = allPosts.indexOf(post)
  const prev = allPosts.slice(index - 1, index)[0] ?? allPosts.slice(-1)[0]
  const next = allPosts.slice(index + 1, index + 2)[0] ?? allPosts[0]

  return {
    props: { post, blockMap, tags, prev, next, allPosts, categories },
    revalidate: 1
  }
}

export default About
