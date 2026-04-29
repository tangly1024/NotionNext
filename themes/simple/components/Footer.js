import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import DarkModeButton from '@/components/DarkModeButton'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'
import { siteConfig } from '@/lib/config'
import Image from 'next/image'
import { useRef } from 'react'

const footerIconClass =
  'inline-flex h-[35px] w-[35px] items-center justify-center rounded-full border border-[#808080] text-[#808080] transition-colors duration-150 hover:border-[#111] hover:text-[#111] dark:hover:border-gray-200 dark:hover:text-gray-200'

function OutlookIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className='h-[19px] w-[19px]'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'>
      <rect x='8.3' y='5.2' width='10.8' height='13.6' rx='1.7' />
      <path d='M10.3 8.5h6.8' />
      <path d='M10.3 11.7h6.8' />
      <rect x='4.9' y='8.1' width='7.3' height='7.8' rx='1.3' />
      <path d='M7.1 11.9c0-1.4.7-2.3 1.7-2.3s1.7.9 1.7 2.3-.7 2.3-1.7 2.3-1.7-.9-1.7-2.3Z' />
    </svg>
  )
}

function FooterIconLink({
  href,
  title,
  onClick,
  icon,
  children,
  innerClassName,
  iconRef
}) {
  const className = `${footerIconClass} ${href || onClick ? 'cursor-pointer' : 'cursor-default'}`
  const content = children || <i className={`${icon} ${innerClassName || ''}`} />

  if (!href && !onClick) {
    return (
      <span title={title} aria-label={title} className={className}>
        {content}
      </span>
    )
  }

  return (
    <a
      href={href}
      onClick={onClick}
      target='_blank'
      rel='noreferrer'
      title={title}
      aria-label={title}
      ref={iconRef}
      className={className}>
      {content}
    </a>
  )
}

/**
 * 页脚
 * @param {*} props
 * @returns
 */
export default function Footer() {
  const emailIcon = useRef(null)
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear
  const contactEmail = siteConfig('CONTACT_EMAIL')
  const contactWechat = siteConfig('CONTACT_WEHCHAT_PUBLIC')
  const contactLinkedIn = siteConfig('CONTACT_LINKEDIN')
  const schoolLogoImage = siteConfig(
    'SIMPLE_FOOTER_SCHOOL_LOGO_IMAGE',
    '/api/pcl-asset?key=cma'
  )
  const schoolLogoLink = siteConfig(
    'SIMPLE_FOOTER_SCHOOL_LOGO_LINK',
    'https://cma.hkust-gz.edu.cn/'
  )

  return (
    <footer className='relative w-full border-t border-[#d6d6d6] bg-[#f9f9fb] px-6 text-[#111] dark:border-gray-800 dark:bg-black dark:text-gray-200'>
      <DarkModeButton className='absolute left-1/2 top-4 -translate-x-1/2 text-[#808080] dark:text-gray-300' />

      <div className='container mx-auto max-w-[1140px] py-8 text-base'>
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='flex justify-center gap-[15px] md:justify-start'>
            <FooterIconLink
              href={contactEmail ? undefined : 'mailto:CL.Ping@connect.hkust-gz.edu.cn'}
              onClick={
                contactEmail
                  ? e => handleEmailClick(e, emailIcon, contactEmail)
                  : undefined
              }
              title='Outlook'
              iconRef={emailIcon}>
              <OutlookIcon />
            </FooterIconLink>
            <FooterIconLink
              href={contactWechat}
              title='WeChat'
              icon='fab fa-weixin'
              innerClassName='text-[18px]'
            />
            <FooterIconLink
              href={contactLinkedIn}
              title='LinkedIn'
              icon='fab fa-linkedin-in'
              innerClassName='text-[18px]'
            />
          </div>

          {schoolLogoImage && (
            <a
              href={schoolLogoLink || undefined}
              target='_blank'
              rel='noreferrer'
              title='HKUST(GZ) Computational Media and Arts'
              aria-label='HKUST(GZ) Computational Media and Arts'
              className='mx-auto block w-[260px] max-w-full md:mx-0 md:w-[376px]'>
              <Image
                src={schoolLogoImage}
                alt='HKUST(GZ) Computational Media and Arts'
                width={906}
                height={172}
                className='h-auto w-full object-contain'
              />
            </a>
          )}
        </div>

        <div className='mt-6 flex flex-col gap-3 border-t border-[#d6d6d6] pt-6 text-center leading-relaxed md:flex-row md:items-center md:justify-between md:text-left'>
          <div className='flex flex-wrap items-center justify-center gap-x-2 gap-y-1 md:justify-start'>
            <span className='text-[#808080]'>
              &copy;{`${copyrightDate}`} {siteConfig('AUTHOR')}. All rights
              reserved.
            </span>
            {siteConfig('BEI_AN') && (
              <a
                href={siteConfig('BEI_AN_LINK')}
                className='text-[#111] no-underline hover:underline'>
                {siteConfig('BEI_AN')}
              </a>
            )}
            <BeiAnGongAn className='text-[#111]' />
          </div>

          <div className='text-[#111] md:text-right'>
            <span>Powered by </span>
            <a
              href='https://github.com/tangly1024/NotionNext'
              className='hover:underline'>
              NotionNext {siteConfig('VERSION')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
