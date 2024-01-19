import NavPostListEmpty from './NavPostListEmpty'
import Link from 'next/link'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const NavPostList = (props) => {
  const { categoryOptions } = props
  if (!categoryOptions) {
    return <NavPostListEmpty />
  } else {
    return <div id='category-list' className='dark:border-gray-700 flex flex-wrap  mx-4'>
            {categoryOptions?.map(category => {
              // const selected = currentCategory === category.name
              const selected = false
              return (
                    <Link
                        key={category.name}
                        href={`/category/${category.name}`}
                        passHref
                        className={(selected
                          ? 'hover:text-black dark:hover:text-gray bg-indigo-600 text-black '
                          : 'dark:text-gray-400 text-gray-500 hover:text-black dark:hover:text-white hover:bg-indigo-600') +
                            '  text-sm w-full items-center duration-300 px-2  cursor-pointer py-1 font-light'}>

                        <div> <i className={`mr-2 fas ${selected ? 'fa-folder-open' : 'fa-folder'}`} />{category.name}({category.count})</div>

                    </Link>
              )
            })}
        </div>
  }
}

export default NavPostList
