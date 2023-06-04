
/**
 * 加载主题文件时的全局遮罩
 * @returns
 */
const LoadingCover = (props) => {
  const { onReading } = props

  return <>
        <div className={`${onReading ? 'opacity-90' : 'opacity-0'} transition-all fixed top-0 left-0 pointer-events-none duration-1000 z-50 shadow-inner w-screen h-screen flex justify-center items-center bg-gray-600 dark:bg-black text-white shadow-text`}>
            <h1 className="text-2xl"><i className='mr-5 fas fa-spinner animate-spin' /></h1>
        </div>
    </>
}
export default LoadingCover
