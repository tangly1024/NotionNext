import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useState } from 'react'
import LayoutBase from './LayoutBase'

export const LayoutTag = props => {
  const { tag, posts } = props
  const { locale } = useGlobal()

  const [page, updatePage] = useState(1)

  let hasMore = false
  const postsToShow = posts
    ? Object.assign(posts).slice(0, BLOG.POSTS_PER_PAGE * page)
    : []

  if (posts) {
    const totalCount = posts.length
    hasMore = page * BLOG.POSTS_PER_PAGE < totalCount
  }
  const handleGetMore = () => {
    if (!hasMore) return
    updatePage(page + 1)
  }

  return (
    <LayoutBase>
      Tag - {tag}
      {postsToShow.map(p => (
        <div key={p.id} className="border my-12">
          <Link href={`/article/${p.slug}`}>
            <a className="underline cursor-pointer">{p.title}</a>
          </Link>
          <div>{p.summary}</div>
        </div>
      ))}
      <div>
        <div
          onClick={handleGetMore}
          className="w-full my-4 py-4 text-center cursor-pointer "
        >
          {' '}
          {hasMore ? locale.COMMON.MORE : `${locale.COMMON.NO_MORE} 😰`}{' '}
        </div>
      </div>
    </LayoutBase>
  )
}
