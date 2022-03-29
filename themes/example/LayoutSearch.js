import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import SearchInput from './components/SearchInput'
import LayoutBase from './LayoutBase'

export const LayoutSearch = props => {
  const { keyword, posts } = props
  useEffect(() => {
    setTimeout(() => {
      const container = document.getElementById('container')
      if (container && container.innerHTML) {
        const re = new RegExp(`${keyword}`, 'gim')
        container.innerHTML = container.innerHTML.replace(re, `<span class='text-red-500 border-b border-dashed'>${keyword}</span>`)
      }
    }, 100)
  })

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
    <LayoutBase {...props}>
      <h2>Search - {keyword}</h2>
      <SearchInput {...props} />
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
