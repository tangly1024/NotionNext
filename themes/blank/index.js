/* eslint-disable */

/**
 * 这是一个空白主题，方便您用作创建新主题时的模板，从而开发出您自己喜欢的主题
 * 1. 禁用了代码质量检查功能，提高了代码的宽容度；您可以使用标准的html写法
 * 2. 内容大部分是在此文件中写死，notion数据从props参数中传进来
 * 3. 您可在此网站找到更多喜欢的组件 https://www.tailwind-kit.com/
 */
import BLOG from '@/blog.config'
import DarkModeButton from '@/components/DarkModeButton'
import NotionPage from '@/components/NotionPage'
import Link from 'next/link'
import { useState } from 'react'

/**
 * 这是个配置文件，可以方便在此统一配置信息
 */
const THEME_CONFIG = { THEME: 'blank' }

/**
 * 布局框架
 * 作为一个基础框架使用，定义了整个主题每个页面必备的顶部导航栏和页脚
 * 其它页面都嵌入到此框架中使用
 * @param {*} props
 * @returns
 */
const LayoutBase = (props) => {
  const { siteInfo, children } = props
  return <div id='theme-blank' className="flex flex-col justify-between bg-white">
        {/* 顶部导航栏 */}
        <NavBar siteInfo={siteInfo} />

        {/* 内容 */}
        <div id='content-wrapper'>
            {children}
        </div>

        {/* 底部页脚 */}
        <Footer />
    </div>
}

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const LayoutIndex = (props) => {
  const { siteInfo } = props
  return (
        <LayoutBase {...props}>
            <CTA siteInfo={siteInfo} />
            <PostList {...props} />
        </LayoutBase>
  )
}

/**
 * 文章详情页布局
 * @param {*} props
 * @returns
 */
const LayoutSlug = (props) => <LayoutBase {...props}>
    <div className='p-12 max-w-screen-xl justify-center mx-auto'>
        <NotionPage {...props} />
    </div>
    <PostList {...props} />
</LayoutBase>

// 其他布局暂时留空
const LayoutSearch = (props) => <LayoutBase {...props}><CTA /></LayoutBase>
const LayoutArchive = (props) => <LayoutBase {...props}><CTA /></LayoutBase>
const Layout404 = (props) => <LayoutBase {...props}><CTA /></LayoutBase>
const LayoutCategory = (props) => <LayoutBase {...props}><CTA /></LayoutBase>
const LayoutCategoryIndex = (props) => <LayoutBase {...props}><CTA /></LayoutBase>
const LayoutPage = (props) => <LayoutBase {...props}><CTA /></LayoutBase>
const LayoutTag = (props) => <LayoutBase {...props}><CTA /></LayoutBase>
const LayoutTagIndex = (props) => <LayoutBase {...props}><CTA /></LayoutBase>

/**
 * 文章列表
 */
const PostList = (props) => {
  const { latestPosts } = props
  return <div className="max-w-screen-xl p-8 mx-auto bg-white">
        <div className="flex items-end justify-between mb-12 header">
            <div className="title">
                <p className="mb-4 text-4xl font-bold text-gray-800">
                    Lastest articles
                </p>
                <p className="text-2xl font-light text-gray-400">
                    All article are verified by 2 experts and valdiate by the CTO
                </p>
            </div>

        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
            {latestPosts?.map(post => (
                <div key={post.id} className="m-auto overflow-hidden rounded-lg shadow-lg cursor-pointer h-90 w-60 md:w-80">
                    <Link href={post.slug} className="block w-full h-full">
                        <img alt="blog photo" src={post.pageCover || BLOG.HOME_BANNER_IMAGE} className="object-cover w-full max-h-40" />
                        <div className="w-full p-4 bg-white dark:bg-gray-800">
                            <p className="font-medium text-indigo-500 text-md">
                                {post.category}
                            </p>
                            <p className="mb-2 text-xl font-medium text-gray-800 dark:text-white">
                                {post.title}
                            </p>
                            <p className="font-light text-gray-400 dark:text-gray-300 text-md">
                                {post.description}
                            </p>
                            <div className="flex flex-wrap items-center mt-4 justify-starts">

                                {post.tags?.map(t => {
                                  return <div key={t} className="text-xs mr-2 py-1.5 px-4 text-gray-600 bg-blue-100 rounded-2xl">
                                        #{t}
                                    </div>
                                })}
                            </div>
                        </div>
                    </Link>
                </div>
            ))}

        </div>
    </div>
}

