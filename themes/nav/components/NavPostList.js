import NavPostListEmpty from './NavPostListEmpty'
import { useRouter } from 'next/router'
import NavPostItem from './NavPostItem'
import CONFIG from '../config'
import Link from 'next/link'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const NavPostList = (props) => {
  const { customMenu, categoryOptions } = props
  // let groupedArray = categoryOptions
  // const { filteredNavPages, categoryOptions, categories } = props
  // const router = useRouter()
  // let selectedSth = false

  // let groupedArray = categoryOptions?.map(item) => {
  //   // let groups = [];
  //   groupedArray.push({ category: item.name, id: item.id, count: item.count, selected: false,items: [] })
  //   return groups
  // })

  // const groupedArray = categoryOptions?.reduce((groups, item) => {
  //   const categoryName = item?.name ? item?.name : '' // 将category转换为字符串
  //   // let existingGroup = null
  //   console.log('categoryOptions => item::')
  //   console.log(item)
  //   // 添加数据
  //   groups.push({ category: item.name, id: item.id, count: item.count, selected: false, items: [] })
  //   return groups
  // }, [])

  // 处理是否选中
  // groupedArray?.map((group) => {
  //   let groupSelected = false
  //   for (const post of group?.items) {
  //     if (router.asPath.split('?')[0] === '/' + post.slug) {
  //       groupSelected = true
  //       selectedSth = true
  //     }
  //   }
  //   group.selected = groupSelected
  //   return null
  // })

  // 如果都没有选中默认打开第一个
  // if (!selectedSth && groupedArray && groupedArray?.length > 0) {
  //   groupedArray[0].selected = true
  // }

  
  
  // console.log('groupedArray::')
  // console.log(groupedArray)

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  // if (BLOG.CUSTOM_MENU) {
  //   links = customMenu
  // }
  let links = customMenu
  return 
    {links && links?.map((link, index) => <MenuItemDrop key={index} link={link} />)}
  

  console.log('categoryOptions::')
  console.log(categoryOptions)
  if (!categoryOptions) {
    return <NavPostListEmpty />
  } else {
    return 
    
    <div id='category-list' className='dark:border-gray-700 flex flex-wrap  mx-4'>
    {categoryOptions.map(category => {
      // const selected = currentCategory === category.name
      let selected = false
      return (
        <Link
          key={category.name}
          href={`/category/${category.name}`}
          passHref
          className={(selected
            ? 'hover:text-black dark:hover:text-gray bg-indigo-600 text-black '
            : 'dark:text-gray-400 text-gray-500 hover:text-black dark:hover:text-white hover:bg-indigo-600') +
            '  text-sm w-full items-center duration-300 px-2  cursor-pointer py-1 font-light'}>

          <div> <i className={`mr-2 fas ${selected ? 'fa-folder-open' : 'fa-folder'}`} />{category.name}({category.count})</div>

        </Link>
        )
      })}
    </div>
  }



}

export default NavPostList
