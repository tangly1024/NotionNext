import React from 'react'
import Footer from '@/components/Footer'
import TocBar from '@/components/TocBar'
import SocialButton from '@/components/SocialButton'

const SideBarEmbed = ({ tags, currentTag, post }) => {
  return <aside className='z-30 bg-white dark:border-gray-500 border-gray-200'>

    <div
      className='dark:bg-gray-800 scroll-hidden left-0 duration-500 ease-in-out '>

      {/* wrapper */}
      <div className='sticky top-12'>

        {/* 菜单 */}
        <nav>
          <ul className='leading-8 text-gray-700 dark:text-gray-400'>
            <li className='hover:bg-gray-100 dark:hover:bg-black duration-100 p-2'>
              <a className='fa fa-home w-full px-4' href='/' id='home'>
                <span className='ml-2'>主页</span>
              </a>
            </li>
            <li className='hover:bg-gray-100 dark:hover:bg-black duration-100 p-2'>
              <a className='fa fa-info-circle w-full px-4' href='/article/about' id='about'>
                <span className='ml-2'>关于本站</span>
              </a>
            </li>
            <li className='hover:bg-gray-100 dark:hover:bg-black duration-100 p-2'>
              <a className='fa fa-rss-square w-full px-4' href='/feed' target='_blank' id='feed'>
                <span className='ml-2'>RSS订阅</span>
              </a>
            </li>
          </ul>
        </nav>

        <hr className='dark:border-gray-600'/>

        {/* 联系 */}
        <section className='mt-6 mb-6 '>
            <strong className='text-gray-600 dark:text-gray-400 px-6'>联系我</strong>
            <div>
              <i className='fa fa-map-marker text-sm dark:text-gray-300 px-6 mt-3' >&nbsp;Fuzhou, China</i>
            </div>
            <div>
              <SocialButton />
            </div>
        </section>

          {/* 站点信息 */}
        <section className='my-3 xl:block'>
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
export default SideBarEmbed
