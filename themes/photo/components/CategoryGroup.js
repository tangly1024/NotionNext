import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'

const CategoryGroup = props => {
  const { currentCategory, categoryOptions } = props
  const { locale } = useGlobal()
  if (!categoryOptions || categoryOptions.length === 0) return <></>
  const categoryCount = siteConfig('PHOTO_PREVIEW_CATEGORY_COUNT')
  const categories = categoryOptions.slice(0, categoryCount)
  return (
    <>
      <div>
        <h2 className='text-2xl dark:text-white'>{locale.COMMON.CATEGORY}</h2>
        <div id='category-list' className='dark:border-gray-600 flex flex-col'>
          {categories.map(category => {
            const selected = currentCategory === category.name
            return (
              <SmartLink
                key={category.name}
                href={`/category/${category.name}`}
                passHref
                className={
                  (selected
                    ? 'hover:text-white dark:hover:text-white bg-gray-600 text-white '
                    : 'dark:text-green-400 text-gray-500 hover:text-white hover:bg-gray-500 dark:hover:text-white') +
                  ' w-full items-center duration-300 px-2  cursor-pointer py-1 font-light'
                }>
                <i
                  className={`${selected ? 'text-white fa-folder-open ' : 'text-gray-500 fa-folder '} mr-2 fas`}
                />
                {category.name}({category.count})
              </SmartLink>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default CategoryGroup
