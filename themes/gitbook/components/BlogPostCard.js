import BLOG from '@/blog.config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const BlogPostCard = ({ post, className }) => {
  const router = useRouter()
  const currentSelected = router.asPath.split('?')[0] === '/' + post.slug
  return (
        <div key={post.id} className="py-0.5">
            <div className="flex flex-col w-full">
                <Link
                    href={`${BLOG.SUB_PATH}/${post.slug}`}
                    passHref
                    className={
                        `${className} ${currentSelected ? 'bg-gray-500 text-white font-bold' : 'text-gray-700 dark:text-gray-300 '} pl-1 hover:font-bold py-0.5 cursor-pointer`
                    }>
                    <div>
                        {post.title}
                    </div>

                </Link>
            </div>
        </div>
  )
}

export default BlogPostCard
