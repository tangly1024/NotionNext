import LayoutBase from './LayoutBase'
import StickyBar from './components/StickyBar'
import BlogPostListScroll from './components/BlogPostListScroll'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'

export const LayoutSearch = (props) => {
  const { locale } = useGlobal()
  const { posts, keyword } = props
  setTimeout(() => {
    const container = isBrowser() && document.getElementById('container')
    if (container && container.innerHTML) {
      const re = new RegExp(`${keyword}`, 'gim')
      container.innerHTML = container.innerHTML.replace(re, `<span class='text-red-500 border-b border-dashed'>${keyword}</span>`)
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
        <BlogPostListScroll {...props} showSummary={true} />
      </div>
    </LayoutBase>
  )
}
