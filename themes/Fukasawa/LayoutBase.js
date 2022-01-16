import CommonHead from '@/components/CommonHead'
import AsideLeft from './components/AsideLeft'

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
const LayoutBase = ({
  children,
  headerSlot,
  tags,
  meta,
  post,
  postCount,
  sideBarSlot,
  floatSlot,
  rightAreaSlot,
  currentSearch,
  currentCategory,
  currentTag,
  categories
}) => {
  return (<>
    <CommonHead meta={meta} />
    <div className='flex flex-between'>
      <AsideLeft tags={tags} currentTag={currentTag} categories={categories} currentCategory={currentCategory}/>
      <main id='wrapper' className='flex flex-grow py-8 justify-center'>
        <div className='2xl:max-w-6xl md:max-w-3xl max-w-md w-full'>
          <div> {headerSlot} </div>
          <div>{children}</div>
        </div>
      </main>
    </div>

  </>)
}

export default LayoutBase
