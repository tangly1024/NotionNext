import Link from 'next/link'

const TagItemMini = ({ tag, selected = false }) => {
  return (
    <Link
      key={tag}
      href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}
      className={` rounded hover:text-white hover:bg-green-500 text-black dark:text-white dark:bg-gray-800 py-0.5 px-1 `}
      passHref>
      {/* # {tag.name} */}
      <span className='flex flex-nowrap cursor-pointer'>
        # <span>{tag.name}</span>{' '}
        <span className='h-full flex items-start text-xs ml-1'>
          {tag.count ? `${tag.count}` : ''}
        </span>
      </span>
    </Link>
  )
}

export default TagItemMini
