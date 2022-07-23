import BLOG from '@/blog.config'
import Link from 'next/link'
import LayoutBase from './LayoutBase'

export const LayoutArchive = props => {
  const { posts } = props
  const postsSortByDate = Object.create(posts)

  postsSortByDate.sort((a, b) => {
    const dateA = new Date(a?.date?.start_date || a.createdTime)
    const dateB = new Date(b?.date?.start_date || b.createdTime)
    return dateB - dateA
  })

  const archivePosts = {}

  postsSortByDate.forEach(post => {
    const date = post.date?.start_date.slice(0, 7)
    if (archivePosts[date]) {
      archivePosts[date].push(post)
    } else {
      archivePosts[date] = [post]
    }
  })
  return (
    <LayoutBase {...props}>
      <div className="mb-10 pb-20 md:p-12 p-3  min-h-full">
        {Object.keys(archivePosts).map(archiveTitle => (
          <div key={archiveTitle}>
            <div
              className="pt-16 pb-4 text-3xl dark:text-gray-300"
              id={archiveTitle}
            >
              {archiveTitle}
            </div>
            <ul>
              {archivePosts[archiveTitle].map(post => (
                <li
                  key={post.id}
                  className="border-l-2 p-1 text-xs md:text-base items-center  hover:scale-x-105 hover:border-gray-500 dark:hover:border-gray-300 dark:border-gray-400 transform duration-500"
                >
                  <div id={post?.date?.start_date}>
                    <span className="text-gray-400">
                      {post.date?.start_date}
                    </span>{' '}
                    &nbsp;
                    <Link
                      href={`${BLOG.SUB_PATH}/article/${post.slug}`}
                      passHref
                    >
                      <a className="dark:text-gray-400  dark:hover:text-gray-300 overflow-x-hidden hover:underline cursor-pointer text-gray-600">
                        {post.title}
                      </a>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </LayoutBase>
  )
}
