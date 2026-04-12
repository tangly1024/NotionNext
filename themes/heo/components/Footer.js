import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import CopyRightDate from '@/components/CopyRightDate'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import SocialButton from './SocialButton'

/**
 * 美化版页脚
 * @returns
 */
const Footer = () => {
  const BEI_AN = siteConfig('BEI_AN')
  const BEI_AN_LINK = siteConfig('BEI_AN_LINK')
  const BIO = siteConfig('BIO')
  const AUTHOR = siteConfig('AUTHOR')

  return (
    <footer className='relative flex-shrink-0 bg-[#f8f9fb] dark:bg-[#1a191d] justify-center text-center m-auto w-full text-sm overflow-hidden'>
      {/* 装饰性波浪分隔线 */}
      <div className="relative h-16 -mb-px">
        <svg
          className="absolute w-full h-16 text-white dark:text-[#1a191d]"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C150,60 350,0 500,30 C650,60 850,0 1000,30 C1150,60 1200,30 1200,30 L1200,60 L0,60 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* 主内容区 */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* 社交按钮区域 */}
        <div className="mb-10">
          <SocialButton />
        </div>

        {/* 分隔装饰 */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d1d5db] dark:to-[#4a4a4f]"></div>
          <span className="w-2 h-2 rounded-full bg-[#e5e7eb] dark:bg-[#3d3d3f]"></span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d1d5db] dark:to-[#4a4a4f]"></div>
        </div>

        {/* 底部信息区 */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 py-6 px-8 rounded-2xl bg-white/60 dark:bg-[#21232a]/60 backdrop-blur-sm border border-gray-200/50 dark:border-[#3d3d3f]/50 shadow-sm">
          {/* 左侧 */}
          <div className="flex flex-col items-center lg:items-start gap-2">
            <PoweredBy />
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1 text-gray-500 dark:text-gray-400">
              <CopyRightDate />
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <a
                href="/about"
                className="font-medium text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {AUTHOR}
              </a>
              {BIO && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <span className="text-gray-500 dark:text-gray-400">{BIO}</span>
                </>
              )}
            </div>
          </div>

          {/* 右侧 */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-gray-500 dark:text-gray-400">
            {/* 备案信息 */}
            {BEI_AN && (
              <a
                href={BEI_AN_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100/80 dark:bg-[#2a2a2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3f] transition-all duration-200 text-xs"
              >
                <i className="fas fa-shield-alt text-green-500" />
                <span>{BEI_AN}</span>
              </a>
            )}
            
            {/* 公安备案 */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100/80 dark:bg-[#2a2a2e] text-xs">
              <BeiAnGongAn />
            </div>

            {/* 访问统计 */}
            <div className="hidden busuanzi_container_site_pv px-3 py-1.5 rounded-full bg-gray-100/80 dark:bg-[#2a2a2e] text-xs">
              <i className="fas fa-eye text-blue-400 mr-1" />
              <span className="busuanzi_value_site_pv">0</span>
            </div>
            <div className="hidden busuanzi_container_site_uv px-3 py-1.5 rounded-full bg-gray-100/80 dark:bg-[#2a2a2e] text-xs">
              <i className="fas fa-users text-purple-400 mr-1" />
              <span className="busuanzi_value_site_uv">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部装饰条 */}
      <div className="h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 dark:from-blue-400/30 dark:via-purple-400/30 dark:to-pink-400/30"></div>
    </footer>
  )
}

export default Footer
