import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CONFIG from '../config'
import BlogItem from './BlogItem'
/**
 * 使用分页插件的博客列表
 * @param {*} props
 * @returns
 */
export const BlogListPage = props => {
  const { page = 1, posts, postCount } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const totalPage = Math.ceil(
    postCount / parseInt(siteConfig('POSTS_PER_PAGE'))
  )
  const currentPage = +page

  const showPrev = currentPage > 1
  const showNext = page < totalPage
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')

  const showPageCover = siteConfig('EXAMPLE_POST_LIST_COVER', null, CONFIG)

  return (
    <div className={`w-full ${showPageCover ? 'md:pr-2' : 'md:pr-12'} mb-12`}>
      <div id='posts-wrapper'>
        {posts?.map(post => (
          <BlogItem key={post.id} post={post} />
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
          className={`${showPrev ? 'bg-black ' : 'bg-gray pointer-events-none '} text-white no-underline py-2 px-3 rounded`}>
          {locale.PAGINATION.PREV}
        </Link>
        <Link
          href={{
            pathname: `${pagePrefix}/page/${currentPage + 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          className={`${showNext ? 'bg-black ' : 'bg-gray pointer-events-none '} text-white no-underline py-2 px-3 rounded`}>
          {locale.PAGINATION.NEXT}
        </Link>
      </div>
    </div>
  )
}
