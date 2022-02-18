import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faFolder } from '@fortawesome/free-solid-svg-icons'

export default function CategoryItem ({ selected, category, categoryCount }) {
  return <Link href={`/category/${category}`} passHref>
    <a className={(selected
      ? 'hover:text-white dark:hover:text-white bg-gray-600 text-white '
      : 'dark:text-gray-400 text-gray-500 hover:text-white dark:hover:text-white hover:bg-gray-600') +
    ' flex text-sm items-center duration-300 cursor-pointer py-1 font-light px-2 whitespace-nowrap'}>
      <div><FontAwesomeIcon icon={selected ? faFolderOpen : faFolder}
                            className={'mr-2'} />{category} {categoryCount && (categoryCount)}
      </div>
    </a>
  </Link>
}
