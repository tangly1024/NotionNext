
/**
 * 异步文件加载时的占位符
 * @returns
 */
const Loading = (props) => {
  return <div id="loading-container" className="-z-10 w-screen h-screen flex justify-center items-center fixed left-0 top-0">
        <div id="loading-wrapper">
            <div className="loading"> <i className="fas fa-spinner animate-spin text-3xl "/></div>
        </div>
    </div>
}
export default Loading
