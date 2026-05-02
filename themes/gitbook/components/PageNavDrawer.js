import { useGlobal } from '@/lib/global'
import { useGitBookGlobal } from '@/themes/gitbook'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import NavPostList from './NavPostList'

/**
 * 悬浮抽屉 页面内导航
 * @param toc
 * @param post
 * @returns {JSX.Element}
 * @constructor
 */
const PageNavDrawer = props => {
  const { pageNavVisible, changePageNavVisible } = useGitBookGlobal()
  const { filteredNavPages } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const switchVisible = () => {
    changePageNavVisible(!pageNavVisible)
  }

  useEffect(() => {
    changePageNavVisible(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return (
    <>
      <div
        id='gitbook-left-float'
        className='fixed top-0 left-0 z-40 md:hidden'>
        {/* 侧边菜单 */}
        <div
          className={`${pageNavVisible ? 'animate__slideInLeft ' : '-ml-80 animate__slideOutLeft'} 
                      overflow-y-hidden shadow-card w-72 duration-200 fixed left-2 bottom-20 rounded-xl py-2 bg-white dark:bg-hexo-black-gray dark:border dark:border-black`}>
          <div className='px-4 pb-2 flex justify-between items-center border-b border-gray-200 dark:border-black font-bold text-gray-800 dark:text-gray-200'>
            <span>{locale.COMMON.ARTICLE_LIST}</span>
            <i
              className='fas fa-times p-1 cursor-pointer text-gray-500 dark:text-gray-400'
              onClick={() => {
                changePageNavVisible(false)
              }}></i>
          </div>
          {/* 所有文章列表 */}
          <div className='text-gray-600 dark:text-gray-400 h-96 overflow-y-scroll p-3'>
            <NavPostList filteredNavPages={filteredNavPages} />
          </div>
        </div>
      </div>

      {/* 背景蒙版 */}
      <div
        id='left-drawer-background'
        className={`${pageNavVisible ? 'block' : 'hidden'} fixed top-0 left-0 z-30 w-full h-full bg-black/35 dark:bg-black/60`}
        onClick={switchVisible}
      />
    </>
  )
}
export default PageNavDrawer
