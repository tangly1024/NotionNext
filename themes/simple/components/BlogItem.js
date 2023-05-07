import BLOG from '@/blog.config'
import Link from 'next/link'
import CONFIG_SIMPLE from '../config_simple'
import TwikooCommentCount from '@/components/TwikooCommentCount'

export const BlogItem = props => {
  const { post } = props

  return <div key={post.id} className="mb-10 pb-12 border-b dark:border-gray-800" >
        <h2 className="mb-5 ">
            <Link
                id='blog-item-title'
                href={`/${post.slug}`}
                className="font-bold text-black text-xl md:text-2xl no-underline hover:underline">
                {post.title}
            </Link>
        </h2>

        <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
            <span> <i className="fa-regular fa-user"></i> <a href={CONFIG_SIMPLE.AUTHOR_LINK}>{BLOG.AUTHOR}</a></span>
            <span> - <i className="fa-regular fa-clock"></i> {post.date?.start_date || post.createdTime}</span>
            <span> - <TwikooCommentCount post={post}/></span>
            {post.category && <span> - <i className="fa-regular fa-folder"></i> <a href={`/category/${post.category}`} className="hover:text-red-400 transition-all duration-200">{post.category}</a></span>}
            {post.tags && post.tags?.length > 0 && post.tags.map(t => <span key={t}> / <Link href={`/tag/${t}`}><span className=' hover:text-red-400 transition-all duration-200'>{t}</span></Link></span>)}
        </div>

        <div className="text-gray-700 dark:text-gray-300 leading-normal mb-6">
            {post.summary}
            {post.summary && <span>...</span>}
        </div>

        <div className='block'>
            <Link href={`/${post.slug}`} className='inline-block rounded-sm text-blue-400 text-xs dark:border-gray-800 border hover:text-red-400 transition-all duration-200 hover:border-red-300 h-9 leading-8 px-5'>
                Continue Reading <i className="fa-solid fa-angle-right align-middle"></i>
            </Link>
        </div>
    </div>
}
