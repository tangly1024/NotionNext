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
  return (
    <>
      {/* <!-- ====== Blog Section Start --> */}
      <section className='bg-white pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]'>
        <div className='container mx-auto'>
          {/* 区块标题文字 */}
          <div className='-mx-4 flex flex-wrap justify-center wow fadeInUp' data-wow-delay='.2s'>
            <div className='w-full px-4'>
              <div className='mx-auto mb-[60px] max-w-[485px] text-center'>
                <span className='mb-2 block text-lg font-semibold text-primary'>
                  {siteConfig('PROXIO_BLOG_TITLE')}
                </span>
                <h2 className='mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
                  {siteConfig('PROXIO_BLOG_TEXT_1')}
                </h2>
              </div>
            </div>
          </div>
          {/* 博客列表 此处优先展示3片文章 */}
          <div className='-mx-4 grid grid-cols-2'>
            {posts?.map((item, index) => {
              return (
                <div key={index} className='w-full px-4'>
                  <div
                    className='wow fadeInUp group mb-10 relative overflow-hidden rounded-[10px]'
                    data-wow-delay='.1s'>
                    {/* 图片部分 */}
                    <div className='relative'>
                      {item.pageCoverThumbnail && (
                        <Link href={item?.href} className='block'>
                          <LazyImage
                            src={item.pageCoverThumbnail}
                            alt={item.title}
                            className='w-full h-80 object-cover transition-transform duration-500'
                          />
                        </Link>
                      )}
                      {/* 遮罩层，仅覆盖图片部分 */}
                      <div className='absolute inset-0 bg-gray-100 dark:bg-hexo-black-gray transition-opacity duration-500 group-hover:opacity-0'></div>
                    </div>
                    {/* 内容部分 */}
                    <div className='relative z-10 p-4'>
                      <span className='mb-6 inline-block rounded-[10px] bg-primary px-4 py-0.5 text-center text-xs font-medium leading-loose text-white'>
                        {item.publishDay}
                      </span>
                      <h3>
                        <Link
                          href={item?.href}
                          className='mb-4 inline-block text-xl font-semibold text-dark hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl'>
                          {item.title}
                        </Link>
                      </h3>
                      <p className='max-w-[370px] text-base text-body-color dark:text-dark-6'>
                        {item.summary}
                      </p>
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