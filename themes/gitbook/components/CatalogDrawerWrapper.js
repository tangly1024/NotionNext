import { useGlobal } from '@/lib/global'
import { useGitBookGlobal } from '@/themes/gitbook'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Catalog from './Catalog'

/**
 * 悬浮抽屉目录
 * @param toc
 * @param post
 * @returns {JSX.Element}
 * @constructor
 */
const CatalogDrawerWrapper = ({ post, cRef }) => {
  const { tocVisible, changeTocVisible } = useGitBookGlobal()
  const { locale } = useGlobal()
  const router = useRouter()
  const switchVisible = () => {
    changeTocVisible(!tocVisible)
  }
  useEffect(() => {
    changeTocVisible(false)
  }, [router])
  return (
    <>
      <div
        id='gitbook-toc-float'
        className='fixed top-0 right-0 z-40 md:hidden'>
        {/* 侧边菜单 */}
        <div
          className={
            (tocVisible
              ? 'animate__slideInRight '
              : ' -mr-72 animate__slideOutRight') +
            ' overflow-y-hidden shadow-card w-60 duration-200 fixed right-2 bottom-20 rounded-xl py-2 bg-white dark:bg-hexo-black-gray dark:border dark:border-black'
          }>
          {post && (
            <>
              <div className='px-4 pb-2 flex justify-between items-center border-b border-gray-200 dark:border-black font-bold text-gray-800 dark:text-gray-200'>
                <span>{locale.COMMON.TABLE_OF_CONTENTS}</span>
                <i
                  className='fas fa-times p-1 cursor-pointer text-gray-500 dark:text-gray-400'
                  onClick={() => {
                    changeTocVisible(false)
                  }}></i>
              </div>
              <div className='text-gray-600 dark:text-gray-400 px-3'>
                <Catalog post={post} />
              </div>
            </>
          )}
        </div>
      </div>
      {/* 背景蒙版 */}
      <div
        id='right-drawer-background'
        className={
          (tocVisible ? 'block' : 'hidden') +
          ' fixed top-0 left-0 z-30 w-full h-full bg-black/35 dark:bg-black/60'
        }
        onClick={switchVisible}
      />
    </>
  )
}
export default CatalogDrawerWrapper
