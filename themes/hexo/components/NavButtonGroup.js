
import React from 'react'
import Link from 'next/link'

/**
 * 首页导航大按钮组件
 * @param {*} props
 * @returns
 */
const NavButtonGroup = (props) => {
  const { categories } = props

  return <nav id='home-nav-button' className={'py-5 md:mt-24 mt-12 flex md:max-w-3xl md:space-x-12 md:flex justify-center'}>
    {categories.map(category => {
      return <Link key={`${category.name}`} title={`${category.name}`} href={`/category/${category.name}`} passHref>
            <a className='text-center w-full md:w-40 md:h-20 h-14 mr-4 mb-4 justify-center items-center flex border-white border-2 cursor-pointer rounded-lg font-serif hover:bg-white hover:text-black duration-200 font-bold hover:scale-110 transform'>{category.name}</a>
        </Link>
    })}
  </nav>
}
export default NavButtonGroup
