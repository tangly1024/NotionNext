import Link from 'next/link'

export default function CategoryItem({ selected, category, categoryCount }) {
  return (
    <Link
      href={`/category/${category}`}
      passHref
      className={
        (selected
          ? ' bg-gray-600 text-white '
          : 'dark:text-gray-400 text-gray-500 ') +
        ' flex text-sm items-center duration-300 cursor-pointer py-1 font-light px-2 whitespace-nowrap'
      }>
      <div>
        <i
          className={`mr-2 fas ${selected ? 'fa-folder-open' : 'fa-folder'}`}
        />
        {category} {categoryCount && `(${categoryCount})`}
      </div>
    </Link>
  )
}
