import { useNavGlobal } from '@/themes/nav'

/**
 * 移动端悬浮目录按钮
 */
export default function FloatTocButton () {
  const { tocVisible, changeTocVisible } = useNavGlobal()

  const toggleToc = () => {
    changeTocVisible(!tocVisible)
  }

  return (
    <div
      onClick={toggleToc}
      className={ 'text-black flex justify-center items-center dark:text-gray-200 dark:bg-hexo-black-gray py-2 px-2'
      }
    >
      <a
        id="toc-button"
        className={'fa-list-ol cursor-pointer fas hover:scale-150 transform duration-200'}
      />
    </div>
  )
}
