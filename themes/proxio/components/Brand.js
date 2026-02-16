/* eslint-disable @next/next/no-img-element */

import { siteConfig } from '@/lib/config'
import { useEffect, useRef } from 'react'

/**
 * 合作伙伴滚动组件
 * @returns
 */
export const Brand = () => {
  const brands = siteConfig('PROXIO_BRANDS', [])

  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current

    let scrollAmount = 0
    const scrollSpeed = 1 // 滚动速度

    const scroll = () => {
      if (scrollContainer) {
        scrollAmount += scrollSpeed
        scrollContainer.scrollLeft = scrollAmount

        // 如果滚动到内容的一半，立即重置滚动位置
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
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
      {/* <!-- ====== Brands Section Start --> */}
      <section id='brand' className='py-12 dark:bg-dark'>
        <div
          className='overflow-hidden whitespace-nowrap container mx-auto p-3 border rounded-2xl border-gray-200 dark:border-[#333333]'
          ref={scrollContainerRef}
        >
          <div className='inline-block'>
            {brands?.map((item, index) => (
              <span
                key={index}
                className='mx-8 text-lg font-semibold text-gray-700 dark:text-gray-300'
              >
                {item}
              </span>
            ))}
            {/* 克隆一份内容，用于无缝滚动 */}
            {brands.map((item, index) => (
              <span
                key={`clone-${index}`}
                className='mx-8 text-lg font-semibold text-gray-700 dark:text-gray-300'
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
      {/* <!-- ====== Brands Section End --> */}
    </>
  )
}