import React from 'react'
import BLOG from '@/blog.config'
// import DarkModeButton from '@/components/DarkModeButton'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const copyrightDate = (function() {
    if (Number.isInteger(BLOG.SINCE) && BLOG.SINCE < currentYear) {
      return BLOG.SINCE + '-' + currentYear
    }
    return currentYear
  })() 
  // 封装网站运行时间函数
  const runTime = (function() {
    // 定义当前时间
    var d = new Date();
    // 定义网站创建时间，可以自己修改
    var X = new Date ("7/28/2023 00:00:00"); 
    // 计算网站运行时间
    var T=(d.getTime()-X.getTime());
    var M=24*60*60*1000;
    var a=T/M;
    var A=Math.floor(a);
    // 返回网站运行时间字符串
    return "本站已经运行 "+A+" 天了！"
  })

 

  return (
    <footer
      className='relative z-10 dark:bg-black flex-shrink-0 bg-hexo-light-gray justify-center text-center m-auto w-full leading-6  text-gray-600 dark:text-gray-100 text-sm p-6'
    >
      {/* <DarkModeButton/> */}

      {/* 将页脚分为四个区域，使用flex布局 */}
      <div className='flex flex-row justify-around'>
        {/* 第一个区域，显示原来处在中间的东西和备案信息 */}
        <div className='flex flex-col items-center'>
          {/* 使用h6格式标题，标题名为杂项 */}
          <h6>杂项</h6>
          {/* 将原来处在中间的东西改到第一个区域 */}
          <div className='flex flex-col items-center'>
            {/* 显示备案信息 */}
            {BLOG.BEI_AN && 
              <div>
                <i className='fas fa-shield-alt' /> 
                <a href='https://beian.miit.gov.cn/' className='mr-2'>{BLOG.BEI_AN}</a>
              </div>
            }
          </div>
          {/* 显示版权信息和作者信息 */}
          <div>
            <div>
              <i className='fas fa-copyright' /> 
              {`${copyrightDate}`} 
              <i className='mx-1 animate-pulse fas fa-heart'/> 
              <a href={BLOG.LINK} className='dark:text-gray-400 '>{BLOG.AUTHOR}</a>
            </div>
            <div>
              <p className='text-xs pt-4 text-light-400 dark:text-gray-400'>{title} {BLOG.BIO && <>|</>} {BLOG.BIO}</p>
            </div>
            <div>
              <p className='text-xs pt-2 text-light-500 dark:text-gray-500'>基于<a href='https://github.com/tangly1024/NotionNext' className='underline dark:text-gray-300'>NotionNext {BLOG.VERSION}</a>搭建</p>
            </div>
          </div>
        </div>

        {/* 第二个区域，随便设置一个内容 */}
        <div className='flex flex-col items-center'>
          {/* 使用h6格式标题，标题名为导航 */}
          <h6>导航</h6>
          {/* 随便设置一个内容 */}
          <div>
            <i className='mx-1 animate-pulse fab fa-github' />
            <a href='https://www.github.com/zilingheimei' className='underline dark:text-gray-300'>Github</a>
          </div>
          <div>
            <i className='mx-1 animate-pulse fas fa-cloud' />
            <a href='https://icloud.zilingheimei.icu' className='underline dark:text-gray-300'>自建网盘</a>
          </div>
        </div>

        {/* 第三个区域，*/}
        <div className='busuanzi_container_site_pv'>
          {/* 使用h6格式标题，标题名为资源 */}
          <h6>资源</h6>
          <h6>敬请期待</h6>
        </div>

        {/* 第四个区域，显示网站用户数 显示网站访问量 */}
        <div className='pl-2 busuanzi_container_site_uv'>
          {/* 使用h6格式标题，标题名为关于 */}
          <h6>关于</h6>
          <div>
            <i className='fas fa-users'/> 
            <span className='px-1 busuanzi_value_site_uv'> </span> 
            <i className='fas fa-eye'/>
            <span className='px-1 busuanzi_value_site_pv'> </span>
          </div>
          <div>
            {/* 调用网站运行时间函数，并显示结果 */}
            <i className='fas fa-clock' />
            {runTime()}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
