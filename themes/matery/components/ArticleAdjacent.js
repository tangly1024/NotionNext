import CONFIG from '../config'
import BlogPostCard from './BlogPostCard'
import { siteConfig } from '@/lib/config'

/**
 * 上一篇，下一篇文章
 * @param {prev,next} param0
 * @returns
 */
export default function ArticleAdjacent ({ prev, next, siteInfo }) {
  if (!prev || !next || !siteConfig('MATERY_ARTICLE_ADJACENT', null, CONFIG)) {
    return <></>
  }
  return <section className='flex flex-col justify-between  p-3 text-gray-800 items-center text-xs md:text-sm md:flex-row md:gap-2 '>

        <BlogPostCard post={prev} siteInfo={siteInfo}/>
        <BlogPostCard post={next} siteInfo={siteInfo}/>

  </section>
}
