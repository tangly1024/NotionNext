import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import BlogPost from './BlogPost'

export const BlogListPage = props => {
  const { page = 1, posts, postCount } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const { NOTION_CONFIG } = useGlobal()
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 12, NOTION_CONFIG)
  const totalPage = Math.ceil(postCount / POSTS_PER_PAGE)
  const currentPage = +page

  const showPrev = currentPage > 1
  const showNext = currentPage < totalPage && posts?.length > 0
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')

  return (
    <div className='w-full md:pr-12 my-6'>
      <div id='posts-wrapper'>
        {posts?.map(post => (
          <BlogPost key={post.id} post={post} />
        ))}
      </div>

      <div className='flex justify-between text-xs'>
        <Link
          href={{
            pathname:
              currentPage - 1 === 1
                ? `${pagePrefix}/`
                : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          className={`${showPrev ? '  ' : ' invisible block pointer-events-none '}no-underline py-2 px-3 rounded`}>
          <button rel='prev' className='block cursor-pointer'>
            ← {locale.PAGINATION.PREV}
          </button>
        </Link>
        <Link
          href={{
            pathname: `${pagePrefix}/page/${currentPage + 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          className={`${showNext ? '  ' : 'invisible pointer-events-none '}  no-underline py-2 px-3 rounded`}>
          <button rel='next' className='block cursor-pointer'>
            {locale.PAGINATION.NEXT} →
          </button>
        </Link>
      </div>
    </div>
  )
}
