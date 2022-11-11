import BLOG from '@/blog.config'
import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'
import TagItemMini from '../next/components/TagItemMini'
import PaginationNumber from './PaginationNumber'
import BlogPostListEmpty from './BlogPostListEmpty'

export const LayoutTag = (props) => {
  const currentTag = props.tags.find((t) => {
    return t.name === props.tag
  })

  const totalPage = Math.ceil(props.postCount / BLOG.POSTS_PER_PAGE)
  const showPagination = props.postCount >= BLOG.POSTS_PER_PAGE

  props.headerSlot = <div className="cursor-pointer px-5 py-1 mb-2 font-light hover:underline hover:text-indigo-700 dark:hover:text-indigo-400 transform text-center dark:text-white">
    <TagItemMini tag={currentTag}/>
  </div>

  // 空文章处理
  if (!props.postToShow || props.postToShow.length === 0) {
    return <LayoutBase {...props}> <BlogPostListEmpty/></LayoutBase>
  }

  const page = 1
  return <LayoutBase {...props}>
            <div className="cursor-pointer px-5 py-1 mb-2 font-light hover:underline hover:text-indigo-700 dark:hover:text-indigo-400 transform text-center dark:text-white">
                <TagItemMini tag={currentTag}/>
            </div>

            { props.postToShow && props.postToShow.length > 0
              ? (<>
                {BLOG.POST_LIST_STYLE === 'page'
                  ? (<div id="container" className='w-full'>
                        <BlogPostListPage {...props} />
                        { showPagination && <PaginationNumber page={page} totalPage={totalPage} /> }
                    </div>)
                  : <BlogPostListScroll {...props} />}=
              </>)
              : (<BlogPostListEmpty/>)
            }

   </LayoutBase>
}
