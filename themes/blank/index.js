
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
  return <div id='theme-blank' className="flex flex-col justify-between">
        <div id='nav-bar' className="w-full h-12 bg-white text-center fixed top-0 flex justify-between px-12">
            <div id='logo' className="my-auto">Logo</div>
            <div id='menu' className="my-auto">Menu</div>
        </div>
        <div id='content-wrapper'>
            {children}
        </div>

    </div>
}

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const LayoutIndex = (props) => {
  return <LayoutBase {...props}>
        <div id='hero' className="flex justify-center items-center  h-screen">hero-page</div>
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
