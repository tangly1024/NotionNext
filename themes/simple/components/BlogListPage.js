
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { BlogItem } from './BlogItem'
import { AdSlot } from '@/components/GoogleAdsense'

export const BlogListPage = props => {
  const { page = 1, posts, postCount } = props
  const router = useRouter()
  const totalPage = Math.ceil(postCount / BLOG.POSTS_PER_PAGE)
  const currentPage = +page

  const showPrev = currentPage > 1
  const showNext = page < totalPage
  const pagePrefix = router.asPath.split('?')[0].replace(/\/page\/[1-9]\d*/, '').replace(/\/$/, '')

  return (
        <div className="w-full md:pr-8 mb-12">

            <div id="posts-wrapper">
                {posts?.map((p, index) => (<div key={p.id}>
                        {(index + 1) % 3 === 0 && <AdSlot type='in-article' />}
                        { (index + 1) === 4 && <AdSlot type='flow'/>}
                        <BlogItem post={p} />
                </div>))}

            </div>

            <div className="flex justify-between text-xs mt-1">
                <Link
                    href={{ pathname: currentPage - 1 === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${currentPage - 1}`, query: router.query.s ? { s: router.query.s } : {} }}
                    className={`${showPrev ? 'text-blue-600 border-b border-blue-400 visible ' : ' invisible bg-gray pointer-events-none '} no-underline pb-1 px-3`}>
                    NEWER POSTS <i className="fa-solid fa-arrow-left"></i>
                </Link>
                <Link
                    href={{ pathname: `${pagePrefix}/page/${currentPage + 1}`, query: router.query.s ? { s: router.query.s } : {} }}
                    className={`${showNext ? 'text-blue-600 border-b border-blue-400 visible' : ' invisible bg-gray pointer-events-none '} no-underline pb-1 px-3`}>
                    OLDER POSTS <i className="fa-solid fa-arrow-right"></i>
                </Link>
            </div>
        </div>
  )
}
