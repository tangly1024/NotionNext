import BLOG from '@/blog.config'
import { getPageTableOfContents } from 'notion-utils'
import TocDrawerButton from './components/TocDrawerButton'
import LayoutBase from './LayoutBase'
import Card from './components/Card'
import LatestPostsGroup from './components/LatestPostsGroup'
import ArticleDetail from './components/ArticleDetail'
import TocDrawer from './components/TocDrawer'
import Live2D from './components/Live2D'
import { useRef } from 'react'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import { CONFIG_NEXT } from './index'

const LayoutSlug = ({
  post,
  tags,
  prev,
  next,
  recommendPosts,
  categories,
  postCount,
  latestPosts
}) => {
  const meta = {
    title: `${post.title} | ${BLOG.title}`,
    description: post.summary,
    type: 'article',
    tags: post.tags
  }

  const drawerRight = useRef(null)
  const targetRef = typeof window !== 'undefined' ? document.getElementById('container') : null
  post.content = Object.keys(post?.blockMap?.block)
  post.toc = getPageTableOfContents(post, post.blockMap)
  const floatSlot = post?.toc?.length > 1
    ? <div className='block lg:hidden'><TocDrawerButton onClick={() => {
      drawerRight?.current?.handleSwitchVisible()
    }} /></div>
    : null

  return (
    <LayoutBase
      meta={meta}
      tags={tags}
      post={post}
      postCount={postCount}
      latestPosts={latestPosts}
      categories={categories}
      floatSlot={floatSlot}
      rightAreaSlot={
        CONFIG_NEXT.RIGHT_LATEST_POSTS && <Card><LatestPostsGroup posts={latestPosts} /></Card>
      }
    >
      <ArticleDetail
        post={post}
        recommendPosts={recommendPosts}
        prev={prev}
        next={next}
      />

      {/* 悬浮目录按钮 */}
      <div className='block lg:hidden'>
        <TocDrawer post={post} cRef={drawerRight} targetRef={targetRef} />
      </div>

      {/* 宠物 */}
      <Live2D />

    </LayoutBase>
  )
}

export default LayoutSlug
