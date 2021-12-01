import Link from 'next/link'
import React from 'react'

const TagItem = ({ tag, selected }) => {
  return (
  <Link href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}>
    <li
      className={`notion-${tag.color}_background list-none cursor-pointer hover:bg-gray-300 rounded-xl 
      duration-200 mr-1 my-1 px-2 py-1 font-medium font-light text-sm whitespace-nowrap
                  dark:hover:bg-gray-800 dark:hover:text-white hover:text-black
                 ${selected
         ? ' text-white dark:text-white bg-black dark:hover:bg-gray-900 dark:bg-black'
         : ' text-gray-600'}`}
    >
      <a>
        <i className='fa fa-tag mr-1'/>
        {`${tag.name} `} {tag.count ? `(${tag.count})` : ''}
      </a>
    </li>
  </Link>
  )
}

export default TagItem
