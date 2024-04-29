import { useNavGlobal } from '@/themes/nav'
import JumpToTopButton from './JumpToTopButton'

export default function BottomMenuBar({ post, className }) {
  const { pageNavVisible, changePageNavVisible } = useNavGlobal()

  const togglePageNavVisible = () => {
    changePageNavVisible(!pageNavVisible)
  }

  return (
        <div className={'sticky z-10 bottom-0 w-full h-12 bg-white dark:bg-hexo-black-gray ' + className}>
            <div className='flex justify-between h-full shadow-card'>
                <div onClick={togglePageNavVisible} className='flex w-full items-center justify-center cursor-pointer'>
                <i className="fa-solid fa-book"></i>
                </div>
                <div className='flex w-full items-center justify-center cursor-pointer'>
                    <JumpToTopButton />
                </div>
            </div>
        </div>
  )
}
