import BLOG from '@/blog.config'
import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'
import React from 'react'
import Link from 'next/link'

export const LayoutTag = (props) => {
  const tag = props?.tagOptions?.find((t) => {
    return t.name === props.tag
  })

  return (
      <LayoutBase {...props} className='mt-8'>
            {tag && (
                <div className="cursor-pointer px-3 py-2 mb-2 font-light hover:text-indigo-700 dark:hover:text-indigo-400 transform dark:text-white">
                    <Link
                        key={tag}
                        href={`/tag/${encodeURIComponent(tag.name)}`}
                        passHref
                        className={`cursor-pointer inline-block rounded duration-200
                                mr-2 py-0.5 px-1 text-xl whitespace-nowrap ` }>

                        <div className='font-light dark:text-gray-400 dark:hover:text-white'> #{tag.name + (tag.count ? `(${tag.count})` : '')} </div>

                    </Link>
                </div>
            )}
            {BLOG.POST_LIST_STYLE === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}
        </LayoutBase>
  )
}

export default LayoutTag
