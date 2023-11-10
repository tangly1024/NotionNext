import Link from 'next/link'
import { useGlobal } from '@/lib/global'

const TagItem = ({ tag, selected }) => {
  const { locale } = useGlobal()
  if (!tag) {
    <div> { locale.COMMON.NOTAG } </div>
  }
  return (
    <Link
      href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}
      passHref
      legacyBehavior>
      <li
        className={`notion-${tag.color}_background dark:bg-gray-700 list-none cursor-pointer rounded-md  
        duration-200 mr-1 my-1 px-2 py-1 text-sm whitespace-nowrap 
         hover:bg-gray-200 dark:hover:bg-gray-800 `}>
        <div className='text-gray-600 dark:text-gray-300 dark:hover:text-white'>
          {selected && <i className='mr-1 fas fa-tag'/>} {`${tag.name} `} {tag.count ? `(${tag.count})` : ''}
        </div>
      </li>
    </Link>
  );
}

export default TagItem
