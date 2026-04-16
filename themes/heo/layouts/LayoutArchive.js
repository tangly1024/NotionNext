import dynamic from 'next/dynamic'
import CategoryBar from '../components/CategoryBar'

const BlogPostArchive = dynamic(() => import('../components/BlogPostArchive'))

const LayoutArchive = props => {
  const { archivePosts } = props

  return (
    <div className='p-5 rounded-xl border dark:border-gray-600 max-w-6xl w-full bg-white dark:bg-[#1e1e1e]'>
      <CategoryBar {...props} border={false} />
      <div className='px-3'>
        {Object.keys(archivePosts).map(archiveTitle => (
          <BlogPostArchive
            key={archiveTitle}
            posts={archivePosts[archiveTitle]}
            archiveTitle={archiveTitle}
          />
        ))}
      </div>
    </div>
  )
}

export default LayoutArchive
