import LayoutBase from './LayoutBase'
import StickyBar from './components/StickyBar'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import Mark from 'mark.js'
import BLOG from '@/blog.config'

export const LayoutSearch = (props) => {
  const { locale } = useGlobal()
  const { posts, keyword } = props
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
  }, 200)
  return (
    <LayoutBase {...props} >
      <StickyBar>
        <div className="p-4 dark:text-gray-200">
          <i className="mr-1 fas fa-search" />{' '}
          {posts?.length} {locale.COMMON.RESULT_OF_SEARCH}
        </div>
      </StickyBar>
      <div className="md:mt-5">
      {BLOG.POST_LIST_STYLE !== 'page'
        ? <BlogPostListScroll {...props} showSummary={true} />
        : <BlogPostListPage {...props} />
            }      </div>
    </LayoutBase>
  )
}
