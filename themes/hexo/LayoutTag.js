import BLOG from '@/blog.config'
import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'
import TagItemMini from '../next/components/TagItemMini'
import React from 'react'
import { getListByPage, getQueryVariable } from '@/lib/utils'

export const LayoutTag = (props) => {
  const currentTag = props.tags.find((t) => {
    return t.name === props.tag
  })

  const [page, updatePage] = React.useState(1)

  const postsPerPage = BLOG.POSTS_PER_PAGE

  const postsToShow = getListByPage(props.posts, page, postsPerPage)

  React.useEffect(() => {
    const qp = getQueryVariable('page')
    console.log('分页', qp)
    if (qp) {
      updatePage(qp)
    }
  })

  return <LayoutBase {...props}>
        {currentTag && (
        <div className="cursor-pointer px-5 py-1 mb-2 font-light hover:underline hover:text-indigo-700 dark:hover:text-indigo-400 transform text-center dark:text-white">
           <TagItemMini tag={currentTag}/>
        </div>
        )
        }
    {BLOG.POST_LIST_STYLE === 'page' ? <BlogPostListPage posts={postsToShow} page={page} {...props} /> : <BlogPostListScroll {...props} />}
   </LayoutBase>
}
git config --global user.email "tlyong1992@hotmail.com"
  git config --global user.name "tangly1024"