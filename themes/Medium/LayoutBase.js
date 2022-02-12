import CommonHead from '@/components/CommonHead'
import React from 'react'
import Footer from './components/Footer'
import InfoCard from './components/InfoCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RevolverMaps from './components/RevolverMaps'
import CONFIG_MEDIUM from './config_medium'
import Tabs from '@/components/Tabs'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import TopNavBar from './components/TopNavBar'
import Link from 'next/link'
import SearchInput from './components/SearchInput'
import { useRouter } from 'next/router'
import BottomMenuBar from './components/BottomMenuBar'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, meta, showInfoCard = true, slotRight } = props

  return (
    <div id='container' className='bg-white w-full h-full min-h-screen justify-center'>
      <CommonHead meta={meta} />
      <main id='wrapper' className='flex justify-between w-full h-full mx-auto'>

        {/* 桌面端左侧菜单 */}
        <div className='w-20  border-r hidden lg:block pt-12'>
          <section>
            <Link href='/'>
              <div className='text-center cursor-pointer  hover:text-black'>
                <FontAwesomeIcon icon={faHome} size='lg' color='gray' />
              </div>
            </Link>
          </section>
        </div>

        <div className='w-full justify-center'>
          {/* 移动端顶部菜单 */}
          <TopNavBar className='block lg:hidden' />
          <div className='px-5'>
            {children}
          </div>
        </div>

        {/* 桌面端右侧 */}
        <div className='hidden xl:block border-l w-96'>
          <Tabs className='py-14 px-6 sticky top-0'>
            {slotRight && <div key='Article' className='mt-6'>{slotRight} </div>}
            <div key='About'>
              <SearchInput className='mt-6  mb-12' />
              {showInfoCard && <InfoCard />}
              {CONFIG_MEDIUM.WIDGET_REVOLVER_MAPS === 'true' && <RevolverMaps />}
            </div>
          </Tabs>
        </div>
      </main>

      {/* 移动端底部 */}
      <BottomMenuBar className='block md:hidden'/>
      <Footer/>
    </div>
  )
}

export default LayoutBase
