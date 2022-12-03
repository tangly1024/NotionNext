import LayoutBase from './LayoutBase'
import BLOG from '@/blog.config'
import BlogListPage from './components/BlogListPage'
import BlogListScroll from './components/BlogListScroll'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Mark from 'mark.js'
import { isBrowser } from '@/lib/utils'

export const LayoutSearch = (props) => {
  const { keyword } = props
  const router = useRouter()
  const currentSearch = keyword || router?.query?.s
  useEffect(() => {
    setTimeout(() => {
      const container = isBrowser() && document.getElementById('container')
      if (container && container.innerHTML) {
        const re = new RegExp(currentSearch, 'gim')
        const instance = new Mark(container)
        instance.markRegExp(re, {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        })
      }
    }, 100)
  })
  return <LayoutBase {...props} currentSearch={currentSearch}>
    {BLOG.POST_LIST_STYLE === 'page' ? <BlogListPage {...props} /> : <BlogListScroll {...props}/>}
  </LayoutBase>
}