/**
* 导航栏
* @param {*} param0
* @returns
*/
const NavBar = ({ siteInfo }) => {
  const [showMenu, setShowMenu] = useState(false)
  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }
  return <div>
        <nav className="bg-white dark:bg-gray-800  shadow ">
            <div className="px-8 mx-auto max-w-7xl">
                <div className="flex items-center justify-between h-16">
                    {/* Logo菜单区域 */}
                    <div className=" flex items-center">
                        <a className="flex-shrink-0" href="/">
                            <img className="w-8 h-8" src="/favicon.svg" alt="NotionNext" />
                        </a>
                        <div className={'hidden  md:block'}>
                            <div className="flex items-baseline ml-10 space-x-4">
                                <a className="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium" href="/#">
                                    Home
                                </a>
                                <a className="text-gray-800 dark:text-white  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium" href="/#">
                                    Gallery
                                </a>
                                <a className="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium" href="/#">
                                    Content
                                </a>
                                <a className="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium" href="/#">
                                    Contact
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="block">
                        <div className="flex items-center ml-4 md:ml-6">
                            <a href="https://github.com/tangly1024/NotionNext" className="p-1 text-gray-400 rounded-full focus:outline-none hover:text-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                <span className="sr-only">
                                    View github
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="text-xl transition-colors duration-200 hover:text-gray-800 dark:hover:text-white" viewBox="0 0 1792 1792">
                                    <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z">
                                    </path>
                                </svg>
                            </a>
                            <div className="relative ml-3">
                                <div className="relative inline-block text-left">
                                    <div>
                                        <button onClick={toggleMenu} type="button" className="  flex items-center justify-center w-full rounded-md  px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500" id="options-menu">
                                            <svg width="20" fill="currentColor" height="20" className="text-gray-800" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1523 1339q-22-155-87.5-257.5t-184.5-118.5q-67 74-159.5 115.5t-195.5 41.5-195.5-41.5-159.5-115.5q-119 16-184.5 118.5t-87.5 257.5q106 150 271 237.5t356 87.5 356-87.5 271-237.5zm-243-699q0-159-112.5-271.5t-271.5-112.5-271.5 112.5-112.5 271.5 112.5 271.5 271.5 112.5 271.5-112.5 112.5-271.5zm512 256q0 182-71 347.5t-190.5 286-285.5 191.5-349 71q-182 0-348-71t-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z">
                                                </path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className={`${showMenu ? 'md:block' : 'hidden'} absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5`}>
                                        <div className="py-1 " role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            <a href="#" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600" role="menuitem">
                                                <span className="flex flex-col">
                                                    <span>
                                                        Settings
                                                    </span>
                                                </span>
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600" role="menuitem">
                                                <span className="flex flex-col">
                                                    <span>
                                                        Account
                                                    </span>
                                                </span>
                                            </a>
                                            <a href="#" className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600" role="menuitem">
                                                <span className="flex flex-col">
                                                    <span>
                                                        Logout
                                                    </span>
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex -mr-2 md:hidden">
                        <button className="text-gray-800 dark:text-white hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
                            <svg width="20" height="20" fill="currentColor" className="w-8 h-8" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* 移动设备菜单 */}
            <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium" href="/#">
                        Home
                    </a>
                    <a className="text-gray-800 dark:text-white block px-3 py-2 rounded-md text-base font-medium" href="/#">
                        Gallery
                    </a>
                    <a className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium" href="/#">
                        Content
                    </a>
                    <a className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium" href="/#">
                        Contact
                    </a>
                </div>
            </div>
        </nav>
    </div>
}

/**
 * 页脚
 * @param {*} param0
 */
