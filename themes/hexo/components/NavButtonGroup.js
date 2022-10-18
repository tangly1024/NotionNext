
import React from 'react'
import Link from 'next/link'

/**
 * 首页导航大按钮组件
 * @param {*} props
 * @returns
 */
const NavButtonGroup = (props) => {
  const { categories } = props

  return <nav id='home-nav-button' style={{ lineHeight: '100px' }} className={'md:h-52 md:mt-32 px-5 mt-12 flex flex-wrap m-0 md:max-w-5xl md:space-x-12 space-y-2 md:space-y-0 md:flex justify-center'}>
    {categories.map(category => {
      return <Link key={`${category.name}`} title={`${category.name}`} href={`/category/${category.name}`} passHref>
            <a className='text-center w-full md:w-40 md:h-20 h-14 justify-center items-center flex border-white border-2 cursor-pointer rounded-lg font-serif hover:bg-white hover:text-black duration-200 font-bold hover:scale-110 transform'>{category.name}</a>
        </Link>
    })}
  </nav>
}
export default NavButtonGroup
