import { siteConfig } from '@/lib/config';
import { useEffect } from 'react'
import CONFIG from '../config';
import { SVGQuestion } from './svg/SVGQuestion';
import { SVGCircleBG } from './svg/SVGCircleBG';

export const FAQ = () => {
  useEffect(() => {
    // ===== Faq accordion
    const faqs = document.querySelectorAll('.single-faq');
    faqs.forEach((el) => {
      el.querySelector('.faq-btn').addEventListener('click', () => {
        el.querySelector('.icon').classList.toggle('rotate-180');
        el.querySelector('.faq-content').classList.toggle('hidden');
      });
    });
  })
  return <>
      {/* <!-- ====== FAQ Section Start --> */}
      <section
      className="relative z-20 overflow-hidden bg-white pb-8 pt-20 dark:bg-dark lg:pb-[50px] lg:pt-[120px]"
    >
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[520px] text-center">
              <span className="mb-2 block text-lg font-semibold text-primary">
                {siteConfig('STARTER_FAQ_TITLE', null, CONFIG)}
              </span>
              <h2
                className="mb-3 text-3xl font-bold leading-[1.2] text-dark dark:text-white sm:text-4xl md:text-[40px]"
              >
                {siteConfig('STARTER_FAQ_TEXT_1', null, CONFIG)}
              </h2>
              <p
                className="mx-auto max-w-[485px] text-base text-body-color dark:text-dark-6"
              >
                {siteConfig('STARTER_FAQ_TEXT_2', null, CONFIG)}
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-1/2">
            <div className="mb-12 flex lg:mb-[70px]">
              <div
                className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-primary text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]"
              >
                <SVGQuestion/>
              </div>
              <div className="w-full">
                <h3
                  className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                >
                 {siteConfig('STARTER_FAQ_1_QUESTION', null, CONFIG)}
                </h3>
                <p dangerouslySetInnerHTML={
                    { __html: siteConfig('STARTER_FAQ_1_ANSWER', null, CONFIG) }
                } className="text-base text-body-color dark:text-dark-6">
                </p>
              </div>
            </div>
            <div className="mb-12 flex lg:mb-[70px]">
              <div
                className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-primary text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]"
              >
                <SVGQuestion/>
              </div>
              <div className="w-full">
              <h3
                  className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                >
                 {siteConfig('STARTER_FAQ_2_QUESTION', null, CONFIG)}
                </h3>
                <p dangerouslySetInnerHTML={
                    { __html: siteConfig('STARTER_FAQ_2_ANSWER', null, CONFIG) }
                } className="text-base text-body-color dark:text-dark-6">
                </p>
              </div>
            </div>
          </div>

          <div className="w-full px-4 lg:w-1/2">
            <div className="mb-12 flex lg:mb-[70px]">
              <div
                className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-primary text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]"
              >
                <SVGQuestion/>
              </div>
              <div className="w-full">
              <h3
                  className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                >
                 {siteConfig('STARTER_FAQ_3_QUESTION', null, CONFIG)}
                </h3>
                <p dangerouslySetInnerHTML={
                    { __html: siteConfig('STARTER_FAQ_3_ANSWER', null, CONFIG) }
                } className="text-base text-body-color dark:text-dark-6">
                </p>
              </div>
            </div>
            <div className="mb-12 flex lg:mb-[70px]">
              <div
                className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-primary text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]"
              >
                <SVGQuestion/>
              </div>
              <div className="w-full">
              <h3
                  className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                >
                 {siteConfig('STARTER_FAQ_4_QUESTION', null, CONFIG)}
                </h3>
                <p dangerouslySetInnerHTML={
                    { __html: siteConfig('STARTER_FAQ_4_ANSWER', null, CONFIG) }
                } className="text-base text-body-color dark:text-dark-6">
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    {/* 背景图案 */}
      <div>
        <span className="absolute left-4 top-4 -z-[1]">
          <SVGCircleBG/>
        </span>
        <span className="absolute bottom-4 right-4 -z-[1]">
            <SVGCircleBG/>
        </span>
      </div>
    </section>
    {/* <!-- ====== FAQ Section End --> */}
    </>
}
