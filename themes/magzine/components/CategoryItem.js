import Link from 'next/link'

export default function CategoryItem({ selected, category, categoryCount }) {
  return (
    <Link
      href={`/category/${category}`}
      passHref
      className={
        (selected
          ? 'bg-gray-600 text-white '
          : 'dark:text-gray-400 text-gray-900 ') +
        'text-sm font-semibold hover:underline flex text-md items-center duration-300 cursor-pointer py-1 whitespace-nowrap'
      }>
      <div>
        {category} {categoryCount && `(${categoryCount})`}
      </div>
    </Link>
  )
}
