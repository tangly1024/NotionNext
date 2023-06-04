
/**
 * 主题文件被加载出之前的占位符
 * @returns
 */
const Loading = (props) => {
  const { current } = props

  return <>
  {current || <div className="w-screen h-screen flex justify-center items-center">
          <h1>Loading... <i className='ml-2 fas fa-spinner animate-spin' /></h1>
      </div>}
  </>
}
export default Loading
