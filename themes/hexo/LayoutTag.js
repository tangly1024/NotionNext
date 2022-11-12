import BLOG from '@/blog.config'
import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'
import TagItemMini from '../next/components/TagItemMini'
import React from 'react'

export const LayoutTag = (props) => {
  const currentTag = props.tags.find((t) => {
    return t.name === props.tag
  })

  return <LayoutBase {...props}>
        {currentTag && (
            <div className="cursor-pointer px-5 py-1 mb-2 font-light hover:underline hover:text-indigo-700 dark:hover:text-indigo-400 transform text-center dark:text-white">
                <TagItemMini tag={currentTag} />
            </div>
        )}
        {BLOG.POST_LIST_STYLE === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}
    </LayoutBase>
}
