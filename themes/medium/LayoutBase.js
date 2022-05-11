import CommonHead from '@/components/CommonHead'
import React from 'react'
import Footer from './components/Footer'
import InfoCard from './components/InfoCard'
import RevolverMaps from './components/RevolverMaps'
import CONFIG_MEDIUM from './config_medium'
import Tabs from '@/components/Tabs'
import TopNavBar from './components/TopNavBar'
import SearchInput from './components/SearchInput'
import BottomMenuBar from './components/BottomMenuBar'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import Live2D from '@/components/Live2D'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, meta, showInfoCard = true, slotRight, slotTop } = props
  const { locale } = useGlobal()
  const router = useRouter()

  return (
    <div className='bg-white dark:bg-black w-full h-full min-h-screen justify-center dark:text-gray-300'>
      <CommonHead meta={meta} />
      <main id='wrapper' className='flex justify-between w-full h-full mx-auto'>
        {/* 桌面端左侧菜单 */}
        {/* <LeftMenuBar/> */}

        <div className='w-full'>
          {/* 移动端顶部菜单 */}
          <TopNavBar {...props}/>
          <div className='px-5 max-w-5xl justify-center mx-auto min-h-screen'>
            {slotTop}
            {children}
          </div>
        </div>

        {/* 桌面端右侧 */}
        <div className='hidden xl:block border-l dark:border-transparent w-96'>
         <div className='py-14 px-6 sticky top-0'>
          <Tabs>
            {slotRight}
            <div key={locale.NAV.ABOUT}>
              {router.pathname !== '/search' && <SearchInput className='mt-6  mb-12' />}
              {showInfoCard && <InfoCard {...props} />}
              {CONFIG_MEDIUM.WIDGET_REVOLVER_MAPS === 'true' && <RevolverMaps />}
            </div>
          </Tabs>
           <Live2D/>
         </div>
        </div>
      </main>

      <div className='fixed right-0 bottom-0 hidden md:block lg:mr-6 z-20'>

      </div>

      {/* 移动端底部 */}
      <Footer />
      <BottomMenuBar className='block md:hidden' />
    </div>
  )
}

export default LayoutBase
