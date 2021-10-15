import BLOG from '@/blog.config'
import TagItemMini from '@/components/TagItemMini'

const BlogPost = ({ post }) => {
  return (
    <article key={post.id}
             className='animate__animated animate__fadeIn inline-block border dark:border-gray-600 my-2 w-full md:max-w-md bg-white dark:bg-gray-700 dark:hover:bg-gray-600 overflow-hidden'>
        {/*  封面图 */}
        {post.page_cover && post.page_cover.length > 1 && (
          <a href={`${BLOG.path}/article/${post.slug}`} className='md:flex-shrink-0 md:w-52 md:h-52 rounded-lg'>
            <img className='w-full max-h-60 object-cover cursor-pointer transform hover:scale-110 duration-500' src={post.page_cover} alt={post.title} />
          </a>
        )}

        <div className='px-8 py-6'>
          <a href={`${BLOG.path}/article/${post.slug}`}
             className='block my-3 text-2xl leading-tight font-bold text-black dark:text-gray-100 hover:underline'>
            {post.title}
          </a>
          <div className='flex flex-nowrap'>
            {post.tags.map(tag => (<TagItemMini key={tag} tag={tag} />))}
            <span className='mt-2 mx-2 text-gray-500 dark:text-gray-300 text-sm leading-4'>{post.date.start_date}</span>
          </div>
          <p className='mt-2 text-gray-500 dark:text-gray-300 text-sm'>{post.summary}</p>
        </div>
    </article>
  )
}

export default BlogPost
