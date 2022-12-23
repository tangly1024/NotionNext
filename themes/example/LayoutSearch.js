import BLOG from '@/blog.config'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import SearchInput from './components/SearchInput'
import Mark from 'mark.js'
import LayoutBase from './LayoutBase'
import { isBrowser } from '@/lib/utils'

export const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      const container = isBrowser() && document.getElementById('container')
      if (container && container.innerHTML) {
        const re = new RegExp(keyword, 'gim')
        const instance = new Mark(container)
        instance.markRegExp(re, {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        })
      }
    }, 100)
  }, [router.events])

  useEffect(() => {
    setTimeout(() => {
      if (keyword) {
        const targets = document.getElementsByClassName('replace')
        for (const container of targets) {
          if (container && container.innerHTML) {
            const re = new RegExp(`${keyword}`, 'gim')
            container.innerHTML = container.innerHTML.replace(
              re,
              `<span class='text-red-500 border-b border-dashed'>${keyword}</span>`
            )
          }
        }
      }
    }, 100)
  }, [])

  return <LayoutBase {...props}>
        <div className='pb-12'>
            <SearchInput {...props} />
        </div>

        {BLOG.POST_LIST_STYLE === 'page' ? <BlogListPage {...props} /> : <BlogListScroll {...props} />}

    </LayoutBase>
}
