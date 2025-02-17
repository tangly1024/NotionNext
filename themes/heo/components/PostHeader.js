import { HashTag } from '@/components/HeroIcons'
import Image from 'next/image'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { formatDateFmt } from '@/lib/utils/formatDate'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import WordCount from '@/components/WordCount'

const WavesArea = dynamic(() => import('./WavesArea'), { ssr: false })

/**
 * 文章页头
 * @param {*} param0
 * @returns
 */
export default function PostHeader({ post, siteInfo, isDarkMode }) {
  if (!post) {
    return <></>
  }
  // 文章头图
  const headerImage = post?.pageCover ? post.pageCover : siteInfo?.pageCover
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig('ANALYTICS_BUSUANZI_ENABLE')
  return (
    <div
      id='post-bg'
      className='md:mb-0 -mb-5 w-full h-[30rem] relative md:flex-shrink-0 overflow-hidden bg-cover bg-center bg-no-repeat z-10'>
      <div
        className={`${isDarkMode ? 'bg-[#CA8A04]' : 'bg-[#0060e0]'} absolute top-0 w-full h-full flex justify-center items-center`}>
        {/* 文章背景图 */}
        <div
          id='post-cover-wrapper'
          style={{
            filter: 'blur(5px)'
          }}
          className='coverdiv h-full lg:opacity-70 lg:translate-x-96'>
          <Image
            priority={true}
            id='post-cover'
            className='w-full h-full object-cover max-h-[50rem] min-w-[50vw] min-h-[20rem]'
            style={{
              maskImage:
                'radial-gradient(circle, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 90%)'
            }}
            src={headerImage}
            alt={post.title}
            width={100}
            height={100}
            placeholder='blur'
            blurDataURL={siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')}
          />
        </div>

        {/* 文章文字描述 */}
        <div
          id='post-info'
          className='absolute top-38 z-10 flex flex-col space-y-4 lg:-mt-10 w-full max-w-[86rem] px-5'>
          {/* 分类+标签 */}
          <div
            style={{ fontSize: '95%' }}
            className='flex justify-center md:justify-start items-center gap-4'>
            {post.category && (
              <>
                <Link
                  href={`/category/${post.category}`}
                  className='mr-4'
                  passHref
                  legacyBehavior>
                  <div className='cursor-pointer font-sm font-bold px-3 py-1 rounded-lg  hover:bg-white text-white bg-blue-500 dark:bg-yellow-500 hover:text-blue-500 duration-200 '>
                    {post.category}
                  </div>
                </Link>
              </>
            )}

            {post.tagItems && (
              <div className='hidden md:flex justify-center flex-nowrap overflow-x-auto'>
                {post.tagItems.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/tag/${encodeURIComponent(tag.name)}`}
                    passHref
                    className={
                      'cursor-pointer inline-block text-gray-50 hover:text-white duration-200 py-0.5 px-1 whitespace-nowrap '
                    }>
                    <div className='hover:bg-opacity-20 hover:bg-white rounded-xl py-1 px-2 font-light flex items-center'>
                      <HashTag className='text-gray-200 stroke-2 mr-0.5 w-3 h-3' />{' '}
                      {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 文章Title */}
          <div className='max-w-6xl font-bold text-3xl lg:text-4xl md:leading-snug shadow-text-md flex  justify-center md:justify-start text-white'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} />
            )}
            <span className='ml-3 line-clamp-4 leading-tight'>
              {post.title}
            </span>
          </div>

          {/* 标题底部补充信息 */}
          <section
            style={{ fontSize: '95%' }}
            className='flex-wrap dark:text-gray-200 text-opacity-80 shadow-text-md flex justify-center md:justify-start mt-4 text-white font-light leading-8'>
            <div className='flex justify-center '>
              <div className='mr-2'>
                <WordCount
                  wordCount={post.wordCount}
                  readTime={post.readTime}
                />
              </div>
              {post?.type !== 'Page' && (
                <>
                  <Link
                    href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                    passHref
                    className='pl-1 mr-2 cursor-pointer hover:underline'>
                    <i className='fa-regular fa-calendar'></i>{' '}
                    {post?.publishDay}
                  </Link>
                </>
              )}

              <div className='pl-1 mr-2'>
                <i className='fa-regular fa-calendar-check'></i>{' '}
                {post.lastEditedDay}
              </div>
            </div>

            {/* 阅读统计 */}
            {ANALYTICS_BUSUANZI_ENABLE && (
              <div className='busuanzi_container_page_pv font-light mr-2'>
                <i className='fa-solid fa-fire-flame-curved'></i>{' '}
                <span className='mr-2 busuanzi_value_page_pv' />
              </div>
            )}
          </section>
        </div>

        <WavesArea />
      </div>
    </div>
  )
}
