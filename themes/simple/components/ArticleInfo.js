import Link from 'next/link'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import BLOG from '@/blog.config'
import { formatDateFmt } from '@/lib/formatDate'

export const ArticleInfo = (props) => {
  const { post } = props

  const { locale } = useGlobal()

  return (
        <section className="flex-wrap flex mt-2 text-gray-400 dark:text-gray-400 font-light leading-8">
            <div>
                <h2
                    className="blog-item-title mb-5 font-bold text-black text-xl md:text-2xl no-underline">
                    {post?.title}
                </h2>

                {post?.type !== 'Page' && (<>
                    <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                        <span> <i className="fa-regular fa-user"></i> <a href={CONFIG.AUTHOR_LINK}>{BLOG.AUTHOR}</a></span>
                        <span> - <i className="fa-regular fa-clock"></i> {post?.publishDay}</span>
                        {post?.category && <span> - <i className="fa-regular fa-folder"></i> <a href={`/category/${post?.category}`} className="hover:text-red-400 transition-all duration-200">{post?.category}</a></span>}
                        {post?.tags && post?.tags?.length > 0 && post?.tags.map(t => <span key={t}> / <Link href={`/tag/${t}`}><span className=' hover:text-red-400 transition-all duration-200'>{t}</span></Link></span>)}
                    </div>
                </>)}

                {post?.type !== 'Page' && (<>
                    <span>{locale.COMMON.POST_TIME}:
                        <Link
                            href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                            passHref
                            className="pl-1 mr-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 border-b dark:border-gray-500 border-dashed">
                            {post?.publishDay}
                        </Link>
                    </span>
                    <span className='mr-2'>|</span>
                    <span className='mx-2 text-gray-400 dark:text-gray-500'>
                        {locale.COMMON.LAST_EDITED_TIME}: {post?.lastEditedDay}
                    </span>
                    <span className='mr-2'>|</span>
                    <span className="hidden busuanzi_container_page_pv font-light mr-2">
                        <i className='mr-1 fas fa-eye' />
                        &nbsp;
                        <span className="mr-2 busuanzi_value_page_pv" />
                    </span>
                </>)}

            </div>

        </section>
  )
}
