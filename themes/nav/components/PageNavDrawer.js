import { useNavGlobal } from '@/themes/nav'
import NavPostList from './NavPostList'

/**
 * 悬浮抽屉 页面内导航
 * @param toc
 * @param post
 * @returns {JSX.Element}
 * @constructor
 */
const PageNavDrawer = (props) => {
  const { pageNavVisible, changePageNavVisible } = useNavGlobal()
  const { filteredNavPages } = props

  const switchVisible = () => {
    changePageNavVisible(!pageNavVisible)
  }

  return <>
        <div id='gitbook-left-float' className='fixed top-0 left-0 z-40 md:hidden'>
            {/* 侧边菜单 */}
            <div
                className={(pageNavVisible ? 'animate__slideInLeft ' : '-ml-80 animate__slideOutLeft') +
                    ' overflow-y-hidden shadow-card w-72 duration-200 fixed left-1 top-16 rounded py-2 bg-white dark:bg-gray-600'}>
                <div className='dark:text-gray-400 text-gray-600 h-96 overflow-y-scroll p-3'>
                    {/* 所有文章列表 */}
                    <NavPostList filteredNavPages={filteredNavPages} />
                </div>
            </div>
        </div>
        {/* 背景蒙版 */}
        <div id='left-drawer-background' className={(pageNavVisible ? 'block' : 'hidden') + ' fixed top-0 left-0 z-30 w-full h-full'}
            onClick={switchVisible} />
    </>
}
export default PageNavDrawer