const Footer = ({ siteInfo }) => {
  return <footer className="bg-white dark:bg-gray-800 pt-4 pb-8 xl:pt-8">
        <div className='py-5'>
            <DarkModeButton />
        </div>
        <div className="max-w-screen-lg px-4 mx-auto text-gray-400 xl:max-w-screen-xl sm:px-6 md:px-8 dark:text-gray-300">
            <ul className="flex flex-wrap justify-center pb-8 text-lg font-light">
                <li className="w-1/2 md:w-1/3 lg:w-1/3">
                    <div className="text-center">
                        <h2 className="text-gray-500 dark:text-gray-200 text-md uppercase mb-4">
                            Components
                        </h2>
                        <ul>
                            <li className="mb-4 transition-colors duration-200 hover:text-gray-800 dark:hover:text-white">
                                <a href="#">
                                    Elements
                                </a>
                            </li>
                            <li className="mb-4 transition-colors duration-200 hover:text-gray-800 dark:hover:text-white">
                                <a href="#">
                                    Forms
                                </a>
                            </li>
                            <li className="mb-4 transition-colors duration-200 hover:text-gray-800 dark:hover:text-white">
                                <a href="#">
                                    Commerces
                                </a>
                            </li>
                            <li className="mb-4 transition-colors duration-200 hover:text-gray-800 dark:hover:text-white">
                                <a href="#">
                                    Navigation
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className="w-1/2 md:w-1/3 lg:w-1/3">
                    <div className="text-center">
                        <h2 className="text-gray-500 dark:text-gray-200 text-md uppercase mb-4">
                            Contacts
                        </h2>
                        <ul>
                            <li className="mb-4 transition-colors duration-200 hover:text-gray-800 dark:hover:text-white">
                                <a href="#">
                                    Github
                                </a>
                            </li>
                            <li className="mb-4 transition-colors duration-200 hover:text-gray-800 dark:hover:text-white">
                                <a href="#">
                                    Facebook
                                </a>
                            </li>
                            <li className="mb-4 transition-colors duration-200 hover:text-gray-800 dark:hover:text-white">
                                <a href="#">
                                    Twitter
                                </a>
                            </li>
                            <li className="mb-4 transition-colors duration-200 hover:text-gray-800 dark:hover:text-white">
                                <a href="#">
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className="w-1/2 md:w-1/3 lg:w-1/3">
                    <div className="text-center">
                        <h2 className="text-gray-500 dark:text-gray-200 text-md uppercase mb-4">
                            Customization
                        </h2>
                        <ul>
                            <li className="mb-4 transition-colors duration-200 hover:text-gray-800 dark:hover:text-white">
                                <a href="#">
                                    Settings
                                </a>
                            </li>
                            <li className="mb-4 transition-colors duration-200 hover:text-gray-800 dark:hover:text-white">
                                <a href="#">
                                    Themes
                                </a>
                            </li>
                            <li className="mb-4 transition-colors duration-200 hover:text-gray-800 dark:hover:text-white">
                                <a href="#">
                                    Plugins
                                </a>
                            </li>
                            <li className="mb-4 transition-colors duration-200 hover:text-gray-800 dark:hover:text-white">
                                <a href="#">
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
            <div className="pt-8 flex border-t border-gray-200 max-w-xs mx-auto items-center justify-between">
                <a href="#">
                    <svg width="20" height="20" fill="currentColor" className="text-xl transition-colors duration-200 hover:text-gray-800 dark:hover:text-white" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z">
                        </path>
                    </svg>
                </a>
                <a href="#">
                    <svg width="20" height="20" fill="currentColor" className="text-xl transition-colors duration-200 hover:text-gray-800 dark:hover:text-white" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z">
                        </path>
                    </svg>
                </a>
                <a href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-xl transition-colors duration-200 hover:text-gray-800 dark:hover:text-white" viewBox="0 0 1792 1792">
                        <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z">
                        </path>
                    </svg>
                </a>
                <a href="#">
                    <svg width="20" height="20" fill="currentColor" className="text-xl transition-colors duration-200 hover:text-gray-800 dark:hover:text-white" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z">
                        </path>
                    </svg>
                </a>
                <a href="#">
                    <svg width="20" height="20" fill="currentColor" className="text-xl transition-colors duration-200 hover:text-gray-800 dark:hover:text-white" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1551 1476q15-6 26-3t11 17.5-15 33.5q-13 16-44 43.5t-95.5 68-141 74-188 58-229.5 24.5q-119 0-238-31t-209-76.5-172.5-104-132.5-105-84-87.5q-8-9-10-16.5t1-12 8-7 11.5-2 11.5 4.5q192 117 300 166 389 176 799 90 190-40 391-135zm207-115q11 16 2.5 69.5t-28.5 102.5q-34 83-85 124-17 14-26 9t0-24q21-45 44.5-121.5t6.5-98.5q-5-7-15.5-11.5t-27-6-29.5-2.5-35 0-31.5 2-31 3-22.5 2q-6 1-13 1.5t-11 1-8.5 1-7 .5h-10l-3-.5-2-1.5-1.5-3q-6-16 47-40t103-30q46-7 108-1t76 24zm-394-443q0 31 13.5 64t32 58 37.5 46 33 32l13 11-227 224q-40-37-79-75.5t-58-58.5l-19-20q-11-11-25-33-38 59-97.5 102.5t-127.5 63.5-140 23-137.5-21-117.5-65.5-83-113-31-162.5q0-84 28-154t72-116.5 106.5-83 122.5-57 130-34.5 119.5-18.5 99.5-6.5v-127q0-65-21-97-34-53-121-53-6 0-16.5 1t-40.5 12-56 29.5-56 59.5-48 96l-294-27q0-60 22-119t67-113 108-95 151.5-65.5 190.5-24.5q100 0 181 25t129.5 61.5 81 83 45 86 12.5 73.5v589zm-672 21q0 86 70 133 66 44 139 22 84-25 114-123 14-45 14-101v-162q-59 2-111 12t-106.5 33.5-87 71-32.5 114.5z">
                        </path>
                    </svg>
                </a>
            </div>
            <div className="text-center pt-10 sm:pt-12 font-light flex items-center justify-center">
                <form className="flex flex-col justify-center w-3/4 max-w-sm space-y-3 md:flex-row md:w-full md:space-x-3 md:space-y-0">
                    <div className=" relative ">
                        <input type="text" id="&quot;form-subscribe-Subscribe" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Email" />
                    </div>
                    <button className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200" type="submit">
                        Subscribe
                    </button>
                </form>
            </div>
            <div className="text-center pt-10 sm:pt-12 font-light flex items-center justify-center">
                Created by Charlie
            </div>
        </div>
    </footer>
}

