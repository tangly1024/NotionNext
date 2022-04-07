import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * 最新文章列表
 * @param posts 所有文章数据
 * @param sliceCount 截取展示的数量 默认6
 * @constructor
 */
const LatestPostsGroup = ({ latestPosts, siteInfo }) => {
  if (!latestPosts) {
    return <></>
  }
  // 获取当前路径
  const currentPath = useRouter().asPath
  const { locale } = useGlobal()
  return (
    <>
      <div className="font-sans mb-2 px-1 flex flex-nowrap justify-between">
        <div>
          <i className="mr-2 fas fas fa-history" />
          {locale.COMMON.LATEST_POSTS}
        </div>
      </div>
      {latestPosts.map(post => {
        const selected = currentPath === `${BLOG.SUB_PATH}/article/${post.slug}`
        const headerImage = post?.page_cover
          ? `url("${post.page_cover}")`
          : `url("${siteInfo?.pageCover}")`

        return (
          <Link
            key={post.id}
            title={post.title}
            href={`${BLOG.SUB_PATH}/article/${post.slug}`}
            passHref
          >
            <a className={'my-1 flex font-sans'}>
              <div
                className="w-20 h-16 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: headerImage }}
              />
              <div
                className={
                  (selected ? ' text-indigo-400 ' : 'dark:text-gray-400 ') +
                  ' text-sm py-1.5 overflow-x-hidden hover:text-indigo-600 px-2 duration-200 w-full rounded ' +
                  'hover:text-white dark:hover:text-indigo-400 cursor-pointer items-center flex'
                }
              >
                <div>
                  <div style={{ WebkitLineClamp: 2 }}>{post.title}</div>
                  <div className="text-gray-500">{post.lastEditedTime}</div>
                </div>
              </div>
            </a>
          </Link>
        )
      })}
    </>
  )
}
export default LatestPostsGroup
