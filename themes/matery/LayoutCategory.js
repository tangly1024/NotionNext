import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'
import BLOG from '@/blog.config'
import Link from 'next/link'
import HeaderArticle from './components/HeaderArticle'

export const LayoutCategory = props => {
  const { category, categoryOptions } = props
  return (
      <LayoutBase {...props} headerSlot={<HeaderArticle {...props} />} >

            <div id='inner-wrapper' className='w-full'>

                <div className="drop-shadow-xl -mt-32 rounded-md mx-3 px-5 lg:border lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray  dark:border-black">

                    <div className='flex justify-center flex-wrap'>
                        {categoryOptions?.map(e => {
                          const selected = e.name === category
                          return (
                              <Link key={e.name} href={`/category/${e.name}`} passHref legacyBehavior>
                                  <div className='duration-300 text-md whitespace-nowrap dark:hover:text-white px-5 cursor-pointer py-2 hover:text-indigo-400' >
                                      <i className={`mr-4 fas  ${selected ? 'fa-folder-open' : 'fa-folder'}`}/>
                                      {e.name}({e.count})
                                  </div>
                              </Link>
                          )
                        })}
                    </div>
                </div>

                {BLOG.POST_LIST_STYLE === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}

            </div>

        </LayoutBase>
  )
}

export default LayoutCategory
