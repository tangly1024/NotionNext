import Link from 'next/link'

/**
 * 归档分组文章
 * @param {*} param0
 * @returns
 */
export default function BlogArchiveItem({ archiveTitle, archivePosts }) {
  return (
    <div key={archiveTitle} className='pb-16'>
      <div id={archiveTitle} className='text-[#111827] opacity-30 pb-2 text-3xl dark:text-gray-300'>
        {archiveTitle}
      </div>

      <ul>
        {archivePosts.map(post => {
          return (
            <li
              key={post.id}
              className='p-1 pl-0 text-base items-center mb-3'>
              <div id={post?.publishDay} className='flex justify-between'>
                <Link
                  href={post?.href}
                  passHref
                  className='dark:text-gray-400  dark:hover:text-gray-300 overflow-x-hidden cursor-pointer text-[#111827] font-bold'>
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
