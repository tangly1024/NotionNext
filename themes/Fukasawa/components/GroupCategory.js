import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

function GroupCategory ({ currentCategory, categories }) {
  return <>
    <div id='category-list' className='dark:border-gray-600 flex flex-wrap'>
      {Object.keys(categories).map(category => {
        const selected = currentCategory === category
        return <Link key={category} href={`/category/${category}`} passHref>
          <a className={(selected
            ? 'hover:text-white dark:hover:text-white bg-gray-600 text-white '
            : 'dark:text-gray-400 text-gray-500 hover:text-white hover:bg-gray-500 dark:hover:text-white') +
            '  text-sm w-full items-center duration-300 px-2  cursor-pointer py-1 font-light'}>
            <FontAwesomeIcon icon={selected ? faFolderOpen : faFolder} className={`${selected ? 'text-white' : 'text-gray-400'} mr-2`} />{category}({categories[category]})
            </a>
        </Link>
      })}
    </div>
  </>
}

export default GroupCategory
