import SmartLink from '@/components/SmartLink'

/**
 * BlogListArchive Component - System Log Style
 * Archive list with Endfield aesthetic
 */
export const BlogListArchive = ({ archiveTitle, archivePosts }) => {
  return (
    <div className="mb-16">
      {/* Year/Month Header - Technical Block */}
      <div className="flex items-end gap-3 mb-8 pb-2 border-b border-[var(--endspace-border-base)] relative">
        <div className="text-6xl font-black text-[var(--endspace-text-muted)] opacity-20 absolute -top-4 -left-2 select-none z-0">
          LOG_{archiveTitle.split('-')[0]}
        </div>
        <h2 className="text-3xl font-bold text-black tech-text z-10 relative pl-2">
          {archiveTitle}
        </h2>
        <span className="text-xs text-[var(--endspace-text-secondary)] mb-2 tech-text z-10">
          // {archivePosts[archiveTitle]?.length}_ENTRIES_FOUND
        </span>
        <div className="flex-1" />
        <div className="text-xs text-black mb-2 tech-text">
          STATUS: ARCHIVED
        </div>
      </div>

      {/* Vertical Timeline Log */}
      <div className="relative pl-6 md:pl-10 space-y-2">
        {/* Vertical Line */}
        <div className="absolute left-2 md:left-4 top-0 bottom-0 w-px bg-[var(--endspace-border-base)]" />

        {archivePosts[archiveTitle]?.map((post) => (
          <div key={post.id} className="group relative">
            {/* Timeline Connector */}
            <div className="absolute left-[-1.5rem] md:left-[-2.5rem] top-1/2 -mt-px w-4 md:w-8 h-px bg-[var(--endspace-border-base)] group-hover:bg-[var(--endspace-accent-yellow)] transition-colors" />
            <div className="absolute left-[-1.7rem] md:left-[-2.7rem] top-1/2 -mt-1 w-2 h-2 rounded-full bg-[var(--endspace-bg-base)] border border-[var(--endspace-border-base)] group-hover:border-[var(--endspace-accent-yellow)] group-hover:bg-[var(--endspace-accent-yellow)] transition-all z-10" />

            <SmartLink href={`/${post.slug}`}>
              <div className="endspace-frame p-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-[#FBFB46] transition-all group">
                
                {/* Date Badge */}
                <div className="flex-shrink-0 flex items-center gap-2 text-xs tech-text text-[var(--endspace-text-secondary)] md:w-32 border-r border-[var(--endspace-border-base)] pr-4 group-hover:text-black group-hover:border-black/20 transition-colors">
                  <span className="text-[var(--endspace-accent-cyan)] opacity-70 group-hover:text-black group-hover:opacity-100 transition-colors">
                    [{post.publishDay || post.date?.start_date}]
                  </span>
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-bold text-black group-hover:text-black truncate transition-colors">
                    {post.title}
                  </h3>
                  {/* Tags as tiny indicators */}
                  {post.tags && post.tags.length > 0 && (
                     <div className="flex gap-2 mt-1">
                       {post.tags.slice(0,3).map(tag => (
                         <span key={tag} className="text-[10px] text-gray-500 group-hover:text-black transition-colors uppercase">
                           #{tag}
                         </span>
                       ))}
                     </div>
                  )}
                </div>

                {/* Arrow Action */}
                <div className="hidden md:block text-[var(--endspace-text-muted)] group-hover:text-black transition-transform group-hover:translate-x-1 font-mono text-xs">
                  &gt;&gt; LOG_ACCESS
                </div>
              </div>
            </SmartLink>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlogListArchive
