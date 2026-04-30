import { useGlobal } from '@/lib/global'
import { useGitBookGlobal } from '..'

/**
 * 移动端底部导航
 * @param {*} param0
 * @returns
 */
export default function BottomMenuBar({ post, className }) {
  const showTocButton = post?.toc?.length > 1
  const { locale } = useGlobal()
  const { pageNavVisible, changePageNavVisible, tocVisible, changeTocVisible } =
    useGitBookGlobal()
  const togglePageNavVisible = () => {
    changePageNavVisible(!pageNavVisible)
  }

  const toggleToc = () => {
    changeTocVisible(!tocVisible)
  }

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white dark:border-black dark:bg-hexo-black-gray ${className || ''}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div
        className={`grid h-16 max-w-lg mx-auto px-3 font-medium ${showTocButton ? 'grid-cols-2 gap-2' : 'grid-cols-1'}`}>
        <button
          type='button'
          onClick={togglePageNavVisible}
          className={`inline-flex flex-col items-center justify-center rounded-xl transition-all duration-200 border ${
            pageNavVisible
              ? 'border-green-200 bg-green-50 text-green-600 shadow-sm dark:border-gray-700 dark:bg-black dark:text-green-400'
              : 'border-transparent text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900'
          }`}>
          <i className='fa-book fas w-5 h-5 mb-1.5' />
          <span className='text-xs tracking-wide'>
            {locale.COMMON.ARTICLE_LIST}
          </span>
        </button>

        {showTocButton && (
          <button
            type='button'
            onClick={toggleToc}
            className={`inline-flex flex-col items-center justify-center rounded-xl transition-all duration-200 border ${
              tocVisible
                ? 'border-green-200 bg-green-50 text-green-600 shadow-sm dark:border-gray-700 dark:bg-black dark:text-green-400'
                : 'border-transparent text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900'
            }`}>
            <i className='fa-list-ol fas w-5 h-5 mb-1.5' />
            <span className='text-xs tracking-wide'>
              {locale.COMMON.TABLE_OF_CONTENTS}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
