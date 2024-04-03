import Link from 'next/link'
import TagItemMini from './TagItemMini'
import { useGlobal } from '@/lib/global'
import NotionIcon from '@/components/NotionIcon'
import LazyImage from '@/components/LazyImage'
import { formatDateFmt } from '@/lib/utils/formatDate'
import { siteConfig } from '@/lib/config'
import WordCount from '@/components/WordCount'

export default function PostHeader({ post, siteInfo }) {
  const { locale, fullWidth } = useGlobal()

  if (!post) {
    return <></>
  }

  // 文章全屏隐藏标头
  if (fullWidth) {
    return <div className='my-8'/>
  }

  const headerImage = post?.pageCover ? post.pageCover : siteInfo?.pageCover

  return (
    <div id="header" className="w-full h-[50vh] relative md:flex-shrink-0 z-10 min-h-[25rem] min-w-[25rem] flex flex-col items-center justify-center" >
      <LazyImage priority={true} src={headerImage} className='w-full h-full object-cover object-center absolute top-0'/>
      <div id = 'article-header-cover' className='bg-black bg-opacity-70 absolute top-0 w-full h-full py-10' />
      <header className="flex flex-col justify-center items-center z-10">
        <div className='mb-2 flex justify-center'>
          {post.category && <>
            <Link href={`/category/${post.category}`} passHref legacyBehavior>
              <div className="cursor-pointer px-2 py-1 mb-2 border rounded-sm dark:border-white text-sm font-medium hover:underline duration-200 shadow-text-md text-white">
                {post.category}
              </div>
            </Link>
          </>}
        </div>

        {/* 文章Title */}
        <div className="leading-snug font-bold xs:text-4xl sm:text-4xl md:text-5xl md:leading-snug text-4xl shadow-text-md flex justify-center text-center text-white">
          <NotionIcon icon={post.pageIcon} className='text-4xl mx-1' />{post.title}
        </div>

        <section className="flex-wrap shadow-text-md flex text-xs justify-center mt-2 text-white dark:text-gray-200 font-light leading-8">

          <div className='flex justify-center dark:text-gray-200 text-opacity-70'>
            {post?.type !== 'Page' && post?.publishDay && (
              <>
                <Link
                  href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                  passHref
                  className="pl-1 mr-4 cursor-pointer hover:underline">
                  <i className="iconfont icon-calendar mr-1" />发表于 {post?.publishDay}
                  {/* {locale.COMMON.POST_TIME}: {post?.publishDay} */}

                </Link>
              </>
            )}
            <div className="pl-1 mr-5">
              <i className="iconfont icon-calendar-check mr-1" />最后修改于 {post.lastEditedDay}
              {/* {locale.COMMON.LAST_EDITED_TIME}: {post.lastEditedDay} */}
            </div>
          </div>

          {JSON.parse(siteConfig('ANALYTICS_BUSUANZI_ENABLE')) && (<div className="busuanzi_container_page_pv font-light mr-2">
            <i className="iconfont icon-eye mr-1" />
            <span className="mr-1 busuanzi_value_page_pv" />
            {locale.COMMON.VIEWS}
          </div>)}
        </section>
        <div className='flex-wrap shadow-text-md flex text-xs justify-center text-white dark:text-gray-200 font-light leading-8'><WordCount /></div>

        <div className='mt-3 mb-1'>
            {post.tagItems && (
                <div className="flex justify-center flex-nowrap overflow-x-auto">
                    {post.tagItems.map(tag => (
                        <TagItemMini key={tag.name} tag={tag} />
                    ))}
                </div>
            )}
        </div>
      </header>
      {/* 波浪效果 */}
      <div id="waves" className="absolute bottom-0 w-full">
          <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use xlinkHref="#gentle-wave" x="48" y="0" />
              <use xlinkHref="#gentle-wave" x="48" y="3" />
              <use xlinkHref="#gentle-wave" x="48" y="5" />
              <use xlinkHref="#gentle-wave" x="48" y="7" />
            </g>
          </svg>
        </div>
    </div>
  )
}
