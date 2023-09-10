import Link from 'next/link'
import BLOG from '@/blog.config'

const BlogPost = ({ post }) => {
  return (
    (<Link href={`${BLOG.SUB_PATH}/${post.slug}`}>

      <article key={post.id} className="mb-6 md:mb-8">
        <header className="flex flex-col justify-between md:flex-row md:items-baseline">
          <h2 className="text-lg md:text-xl font-medium mb-2 cursor-pointer text-black dark:text-gray-100">
            {post.title}
          </h2>
          <time className="flex-shrink-0 text-gray-600 dark:text-gray-400">
            {post?.publishDay}
          </time>
        </header>
        <main>
          <p className="hidden md:block leading-8 text-gray-700 dark:text-gray-300">
            {post.summary}
          </p>
        </main>
      </article>

    </Link>)
  )
}

export default BlogPost
