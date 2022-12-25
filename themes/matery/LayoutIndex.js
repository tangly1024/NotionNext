import BLOG from '@/blog.config'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostListScroll from './components/BlogPostListScroll'
import Header from './components/Header'
import CONFIG_MATERY from './config_matery'
import LayoutBase from './LayoutBase'
import React from 'react'

export const LayoutIndex = (props) => {
  return <LayoutBase {...props} headerSlot={CONFIG_MATERY.HOME_BANNER_ENABLE && <Header {...props} />}>
    {BLOG.POST_LIST_STYLE === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}
  </LayoutBase>
}
