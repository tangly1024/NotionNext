import NavPostListEmpty from './NavPostListEmpty'
import { useRouter } from 'next/router'
import NavPostItem from './NavPostItem'
import { deepClone } from '@/lib/utils'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const NavPostList = (props) => {
  const { filteredPostGroups } = props
  const router = useRouter()
  let selectedSth = false

  // 处理是否选中
  filteredPostGroups?.map((group) => {
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
  if (!selectedSth && filteredPostGroups && filteredPostGroups.length > 0) {
    filteredPostGroups[0].selected = true
  }

  if (!filteredPostGroups || filteredPostGroups.length === 0) {
    return <NavPostListEmpty />
  } else {
    return <div className='w-full flex-grow'>
            {/* 文章列表 */}
            {filteredPostGroups?.map((group, index) => <NavPostItem key={index} group={group} onHeightChange={props.onHeightChange}/>)}
        </div>
  }
}

export default NavPostList
