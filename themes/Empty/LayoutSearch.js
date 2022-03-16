import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import LayoutBase from './LayoutBase'

export const LayoutSearch = props => {
  const { keyword, posts } = props
  const router = useRouter()
  const currentSearch = keyword || router?.query?.s
  let handleTextColor = false
  useEffect(() => {
    setTimeout(() => {
      if (currentSearch && !handleTextColor) {
        const container = document.getElementById('container')
        if (container && container.innerHTML) {
          const re = new RegExp(`${currentSearch}`, 'gim')
          container.innerHTML = container.innerHTML.replace(
            re,
            `<span class='text-red-500 border-b border-dashed'>${currentSearch}</span>`
          )
          handleTextColor = true
        }
      }
    }, 100)
  })

  return (
    <LayoutBase {...props}>
      <h2>Search</h2>
      <div id="container">
        {posts.map(p => (
          <div key={p.id} className="border my-12">
            <Link href={`/article/${p.slug}`}>
              <a className="underline cursor-pointer">{p.title}</a>
            </Link>
            <div>{p.summary}</div>
          </div>
        ))}
      </div>
    </LayoutBase>
  )
}
