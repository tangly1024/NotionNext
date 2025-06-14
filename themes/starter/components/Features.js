import { siteConfig } from '@/lib/config'
import { SVGDesign } from './svg/SVGDesign'
import { SVGEssential } from './svg/SVGEssential'
import { SVGGifts } from './svg/SVGGifts'
import { SVGTemplate } from './svg/SVGTemplate'
import Link from 'next/link'
/**
 * 产品特性相关，将显示在首页中
 * @returns
 */
export const Features = () => {
  return (
    <>
      {/* <!-- ====== Features Section Start --> */}
      <section className='pb-8 pt-20 dark:bg-dark lg:pb-[70px] lg:pt-[120px]'>
        <div className='container'>
          <div className='-mx-4 flex flex-wrap'>
            <div className='w-full px-4'>
              <div className='mx-auto mb-12 max-w-[485px] text-center lg:mb-[70px]'>
                <span className='mb-2 block text-lg font-semibold text-primary'>
                  {siteConfig('STARTER_FEATURE_TITLE')}
                </span>
                <h2 className='mb-3 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
                  {siteConfig('STARTER_FEATURE_TEXT_1')}
                </h2>
                <p className='text-base text-body-color dark:text-dark-6'>
                  {siteConfig('STARTER_FEATURE_TEXT_2')}
                </p>
              </div>
            </div>
          </div>
          <div className='-mx-4 flex flex-wrap'>
            <div className='w-full px-4 md:w-1/2 lg:w-1/4'>
              <div className='wow fadeInUp group mb-12' data-wow-delay='.1s'>
                <div className='relative z-10 mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-[14px] bg-primary'>
                  <span className='absolute left-0 top-0 -z-[1] mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-[14px] bg-primary bg-opacity-20 duration-300 group-hover:rotate-45'></span>
                  <SVGGifts />
                </div>
                <h4 className='mb-3 text-xl font-bold text-dark dark:text-white'>
                  {siteConfig('STARTER_FEATURE_1_TITLE_1')}
                </h4>
                <p className='mb-8 text-body-color dark:text-dark-6 lg:mb-9'>
                  {siteConfig('STARTER_FEATURE_1_TEXT_1')}
                </p>
                <Link
                  href={siteConfig('STARTER_FEATURE_1_BUTTON_URL', '')}
                  className='text-base font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary'>
                  {siteConfig('STARTER_FEATURE_1_BUTTON_TEXT')}
                </Link>
              </div>
            </div>
            <div className='w-full px-4 md:w-1/2 lg:w-1/4'>
              <div className='wow fadeInUp group mb-12' data-wow-delay='.15s'>
                <div className='relative z-10 mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-[14px] bg-primary'>
                  <span className='absolute left-0 top-0 -z-[1] mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-[14px] bg-primary bg-opacity-20 duration-300 group-hover:rotate-45'></span>
                  <SVGTemplate />
                </div>
                <h4 className='mb-3 text-xl font-bold text-dark dark:text-white'>
                  {siteConfig('STARTER_FEATURE_2_TITLE_1')}
                </h4>
                <p className='mb-8 text-body-color dark:text-dark-6 lg:mb-9'>
                  {siteConfig('STARTER_FEATURE_2_TEXT_1')}
                </p>
                <Link
                  href={siteConfig('STARTER_FEATURE_2_BUTTON_URL', '')}
                  className='text-base font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary'>
                  {siteConfig('STARTER_FEATURE_2_BUTTON_TEXT')}
                </Link>
              </div>
            </div>
            <div className='w-full px-4 md:w-1/2 lg:w-1/4'>
              <div className='wow fadeInUp group mb-12' data-wow-delay='.2s'>
                <div className='relative z-10 mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-[14px] bg-primary'>
                  <span className='absolute left-0 top-0 -z-[1] mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-[14px] bg-primary bg-opacity-20 duration-300 group-hover:rotate-45'></span>
                  <SVGDesign />
                </div>
                <h4 className='mb-3 text-xl font-bold text-dark dark:text-white'>
                  {siteConfig('STARTER_FEATURE_3_TITLE_1')}
                </h4>
                <p className='mb-8 text-body-color dark:text-dark-6 lg:mb-9'>
                  {siteConfig('STARTER_FEATURE_3_TEXT_1')}
                </p>
                <Link
                  href={siteConfig('STARTER_FEATURE_3_BUTTON_URL', '')}
                  className='text-base font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary'>
                  {siteConfig('STARTER_FEATURE_3_BUTTON_TEXT')}
                </Link>
              </div>
            </div>
            <div className='w-full px-4 md:w-1/2 lg:w-1/4'>
              <div className='wow fadeInUp group mb-12' data-wow-delay='.25s'>
                <div className='relative z-10 mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-[14px] bg-primary'>
                  <span className='absolute left-0 top-0 -z-[1] mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-[14px] bg-primary bg-opacity-20 duration-300 group-hover:rotate-45'></span>
                  <SVGEssential />
                </div>
                <h4 className='mb-3 text-xl font-bold text-dark dark:text-white'>
                  {siteConfig('STARTER_FEATURE_4_TITLE_1')}
                </h4>
                <p className='mb-8 text-body-color dark:text-dark-6 lg:mb-9'>
                  {siteConfig('STARTER_FEATURE_4_TEXT_1')}
                </p>
                <Link
                  href={siteConfig('STARTER_FEATURE_4_BUTTON_URL', '')}
                  className='text-base font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary'>
                  {siteConfig('STARTER_FEATURE_3_BUTTON_TEXT')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- ====== Features Section End --> */}
    </>
  )
}
