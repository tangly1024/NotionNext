import Link from 'next/link'

/**
 * 标签组
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
const Tags = ({ tags, currentTag }) => {
  if (!tags) return <></>
  return (<div className='bg-white dark:bg-gray-800 flex overflow-x-auto'>
      <ul id='tag-container' className='px-20 flex py-1 space-x-3'>
        {Object.keys(tags).map(key => {
          const selected = key === currentTag
          return (
            <Link key={key} href={selected ? '/' : `/tag/${encodeURIComponent(key)}`}>
              <li
                className={`cursor-pointer border hover:bg-gray-300 rounded-xl duration-200 mr-1 my-1 px-2 py-1 font-medium font-light text-sm whitespace-nowrap
                 dark:text-gray-300 dark:hover:bg-gray-800 ${selected ? 'text-white bg-black dark:hover:bg-gray-900 dark:bg-black dark:border-gray-800' : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:border-gray-600'
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
    </div>
  )
}

export default Tags
