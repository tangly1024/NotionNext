import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import SearchInput from './components/SearchInput'
import LayoutBase from './LayoutBase'
import { isBrowser } from '@/lib/utils'

export const LayoutSearch = props => {
  const { keyword, posts } = props
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      const container = isBrowser() && document.getElementById('container')
      if (container && container.innerHTML) {
        const re = new RegExp(`${keyword}`, 'gim')
        container.innerHTML = container.innerHTML.replace(re, `<span class='text-red-500 border-b border-dashed'>${keyword}</span>`)
      }
    }, 100)
  }, [router.events])

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
  useEffect(() => {
    setTimeout(() => {
      if (keyword) {
        const targets = document.getElementsByClassName('replace')
        for (const container of targets) {
          if (container && container.innerHTML) {
            const re = new RegExp(`${keyword}`, 'gim')
            container.innerHTML = container.innerHTML.replace(
              re,
              `<span class='text-red-500 border-b border-dashed'>${keyword}</span>`
            )
          }
        }
      }
    }, 100)
  }, [])

  return <LayoutBase {...props}>
        <div className='pb-12'>
            <SearchInput {...props} />
        </div>

        {postsToShow.map(p => (
            <article key={p.id} className="mb-12" >
                <h2 className="mb-4">
                    <Link href={`/article/${p.slug}`}>
                        <a className="text-black text-xl md:text-2xl no-underline hover:underline replace">  {p.title}</a>
                    </Link>
                </h2>

                <div className="mb-4 text-sm text-gray-700">
                    by <a href="#" className="text-gray-700">{BLOG.AUTHOR}</a> on {p.date?.start_date || p.createdTime}
                    <span className="font-bold mx-1"> | </span>
                    <a href="#" className="text-gray-700">{p.category}</a>
                    <span className="font-bold mx-1"> | </span>
                    {/* <a href="#" className="text-gray-700">2 Comments</a> */}
                </div>

                <p className="text-gray-700 leading-normal replace">
                    {p.summary}
                </p>
            </article>
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
}
