import { faTh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import CategoryItem from './CategoryItem'

const CategoryGroup = ({ currentCategory, categories }) => {
  if (!categories) {
    return <></>
  }
  return <div id='category-list' className='pt-4'>
    <div className='mb-2'><FontAwesomeIcon icon={faTh} className='mr-2' />分类</div>
    <div className='flex flex-wrap'>
      {Object.keys(categories).map(category => {
        const selected = currentCategory === category
        return <CategoryItem key={category} selected={selected} category={category} categoryCount={categories[category]}/>
      })}
    </div>
  </div>
}

export default CategoryGroup
