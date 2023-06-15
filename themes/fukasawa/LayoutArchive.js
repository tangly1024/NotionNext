import { useEffect } from 'react'
import BlogArchiveItem from './components/BlogPostArchive'
import LayoutBase from './LayoutBase'

export const LayoutArchive = (props) => {
  const { archivePosts } = props

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
  return <LayoutBase {...props}>
      <div className="mb-10 pb-20 bg-white md:p-12 p-3 dark:bg-gray-800 shadow-md min-h-full">
        {Object.keys(archivePosts).map(archiveTitle => (
          <BlogArchiveItem
            key={archiveTitle}
            posts={archivePosts[archiveTitle]}
            archiveTitle={archiveTitle}
          />
        ))}
      </div>
  </LayoutBase>
}

export default LayoutArchive
