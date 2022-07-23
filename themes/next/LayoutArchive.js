import React, { useEffect } from 'react'
import LayoutBase from './LayoutBase'
import BlogPostArchive from './components/BlogPostArchive'

export const LayoutArchive = (props) => {
  const { posts } = props
  // 深拷贝
  const postsSortByDate = Object.create(posts)

  // 时间排序
  postsSortByDate.sort((a, b) => {
    const dateA = new Date(a?.date?.start_date || a.createdTime)
    const dateB = new Date(b?.date?.start_date || b.createdTime)
    return dateB - dateA
  })

  const archivePosts = {}

  postsSortByDate.forEach(post => {
    const date = post.date?.start_date.slice(0, 7)
    if (archivePosts[date]) {
      archivePosts[date].push(post)
    } else {
      archivePosts[date] = [post]
    }
  })

  useEffect(() => {
    const anchor = window.location.hash
    if (anchor) {
      setTimeout(() => {
        const anchorElement = document.getElementById(anchor.substring(1))
        if (anchorElement) {
          anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' })
        }
      }, 300)
    }
  }, [])

  return (
    <LayoutBase {...props}>
      <div className="mb-10 pb-20 bg-white md:p-12 p-3 dark:bg-gray-800 shadow-md min-h-full">
        {Object.keys(archivePosts).map(archiveTitle => (
          <BlogPostArchive
            key={archiveTitle}
            posts={archivePosts[archiveTitle]}
            archiveTitle={archiveTitle}
          />
        ))}
      </div>
    </LayoutBase>
  )
}
