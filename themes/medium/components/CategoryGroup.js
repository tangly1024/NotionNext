import { useGlobal } from '@/lib/global'
import CategoryItem from './CategoryItem'

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
      <div className='mb-2'>
        <i className='mr-2 fas fa-th' />
        {locale.COMMON.CATEGORY}
      </div>
      <div className='flex flex-wrap'>
        {categoryOptions?.map(category => {
          const selected = currentCategory === category.name
          return (
            <CategoryItem
              key={category.name}
              selected={selected}
              category={category.name}
              categoryCount={category.count}
            />
          )
        })}
      </div>
    </div>
  )
}

export default CategoryGroup
