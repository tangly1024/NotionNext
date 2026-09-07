import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'

export default function RecommendPosts({ recommendPosts }) {
  const { locale } = useGlobal()
  if (
    !siteConfig(
      'EDITORIAL_ARTICLE_RECOMMEND_POSTS',
      true,
      CONFIG
    ) ||
    !recommendPosts?.length
  ) {
    return null
  }

  return (
    <section className='editorial-recommend'>
      <div className='editorial-section-label'>{locale.COMMON.RELATE_POSTS}</div>
      <div className='editorial-recommend-grid'>
        {recommendPosts.slice(0, 4).map((post, index) => (
          <SmartLink key={post.id} href={`/${post.slug}`}>
            <small>{String(index + 1).padStart(2, '0')}</small>
            <span>{post.title}</span>
          </SmartLink>
        ))}
      </div>
    </section>
  )
}
