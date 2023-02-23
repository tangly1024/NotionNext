import Link from 'next/link'

const Tags = props => {
  const { tagOptions, tag } = props
  const currentTag = tag
  if (!tagOptions) return null
  return (
    <div className="tag-container">
      <ul className="flex max-w-full mt-4 overflow-x-auto">
        {Object.keys(tagOptions).map(key => {
          const tag = tagOptions[key]
          const selected = tag.name === currentTag
          return (
            <li
              key={tag.id}
              className={`mr-3 font-medium border whitespace-nowrap dark:text-gray-300 ${
                selected
                  ? 'text-white bg-black border-black dark:bg-gray-600 dark:border-gray-600'
                  : 'bg-gray-100 border-gray-100 text-gray-400 dark:bg-night dark:border-gray-800'
              }`}
            >
              <Link
                key={tag.id}
                href={selected ? '/search' : `/tag/${encodeURIComponent(tag.name)}`}
                className="px-4 py-2 block">

                {`${tag.name} (${tag.count})`}

              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Tags
