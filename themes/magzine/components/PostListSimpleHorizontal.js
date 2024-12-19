import Link from 'next/link'
import PostItemCardSimple from './PostItemCardSimple'
import PostListEmpty from './PostListEmpty'

/**
 * 博文水平列表;不带封面图
 * @returns {JSX.Element}
 * @constructor
 */
const PostSimpleListHorizontal = ({ title, href, posts }) => {
  if (!posts || posts.length === 0) {
    return <PostListEmpty />
  }

  return (
    <div className='w-full py-10 bg-[#F6F6F1] dark:bg-black'>
      <div className='max-w-screen-3xl w-full mx-auto px-4 lg:px-0'>
        {/* 标题 */}
        <div className='flex justify-between items-center py-6'>
          <h3 className='text-2xl'>{title}</h3>
          {href && (
            <Link
              className='hidden font-bold lg:block text-lg underline'
              href={href}>
              <span>查看全部</span>
              <i className='ml-2 fas fa-arrow-right' />
            </Link>
          )}
        </div>
        {/* 列表 */}
        <div className='grid grid-cols-1 lg:grid-cols-4'>
          {posts?.map(p => {
            return <PostItemCardSimple key={p.id} post={p} />
          })}
        </div>
        {href && (
          <Link className='lg:hidden block text-lg underline' href={href}>
            <span>查看全部</span>
            <i className='ml-2 fas fa-arrow-right' />
          </Link>
        )}
      </div>
    </div>
  )
}

export default PostSimpleListHorizontal
