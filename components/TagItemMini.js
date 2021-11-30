import Link from 'next/link'

const TagItemMini = ({ tag, selected = false }) => {
  return <Link key={tag} href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}>
    <div className={`cursor-pointer inline-block border rounded hover:bg-gray-500 shadow-card
      mr-2 my-1 p-1 font-medium font-light text-xs whitespace-nowrap dark:text-gray-300
       ${selected
      ? 'text-white bg-black dark:bg-black dark:border-gray-600 dark:hover:bg-gray-900 border-gray-800'
      : `text-gray-500 hover:shadow-xl hover:text-white border-gray-500 dark:hover:bg-gray-600 dark:border-gray-600 bg-${tag.color}-50 bg-gray-50 dark:bg-${tag.color}-700 dark:bg-gray-600 `}` }>
    <div> <i className='fa fa-tag mr-2 py-0.5'/>{tag.name + (tag.count ? `(${tag.count})` : '')} </div>
    </div>
  </Link>
}

export default TagItemMini
