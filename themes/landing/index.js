
/**
 * 这是一个空白主题，方便您用作创建新主题时的模板，从而开发出您自己喜欢的主题
 * 1. 禁用了代码质量检查功能，提高了代码的宽容度；您可以使用标准的html写法
 * 2. 内容大部分是在此文件中写死，notion数据从props参数中传进来
 * 3. 您可在此网站找到更多喜欢的组件 https://www.tailwind-kit.com/
 */
/* eslint-disable*/
import NotionPage from '@/components/NotionPage'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Features from './components/Features'
import FeaturesBlocks from './components/FeaturesBlocks'
import Testimonials from './components/Testimonials'
import Newsletter from './components/Newsletter'
import CommonHead from '@/components/CommonHead'

/**
 * 这是个配置文件，可以方便在此统一配置信息
 */
const THEME_CONFIG = { THEME: 'landing' }

/**
 * 布局框架
 * 作为一个基础框架使用，定义了整个主题每个页面必备的顶部导航栏和页脚
 * 其它页面都嵌入到此框架中使用
 * @param {*} props
 * @returns
 */
const LayoutBase = (props) => {
    const { meta, siteInfo, children } = props

    return <div id='theme-blank' className="overflow-hidden flex flex-col justify-between bg-white">
        
        {/* 网页SEO */}
        <CommonHead meta={meta} siteInfo={siteInfo} />

        {/* 顶部导航栏 */}
        <Header />

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
    return (
        <LayoutBase {...props}>
            <Hero />
            <Features />
            <FeaturesBlocks />
            <Testimonials />
            <Newsletter />
        </LayoutBase>
    )
}

/**
 * 文章详情页布局
 * @param {*} props
 * @returns
 */
const LayoutSlug = (props) => <LayoutBase {...props}>
    <div id='container-inner' className='mx-auto max-w-screen-lg p-12'>
        <NotionPage {...props} />
    </div>
</LayoutBase>

// 其他布局暂时留空
const LayoutSearch = (props) => <LayoutBase {...props}><Hero /></LayoutBase>
const LayoutArchive = (props) => <LayoutBase {...props}><Hero /></LayoutBase>
const Layout404 = (props) => <LayoutBase {...props}><Hero /></LayoutBase>
const LayoutCategoryIndex = (props) => <LayoutBase {...props}><Hero /></LayoutBase>
const LayoutPostList = (props) => <LayoutBase {...props}><Hero /></LayoutBase>
const LayoutTagIndex = (props) => <LayoutBase {...props}><Hero /></LayoutBase>

export {
    THEME_CONFIG,
    LayoutIndex,
    LayoutSearch,
    LayoutArchive,
    LayoutSlug,
    Layout404,
    LayoutPostList,
    LayoutCategoryIndex,
    LayoutTagIndex
}
