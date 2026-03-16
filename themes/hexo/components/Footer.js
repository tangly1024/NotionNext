import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import BeiAnSite from '@/components/BeiAnSite'
import { siteConfig } from '@/lib/config'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer className='relative z-10 dark:bg-black w-full bg-hexo-light-gray text-gray-600 dark:text-gray-100 text-sm p-8'>
      {/* 全局居中容器 */}
      <div className='max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center space-y-8'>

        {/* 1. 感性文案 - 确保文字自适应居中 */}
        <div className='w-full flex flex-col items-center space-y-3 opacity-90'>
          <p className='font-serif italic text-base md:text-lg'>We spend our lives searching for an order that carries warmth.</p>
          <p className='tracking-[0.2em] font-light'>我们终其一生，不过是在寻找一种有温度的秩序。</p>
          <div className='pt-2 opacity-40 text-gray-400'>
            <p className='font-serif italic text-sm'>To find softness within the sharp, and wholeness within the incomplete.</p>
            <p className='tracking-[0.15em] font-light text-xs'>在锐利中寻圆润，在缺失中见完整。</p>
          </div>
        </div>

        {/* 2. 联系方式 - 使用 w-fit 配合 mx-auto 锁定绝对重心 */}
        <div className='w-full flex flex-col items-center space-y-4'>
          <div className='flex items-center justify-center space-x-3 w-fit'>
            <span className='text-gray-400'>联系</span>
            <span className='text-gray-300'>/</span>
            <a href="mailto:i@kingsleyqi.com" className='underline font-mono hover:text-blue-500 transition-colors'>i@kingsleyqi.com</a>
          </div>
          <div className='flex items-center justify-center space-x-3 w-fit'>
            <span className='text-gray-400'>哲思</span>
            <span className='text-gray-300'>/</span>
            <a href="https://kingsleyqi.com" target="_blank" rel="noopener noreferrer" className='underline font-mono hover:text-blue-500 transition-colors'>kingsleyqi.com</a>
          </div>
        </div>

        {/* 3. 版权区块 - 结构化居中 */}
        <div className='w-full pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col items-center space-y-4'>

          {/* 版权与 PV 统计 */}
          <div className='flex flex-wrap items-center justify-center gap-x-2 w-full'>
            <span className='whitespace-nowrap'>© {copyrightDate}</span>
            <i className='fas fa-heart text-red-500 animate-pulse text-[10px]' /> 
            <span className='font-medium whitespace-nowrap'>Kingsley Qi</span>
            <span id="busuanzi_container_site_pv" className='font-mono text-[10px] opacity-40 inline-flex items-center'>
                <span id="busuanzi_value_site_pv" className='ml-1'></span>
            </span>
          </div>

          {/* TSA 存证与设计声明 */}
          <div className='flex flex-col items-center opacity-40 italic text-[10px] md:text-xs'>
            <span className='cursor-default'>Logo Design by Kingsley Qi</span>
            <a 
              href="https://kingsleyqi.com/blog/copyright--tsa-notice/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className='font-mono tracking-tight hover:text-blue-500 underline decoration-dotted mt-1'
            >
              TSA-11-20260315155929599
            </a>
          </div>

          {/* BIO - 强制大写与间距 */}
          <div className='pt-2 font-bold tracking-[0.4em] text-xs uppercase opacity-80 w-full'>
             {siteConfig('BIO')}
          </div>

          {/* 备案信息 - 自动包裹换行 */}
          <div className='flex flex-wrap justify-center items-center gap-x-6 gap-y-2 opacity-60 text-[10px]'>
              <BeiAnSite />
              <BeiAnGongAn />
          </div>
        </div>

        {/* UV 隐藏 */}
        <span id="busuanzi_container_site_uv" className='hidden'>
          <span id="busuanzi_value_site_uv"></span>
        </span>

      </div>
    </footer>
  )
}

export default Footer
