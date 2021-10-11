import React from 'react'
import Footer from '@/components/Footer'
import TocBar from '@/components/TocBar'
import SocialButton from '@/components/SocialButton'

const SideBarResponsive = ({ tags, currentTag, post }) => {
  return <aside className='z-10 bg-white dark:border-gray-500 border-gray-200 mt-12 hidden md:block'>

    <div
      className='dark:bg-gray-800 border-r dark:border-gray-700 h-full scroll-hidden left-0 duration-500 ease-in-out min-h-screen'>

      {/* wrapper */}
      <div className='hidden md:block sticky top-12'>

        {/* 菜单 */}
        <nav>
          <ul className='leading-8 text-gray-700 dark:text-gray-400'>
            <li className='hover:bg-gray-100 dark:hover:bg-black duration-100 p-2'>
              <a className='fa fa-home w-full px-4' href='/' id='home'>
                <span className='ml-2 hidden xl:inline-block'>主页</span>
              </a>
            </li>
            <li className='hover:bg-gray-100 dark:hover:bg-black duration-100 p-2'>
              <a className='fa fa-info-circle w-full px-4' href='/article/about' id='about'>
                <span className='ml-2 hidden xl:inline-block'>关于本站</span>
              </a>
            </li>
            <li className='hover:bg-gray-100 dark:hover:bg-black duration-100 p-2'>
              <a className='fa fa-rss-square w-full px-4' href='/feed' target='_blank' id='feed'>
                <span className='ml-2 hidden xl:inline-block'>RSS订阅</span>
              </a>
            </li>
          </ul>
        </nav>

        <hr className='dark:border-gray-600'/>

        {/* 联系 */}
        <section className='mt-6 mb-6 hidden xl:inline-block'>
            <strong className='text-gray-600 dark:text-gray-400 px-6'>联系我</strong>
            <div>
              <i className='fa fa-map-marker text-sm dark:text-gray-300 px-6 mt-3' >&nbsp;Fuzhou, China</i>
            </div>
            <div>
              <SocialButton />
            </div>
        </section>

          {/* 站点信息 */}
        <section className='my-3 hidden xl:block'>
          <hr className='dark:border-gray-600'/>
          <Footer />
        </section>

      </div>

      {post && (
        <div className='sticky top-12'>
          <TocBar toc={post.toc} />
        </div>
      )}

    </div>

  </aside>
}
export default SideBarResponsive
