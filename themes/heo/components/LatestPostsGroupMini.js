import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
// import Image from 'next/image'
import SmartLink from '@/components/SmartLink'
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
  const SUB_PATH = siteConfig('SUB_PATH', '')

  return latestPosts ? (
    <>
      <div className=' mb-2 px-1 flex flex-nowrap justify-between'>
        <div>
          <i className='mr-2 fas fas fa-history' />
          {locale.COMMON.LATEST_POSTS}
        </div>
      </div>
      {latestPosts.map(post => {
        const selected =
          currentPath === `${SUB_PATH}/${post.slug}`
        const headerImage = post?.pageCoverThumbnail
          ? post.pageCoverThumbnail
          : siteInfo?.pageCover

        return (
          <SmartLink
            key={post.id}
            title={post.title}
            href={post?.href}
            passHref
            className={`group flex min-h-[3.35rem] items-start rounded-[1rem] px-[0.6rem] py-[0.55rem] transition-all duration-200 border
              ${selected 
                ? 'translate-y-[-1px] bg-[#ebf4ff] border-[#60a5fa] shadow-[0_12px_28px_rgba(59,130,246,0.13)] dark:bg-[#9a34123d] dark:border-[#f59e0b52] dark:shadow-[0_14_30px_rgba(120,53,15,0.2)]' 
                : 'bg-transparent border-transparent hover:translate-y-[-1px] hover:bg-[#ebf4ff] hover:border-[#93c5fd] hover:shadow-[0_10px_24px_rgba(59,130,246,0.08)] dark:hover:bg-[#9a34122e] dark:hover:border-[#f59e0b3d]'
              }`}
          >
            <div
              className={
                (selected ? ' text-indigo-600 ' : 'dark:text-gray-200') +
                ' text-sm overflow-x-hidden hover:text-indigo-600 px-2 duration-200 w-full rounded ' +
                ' hover:text-indigo-400 dark:hover:text-[#ffc848] cursor-pointer items-center flex'
              }>
              <div>
                <div className='line-clamp-2 menu-link'>{post.title}</div>
                <div className='text-gray-400'>{post.lastEditedDay}</div>
              </div>
            </div>
          </SmartLink>
        )
      })}
    </>
  ) : null
}
