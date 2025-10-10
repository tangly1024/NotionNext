import SmartLink from '@/components/SmartLink'

/**
 * 首页导航大按钮组件
 * @param {*} props
 * @returns
 */
const NavButtonGroup = (props) => {
  const { categories } = props
  if (!categories || categories.length === 0) {
    return <></>
  }

  return (
    <nav id='home-nav-button' className={'md:h-52 md:mt-6 xl:mt-32 px-5 py-2 mt-8 flex flex-wrap md:max-w-5xl space-y-2 md:space-y-0 md:flex justify-center max-h-80 overflow-auto'}>
      {categories.map(category => {
        return (
          <SmartLink
            key={`${category.name}`}
            title={`${category.name}`}
            href={`/category/${category.name}`}
            passHref
            className='text-center w-full md:mx-6 md:w-40 md:h-14 lg:h-20 h-14 justify-center items-center flex border-2 cursor-pointer rounded-lg glassmorphism hover:bg-white hover:text-black duration-200 font-bold hover:scale-110 transform'>
                {category.name}
            </SmartLink>
        )
      })}
    </nav>
  )
}
export default NavButtonGroup
