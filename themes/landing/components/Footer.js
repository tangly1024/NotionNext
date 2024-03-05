import { subscribeToNewsletter } from '@/lib/mailchimp'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import Logo from './Logo'
import { siteConfig } from '@/lib/config'

/**
 * 页脚
 */
export default function Footer() {
  const formRef = useRef()
  const [success, setSuccess] = useState(false)
  useEffect(() => {
    const form = formRef.current
    const handleSubmit = (e) => {
      e.preventDefault()
      const email = document.querySelector('#newsletter').value
      subscribeToNewsletter(email).then(response => {
        console.log('Subscription succeeded:', response)
        // 在此处添加成功订阅后的操作
        setSuccess(true)
      })
        .catch(error => {
          console.error('Subscription failed:', error)
          // 在此处添加订阅失败后的操作
        })
    }
    form?.addEventListener('submit', handleSubmit)
    return () => {
      form?.removeEventListener('submit', handleSubmit)
    }
  }, [subscribeToNewsletter])

  return (
        <footer>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Top area: Blocks */}
                <div className="grid sm:grid-cols-12 gap-8 py-8 md:py-12 border-t border-gray-200">

                    {/* 1st block */}
                    <div className="sm:col-span-12 lg:col-span-3">
                        <div className="mb-2">
                            <Logo />
                        </div>
                        <div className="text-sm text-gray-600">
                            <Link href="/terms-of-use" className="text-gray-600 hover:text-gray-900 hover:underline transition duration-150 ease-in-out">服务条款</Link> · <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 hover:underline transition duration-150 ease-in-out">隐私政策</Link>
                        </div>
                    </div>

                    {/* 2nd block */}
                    <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
                        <h6 className="text-gray-800 font-medium mb-2">产品</h6>
                        <ul className="text-sm">
                            <li className="mb-2">
                                <a href="#0" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">NotionNext</a>
                            </li>
                            <li className="mb-2">
                                {/* <a href="#0" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">Vercel</a> */}
                            </li>
                            <li className="mb-2">
                                {/* <a href="#0" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">Github</a> */}
                            </li>
                            <li className="mb-2">
                                {/* <a href="#0" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">Notion</a> */}
                            </li>
                            <li className="mb-2">
                                {/* <a href="#0" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">NextJs</a> */}
                            </li>
                        </ul>
                    </div>

                    {/* 3rd block */}
                    <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
                        <h6 className="text-gray-800 font-medium mb-2">资源</h6>
                        <ul className="text-sm">
                            <li className="mb-2">
                                <a href="https://docs.tangly1024.com" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">技术文档</a>
                            </li>
                            <li className="mb-2">
                                <a href="https://docs.tangly1024.com" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">教程指南</a>
                            </li>
                            <li className="mb-2">
                                <a href="https://blog.tangly1024.com" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">博客</a>
                            </li>
                            <li className="mb-2">
                                <a href="https://blog.tangly1024.com" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">支持中心</a>
                            </li>
                            <li className="mb-2">
                                <a href="#0" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">合作方</a>
                            </li>
                        </ul>
                    </div>

                    {/* 4th block */}
                    <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
                        <h6 className="text-gray-800 font-medium mb-2">企业</h6>
                        <ul className="text-sm">
                            <li className="mb-2">
                                <a href="#0" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">主页</a>
                            </li>
                            <li className="mb-2">
                                <a href="#0" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">关于我们</a>
                            </li>
                            <li className="mb-2">
                                <a href="#0" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">公司价值观</a>
                            </li>
                            <li className="mb-2">
                                <a href="#0" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">价格</a>
                            </li>
                            <li className="mb-2">
                                <a href="#0" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">隐私政策</a>
                            </li>
                        </ul>
                    </div>

                    {/* 开启邮件收集 */}
                    {JSON.parse(siteConfig('LANDING_NEWSLETTER', null, CONFIG)) && <>
                        {/* 5th block */}
                        <div className="sm:col-span-6 md:col-span-3 lg:col-span-3">
                            <h6 className="text-gray-800 font-medium mb-2">Subscribe</h6>
                            <p className="text-sm text-gray-600 mb-4">Get the latest news and articles to your inbox every month.</p>
                            <form ref={formRef}>
                                <div className="flex flex-wrap mb-4">
                                    <div className="w-full">
                                        <label className="block text-sm sr-only" htmlFor="newsletter">Email</label>
                                        <div className="relative flex items-center max-w-xs">
                                            <input disabled={success} id="newsletter" type="email" className="form-input w-full text-gray-800 px-3 py-2 pr-12 text-sm" placeholder="Your email" required />
                                            <button disabled={success} type="submit" className="absolute inset-0 left-auto" aria-label="Subscribe">
                                                <span className="absolute inset-0 right-auto w-px -ml-px my-2 bg-gray-300" aria-hidden="true"></span>
                                                <svg className="w-3 h-3 fill-current text-blue-600 mx-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z" fillRule="nonzero" />
                                                </svg>
                                            </button>
                                        </div>
                                        {/* Success message */}
                                        {success && <p className="mt-2 text-green-600 text-sm">Thanks for subscribing!</p>}
                                    </div>
                                </div>
                            </form>
                        </div>

                    </>}
                </div>

                {/* Bottom area */}
                <div className="md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-gray-200">

                    {/* Social as */}
                    <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
                        <li>
                          <div className='h-full flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100'>
                             Powered by<a href='https://github.com/tangly1024/NotionNext' className='mx-1 hover:underline font-semibold'>NotionNext {siteConfig('VERSION')}</a>
                          </div>
                        </li>
                        {/* <li>
              <a href="#0" className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out" aria-label="Twitter">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 11.5c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H8c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4c.7-.5 1.3-1.1 1.7-1.8z" />
                </svg>
              </a>
            </li> */}
                        <li className="ml-4">
                            <a href="https://github.com/tangly1024/NotionNext" className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out" aria-label="Github">
                                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
                                </svg>
                            </a>
                        </li>
                        {/* <li className="ml-4">
              <a href="#0" className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out" aria-label="Facebook">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.023 24L14 17h-3v-3h3v-2c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V14H21l-1 3h-2.72v7h-3.257z" />
                </svg>
              </a>
            </li> */}
                    </ul>

                    {/* Copyrights note */}
                    <div className="text-sm text-gray-600 mr-4">&copy; NotionNext. All rights reserved.</div>

                </div>

            </div>
        </footer>
  )
}
