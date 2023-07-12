import Link from 'next/link'
import React from 'react'
import CONFIG from '../config'
import { BlogPostCardInfo } from './BlogPostCardInfo'
import BLOG from '@/blog.config'
// import Image from 'next/image'

const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview = CONFIG.POST_LIST_PREVIEW && post.blockMap
  if (post && !post.pageCoverThumbnail && CONFIG.POST_LIST_COVER_DEFAULT) {
    post.pageCoverThumbnail = siteInfo?.pageCover
  }
  const showPageCover = CONFIG.POST_LIST_COVER && post?.pageCoverThumbnail && !showPreview
  console.log(post, post.pageCoverThumbnail)
  return (
        <div className={`${CONFIG.POST_LIST_COVER_HOVER_ENLARGE ? ' hover:scale-110 transition-all duration-150' : ''}`} >
            <div className={`w-full border justify-between flex flex-col lg:h-96 
                    overflow-hidden  rounded-xl bg-white `}>

                {/* 图片封面 */}
                {showPageCover && (
                    <div className="flex-1 md:w-5/12 lg:w-full overflow-hidden">
                        <Link href={`${BLOG.SUB_PATH}/${post.slug}`} passHref legacyBehavior>
                            <div className='h-56 bg-center bg-cover hover:scale-110 duration-200' style={{ backgroundImage: `url('${post?.pageCoverThumbnail}')` }} />
                        </Link>
                    </div>
                )}

                {/* 文字区块 */}
                <BlogPostCardInfo index={index} post={post} showPageCover={showPageCover} showPreview={showPreview} showSummary={showSummary} />

            </div>

        </div>

  )
}

export default BlogPostCard
