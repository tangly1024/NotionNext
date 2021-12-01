import Link from 'next/link'
import React from 'react'

const CategoryGroup = ({ currentCategory, categories }) => {
  return <div>
      <div id='category-list' className='dark:border-gray-600 dark:bg-gray-800 w-66'>
        {Object.keys(categories).map(category => {
          return <Link key={category} href={`/category/${category}`}>
            <div className={(currentCategory === category ? 'bg-gray-200 dark:bg-black' : '') + ' dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'}><i className='fa fa-folder-open-o mr-4'/>{category}({categories[category]})</div>
          </Link>
        })}
      </div>
    </div>
}

export default CategoryGroup
