import React from 'react'
import Link from 'next/link'
import { useGlobal } from '@/lib/global'

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
      post =>
        post &&
        post.tags &&
        post.tags.includes(currentTag) &&
        post.slug !== currentPost.slug
    )
  }
  shuffleSort(filteredPosts)

  // 筛选前5个
  if (filteredPosts.length > 5) {
    filteredPosts = filteredPosts.slice(0, 5)
  }

  const { locale } = useGlobal()

  return (
    <div className="dark:text-gray-300">
      <div className="mb-2 text-2xl">{locale.COMMON.RELATE_POSTS}</div>
        <ul className="list-disc pl-6 text-sm dark:bg-gray-900 bg-gray-100 p-2 my-2  border-l-4 border-yellow-500">
          {filteredPosts.map(post => (
            <li className="py-1" key={post.id}>
              <Link href={`/article/${post.slug}`}>
                <a className="cursor-pointer hover:text-blue-500 hover:underline">
                  {post.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
    </div>
  )
}
export default RecommendPosts
