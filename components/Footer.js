import React from 'react'

const Footer = ({ fullWidth = true }) => {
  const d = new Date()
  const y = d.getFullYear()
  return (
    <footer
      className='flex-shrink-0 justify-center text-center m-auto w-full mx-auto text-gray-500 dark:text-gray-400 text-sm text-gray-400 p-6'
    >
      <span className='fa fa-copyright leading-6'> {` ${y}`} <span> <a href='https://www.tangly1024.com/article/about' className='underline font-bold'>tangly1024.com</a>. Powered by <a href='https://notion.so' className='underline font-bold'>Notion</a> & <a href='https://vercel.com' className='underline font-bold'>Vercel</a>.</span> </span>
      <br />
      <span className='fa fa-shield leading-6 mr-2'> <a href='https://beian.miit.gov.cn/' className='ml-1 font-bold'>闽ICP备20010331号</a></span>

      <span id='busuanzi_container_site_pv' className='hidden'>
            <a id='busuanzi_container_site_pv' target='_blank' className='fa  fa-eye' rel='noreferrer'
               href='https://www.cnzz.com/stat/website.php?web_id=1279970751'><span
              id='busuanzi_value_site_pv' className='px-1'> </span>pv</a>
      </span>
      <span id='busuanzi_container_site_uv' className='pl-2 hidden'>
        <a className='fa fa-user' rel='noreferrer' target='_blank'
            href='http://tongji.baidu.com/web/10000363165/overview/index?siteId=16809429'>
          <span id='busuanzi_value_site_uv' className='px-1'> </span>uv</a>
      </span>
      <br/>

    </footer>
  )
}

export default Footer
