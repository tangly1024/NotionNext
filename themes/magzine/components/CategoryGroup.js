import { useGlobal } from '@/lib/global'
import Link from 'next/link'

/**
 * 分类
 * @param {*} param0
 * @returns
 */
const CategoryGroup = ({ currentCategory, categoryOptions }) => {
  const { locale } = useGlobal()
  if (!categoryOptions) {
    return <></>
  }
  return (
    <div id='category-list' className='pt-4'>
      <div className='text-xl font-bold mb-2'>{locale.COMMON.CATEGORY}</div>
      <div className=''>
        {categoryOptions?.map((category, index) => {
          const selected = currentCategory === category.name
          return (
            <Link
              key={index}
              href={`/category/${category.name}`}
              passHref
              className={
                (selected
                  ? 'bg-gray-600 text-white '
                  : 'dark:text-gray-400 text-gray-900 ') +
                'text-lg hover:underline flex text-md items-center duration-300 cursor-pointer py-1 whitespace-nowrap'
              }>
              <span>
                {category.name} {category?.count && `(${category?.count})`}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryGroup
