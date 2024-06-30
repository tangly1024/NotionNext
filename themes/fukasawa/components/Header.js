import Collapse from '@/components/Collapse'
import { useRef, useState } from 'react'
import Logo from './Logo'
import { MenuList } from './MenuList'
import SearchInput from './SearchInput'

/**
 * 顶部导航
 * @param {*} param0
 * @returns
 */
const Header = props => {
  const [isOpen, changeShow] = useState(false)
  const collapseRef = useRef(null)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  return (
    <div id='top-nav' className='z-40 block lg:hidden'>
      {/* 导航栏 */}
      <div
        id='sticky-nav'
        className={
          'relative w-full top-0 z-20 transform duration-500 bg-white dark:bg-black'
        }>
        <Collapse type='vertical' isOpen={isOpen} collapseRef={collapseRef}>
          <div className='py-1 px-5'>
            <MenuList
              {...props}
              onHeightChange={param =>
                collapseRef.current?.updateCollapseHeight(param)
              }
            />
            <SearchInput {...props} />
          </div>
        </Collapse>
        <div className='w-full flex justify-between items-center p-4 '>
          {/* 左侧LOGO 标题 */}
          <div className='flex flex-none flex-grow-0'>
            <Logo {...props} />
          </div>
          <div className='flex'></div>

          {/* 右侧功能 */}
          <div className='mr-1 flex justify-end items-center text-sm space-x-4 font-serif dark:text-gray-200'>
            <div
              onClick={toggleMenuOpen}
              className='cursor-pointer text-lg p-2'>
              {isOpen ? (
                <i className='fas fa-times' />
              ) : (
                <i className='fas fa-bars' />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
