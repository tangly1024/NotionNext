import { siteConfig } from '@/lib/config'
import { useState } from 'react'
import { SVGCircleBG } from './svg/SVGCircleBG'

/**
 * 问答
 * @returns
 */
export const FAQ = () => {
  const FAQS = siteConfig('PROXIO_FAQS', [])

  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {/* <!-- ====== FAQ Section Start --> */}
      <section className="relative overflow-hidden bg-white pb-8 pt-20 dark:bg-dark lg:pb-[50px] lg:pt-[120px]">
        <div className='max-w-2xl mx-auto wow fadeInUp' data-wow-delay='.2s'>
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto mb-[60px] max-w-[520px] text-center flex flex-col space-y-4">
                <div>
                  <span className='px-3 py-0.5 rounded-2xl dark:bg-dark-1 border border-gray-200 dark:border-[#333333] dark:text-white'>
                    {siteConfig('PROXIO_FAQ_TITLE')}
                  </span>
                </div>
                <h2 className="mb-3 text-3xl font-bold leading-[1.2] text-dark dark:text-white sm:text-4xl md:text-[40px]">
                  {siteConfig('PROXIO_FAQ_TEXT_1')}
                </h2>
                <p className="mx-auto max-w-[485px] text-base text-body-color dark:text-dark-6">
                  {siteConfig('PROXIO_FAQ_TEXT_2')}
                </p>
              </div>
            </div>
          </div>

          {/* FAQ 列表 */}
          <div className='-mx-4 flex flex-wrap space-y-4 wow fadeInUp' data-wow-delay='.2s'>
            {FAQS?.map((faq, index) => (
              <div
                key={index}
                className="w-full px-4 cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <div className="p-4 border rounded-lg dark:bg-[#0E0E0E] bg-white dark:bg-dark-1 border-gray-200 dark:border-[#333333]">
                  {/* 问题部分 */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-dark dark:text-white">
                      {faq.q}
                    </h3>
                    <i
                      className={`fas fa-chevron-down text-gray-500 dark:text-gray-300 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                        }`}
                    />
                  </div>
                  {/* 答案部分 */}
                  <div
                    className={`mt-4 text-base text-body-color dark:text-dark-6 transition-all duration-300 overflow-hidden ${openIndex === index ? 'max-h-screen' : 'max-h-0'
                      }`}
                    dangerouslySetInnerHTML={{ __html: faq.a }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 背景图案 */}
        <div>
          <span className="absolute left-4 top-4 -z-[1]">
            <SVGCircleBG />
          </span>
          <span className="absolute bottom-4 right-4 -z-[1]">
            <SVGCircleBG />
          </span>
        </div>
      </section>
      {/* <!-- ====== FAQ Section End --> */}
    </>
  )
}