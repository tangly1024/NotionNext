import { siteConfig } from '@/lib/config'
import SocialButton from '@/themes/fukasawa/components/SocialButton'
import { Logo } from './Logo'
import { SVGFooterCircleBG } from './svg/SVGFooterCircleBG'
import Link from 'next/link'

/* eslint-disable @next/next/no-img-element */
export const Footer = props => {
  const footerPostCount = siteConfig('STARTER_FOOTER_POST_COUNT', 2)
  const latestPosts = props?.latestPosts
    ? props?.latestPosts.slice(0, footerPostCount)
    : []
  const STARTER_FOOTER_LINK_GROUP = siteConfig('STARTER_FOOTER_LINK_GROUP', [])
  return (
    <>
      {/* <!-- ====== Footer Section Start --> */}
      <footer
        className='wow fadeInUp relative z-10 bg-[#090E34] pt-20 lg:pt-[100px]'
        data-wow-delay='.15s'>
        <div className='container'>
          <div className='-mx-4 flex flex-wrap'>
            <div className='w-full px-4 sm:w-1/2 md:w-1/2 lg:w-4/12 xl:w-3/12'>
              <div className='mb-10 w-full'>
                <a className='-mx-4 mb-6 inline-block max-w-[160px]'>
                  <Logo white={true} />
                </a>
                <p className='mb-8 max-w-[270px] text-base text-gray-7'>
                  {siteConfig('STARTER_FOOTER_SLOGAN')}
                </p>
                <div className='-mx-3 flex items-center'>
                  <div className='mx-3'>
                    <SocialButton />
                  </div>
                </div>
              </div>
            </div>

            {/* 中间三列菜单组 */}
            {STARTER_FOOTER_LINK_GROUP?.map((item, index) => {
              return (
                <div
                  key={index}
                  className='w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12'>
                  <div className='mb-10 w-full'>
                    <h4 className='mb-9 text-lg font-semibold text-white'>
                      {item.TITLE}
                    </h4>
                    <ul>
                      {item?.LINK_GROUP?.map((l, i) => {
                        return (
                          <li key={i}>
                            <Link
                              href={l.URL}
                              className='mb-3 inline-block text-base text-gray-7 hover:text-primary'>
                              {l.TITLE}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )
            })}

            {/* 页脚右侧最新博文 */}
            <div className='w-full px-4 md:w-2/3 lg:w-6/12 xl:w-3/12'>
              <div className='mb-10 w-full'>
                <h4 className='mb-9 text-lg font-semibold text-white'>
                  {siteConfig('STARTER_FOOTER_BLOG_LATEST_TITLE')}
                </h4>
                {/* 展示两条最新博客文章 */}
                <div className='flex flex-col gap-8'>
                  {latestPosts?.map((item, index) => {
                    return (
                      <Link
                        key={index}
                        href={item?.href}
                        className='group flex items-center gap-[22px]'>
                        {item.pageCoverThumbnail && (
                          <div className='overflow-hidden rounded w-20 h-12'>
                            <img
                              src={item.pageCoverThumbnail}
                              alt={item.title}
                            />
                          </div>
                        )}
                        <span className='line-clamp-2 max-w-[180px] text-base text-gray-7 group-hover:text-white'>
                          {item.title}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部版权信息相关 */}

        

        {/* Footer 背景 */}
        <div>
          <span className='absolute left-0 top-0 z-[-1]'>
            <img src='/images/starter/footer/shape-1.svg' alt='' />
          </span>

          <span className='absolute bottom-0 right-0 z-[-1]'>
            <img src='/images/starter/footer/shape-3.svg' alt='' />
          </span>

          <span className='absolute right-0 top-0 z-[-1]'>
            <SVGFooterCircleBG />
          </span>
        </div>
      </footer>
      {/* <!-- ====== Footer Section End --> */}
    </>
  )
}
