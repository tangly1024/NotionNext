import React from 'react'
import Link from 'next/link'

/**
 * 洗牌乱序：从数组的最后位置开始，从前面随机一个位置，对两个数进行交换，直到循环完毕
 * @param arr
 * @returns {*}
 */
function shuffleSort (arr) {
  let i = arr.length - 1
  while (i > 0) {
    const rIndex = Math.floor(Math.random() * i)
    const temp = arr[rIndex]
    arr[rIndex] = arr[i]
    arr[i] = temp
    i--
  }
  return arr
}

const RecommendPosts = ({ currentPost, totalPosts }) => {
  let filteredPosts = totalPosts
  // 筛选同标签
  if (currentPost.tags && currentPost.tags.length) {
    const currentTag = currentPost.tags[0]
    filteredPosts = totalPosts.filter(
      post => post && post.tags && post.tags.includes(currentTag) && post.slug !== currentPost.slug
    )
  }
  shuffleSort(filteredPosts)

  // 筛选前5个
  if (filteredPosts.length > 5) {
    filteredPosts = filteredPosts.slice(0, 5)
  }

  return <div className='dark:text-gray-300'>
    <h2 className='text-3xl mb-2'>推荐文章</h2>
    <ul className='list-disc px-5'>
      {filteredPosts.map(post => (
        <li className='py-1' key={post.id} ><Link href={`/article/${post.slug}`}><a className='cursor-pointer hover:underline'>{post.title}</a></Link></li>
      ))}
    </ul>
  </div>
}
export default RecommendPosts
