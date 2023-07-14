import Link from 'next/link'
import LayoutBase from './LayoutBase'

export const LayoutCategoryIndex = (props) => {
  const { categoryOptions } = props

  return (
    <LayoutBase {...props}>
        <div id='category-list' className='duration-200 flex flex-wrap'>
          {categoryOptions?.map(category => {
            return (
              <Link
                key={category.name}
                href={`/category/${category.name}`}
                passHref
                legacyBehavior>
                <div
                  className={'hover:text-black dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'}>
                  <i className='mr-4 fas fa-folder' />{category.name}({category.count})
                </div>
              </Link>
            )
          })}
        </div>
    </LayoutBase>
  )
}

export default LayoutCategoryIndex
