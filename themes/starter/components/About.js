/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import YouTubeLoader from './YouTubeLoader'

/**
 * 首页的关于模块
 */
export const About = () => {
  return (
    <>
      <section className='py-12 lg:py-24 xl:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='grid gap-6 lg:grid-cols-2 lg:gap-12'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                  {siteConfig('STARTER_ABOUT_1_TITLE_1', null, CONFIG)}
                </h2>
                <p className='text-gray-500 dark:text-gray-400'>
                  {siteConfig('STARTER_ABOUT_1_TEXT_1', null, CONFIG)}
                </p>
              </div>
              <div className='mx-auto aspect-video overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800'>
                <div className='iframe-container'>
                  <YouTubeLoader
                    width='610'
                    height='342'
                    videoURL='https://www.youtube.com/embed/kbiJlsHifpM'
                    imgPath='/images/howitworks.webp'
                  />
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
