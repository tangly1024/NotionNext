
/**
 * 博客照片卡牌
 * @param {*} props
 * @returns
 */
const BlogPost = (props) => {
  const { post, siteInfo } = props
  const pageThumbnail = post?.pageCoverThumbnail || siteInfo?.pageCover
  console.log('缩略图', pageThumbnail, siteInfo)
  return (
        <article key={post?.id} className='cursor-pointer relative'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pageThumbnail} className='aspect-[16/9] w-full h-full object-cover' />
            <h2 className="text-md absolute left-0 bottom-0 mb-4 ml-4 text-black dark:text-gray-100 text-shadow">
                {post?.title}
            </h2>
        </article>

  )
}

export default BlogPost
