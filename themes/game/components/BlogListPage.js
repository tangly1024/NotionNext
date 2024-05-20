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
  const totalPage = Math.ceil(postCount / NOTION_CONFIG)
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
