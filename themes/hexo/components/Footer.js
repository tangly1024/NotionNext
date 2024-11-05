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
      {/* 仅显示年份和作者名字 */}
      <i className='fas fa-copyright' /> {copyrightDate}{' '}
      <span>
        <a href={siteConfig('LINK')} className='underline font-bold dark:text-gray-300'>
          {siteConfig('AUTHOR')}
        </a>
      </span>
    </footer>
  )
}

export default Footer
