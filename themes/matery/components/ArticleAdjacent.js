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
  return <section className='flex-col  py-3 space-y-3 text-gray-800 items-center text-xs md:text-sm md:flex md:flex-row md:space-y-0 md:space-x-4 justify-between m-1 '>

        <BlogPostCard post={prev}/>
        <BlogPostCard post={next}/>

  </section>
}
