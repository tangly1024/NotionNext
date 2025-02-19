import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import BeiAnSite from '@/components/BeiAnSite'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'

const Footer = () => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')

  const copyrightDate = parseInt(since) < currentYear ? `${since}-${currentYear}` : currentYear

  return (
    <footer
      className='relative z-10 dark:bg-black flex-shrink-0 bg-hexo-light-gray justify-center text-center m-auto w-full leading-6 text-gray-600 dark:text-gray-100 text-sm p-6'
    >
      {/* 显示年份、心形图标和作者名字 */}
      <i className='fas fa-copyright' /> {copyrightDate}{' '}
      <i className='mx-1 animate-pulse fas fa-heart' />
      <span className='font-bold dark:text-gray-300'>
        {siteConfig('AUTHOR')}
      </span>

    </footer>
  )
}

export default Footer
