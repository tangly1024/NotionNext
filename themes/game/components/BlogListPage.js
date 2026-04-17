import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { GameListIndexCombine } from './GameListIndexCombine'
import PaginationSimple from './PaginationSimple'
/**
 * 分页博客列表
 * @param {*} props
 * @returns
 */
export const BlogListPage = props => {
  const { page = 1, postCount } = props
  const { NOTION_CONFIG } = useGlobal()
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  const totalPage = Math.ceil(postCount / POSTS_PER_PAGE)
  const showNext = page < totalPage

  return (
    <>
      <div id='posts-wrapper' className='my-4 select-none'>
        <GameListIndexCombine {...props} />
      </div>

      <PaginationSimple page={page} showNext={showNext} />
    </>
  )
}
