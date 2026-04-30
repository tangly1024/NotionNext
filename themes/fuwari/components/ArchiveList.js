import SmartLink from '@/components/SmartLink'

const toMonthAnchor = month => `archive-${String(month).replace(/[^0-9a-zA-Z_-]/g, '-')}`

const ArchiveList = ({ archivePosts = {} }) => {
  return (
    <div className='space-y-6'>
      {Object.keys(archivePosts).map(month => (
        <section key={month} id={toMonthAnchor(month)} className='fuwari-card p-5 scroll-mt-24'>
          <h2 className='fuwari-section-title text-xl font-semibold mb-3'>{month}</h2>
          <div className='grid gap-3'>
            {archivePosts[month]?.map(post => (
              <SmartLink
                key={post.id}
                href={post.href || `/${post.slug}`}
                className='flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[var(--fuwari-border)] pb-3 gap-2'>
                <span className='text-base font-medium hover:text-[var(--fuwari-primary)] transition-colors'>{post.title}</span>
                <span className='text-sm text-[var(--fuwari-muted)] mt-1 sm:mt-0'>
                  {post.publishDay}
                </span>
              </SmartLink>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default ArchiveList

