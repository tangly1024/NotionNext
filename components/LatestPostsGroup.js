import BLOG from '@/blog.config'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * 最新文章列表
 * @param posts 所有文章数据
 * @param sliceCount 截取展示的数量 默认6
 * @constructor
 */
const LatestPostsGroup = ({ posts, sliceCount = 5 }) => {
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

  return <>
      {postsSortByDate.map(post => {
        const selected = currentPath === `${BLOG.path}/article/${post.slug}`
        return (
          <Link key={post.id} title={post.title} href={`${BLOG.path}/article/${post.slug}`} passHref>
            <a className={ 'my-1 px-2 flex font-light'}>
              <div className={ (selected ? 'text-white  bg-gray-600 ' : 'text-gray-500 dark:text-gray-400 ') + ' text-xs py-1.5 flex overflow-x-hidden whitespace-nowrap hover:bg-gray-500 px-3 w-full ' +
                'hover:text-white dark:hover:text-white cursor-pointer' }>
                <FontAwesomeIcon icon={faFileAlt} className='mr-2'/>
                <div className='truncate'>{post.title}</div>
              </div>
            </a>
          </Link>
        )
      })}
    </>
}
export default LatestPostsGroup
