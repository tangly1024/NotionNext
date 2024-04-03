import { siteConfig } from '@/lib/config'

/**
 * 社交联系方式按钮组
 * @returns {JSX.Element}
 * @constructor
 */
const SocialButton = () => {
  return <div className='mt-5 w-full justify-center flex-wrap flex'>
    <div className='space-x-3 text-xl text-gray-600 dark:text-gray-300 '>
      {siteConfig('CONTACT_GITHUB') && <a target='_blank' rel='noreferrer' title={'github'} href={siteConfig('CONTACT_GITHUB')} >
        <i className='transform hover:scale-125 duration-150 fab fa-github hover:text-hexo-primary'/>
      </a>}
      {siteConfig('CONTACT_TWITTER') && <a target='_blank' rel='noreferrer' title={'twitter'} href={siteConfig('CONTACT_TWITTER')} >
        <i className='transform hover:scale-125 duration-150 fab fa-twitter hover:text-hexo-primary'/>
      </a>}
      {siteConfig('CONTACT_TELEGRAM') && <a target='_blank' rel='noreferrer' href={siteConfig('CONTACT_TELEGRAM')} title={'telegram'} >
        <i className='transform hover:scale-125 duration-150 fab fa-telegram hover:text-hexo-primary'/>
      </a>}
      {siteConfig('CONTACT_LINKEDIN') && <a target='_blank' rel='noreferrer' href={siteConfig('CONTACT_LINKEDIN')} title={'linkIn'} >
        <i className='transform hover:scale-125 duration-150 fab fa-linkedin hover:text-hexo-primary'/>
      </a>}
      {siteConfig('CONTACT_WEIBO') && <a target='_blank' rel='noreferrer' title={'weibo'} href={siteConfig('CONTACT_WEIBO')} >
        <i className='transform hover:scale-125 duration-150 fab fa-weibo hover:text-hexo-primary'/>
      </a>}
      {siteConfig('CONTACT_INSTAGRAM') && <a target='_blank' rel='noreferrer' title={'instagram'} href={siteConfig('CONTACT_INSTAGRAM')} >
        <i className='transform hover:scale-125 duration-150 fab fa-instagram hover:text-hexo-primary'/>
      </a>}
      {siteConfig('CONTACT_EMAIL') && <a target='_blank' rel='noreferrer' title={'email'} href={`mailto:${siteConfig('CONTACT_EMAIL')}`} >
        <i className='transform hover:scale-125 duration-150 fas fa-envelope hover:text-hexo-primary'/>
      </a>}
      {JSON.parse(siteConfig('ENABLE_RSS')) && <a target='_blank' rel='noreferrer' title={'RSS'} href={'/feed'} >
        <i className='transform hover:scale-125 duration-150 fas fa-rss hover:text-hexo-primary'/>
      </a>}
      {siteConfig('CONTACT_BILIBILI') && <a target='_blank' rel='noreferrer' title={'bilibili'} href={siteConfig('CONTACT_BILIBILI')} >
        <i className='transform hover:scale-125 duration-150 fab fa-bilibili hover:text-hexo-primary'/>
      </a>}
      {siteConfig('CONTACT_YOUTUBE') && <a target='_blank' rel='noreferrer' title={'youtube'} href={siteConfig('CONTACT_YOUTUBE')} >
        <i className='transform hover:scale-125 duration-150 fab fa-youtube hover:text-hexo-primary'/>
      </a>}
    </div>
  </div>
}
export default SocialButton
