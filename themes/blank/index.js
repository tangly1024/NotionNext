import NavBar from './components/NavBar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Divider from './components/Divider'
import HeroWithFigure from './components/HeroWithFigure'
import HeroWithForm from './components/HeroWithForm'
import HeroWithImage from './components/HeroWithImage'
import Carousel from './components/Carousel'
import ChatBubble from './components/ChatBubble'

/**
 * 这是一个空白主题的示例
 */
const THEME_CONFIG = { THEME: 'blank' }
/**
 * 主题框架
 * @param {*} props
 * @returns
 */
const LayoutBase = (props) => {
  const { children } = props
  console.log('children', children)
  return <div id='theme-blank'>
        <NavBar />
        {children}
        <Footer />
    </div>
}

const LayoutIndex = (props) => {
  console.log('首页')
  return <LayoutBase {...props}>
        <Hero />
        <HeroWithFigure />
        <HeroWithImage />
        <Carousel/>
        <ChatBubble/>
        <HeroWithForm />
        <Divider />
    </LayoutBase>
}
const LayoutSearch = () => <></>
const LayoutArchive = () => <></>
const LayoutSlug = () => <></>
const Layout404 = () => <></>
const LayoutCategory = () => <></>
const LayoutCategoryIndex = () => <></>
const LayoutPage = () => <></>
const LayoutTag = () => <></>
const LayoutTagIndex = () => <></>

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
