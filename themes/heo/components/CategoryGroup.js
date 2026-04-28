import SmartLink from '@/components/SmartLink'
import { chineseToEnglishCategory } from '@/lib/utils/categoryMapper'

const CategoryGroup = ({ currentCategory, categories }) => {
  if (!categories) {
    return <></>
  }
  return <>
    <div id='category-list' className='dark:border-gray-700 flex flex-wrap  mx-4'>
      {categories.map(category => {
        const selected = currentCategory === category.name
        const categorySlug = chineseToEnglishCategory(category.name)
        return (
          <SmartLink
            key={category.name}
            href={`/category/${categorySlug}`}
            passHref
            className={(selected
              ? 'hover:text-white dark:hover:text-black bg-indigo-600 text-white dark:bg-yellow-600 dark:text-black '
              : 'dark:text-gray-400 text-gray-500 hover:text-white dark:hover:text-black hover:bg-indigo-600 dark:hover:bg-yellow-600') +
              ' text-sm w-full items-center duration-300 px-3 cursor-pointer py-2 font-medium rounded-xl'}>

            <div>{category.name}({category.count})</div>

          </SmartLink>
        )
      })}
    </div>
  </>
}

export default CategoryGroup
