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
import { useGlobal } from '@/lib/global'
import { HashTag } from '@/components/HeroIcons'
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
import BLOG from '@/blog.config'
import { loadWowJS } from '@/lib/plugins/wow'
import Link from 'next/link'
import { Banner } from './components/Banner'
import { SignInForm } from './components/SignInForm'
import { SignUpForm } from './components/SignUpForm'
import { SVG404 } from './components/svg/SVG404'
import CategoryBar from './components/CategoryBar'
import BlogPostArchive from './components/BlogPostArchive'
import BlogPostArchive from './components/BlogPostArchive'
import SearchNav from './components/SearchNav'
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
      className={`${siteConfig('FONT_STYLE', BLOG.FONT_STYLE, props.NOTION_CONFIG)} min-h-screen flex flex-col dark:bg-[#212b36] scroll-smooth`}>
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
      {siteConfig('STARTER_HERO_ENABLE', null, CONFIG) && <Hero />}
      {/* 产品特性 */}
      {siteConfig('STARTER_FEATURE_ENABLE', null, CONFIG) && <Features />}
      {/* 关于 */}
      {siteConfig('STARTER_ABOUT_ENABLE', null, CONFIG) && <About />}
      {/* 价格 */}
      {siteConfig('STARTER_PRICING_ENABLE', null, CONFIG) && <Pricing />}
      {/* 评价展示 */}
      {siteConfig('STARTER_TESTIMONIALS_ENABLE', null, CONFIG) && (
        <Testimonials />
      )}
      {/* 常见问题 */}
      {siteConfig('STARTER_FAQ_ENABLE', null, CONFIG) && <FAQ />}
      {/* 团队介绍 */}
      {siteConfig('STARTER_TEAM_ENABLE', null, CONFIG) && <Team />}
      {/* 博文列表 */}
      {siteConfig('STARTER_BLOG_ENABLE', null, CONFIG) && (
        <Blog posts={posts} />
      )}
      {/* 联系方式 */}
      {siteConfig('STARTER_CONTACT_ENABLE', null, CONFIG) && <Contact />}
      {/* 合作伙伴 */}
      {siteConfig('STARTER_BRANDS_ENABLE', null, CONFIG) && <Brand />}
    </>
  )
}

/**
 * 搜索
 * @param {*} props
 * @returns
 */
