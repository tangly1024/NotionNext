import BLOG from '@/blog.config'
import Link from 'next/link'

const BlogPostCardMini = ({ post }) => {
  return (
    <Link key={post.id} title={post.title} href={`${BLOG.path}/article/${post.slug}`} >
     <div className='sm:flex w-full border dark:border-gray-800 my-2 duration-200 transform hover:scale-105 hover:shadow-2xl bg-white dark:bg-gray-800 dark:hover:bg-gray-700'>
       {/*  封面图 */}
       {post.page_cover && post.page_cover.length > 1 && (
         <img className='sm:w-40 w-full object-cover cursor-pointer' src={post.page_cover} alt={post.title} />
       )}

       <main className='px-2 overflow-x-hidden'>
         <div
           className='block my-3 leading-tight font-semibold text-black dark:text-gray-200 hover:underline whitespace-nowrap'>
           {post.title}
         </div>
         <p className='mt-2 text-gray-500 dark:text-gray-400 text-xs overflow-x-hidden'>{post.summary}</p>
       </main>
     </div>
    </Link>
  )
}

export default BlogPostCardMini
