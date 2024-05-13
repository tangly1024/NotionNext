import Badge from '@/components/Badge'
import Collapse from '@/components/Collapse'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import BlogPostCard from './BlogPostCard'

/**
 * 导航列表
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const NavPostItem = props => {
  const { group, expanded, toggleItem } = props // 接收传递的展开状态和切换函数
  // const [isOpen, setIsOpen] = useState(expanded) // 使用展开状态作为组件内部状态

  // 当展开状态改变时触发切换函数，并根据传入的展开状态更新内部状态
  const toggleOpenSubMenu = () => {
    toggleItem() // 调用父组件传递的切换函数
    // setIsOpen(!expanded) // 更新内部状态为传入的展开状态的相反值
  }

  const groupHasLatest = group?.items?.some(post => post.isLatest)

  if (group?.category) {
    return (
      <>
        <div
          onClick={toggleOpenSubMenu}
          className='select-none relative flex justify-between text-sm cursor-pointer p-2 hover:bg-gray-50 rounded-md dark:hover:bg-yellow-100 dark:hover:text-yellow-600'
          key={group?.category}>
          <span>{group?.category}</span>
          <div className='inline-flex items-center select-none pointer-events-none '>
            <i
              className={`px-2 fas fa-chevron-left transition-all opacity-50 duration-200 ${expanded ? '-rotate-90' : ''}`}></i>
          </div>
          {groupHasLatest &&
            siteConfig('GITBOOK_LATEST_POST_RED_BADGE', false, CONFIG) &&
            !expanded && <Badge />}
        </div>
        <Collapse isOpen={expanded} onHeightChange={props.onHeightChange}>
          {group?.items?.map(post => (
            <div key={post.id} className='ml-3 border-l'>
              <BlogPostCard className='text-sm ml-3' post={post} />
            </div>
          ))}
        </Collapse>
      </>
    )
  } else {
    return (
      <>
        {group?.items?.map(post => (
          <div key={post.id}>
            <BlogPostCard className='text-sm py-2' post={post} />
          </div>
        ))}
      </>
    )
  }
}

export default NavPostItem
