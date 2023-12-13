import BLOG from '@/blog.config'
import LazyImage from '@/components/LazyImage'
import { MenuListSide } from './MenuListSide'

/**
 * 侧边抽屉
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
const SideBar = (props) => {
  const { siteInfo } = props

  return (
      <div id='side-bar'>
          <div className="mh-48 w-full bg-indigo-700">
              <div className='mx-5 pt-6 pb-2'>
                  <LazyImage src={siteInfo?.icon} className='cursor-pointer rounded-full' width={80} alt={BLOG.AUTHOR} />
                  <div className='text-white text-xl my-1'>{siteInfo?.title}</div>
                  <div className='text-xs my-1 text-gray-300'>{siteInfo?.description}</div>
              </div>
          </div>
          <MenuListSide {...props} />
      </div>
  )
}

export default SideBar
