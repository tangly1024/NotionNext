import { useGitBookGlobal } from '@/themes/gitbook'

/**
 * 移动端文章导航按钮
 */
export default function MobileButtonPageNav() {
  const { pageNavVisible, changePageNavVisible } = useGitBookGlobal()

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
        id='toc-button'
        className={
          'fa-book cursor-pointer fas hover:scale-150 transform duration-200'
        }
      />
    </div>
  )
}
