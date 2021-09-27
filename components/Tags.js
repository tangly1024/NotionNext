import Link from 'next/link'

const Tags = ({ tags, currentTag }) => {
  if (!tags) return <></>
  return (
      <ul className='flex flex-wrap py-1 max-w-full overflow-x-auto'>
        {Object.keys(tags).map(key => {
          const selected = key === currentTag
          return (
            <Link key={key} href={`/tag/${encodeURIComponent(key)}`}>
              <li
                className={`cursor-pointer hover:bg-gray-600 rounded-sm hover:text-white duration-200 mr-1 my-1 px-2 py-1 font-medium text-xs whitespace-nowrap
                 dark:text-gray-300 dark:hover:bg-gray-600 ${selected ? 'text-white bg-black dark:border-gray-600' : 'bg-gray-200 text-gray-600 dark:bg-gray-900 dark:border-gray-600'
                }`}
              >
                <a>
                  {`${key} (${tags[key]})`}
                </a>
              </li>
            </Link>
          )
        })}
      </ul>
  )
}

export default Tags
