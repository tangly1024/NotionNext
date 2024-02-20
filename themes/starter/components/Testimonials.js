/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import { siteConfig } from '@/lib/config';
import { loadExternalResource } from '@/lib/utils';
import { useEffect } from 'react';
import CONFIG from '../config';
import { SVGLeftArrow } from './svg/SVGLeftArrow';
import { SVGRightArrow } from './svg/SVGRightArrow';

/**
 * 一些外部js
 */
const loadExternal = async () => {
  await loadExternalResource('https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.css', 'css');
  await loadExternalResource('https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js', 'js');

  const Swiper = window.Swiper
  if (!Swiper) {
    return
  }
  // Testimonial
  const testimonialSwiper = new Swiper('.testimonial-carousel', {
    slidesPerView: 1,
    spaceBetween: 30,

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },

    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      1280: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  });
  console.log('swiper', testimonialSwiper)
};

export const Testimonials = () => {
  useEffect(() => {
    loadExternal()
  }, [])
  // 用户评分
  const ratings = [1, 2, 3, 4, 5];
  return <>
    {/* <!-- ====== Testimonial Section Start --> */}
    <section
      id="testimonials"
      class="overflow-hidden bg-gray-1 py-20 dark:bg-dark-2 md:py-[120px]"
    >
      <div class="container mx-auto">
        <div class="-mx-4 flex flex-wrap justify-center">
          <div class="w-full px-4">
            <div class="mx-auto mb-[60px] max-w-[485px] text-center">
              <span class="mb-2 block text-lg font-semibold text-primary">
                {siteConfig('STARTER_TESTIMONIALS_TITLE', null, CONFIG)}
              </span>
              <h2
                class="mb-3 text-3xl font-bold leading-[1.2] text-dark dark:text-white sm:text-4xl md:text-[40px]"
              >
                {siteConfig('STARTER_TESTIMONIALS_TEXT_1', null, CONFIG)}
              </h2>
              <p class="text-base text-body-color dark:text-dark-6">
                {siteConfig('STARTER_TESTIMONIALS_TEXT_2', null, CONFIG)}
              </p>
            </div>
          </div>
        </div>

        <div class="-m-5">
          <div class="swiper testimonial-carousel common-carousel p-5">
            <div class="swiper-wrapper">

            {/* 用户评价卡牌 */}
            {CONFIG.STARTER_TESTIMONIALS_ITEMS.map((item, index) => {
              return <div key={index} class="swiper-slide">
                    <div
                        class="rounded-xl bg-white px-4 py-[30px] shadow-testimonial dark:bg-dark sm:px-[30px]"
                    >
                        <div class="mb-[18px] flex items-center gap-[2px]">
                        {ratings.map((rating, index) => (
                            <img key={index} alt="star icon"// 为每个图片设置唯一的 key 属性
                            src={siteConfig('STARTER_TESTIMONIALS_STAR_ICON', null, CONFIG)}/>
                        ))}
                        </div>

                        <p class="mb-6 text-base text-body-color dark:text-dark-6">
                        “{item.STARTER_TESTIMONIALS_ITEM_TEXT}”
                        </p>

                        <a href={item.STARTER_TESTIMONIALS_ITEM_URL} class="flex items-center gap-4">
                            <div class="h-[50px] w-[50px] overflow-hidden rounded-full">
                                <img
                                src={item.STARTER_TESTIMONIALS_ITEM_AVATAR}
                                alt="author"
                                class="h-[50px] w-[50px] overflow-hidden rounded-full object-cover"
                                />
                            </div>

                            <div>
                                <h3
                                class="text-sm font-semibold text-dark dark:text-white"
                                >
                                {item.STARTER_TESTIMONIALS_ITEM_NICKNAME}
                                </h3>
                                <p class="text-xs text-body-secondary">
                                    {item.STARTER_TESTIMONIALS_ITEM_DESCRIPTION}
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            })}

            </div>

            {/* 切换按钮  */}
            <div class="mt-[60px] flex items-center justify-center gap-1">
              <div class="swiper-button-prev">
                <SVGLeftArrow/>
              </div>
              <div class="swiper-button-next">
                <SVGRightArrow/>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
    {/* <!-- ====== Testimonial Section End --> */}
    </>
}
