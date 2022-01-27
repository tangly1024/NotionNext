import CommonHead from '@/components/CommonHead'
import React from 'react'
import Footer from './components/Footer'
import InfoCard from './components/InfoCard'
import LogoBar from './components/LogoBar'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, meta } = props

  return (
    <div className='bg-white w-full h-full min-h-screen justify-center'>
      <CommonHead meta={meta}/>
      <main id="wrapper" className='max-w-7xl w-full h-full mx-auto'>
        <LogoBar/>
        <div className='pt-12 fixed top-24 w-80 pl-8 hidden lg:block'>
          <InfoCard/>
        </div>
        <div className='lg:ml-72 max-w-3xl w-full px-5'>
            {children}
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default LayoutBase
