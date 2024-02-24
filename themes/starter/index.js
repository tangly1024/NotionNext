/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

'use client'

/**
 * 这是一个空白主题，方便您用作创建新主题时的模板，从而开发出您自己喜欢的主题
 * 1. 禁用了代码质量检查功能，提高了代码的宽容度；您可以使用标准的html写法
 * 2. 内容大部分是在此文件中写死，notion数据从props参数中传进来
 * 3. 您可在此网站找到更多喜欢的组件 https://www.tailwind-kit.com/
 */
import { useRouter } from 'next/router'
import { isBrowser } from '@/lib/utils'
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
import { SVG404 } from './components/svg/SVG404'
import { Banner } from './components/Banner'
import { SignInForm } from './components/SignInForm'
import { SignUpForm } from './components/SignUpForm'
import Link from 'next/link'
import { loadWowJS } from '@/lib/wow'

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

  // 加载wow动画
  useEffect(() => {
    loadWowJS()
  }, [])

  return <div id='theme-starter' className={`${siteConfig('FONT_STYLE')} min-h-screen flex flex-col dark:bg-[#212b36] scroll-smooth`}>
            <Style/>
            <NavBar {...props}/>

            {children}

            <Footer {...props}/>

            {/* 悬浮按钮 */}
            <BackToTopButton/>
            <MadeWithButton/>
        </div>
}

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const LayoutIndex = (props) => {
  const count = siteConfig('STARTER_BLOG_COUNT', 3, CONFIG)
  const posts = props?.allNavPages
    ? props.allNavPages.slice(0, count)
    : []
  return (
        <>
        {/* 英雄区 */}
        <Hero/>
        {/* 产品特性 */}
        <Features/>
        {/* 关于 */}
        <About/>
        {/* 价格 */}
        <Pricing/>
        {/* 评价展示 */}
        <Testimonials/>
        {/* 常见问题 */}
        <FAQ/>
        {/* 团队介绍 */}
        <Team/>
        {/* 博文列表 */}
        <Blog posts={posts}/>
        {/* 联系方式 */}
        <Contact/>
        {/* 合作伙伴 */}
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
  const { post } = props

  // 如果 是 /article/[slug] 的文章路径则視情況进行重定向到另一个域名
  const router = useRouter()
  if (!post && siteConfig('STARTER_POST_REDIRECT_ENABLE', null, CONFIG) && isBrowser && router.route === '/[prefix]/[slug]') {
    const redirectUrl = siteConfig('STARTER_POST_REDIRECT_URL', null, CONFIG) + router.asPath.replace('?theme=landing', '')
    router.push(redirectUrl)
    return <div id='theme-starter'><Loading /></div>
  }

  return <>
        <Banner title={post?.title} description={post?.summary}/>
        <div className="container grow">
            <div className="flex flex-wrap justify-center -mx-4">
                <div className="w-full p-4">
                    <div id='container-inner' className='mx-auto'>
                        <NotionPage {...props} />
                    </div>
                </div>
            </div>
        </div>
    </>
}

const LayoutSearch = (props) => <></>

/**
 * 文章归档
 * @param {*} props
 * @returns
 */
const LayoutArchive = (props) => <>
        {/* 博文列表 */}
        <Blog {...props}/>
</>

/**
 * 404页面
 * @param {*} props
 * @returns
 */
const Layout404 = (props) => {
  return <>
     {/* <!-- ====== 404 Section Start --> */}
        <section className="bg-white py-20 dark:bg-dark-2 lg:py-[110px]">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center -mx-4">
              <div className="w-full px-4 md:w-5/12 lg:w-6/12">
                <div className="text-center">
                  <img
                    src="/images/starter/404.svg"
                    alt="image"
                    className="max-w-full mx-auto"
                  />
                </div>
              </div>
              <div className="w-full px-4 md:w-7/12 lg:w-6/12 xl:w-5/12">
                <div>
                  <div className="mb-8">
                    <SVG404/>
                  </div>
                  <h3 className="mb-5 text-2xl font-semibold text-dark dark:text-white">
                    {siteConfig('STARTER_404_TITLE', null, CONFIG)}
                  </h3>
                  <p className="mb-8 text-base text-body-color dark:text-dark-6">
                  {siteConfig('STARTER_404_TEXT', null, CONFIG)}

                  </p>
                  <Link href='/'
                    className="py-3 text-base font-medium text-white transition rounded-md bg-dark px-7 hover:bg-primary"
                  >
                    {siteConfig('STARTER_404_BACK', null, CONFIG)}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- ====== 404 Section End --> */}

    </>
}

const LayoutCategoryIndex = (props) => <></>
const LayoutPostList = (props) => <></>
const LayoutTagIndex = (props) => <></>

/**
 * 登录页面
 * @param {*} props
 * @returns
 */
const LayoutSignIn = (props) => {
  return <>
        <div className='grow mt-20'>
            <Banner title='登录' description='这里是演示页面，NotionNext目前不提供会员登录功能'/>
            <SignInForm/>
        </div>
    </>
}

/**
 * 注册页面
 * @param {*} props
 * @returns
 */
const LayoutSignUp = (props) => <>
        <div className='grow mt-20'>
            <Banner title='注册' description='这里是演示页面，NotionNext目前不提供会员注册功能'/>
            <SignUpForm/>
        </div>
</>

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
  LayoutTagIndex,
  LayoutSignIn,
  LayoutSignUp
}
