import Link from 'next/link'

/**
 * 归档分组文章
 * @param {*} param0
 * @returns
 */
export default function BlogArchiveItem({ archiveTitle, archivePosts }) {
  return (
    <div key={archiveTitle} className='pb-16'>
      <div id={archiveTitle} className='pb-2 text-3xl dark:text-gray-300'>
        {archiveTitle}
      </div>

      <ul>
        {archivePosts[archiveTitle].map(post => {
          return (
            <li
              key={post.id}
              className='p-1 pl-0 text-xs md:text-base items-center '>
              <div id={post?.publishDay} className='flex justify-between'>
                <Link
                  href={post?.href}
                  passHref
                  className='dark:text-gray-400  dark:hover:text-gray-300 overflow-x-hidden hover:underline cursor-pointer text-gray-600'>
                  {post.title}
                </Link>
                <span className='text-gray-400'>{post.date?.start_date}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
