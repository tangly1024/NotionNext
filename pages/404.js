/**
 * 自定义404界面
 * @returns {JSX.Element}
 * @constructor
 */
import { useEffect } from 'react'
import BaseLayout from '@/layouts/BaseLayout'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'

export default function Custom404 () {
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      router.push('/')
    }, 3000000)
  })

  return <BaseLayout meta={{ title: `${BLOG.title} | 页面找不到啦` }}>
    <div
      className='text-black w-full h-screen text-center justify-center content-center items-center flex flex-col'>
      <div>
        <h1 className='inline-block border-r-2 border-gray-600 mr-2 px-3 py-2 align-top'><i className='fa fa-spinner mr-2 animate-spin'/>404</h1>
        <div className='inline-block text-left h-32 leading-10 align-middle'>
          <h2 className='m-0 p-0'>页面找不到了，3秒后返回首页</h2></div>
      </div>
    </div>
  </BaseLayout>
}
