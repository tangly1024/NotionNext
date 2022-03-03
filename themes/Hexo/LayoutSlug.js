import BLOG from '@/blog.config'
import { getPageTableOfContents } from 'notion-utils'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import { useRef } from 'react'
import ArticleDetail from './components/ArticleDetail'
import HeaderArticle from './components/HeaderArticle'
import TocDrawer from './components/TocDrawer'
import TocDrawerButton from './components/TocDrawerButton'
import LayoutBase from './LayoutBase'

export const LayoutSlug = props => {
  const { post } = props
  const meta = {
    title: `${post.title} | ${BLOG.TITLE}`,
    description: post.summary,
    type: 'article',
    tags: post.tags
  }

  if (post?.blockMap?.block) {
    post.content = Object.keys(post.blockMap.block)
    post.toc = getPageTableOfContents(post, post.blockMap)
  }

  const drawerRight = useRef(null)
  const targetRef = typeof window !== 'undefined' ? document.getElementById('container') : null

  const floatSlot =
    post?.toc?.length > 1
      ? (
      <div className="block lg:hidden">
        <TocDrawerButton
          onClick={() => {
            drawerRight?.current?.handleSwitchVisible()
          }}
        />
      </div>
        )
      : null

  return (
    <LayoutBase
      headerSlot={<HeaderArticle post={post}/>}
      {...props}
      meta={meta}
      showCategory={false}
      showTag={false}
      floatSlot={floatSlot}
    >
      <div className="w-full dark:border-gray-600 lg:shadow-md lg:hover:shadow-2xl lg:border lg:border-gray-100 lg:rounded-xl lg:px-2 lg:py-4 lg:bg-white lg:dark:bg-gray-800 lg:duration-300">
        <ArticleDetail {...props} />
      </div>

      <div className='block lg:hidden'>
        <TocDrawer post={post} cRef={drawerRight} targetRef={targetRef} />
      </div>

    </LayoutBase>
  )
}
