import Link from 'next/link'

const TagItemMini = ({ tag, selected = false, count }) => (
  <Link key={tag} href={selected ? '/' : `/tag/${encodeURIComponent(tag)}`}>
    <div className={`cursor-pointer inline-block border rounded hover:bg-gray-300 duration-200 
      mr-1 my-1 p-1 font-medium font-light text-xs whitespace-nowrap dark:text-gray-300 dark:hover:bg-gray-500
       ${selected
      ? 'text-white bg-black dark:hover:bg-gray-900 dark:bg-black dark:border-gray-800'
      : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-600'}` }>
    <div> <i className='fa fa-tag mr-1 py-0.5'/>{tag + (count ? `(${count})` : '')} </div>
    </div>
  </Link>
)

export default TagItemMini
