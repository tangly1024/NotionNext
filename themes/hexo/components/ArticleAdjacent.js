import Link from 'next/link'
import CONFIG_HEXO from '../config_hexo'

/**
 * 上一篇，下一篇文章
 * @param {prev,next} param0
 * @returns
 */
export default function ArticleAdjacent ({ prev, next }) {
  if (!prev || !next || !CONFIG_HEXO.ARTICLE_ADJACENT) {
    return <></>
  }
  return <section className='text-gray-800 h-14 flex items-center justify-between space-x-5 my-1'>
    <Link href={`/article/${prev.slug}`} passHref>
      <a className='text-sm cursor-pointer hover:underline justify-start items-center flex w-full h-full duration-200'>
        <i className='mr-1 fas fa-angle-double-left' />{prev.title}
      </a>
    </Link>
    <Link href={`/article/${next.slug}`} passHref>
      <a className='text-sm  cursor-pointer hover:underline justify-end items-center flex w-full h-full duration-200'>{next.title}
        <i className='ml-1 my-1 fas fa-angle-double-right' />
      </a>
    </Link>
  </section>
}
