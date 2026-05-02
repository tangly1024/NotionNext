// import { useGlobal } from '@/lib/global'
import BannerItem from './BannerItem'
import PostItemCardTop from './PostItemCardTop'
import PostItemCardWide from './PostItemCardWide'

/**
 * 首页主宣传
 * @param {*} param0
 * @returns
 */
const Hero = ({ topPosts = [], subPosts = [] }) => {
  const postTop = topPosts[0]

  return (
    <div className='w-full mx-auto max-w-screen-3xl xl:flex justify-between gap-10'>
      
      {/* 左侧主文章 */}
      <div className='basis-1/2 mb-6 px-2 lg:px-5'>
        {postTop && <PostItemCardTop post={postTop} />}
      </div>

      {/* 右侧 */}
      <div className='basis-1/2 flex flex-col gap-y-4'>
        <BannerItem />

        <div className='py-4 px-2 lg:px-0 flex flex-col gap-y-6'>
          {subPosts.map((post, index) => (
            <div key={post.id || index}>
              <hr />
              <PostItemCardWide post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Hero
