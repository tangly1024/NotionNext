import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { IconArrowRight } from '@tabler/icons-react'

/**
 * BlogPostCard Component - Minimalist Light Industrial
 * Post card with clean design
 */
export const BlogPostCard = ({ post, showSummary = true }) => {
  const showPreview = siteConfig('ENDSPACE_POST_LIST_PREVIEW', true, CONFIG)
  const showCover = siteConfig('ENDSPACE_POST_LIST_COVER', true, CONFIG)
  const hasCover = showCover && post.pageCoverThumbnail

  return (
    <SmartLink href={`/${post.slug}`}>
      <article className={`endspace-frame group mb-6 flex flex-col overflow-hidden relative transition-all duration-300`}>
        
        {/* Cover Image - Top (Full Width) */}
        {hasCover && (
          <div className="w-full aspect-video flex-shrink-0 relative overflow-hidden z-10 bg-black/5">
            <img
              src={post.pageCoverThumbnail}
              alt={post.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            {/* Minimalist marker overlay */}
            <div className="absolute top-3 right-3 w-2 h-2 bg-[var(--endspace-accent-yellow)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Content - Bottom */}
        <div className={`flex-1 flex flex-col justify-center relative z-10 p-5 md:p-6 overflow-hidden`}>
          
          {/* Hover Effect: Yellow Swoosh Background (Now confined to text area) */}
          <div className="absolute inset-0 bg-[#FBFB45] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
          
          {/* Hover Effect: Horizontal Black Bar (Top of text area) */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

          {/* Wrapper for content to ensure it sits above the yellow background */}
          <div className="relative z-10">
          
          {/* Top Meta */}
          <div className="flex items-center gap-3 text-xs font-mono text-[var(--endspace-text-muted)] mb-3 group-hover:text-black/60 transition-colors">
             <span className="text-[var(--endspace-text-primary)] font-bold group-hover:text-black transition-colors">
                 {post.publishDay}
             </span>
             <span className="w-px h-3 bg-[var(--endspace-border-base)] group-hover:bg-black/30 transition-colors" />
             {post.category && (
                <span className="tracking-wider">{post.category.toUpperCase()}</span>
             )}
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-black text-[var(--endspace-text-primary)] mb-4 leading-tight group-hover:text-black transition-colors">
            {post.title}
          </h2>

          {/* Summary */}
          {showSummary && showPreview && post.summary && (
            <p className="text-[var(--endspace-text-secondary)] text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-6 font-medium group-hover:text-black/70 transition-colors">
              {post.summary}
            </p>
          )}

          {/* Footer / Read More */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex gap-2">
                {post.tags?.slice(0,3).map(tag => (
                    <span key={tag} className="text-[10px] text-[var(--endspace-text-muted)] bg-[var(--endspace-bg-secondary)] px-1.5 py-0.5 rounded group-hover:bg-black group-hover:text-white transition-colors">
                        #{tag}
                    </span>
                ))}
            </div>
            
            <div className="flex items-center gap-2 text-[var(--endspace-text-primary)] text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all group-hover:text-black">
                <span>Access</span>
                <IconArrowRight size={12} stroke={2} className="group-hover:translate-x-1 transition-transform group-hover:text-black" />
            </div>
          </div>
          </div> {/* End relative z-10 wrapper */}
        </div>
      </article>
    </SmartLink>
  )
}
