/* eslint-disable @next/next/no-img-element */

import { Logo } from './Logo'
import { SVGCircleBg2 } from './svg/SVGCircleBG2'
import { SVGCircleBG3 } from './svg/SVGCircleBG3'
import { SVGFacebook } from './svg/SVGFacebook'
import { SVGGoogle } from './svg/SVGGoogle'
import { SVGTwitter } from './svg/SVGTwitter'

/**
 * 登录
 * @returns
 */
export const SignInForm = () => {
  return <>
      {/* <!-- ====== Forms Section Start --> */}
  <section className="bg-[#F4F7FF] py-14 lg:py-20 dark:bg-dark">
    <div className="container">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full px-4">
          <div
            className="wow fadeInUp relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white dark:bg-dark-2 py-14 px-8 text-center sm:px-12 md:px-[60px]"
            data-wow-delay=".15s">
            <div className="mb-10 text-center">
              <div href="#" className="mx-auto inline-block max-w-[160px]">
                <Logo/>
              </div>
            </div>

            {/* 表单内容 */}
            <form>
              <div className="mb-[22px]">
                <input type="email" placeholder="Email"
                  className="w-full px-5 py-3 text-base transition bg-transparent border rounded-md outline-none border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 placeholder:text-dark-6 focus:border-primary dark:focus:border-primary focus-visible:shadow-none" />
              </div>
              <div className="mb-[22px]">
                <input type="password" placeholder="Password"
                  className="w-full px-5 py-3 text-base transition bg-transparent border rounded-md outline-none border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 placeholder:text-dark-6 focus:border-primary dark:focus:border-primary focus-visible:shadow-none" />
              </div>
              <div className="mb-9">
                <input type="submit" value="Sign In"
                  className="w-full px-5 py-3 text-base text-white transition duration-300 ease-in-out border rounded-md cursor-pointer border-primary bg-primary hover:bg-blue-dark" />
              </div>
            </form>

            <span className="relative block text-center z-1 mb-7">
              <span className="absolute left-0 block w-full h-px -z-1 top-1/2 bg-stroke dark:bg-dark-3"></span>
              <span className="relative z-10 inline-block px-3 text-base bg-white dark:bg-dark-2 text-body-secondary">Connect With</span>
            </span>

            {/* 社交平台 */}
            <ul className="flex justify-between -mx-2 mb-9">
              <li className="w-full px-2">
                <a href="#"
                  className="flex h-11 items-center justify-center rounded-md bg-[#4064AC] transition hover:bg-opacity-90">
                 <SVGFacebook className='fill-white'/>
                </a>
              </li>
              <li className="w-full px-2">
                <a href="#"
                  className="flex h-11 items-center justify-center rounded-md bg-[#1C9CEA] transition hover:bg-opacity-90">
                  <SVGTwitter className='fill-white'/>
                </a>
              </li>
              <li className="w-full px-2">
                <a href="#"
                  className="flex h-11 items-center justify-center rounded-md bg-[#D64937] transition hover:bg-opacity-90">
                  <SVGGoogle className='fill-white'/>
                </a>
              </li>
            </ul>
            <a href="#" className="inline-block mb-2 text-base text-dark dark:text-white hover:text-primary dark:hover:text-primary">
              Forget Password?
            </a>
            <p className="text-base text-body-secondary">
              Not a member yet?
              <a href="signup.html" className="text-primary hover:underline">
                Sign Up
              </a>
            </p>

            <div>
              <span className="absolute top-1 right-1">
                <SVGCircleBg2/>
              </span>
              <span className="absolute left-1 bottom-1">
                <SVGCircleBG3/>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* <!-- ====== Forms Section End --> */}
  </>
}
