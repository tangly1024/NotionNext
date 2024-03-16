import Link from 'next/link'

/**
 * 文章分类
 * @param {*} param0
 * @returns
 */
export default function CategoryItem({ category }) {
  return (
        <Link
            key={category.name}
            href={`/category/${category.name}`}
            passHref
            legacyBehavior>
            <div className={'text-2xl hover:text-black dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'}>
                <i className='mr-4 fas fa-folder' />{category.name}({category.count})
            </div>
        </Link>
  )
}
