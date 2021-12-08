import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

const CategoryGroup = ({ currentCategory, categories }) => {
  return <div className='mt-3'>
    <div id='category-list' className='dark:border-gray-600 dark:bg-gray-900'>
      {Object.keys(categories).map(category => {
        const selected = currentCategory === category
        return <Link key={category} href={`/category/${category}`} passHref>
          <div className={(selected
            ? 'bg-gray-200 dark:bg-black text-black dark:text-white'
            : 'dark:text-gray-400 text-gray-500') +
            ' duration-300 hover:text-blue-500 dark:hover:text-blue-400 hover:underline px-5 cursor-pointer pt-2 font-serif'}>
            <FontAwesomeIcon icon={selected ? faFolderOpen : faFolder} className={`${selected ? 'text-black dark:text-white' : 'text-gray-400'} mr-2 w-5`} />{category}({categories[category]})</div>
        </Link>
      })}
    </div>
  </div>
}

export default CategoryGroup
