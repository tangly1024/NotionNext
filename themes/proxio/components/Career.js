/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { siteConfig } from '@/lib/config'
import Link from 'next/link'

/**
 * 首页的生涯模块
 */
export const Career = () => {
  const Careers = siteConfig('PROXIO_CAREERS')
  return (
    <>
      {/* <!-- ====== About Section Start --> */}
      <section
        id='about'
        className='bg-gray-1 pb-8 pt-20 dark:bg-black lg:pb-[70px] lg:pt-[120px]'>
        <div className='container'>
          <div className='wow fadeInUp' data-wow-delay='.2s'>
            {/* 左侧的文字说明板块 */}
            <div className='w-full px-4 lg:w-1/2'>
              <div className='mb-12 max-w-[540px] lg:mb-0'>
                <span className='px-3 py-0.5 rounded-2xl dark:bg-dark-1 border border-gray-200 dark:border-[#333333] dark:text-white'>
                  {siteConfig('PROXIO_CAREER_TITLE')}
                </span>
                <h2
                  className='mb-10 text-3xl font-semibold leading-relaxed dark:text-dark-6'
                >{siteConfig('PROXIO_CAREER_TEXT')}</h2>
              </div>
            </div>

            <div className='-mx-4 flex flex-wrap items-center px-4'>
              {Careers?.map((item, index) => {
                return <CareerItem key={index} {...item} />
              })}
            </div>
          </div>
        </div>
      </section>
      {/* <!-- ====== About Section End --> */}
    </>
  )
}


// 生涯内容
const CareerItem = ({ title, bio, text }) => {
  return <div className='w-full border-b mb-6 border-gray-200 dark:border-[#333333] px-4 flex justify-between wow fadeInUp'>
    <div className='flex item-start flex-col items-start w-full' data-wow-delay='.1s'>
      <h4 className='mb-3 text-xl text-dark dark:text-white'>
        <span className='font-bold mr-4'>{title}</span>
        <span className='text-sm'>{bio}</span>
      </h4>

    </div>
    <div className='w-full'>
      <p className='mb-8 text-body-color dark:text-dark-6 lg:mb-9'>
        {text}
      </p>
    </div>
  </div>

}