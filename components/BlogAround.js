import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'

/**
 * 上一篇，下一篇文章
 * @param {prev,next} param0
 * @returns
 */
export default function BlogAround ({ prev, next }) {
  return <section className='text-gray-800 mb-8 lg:mb-32 border-t dark:text-gray-300 px-5 flex flex-wrap lg:flex-nowrap lg:space-x-10 justify-between py-2'>
    <Link href={`/article/${prev.slug}`} passHref>
      <div className='text-sm py-3 text-blue-500 hover:underline cursor-pointer'>
        <FontAwesomeIcon icon={faAngleDoubleLeft} className='mr-1' />{prev.title}
        </div>
    </Link>
    <Link href={`/article/${next.slug}`} passHref>
      <div className='text-sm flex py-3 text-blue-500 hover:underline cursor-pointer'>{next.title}
        <FontAwesomeIcon icon={faAngleDoubleRight} className='ml-1 my-1' />
      </div>
    </Link>
  </section>
}
