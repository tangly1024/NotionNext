import CommonHead from '@/components/CommonHead'

import Footer from './components/Footer'
import SideRight from './components/SideRight'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = (props) => {
  const { children, headerSlot, meta } = props

  return (<div className='bg-white'>
    <CommonHead meta={meta} />

    {headerSlot}

    <main id='wrapper' className='flex w-full justify-center py-8 min-h-screen'>

      <div id='container-inner' className='w-full mx-auto flex justify-between max-w-6xl'>
        {children}
        <SideRight {...props}/>
      </div>

    </main>

    <Footer title={meta.title}/>

  </div>)
}

export default LayoutBase
