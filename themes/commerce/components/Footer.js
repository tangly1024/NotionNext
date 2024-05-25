import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import CONFIG from '../config'

/**
 * 页脚
 * @param {*} param0
 * @returns
 */
const Footer = props => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear
  const { categoryOptions, customMenu } = props

  return (
    <footer
      id='footer-wrapper'
      className='relative bg-[#2A2A2A] justify-center w-full leading-6 text-gray-300 text-sm md:p-10'>
      <div id='footer-container' className='w-full mx-auto max-w-screen-xl'>
        <div className='flex'>
          {/* 页脚左侧菜单组 */}
          <div className='hidden md:flex flex-grow my-6 space-x-20 text-lg  '>
            {/* 分类菜单  */}
            <div>
              <div className='font-bold mb-4 text-white'>
                {siteConfig(
                  'COMMERCE_TEXT_FOOTER_MENU_1',
                  'Product Center',
                  CONFIG
                )}
              </div>
              <nav
                id='home-nav-button'
                className={'flex flex-col space-y-2 text-start'}>
                {categoryOptions?.map(category => {
                  return (
                    <Link
                      key={`${category.name}`}
                      title={`${category.name}`}
                      href={`/category/${category.name}`}
                      passHref>
                      {category.name}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* 系统菜单  */}
            <div>
              <div className='font-bold mb-4 text-white'>
                {siteConfig('COMMERCE_TEXT_FOOTER_MENU_2', 'About US', CONFIG)}
              </div>
              <nav
                id='home-nav-button'
                className={'flex flex-col space-y-2 text-start'}>
                {customMenu?.map(menu => {
                  return (
                    <Link
                      key={`${menu.name}`}
                      title={`${menu.name}`}
                      href={`${menu.href}`}
                      passHref>
                      {menu.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* 页脚右侧联系方式 */}
          {
            <div className='md:border-l pl-8 space-x-8 border-gray-600 flex flex-grow'>
              {/* 电话邮箱等 */}
              <div className='my-6 whitespace-pre-line text-left'>
                <div className='font-bold text-l text-white mb-6'>
                  {siteConfig(
                    'COMMERCE_TEXT_FOOTER_TITLE',
                    'Contact US',
                    CONFIG
                  )}
                </div>
                <div className='space-y-4'>
                  <div className='flex space-x-4 text-2xl'>
                    {JSON.parse(
                      siteConfig(
                        'COMMERCE_CONTACT_WHATSAPP_SHOW',
                        null,
                        CONFIG
                      ),
                      true
                    ) && (
                      <div>
                        {
                          <a
                            target='_blank'
                            rel='noreferrer'
                            href={siteConfig('CONTACT_WHATSAPP', '#', CONFIG)}
                            title={'telegram'}>
                            <i className='transform hover:scale-125 duration-150 fa-brands fa-whatsapp dark:hover:text-red-400 hover:text-red-600' />
                          </a>
                        }
                      </div>
                    )}

                    {JSON.parse(
                      siteConfig('COMMERCE_CONTACT_TELEGRAM_SHOW', true, CONFIG)
                    ) && (
                      <div>
                        {
                          <a
                            target='_blank'
                            rel='noreferrer'
                            href={siteConfig('CONTACT_TELEGRAM', '#', CONFIG)}
                            title={'telegram'}>
                            <i className='transform hover:scale-125 duration-150 fab fa-telegram dark:hover:text-red-400 hover:text-red-600' />
                          </a>
                        }
                      </div>
                    )}
                  </div>
                  <div className='text-lg'>
                    {' '}
                    {siteConfig('CONTACT_EMAIL') && (
                      <a
                        target='_blank'
                        rel='noreferrer'
                        title={'email'}
                        href={`mailto:${siteConfig('CONTACT_EMAIL')}`}>
                        <i className='transform hover:scale-125 duration-150 fas fa-envelope dark:hover:text-red-400 hover:text-red-600' />{' '}
                        {siteConfig('CONTACT_EMAIL')}
                      </a>
                    )}
                  </div>
                  <div className='text-lg'>
                    {' '}
                    {siteConfig('CONTACT_PHONE', null) && (
                      <div>
                        <i className='transform hover:scale-125 duration-150 fas fa-user dark:hover:text-red-400 hover:text-red-600' />{' '}
                        {siteConfig('CONTACT_PHONE', null)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 页脚右侧图片二维码和文字描述 */}
              {
                <div className=' border-gray-600 my-6 whitespace-pre-line text-center'>
                  <div className='font-bold text-l text-white mb-6 text-center'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className='h-36'
                      src={siteConfig(
                        'COMMERCE_FOOTER_RIGHT_IMG_URL',
                        null,
                        CONFIG
                      )}></img>
                  </div>
                  <div className='space-y-4'>
                    <div
                      className='flex space-x-4 text-center'
                      dangerouslySetInnerHTML={{
                        __html: siteConfig(
                          'COMMERCE_FOOTER_RIGHT_TEXT',
                          '',
                          CONFIG
                        )
                      }}></div>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        {/* 底部版权相关 */}
        <div
          id='footer-copyright-wrapper'
          className='flex flex-col md:flex-row justify-between border-t border-gray-600 pt-8 px-4 md:px-0'>
          <div className='text-start space-y-1'>
            {/* 网站所有者 */}
            <div>
              {' '}
              Copyright <i className='fas fa-copyright' /> {`${copyrightDate}`}{' '}
              <a
                href={siteConfig('LINK')}
                className='underline font-bold  dark:text-gray-300 '>
                {siteConfig('AUTHOR')}
              </a>{' '}
              All Rights Reserved.
            </div>

            {/* 技术支持 */}
            <div className='text-xs text-light-500 dark:text-gray-700'>
              Powered by{' '}
              <a
                href='https://github.com/tangly1024/NotionNext'
                className='dark:text-gray-300'>
                NotionNext {siteConfig('VERSION')}
              </a>
              .
            </div>

            {/* 站点统计 */}
            <div>
              <span className='hidden busuanzi_container_site_pv'>
                <i className='fas fa-eye' />
                <span className='px-1 busuanzi_value_site_pv'> </span>{' '}
              </span>
              <span className='pl-2 hidden busuanzi_container_site_uv'>
                <i className='fas fa-users' />{' '}
                <span className='px-1 busuanzi_value_site_uv'> </span>{' '}
              </span>
            </div>
          </div>

          {/* 右边公司名字 */}
          <div className='md:text-right'>
            <h1 className='text-xs pt-4 text-light-400 dark:text-gray-400'>
              {siteConfig('TITLE')} {siteConfig('BIO')}
            </h1>
            <h2> {siteConfig('DESCRIPTION')}</h2>
            {/* 可选备案信息 */}
            {siteConfig('BEI_AN') && (
              <>
                <i className='fas fa-shield-alt' />{' '}
                <a href='https://beian.miit.gov.cn/' className='mr-2'>
                  {siteConfig('BEI_AN')}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
