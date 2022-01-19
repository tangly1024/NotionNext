import CommonHead from '@/components/CommonHead'

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
    <main id='wrapper' className='flex justify-center flex-1 pb-12'>
      {children}
    </main>
  </>)
}

export default LayoutBase
