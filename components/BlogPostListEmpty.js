import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 空白博客 列表
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListEmpty = ({ currentSearch }) => {
  return <div className='min-h-screen flex justify-center mx-auto'>
    <div className='align-middle text-center my-auto'>
        <p className='text-gray-500 dark:text-gray-300'>没有找到文章 {(currentSearch && <div>{currentSearch}</div>)}</p>
      </div>
  </div>
}
export default BlogPostListEmpty
