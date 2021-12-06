/**
 * 自定义404界面
 * @returns {JSX.Element}
 * @constructor
 */
import { useEffect } from 'react'
import BaseLayout from '@/layouts/BaseLayout'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function Custom404 () {
  const router = useRouter()
  useEffect(() => {
    // 延时3秒如果加载失败就返回首页
    setTimeout(() => {
      if (window) {
        const article = document.getElementById('article-wrapper')
        if (!article) {
          router.push('/')
        }
      }
    }, 3000)
  })

  return <BaseLayout meta={{ title: `${BLOG.title} | 页面找不到啦` }}>
    <div
      className='text-black w-full h-screen text-center justify-center content-center items-center flex flex-col'>
      <div className='dark:text-gray-200'>
        <h2 className='inline-block border-r-2 border-gray-600 mr-2 px-3 py-2 align-top'><FontAwesomeIcon icon={faSpinner} spin={true} className='mr-2'/>404</h2>
        <div className='inline-block text-left h-32 leading-10 align-middle'>
          <h2 className='m-0 p-0'>页面无法加载，即将返回首页</h2>
        </div>
      </div>
    </div>
  </BaseLayout>
}
