import Link from 'next/link'

const TagItem = ({ tag }) => (
  <Link href={`/tag/${encodeURIComponent(tag)}`}>
    <p className='cursor-pointer hover:bg-gray-50 dark:hover:bg-hexo-black-gray mr-1 rounded-full px-2 py-1 border leading-none text-sm dark:border-gray-600'>
      {tag}
    </p>
  </Link>
)

export default TagItem
