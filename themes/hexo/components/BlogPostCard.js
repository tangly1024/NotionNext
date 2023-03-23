import BLOG from '@/blog.config'
import Link from 'next/link'
import React from 'react'
import CONFIG_HEXO from '../config_hexo'
import { BlogPostCardInfo } from './BlogPostCardInfo'
// import Image from 'next/image'

const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview = CONFIG_HEXO.POST_LIST_PREVIEW && post.blockMap
  if (post && !post.page_cover && CONFIG_HEXO.POST_LIST_COVER_DEFAULT) {
    post.page_cover = siteInfo?.pageCover
  }
  const showPageCover = CONFIG_HEXO.POST_LIST_COVER && post?.page_cover
  const delay = (index % 2) * 200

  return (
    <div
        id='blog-post-card'
        data-aos="fade-up"
        data-aos-duration="200"
        data-aos-delay={delay}
        data-aos-once="true"
        data-aos-anchor-placement="top-bottom"
        key={post.id}
        className={`flex md:flex-row flex-col-reverse ${CONFIG_HEXO.POST_LIST_IMG_CROSSOVER ? 'even:md:flex-row-reverse' : ''}
        w-full justify-between overflow-hidden
        border dark:border-black rounded-xl bg-white dark:bg-hexo-black-gray`}>

        {/* 文字内容 */}
        <BlogPostCardInfo index={index} post={post} showPageCover={showPageCover} showPreview={showPreview} showSummary={showSummary}/>

         {/* 图片封面 */}
        {showPageCover && !showPreview && post?.page_cover && (
           <div className="h-auto md:w-5/12">
                <Link href={`${BLOG.SUB_PATH}/${post.slug}`} passHref legacyBehavior>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {/* <img
                        src={post?.page_cover}
                        alt={post.title}
                        loading='lazy'
                        className="w-full relative cursor-pointer object-cover duration-200 hover:scale-125 "
                    /> */}
                    <div className='bg-center bg-cover md:h-full h-52' style={{ backgroundImage: `url('${post?.page_cover}')` }}/>

                    {/* <div className='relative w-full h-full'>
                    <Image
                     className='hover:scale-125 transition cursor-pointer duration-500'
                     src={post?.page_cover}
                     alt={post.title}
                     quality={30}
                     placeholder='blur'
                     blurDataURL='/bg_image.jpg'
                     style={{ objectFit: 'cover' }}
                     fill/>
                    </div> */}
                </Link>
            </div>
        )}

    </div>
  )
}

export default BlogPostCard
