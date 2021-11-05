import Link from 'next/link'

const TagItem = ({ tag }) => (
  <Link href={`/tag/${encodeURIComponent(tag)}`}>
    <div className="cursor-pointer hover:shadow hover:border-gray-600 rounded-md dark:border-gray-500 border hover:scale-105 hover:bg-gray-500 bg-gray-100 hover:text-white duration-200 mr-1 p-2 leading-none text-sm
      dark:bg-gray-500 dark:text-gray-100 dark:hover:bg-black">
     <div>  <i className='fa fa-tag mr-1 '/> {tag}</div>
    </div>
  </Link>
)

export default TagItem
