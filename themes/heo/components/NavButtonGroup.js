import Link from 'next/link'

/**
 * 首页导航大按钮组件
 * @param {*} props
 * @returns
 */
const NavButtonGroup = (props) => {
  const { categoryOptions } = props
  if (!categoryOptions || categoryOptions.length === 0) {
    return <></>
  }

  return (
    <nav id='home-nav-button' className={'w-full z-10 md:h-72 md:mt-6 xl:mt-32 px-5 py-2 mt-8 flex flex-wrap md:max-w-5xl space-y-2 md:space-y-1 md:flex justify-center max-h-80 overflow-auto'}>
      {categoryOptions?.map(category => {
        return (
          <Link
            key={`${category.name}`}
            title={`${category.name}`}
            href={`/category/${category.name}`}
            passHref
            className='text-center w-full sm:w-4/5 md:mx-6 md:w-40 md:h-14 lg:h-20 h-14 justify-center items-center flex border-2 cursor-pointer rounded-lg glassmorphism hover:bg-white hover:text-black duration-200 font-bold hover:scale-105 transform'>
                {category.name}
            </Link>
        )
      })}
    </nav>
  )
}
export default NavButtonGroup
