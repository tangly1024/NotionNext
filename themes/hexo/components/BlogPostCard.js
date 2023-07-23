import Link from 'next/link'
import React from 'react'
import CONFIG from '../config'
import { BlogPostCardInfo } from './BlogPostCardInfo'
import BLOG from '@/blog.config'
import LazyImage from '@/components/LazyImage'
// import Image from 'next/image'

const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview = CONFIG.POST_LIST_PREVIEW && post.blockMap
  if (post && !post.pageCoverThumbnail && CONFIG.POST_LIST_COVER_DEFAULT) {
    post.pageCover = siteInfo?.pageCoverThumbnail
  }
  const showPageCover = CONFIG.POST_LIST_COVER && post?.pageCoverThumbnail && !showPreview
  //   const delay = (index % 2) * 200

  return (

        <div className={`${CONFIG.POST_LIST_COVER_HOVER_ENLARGE ? ' hover:scale-110 transition-all duration-150' : ''}`} >
            <div key={post.id}
                data-aos="fade-up"
                data-aos-easing="ease-in-out"
                data-aos-duration="800"
                data-aos-once="false"
                data-aos-anchor-placement="top-bottom"
                id='blog-post-card'
                className={`group md:h-56 w-full flex justify-between md:flex-row flex-col-reverse ${CONFIG.POST_LIST_IMG_CROSSOVER && index % 2 === 1 ? 'md:flex-row-reverse' : ''}
                    overflow-hidden border dark:border-black rounded-xl bg-white dark:bg-hexo-black-gray`}>

                {/* 文字内容 */}
                <BlogPostCardInfo index={index} post={post} showPageCover={showPageCover} showPreview={showPreview} showSummary={showSummary} />

                {/* 图片封面 */}
                {showPageCover && (
                    <div className="md:w-5/12 overflow-hidden">
                        <Link href={`${BLOG.SUB_PATH}/${post.slug}`} passHref legacyBehavior>
                        <LazyImage priority={index === 1} src={post?.pageCoverThumbnail} className='h-56 w-full object-cover object-center group-hover:scale-110 duration-500' />
                        </Link>
                    </div>
                )}

            </div>

        </div>

  )
}

export default BlogPostCard
