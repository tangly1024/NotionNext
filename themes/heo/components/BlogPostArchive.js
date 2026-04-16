import SmartLink from '@/components/SmartLink'

/**
 * 博客归档列表
 * @param posts 所有文章
 * @param archiveTitle 归档标题
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostArchive = ({ posts = [], archiveTitle }) => {
  if (!posts || posts.length === 0) {
    return <></>
  } else {
    return (
      <div className=''>
        <div className='pb-4 dark:text-gray-300' id={archiveTitle}>
          {archiveTitle}
        </div>
        <ul>
          {posts?.map(post => {
            return (
              <li
                key={post.id}
                className='mb-3 border-b border-gray-100 pb-3 last:border-none dark:border-gray-800'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='min-w-0'>
                    {post?.category && (
                      <div className='mb-1 text-xs text-gray-500 dark:text-gray-400'>
                        {post.category}
                      </div>
                    )}
                    <SmartLink
                      href={post?.href}
                      passHref
                      className='line-clamp-2 cursor-pointer text-base font-bold leading-snug text-black transition-colors hover:text-indigo-700 dark:text-gray-100 dark:hover:text-yellow-600'
                    >
                      <span className='menu-link'>{post.title}</span>
                    </SmartLink>
                  </div>
                  <div className='shrink-0 text-xs text-gray-400 dark:text-gray-500'>
                    {post?.publishDay}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default BlogPostArchive
