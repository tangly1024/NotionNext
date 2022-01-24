import CommonHead from '@/components/CommonHead'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = (props) => {
  const { children, meta } = props
  return <div>
    <CommonHead meta={meta} />
    <main id='wrapper' className='flex justify-center flex-1 pb-12'>
      {children}
    </main>
  </div>
}

export default LayoutBase
