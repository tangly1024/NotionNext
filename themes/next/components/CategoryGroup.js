import { siteConfig } from '@/lib/config'
import Link from 'next/link'

const CategoryGroup = ({ currentCategory, categories }) => {
  if (!categories || categories.length === 0) return <></>
  const categoryCount = siteConfig('NEXT_PREVIEW_CATEGORY_COUNT')
  const categoryOptions = categories.slice(0, categoryCount)
  return (
    <>
      <div id='category-list' className='dark:border-gray-600 flex flex-wrap'>
        {categoryOptions.map(category => {
          const selected = currentCategory === category.name
          return (
            <Link
              key={category.name}
              href={`/category/${category.name}`}
              passHref
              className={
                (selected
                  ? 'hover:text-white dark:hover:text-white bg-gray-600 text-white '
                  : 'dark:text-gray-400 text-gray-500 hover:text-white hover:bg-gray-500 dark:hover:text-white') +
                '  text-sm w-full items-center duration-300 px-2  cursor-pointer py-1 font-light'
              }>
              <i
                className={`${selected ? 'text-white fa-folder-open ' : 'text-gray-500 fa-folder '} mr-2 fas`}
              />
              {category.name}({category.count})
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default CategoryGroup
