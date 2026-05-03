'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * Endspace Theme - Previous/Next Article Navigation
 * Tech industrial style with sharp corners and scan lines
 * @param {prev, next} param0
 * @returns
 */
export default function ArticleAdjacent({ prev, next }) {
  if (!siteConfig('ENDSPACE_ARTICLE_ADJACENT', true, CONFIG)) {
    return null
  }

  // If both are empty, don't show
  if (!prev && !next) {
    return null
  }

  return (
    <section className="my-8">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 bg-[var(--endspace-accent-yellow)]" />
        <span className="tech-text text-xs text-[var(--endspace-text-muted)]">
          NAVIGATION // Related Articles
        </span>
        <div className="flex-1 h-px bg-[var(--endspace-border-base)]" />
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Article */}
        {prev ? (
          <SmartLink
            href={`/${prev.slug}`}
            className="group endspace-frame p-5 flex flex-col justify-between min-h-[100px] hover:border-[var(--endspace-accent-yellow)] transition-all duration-300"
          >
            {/* Direction Label */}
            <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-chevron-left text-[var(--endspace-accent-cyan)] text-xs" />
              <span className="tech-text text-xs text-[var(--endspace-text-muted)]">
                PREV_POST
              </span>
            </div>
            
            {/* Title */}
            <div className="text-[var(--endspace-text-primary)] font-semibold line-clamp-2 transition-colors">
              {prev.title}
            </div>

            {/* Scan Line Effect -> Strong Yellow Line */}
            <div className="mt-3 h-1 bg-[var(--endspace-accent-yellow)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </SmartLink>
        ) : (
          <div className="endspace-frame p-5 flex items-center justify-center min-h-[100px] opacity-40">
            <span className="tech-text text-xs text-[var(--endspace-text-muted)]">
              // NO_PREV_ARTICLE
            </span>
          </div>
        )}

        {/* Next Article */}
        {next ? (
          <SmartLink
            href={`/${next.slug}`}
            className="group endspace-frame p-5 flex flex-col justify-between min-h-[100px] hover:border-[var(--endspace-accent-yellow)] transition-all duration-300"
          >
            {/* Direction Label */}
            <div className="flex items-center justify-end gap-2 mb-3">
              <span className="tech-text text-xs text-[var(--endspace-text-muted)]">
                NEXT_POST
              </span>
              <i className="fas fa-chevron-right text-[var(--endspace-accent-cyan)] text-xs" />
            </div>
            
            {/* Title */}
            <div className="text-[var(--endspace-text-primary)] font-semibold line-clamp-2 text-right transition-colors">
              {next.title}
            </div>

            {/* Scan Line Effect -> Strong Yellow Line */}
            <div className="mt-3 h-1 bg-[var(--endspace-accent-yellow)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </SmartLink>
        ) : (
          <div className="endspace-frame p-5 flex items-center justify-center min-h-[100px] opacity-40">
            <span className="tech-text text-xs text-[var(--endspace-text-muted)]">
              // NO_NEXT_ARTICLE
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
