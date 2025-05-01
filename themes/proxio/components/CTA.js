import { siteConfig } from '@/lib/config'
import Link from 'next/link'

/**
 * CTA，用于创建一个呼吁用户行动的部分（Call To Action，简称 CTA）。
 * 该组件通过以下方式激励用户进行特定操作
 * 用户的公告栏内容将在此显示
 **/
export const CTA = () => {
  const enable = siteConfig('PROXIO_CTA_ENABLE')
  if (!enable) {
    return null
  }
  return (
    <>
      {/* <!-- ====== CTA Section Start --> */}
      <section className='relative z-10 overflow-hidden bg-gray-1 dark:bg-black py-20 lg:py-[115px]'>
        <div className='container mx-auto'>
          <div className='relative overflow-hidden'>
            <div className='-mx-4 flex flex-wrap items-stretch'>
              <div className='w-full px-4 mb-2'>
                <div className='mx-auto max-w-[570px] text-center wow fadeInUp' data-wow-delay='.2s'>
                  <div>
                    <span className='px-3 py-0.5 rounded-2xl dark:bg-dark-1 border border-gray-200 dark:border-[#333333] dark:text-white'>
                      {siteConfig('PROXIO_CTA_TITLE')}
                    </span>
                  </div>
                  <h2 className='mb-2.5 text-3xl font-bold dark:text-white md:text-[38px] md:leading-[1.44]'>

                    <span className='text-3xl font-normal md:text-[40px]'>
                      {siteConfig('PROXIO_CTA_TITLE_2')}
                    </span>
                  </h2>
                  <p className='mx-auto mb-6 max-w-[515px] text-base leading-[1.5] dark:text-white'>
                    {siteConfig('PROXIO_CTA_DESCRIPTION')}
                  </p>
                  {siteConfig('PROXIO_CTA_BUTTON') && (
                    <>
                      <Link
                        href={siteConfig('PROXIO_CTA_BUTTON_URL', '')}
                        className='inline-flex items-center justify-center rounded-2xl bg-white px-7 py-[14px] text-center text-base font-medium text-dark shadow-1 transition duration-300 ease-in-out hover:bg-gray-2'>
                        {siteConfig('PROXIO_CTA_BUTTON_TEXT')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
      {/* <!-- ====== CTA Section End --> */}
    </>
  )
}
