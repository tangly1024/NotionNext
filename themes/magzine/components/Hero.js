// import { useGlobal } from '@/lib/global'
import BannerItem from './BannerItem'
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
  return (
    <>
      <div className='w-full mx-auto max-w-screen-3xl xl:flex justify-between gap-10'>
        {/* 左侧一篇主要置顶文章 */}
        <div className='basis-1/2 mb-6 px-2 lg:px-5'>
          <PostItemCardTop post={postTop} />
        </div>
        {/* 右侧 */}
        <div className='basis-1/2 flex flex-col gap-y-4'>
          {/* 首屏宣传小Banner */}
          <BannerItem />

          {/* 两篇次要文章 */}
          <div className='py-4 px-2 lg:px-0 flex flex-col gap-y-6'>
            <hr />
            <PostItemCardWide post={post1} />
            <hr />
            <PostItemCardWide post={post2} />
          </div>
        </div>
      </div>
    </>
  )
}
export default Hero
