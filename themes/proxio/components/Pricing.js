import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'

/**
 * 价格板块
 * @returns
 */
export const Pricing = () => {
  return (
    <>
      {/* <!-- ====== Pricing Section Start --> */}
      <section
        id='pricing'
        className='relative overflow-hidden bg-white pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]'>
        <div className='container mx-auto'>
          <div className='-mx-4 flex flex-wrap'>
            <div className='w-full px-4'>
              <div className='mx-auto mb-[60px] max-w-[510px] text-center'>
                <span className='mb-2 block text-lg font-semibold text-primary'>
                  {siteConfig('PROXIO_PRICING_TITLE')}
                </span>
                <h2 className='mb-3 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
                  {siteConfig('PROXIO_PRICING_TEXT_1')}
                </h2>
                <p className='text-base text-body-color dark:text-dark-6'>
                  {siteConfig('PROXIO_PRICING_TEXT_2')}
                </p>
              </div>
            </div>
          </div>

          <div className='-mx-4 flex flex-wrap justify-center'>
            {/* 第一个付费计划 */}
            <div className='w-full px-4 md:w-1/2 lg:w-1/3'>
              <div className='relative z-10 mb-10 overflow-hidden rounded-xl bg-white px-8 py-10 shadow-pricing dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-14'>
                <span className='mb-5 block text-xl font-medium text-dark dark:text-white'>
                  {siteConfig('PROXIO_PRICING_1_TITLE')}
                </span>
                <h2 className='space-x-1 mb-11 text-4xl font-semibold text-dark dark:text-white xl:text-[42px] xl:leading-[1.21]'>
                  <span className='text-xl font-medium'>
                    {siteConfig('PROXIO_PRICING_1_PRICE_CURRENCY')}
                  </span>
                  <span className='-ml-1 -tracking-[2px]'>
                    {siteConfig('PROXIO_PRICING_1_PRICE')}
                  </span>
                  <span className='text-base font-normal text-body-color dark:text-dark-6'>
                    {siteConfig('PROXIO_PRICING_1_PRICE_PERIOD')}
                  </span>
                </h2>

                <div className='mb-[50px]'>
                  <h5 className='mb-5 text-lg font-medium text-dark dark:text-white'>
                    {siteConfig('PROXIO_PRICING_1_HEADER')}
                  </h5>
                  <div className='flex flex-col gap-[14px]'>
                    {siteConfig('PROXIO_PRICING_1_FEATURES')
                      ?.split(',')
                      .map((feature, index) => {
                        return (
                          <p
                            key={index}
                            className='text-base text-body-color dark:text-dark-6'>
                            {feature}
                          </p>
                        )
                      })}
                  </div>
                </div>
                <SmartLink
                  href={siteConfig('PROXIO_PRICING_1_BUTTON_URL', '')}
                  className='inline-block rounded-md bg-primary px-7 py-3 text-center text-base font-medium text-white transition hover:bg-blue-dark'>
                  {siteConfig('PROXIO_PRICING_1_BUTTON_TEXT')}
                </SmartLink>
              </div>
            </div>

            {/* 第二个付费计划 */}
            <div className='w-full px-4 md:w-1/2 lg:w-1/3'>
              <div className='relative z-10 mb-10 overflow-hidden rounded-xl bg-white px-8 py-10 shadow-pricing dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-14'>
                <p
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed'
                  }}
                  className='absolute p-1 right-0 top-0 inline-block rounded-bl-md rounded-tl-md bg-primary text-base font-medium text-white tracking-wider'>
                  {siteConfig('PROXIO_PRICING_2_TAG')}
                </p>
                <span className='mb-5 block text-xl font-medium text-dark dark:text-white'>
                  {siteConfig('PROXIO_PRICING_2_TITLE')}
                </span>
                <h2 className='space-x-1 mb-11 text-4xl font-semibold text-dark dark:text-white xl:text-[42px] xl:leading-[1.21]'>
                  <span className='text-xl font-medium'>
                    {siteConfig('PROXIO_PRICING_2_PRICE_CURRENCY')}
                  </span>
                  <span className='-ml-1 -tracking-[2px]'>
                    {siteConfig('PROXIO_PRICING_2_PRICE')}
                  </span>
                  <span className='text-base font-normal text-body-color dark:text-dark-6'>
                    {siteConfig('PROXIO_PRICING_2_PRICE_PERIOD')}
                  </span>
                </h2>

                <div className='mb-[50px]'>
                  <h5 className='mb-5 text-lg font-medium text-dark dark:text-white'>
                    {siteConfig('PROXIO_PRICING_2_HEADER')}
                  </h5>
                  <div className='flex flex-col gap-[14px]'>
                    {siteConfig('PROXIO_PRICING_2_FEATURES')
                      ?.split(',')
                      .map((feature, index) => {
                        return (
                          <p
                            key={index}
                            className='text-base text-body-color dark:text-dark-6'>
                            {feature}
                          </p>
                        )
                      })}
                  </div>
                </div>
                <SmartLink
                  href={siteConfig('PROXIO_PRICING_2_BUTTON_URL', '')}
                  className='inline-block rounded-md bg-primary px-7 py-3 text-center text-base font-medium text-white transition hover:bg-blue-dark'>
                  {siteConfig('PROXIO_PRICING_2_BUTTON_TEXT')}
                </SmartLink>
              </div>
            </div>

            {/* 第三个付费计划 */}
            <div className='w-full px-4 md:w-1/2 lg:w-1/3'>
              <div className='relative z-10 mb-10 overflow-hidden rounded-xl bg-white px-8 py-10 shadow-pricing dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-14'>
                <span className='mb-5 block text-xl font-medium text-dark dark:text-white'>
                  {siteConfig('PROXIO_PRICING_3_TITLE')}
                </span>
                <h2 className='space-x-1 mb-11 text-4xl font-semibold text-dark dark:text-white xl:text-[42px] xl:leading-[1.21]'>
                  <span className='text-xl font-medium'>
                    {siteConfig('PROXIO_PRICING_3_PRICE_CURRENCY')}
                  </span>
                  <span className='-ml-1 -tracking-[2px]'>
                    {siteConfig('PROXIO_PRICING_3_PRICE')}
                  </span>
                  <span className='text-base font-normal text-body-color dark:text-dark-6'>
                    {siteConfig('PROXIO_PRICING_3_PRICE_PERIOD')}
                  </span>
                </h2>

                <div className='mb-[50px]'>
                  <h5 className='mb-5 text-lg font-medium text-dark dark:text-white'>
                    {siteConfig('PROXIO_PRICING_3_HEADER')}
                  </h5>
                  <div className='flex flex-col gap-[14px]'>
                    {siteConfig('PROXIO_PRICING_3_FEATURES')
                      ?.split(',')
                      .map((feature, index) => {
                        return (
                          <p
                            key={index}
                            className='text-base text-body-color dark:text-dark-6'>
                            {feature}
                          </p>
                        )
                      })}
                  </div>
                </div>
                <SmartLink
                  href={siteConfig('PROXIO_PRICING_3_BUTTON_URL', '')}
                  className='inline-block rounded-md bg-primary px-7 py-3 text-center text-base font-medium text-white transition hover:bg-blue-dark'>
                  {siteConfig('PROXIO_PRICING_3_BUTTON_TEXT')}
                </SmartLink>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- ====== Pricing Section End --> */}
    </>
  )
}
