import BLOG from '@/blog.config'
import Link from 'next/link'

export const BlogItem = props => {
  const { post } = props
  console.log(post)

  return <div key={post.id} className="mb-10 pb-12 border-b" >
        <h2 className="mb-5 ">
            <Link
                id='blog-item-title'
                href={`/${post.slug}`}
                className="font-bold text-black text-xl md:text-2xl no-underline hover:underline">
                {post.title}
            </Link>
        </h2>

        <div className="mb-4 text-sm text-gray-700">
            <span> <i className="fa-regular fa-user"></i> <a href="#" className="text-gray-700">{BLOG.AUTHOR}</a></span>
            <span> - <i className="fa-regular fa-clock"></i> {post.date?.start_date || post.createdTime}</span>
            {post.category && <span> - <i className="fa-regular fa-folder"></i> <a href="#" className="text-gray-700 hover:text-red-400 transition-all duration-200">{post.category}</a></span>}
            {post.tags && post.tags?.length > 0 && post.tags.map(t => <span key={t}> / <Link href={`tag/${t}`}><span className=' hover:text-red-400 transition-all duration-200'>{t}</span></Link></span>)}
        </div>

        <div className="text-gray-700 leading-normal mb-6">
            {post.summary}
            {post.summary && <span>...</span>}
        </div>

        <div className='block'>
            <Link href={post.slug} className='inline-block rounded-sm text-blue-400 text-xs border hover:text-red-400 transition-all duration-200 hover:border-red-300 h-9 leading-8 px-5'>
                Continue Reading <i className="fa-solid fa-angle-right align-middle"></i>
            </Link>
        </div>
    </div>
}
