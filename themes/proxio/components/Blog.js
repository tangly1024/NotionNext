/* eslint-disable @next/next/no-img-element */
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'

/**
 * 博文列表
 * @param {*} param0
 * @returns
 */
export const Blog = ({ posts }) => {
  const enable = siteConfig('PROXIO_BLOG_ENABLE')
  if (!enable) {
    return null
  }

  // 博客列表默认显示summary文字，当鼠标指向时显示文章封面。这里可选把summary文字替换成图片占位符。
  const PROXIO_BLOG_PLACEHOLDER_IMG_URL_1 = siteConfig(
    'PROXIO_BLOG_PLACEHOLDER_IMG_URL_1'
  )
  const PROXIO_BLOG_PLACEHOLDER_IMG_URL_2 = siteConfig(
    'PROXIO_BLOG_PLACEHOLDER_IMG_URL_2'
  )
  const PROXIO_BLOG_PLACEHOLDER_IMG_URL_3 = siteConfig(
    'PROXIO_BLOG_PLACEHOLDER_IMG_URL_3'
  )
  const PROXIO_BLOG_PLACEHOLDER_IMG_URL_4 = siteConfig(
    'PROXIO_BLOG_PLACEHOLDER_IMG_URL_4'
  )

  return (
    <>
      {/* <!-- ====== Blog Section Start --> */}
      <section className='bg-white pt-20 dark:bg-dark lg:pt-[120px]'>
        <div className='container mx-auto'>
          {/* 区块标题文字 */}
          <div
            className='-mx-4 flex flex-wrap justify-center wow fadeInUp'
            data-wow-delay='.2s'>
            <div className='w-full px-4 py-4'>
              <div className='mx-auto max-w-[485px] text-center space-y-4'>
                <span className='px-3 py-0.5 rounded-2xl mb-2 dark:bg-dark-1 border border-gray-200 dark:border-[#333333] dark:text-white'>
                  {siteConfig('PROXIO_BLOG_TITLE')}
                </span>

                <h2 className='text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
                  {siteConfig('PROXIO_BLOG_TEXT_1')}
                </h2>
              </div>
            </div>
          </div>
          {/* 博客列表 此处优先展示3片文章 */}
          <div className='-mx-4 grid md:grid-cols-2 grid-cols-1'>
            {posts?.map((item, index) => {
              // 文章封面图片，默认使用占位符 根据index 判断获取的时哪一张图片
              let coverImg = PROXIO_BLOG_PLACEHOLDER_IMG_URL_1
              if (index === 0) {
                coverImg = PROXIO_BLOG_PLACEHOLDER_IMG_URL_1
              } else if (index === 1) {
                coverImg = PROXIO_BLOG_PLACEHOLDER_IMG_URL_2
              } else if (index === 2) {
                coverImg = PROXIO_BLOG_PLACEHOLDER_IMG_URL_3
              } else if (index === 3) {
                coverImg = PROXIO_BLOG_PLACEHOLDER_IMG_URL_4
              }
              return (
                <div key={index} className='w-full px-4'>
                  <div
                    className='wow fadeInUp group mb-10 relative overflow-hidden blog'
                    data-wow-delay='.1s'>
                    <div className='relative rounded-xl border overflow-hidden shadow-md dark:border-gray-700 dark:bg-gray-800'>
                      <Link href={item?.href} className='block'>
                        {item.pageCoverThumbnail && (
                          // 图片半透明
                          <LazyImage
                            src={item.pageCoverThumbnail}
                            alt={item.title}
                            className='w-full h-80 object-cover transition-transform duration-500 rounded-xl'
                          />
                        )}
                        {/* 遮罩层，仅覆盖图片部分 */}
                        <div className='absolute inset-0 bg-gray-100 dark:bg-hexo-black-gray transition-all duration-500 group-hover:opacity-50 group-hover:bg-black' />
                        {/* 鼠标悬停时显示的文字内容 */}
                        <div className='absolute inset-0 flex items-center justify-center group-hover:scale-110 duration-200 group-hover:text-white'>
                          {!coverImg && (
                            <p className='max-w-[370px] text-base text-body-color dark:text-dark-6 flex items-center justify-center duration-200 group-hover:text-white '>
                              {item.summary}
                            </p>
                          )}
                          <LazyImage
                            src={coverImg}
                            className='absolute max-h-full object-cover'
                          />
                        </div>
                      </Link>
                    </div>
                    {/* 内容部分 */}
                    <div className='relative z-10 p-4'>
                      <span className='inline-blocktext-center text-xs font-medium leading-loose text-white'>
                        {item.publishDay}
                      </span>
                      <h3>
                        <Link
                          href={item?.href}
                          className='mb-4 inline-block text-xl font-semibold text-dark hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl'>
                          {item.title}
                        </Link>
                      </h3>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      {/* <!-- ====== Blog Section End --> */}
    </>
  )
}
