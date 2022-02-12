import { faFolder, faFolderOpen, faTag, faTh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

const CategoryGroup = ({ currentCategory, categories }) => {
  if (!categories) {
    return <></>
  }
  return <div id='category-list' className='pt-4'>
    <div className='mb-2'><FontAwesomeIcon icon={faTh} className='mr-2' />分类</div>
    <div className='flex flex-wrap'>
      {Object.keys(categories).map(category => {
        const selected = currentCategory === category
        return <Link key={category} href={`/category/${category}`} passHref>
          <a className={(selected
            ? 'hover:text-white dark:hover:text-white bg-gray-600 text-white '
            : 'dark:text-gray-400 text-gray-500 hover:text-white dark:hover:text-white hover:bg-gray-600') +
          '  text-sm items-center duration-300 cursor-pointer py-1 font-light px-2 whitespace-nowrap'}>
            <div><FontAwesomeIcon icon={selected ? faFolderOpen : faFolder}
                                  className={'mr-2'} />{category}({categories[category]})
            </div>
          </a>
        </Link>
      })}
    </div>
  </div>
}

export default CategoryGroup
