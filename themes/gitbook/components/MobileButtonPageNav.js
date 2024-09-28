import { useGlobal } from '@/lib/global'
import { useGitBookGlobal } from '@/themes/gitbook'

/**
 * 移动端文章导航按钮
 */
export default function MobileButtonPageNav() {
  const { pageNavVisible, changePageNavVisible } = useGitBookGlobal()
  const { locale } = useGlobal()
  const togglePageNavVisible = () => {
    changePageNavVisible(!pageNavVisible)
  }

  return (
    <div
      onClick={togglePageNavVisible}
      className={
        'text-black flex justify-center items-center dark:text-gray-200 dark:bg-hexo-black-gray py-2 px-2'
      }>
      <a
        id='nav-button'
        className={
          'space-x-4 cursor-pointer hover:scale-150 transform duration-200'
        }>
        <i className='fa-book fas' />
        <span>{locale.COMMON.ARTICLE_LIST}</span>
      </a>
    </div>
  )
}
