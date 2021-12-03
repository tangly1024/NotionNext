import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

const CategoryGroup = ({ currentCategory, categories }) => {
  return <div>
      <div id='category-list' className='dark:border-gray-600 dark:bg-gray-800'>
        {Object.keys(categories).map(category => {
          const selected = currentCategory === category
          return <Link key={category} href={`/category/${category}`} passHref>
            <div className={(selected ? 'bg-gray-200 dark:bg-black dark:text-white text-black ' : 'dark:text-gray-400 text-gray-500 ') + ' hover:text-black dark:hover:text-white dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'}>
              <FontAwesomeIcon icon={selected ? faFolderOpen : faFolder} className='mr-2 text-gray-400'/>{category}({categories[category]})</div>
          </Link>
        })}
      </div>
    </div>
}

export default CategoryGroup
