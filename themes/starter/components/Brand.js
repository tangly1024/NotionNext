/* eslint-disable @next/next/no-img-element */

import CONFIG from '../config'

/**
 * 合作伙伴
 * @returns
 */
export const Brand = () => {
  return <>

    {/* <!-- ====== Brands Section Start --> */}
    <section className="pb-20 dark:bg-dark">
      <div className="container px-4">
        <div
          className="-mx-4 flex flex-wrap items-center justify-center gap-8 xl:gap-11"
        >
          {CONFIG.STARTER_BRANDS?.map((item, index) => {
            return <a key={index} href={item.URL}>
            <img
              src={item.IMAGE}
              alt={item.TITLE}
              className="dark:hidden"
            />
            <img
              src={item.IMAGE_WHITE}
              alt={item.TITLE}
              className="hidden dark:block"
            />
          </a>
          })}
        </div>
      </div>
    </section>
    {/* <!-- ====== Brands Section End --> */}
    </>
}
