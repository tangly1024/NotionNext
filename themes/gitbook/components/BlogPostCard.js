import BLOG from '@/blog.config'
import Link from 'next/link'
import React from 'react'

const BlogPostCard = ({ post, showSummary }) => {
  return (
        <div
            key={post.id}
            className="mb-6"
        >

            <div className="flex flex-col w-full">
                <Link
                    href={`${BLOG.SUB_PATH}/${post.slug}`}
                    passHref
                    className={
                        'cursor-pointer font-bold  hover:underline leading-tight text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400'
                    }>
                    <div>
                        {post.category} -   {post.title}
                    </div>

                </Link>

            </div>
        </div>
  )
}

export default BlogPostCard
