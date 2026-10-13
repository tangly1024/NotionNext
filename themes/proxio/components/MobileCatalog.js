import { useEffect, useRef, useState } from 'react'
import Catalog from './Catalog'

/**
 * 移动端悬浮目录入口
 *
 * 小屏（< xl）下以浮动按钮 + 抽屉的形式提供目录，
 * 不占用正文宽度；桌面端由 LayoutSlug 的侧边栏负责，此处隐藏。
 *
 * @param {*} props post
 */
export default function MobileCatalog({ post }) {
  const [showButton, setShowButton] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const buttonRef = useRef(null)
  const drawerRef = useRef(null)

  // 与主题既有浮动元素一致：滚动一段距离后才出现
  useEffect(() => {
    const onScroll = () => setShowButton(window.scrollY > 180)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /**
   * 收起抽屉，并把焦点从正在卸载的抽屉内容交还入口按钮。
   *
   * 关闭态抽屉不挂载目录内容（其中的链接不会残留在 Tab 顺序与可访问性树中），
   * 因此若收起时焦点仍在抽屉内（键盘 Enter 跳转、或点击条目后），
   * 焦点会随内容卸载而丢失；这里显式移回可见的入口按钮。
   */
  const closeDrawer = () => {
    const active = document.activeElement
    if (drawerRef.current && active && drawerRef.current.contains(active)) {
      buttonRef.current?.focus()
    }
    setDrawerOpen(false)
  }

  // Catalog 在抽屉模式下点击条目跳转后，通过该事件让抽屉收起
  useEffect(() => {
    const el = document.getElementById('proxio-mobile-catalog')
    if (!el) return
    const onClose = () => closeDrawer()
    el.addEventListener('proxio-catalog-close', onClose)
    return () => el.removeEventListener('proxio-catalog-close', onClose)
  }, [showButton])

  const hasToc = Boolean(post?.toc && post.toc.length > 0)
  if (!hasToc || !showButton) {
    return null
  }

  return (
    <div id='proxio-mobile-catalog'>
      {/* 浮动入口：样式与回顶按钮保持一致（方形圆角），抽屉展开时原位变为关闭按钮 */}
      <button
        ref={buttonRef}
        type='button'
        aria-expanded={drawerOpen}
        aria-label={drawerOpen ? 'Close catalog' : 'Open catalog'}
        onClick={() => (drawerOpen ? closeDrawer() : setDrawerOpen(true))}
        className='fixed bottom-28 right-8 z-[1000] flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white shadow-md transition duration-300 ease-in-out hover:bg-dark xl:hidden'>
        <i
          className={
            'fas block text-[15px] leading-none ' +
            (drawerOpen ? 'fa-times' : 'fa-list-ul')
          }
        />
      </button>

      {/* 背景蒙版：淡入淡出 */}
      <div
        onClick={closeDrawer}
        className={
          'fixed top-0 left-0 z-[998] h-full w-full bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden ' +
          (drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0')
        }
      />

      {/* 目录抽屉：右侧滑入，覆盖式不挤压正文
          关闭态需平移「自身宽度 + 右偏移」，否则屏幕右缘会残留一条白边；
          底边留在浮动按钮上方，避免两者重叠 */}
      <div
        ref={drawerRef}
        className={
          (drawerOpen ? 'translate-x-0' : 'translate-x-[calc(100%+1.5rem)]') +
          ' fixed bottom-[10.5rem] right-6 z-[999] w-64 rounded-2xl border border-gray-100 bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-gray-700 dark:bg-gray-800 xl:hidden'
        }>
        {/* 面板头 */}
        <div className='flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700'>
          <span className='text-sm font-semibold text-gray-800 dark:text-gray-100'>
            <i className='fas fa-list-ul mr-2 text-xs text-primary' />
            目录
          </span>
          <span className='text-xs text-gray-400'>{post?.toc?.length || 0} 节</span>
        </div>
        {/* 目录项：左右内边距，不贴边。
            关闭态整块不挂载：光靠 translate 移出视口，内部链接仍留在
            Tab 顺序与可访问性树中，键盘用户会聚焦到屏幕外的不可见控件 */}
        <div className='max-h-[50vh] overflow-y-auto px-2 py-2'>
          {drawerOpen && <Catalog post={post} drawer />}
        </div>
      </div>
    </div>
  )
}
