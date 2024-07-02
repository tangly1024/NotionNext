import MobileButtonCatalog from './MobileButtonCatalog'
import MobileButtonPageNav from './MobileButtonPageNav'

/**
 * 移动端底部导航
 * @param {*} param0
 * @returns
 */
export default function BottomMenuBar({ post, className }) {
  const showTocButton = post?.toc?.length > 1

  return (
    <>
      {/* 移动端底部导航按钮 */}
      <div className='bottom-button-group md:hidden w-screen h-14 px-4 fixed flex items-center justify-between right-left bottom-0 z-30 bg-white border-t dark:border-gray-800'>
        <div className='w-full'>
          <MobileButtonPageNav />
        </div>
        {showTocButton && (
          <div className='w-full'>
            <MobileButtonCatalog />
          </div>
        )}
      </div>
    </>
  )
}
