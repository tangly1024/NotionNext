import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'

const CategoryList = ({ currentCategory, categoryOptions }) => {
  const { locale } = useGlobal()
  if (!categoryOptions) {
    return <></>
  }

  return (
    <ul className='flex py-1 space-x-3'>
      <li className='w-16 py-2 dark:text-gray-200 whitespace-nowrap'>{locale.COMMON.CATEGORY}</li>
      {categoryOptions?.map(category => {
        const selected = category.name === currentCategory
        return (
          <SmartLink
            key={category.name}
            href={`/category/${category.name}`}
            passHref
            legacyBehavior>
            <li
              className={`cursor-pointer border rounded-xl duration-200 mr-1 my-1 px-2 py-1 font-light text-sm whitespace-nowrap dark:text-gray-300 
                   ${selected
                  ? 'text-white bg-gray-500 dark:hover:bg-gray-900 dark:bg-gray-500 dark:border-gray-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 dark:bg-gray-600 dark:border-gray-600'
                }`}
            >
              <a>
              <i className={`${selected ? 'fa-folder-open ' : 'fa-folder '} fas mr-1`}/>
                {`${category.name} (${category.count})`}
              </a>
            </li>
          </SmartLink>
        )
      })}
    </ul>
  )
}

export default CategoryList
