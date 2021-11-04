import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 空白博客 列表
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListEmpty = () => {
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      router.push('/').then(() => {
        console.log('空博客列表跳回首页')
      })
    }, 3000)
  })
  return <div className='w-full h-full flex justify-center mx-auto'>
      <div className='align-middle text-center my-auto'>
        <p className='text-gray-500 dark:text-gray-300'>没有文章了，3秒后返回首页</p>
      </div>
  </div>
}
export default BlogPostListEmpty
