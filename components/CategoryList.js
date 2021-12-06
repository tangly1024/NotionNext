import Link from 'next/link'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFolderOpen, faThList } from '@fortawesome/free-solid-svg-icons'
import { useGlobal } from '@/lib/global'

const CategoryList = ({ currentCategory, categories }) => {
  if (!categories) {
    return <></>
  }
  const { locale } = useGlobal()

  return <ul className='flex py-1 space-x-3'>
    <li className='w-16 py-2 dark:text-gray-200'><FontAwesomeIcon className='mr-2' icon={faThList} />{locale.COMMON.CATEGORY}</li>
    {Object.keys(categories).map(category => {
      const selected = category === currentCategory
      return (
        <Link key={category} href={`/category/${category}`} passHref>
          <li
            className={`cursor-pointer border rounded-xl duration-200 mr-1 my-1 px-2 py-1 font-medium font-light text-sm whitespace-nowrap dark:text-gray-300 
                 ${selected
                ? 'text-white bg-black dark:hover:bg-gray-900 dark:bg-black dark:border-gray-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 dark:bg-gray-600 dark:border-gray-600'
              }`}
          >
            <a>
            <FontAwesomeIcon icon={selected ? faFolderOpen : faFolder} className='mr-1' />
              {`${category} `}
            </a>
          </li>
        </Link>)
    })}
  </ul>
}

export default CategoryList
