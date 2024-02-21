/* eslint-disable @next/next/no-img-element */
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

export const Blog = () => {
  return <>
        {/* <!-- ====== Blog Section Start --> */}
        <section class="bg-white pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]">
        <div class="container mx-auto">
            {/* 区块标题文字 */}
            <div class="-mx-4 flex flex-wrap justify-center">
                <div class="w-full px-4">
                    <div class="mx-auto mb-[60px] max-w-[485px] text-center">
                    <span class="mb-2 block text-lg font-semibold text-primary">
                        {siteConfig('STARTER_BLOG_TITLE', null, CONFIG)}
                    </span>
                    <h2
                        class="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]"
                    >
                        {siteConfig('STARTER_BLOG_TEXT_1', null, CONFIG)}
                    </h2>
                    <p dangerouslySetInnerHTML={
                            { __html: siteConfig('STARTER_BLOG_TEXT_2', null, CONFIG) }
                        } class="text-base text-body-color dark:text-dark-6">

                    </p>
                    </div>
                </div>
            </div>
            {/* 博客列表 此处优先展示3片文章 */}
            <div class="-mx-4 flex flex-wrap">
                <div class="w-full px-4 md:w-1/2 lg:w-1/3">
                    <div class="wow fadeInUp group mb-10" data-wow-delay=".1s">
                    <div class="mb-8 overflow-hidden rounded-[5px]">
                        <a href="blog-details.html" class="block">
                        <img
                            src="/images/starter/blog/blog-01.jpg"
                            alt="image"
                            class="w-full transition group-hover:rotate-6 group-hover:scale-125"
                        />
                        </a>
                    </div>
                    <div>
                        <span
                        class="mb-6 inline-block rounded-[5px] bg-primary px-4 py-0.5 text-center text-xs font-medium leading-loose text-white"
                        >
                        Dec 22, 2023
                        </span>
                        <h3>
                        <a

                            class="mb-4 inline-block text-xl font-semibold text-dark hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl"
                        >
                            Meet AutoManage, the best AI management tools
                        </a>
                        </h3>
                        <p
                        class="max-w-[370px] text-base text-body-color dark:text-dark-6"
                        >
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                        </p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    {/* <!-- ====== Blog Section End --> */}
    </>
}
