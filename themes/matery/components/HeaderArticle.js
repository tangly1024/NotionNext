export default function HeaderArticle({ post, siteInfo }) {
  const headerImage = post?.page_cover ? post?.page_cover : siteInfo?.pageCover
  const title = post?.title
  return (
        <div
            data-aos="fade-down"
            data-aos-duration="500"
            data-aos-easing="ease-in-out"
            data-aos-once="false"
            data-aos-anchor-placement="top-center"
            id='header' className="flex h-96 justify-center align-middle items-center w-full relative duration-200 bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={headerImage}
                alt={title}
                className="opacity-50 dark:opacity-40 h-full w-full object-cover"
            />
            <span className='absolute text-white p-6 text-3xl'>{title}</span>
        </div>
  )
}
