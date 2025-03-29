import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'

/**
 * 页脚
 * @param {*} props
 * @returns
 */
export default function Footer(props) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear
  const { locale } = useGlobal()

  return (
    <footer className='relative w-full bg-black px-6 border-t mt-4'>
      {/* 深色模式按钮 */}
      <div className='flex justify-center -mt-5'>
        <div className='bg-gray-100 dark:bg-gray-700 p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300'>
          <DarkModeButton className='text-center' />
        </div>
      </div>

      <div className='container mx-auto max-w-4xl py-6'>
        {/* 版权信息 */}
        <div className='flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-6 mb-6'>
          <div className='mb-4 md:mb-0'>
            <Link href="/" className="text-yellow-300 hover:text-yellow-200 text-xl font-semibold transition-colors duration-300">
              {siteConfig('TITLE')}
            </Link>
          </div>
          
          <div className='flex justify-center space-x-4'>
            <Link href="/" className="text-gray-400 hover:text-yellow-300 transition-colors duration-300">
              首页
            </Link>
            <Link href="/archive" className="text-gray-400 hover:text-yellow-300 transition-colors duration-300">
              归档
            </Link>
            <Link href="/category" className="text-gray-400 hover:text-yellow-300 transition-colors duration-300">
              分类
            </Link>
            <Link href="/tag" className="text-gray-400 hover:text-yellow-300 transition-colors duration-300">
              标签
            </Link>
          </div>
        </div>
        
        {/* 底部信息 */}
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='text-center md:text-left text-gray-400 mb-4 md:mb-0'>
            <div className='text-sm'>
              &copy; {`${copyrightDate}`} {siteConfig('AUTHOR')}. All rights reserved.
            </div>
            <div className='text-xs mt-1'>
              {siteConfig('BEI_AN') && (
                <a
                  href={siteConfig('BEI_AN_LINK')}
                  className='text-gray-500 hover:text-gray-300 transition-colors duration-300'>
                  {siteConfig('BEI_AN')}
                </a>
              )}
              <BeiAnGongAn />
            </div>
          </div>
          
          {/* 站点统计 */}
          <div className='flex items-center justify-center text-xs text-gray-400'>
            <div className='flex flex-col sm:flex-row sm:space-x-6'>
              <div className='flex items-center justify-center mb-2 sm:mb-0'>
                <div className='bg-gray-800 rounded-md px-3 py-1 flex items-center'>
                  <i className='fas fa-chart-area mr-2 text-yellow-500' /> 
                  <span>{locale.COMMON.ANALYTICS}</span>
                </div>
              </div>
              
              <div className='flex space-x-4'>
                {/* 站点总访问量 */}
                <div className='busuanzi_container_site_pv bg-gray-800 rounded-md px-3 py-1 flex items-center'>
                  <i className='fas fa-eye mr-2 text-yellow-500' />
                  <span className='mr-1'>{locale.COMMON.TOTAL_VIEWS}:</span>
                  <span className='busuanzi_value_site_pv font-medium text-yellow-300'></span>
                </div>
                
                {/* 站点访客数 */}
                <div className='busuanzi_container_site_uv bg-gray-800 rounded-md px-3 py-1 flex items-center'>
                  <i className='fas fa-users mr-2 text-yellow-500' />
                  <span className='mr-1'>{locale.COMMON.TOTAL_VISITORS}:</span>
                  <span className='busuanzi_value_site_uv font-medium text-yellow-300'></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
