/**
 * 自定义404界面
 * @returns {JSX.Element}
 * @constructor
 */
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Custom404 () {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = '/'
    }, 3000)
  })

  return <div
    className='text-black bg-white h-screen text-center justify-center content-center items-center flex flex-col'>
    <div>
      <h1 className='inline-block border-r-2 border-gray-600 mr-2 px-3 py-2 align-top'>404</h1>
      <div className='inline-block text-left h-32 leading-10 align-middle'>
        <h2 className='m-0 p-0'>页面丢失了，3秒后返回首页</h2></div>
    </div>
  </div>
}
