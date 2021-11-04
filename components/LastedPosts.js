import Link from 'next/link'
import BLOG from '@/blog.config'
import { formatDateFmt } from '@/lib/formatDate'
import { useRouter } from 'next/router'

/**
 * 最新文章列表
 * @param posts
 * @constructor
 */
const LastedPosts = ({ posts }) => {
  // 按时间排序
  if (posts) {
    posts = posts.sort((a, b) => {
      const dateA = new Date(a?.lastEditedTime || a.createdTime)
      const dateB = new Date(b?.lastEditedTime || b.createdTime)
      return dateB - dateA
    }).slice(0, 5)
  }
  const router = useRouter()

  return <>
    <section
      className='text-sm font-bold py-3 px-5 text-gray-600 dark:text-gray-400 duration-100 flex flex-nowrap align-middle'>
      <div className='w-32'>最近更新</div>
    </section>
    <div>
      {posts.map(post => {
        return (
          <Link key={post.id} title={post.title} href={`${BLOG.path}/article/${post.slug}`} >
            <div className={(router.asPath === `${BLOG.path}/article/${post.slug}` ? 'bg-gray-200 dark:bg-black' : '') + ' text-xs leading-5 py-1.5 px-5 cursor-pointer hover:underline flex'}>
              <div className='mr-2 text-gray-500'>
                {formatDateFmt(post.lastEditedTime, 'yyyy/MM/dd')}
              </div>
              <div className='text-sm flex w-50 overflow-x-hidden whitespace-nowrap dark:text-gray-300'>
                {post.title}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  </>
}
export default LastedPosts
