import Link from 'next/link'

/**
 * 上一篇，下一篇文章
 * @param {prev,next} param0
 * @returns
 */
export default function ArticleAround ({ prev, next }) {
  if (!prev || !next) {
    return <></>
  }
  return <section className='text-gray-800 h-28 flex items-center justify-between space-x-5 my-4'>
    <Link href={`/article/${prev.slug}`} passHref>
      <a className='text-sm cursor-pointer justify-center items-center flex w-full h-full bg-white bg-opacity-40 hover:bg-hexo-black-gray dark:bg-hexo-black-gray dark:text-gray-200 hover:text-white duration-300'>
        <i className='mr-1 fas fa-angle-double-left' />{prev.title}
      </a>
    </Link>
    <Link href={`/article/${next.slug}`} passHref>
      <a className='text-sm  cursor-pointer justify-center items-center flex w-full h-full bg-white bg-opacity-40 hover:bg-hexo-black-gray dark:bg-hexo-black-gray dark:text-gray-200 hover:text-white duration-300'>{next.title}
        <i className='ml-1 my-1 fas fa-angle-double-right' />
      </a>
    </Link>
  </section>
}
