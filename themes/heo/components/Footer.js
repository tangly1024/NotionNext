import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import CopyRightDate from '@/components/CopyRightDate'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import SocialButton from './SocialButton'

/**
 * 页脚
 * @returns
 */
const Footer = () => {
  const BEI_AN = siteConfig('BEI_AN')
  const BEI_AN_LINK = siteConfig('BEI_AN_LINK')
  const BIO = siteConfig('BIO')
  const AUTHOR = siteConfig('AUTHOR')

  return (
    <footer className='relative flex-shrink-0 w-full bg-white dark:bg-[#1a191d]'>
      {/* 顶部颜色过渡区：更加柔和的渐变 */}
      <div className='h-24 w-full bg-gradient-to-b from-[#f7f9fe] to-transparent dark:from-[#151419] dark:to-transparent' />

      <div className='max-w-6xl mx-auto px-6 pb-10 flex flex-col items-center'>
        {/* 社交按钮区 */}
        <div className='mb-8'>
          <SocialButton />
        </div>

        {/* 分割线 */}
        <div className='w-full border-t border-gray-100 dark:border-gray-800/50 mb-8' />

        {/* 底部页面信息区 */}
        <div className='w-full flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-gray-500 dark:text-gray-400'>
          
          {/* 左侧：版权与作者信息 */}
          <div className='flex flex-col items-center lg:items-start gap-2'>
            <div className='flex flex-wrap items-center justify-center lg:justify-start gap-1'>
              <CopyRightDate />
              <span className='mx-1'>©</span>
              <a
                href='/about'
                className='font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300'
              >
                {AUTHOR}
              </a>
              {BIO && (
                <>
                  <span className='mx-1 text-gray-300 dark:text-gray-700'>|</span>
                  <span>{BIO}</span>
                </>
              )}
            </div>
            <PoweredBy />
          </div>

          {/* 右侧：备案与统计信息 */}
          <div className='flex flex-col items-center lg:items-end gap-2'>
            {/* 备案信息 */}
            <div className='flex flex-wrap items-center justify-center gap-3'>
              {BEI_AN && (
                <a
                  href={BEI_AN_LINK || 'https://beian.miit.gov.cn/'}
                  target='_blank'
                  rel='noreferrer'
                  className='flex items-center gap-1 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300'
                >
                  <i className='fas fa-shield-alt text-xs opacity-70' />
                  <span>{BEI_AN}</span>
                </a>
              )}
              <BeiAnGongAn />
            </div>

            {/* 访问量统计 (Busuanzi) */}
            <div className='flex items-center gap-4 text-xs opacity-80'>
              <span className='hidden busuanzi_container_site_pv flex items-center gap-1.5'>
                <i className='fas fa-eye' />
                <span className='busuanzi_value_site_pv'>--</span>
              </span>
              <span className='hidden busuanzi_container_site_uv flex items-center gap-1.5'>
                <i className='fas fa-users' />
                <span className='busuanzi_value_site_uv'>--</span>
              </span>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  )
}

export default Footer
