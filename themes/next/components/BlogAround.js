import Link from 'next/link'

/**
 * 上一篇，下一篇文章
 * @param {prev,next} param0
 * @returns
 */
export default function BlogAround ({ prev, next }) {
  if (!prev || !next) {
    return <></>
  }
  return <section className='text-gray-800 border-t dark:text-gray-300 flex flex-wrap lg:flex-nowrap lg:space-x-10 justify-between py-2'>
    {prev && <Link href={`/article/${prev.slug}`} passHref>
      <a className='text-sm py-3 text-gray-400 hover:underline cursor-pointer'>
        <i className='mr-1 fas fa-angle-double-left' />{prev.title}
      </a>
    </Link>}
    {next && <Link href={`/article/${next.slug}`} passHref>
      <a className='text-sm flex py-3 text-gray-400 hover:underline cursor-pointer'>{next.title}
        <i className='ml-1 my-1 fas -fa-angle-double-right' />
      </a>
    </Link>}
  </section>
}
