import React from 'react'
import Link from 'next/link'
import { useGlobal } from '@/lib/global'

/**
 * 展示文章推荐
 */
const RecommendPosts = ({ recommendPosts }) => {
  if (!recommendPosts || recommendPosts.length < 1) {
    return <></>
  }
  const { locale } = useGlobal()

  return (
    <div className="dark:text-gray-300 pt-2">
      <div className="mb-2 text-2xl">{locale.COMMON.RELATE_POSTS}</div>
        <ul className="list-disc pl-6 text-sm dark:bg-gray-900 bg-gray-100 p-2 my-2  border-l-4 border-yellow-500">
          {recommendPosts.map(post => (
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
