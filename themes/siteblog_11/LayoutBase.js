import CommonHead from '@/components/CommonHead'
import React from 'react'
import Footer from './components/Footer'
import { SideBar } from './components/SideBar'
import Tabs from '@/components/Tabs'
import TopNavBar from './components/TopNavBar'
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
  const { children, meta, slotRight, slotTop } = props
  const { locale } = useGlobal()
  const router = useRouter()

  return (
    <div className="bg-hexo-background-gray dark:bg-black">
      <CommonHead meta={meta} />

      {/* 移动端顶部菜单 */}
      <TopNavBar {...props} />
      <main
        id="wrapper"
        className="w-full h-full md:px-8 lg:px-24 min-h-screen"
      >
        {/* 桌面端左侧菜单 */}
        {/* <LeftMenuBar/> */}
        <div
          id="container-inner"
          className="pt-14 w-full mx-auto lg:flex lg:space-x-4 justify-center"
        >
          <div className="w-full max-w-4xl overflow-x-hidden">
            {slotTop}
            {children}
          </div>

          {/* 桌面端右侧 */}
          {/* <div className="hidden xl:block border-l dark:border-transparent w-96">
          <div className="py-14 px-6 sticky top-0"> */}
          <div>
            <Tabs>
              {slotRight}
              <div key={locale.NAV.ABOUT}>
                {/* {router.pathname !== '/search' && (
                  <SearchInput className="mt-6  mb-12" />
                )} */}
                {/* {showInfoCard && <InfoCard {...props} />} */}
                {/* {CONFIG_MEDIUM.WIDGET_REVOLVER_MAPS === 'true' && (
                  <RevolverMaps />
                )} */}
                <SideBar {...props} />
              </div>
            </Tabs>
            <Live2D />
          </div>
        </div>

        {/* </div>
        </div> */}
      </main>

      <div className="fixed right-0 bottom-0 hidden md:block lg:mr-6 z-20"></div>

      {/* 移动端底部 */}
      <Footer />
      <BottomMenuBar className="block md:hidden" />
    </div>
  )
}

export default LayoutBase
