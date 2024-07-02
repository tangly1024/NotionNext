import Catalog from './Catalog'
import { useMediumGlobal } from '@/themes/medium'

/**
 * 悬浮抽屉目录
 * @param toc
 * @param post
 * @returns {JSX.Element}
 * @constructor
 */
const TocDrawer = ({ post, cRef }) => {
  const { tocVisible, changeTocVisible } = useMediumGlobal()
  const switchVisible = () => {
    changeTocVisible(!tocVisible)
  }
  return <>
    <div id='medium-toc-float' className='fixed top-0 right-0 z-40'>
      {/* 侧边菜单 */}
      <div
        className={(tocVisible ? 'animate__slideInRight ' : ' -mr-72 animate__slideOutRight') +
        ' overflow-y-hidden shadow-card w-60 duration-200 fixed right-1 bottom-16 rounded py-2 bg-white dark:bg-gray-600'}>
          {post && <>
           <div className='dark:text-gray-400 text-gray-600 h-56'>
             <Catalog toc={post.toc}/>
           </div>
          </>}
      </div>
    </div>
    {/* 背景蒙版 */}
    <div id='right-drawer-background' className={(tocVisible ? 'block' : 'hidden') + ' fixed top-0 left-0 z-30 w-full h-full'}
         onClick={switchVisible} />
  </>
}
export default TocDrawer
