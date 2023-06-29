import BLOG from '@/blog.config'
import Link from 'next/link'
import LayoutBase from './LayoutBase'

export const LayoutArchive = props => {
  const { archivePosts } = props

  return (
    <LayoutBase {...props}>
      <div className="mb-10 pb-20 md:py-12 p-3  min-h-screen w-full">
        {Object.keys(archivePosts).map(archiveTitle => (
          <div key={archiveTitle}>
            <div id={archiveTitle} className="pt-16 pb-4 text-3xl dark:text-gray-300" >
              {archiveTitle}
            </div>

            <ul>
              {archivePosts[archiveTitle].map(post => (
                <li
                  key={post.id}
                  className="border-l-2 p-1 text-xs md:text-base items-center  hover:scale-x-105 hover:border-gray-500 dark:hover:border-gray-300 dark:border-gray-400 transform duration-500"
                >
                  <div id={post?.publishTime}>
                    <span className="text-gray-400">
                      {post.date?.start_date}
                    </span>{' '}
                    &nbsp;
                    <Link
                      href={`${BLOG.SUB_PATH}/${post.slug}`}
                      passHref
                      className="dark:text-gray-400  dark:hover:text-gray-300 overflow-x-hidden hover:underline cursor-pointer text-gray-600">

                      {post.title}

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

export default LayoutArchive
