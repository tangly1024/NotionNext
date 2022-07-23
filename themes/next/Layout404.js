import { useRouter } from 'next/router'
import LayoutBase from './LayoutBase'
import { useEffect } from 'react'
import { isBrowser } from '@/lib/utils'

export const Layout404 = props => {
  const router = useRouter()
  useEffect(() => {
    // 延时3秒如果加载失败就返回首页
    setTimeout(() => {
      const article = isBrowser() && document.getElementById('container')
      if (!article) {
        router.push('/').then(() => {
          // console.log('找不到页面', router.asPath)
        })
      }
    }, 3000)
  }, [])

  return <LayoutBase {...props}>
    <div
      className='md:-mt-20 text-black w-full h-screen text-center justify-center content-center items-center flex flex-col'>
      <div className='dark:text-gray-200'>
        <h2 className='inline-block border-r-2 border-gray-600 mr-2 px-3 py-2 align-top'><i className='mr-2 fas fa-spinner animate-spin' />404</h2>
        <div className='inline-block text-left h-32 leading-10 items-center'>
          <h2 className='m-0 p-0'>页面无法加载，即将返回首页</h2>
        </div>
      </div>
    </div>
  </LayoutBase>
}
