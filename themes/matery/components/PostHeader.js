import Image from 'next/image'

/**
 * 文章背景图
 */
export default function PostHeader({ post, siteInfo }) {
  const headerImage = post?.pageCoverThumbnail ? post?.pageCoverThumbnail : siteInfo?.pageCover
  const title = post?.title
  return (
        <div id='header' className="flex h-96 justify-center align-middle items-center w-full relative bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* <img
                src={headerImage}
                alt={title}
                className="opacity-50 dark:opacity-40 h-full w-full object-cover"
            /> */}
            <Image alt={title} src={headerImage} fill style={{ objectFit: 'cover' }} className='opacity-50'
                placeholder='blur' blurDataURL='/bg_image.jpg' />
            <div className="leading-snug font-bold xs:text-4xl sm:text-4xl md:text-5xl md:leading-snug text-4xl shadow-text-md flex justify-center text-center text-white">
                {title}
            </div>
        </div>
  )
}
