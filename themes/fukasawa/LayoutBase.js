import CommonHead from '@/components/CommonHead'
import TopNav from './components/TopNav'
import AsideLeft from './components/AsideLeft'
import Live2D from '@/components/Live2D'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏
 * @param children
 * @param layout
 * @param tags
 * @param meta
 * @param post
 * @param currentSearch
 * @param currentCategory
 * @param currentTag
 * @param categories
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = (props) => {
  const {
    children,
    headerSlot,
    meta
  } = props
  const leftAreaSlot = <Live2D/>
  return (<>
    <CommonHead meta={meta} />
    <TopNav {...props}/>
    <div className='flex'>
      <AsideLeft {...props} slot={leftAreaSlot}/>
      <main id='wrapper' className='flex w-full py-8 justify-center'>
        <div className='2xl:max-w-6xl md:max-w-4xl w-full'>
          <div> {headerSlot} </div>
          <div>{children}</div>
        </div>
      </main>
    </div>

  </>)
}

export default LayoutBase
