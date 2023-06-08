
/**
 * 异步文件加载过程中的占位符
 * @returns
 */
const Loading = (props) => {
  return <div id="loading-bg" className="-z-10 w-screen h-screen flex justify-center items-center fixed left-0 top-0">
       <i className='fas fa-spinner animate-spin text-3xl' />
    </div>
}
export default Loading
