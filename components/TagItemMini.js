import Link from 'next/link'

const TagItemMini = ({ tag, selected = false, count }) => (
  <Link key={tag} href={selected ? '/' : `/tag/${encodeURIComponent(tag)}`}>
    <span
      className={`cursor-pointer inline-block border hover:bg-gray-300 duration-200 mr-1 my-1 p-1 font-medium font-light text-xs whitespace-nowrap
                   dark:text-gray-300 dark:hover:bg-gray-800 ${selected ? 'text-white bg-black dark:hover:bg-gray-900 dark:bg-black dark:border-gray-800' : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:border-gray-600'
      }`}
    >
                  <a> {tag + (count ? `(${count})` : '')} </a>
                </span>
  </Link>
)

export default TagItemMini
