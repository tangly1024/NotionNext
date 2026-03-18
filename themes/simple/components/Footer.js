import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'

/**
 * 页脚
 * @param {*} props
 * @returns
 */
export default function Footer() {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer className='relative w-full bg-black px-6 border-t border-gray-700'>
      <DarkModeButton className='text-center pt-4' />

      <div className='text-yellow-300 container mx-auto max-w-7xl py-10 md:flex md:justify-between md:items-center text-sm border-b border-gray-700'>
        <div className='text-center md:text-left text-[42px] leading-relaxed md:text-[38px]'>
          <span>
            &copy;{`${copyrightDate}`} {siteConfig('AUTHOR')}. All rights
            reserved.
          </span>
          {siteConfig('BEI_AN') && (
            <a
              href={siteConfig('BEI_AN_LINK')}
              className='no-underline hover:underline ml-2'>
              {siteConfig('BEI_AN')}
            </a>
          )}
          <BeiAnGongAn />
        </div>
        <div className='text-center md:text-right text-[40px] md:text-[36px] mt-4 md:mt-0'>
          <span className='no-underline'>
            Powered by
            <a
              href='https://github.com/tangly1024/NotionNext'
              className='hover:underline'>
              NotionNext {siteConfig('VERSION')}
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
