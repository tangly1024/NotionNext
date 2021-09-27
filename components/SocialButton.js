import React from 'react'

const SocialButton = () => {
  return <>
    <div className='space-x-3 text-xl'>
      <a className='fa fa-rss hover:underline' href='/feed' target='_blank' id='feed'/>
      <a className='fa fa-info hover:underline mx-1' href='/article/about' id='about'/>
      <a className='fa fa-github' target='_blank' rel='noreferrer' title={'github'}
         href={'https://github.com/tangly1024'} />
      <a className='fa fa-twitter' target='_blank' rel='noreferrer' title={'twitter'}
         href={'https://twitter.com/troy1024_1'} />
      <a className='fa fa-telegram' href={'https://t.me/tangly_1024'} title={'telegram'} />
      <a className='fa fa-weibo' target='_blank' rel='noreferrer' title={'weibo'}
         href={'http://weibo.com/tangly1024'} />
      <span id='busuanzi_container_site_pv' className='hidden'><span className='s'> | </span>
        <a href='https://www.cnzz.com/stat/website.php?web_id=1279970751' target='_blank'
           id='busuanzi_container_site_pv'
           className='fa fa-user' rel='noreferrer'> pv <span id='busuanzi_value_site_pv'></span></a>
        </span>

      <span id='busuanzi_container_site_uv' className='hidden'><span className='s'> | </span>
        <a href='http://tongji.baidu.com/web/10000363165/overview/index?siteId=16809429' target='_blank'
           className='fa fa-eye' rel='noreferrer'> uv <span id='busuanzi_value_site_uv'></span></a>
        </span>
    </div>
  </>
}
export default SocialButton
