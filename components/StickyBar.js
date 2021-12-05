/**
 * 标签组导航条，默认隐藏仅在移动端显示
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
const StickyBar = ({ children }) => {
  if (!children) return <></>
  return (
    <div id='sticky-bar' className='fixed lg:top-0 top-14 duration-500 z-10 w-full border-b dark:border-gray-600 shadow-xl'>
      <div className='bg-white dark:bg-gray-800 flex overflow-x-auto'>
      <div className='z-30 sticky left-0 flex'>
        <div className='pr-2 bg-white dark:bg-gray-800'/>
        <div className='pr-3 -line-x-opacity bg-black'/>
      </div>
      <div id='tag-container'>
          { children }
      </div>
      <div className='z-30 sticky right-0 flex'>
        <div className='px-5 line-x-opacity'/>
        <div className='px-2 bg-white dark:bg-gray-800'/>
      </div>
    </div>
    </div>
  )
}

export default StickyBar
