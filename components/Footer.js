import BLOG from '@/blog.config'
import React from 'react'
import SocialButton from '@/components/SocialButton'

const Footer = ({ fullWidth = true }) => {
  const d = new Date()
  const y = d.getFullYear()
  const from = +BLOG.since
  return (
    <footer
      className='p-6 flex-shrink-0 m-auto w-full text-gray-500 dark:text-gray-400'
    >
      <div className='py-2'>
        <span className='text-xl border-b-2'>联系我</span>
        <div className='py-4'>
          <SocialButton />
        </div>
      </div>

      <hr />
      <div className='text-sm py-10 text-gray-400'>
        <span className='fa fa-shield leading-6'><a href='https://beian.miit.gov.cn/'
                                                    className='ml-1'>闽ICP备20010331号</a></span>
        <br />
        <span className='fa fa-copyright leading-6'> {from === y || !from ? y : `${from} - ${y}`} {BLOG.author} </span>
        <br />
        <span id='busuanzi_container_site_pv' className='hidden'>
        <a href='https://www.cnzz.com/stat/website.php?web_id=1279970751' target='_blank'
           id='busuanzi_container_site_pv'
           className='fa fa-user' rel='noreferrer'> pv <span id='busuanzi_value_site_pv'></span></a>
        </span>
        <span id='busuanzi_container_site_uv' className='hidden'><span className='s'> | </span>
        <a href='http://tongji.baidu.com/web/10000363165/overview/index?siteId=16809429' target='_blank'
           className='fa fa-eye' rel='noreferrer'> uv <span id='busuanzi_value_site_uv'></span></a>
        </span>
      </div>
    </footer>
  )
}

export default Footer
