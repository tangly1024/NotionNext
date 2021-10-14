import Link from 'next/link'

/**
 * 标签组
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
const TagList = ({ tags, currentTag }) => {
  if (!tags) return <></>
  return (
    <div id='tags-list' className='duration-500 dark:border-gray-600 dark:bg-gray-800 w-52 pt-2'>
        {Object.keys(tags).map(key => {
          const selected = key === currentTag
          return (
            <Link key={key} href={selected ? '/' : `/tag/${encodeURIComponent(key)}`}>
              <span
                className={`cursor-pointer inline-block border hover:bg-gray-300 duration-200 mr-1 my-1 p-1 font-medium font-light text-xs whitespace-nowrap
                 dark:text-gray-300 dark:hover:bg-gray-800 ${selected ? 'text-white bg-black dark:hover:bg-gray-900 dark:bg-black dark:border-gray-800' : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:border-gray-600'
                }`}
              >
                <a>
                  {`${key} (${tags[key]})`}
                </a>
              </span>
            </Link>
          )
        })}
    </div>
  )
}

export default TagList
