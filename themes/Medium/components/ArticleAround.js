import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'

/**
 * 上一篇，下一篇文章
 * @param {prev,next} param0
 * @returns
 */
export default function ArticleAround ({ prev, next }) {
  if (!prev || !next) {
    return <></>
  }
  return <section className='text-gray-800 h-12 flex items-center justify-between space-x-5 my-4'>
    <Link href={`/article/${prev.slug}`} passHref>
      <a className='text-sm cursor-pointer justify-start items-center flex hover:underline duration-300'>
        <FontAwesomeIcon icon={faAngleDoubleLeft} className='mr-1' />{prev.title}
      </a>
    </Link>
    <Link href={`/article/${next.slug}`} passHref>
      <a className='text-sm  cursor-pointer justify-end items-center flex hover:underline duration-300'>{next.title}
        <FontAwesomeIcon icon={faAngleDoubleRight} className='ml-1 my-1' />
      </a>
    </Link>
  </section>
}
