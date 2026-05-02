import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ post, className = '', title = 'Announcement' }) => {
  if (!post?.blockMap) return null

  return (
    <section className={`fuwari-card ${className}`}>
      <h2 className='text-sm font-semibold mb-2 tracking-wide uppercase text-[var(--fuwari-muted)]'>
        {title}
      </h2>
      <div id='announcement-content' className='text-sm'>
        <NotionPage post={post} />
      </div>
    </section>
  )
}

export default Announcement

