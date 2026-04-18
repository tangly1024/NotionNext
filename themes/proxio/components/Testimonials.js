/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useEffect, useRef } from 'react'

/**
 * 用户反馈
 * @returns
 */
export const Testimonials = () => {
  const PROXIO_TESTIMONIALS_ITEMS = siteConfig('PROXIO_TESTIMONIALS_ITEMS', [])

  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    let scrollAmount = 0
    const scrollSpeed = 1 // 滚动速度

    const scroll = () => {
      if (scrollContainer) {
        scrollAmount += scrollSpeed
        scrollContainer.scrollTop = scrollAmount

        // 如果滚动到内容的一半，立即重置滚动位置
        if (scrollAmount >= scrollContainer.scrollHeight / 2) {
          scrollAmount = 0
        }
      }
      requestAnimationFrame(scroll)
    }

    scroll()

    return () => cancelAnimationFrame(scroll)
  }, [])

  return (
    <>
      {/* <!-- ====== Testimonial Section Start --> */}
      <section
        id="testimonials"
        className="overflow-hidden bg-gray-1 py-20 dark:bg-black md:py-[60px]"
      >
        <div className="container mx-auto flex flex-col md:flex-row items-start gap-10">
          {/* 左侧标题和描述 */}
          <div className="flex flex-col space-y-8 w-full md:w-1/2 text-center md:text-left">

            <div>
              <span className='px-3 py-0.5 rounded-2xl dark:bg-dark-1 border border-gray-200 dark:border-[#333333] dark:text-white'>
                {siteConfig('PROXIO_TESTIMONIALS_TITLE')}
              </span>
            </div>
            <h2 className="text-3xl font-bold leading-[1.2] text-dark dark:text-white sm:text-4xl md:text-[40px]">
              {siteConfig('PROXIO_TESTIMONIALS_TEXT_1')}
            </h2>
            <p className="text-base text-body-color dark:text-dark-6">
              {siteConfig('PROXIO_TESTIMONIALS_TEXT_2')}
            </p>

            <div className='mt-8 w-full flex justify-start items-center'>
              <SmartLink
                href={siteConfig('PROXIO_TESTIMONIALS_BUTTON_URL', '')}
                className='px-4 py-2 rounded-3xl border dark:border-gray-200 border-[#333333] text-base font-medium text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-white dark:hover:text-black duration-200'>
                {siteConfig('PROXIO_TESTIMONIALS_BUTTON_TEXT')}
                <i className="pl-4 fa-solid fa-arrow-right"></i>
              </SmartLink>
            </div>
          </div>


          {/* 右侧用户评价卡牌 */}
          <div
            className="w-full md:w-1/2 h-[600px] overflow-hidden relative"
            ref={scrollContainerRef}
          >
            <div className="absolute top-0 left-0 w-full">
              {PROXIO_TESTIMONIALS_ITEMS?.map((item, index) => (
                <div
                  key={index}
                  className="mb-6 rounded-xl bg-white px-4 py-[30px] shadow-testimonial border dark:bg-[#0E0E0E] sm:px-[30px] dark:border-[#333333] "
                >
                  <p className="mb-6 text-base text-body-color dark:text-dark-6">
                    “{item.PROXIO_TESTIMONIALS_ITEM_TEXT}”
                  </p>
                  <a
                    href={item.PROXIO_TESTIMONIALS_ITEM_URL}
                    className="flex items-center gap-4"
                  >
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                      <img
                        src={item.PROXIO_TESTIMONIALS_ITEM_AVATAR}
                        alt="author"
                        className="h-[50px] w-[50px] overflow-hidden rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-dark dark:text-white">
                        {item.PROXIO_TESTIMONIALS_ITEM_NICKNAME}
                      </h3>
                      <p className="text-xs text-body-secondary">
                        {item.PROXIO_TESTIMONIALS_ITEM_DESCRIPTION}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
              {/* 克隆一份内容，用于无缝滚动 */}
              {PROXIO_TESTIMONIALS_ITEMS?.map((item, index) => (
                <div
                  key={`clone-${index}`}
                  className="mb-6 rounded-xl bg-white px-4 py-[30px] shadow-testimonial border dark:bg-[#0E0E0E] sm:px-[30px] dark:border-[#333333] "
                >
                  <p className="mb-6 text-base text-body-color dark:text-dark-6">
                    “{item.PROXIO_TESTIMONIALS_ITEM_TEXT}”
                  </p>
                  <a
                    href={item.PROXIO_TESTIMONIALS_ITEM_URL}
                    className="flex items-center gap-4"
                  >
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                      <img
                        src={item.PROXIO_TESTIMONIALS_ITEM_AVATAR}
                        alt="author"
                        className="h-[50px] w-[50px] overflow-hidden rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-dark dark:text-white">
                        {item.PROXIO_TESTIMONIALS_ITEM_NICKNAME}
                      </h3>
                      <p className="text-xs text-body-secondary">
                        {item.PROXIO_TESTIMONIALS_ITEM_DESCRIPTION}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>


        </div>
      </section>
      {/* <!-- ====== Testimonial Section End --> */}
    </>
  )
}