import React from 'react'
import CategoryItem from './CategoryItem'

const CategoryGroup = ({ currentCategory, categories }) => {
  if (!categories) {
    return <></>
  }
  return <div id='category-list' className='pt-4'>
    <div className='mb-2'><i className='mr-2 fas fa-th' />分类</div>
    <div className='flex flex-wrap'>
      {categories?.map(category => {
        const selected = currentCategory === category.name
        return <CategoryItem key={category.name} selected={selected} category={category.name} categoryCount={category.count} />
      })}
    </div>
  </div>
}

export default CategoryGroup
