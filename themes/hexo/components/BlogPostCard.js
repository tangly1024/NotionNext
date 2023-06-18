import Link from 'next/link'
import React from 'react'
import CONFIG_HEXO from '../config_hexo'
import { BlogPostCardInfo } from './BlogPostCardInfo'
import BLOG from '@/blog.config'
// import Image from 'next/image'

const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview = CONFIG_HEXO.POST_LIST_PREVIEW && post.blockMap
  if (post && !post.pageCoverThumbnail && CONFIG_HEXO.POST_LIST_COVER_DEFAULT) {
    post.pageCover = siteInfo?.pageCoverThumbnail
  }
  const showPageCover = CONFIG_HEXO.POST_LIST_COVER && post?.pageCoverThumbnail && !showPreview
  //   const delay = (index % 2) * 200

  return (

        <div
            className={`${CONFIG_HEXO.POST_LIST_COVER_HOVER_ENLARGE ? ' hover:scale-110 transition-all duration-150' : ''}`}
        >
            <div
                data-aos="fade-up"
                data-aos-easing="ease-in-out"
                data-aos-duration="800"
                data-aos-once="false"
                data-aos-anchor-placement="top-bottom"
                id='blog-post-card'
                key={post.id}
                className={`md:h-56 w-full flex justify-between md:flex-row flex-col-reverse ${CONFIG_HEXO.POST_LIST_IMG_CROSSOVER && index % 2 === 1 ? 'md:flex-row-reverse' : ''}
                    overflow-hidden border dark:border-black rounded-xl bg-white dark:bg-hexo-black-gray`}>

                {/* 文字内容 */}
                <BlogPostCardInfo index={index} post={post} showPageCover={showPageCover} showPreview={showPreview} showSummary={showSummary} />

                {/* 图片封面 */}
                {showPageCover && (
                    <div className="md:w-5/12 overflow-hidden">
                        <Link href={`${BLOG.SUB_PATH}/${post.slug}`} passHref legacyBehavior>
                            <div className='h-56 bg-center bg-cover hover:scale-110 duration-200' style={{ backgroundImage: `url('${post?.pageCoverThumbnail}')` }} />
                        </Link>
                    </div>
                )}

            </div>

        </div>

  )
}

export default BlogPostCard
