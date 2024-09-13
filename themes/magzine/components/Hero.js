// import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import PostItemCardTop from './PostItemCardTop'
import PostItemCardWide from './PostItemCardWide'

/**
 * 首页主宣传
 * @param {*} param0
 * @returns
 */
const Hero = ({ posts }) => {
  // 获取置顶文章与次要文章
  const postTop = posts[0]
  const post1 = posts[1]
  const post2 = posts[2]
  // 首屏信息栏按钮文字
  const banner = siteConfig('MAGZINE_HOME_BANNER_ENABLE')
  const button = siteConfig('MAGZINE_HOME_BUTTON')
  const text = siteConfig('MAGZINE_HOME_BUTTON_TEXT')
  const url = siteConfig('MAGZINE_HOME_BUTTON_URL')
  const title = siteConfig('MAGZINE_HOME_TITLE')
  const description = siteConfig('MAGZINE_HOME_DESCRIPTION')
  const tips = siteConfig('MAGZINE_HOME_TIPS')

  return (
    <>
      <div className='w-full mx-auto max-w-7xl xl:flex justify-between'>
        {/* 左侧一篇主要置顶文章 */}
        <div className='basis-1/2 mb-6'>
          <PostItemCardTop post={postTop} />
        </div>
        {/* 右侧 */}
        <div>
          {/* 首屏介绍 */}
          {banner && (
            <div className='flex flex-col p-5 gap-y-5 dark items-center justify-between w-full bg-black text-white'>
              {/* 首屏导航按钮 */}
              <h2 className='text-2xl font-semibold'>{title}</h2>
              <h3 className='text-sm'>{description}</h3>
              {button && (
                <div className='mt-2 text-center px-6 py-3 font-semibold rounded-3xl text-black bg-[#7BE986] hover:bg-[#62BA6B]'>
                  <Link href={url}>{text}</Link>
                </div>
              )}
              <span className='text-xs'>{tips}</span>
            </div>
          )}

          {/* 两篇次要文章 */}
          <div className='py-4'>
            <hr className='mb-8' />
            <PostItemCardWide post={post1} />
            <hr className='mb-8' />
            <PostItemCardWide post={post2} />
          </div>
        </div>
      </div>
    </>
  )
}
export default Hero
