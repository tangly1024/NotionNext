import Link from 'next/link'
import PostItemCard from './PostItemCard'
import PostListEmpty from './PostListEmpty'
import Swiper from './Swiper'

/**
 * 博文水平列表
 * 含封面
 * 可以指定是否有模块背景色
 * @returns {JSX.Element}
 * @constructor
 */
const PostListHorizontal = ({ title, href, posts, hasBg }) => {
  if (!posts || posts.length === 0) {
    return <PostListEmpty />
  }

  return (
    <div
      className={`w-full py-10 px-2 lg:px-0 ${hasBg ? 'bg-[#F6F6F1] dark:bg-black' : ''}`}>
      <div className='max-w-screen-3xl w-full mx-auto'>
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
        <div className='hidden lg:grid grid-cols-1 lg:grid-cols-4 gap-4'>
          {posts?.map((p, index) => {
            return <PostItemCard key={index} post={p} />
          })}
        </div>
        <div className='block lg:hidden px-2'>
          <Swiper posts={posts} />
          {href && (
            <Link className='lg:hidden block text-lg underline' href={href}>
              <span>查看全部</span>
              <i className='ml-2 fas fa-arrow-right' />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostListHorizontal
