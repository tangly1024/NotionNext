import { useGlobal } from '@/lib/global'

/**
 * 一个全页面遮罩，当发生页面跳转时出现。
 * @param {*} props
 * @returns
 */
export const Cover = (props) => {
  const { onLoading } = useGlobal()
  return <div id='cover-loading' className={`${onLoading ? 'z-50 opacity-20' : '-z-10 opacity-0'} pointer-events-none transition-all duration-300 bg-black fixed top-0 left-0 h-screen w-screen `}>
        <div className='w-screen h-screen flex justify-center items-center'>
            <i className="fa-solid fa-spinner text-2xl text-white animate-spin">  </i>
        </div>
    </div>
}
