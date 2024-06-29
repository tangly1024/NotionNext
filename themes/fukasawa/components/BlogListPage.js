import { AdSlot } from '@/components/GoogleAdsense'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { deepClone, isBrowser } from '@/lib/utils'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import BlogCard from './BlogCard'
import BlogPostListEmpty from './BlogListEmpty'
import PaginationSimple from './PaginationSimple'
/**
 * 文章列表分页表格
 * @param page 当前页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogListPage = ({ page = 1, posts = [], postCount, siteInfo }) => {
  const { NOTION_CONFIG } = useGlobal()
  const postsPerPage = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  const totalPage = Math.ceil(
    postCount / postsPerPage
  )
  const showNext = page < totalPage

  const [columns, setColumns] = useState(calculateColumns())
  const [filterPosts, setFilterPosts] = useState([])

  useEffect(() => {
    const handleResize = debounce(() => {
      setColumns(calculateColumns())
    }, 200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

   /**
    * 文章重新布局，使纵向排列看起来是横向排列
    */
  useEffect(() => {
    const count = posts?.length || 0;
    const rows = Math.ceil(count / columns);
    const newFilterPosts = new Array(count);

    let index = 0;
    for (let col = 0; col < columns; col++) {
        for (let row = 0; row < rows; row++) {
        const sourceIndex = row * columns + col;
        if (sourceIndex < count) {
            newFilterPosts[index] = deepClone(posts[sourceIndex]);
            index++;
        }
        }
    }
  
    setFilterPosts(newFilterPosts);
  }, [columns, posts]);

  if (!filterPosts || filterPosts.length === 0) {
    return <BlogPostListEmpty />
  } else {
    return (
      <div>
        {/* 文章列表 */}
        <div id='posts-wrapper' className='grid-container'>
          {filterPosts?.map((post, index) => (
            <div
              key={post.id}
              className='grid-item justify-center flex'
              style={{ breakInside: 'avoid' }}>
              <BlogCard
                index={index}
                key={post.id}
                post={post}
                siteInfo={siteInfo}
              />
            </div>
          ))}
          {siteConfig('ADSENSE_GOOGLE_ID') && (
            <div className='p-3'>
              <AdSlot type='flow' />
            </div>
          )}
        </div>
        <PaginationSimple page={page} showNext={showNext} />
      </div>
    )
  }
}

/**
 * 计算文章列数
 * @returns
 */
const calculateColumns = () => {
  if (!isBrowser) {
    return 3
  } else {
    if (window.innerWidth >= 1024) {
      return 3
    } else if (window.innerWidth >= 640) {
      return 2
    } else {
      return 1
    }
  }
}

export default BlogListPage
