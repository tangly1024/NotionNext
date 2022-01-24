import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

const CategoryGroup = ({ currentCategory, categories }) => {
  if (!categories) {
    return <></>
  }
  return <>
    <div id='category-list' className='dark:border-gray-600 flex flex-wrap font-sans mx-4'>
      {Object.keys(categories).map(category => {
        const selected = currentCategory === category
        return <Link key={category} href={`/category/${category}`} passHref>
          <a className={(selected
            ? 'hover:text-white dark:hover:text-white bg-blue-600 text-white '
            : 'dark:text-gray-400 text-gray-500 hover:text-white dark:hover:text-white hover:bg-blue-600') +
            '  text-sm w-full items-center duration-300 px-2  cursor-pointer py-1 font-light'}>
              <div>            <FontAwesomeIcon icon={selected ? faFolderOpen : faFolder} className={'mr-2'} />{category}({categories[category]})</div>
            </a>
        </Link>
      })}
    </div>
  </>
}

export default CategoryGroup
