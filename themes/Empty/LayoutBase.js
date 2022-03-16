import CommonHead from '@/components/CommonHead'
import Link from 'next/link'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, meta } = props
  return (
    <div>
      <CommonHead meta={meta} />
      {/* 导航菜单 */}
      <div className="w-full flex justify-center my-2">
        <nav className="max-w-6xl space-x-3 underline">
          <Link href="/">
            <a>首页</a>
          </Link>
          <Link href="/category">
            <a>分类</a>
          </Link>
          <Link href="/tag">
            <a>标签</a>
          </Link>
        </nav>
      </div>
      {/* 内容主体 */}
      <main id="wrapper" className="flex justify-center flex-1 pb-12">
        <div className="max-w-6xl px-3">{children}</div>
      </main>
    </div>
  )
}

export default LayoutBase
