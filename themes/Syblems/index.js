'use client'

/**
 * 这是一个空白主题，方便您用作创建新主题时的模板，从而开发出您自己喜欢的主题
 * 1. 禁用了代码质量检查功能，提高了代码的宽容度；您可以使用标准的html写法
 * 2. 内容大部分是在此文件中写死，notion数据从props参数中传进来
 * 3. 您可在此网站找到更多喜欢的组件 https://.tailwind-kit.com/
 */

import { useEffect } from 'react'

import CONFIG from './config'
import { loadWowJS } from '@/lib/plugins/wow'

/**
 * 布局框架
 * Landing-2 主题用作产品落地页展示
 * 结合Stripe或者lemonsqueezy插件可以成为saas支付订阅
 * https://play-tailwind.tailgrids.com/
 * @param {*} props
 * @returns
 */
const LayoutBase = props => {

  // 加载wow动画
  useEffect(() => {
    loadWowJS()
  }, [])

  return (

    <main class="relative h-screen overflow-hidden font-mono bg-white dark:bg-gray-800">
      <div class="absolute hidden md:block -bottom-32 -left-32 w-96 h-96">
        <div class="absolute z-20 text-xl text-extrabold right-12 text-start top-1/4">
            <span class="text-7xl">
                🎨
            </span>
          <p>
            Got a project ?
          </p>
          <a href="#" className="underline">
            Let&#x27;s talk
          </a>
        </div>
        <svg viewBox="0 0 200 200" class="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FFDBB9"
                d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,74.1,43.2C66.7,57.2,57.6,70.6,45,78.1C32.4,85.6,16.2,87.1,0.7,85.9C-14.8,84.7,-29.6,80.9,-43.9,74.4C-58.3,67.9,-72,58.7,-79.8,45.9C-87.7,33,-89.5,16.5,-88.9,0.3C-88.4,-15.9,-85.4,-31.7,-78.1,-45.4C-70.8,-59.1,-59.1,-70.6,-45.3,-77.9C-31.6,-85.3,-15.8,-88.5,-0.3,-88.1C15.3,-87.6,30.5,-83.5,44.7,-76.4Z"
                transform="translate(100 100)">
          </path>
        </svg>
      </div>
      <header class="z-30 flex items-center w-full h-24 sm:h-32">
        <div class="container flex items-center justify-between px-6 mx-auto">
          <div class="flex items-center text-3xl font-black text-gray-800 uppercase dark:text-white">
            <svg width="25" height="25" viewBox="0 0 1792 1792" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1664 1504v-768q-32 36-69 66-268 206-426 338-51 43-83 67t-86.5 48.5-102.5 24.5h-2q-48 0-102.5-24.5t-86.5-48.5-83-67q-158-132-426-338-37-30-69-66v768q0 13 9.5 22.5t22.5 9.5h1472q13 0 22.5-9.5t9.5-22.5zm0-1051v-24.5l-.5-13-3-12.5-5.5-9-9-7.5-14-2.5h-1472q-13 0-22.5 9.5t-9.5 22.5q0 168 147 284 193 152 401 317 6 5 35 29.5t46 37.5 44.5 31.5 50.5 27.5 43 9h2q20 0 43-9t50.5-27.5 44.5-31.5 46-37.5 35-29.5q208-165 401-317 54-43 100.5-115.5t46.5-131.5zm128-37v1088q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-1088q0-66 47-113t113-47h1472q66 0 113 47t47 113z">
              </path>
            </svg>
            <span class="mt-1 ml-3 text-xs">
                    CHARLIE-PRO@DESIGN.COM
                </span>
          </div>
          <div class="flex items-center">
            <nav class="items-center hidden text-lg text-gray-800 uppercase font-sen dark:text-white lg:flex">
              <a href="#" className="flex px-6 py-2 hover:text-black">
                Works
              </a>
              <a href="#" className="flex px-6 py-2 hover:text-black">
                Resume
              </a>
              <a href="#" className="flex px-6 py-2 hover:text-black">
                Services
              </a>
              <a href="#" className="flex px-6 py-2 hover:text-black">
                Contact
              </a>
            </nav>
            <button className="flex flex-col ml-4 lg:hidden">
                    <span class="w-6 h-1 mb-1 bg-gray-800 dark:bg-white">
                    </span>
              <span class="w-6 h-1 mb-1 bg-gray-800 dark:bg-white">
                    </span>
              <span class="w-6 h-1 mb-1 bg-gray-800 dark:bg-white">
                    </span>
            </button>
          </div>
        </div>
      </header>
      <div class="relative z-20 flex items-center">
        <div class="container relative flex flex-col items-center justify-between px-6 py-4 mx-auto">
          <div class="flex flex-col">
            <img src="/images/person/11.webp" className="mx-auto rounded-full w-28" />
            <p class="my-6 text-3xl text-center dark:text-white">
              Hi, I&#x27;m Charlie 🤘
            </p>
            <h2 class="max-w-3xl py-2 mx-auto text-5xl font-bold text-center text-gray-800 md:text-6xl dark:text-white">
              Building digital products, brands, and experiences.
            </h2>
            <div class="flex items-center justify-center mt-4">
              <a href="#"
                 className="px-4 py-2 my-2 text-gray-800 uppercase bg-transparent border-2 border-gray-800 md:mt-16 dark:text-gray-800 dark:bg-white hover:dark:bg-gray-100 dark:text-white hover:bg-gray-800 hover:text-white text-md">
                CONNECT WITH ME
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>

  )
}


/**
 * 404页面
 * @param {*} props
 * @returns
 */
export {
  LayoutBase,
  CONFIG as THEME_CONFIG
}
