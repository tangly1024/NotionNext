// import BLOG from '@/blog.config'
// import { useGlobal } from '@/lib/global'
// import Image from 'next/image'
// import Link from 'next/link'
// import React from 'react'
// import Card from './Card'
// import TagItemMini from './TagItemMini'
// import CONFIG_NEXT from '../config_next'
// import NotionPage from '@/components/NotionPage'
// import NotionIcon from '@/components/NotionIcon'

// const BlogPostCard = ({ post, showSummary }) => {
//   const { locale } = useGlobal()
//   const showPreview = CONFIG_NEXT.POST_LIST_PREVIEW && post.blockMap
//   return (
//     <Card className="w-full">
//       <div
//         key={post.id}
//         className="flex flex-col-reverse justify-between duration-300"
//       >
//         <div className="lg:p-8 p-4 flex flex-col w-full">
//           <Link
//             href={`${BLOG.SUB_PATH}/${post.slug}`}
//             passHref
//             className={`cursor-pointer hover:underline text-3xl ${showPreview ? 'text-center' : ''
//               } leading-tight text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400`}>

//             <NotionIcon icon={post.pageIcon} /> {post.title}

//           </Link>

//           <div
//             className={`flex mt-2 items-center ${showPreview ? 'justify-center' : 'justify-start'
//               } flex-wrap dark:text-gray-500 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 `}
//           >
//             <div>
//               {post.category && (
//                 <>
//                   <Link
//                     href={`/category/${post.category}`}
//                     passHref
//                     className="cursor-pointer font-light text-sm hover:underline transform">

//                     <i className="mr-1 fas fa-folder" />
//                     {post.category}

//                   </Link>
//                   <span className="mx-2">|</span>
//                 </>
//               )}
//               <Link
//                 href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
//                 passHref
//                 className="font-light hover:underline cursor-pointer text-sm leading-4 mr-3">

//                 {post.date?.start_date}

//               </Link>
//             </div>
//             <div className="md:flex-nowrap flex-wrap md:justify-start inline-block">
//               <div>
//                 {' '}
//                 {post.tagItems.map(tag => (
//                   <TagItemMini key={tag.name} tag={tag} />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {(!showPreview || showSummary) && !post.results && (
//             <p className="mt-4 mb-24 text-gray-700 dark:text-gray-300 text-sm font-light leading-7">
//               {post.summary}
//             </p>
//           )}

//           {/* 搜索结果 */}
//           {post.results && (
//             <p className="p-4-lines mt-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7">
//               {post.results.map(r => (
//                 <span key={r}>{r}</span>
//               ))}
//             </p>
//           )}

//           {showPreview && post?.blockMap && (
//             <div className="overflow-ellipsis truncate">
//               <NotionPage post={post} />
//             </div>
//           )}

//           <div className="text-right border-t pt-8 border-dashed">
//             <Link
//               href={`${BLOG.SUB_PATH}/${post.slug}`}
//               className="hover:bg-opacity-100 hover:underline transform duration-300 p-3 text-white bg-gray-800 cursor-pointer">

//               {locale.COMMON.ARTICLE_DETAIL}
//               <i className="ml-1 fas fa-angle-right" />

//             </Link>
//           </div>
//         </div>

//         {CONFIG_NEXT.POST_LIST_COVER && post?.page_cover && (
//           <Link href={`${BLOG.SUB_PATH}/${post.slug}`} passHref legacyBehavior>
//             <div className="h-72 w-full relative duration-200 cursor-pointer transform overflow-hidden">
//               <Image
//                 className="hover:scale-105 transform duration-500"
//                 src={post?.page_cover}
//                 alt={post.title}
//                 layout="fill"
//                 objectFit="cover"
//                 loading="lazy"
//               />
//             </div>
//           </Link>
//         )}
//       </div>
//     </Card>
//   )
// }

// export default BlogPostCard

import BLOG from '@/blog.config'
import Link from 'next/link'
import React from 'react'
import CONFIG_HEXO from '../config_next'
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
