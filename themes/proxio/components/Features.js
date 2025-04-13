import { siteConfig } from '@/lib/config'
import { SVGDesign } from './svg/SVGDesign'
import { SVGEssential } from './svg/SVGEssential'
import { SVGGifts } from './svg/SVGGifts'
import { SVGTemplate } from './svg/SVGTemplate'
import Link from 'next/link'
import LazyImage from '@/components/LazyImage'
/**
 * 产品特性相关，将显示在首页中
 * @returns
 */
export const Features = () => {
  return (
    <>
      {/* <!-- ====== Features Section Start --> */}
      <section className='pb-8 pt-20 dark:bg-dark lg:pb-[40px] lg:pt-[120px]'>
        <div className='container'>

          <div className='-mx-4 flex flex-wrap wow fadeInUp' data-wow-delay='.2s'>
            <div className='w-full px-4'>
              <div className='mx-auto mb-12 lg:mb-[40px]'>
                <span className='px-3 py-0.5 rounded-2xl dark:bg-dark-1 border border-gray-200 dark:border-[#333333] dark:text-white'>
                  {siteConfig('PROXIO_FEATURE_TITLE')}
                </span>
                <h2 className='my-5 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
                  {siteConfig('PROXIO_FEATURE_TEXT_1')}
                </h2>
                <p className='text-base text-body-color dark:text-dark-6'>
                  {siteConfig('PROXIO_FEATURE_TEXT_2')}
                </p>
              </div>
            </div>
          </div>
          {/* 支持三个特性 */}
          <div className='-mx-4 flex flex-col md:flex-row gap-4 px-4'>

            <div className='w-full p-6 rounded-xl border border-gray-200 dark:border-[#333333]'>
              <div className='wow fadeInUp group flex-col space-y-2 flex' data-wow-delay='.1s'>
                <div className='flex w-12 h-12'>
                  <div className='overflow-hidden w-full flex justify-center items-center rounded-xl border border-gray-200 dark:border-[#333333] dark:text-white'>
                    <i className={siteConfig('PROXIO_FEATURE_1_ICON_CLASS') + ' absolute'}></i>
                    <LazyImage src={siteConfig('PROXIO_FEATURE_1_ICON_IMG_URL')} className='z-10' />
                  </div>
                </div>
                <h4 className='mb-3 text-xl font-bold text-dark dark:text-white'>
                  {siteConfig('PROXIO_FEATURE_1_TITLE_1')}
                </h4>
                <p className='mb-8 text-body-color dark:text-dark-6 lg:mb-9'>
                  {siteConfig('PROXIO_FEATURE_1_TEXT_1')}
                </p>
              </div>
            </div>

            <div className='w-full p-6 rounded-xl border border-gray-200 dark:border-[#333333]'>
              <div className='wow fadeInUp group flex-col space-y-2 flex' data-wow-delay='.1s'>
                <div className='flex w-12 h-12'>
                  <div className='overflow-hidden w-full flex justify-center items-center rounded-xl border border-gray-200 dark:border-[#333333] dark:text-white'>
                    <i class={siteConfig('PROXIO_FEATURE_2_ICON_CLASS')}></i>
                    <LazyImage src={siteConfig('PROXIO_FEATURE_2_ICON_IMG_URL')} className='z-10' />
                  </div>
                </div>
                <h4 className='mb-3 text-xl font-bold text-dark dark:text-white'>
                  {siteConfig('PROXIO_FEATURE_2_TITLE_1')}
                </h4>
                <p className='mb-8 text-body-color dark:text-dark-6 lg:mb-9'>
                  {siteConfig('PROXIO_FEATURE_2_TEXT_1')}
                </p>
              </div>
            </div>

            <div className='w-full p-6 rounded-xl border border-gray-200 dark:border-[#333333]'>
              <div className='wow fadeInUp group flex-col space-y-2 flex' data-wow-delay='.1s'>
                <div className='flex w-12 h-12'>
                  <div className='overflow-hidden w-full flex justify-center items-center rounded-xl border border-gray-200 dark:border-[#333333] dark:text-white'>
                    <i class={siteConfig('PROXIO_FEATURE_3_ICON_CLASS')}></i>
                    <LazyImage src={siteConfig('PROXIO_FEATURE_3_ICON_IMG_URL')} className='z-10' />
                  </div>
                </div>
                <h4 className='mb-3 text-xl font-bold text-dark dark:text-white'>
                  {siteConfig('PROXIO_FEATURE_3_TITLE_1')}
                </h4>
                <p className='mb-8 text-body-color dark:text-dark-6 lg:mb-9'>
                  {siteConfig('PROXIO_FEATURE_3_TEXT_1')}
                </p>
              </div>
            </div>

          </div>

          <div className='mt-8 w-full flex justify-center items-center'>
            <Link
              href={siteConfig('PROXIO_FEATURE_BUTTON_URL', '')}
              className='px-4 py-2 rounded-3xl border dark:border-gray-200 border-[#333333] text-base font-medium text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-white dark:hover:text-black duration-200'>
              {siteConfig('PROXIO_FEATURE_BUTTON_TEXT')}
              <i className="pl-4 fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
      {/* <!-- ====== Features Section End --> */}
    </>
  )
}
