/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

'use client'

/**
 * 这是一个空白主题，方便您用作创建新主题时的模板，从而开发出您自己喜欢的主题
 * 1. 禁用了代码质量检查功能，提高了代码的宽容度；您可以使用标准的html写法
 * 2. 内容大部分是在此文件中写死，notion数据从props参数中传进来
 * 3. 您可在此网站找到更多喜欢的组件 https://www.tailwind-kit.com/
 */
import Loading from '@/components/Loading'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { About } from './components/About'
import { BackToTopButton } from './components/BackToTopButton'
import { Blog } from './components/Blog'
import { Brand } from './components/Brand'
import { Contact } from './components/Contact'
import { FAQ } from './components/FAQ'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { NavBar } from './components/NavBar'
import { Pricing } from './components/Pricing'
import { Team } from './components/Team'
import { Testimonials } from './components/Testimonials'
import CONFIG from './config'
import { Style } from './style'
// import { MadeWithButton } from './components/MadeWithButton'
import { loadWowJS } from '@/lib/plugins/wow'
import Link from 'next/link'
import { Banner } from './components/Banner'
import { CTA } from './components/CTA'
import { SignInForm } from './components/SignInForm'
import { SVG404 } from './components/svg/SVG404'

/**
 * 布局框架
 * Landing-2 主题用作产品落地页展示
 * 结合Stripe或者lemonsqueezy插件可以成为saas支付订阅
 * https://play-tailwind.tailgrids.com/
 * @param {*} props
 * @returns
 */
const LayoutBase = props => {
  const { children } = props

  // 加载wow动画
  useEffect(() => {
    loadWowJS()
  }, [])

  return (
    <div
      id='theme-starter'
      className={`${siteConfig('FONT_STYLE')} min-h-screen flex flex-col dark:bg-[#212b36] scroll-smooth`}>
      <Style />
      <NavBar {...props} />

      {children}

      <Footer {...props} />

      {/* 悬浮按钮 */}
      <BackToTopButton />
      {/* <MadeWithButton/> */}
    </div>
  )
}

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const LayoutIndex = props => {
  const count = siteConfig('STARTER_BLOG_COUNT', 3, CONFIG)
  const posts = props?.allNavPages ? props.allNavPages.slice(0, count) : []
  return (
    <>
      {/* 英雄区 */}
      {siteConfig('STARTER_HERO_ENABLE') && <Hero />}
      {/* 产品特性 */}
      {siteConfig('STARTER_FEATURE_ENABLE') && <Features />}
      {/* 关于 */}
      {siteConfig('STARTER_ABOUT_ENABLE') && <About />}
      {/* 价格 */}
      {siteConfig('STARTER_PRICING_ENABLE') && <Pricing />}
      {/* 评价展示 */}
      {siteConfig('STARTER_TESTIMONIALS_ENABLE') && <Testimonials />}
      {/* 常见问题 */}
      {siteConfig('STARTER_FAQ_ENABLE') && <FAQ />}
      {/* 团队介绍 */}
      {siteConfig('STARTER_TEAM_ENABLE') && <Team />}
      {/* 博文列表 */}
      {siteConfig('STARTER_BLOG_ENABLE') && <Blog posts={posts} />}
      {/* 联系方式 */}
      {siteConfig('STARTER_CONTACT_ENABLE') && <Contact />}
      {/* 合作伙伴 */}
      {siteConfig('STARTER_BRANDS_ENABLE') && <Brand />}
      <CTA />
    </>
  )
}

/**
 * 文章详情页布局
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post } = props

  // 如果 是 /article/[slug] 的文章路径则視情況进行重定向到另一个域名
  const router = useRouter()
  if (
    !post &&
    siteConfig('STARTER_POST_REDIRECT_ENABLE') &&
    isBrowser &&
    router.route === '/[prefix]/[slug]'
  ) {
    const redirectUrl =
      siteConfig('STARTER_POST_REDIRECT_URL') +
      router.asPath.replace('?theme=landing', '')
    router.push(redirectUrl)
    return (
      <div id='theme-starter'>
        <Loading />
      </div>
    )
  }

  return (
    <>
      <Banner title={post?.title} description={post?.summary} />
      <div className='container grow'>
        <div className='flex flex-wrap justify-center -mx-4'>
          <div id='container-inner' className='w-full p-4'>
            <div id='article-wrapper' className='mx-auto'>
              <NotionPage {...props} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const LayoutSearch = props => <></>

/**
 * 文章归档
 * @param {*} props
 * @returns
 */
const LayoutArchive = props => (
  <>
    {/* 博文列表 */}
    <Blog {...props} />
  </>
)

/**
 * 404页面
 * @param {*} props
 * @returns
 */
const Layout404 = props => {
  return (
    <>
      {/* <!-- ====== 404 Section Start --> */}
      <section className='bg-white py-20 dark:bg-dark-2 lg:py-[110px]'>
        <div className='container mx-auto'>
          <div className='flex flex-wrap items-center -mx-4'>
            <div className='w-full px-4 md:w-5/12 lg:w-6/12'>
              <div className='text-center'>
                <img
                  src='/images/starter/404.svg'
                  alt='image'
                  className='max-w-full mx-auto'
                />
              </div>
            </div>
            <div className='w-full px-4 md:w-7/12 lg:w-6/12 xl:w-5/12'>
              <div>
                <div className='mb-8'>
                  <SVG404 />
                </div>
                <h3 className='mb-5 text-2xl font-semibold text-dark dark:text-white'>
                  {siteConfig('STARTER_404_TITLE')}
                </h3>
                <p className='mb-8 text-base text-body-color dark:text-dark-6'>
                  {siteConfig('STARTER_404_TEXT')}
                </p>
                <Link
                  href='/'
                  className='py-3 text-base font-medium text-white transition rounded-md bg-dark px-7 hover:bg-primary'>
                  {siteConfig('STARTER_404_BACK')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- ====== 404 Section End --> */}
    </>
  )
}

const LayoutCategoryIndex = props => <></>
const LayoutPostList = props => <></>
const LayoutTagIndex = props => <></>

/**
 * 登录页面
 * @param {*} props
 * @returns
 */
const LayoutSignIn = props => {
  const title = siteConfig('STARTER_SIGNIN', '登录')
  const description = siteConfig(
    'STARTER_SIGNIN_DESCRITION',
    '这里是演示页面，NotionNext目前不提供会员登录功能'
  )
  return (
    <>
      <div className='grow mt-20'>
        <Banner title={title} description={description} />
        <SignInForm />
      </div>
    </>
  )
}

/**
 * 注册页面
 * @param {*} props
 * @returns
 */
const LayoutSignUp = props => {
  const title = siteConfig('STARTER_SIGNIN', '注册')
  const description = siteConfig(
    'STARTER_SIGNIN_DESCRITION',
    '这里是演示页面，NotionNext目前不提供会员注册功能'
  )
  return (
    <>
      <div className='grow mt-20'>
        <Banner title={title} description={description} />
        <SignInForm />
      </div>
    </>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSignIn,
  LayoutSignUp,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
