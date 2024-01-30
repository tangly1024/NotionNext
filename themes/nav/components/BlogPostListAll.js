/* eslint-disable */
import BlogPostListEmpty from './BlogPostListEmpty'
import BlogPostItem from './BlogPostItem'
import { useNavGlobal } from '@/themes/nav'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListAll = (props) => {
  // const { customMenu, posts, category, tag, allNavPages, categoryOptions } = props
  // const [filteredNavPages, setFilteredNavPages] = useState(allNavPages)
  const { customMenu } = props

  // const [filteredNavPages, setFilteredNavPages] = useState(allNavPages)
  const { filteredNavPages, setFilteredNavPages, allNavPages } = useNavGlobal()
  // const [filteredNavPages] = useState(allNavPages)

  // const router = useRouter()
  // 对自定义分类格式化，方便后续使用分类名称做索引，检索同步图标信息
  // 目前只支持二级分类
  const links = customMenu
  const filterLinks = {}
  // for循环遍历数组
  links?.map((link, i) => {
    const linkTitle = link.title + ''
    // console.log('####### link')
    // console.log(link)
    // filterLinks[linkTitle] = link
    filterLinks[linkTitle] = { title: link.title, icon: link.icon, pageIcon: link.pageIcon }
    if (link?.subMenus) {
      link.subMenus?.map((group, index) => {
        const subMenuTitle = group?.title + ''
        // 自定义分类图标与post的category共用
        // 判断自定义分类与Post中category同名的项，将icon的值传递给post
        // filterLinks[subMenuTitle] = group
        filterLinks[subMenuTitle] = { title: group.title, icon: group.icon, pageIcon: group.pageIcon }
      })
    }
  })

  console.log('####### filterLinks')
  console.log(filterLinks)

  // console.log('####### filterLinks')
  // console.log(filterLinks)

  const selectedSth = false
  const groupedArray = filteredNavPages?.reduce((groups, item) => {
    const categoryName = item?.category ? item?.category : '' // 将category转换为字符串
    const categoryIcon = filterLinks[categoryName]?.icon ? filterLinks[categoryName]?.icon : '' // 将pageIcon转换为字符串

    // console.log('####### categoryName')
    // console.log(categoryName)
    // console.log('####### categoryIcon')
    // console.log(categoryIcon)

    let existingGroup = null
    // 开启自动分组排序
    if (JSON.parse(siteConfig('NAV_AUTO_SORT', null, CONFIG))) {
      existingGroup = groups.find(group => group.category === categoryName) // 搜索同名的最后一个分组
    } else {
      existingGroup = groups[groups.length - 1] // 获取最后一个分组
    }

    // 添加数据
    if (existingGroup && existingGroup.category === categoryName) {
      existingGroup.items.push(item)
    } else {
      groups.push({ category: categoryName, icon: categoryIcon, items: [item] })
    }
    return groups
  }, [])

  // 处理是否选中
  groupedArray?.map((group) => {
    // 自定义分类图标与post的category共用
    // 判断自定义分类与Post中category同名的项，将icon的值传递给post
    // let groupTitle = group?.category
    // item.icon = filterLinks[categoryName]?.icon ? filterLinks[categoryName]?.icon : ''
    // console.log('####### item')
    // console.log(item)
    const groupSelected = false
    // for (const post of group?.items) {
    //   if (router.asPath.split('?')[0] === '/' + post.slug) {
    //     groupSelected = true
    //     selectedSth = true
    //   }
    // }
    group.selected = groupSelected
    return null
  })

  // 如果都没有选中默认打开第一个
  if (!selectedSth && groupedArray && groupedArray?.length > 0) {
    groupedArray[0].selected = true
  }

  if (!groupedArray || groupedArray.length === 0) {
    return <BlogPostListEmpty />
  } else {
    return <div id='posts-wrapper' className='stack-list w-full mx-auto justify-center'>
            {/* 文章列表 */}
            {groupedArray?.map((group, index) => <BlogPostItem key={index} group={group} filterLinks={filterLinks} onHeightChange={props.onHeightChange}/>)}
        </div>
  }

  // 处理自定义导航菜单项
  // let keyword = searchInputRef.current.value
  // if (keyword) {
  //   keyword = keyword.trim()
  // } else {
  //   setFilteredNavPages(allNavPages)
  // }
  // for (const filterGroup of filterAllNavPages) {
  //   for (let i = filterGroup.items.length - 1; i >= 0; i--) {
  //     const post = filterGroup.items[i]
  //     const articleInfo = post.title + ''
  //     const hit = articleInfo.toLowerCase().indexOf(keyword.toLowerCase()) > -1
  //     if (!hit) {
  //       // 删除
  //       filterGroup.items.splice(i, 1)
  //     }
  //   }
  //   if (filterGroup.items && filterGroup.items.length > 0) {
  //     filterPosts.push(filterGroup)
  //   }
  // }
}

export default BlogPostListAll
