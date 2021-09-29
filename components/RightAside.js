import React, { useState } from 'react'
import TocBar from '@/components/TocBar'
import throttle from 'lodash.throttle'
import ShareButton from '@/components/ShareButton'
import TopJumper from '@/components/TopJumper'

const RightAside = ({ toc, post }) => {
  // 无目录就直接返回空
  if (toc.length < 1) return <></>
  // 监听滚动事件
  React.useEffect(() => {
    window.addEventListener('resize', resizeWindowHideToc)
    return () => {
      window.removeEventListener('resize', resizeWindowHideToc)
    }
  }, [])

  const resizeWindowHideToc = throttle(() => {
    if (window.innerWidth > 1300) {
      changeHideAside(false)
    } else {
      changeHideAside(true)
    }
  }, 500)
  const [hideAside, changeHideAside] = useState(true)

  return <aside className='dark:bg-gray-800'>
    {/* 上方菜单组 */}
    <div
      className={(hideAside ? 'right-0' : 'right-48') + ' z-20 space-x-2 fixed flex top-0 px-3 py-1 duration-500'}>
      {/* 目录按钮 */}
      <div
        className='border dark:border-gray-500 my-2 bg-white dark:bg-gray-600 bg-opacity-70 dark:hover:bg-gray-100 text-xl cursor-pointer dark:text-gray-300 dark:hover:text-black p-1'>
        <i className='fa fa-book p-2.5 hover:scale-125 transform duration-200'
           onClick={() => changeHideAside(!hideAside)} />
      </div>
    </div>

    {/* 下方菜单组 */}
    <div
      className={(hideAside ? 'right-0' : 'right-48') + ' space-x-2 fixed flex bottom-20 px-4 py-1 duration-500'}>
      <div className='flex-wrap'>
        {/* 分享按钮 */}
        <ShareButton post={post} />
        {/* 跳回顶部 */}
        <TopJumper />
      </div>
    </div>

    {/* 目录 */}
    <section
      className={(hideAside ? '-mr-48' : 'mr-0 shadow-xl xl:shadow-none') + ' md:static top-0 fixed h-full w-48 right-0 dark:bg-gray-800 duration-500 top-0'}>
      <div className='sticky top-0'>
      <TocBar toc={toc} />
      </div>

    </section>

  </aside>
}
export default RightAside
