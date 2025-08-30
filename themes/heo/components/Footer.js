// components/Footer.js
import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import CopyRightDate from '@/components/CopyRightDate'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import SocialButton from './SocialButton'

/**
 * 页脚
 * @returns {JSX.Element}
 */
const Footer = () => {
  const BEI_AN = siteConfig('BEI_AN')
  const showSocialButton = siteConfig('CONTACT_GITHUB') || siteConfig('CONTACT_TWITTER') || siteConfig('CONTACT_TELEGRAM') || siteConfig('CONTACT_LINKEDIN')
   ||  siteConfig('CONTACT_WEIBO') || siteConfig('CONTACT_INSTAGRAM') || siteConfig('CONTACT_EMAIL') || siteConfig('ENABLE_RSS') || siteConfig('CONTACT_BILIBILI') || siteConfig('CONTACT_YOUTUBE')

  return (
    <footer id='footer' className='relative flex-shrink-0 bg-white dark:bg-[#1a191d] justify-center text-center m-auto w-full leading-6  text-gray-600 dark:text-gray-100 text-sm mt-0'>
      {/* 颜色过度区 */}
      <div
        id='color-transition'
        className='h-32 bg-gradient-to-b from-[#f7f9fe] to-white  dark:bg-[#1a191d] dark:from-inherit dark:to-inherit'
      />

      {/* 社交按钮 */}
        {showSocialButton && (
            <div className='w-full h-24'>
            <SocialButton />
            </div>
        )}

      {/* 底部页面信息 */}
      <div
        id='footer-bottom'
        className='w-full h-20 flex  p-3 justify-center items-center bg-[#f1f3f7] dark:bg-[#21232A] border-t dark:border-t-[#3D3D3F]'>
          <div id='footer-bottom-left'   className="flex flex-col lg:flex-row justify-center items-center ">
          <PoweredBy />
          <CopyRightDate />
        </div>

        { (BEI_AN ||   siteConfig('COMMENT_GISCUS_REPO') || siteConfig('COMMENT_CUSDIS_APP_ID') || siteConfig('COMMENT_UTTERRANCES_REPO') || siteConfig('COMMENT_GITALK_CLIENT_ID') ) && (
            <div id='footer-bottom-right'>
              {BEI_AN && (
                  <>
                      <i className='fas fa-shield-alt' />{' '}
                      <a href='https://beian.miit.gov.cn/' className='mr-2'>
                          {siteConfig('BEI_AN')}
                      </a>
                  </>
              )}
              <BeiAnGongAn />

              <span className='hidden busuanzi_container_site_pv'>
                  <i className='fas fa-eye' />
                   <span className='px-1 busuanzi_value_site_pv'> </span>{' '}
              </span>
                <span className='pl-2 hidden busuanzi_container_site_uv'>
                     <i className='fas fa-users' />{' '}
                    <span className='px-1 busuanzi_value_site_uv'> </span>{' '}
                </span>
           </div>
            )
        }
      </div>
    </footer>
  )
}

export default Footer