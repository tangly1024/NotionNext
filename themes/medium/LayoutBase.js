import CommonHead from '@/components/CommonHead'
import { useState, createContext, useContext } from 'react'
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
import BLOG from '@/blog.config'
const ThemeGlobalMedium = createContext()

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, meta, showInfoCard = true, slotRight, slotTop, siteInfo } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const [tocVisible, changeTocVisible] = useState(false)

  return (
        <ThemeGlobalMedium.Provider value={{ tocVisible, changeTocVisible }}>
            <div className='bg-white dark:bg-hexo-black-gray w-full h-full min-h-screen justify-center dark:text-gray-300'>
                <CommonHead meta={meta} />

                <main id='wrapper' className={(BLOG.LAYOUT_SIDEBAR_REVERSE ? 'flex-row-reverse' : '') + 'relative flex justify-between w-full h-full mx-auto'}>
                    {/* 桌面端左侧菜单 */}
                    {/* <LeftMenuBar/> */}

                    <div id='container-inner' className='w-full relative z-10'>
                        {/* 移动端顶部菜单 */}
                        <TopNavBar {...props} />
                        <div className='px-7 max-w-5xl justify-center mx-auto min-h-screen'>
                            {slotTop}
                            {children}

                            {/* 回顶按钮 */}
                            <div
                              data-aos="fade-up"
                              data-aos-duration="300"
                              data-aos-easing="ease-in-out"
                              data-aos-once="false"
                              data-aos-anchor-placement="top-center"
                              className='fixed xl:right-80 right-2 mr-10 bottom-24 hidden lg:block z-20'>
                              <i className='fas fa-chevron-up cursor-pointer p-2 rounded-full border' onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }}/>
                            </div>
                        </div>

                        {/* 底部 */}
                        <Footer title={siteInfo?.title} />
                    </div>

                    {/* 桌面端右侧 */}
                    <div className={`hidden xl:block border-l dark:border-transparent w-96 relative z-10 ${CONFIG_MEDIUM.RIGHT_PANEL_DARK ? 'bg-hexo-black-gray dark' : ''}`}>
                        <div className='py-14 px-6 sticky top-0'>
                            <Tabs>
                                {slotRight}
                                <div key={locale.NAV.ABOUT}>
                                    {router.pathname !== '/search' && <SearchInput className='mt-6  mb-12' />}
                                    {showInfoCard && <InfoCard {...props} />}
                                    {CONFIG_MEDIUM.WIDGET_REVOLVER_MAPS === 'true' && <RevolverMaps />}
                                </div>
                            </Tabs>
                            <Live2D />
                        </div>
                    </div>
                </main>

                <BottomMenuBar {...props} className='block md:hidden' />
            </div>
        </ThemeGlobalMedium.Provider>
  )
}

export default LayoutBase
export const useMediumGlobal = () => useContext(ThemeGlobalMedium)
