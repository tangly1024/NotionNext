import { siteConfig } from '@/lib/config'
import AnalyticsBusuanzi from '@/components/AnalyticsBusuanzi'
import PoweredBy from '@/components/PoweredBy'

export default function Footer(props) {
  return (
    <footer className='border-t-4 border-[#0284c7] mt-16 bg-white dark:bg-slate-800'>
      <div className='max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-wrap justify-between items-center text-xs font-black text-[#0284c7] uppercase tracking-wider'>
        <span>
          {'\u00A9'} {new Date().getFullYear()} {siteConfig('AUTHOR')}
        </span>
        <span className='text-slate-500 dark:text-slate-400 font-semibold normal-case tracking-normal flex items-center gap-x-2'>
          <PoweredBy />
          <span className='text-slate-300 dark:text-slate-600'>|</span>
          <a
            href='https://github.com/govmoe/XuHome-Theme'
            target='_blank'
            rel='noopener noreferrer'
            className='text-slate-400 dark:text-slate-500 hover:text-[#0284c7] transition-colors no-underline'
          >
            XuHome Theme
          </a>
          <span className='text-slate-300 dark:text-slate-600'>|</span>
          <AnalyticsBusuanzi />
        </span>
      </div>
    </footer>
  )
}