/**
 * 首版
 * @param {*} param0
* @returns
*/
const CTA = ({ siteInfo }) => {
  return <div className="relative z-20 flex items-center bg-white dark:bg-gray-800 h-screen">
        <div className="container relative flex flex-col items-center justify-between px-6 py-8 mx-auto">
            <div className="flex flex-col">
                <h1 className="w-full text-4xl font-light text-center text-gray-800 uppercase sm:text-5xl dark:text-white">
                    The React Framework for Production
                </h1>
                <h2 className="w-full max-w-2xl py-8 mx-auto text-xl font-light text-center text-gray-500 dark:text-white">
                    Next.js gives you the best developer experience with all the features you need for production: hybrid static &amp; server rendering, TypeScript support, smart bundling, route pre-fetching, and more. No config needed.
                </h2>
                <h3 className="w-full max-w-2xl py-8 mx-auto text-xl font-light text-center text-gray-500 dark:text-white">
                    BLANK仅作为演示参考主题，便于开发着创建NotionNext主题
                </h3>
                <div className="flex items-center justify-center mt-4">
                    <a href="#" className="px-4 py-2 mr-4 text-white uppercase bg-gray-800 border-2 border-transparent text-md hover:bg-gray-900">
                        Get started
                    </a>
                    <a href="#" className="px-4 py-2 text-gray-800 uppercase bg-transparent border-2 border-gray-800 dark:text-white hover:bg-gray-800 hover:text-white text-md">
                        Documentation
                    </a>
                </div>
            </div>
        </div>
    </div>
}
export {
  THEME_CONFIG,
  LayoutIndex,
  LayoutSearch,
  LayoutArchive,
  LayoutSlug,
  Layout404,
  LayoutCategory,
  LayoutCategoryIndex,
  LayoutPage,
  LayoutTag,
  LayoutTagIndex
}
