import BLOG from '@/blog.config'
import TagItem from '@/components/TagItem'

const BlogPost = ({ post }) => {
  return (
    <article key={post.id}
             className='inline-block my-2 md:mx-2 w-full md:max-w-md duration-200 transform hover:scale-105 rounded-3xl bg-white dark:bg-gray-800 dark:hover:bg-gray-600 overflow-hidden'>
        {/*  封面图 */}
        {post.page_cover && post.page_cover.length > 1 && (
          <a href={`${BLOG.path}/article/${post.slug}`} className='md:flex-shrink-0 md:w-52 md:h-52 rounded-lg'>
            <img className='w-full max-h-60 object-cover cursor-pointer' src={post.page_cover} alt={post.title} />
          </a>
        )}

        <div className='px-8 py-6'>
          <a href={`${BLOG.path}/article/${post.slug}`}
             className='block my-3 text-2xl leading-tight font-semibold text-black dark:text-gray-200 hover:underline'>
            {post.title}
          </a>
          <p className='mt-2 text-gray-500 dark:text-gray-400 text-sm'>{post.summary}</p>
            <div className='flex flex-nowrap leading-8 py-2'>
              {post.tags.map(tag => (
                <TagItem key={tag} tag={tag} />
              ))}
            </div>
        </div>
    </article>
  )
}

export default BlogPost
