import { useGlobal } from '@/lib/global'
import { useGitBookGlobal } from '@/themes/gitbook'

/**
 * 移动端目录按钮
 */
export default function MobileButtonCatalog() {
  const { tocVisible, changeTocVisible } = useGitBookGlobal()
  const { locale } = useGlobal()

  const toggleToc = () => {
    changeTocVisible(!tocVisible)
  }

  return (
    <div
      onClick={toggleToc}
      className={
        'text-black flex justify-center items-center dark:text-gray-200 dark:bg-hexo-black-gray py-2 px-2'
      }>
      <a
        id='toc-button'
        className={
          'space-x-4 cursor-pointer hover:scale-150 transform duration-200'
        }>
        <i className='fa-list-ol fas' />
        <span>{locale.COMMON.TABLE_OF_CONTENTS}</span>
      </a>
    </div>
  )
}
