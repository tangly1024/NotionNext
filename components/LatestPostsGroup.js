import Link from 'next/link'
import BLOG from '@/blog.config'
import { formatDateFmt } from '@/lib/formatDate'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'

/**
 * 最新文章列表
 * @param posts 所有文章数据
 * @param sliceCount 截取展示的数量 默认6
 * @constructor
 */
const LatestPostsGroup = ({ posts, sliceCount = 6 }) => {
  // 深拷贝
  let postsSortByDate = Object.create(posts)

  // 时间排序
  postsSortByDate.sort((a, b) => {
    const dateA = new Date(a?.lastEditedTime || a.createdTime)
    const dateB = new Date(b?.lastEditedTime || b.createdTime)
    return dateB - dateA
  })

  // 只取前五
  postsSortByDate = postsSortByDate.slice(0, sliceCount)

  // 获取当前路径
  const currentPath = useRouter().asPath

  return <div>
      {postsSortByDate.map(post => {
        const selected = currentPath === `${BLOG.path}/article/${post.slug}`
        return (
          <Link key={post.id} title={post.title} href={`${BLOG.path}/article/${post.slug}`}>
            <div
              className={(selected ? 'bg-gray-200 dark:bg-black ' : '') + ' text-xs leading-5 py-1.5 px-5 flex'}>
              <div className='mr-2 text-gray-400'>
                {formatDateFmt(post.lastEditedTime, 'MM/dd')}
              </div>
              <div
                className={
                  (selected ? 'dark:text-white text-black ' : 'text-gray-500 ') +
                  ' text-sm flex w-50 overflow-x-hidden whitespace-nowrap  hover:text-black dark:hover:text-white cursor-pointer hover:underline'
                }>
                {post.title}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
}
export default LatestPostsGroup
