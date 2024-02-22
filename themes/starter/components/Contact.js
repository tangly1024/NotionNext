import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { SVGLocation } from './svg/SVGLocation'
import { SVGEmail } from './svg/SVGEmail'

/* eslint-disable react/no-unescaped-entities */
export const Contact = () => {
  return <>
    {/* <!-- ====== Contact Start ====== --> */}
    <section id="contact" className="relative py-20 md:py-[120px]">
      <div
        className="absolute left-0 top-0 -z-[1] h-full w-full dark:bg-dark"
      ></div>
      <div
        className="absolute left-0 top-0 -z-[1] h-1/2 w-full bg-[#E9F9FF] dark:bg-dark-700 lg:h-[45%] xl:h-1/2"
      ></div>
      <div className="container px-4">
        <div className="-mx-4 flex flex-wrap items-center">

          {/* 联系方式左侧文字 */}
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div className="ud-contact-content-wrapper">
              <div className="ud-contact-title mb-12 lg:mb-[150px]">
                <span
                  className="mb-6 block text-base font-medium text-dark dark:text-white"
                >
                  {siteConfig('STARTER_CONTACT_TITLE', null, CONFIG)}
                </span>
                <h2
                  className="max-w-[260px] text-[35px] font-semibold leading-[1.14] text-dark dark:text-white"
                >
                  {siteConfig('STARTER_CONTACT_TEXT', null, CONFIG)}
                </h2>
              </div>
              <div className="mb-12 flex flex-wrap justify-between lg:mb-0">
                <div className="mb-8 flex w-[330px] max-w-full">
                  <div className="mr-6 text-[32px] text-primary">
                    <SVGLocation/>
                  </div>
                  <div>
                    <h5
                      className="mb-[18px] text-lg font-semibold text-dark dark:text-white"
                    >
                      {siteConfig('STARTER_CONTACT_LOCATION_TITLE', null, CONFIG)}
                    </h5>
                    <p className="text-base text-body-color dark:text-dark-6">
                      {siteConfig('STARTER_CONTACT_LOCATION_TEXT', null, CONFIG)}
                    </p>
                  </div>
                </div>
                <div className="mb-8 flex w-[330px] max-w-full">
                  <div className="mr-6 text-[32px] text-primary">
                    <SVGEmail/>
                  </div>
                  <div>
                    <h5
                      className="mb-[18px] text-lg font-semibold text-dark dark:text-white"
                    >
                    {siteConfig('STARTER_CONTACT_EMAIL_TITLE', null, CONFIG)}
                    </h5>
                    <p className="text-base text-body-color dark:text-dark-6">
                    {siteConfig('STARTER_CONTACT_EMAIL_TEXT', null, CONFIG)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 联系方式右侧留言 */}
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <div
              className="wow fadeInUp rounded-lg bg-white px-8 py-10 shadow-testimonial dark:bg-dark-2 dark:shadow-none sm:px-10 sm:py-12 md:p-[60px] lg:p-10 lg:px-10 lg:py-12 2xl:p-[60px]"
              data-wow-delay=".2s"
            >
              <h3
                className="mb-8 text-2xl font-semibold text-dark dark:text-white md:text-[28px] md:leading-[1.42]"
              >
                {siteConfig('STARTER_CONTACT_MSG_TITLE', null, CONFIG)}
              </h3>
              <form>
                <div className="mb-[22px]">
                  <label
                    // for="fullName"
                    className="mb-4 block text-sm text-body-color dark:text-dark-6">
                    {siteConfig('STARTER_CONTACT_MSG_NAME', null, CONFIG)}*
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Adam Gelius"
                    className="w-full border-0 border-b border-[#f1f1f1] bg-transparent pb-3 text-body-color placeholder:text-body-color/60 focus:border-primary focus:outline-none dark:border-dark-3 dark:text-dark-6"
                  />
                </div>
                <div className="mb-[22px]">
                  <label
                    // for="email"
                    className="mb-4 block text-sm text-body-color dark:text-dark-6">
                    {siteConfig('STARTER_CONTACT_MSG_EMAIL', null, CONFIG)}*
                  </label >
                  <input
                    type="email"
                    name="email"
                    placeholder="example@yourmail.com"
                    className="w-full border-0 border-b border-[#f1f1f1] bg-transparent pb-3 text-body-color placeholder:text-body-color/60 focus:border-primary focus:outline-none dark:border-dark-3 dark:text-dark-6"
                  />
                </div>
                <div className="mb-[22px]">
                    <label
                    // for="phone"
                    className="mb-4 block text-sm text-body-color dark:text-dark-6">
                    {siteConfig('STARTER_CONTACT_MSG_PHONE', null, CONFIG)}*
                    </label >
                  <input
                    type="text"
                    name="phone"
                    placeholder="+885 1254 5211 552"
                    className="w-full border-0 border-b border-[#f1f1f1] bg-transparent pb-3 text-body-color placeholder:text-body-color/60 focus:border-primary focus:outline-none dark:border-dark-3 dark:text-dark-6"
                  />
                </div>
                <div className="mb-[30px]">
                  <label
                    // for="message"
                    className="mb-4 block text-sm text-body-color dark:text-dark-6">
                    {siteConfig('STARTER_CONTACT_MSG_TEXT', null, CONFIG)}*
                    </label >
                  <textarea
                    name="message"
                    rows="1"
                    placeholder="type your message here"
                    className="w-full resize-none border-0 border-b border-[#f1f1f1] bg-transparent pb-3 text-body-color placeholder:text-body-color/60 focus:border-primary focus:outline-none dark:border-dark-3 dark:text-dark-6"
                  ></textarea>
                </div>
                <div className="mb-0">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-3 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-blue-dark"
                  >
                    {siteConfig('STARTER_CONTACT_MSG_SEND', null, CONFIG)}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
    {/* <!-- ====== Contact End ====== --> */}

</>
}
