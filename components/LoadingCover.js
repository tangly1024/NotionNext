
/**
 * 加载文件时的全局遮罩
 * @returns
 */
const LoadingCover = (props) => {
  const { onReading } = props

  return <div className={`${onReading ? 'opacity-30' : 'opacity-0'}  bg-black text-white shadow-text w-screen h-screen flex justify-center items-center
                            transition-all fixed top-0 left-0 pointer-events-none duration-1000 z-50 shadow-inner`}>
        <i className='text-3xl mr-5 fas fa-spinner animate-spin' />
    </div>
}
export default LoadingCover
