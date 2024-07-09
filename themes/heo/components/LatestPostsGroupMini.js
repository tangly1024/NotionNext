import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
// import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * 最新文章列表
 * @param posts 所有文章数据
 * @param sliceCount 截取展示的数量 默认6
 * @constructor
 */
export default function LatestPostsGroupMini({ latestPosts, siteInfo }) {
  // 获取当前路径
  const currentPath = useRouter().asPath
  const { locale } = useGlobal()

  if (!latestPosts) {
    return <></>
  }

  return (
    <>
      <div className=' mb-2 px-1 flex flex-nowrap justify-between'>
        <div>
          <i className='mr-2 fas fas fa-history' />
          {locale.COMMON.LATEST_POSTS}
        </div>
      </div>
      {latestPosts.map(post => {
        const selected =
          currentPath === `${siteConfig('SUB_PATH', '')}/${post.slug}`
        return (
          <Link
            key={post.id}
            title={post.title}
            href={post?.href}
            passHref
            className={'my-3 flex relative'}>
            <div
              className={
                (selected ? ' text-indigo-400 ' : 'dark:text-gray-200') +
                ' text-sm overflow-x-hidden hover:text-indigo-600 px-2 duration-200 w-full rounded ' +
                ' hover:text-indigo-400 dark:hover:text-yellow-600 cursor-pointer items-center flex'
              }>
              <div className='w-full flex justify-between h-7 items-center'>
                <div className='menu-link flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis'>{post.title}</div>
                <div className="text-gray-400">{post.lastEditedDay}</div>
              </div>
            </div>
            <div
              className="absolute left-0 right-0 bottom-0 border-b border-dashed border-gray-300"></div>
          </Link>
        )
      })}
    </>
  )
}
