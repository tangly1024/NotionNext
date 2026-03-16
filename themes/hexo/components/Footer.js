import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import BeiAnSite from '@/components/BeiAnSite'
import { siteConfig } from '@/lib/config'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer className='relative z-10 dark:bg-black w-full bg-hexo-light-gray text-gray-600 dark:text-gray-100 text-sm p-8'>
      {/* 使用 items-center 确保 flex 子元素垂直轴对齐，text-center 确保文字对齐 */}
      <div className='max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center space-y-8'>

        {/* 1. 感性文案 */}
        <div className='w-full space-y-3 opacity-90'>
          <p className='font-serif italic text-base md:text-lg'>We spend our lives searching for an order that carries warmth.</p>
          <p className='tracking-[0.2em] font-light'>我们终其一生，不过是在寻找一种有温度的秩序。</p>
          <div className='pt-2 opacity-40 text-gray-400'>
            <p className='font-serif italic text-sm'>To find softness within the sharp, and wholeness within the incomplete.</p>
            <p className='tracking-[0.15em] font-light text-xs'>在锐利中寻圆润，在缺失中见完整。</p>
          </div>
        </div>

        {/* 2. 联系方式 - 修正 Flex 逻辑确保在移动端不会因宽度不同而显得偏移 */}
        <div className='w-full flex flex-col items-center space-y-4'>
          <div className='flex items-center justify-center space-x-3'>
            <span className='text-gray-400'>联系</span>
            <span className='text-gray-300'>/</span>
            <a href="mailto:i@kingsleyqi.com" className='underline font-mono'>i@kingsleyqi.com</a>
          </div>
          <div className='flex items-center justify-center space-x-3'>
            <span className='text-gray-400'>哲思</span>
            <span className='text-gray-300'>/</span>
            <a href="https://kingsleyqi.com" target="_blank" rel="noopener noreferrer" className='underline font-mono'>kingsleyqi.com</a>
          </div>
        </div>

        {/* 3. 版权区块 - 彻底修复偏左问题 */}
        <div className='w-full pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col items-center'>

          {/* 版权行：移除所有浮动的竖杠，使用 gap 自动分配间距 */}
          <div className='flex items-center justify-center gap-x-2 w-full'>
            <span className='whitespace-nowrap'>© {copyrightDate}</span>
            <i className='fas fa-heart text-red-500 animate-pulse text-[10px]' /> 
            <span className='font-medium whitespace-nowrap'>Kingsley Qi</span>
            {/* PV 统计设为绝对定位偏移或确保不占宽，避免挤压中心 */}
            <span id="busuanzi_container_site_pv" className='font-mono text-[10px] opacity-40 ml-1'>
                <span id="busuanzi_value_site_pv"></span>
            </span>
          </div>

          {/* Logo 存证信息 */}
          <div className='mt-4 flex flex-col items-center space-y-1 opacity-40 italic text-[10px] md:text-xs'>
            <span className='cursor-default'>Logo Design by Kingsley Qi</span>
            <a 
              href="https://kingsleyqi.com/blog/copyright--tsa-notice/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className='font-mono tracking-tighter hover:text-blue-500 underline decoration-dotted'
            >
              TSA-11-20260315155929599
            </a>
          </div>

          {/* BIO - 强制取消可能的默认间距 */}
          <div className='mt-6 font-bold tracking-[0.4em] text-xs uppercase opacity-80 w-full text-center'>
             {siteConfig('BIO')}
          </div>

          {/* 备案 */}
          <div className='mt-4 flex flex-wrap justify-center gap-4 opacity-60 text-[10px]'>
              <BeiAnSite />
              <BeiAnGongAn />
          </div>
        </div>

        {/* UV 隐藏 */}
        <span id="busuanzi_container_site_uv" className='hidden'>
          <span id="busuanzi_value_site_uv"></span>
        </span>

      </div>
    </footer>
  )
}

export default Footer

footer版权信息备份
