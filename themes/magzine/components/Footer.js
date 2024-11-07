import AnalyticsBusuanzi from '@/components/AnalyticsBusuanzi'
import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import BeiAnSite from '@/components/BeiAnSite'
import CopyRightDate from '@/components/CopyRightDate'
import DarkModeButton from '@/components/DarkModeButton'
import LazyImage from '@/components/LazyImage'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import SocialButton from './SocialButton'

/**
 * 网页底脚
 */
const Footer = ({ title }) => {
  const { siteInfo } = useGlobal()
  const MAGZINE_FOOTER_LINKS = siteConfig('MAGZINE_FOOTER_LINKS', [])

  return (
    <footer
      id='footer-bottom'
      className='z-10 bg-black text-white justify-center m-auto w-full p-6 relative'>
      <div className='max-w-screen-3xl w-full mx-auto '>
        {/* 信息与链接区块 */}
        <div className='w-full flex lg:flex-row flex-col justify-between py-16'>
          <div className='gap-x-2 py-6 flex items-center'>
            {/* 站长信息 */}
            <LazyImage
              src={siteInfo?.icon}
              className='rounded-full'
              width={40}
              alt={siteConfig('AUTHOR')}
            />
            <div>
              <h1 className='text-lg'>{title}</h1>
              <i className='fas fa-copyright' />
              <a
                href={siteConfig('LINK')}
                className='underline font-bold justify-start  '>
                {siteConfig('AUTHOR')}
              </a>
            </div>
          </div>

          {/* 右侧链接区块 */}
          <div className='grid grid-cols-2 lg:grid-cols-4 lg:gap-16 gap-8'>
            {MAGZINE_FOOTER_LINKS?.map((group, index) => {
              return (
                <div key={index}>
                  <div className='font-bold text-xl text-white lg:pb-8 pb-4'>
                    {group.name}
                  </div>
                  <div className='flex flex-col gap-y-2'>
                    {group?.menus?.map((menu, index) => {
                      return (
                        <div key={index}>
                          <Link href={menu.href} className='hover:underline'>
                            {menu.title}
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 页脚 */}
        <div className='py-4 flex flex-col lg:flex-row  justify-between items-center border-t border-gray-400'>
          <div className='flex gap-x-2 flex-wrap justify-between items-center'>
            <CopyRightDate />
            <PoweredBy />
          </div>

          <DarkModeButton className='text-white' />

          <div className='flex justify-between items-center gap-x-2'>
            <div className='flex items-center gap-x-4'>
              <AnalyticsBusuanzi />
              <SocialButton />
            </div>
          </div>
        </div>

        {/* 备案 */}
        <div className='w-full text-center flex flex-wrap items-center justify-center gap-x-2'>
          <BeiAnSite />
          <BeiAnGongAn />
        </div>
      </div>
    </footer>
  )
}

export default Footer
