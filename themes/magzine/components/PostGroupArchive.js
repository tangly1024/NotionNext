import PostItemCard from './PostItemCard'

/**
 * 博客归档列表
 * @param posts 所有文章
 * @param archiveTitle 归档标题
 * @returns {JSX.Element}
 * @constructor
 */
const PostGroupArchive = ({ posts = [], archiveTitle }) => {
  if (!posts || posts.length === 0) {
    return <></>
  }

  return (
    <div className='px-2 lg:px-0'>
      {/* 分组标题 */}
      <div
        className='pb-4 text-2xl font-bold dark:text-gray-300'
        id={archiveTitle}>
        {archiveTitle}
      </div>

      {/* 列表 */}
      <ul className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
        {posts?.map((p, index) => {
          return <PostItemCard key={index} post={p} />
        })}
      </ul>
    </div>
  )
}

export default PostGroupArchive
