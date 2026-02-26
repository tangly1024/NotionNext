import { AdSlot } from '@/components/GoogleAdsense'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import CONFIG from '../config'
import { BlogItem } from './BlogItem'

/**
 * 博客列表
 * @param {*} props
 * @returns
 */
export default function BlogListPage(props) {
  const { page = 1, posts, postCount } = props
  const router = useRouter()
  const { NOTION_CONFIG } = useGlobal()
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  const totalPage = Math.ceil(postCount / POSTS_PER_PAGE)
  const currentPage = +page

  // 博客列表嵌入广告
  const SIMPLE_POST_AD_ENABLE = siteConfig(
    'SIMPLE_POST_AD_ENABLE',
    false,
    CONFIG
  )

  const showPrev = currentPage > 1
  const showNext = page < totalPage
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  return (
    <div className='w-full md:pr-8 mb-12'>
      <div id='posts-wrapper'>
        {posts?.map((p, index) => (
          <div key={p.id}>
            {SIMPLE_POST_AD_ENABLE && (index + 1) % 3 === 0 && (
              <AdSlot type='in-article' />
            )}
            {SIMPLE_POST_AD_ENABLE && index + 1 === 4 && <AdSlot type='flow' />}
            <BlogItem post={p} />
          </div>
        ))}
      </div>

      <div className='flex justify-between text-xs mt-1'>
        <SmartLink
          href={{
            pathname:
              currentPage - 1 === 1
                ? `${pagePrefix}/`
                : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          className={`${showPrev ? 'text-blue-600 border-b border-blue-400 visible ' : ' invisible bg-gray pointer-events-none '} no-underline pb-1 px-3`}>
          NEWER POSTS <i className='fa-solid fa-arrow-left'></i>
        </SmartLink>
        <SmartLink
          href={{
            pathname: `${pagePrefix}/page/${currentPage + 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          className={`${showNext ? 'text-blue-600 border-b border-blue-400 visible' : ' invisible bg-gray pointer-events-none '} no-underline pb-1 px-3`}>
          OLDER POSTS <i className='fa-solid fa-arrow-right'></i>
        </SmartLink>
      </div>
    </div>
  )
}
