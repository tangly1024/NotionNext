import BLOG from '@/blog.config'

const BlogPostMini = ({ post }) => {
  return (
    <a key={post.id} href={`${BLOG.path}/article/${post.slug}`}
             className='md:flex w-full border dark:border-gray-500 my-2 duration-200 transform hover:scale-105 hover:shadow-2xl bg-white dark:bg-gray-800 dark:hover:bg-gray-600'>
        {/*  封面图 */}
        {post.page_cover && post.page_cover.length > 1 && (
            <img className='md:w-40 w-full max-h-32 object-cover cursor-pointer' src={post.page_cover} alt={post.title} />
        )}

        <main className='px-2 py-1'>
          <a href={`${BLOG.path}/article/${post.slug}`}
             className='block my-3 leading-tight font-semibold text-black dark:text-gray-200 hover:underline'>
            {post.title}
          </a>
          <p className='mt-2 text-gray-500 dark:text-gray-400 text-xs overflow-x-hidden'>{post.summary}</p>
          <p className='mt-2 text-gray-500 dark:text-gray-400 text-xs overflow-x-hidden'>{BLOG.link}/article/{post.slug}</p>
        </main>
    </a>
  )
}

export default BlogPostMini
