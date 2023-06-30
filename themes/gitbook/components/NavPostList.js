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
  const { posts = [], currentSearch } = props
  const filteredPosts = Object.assign(posts)
  const router = useRouter()
  let selectedSth = false

  // 处理是否选中
  filteredPosts.map((group) => {
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
  if (!selectedSth && filteredPosts && filteredPosts.length > 0) {
    filteredPosts[0].selected = true
  }

  if (!filteredPosts || filteredPosts.length === 0) {
    return <NavPostListEmpty currentSearch={currentSearch} />
  } else {
    return <div className='w-full flex-grow'>
            {/* 文章列表 */}
            {filteredPosts?.map((group, index) => <NavPostItem key={index} group={group} onHeightChange={props.onHeightChange}/>)}
        </div>
  }
}

export default NavPostList
