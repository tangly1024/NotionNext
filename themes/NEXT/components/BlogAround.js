import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'

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
    <Link href={`/article/${prev.slug}`} passHref>
      <a className='text-sm py-3 text-gray-400 hover:underline cursor-pointer'>
        <FontAwesomeIcon icon={faAngleDoubleLeft} className='mr-1' />{prev.title}
      </a>
    </Link>
    <Link href={`/article/${next.slug}`} passHref>
      <a className='text-sm flex py-3 text-gray-400 hover:underline cursor-pointer'>{next.title}
        <FontAwesomeIcon icon={faAngleDoubleRight} className='ml-1 my-1' />
      </a>
    </Link>
  </section>
}
