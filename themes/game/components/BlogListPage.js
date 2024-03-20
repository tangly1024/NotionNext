import { GameListIndexCombine } from './GameListIndexCombine'

export const BlogListPage = props => {
  return (
    <>
      <div id='posts-wrapper' className='my-4 select-none'>
        <GameListIndexCombine {...props} />
      </div>

      {/* 这里不显示分页组件，首页只展示部分即可 */}
    </>
  )
}
