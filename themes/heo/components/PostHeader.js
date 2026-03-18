import { HashTag } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import WordCount from '@/components/WordCount'
import { siteConfig } from '@/lib/config'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import WavesArea from './WavesArea'

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
      className='md:mb-0 -mb-5 w-full h-[30rem] relative md:flex-shrink-0 overflow-hidden bg-cover bg-center bg-no-repeat z-10 -mt-20 md:mt-0'>
      <style jsx>{`
        .coverdiv:after {
          position: absolute;
          content: '';
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          box-shadow: 110px -130px 500px 100px
            ${isDarkMode ? '#6366f1' : '#09a4f5'} inset;
        }
        .coverdiv {
          overflow: hidden; /* 隐藏溢出部分 */
          backface-visibility: hidden; /* 隐藏旋转后可能的边缘显示 */
          transform-style: preserve-3d;
        }
      `}</style>

      <div
        className={`${isDarkMode ? 'bg-[#6366f1]' : 'bg-[#09a4f5]'} absolute top-0 w-full h-full py-10 flex justify-center items-center`}>
        {/* 文章背景图 */}
        <div
          id='post-cover-wrapper'
          className='coverdiv lg:opacity-60 lg:translate-x-96 lg:rotate-12'>
          <LazyImage
            id='post-cover'
            className='w-full h-full object-cover opacity-60 max-h-[50rem] min-w-[50vw] min-h-[20rem]'
            src={headerImage}
          />
        </div>


        {/* 文章文字描述 */}
        <div
          id='post-info'
          className='absolute top-48 z-10 flex flex-col space-y-4 lg:-mt-12 w-full max-w-[86rem] px-5'>
          {/* 分类+标签 */}
          <div className='flex justify-center md:justify-start items-center gap-4'>
            {post.category && (
              <>
                <SmartLink
                  href={`/category/${post.category}`}
                  className='mr-4'
                  passHref
                  legacyBehavior>
                  <div className='cursor-pointer font-sm font-bold px-3 py-1 rounded-2xl  hover:bg-white text-white bg-blue-500 dark:bg-purple-700/25 dark:backdrop-blur-xl dark:border dark:border-purple-500/40 dark:text-purple-100/90 dark:hover:bg-purple-700/35 dark:hover:border-purple-400/50 dark:shadow-[inset_0_0.5px_0_rgba(255,255,255,0.08),0_3px_6px_rgba(15,23,42,0.15)] hover:text-blue-500 transition-all duration-200 '>
                    {post.category}
                  </div>
                </SmartLink>
              </>
            )}

            {post.tagItems && (
              <div className='hidden md:flex justify-center flex-nowrap overflow-x-auto'>
                {post.tagItems.map((tag, index) => (
                  <SmartLink
                    key={index}
                    href={`/tag/${encodeURIComponent(tag.name)}`}
                    passHref
                    className={
                      'cursor-pointer inline-block text-gray-50 hover:text-white duration-200 py-0.5 px-1 whitespace-nowrap '
                    }>
                    <div className='font-light flex items-center'>
                      <HashTag className='text-gray-200 stroke-2 mr-0.5 w-3 h-3' />{' '}
                      {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
                    </div>
                  </SmartLink>
                ))}
              </div>
            )}
          </div>

          {/* 文章Title */}
          <h1 className='max-w-5xl font-bold text-3xl lg:text-5xl md:leading-snug shadow-text-md flex  justify-center md:justify-start text-white'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} priority />
            )}
            {post.title}
          </h1>

          {/* 标题底部补充信息 */}
          <section
            className='mt-4 text-white text-sm font-light text-opacity-70 shadow-text-md leading-7
                      flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-center
                      md:justify-start md:text-left'>
            <span className='inline-flex items-center gap-1 whitespace-nowrap'>
              <WordCount wordCount={post.wordCount} readTime={post.readTime} />
            </span>
            {ANALYTICS_BUSUANZI_ENABLE && (
              <span className='busuanzi_container_page_pv inline-flex items-center whitespace-nowrap'>
                <i className='fa-solid fa-fire-flame-curved mr-1' />
                <span className='busuanzi_value_page_pv' />
              </span>
            )}
            <span className='basis-full h-0 md:basis-auto md:hidden' />
            {post?.type !== 'Page' && (
              <SmartLink
                href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                passHref
                className='inline-flex items-center gap-1 whitespace-nowrap cursor-pointer hover:underline'>
                <i className='fa-regular fa-calendar'></i>
                {post?.publishDay}
              </SmartLink>
            )}
            <span className='inline-flex items-center gap-1 whitespace-nowrap'>
              <i className='fa-regular fa-pen-to-square'></i>
              {post.lastEditedDay}
            </span>
          </section>
        </div>

        <WavesArea />
      </div>
    </div>
  )
}
