import Link from 'next/link'
import BLOG from '@/blog.config'
import { formatDateFmt } from '@/lib/formatDate'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'

/**
 * 最新文章列表
 * @param posts
 * @constructor
 */
const LatestPosts = ({ posts }) => {
  // 深拷贝
  let postsSortByDate = Object.create(posts)

  // 时间排序
  postsSortByDate.sort((a, b) => {
    const dateA = new Date(a?.lastEditedTime || a.createdTime)
    const dateB = new Date(b?.lastEditedTime || b.createdTime)
    return dateB - dateA
  })

  // 只取前五
  postsSortByDate = postsSortByDate.slice(0, 5)

  // 获取当前路径
  const currentPath = useRouter().asPath
  const { locale } = useGlobal()

  return <>
    <section
      className='text-sm font-bold py-3 px-5 text-gray-600 dark:text-gray-400 duration-100 flex flex-nowrap align-middle'>
      <div className='w-32'>{locale.COMMON.LATEST_POSTS}</div>
    </section>
    <div>
      {postsSortByDate.map(post => {
        return (
          <Link key={post.id} title={post.title} href={`${BLOG.path}/article/${post.slug}`}>
            <div
              className={(currentPath === `${BLOG.path}/article/${post.slug}` ? 'bg-gray-200 dark:bg-black' : '') + ' text-xs leading-5 py-1.5 px-5 flex'}>
              <div className='mr-2 text-gray-500'>
                {formatDateFmt(post.lastEditedTime, 'yyyy/MM/dd')}
              </div>
              <div
                className='text-sm flex w-50 overflow-x-hidden whitespace-nowrap dark:text-gray-300 cursor-pointer hover:underline'>
                {post.title}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  </>
}
export default LatestPosts
