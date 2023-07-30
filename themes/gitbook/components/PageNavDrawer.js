import { useGitBookGlobal } from '@/themes/gitbook'
import NavPostList from './NavPostList'

/**
 * 悬浮抽屉 页面内导航
 * @param toc
 * @param post
 * @returns {JSX.Element}
 * @constructor
 */
const PageNavDrawer = (props) => {
  const { pageNavVisible, changePageNavVisible } = useGitBookGlobal()
  const { filteredNavPages } = props

  const groupedArray = filteredNavPages?.reduce((groups, item) => {
    const categoryName = item?.category ? item?.category : '' // 将category转换为字符串
    const lastGroup = groups[groups.length - 1] // 获取最后一个分组

    if (!lastGroup || lastGroup?.category !== categoryName) { // 如果当前元素的category与上一个元素不同，则创建新分组
      groups.push({ category: categoryName, items: [] })
    }

    groups[groups.length - 1].items.push(item) // 将元素加入对应的分组

    return groups
  }, [])

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
                    <NavPostList groupedArray={groupedArray} />
                </div>
            </div>
        </div>
        {/* 背景蒙版 */}
        <div id='left-drawer-background' className={(pageNavVisible ? 'block' : 'hidden') + ' fixed top-0 left-0 z-30 w-full h-full'}
            onClick={switchVisible} />
    </>
}
export default PageNavDrawer
