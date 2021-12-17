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
    <div id='sticky-bar' className='sticky flex justify-center top-0 duration-500 z-10 w-full'>
      <div className='bg-white dark:bg-gray-800 dark:border-gray-600 w-full px-5 rounded-none md:rounded-xl shadow-xl border overflow-x-auto'>
        <div className="flex">
          <div className='z-30 absolute h-12 left-0 flex'>
            <div className='pr-6 md:ml-5 -line-x-opacity'/>
          </div>
          <div id='tag-container' className="md:pl-3  max-w-xs md:max-w-lg xl:max-w-2xl 2xl:max-w-5xl 3xl:max-w-6xl">
              { children }
          </div>
          <div className='z-30 absolute h-12 right-0 flex'>
            <div className='pl-5 md:mr-5 line-x-opacity'/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StickyBar
