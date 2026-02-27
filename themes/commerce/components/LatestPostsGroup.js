import { siteConfig } from '@/lib/config'
import LazyImage from '@/components/LazyImage'
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
const LatestPostsGroup = ({ latestPosts, siteInfo }) => {
  // 获取当前路径
  const currentPath = useRouter().asPath
  const { locale } = useGlobal()

  if (!latestPosts) {
    return <></>
  }

  return <>
        <div className=" mb-2 px-1 flex flex-nowrap justify-between">
            <div>
                <i className="mr-2 fas fas fa-history" />
                {locale.COMMON.LATEST_POSTS}
            </div>
        </div>
        {latestPosts.map(post => {
          const selected = currentPath === `${siteConfig('SUB_PATH', '')}/${post.slug}`

          const headerImage = post?.pageCoverThumbnail ? post.pageCoverThumbnail : siteInfo?.pageCover

          return (
            (<SmartLink
                    key={post.id}
                    title={post.title}
                    href={`${siteConfig('SUB_PATH', '')}/${post.slug}`}
                    passHref
                    className={'my-3 flex'}>

                    <div className="w-20 h-14 overflow-hidden relative">
                        <LazyImage src={`${headerImage}`} className='object-cover w-full h-full'/>
                    </div>
                    <div
                        className={
                            (selected ? ' text-red-400 ' : 'dark:text-gray-400 ') +
                            ' text-sm overflow-x-hidden hover:text-red-600 px-2 duration-200 w-full rounded ' +
                            ' hover:text-red-400 cursor-pointer items-center flex'
                        }
                    >
                        <div>
                            <div className='line-clamp-2 menu-link'>{post.title}</div>
                            <div className="text-gray-500">{post.lastEditedDay}</div>
                        </div>
                    </div>

                </SmartLink>)
          )
        })}
    </>
}
export default LatestPostsGroup
