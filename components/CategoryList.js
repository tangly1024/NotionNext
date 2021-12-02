import Link from 'next/link'
import React from 'react'

const CategoryList = ({ currentCategory, categories }) => {
  if (!categories) {
    return <></>
  }
  return <ul className='flex py-1 space-x-3'>
    <li className='w-16 py-2 dark:text-gray-200'><i className='fa fa-th-list mr-2'/>分类:</li>
    {Object.keys(categories).map(category => {
      const selected = category === currentCategory
      return (
      <Link key={category} href={`/category/${category}`}>
          <li
            className={`cursor-pointer border rounded-xl duration-200 mr-1 my-1 px-2 py-1 font-medium font-light text-sm whitespace-nowrap dark:text-gray-300 
                 ${selected
              ? 'text-white bg-black dark:hover:bg-gray-900 dark:bg-black dark:border-gray-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-300 dark:bg-gray-600 dark:border-gray-600'
            }`}
          >
            <a>
              <i className='fa fa-folder-open-o mr-1'/>
              {`${category} `}
            </a>
          </li>
        </Link>)
    })}
  </ul>
}

export default CategoryList
