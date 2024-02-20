/* eslint-disable @next/next/no-img-element */
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { SVGAvatarBG } from './svg/SVGAvatarBG'
import { SVGFacebook } from './svg/SVGFacebook'
import { SVGTwitter } from './svg/SVGTwitter'
import { SVGInstagram } from './svg/SVGInstagram'

export const Team = () => {
  return <>
        {/* <!-- ====== Team Section Start --> */}
        <section
      id="team"
      class="overflow-hidden bg-gray-1 pb-12 pt-20 dark:bg-dark-2 lg:pb-[90px] lg:pt-[120px]"
    >
      <div class="container mx-auto">
        <div class="-mx-4 flex flex-wrap">
          <div class="w-full px-4">
            <div class="mx-auto mb-[60px] max-w-[485px] text-center">
              <span class="mb-2 block text-lg font-semibold text-primary">
                {siteConfig('STARTER_TEAM_TITLE', null, CONFIG)}
              </span>
              <h2
                class="mb-3 text-3xl font-bold leading-[1.2] text-dark dark:text-white sm:text-4xl md:text-[40px]"
              >
                {siteConfig('STARTER_TEAM_TEXT_1', null, CONFIG)}
              </h2>
              <p dangerouslySetInnerHTML={
                    { __html: siteConfig('STARTER_TEAM_TEXT_2', null, CONFIG) }
                } class="text-base text-body-color dark:text-dark-6">
              </p>
            </div>
          </div>
        </div>

        {/* 团队成员排列矩阵 */}
        <div class="-mx-4 flex flex-wrap justify-center">
            {CONFIG.STARTER_TEAM_ITEMS.map((item, index) => {
              return <div key={index} class="w-full px-4 sm:w-1/2 lg:w-1/4 xl:w-1/4">
                <div
                  class="group mb-8 rounded-xl bg-white px-5 pb-10 pt-12 shadow-testimonial dark:bg-dark dark:shadow-none"
                >
                  {/* 头像 */}
                  <div class="relative z-10 mx-auto mb-5 h-[120px] w-[120px]">
                    <img
                      src={item.STARTER_TEAM_ITEM_AVATAR}
                      alt="team image"
                      class="h-[120px] w-[120px] rounded-full"
                    />
                    <span
                      class="absolute bottom-0 left-0 -z-10 h-10 w-10 rounded-full bg-secondary opacity-0 transition-all group-hover:opacity-100"
                    ></span>
                    <span
                      class="absolute right-0 top-0 -z-10 opacity-0 transition-all group-hover:opacity-100"
                    >
                      <SVGAvatarBG/>
                    </span>
                  </div>

                  {/* 文字介绍 */}
                  <div class="text-center">

                    <h4
                      class="mb-1 text-lg font-semibold text-dark dark:text-white"
                    >
                      {item.STARTER_TEAM_ITEM_NICKNAME}
                    </h4>

                    <p class="mb-5 text-sm text-body-color dark:text-dark-6">
                    {item.STARTER_TEAM_ITEM_DESCRIPTION}
                    </p>

                    {/* 社交链接 */}
                    <div class="flex items-center justify-center gap-5">
                      <a class="text-dark-6 hover:text-primary" >
                        <SVGFacebook/>
                      </a>
                      <a class="text-dark-6 hover:text-primary" >
                        <SVGTwitter/>
                      </a>
                      <a class="text-dark-6 hover:text-primary" >
                        <SVGInstagram/>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            })}

        </div>
      </div>
    </section>
    {/* <!-- ====== Team Section End --> */}
    </>
}
