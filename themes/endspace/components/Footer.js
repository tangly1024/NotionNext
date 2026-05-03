import { siteConfig } from '@/lib/config'

/**
 * Footer Component - Dark Industrial / Endfield Style
 * Responsive footer design
 */
export const Footer = ({ title }) => {
  const d = new Date()
  const y = d.getFullYear()

  return (
    <footer className="relative mt-20 bg-[#252726] text-gray-300 overflow-hidden">
      {/* Spectrum Bar Top */}
      <div className="spectrum-bar opacity-30" />
      
      {/* Content - centered relative to viewport */}
      <div className="py-6 md:py-8 space-y-3 md:space-y-4 px-4">
        {/* Row 1: RSS and Sitemap Links */}
        <div className="flex justify-center items-center gap-4 md:gap-6 text-sm font-mono md:-ml-10">
          {siteConfig('ENABLE_RSS') && (
            <a 
              href="/rss/feed.xml" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-gray-200 hover:underline transition-colors py-2"
            >
              <i className="fas fa-rss" />
              <span>RSS</span>
            </a>
          )}
          <a 
            href="/sitemap.xml" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-gray-200 hover:underline transition-colors py-2"
          >
            <i className="fas fa-sitemap" />
            <span>SITEMAP</span>
          </a>
        </div>

        {/* Row 2: ICP Registration */}
        {siteConfig('BEI_AN') && (
          <div className="flex justify-center items-center text-sm font-mono text-gray-500 md:-ml-10">
            {siteConfig('BEI_AN_LINK') ? (
              <a 
                href={siteConfig('BEI_AN_LINK')} 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-gray-300 hover:underline transition-colors py-1"
              >
                {siteConfig('BEI_AN')}
              </a>
            ) : (
              <span>{siteConfig('BEI_AN')}</span>
            )}
          </div>
        )}

        {/* Row 3: Copyright */}
        <div className="flex justify-center items-center text-xs font-mono text-gray-500 md:-ml-10">
          <div className="text-center">
            © {siteConfig('SINCE') && siteConfig('SINCE') !== y ? `${siteConfig('SINCE')}-${y}` : y} {siteConfig('AUTHOR')}
            <span className="hidden sm:inline">. All Rights Reserved.</span>
          </div>
        </div>
      </div>
      
      {/* Corner Decoration - hidden on mobile */}
      <div className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 border-b-4 border-r-4 border-gray-800 opacity-50 hidden md:block" />
    </footer>
  )
}

export default Footer
