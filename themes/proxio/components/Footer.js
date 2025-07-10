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
import CONFIG from '../config'
import SocialButton from './SocialButton'

/**
 * 网页底脚
 */
export const Footer = ({ title }) => {
  const { siteInfo } = useGlobal()
  const PROXIO_FOOTER_LINKS = siteConfig('PROXIO_FOOTER_LINKS', [], CONFIG)

  return (
    <footer
      id='footer-bottom'
      className='z-10 justify-center m-auto w-full p-6 relative container'>
      <div className='max-w-screen-3xl w-full mx-auto '>
        {/* 信息与链接区块 */}
        <div className='w-full flex lg:flex-row flex-col justify-between py-16'>
          <div className='gap-y-2 flex flex-col items-start dark:text-gray-200'>
            <div className='flex gap-x-1'>
              <LazyImage
                src={siteInfo?.icon}
                className='rounded-full'
                width={24}
                alt={siteConfig('AUTHOR')}
              />
              <h1 className='text-lg'>{title}</h1>
              <span
                className='underline font-bold justify-start'>
                {siteConfig('AUTHOR')}
              </span>
            </div>
            <div className='px-1'>{siteConfig('DESCRIPTION')}</div>
            <div className='px-1'>{siteConfig('CONTACT_EMAIL')}</div>
          </div>

          {/* 右侧链接区块 */}
          <div className='flex gap-x-4'>
            {PROXIO_FOOTER_LINKS?.map((group, index) => {
              return (
                <div key={index}>
                  <div className='font-bold text-xl dark:text-white lg:pb-8 pb-4'>
                    {group.name}
                  </div>
                  <div className='flex flex-col gap-y-2'>
                    {group?.menus?.map((menu, index) => {
                      return (
                        <div key={index}>
                          <Link href={menu.href} className='hover:underline dark:text-gray-200'>
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
        <div className='dark:text-gray-200 py-4 flex flex-col lg:flex-row  justify-between items-center border-t border-gray-600'>
          <div className='flex gap-x-2 flex-wrap justify-between items-center'>
            <CopyRightDate />
            <PoweredBy />
          </div>

          <DarkModeButton className='dark:text-white' />

          <div className='flex justify-between items-center gap-x-2'>
            <div className='flex items-center gap-x-4'>
              <AnalyticsBusuanzi />
              <SocialButton />
            </div>
          </div>
        </div>

        {/* 备案 */}
        <div className='dark:text-gray-200 w-full text-center flex flex-wrap items-center justify-center gap-x-2'>
          <BeiAnSite />
          <BeiAnGongAn />
        </div>
      </div>
    </footer>
  )
}