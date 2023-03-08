import CONFIG_SIMPLE from '../config_simple'

/**
 * 网站顶部
 * @returns
 */
export const TopBar = (props) => {
  return (
        <header className="w-full flex justify-between items-center px-20 h-10 bg-black dark:bg-hexo-black-gray z-10">
            <div className='text-xs text-white' dangerouslySetInnerHTML={{ __html: CONFIG_SIMPLE.TOP_BAR_CONTENT }}/>
        </header>
  )
}
