import BLOG from '@/blog.config'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostListScroll from './components/BlogPostListScroll'
import Header from './components/Header'
import CONFIG_HEXO from './config_hexo'
import LayoutBase from './LayoutBase'
import React from 'react'

export const LayoutIndex = (props) => {
  const headerSlot = CONFIG_HEXO.HOME_BANNER_ENABLE && <Header {...props} />
  return <LayoutBase {...props} headerSlot={headerSlot} className='pt-8'>
    {BLOG.POST_LIST_STYLE === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}
  </LayoutBase>
}

export default LayoutIndex