const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()
  const currentSearch = keyword || router?.query?.s

  useEffect(() => {
    // 高亮搜索结果
    if (currentSearch) {
      setTimeout(() => {
        replaceSearchResult({
          doms: document.getElementsByClassName('replace'),
          search: currentSearch,
          target: {
            element: 'span',
            className: 'text-red-500 border-b border-dashed'
          }
        })
      }, 100)
    }
  }, [])
  return (
    <div
      {...props}
      currentSearch={currentSearch}
    >
      <div id="post-outer-wrapper" className="px-5  md:px-0">
        {!currentSearch
          ? (
            <SearchNav {...props} />
            )
          : (
            <div id="posts-wrapper">
              {siteConfig('POST_LIST_STYLE') === 'page'
                ? (
                  <BlogPostListPage {...props} />
                  )
                : (
                  <BlogPostListScroll {...props} />
                  )}
            </div>
            )}
      </div>
    </div>
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
    siteConfig('STARTER_POST_REDIRECT_ENABLE', null, CONFIG) &&
    isBrowser &&
    router.route === '/[prefix]/[slug]'
  ) {
    const redirectUrl =
      siteConfig('STARTER_POST_REDIRECT_URL', null, CONFIG) +
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
          <div className='w-full p-4'>
            <div id='container-inner' className='mx-auto'>
              <NotionPage {...props} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


/**
 * 归档
 * @param {*} props
 * @returns
 */
const LayoutArchive = props => {
  const { archivePosts } = props

  // 归档页顶部显示条，如果是默认归档则不显示。分类详情页显示分类列表，标签详情页显示当前标签

  return (
      <div className="p-5 rounded-xl border dark:border-gray-600 max-w-6xl w-full bg-white dark:bg-[#1e1e1e]">
        {/* 文章分类条 */}
        <CategoryBar {...props} border={false} />
        <div className="px-3">
          {Object.keys(archivePosts).map(archiveTitle => (
            <BlogPostArchive
              key={archiveTitle}
              posts={archivePosts[archiveTitle]}
              archiveTitle={archiveTitle}
            />
          ))}
        </div>
      </div>
  )
}

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
                  {siteConfig('STARTER_404_TITLE', null, CONFIG)}
                </h3>
                <p className='mb-8 text-base text-body-color dark:text-dark-6'>
                  {siteConfig('STARTER_404_TEXT', null, CONFIG)}
                </p>
                <Link
                  href='/'
                  className='py-3 text-base font-medium text-white transition rounded-md bg-dark px-7 hover:bg-primary'>
                  {siteConfig('STARTER_404_BACK', null, CONFIG)}
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

/**
 * 分类列表
 * @param {*} props
 * @returns
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  const { locale } = useGlobal()

  return (
      <div id="category-outer-wrapper" className="mt-8 px-5 md:px-0">
        <div className="text-4xl font-extrabold dark:text-gray-200 mb-5">
          {locale.COMMON.CATEGORY}
        </div>
        <div
          id="category-list"
          className="duration-200 flex flex-wrap m-10 justify-center"
        >
          {categoryOptions?.map(category => {
            return (
              <Link
                key={category.name}
                href={`/category/${category.name}`}
                passHref
                legacyBehavior
              >
                <div
                  className={
                    'group mr-5 mb-5 flex flex-nowrap items-center border bg-white text-2xl rounded-xl dark:hover:text-white px-4 cursor-pointer py-3 hover:text-white hover:bg-indigo-600 transition-all hover:scale-110 duration-150'
                  }
                >
                  <HashTag className={'w-5 h-5 stroke-gray-500 stroke-2'} />
                  {category.name}
                  <div className="bg-[#f1f3f8] ml-1 px-2 rounded-lg group-hover:text-indigo-600 ">
                    {category.count}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
  )
}

/**
 * 标签页
 * @param {*} props
 * @returns
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props;
  const { locale } = useGlobal();

  // 定义一个函数来计算边框宽度
  const calculateBorderWidth = count => {
    // 根据文章数量计算边框宽度，这里假设文章数量越大，边框越粗
    // 您可以根据需要调整这个计算逻辑
    return Math.min(count, 10) * 0.5 + 1; // 假设边框宽度从1px到6px
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div id="tag-outer-wrapper" className="px-5 mt-8 md:px-0">
        <div className="text-4xl font-extrabold dark:text-gray-200 mb-5">
          {locale.COMMON.TAGS}
        </div>
        <div
          id="tag-list"
          className="flex flex-wrap space-x-5 space-y-5 m-10 justify-center"
        >
          {tagOptions.map(tag => {
            const borderWidth = calculateBorderWidth(tag.count);
            const borderColor = '#813c85'; // 边框颜色
            return (
              <Link
                key={tag.name}
                href={`/tag/${tag.name}`}
                passHref
                legacyBehavior
              >
                <div
                  className={`group flex flex-nowrap items-center cursor-pointer px-4 py-3 hover:bg-indigo-600 transition-all hover:scale-110 duration-150`}
                  style={{
                    border: `${borderWidth}px solid${borderColor}`,
                    borderRadius: '8px', // 添加圆角边框
                  }}
                >
                  <HashTag className={`w-5 h-5 stroke-gray-500 stroke-2`} />
                  {tag.name}
                  <div className="bg-[#f1f3f8] ml-1 px-2 rounded-lg group-hover:text-indigo-600">
                    {tag.count}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}



const LayoutPostList = props => <></>


/**
 * 登录页面
 * @param {*} props
 * @returns
 */
const LayoutSignIn = props => {
  return (
    <>
      <div className='grow mt-20'>
        <Banner
          title='登录'
          description='这里是演示页面，NotionNext目前不提供会员登录功能'
        />
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
const LayoutSignUp = props => (
  <>
    <div className='grow mt-20'>
      <Banner
        title='注册'
        description='这里是演示页面，NotionNext目前不提供会员注册功能'
      />
      <SignUpForm />
    </div>
  </>
)

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSignIn,
  LayoutSignUp,
  LayoutSlug,
  LayoutTagIndex,
  LayoutCategoryIndex,
  CONFIG as THEME_CONFIG
}
