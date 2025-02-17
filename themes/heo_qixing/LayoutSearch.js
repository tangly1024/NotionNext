import { useRouter } from 'next/router'
import { useEffect } from 'react'
import BlogPostListPage from '@/themes/heo/components/BlogPostListPage'
import dynamic from 'next/dynamic'
import { siteConfig } from '@/lib/config'

const replaceSearchResult = dynamic(() => import('@/components/Mark'))
const SearchNav = dynamic(() => import('./components/SearchNav'))
const BlogPostListScroll = dynamic(
  () => import('./components/BlogPostListScroll')
)
/**
 * 搜索
 * @param {*} props
 * @returns
 */
export const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()
  const currentSearch = keyword || router?.query?.s

  useEffect(() => {
    // 高亮搜索结果
    if (currentSearch) {
      setTimeout(() => {
        replaceSearchResult({
          doms: document.getElementsByClassName('replace'),
          search: currentSearch,
          target: {
            element: 'span',
            className: 'text-red-500 border-b border-dashed'
          }
        })
      }, 100)
    }
  }, [])
  return (
    <div currentSearch={currentSearch}>
      <div id='post-outer-wrapper' className='px-5  md:px-0'>
        {!currentSearch ? (
          <SearchNav {...props} />
        ) : (
          <div id='posts-wrapper'>
            {siteConfig('POST_LIST_STYLE') === 'page' ? (
              <BlogPostListPage {...props} />
            ) : (
              <BlogPostListScroll {...props} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
