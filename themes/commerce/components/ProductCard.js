import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'
import LazyImage from '@/components/LazyImage'
// import Image from 'next/image'

/**
 * 商品卡
 */
const ProductCard = ({ index, post, siteInfo }) => {
  if (post && !post.pageCoverThumbnail && CONFIG.POST_LIST_COVER_DEFAULT) {
    post.pageCoverThumbnail = siteInfo?.pageCover
  }

  return (

        <div className={`${CONFIG.POST_LIST_COVER_HOVER_ENLARGE ? ' hover:scale-110 transition-all duration-150' : ''}`} >

            <div key={post.id} className={'group flex flex-col space-y-2 justify-between  border dark:border-black bg-white dark:bg-hexo-black-gray'}>

                {/* 图片封面 */}
                <SmartLink href={`${siteConfig('SUB_PATH', '')}/${post.slug}`} passHref legacyBehavior>
                    <div className="overflow-hidden m-2">
                        <LazyImage priority={index === 1} src={post?.pageCoverThumbnail} className='h-auto aspect-square w-full object-cover object-center group-hover:scale-110 duration-500' />
                    </div>
                </SmartLink>

                <div className='text-center'>{post.title}</div>

            </div>

        </div>

  )
}

export default ProductCard
