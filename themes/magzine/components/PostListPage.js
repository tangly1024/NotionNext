import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import PaginationSimple from './PaginationSimple'
import PostItemCard from './PostItemCard'
import PostListEmpty from './PostListEmpty'

/**
 * 文章列表分页表格
 * @param page 当前页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const PostListPage = ({ page = 1, posts = [], postCount }) => {
  const { NOTION_CONFIG } = useGlobal()
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  const totalPage = Math.ceil(postCount / POSTS_PER_PAGE)

  if (!posts || posts.length === 0) {
    return <PostListEmpty />
  }

  return (
    <div className='w-full justify-center'>
      <div id='posts-wrapper'>
        {/* 列表 */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
          {posts?.map((p, index) => {
            return <PostItemCard key={index} post={p} />
          })}
        </div>
      </div>
      <PaginationSimple page={page} totalPage={totalPage} />
    </div>
  )
}

export default PostListPage
