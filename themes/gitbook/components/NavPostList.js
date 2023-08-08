import NavPostListEmpty from './NavPostListEmpty'
import { useRouter } from 'next/router'
import NavPostItem from './NavPostItem'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const NavPostList = (props) => {
  const { filteredNavPages } = props
  const router = useRouter()
  let selectedSth = false
  const groupedArray = filteredNavPages?.reduce((groups, item) => {
    const categoryName = item?.category ? item?.category : '' // 将category转换为字符串
    const lastGroup = groups[groups.length - 1] // 获取最后一个分组

    if (!lastGroup || lastGroup?.category !== categoryName) { // 如果当前元素的category与上一个元素不同，则创建新分组
      groups.push({ category: categoryName, items: [] })
    }

    groups[groups.length - 1].items.push(item) // 将元素加入对应的分组

    return groups
  }, [])

  // 处理是否选中
  groupedArray?.map((group) => {
    let groupSelected = false
    for (const post of group?.items) {
      if (router.asPath.split('?')[0] === '/' + post.slug) {
        groupSelected = true
        selectedSth = true
      }
    }
    group.selected = groupSelected
    return null
  })

  // 如果都没有选中默认打开第一个
  if (!selectedSth && groupedArray && groupedArray?.length > 0) {
    groupedArray[0].selected = true
  }

  if (!groupedArray || groupedArray.length === 0) {
    return <NavPostListEmpty />
  } else {
    return <div id='posts-wrapper' className='w-full flex-grow'>
            {/* 文章列表 */}
            {groupedArray?.map((group, index) => <NavPostItem key={index} group={group} onHeightChange={props.onHeightChange}/>)}
        </div>
  }
}

export default NavPostList
