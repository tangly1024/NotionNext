import CONFIG_MATERY from '../config_matery'
import BlogPostCard from './BlogPostCard'

/**
 * 上一篇，下一篇文章
 * @param {prev,next} param0
 * @returns
 */
export default function ArticleAdjacent ({ prev, next }) {
  if (!prev || !next || !CONFIG_MATERY.ARTICLE_ADJACENT) {
    return <></>
  }
  return <section className='flex flex-col justify-between  p-3 text-gray-800 items-center text-xs md:text-sm md:flex-row md:gap-2 '>

        <BlogPostCard post={prev}/>
        <BlogPostCard post={next}/>

  </section>
}
