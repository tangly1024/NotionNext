import { faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'
import { useGlobal } from '@/lib/global'

const TagItem = ({ tag, selected }) => {
  const { locale } = useGlobal()
  if (!tag) {
    <>{locale.COMMON.NOTAG}</>
  }
  return (
  <Link href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`} passHref>
    <li
      className={`notion-${tag.color}_background list-none cursor-pointer hover:bg-gray-300 rounded-md 
      duration-200 mr-1 my-1 px-2 py-1 text-sm whitespace-nowrap
                  dark:hover:bg-gray-800 dark:hover:text-white hover:text-black
                 ${selected
         ? ' text-white dark:text-white bg-black dark:hover:bg-gray-900 dark:bg-black'
         : ' text-gray-600'}`}
    >
      <a>
        {selected && <FontAwesomeIcon icon={faTag} className='mr-1'/>} {`${tag.name} `} {tag.count ? `(${tag.count})` : ''}
      </a>
    </li>
  </Link>
  )
}

export default TagItem
