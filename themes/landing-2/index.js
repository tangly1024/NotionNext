
'use client'

/**
 * 这是一个空白主题，方便您用作创建新主题时的模板，从而开发出您自己喜欢的主题
 * 1. 禁用了代码质量检查功能，提高了代码的宽容度；您可以使用标准的html写法
 * 2. 内容大部分是在此文件中写死，notion数据从props参数中传进来
 * 3. 您可在此网站找到更多喜欢的组件 https://www.tailwind-kit.com/
 */
import { useRouter } from 'next/router'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import { siteConfig } from '@/lib/config'
import CONFIG from './config'
import NotionPage from '@/components/NotionPage'
import Loading from '@/components/Loading'
import { useEffect } from 'react'
import { Style } from './style'
import { NavBar } from './components/NavBar'
import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { About } from './components/About'
import { Pricing } from './components/Pricing'
import { Testimonials } from './components/Testimonials'
import { FAQ } from './components/FAQ'
import { Team } from './components/Team'
import { Blog } from './components/Blog'
import { Contact } from './components/Contact'
import { Brand } from './components/Brand'
import { Footer } from './components/Footer'
import { BackToTopButton } from './components/BackToTopButton'
import { MadeWithButton } from './components/MadeWithButton'

/**
 * 一些外部js
 */
const loadExternal = async () => {
  await loadExternalResource('https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js', 'js');
  await loadExternalResource('https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.css', 'css');
  await loadExternalResource('https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js', 'js');
  const WOW = window.WOW;
  if (WOW) {
    new WOW().init();
  }
};

/**
 * 布局框架
 * Landing-2 主题用作产品落地页展示
 * 结合Stripe或者lemonsqueezy插件可以成为saas支付订阅
 * https://play-tailwind.tailgrids.com/
 * @param {*} props
 * @returns
 */
const LayoutBase = (props) => {
  const { children } = props

  useEffect(() => {
    loadExternal()
  }, [])

  return <>
        <Style/>
        <div id='theme-landing-2' className="flex flex-col justify-between bg-white dark:bg-black">
            <NavBar/>

            {children}

            <Footer/>

            {/* 悬浮按钮 */}
            <BackToTopButton/>
            <MadeWithButton/>
        </div>
    </>
}

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const LayoutIndex = (props) => {
  return (
        <>
        <Hero/>
        <Features/>
        <About/>
        <Pricing/>
        <Testimonials/>
        <FAQ/>
        <Team/>
        <Blog/>
        <Contact/>
        <Brand/>
        </>
  )
}

/**
 * 文章详情页布局
 * @param {*} props
 * @returns
 */
const LayoutSlug = (props) => {
  // 如果 是 /article/[slug] 的文章路径则进行重定向到另一个域名
  const router = useRouter()
  if (JSON.parse(siteConfig('LANDING_POST_REDIRECT_ENABLE', null, CONFIG)) && isBrowser && router.route === '/[prefix]/[slug]') {
    const redirectUrl = siteConfig('LANDING_POST_REDIRECT_URL', null, CONFIG) + router.asPath.replace('?theme=landing', '')
    router.push(redirectUrl)
    return <div id='theme-landing'><Loading /></div>
  }

  return <>
        <div id='container-inner' className='mx-auto max-w-screen-lg p-12'>
            <NotionPage {...props} />
        </div>
    </>
}

// 其他布局暂时留空
const LayoutSearch = (props) => <></>
const LayoutArchive = (props) => <></>
const Layout404 = (props) => <></>
const LayoutCategoryIndex = (props) => <></>
const LayoutPostList = (props) => <></>
const LayoutTagIndex = (props) => <></>

export {
  CONFIG as THEME_CONFIG,
  LayoutBase,
  LayoutIndex,
  LayoutSearch,
  LayoutArchive,
  LayoutSlug,
  Layout404,
  LayoutPostList,
  LayoutCategoryIndex,
  LayoutTagIndex
}
