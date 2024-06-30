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
            ' overflow-y-hidden shadow-card w-60 duration-200 fixed right-1 bottom-16 rounded py-2 bg-white dark:bg-hexo-black-gray'
          }>
          {post && (
            <>
              <div className='px-4 pb-2 flex justify-between items-center border-b font-bold'>
                <span>{locale.COMMON.TABLE_OF_CONTENTS}</span>
                <i
                  className='fas fa-times p-1 cursor-pointer'
                  onClick={() => {
                    changeTocVisible(false)
                  }}></i>
              </div>
              <div className='dark:text-gray-400 text-gray-600 px-3'>
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
          ' fixed top-0 left-0 z-30 w-full h-full'
        }
        onClick={switchVisible}
      />
    </>
  )
}
export default CatalogDrawerWrapper
