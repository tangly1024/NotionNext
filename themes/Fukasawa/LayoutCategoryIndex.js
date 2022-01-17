import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { faFolder, faTh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import LayoutBase from './LayoutBase'

export const LayoutCategoryIndex = (props) => {
  const { locale } = useGlobal()
  const { categories } = props
  const meta = {
    title: `${locale.COMMON.CATEGORY} | ${BLOG.TITLE}`,
    description: BLOG.DESCRIPTION,
    type: 'website'
  }
  return <LayoutBase {...props} meta={meta}>
    <div className='bg-white dark:bg-gray-700 px-10 py-10 shadow'>
      <div className='dark:text-gray-200 mb-5'>
        <FontAwesomeIcon icon={faTh} className='mr-4' />{locale.COMMON.CATEGORY}:
      </div>
      <div id='category-list' className='duration-200 flex flex-wrap'>
        {Object.keys(categories).map(category => {
          return <Link key={category} href={`/category/${category}`} passHref>
            <div
              className={'hover:text-black dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'}>
              <FontAwesomeIcon icon={faFolder} className='mr-4' />{category}({categories[category]})
            </div>
          </Link>
        })}
      </div>
    </div>  </LayoutBase>
}
