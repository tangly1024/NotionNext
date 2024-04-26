import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import NavPostItem from './NavPostItem'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const NavPostList = props => {
  const { filteredNavPages } = props
  const { locale, currentSearch } = useGlobal()
  const router = useRouter()

  // 存放被展开的分组
  const [expandedGroups, setExpandedGroups] = useState([])

  // 排他折叠
  const GITBOOK_EXCLUSIVE_COLLAPSE = siteConfig(
    'GITBOOK_EXCLUSIVE_COLLAPSE',
    null,
    CONFIG
  )

  // 按照分类、分组折叠内榕
  const categoryFolders = filteredNavPages?.reduce((groups, item) => {
    const categoryName = item?.category ? item?.category : '' // 将category转换为字符串

    let existingGroup = null
    // 开启自动分组排序
    if (siteConfig('GITBOOK_AUTO_SORT', true, CONFIG)) {
      existingGroup = groups.find(group => group.category === categoryName) // 搜索同名的最后一个分组
    } else {
      existingGroup = groups[groups.length - 1] // 获取最后一个分组
    }

    // 添加数据
    if (existingGroup && existingGroup.category === categoryName) {
      existingGroup.items.push(item)
    } else {
      groups.push({ category: categoryName, items: [item] })
    }
    return groups
  }, [])

  // 首次打开页面时，跟踪是否已经选择了一个项
  categoryFolders?.forEach(group => {
    let hasExpandFolder = false
    group.items.forEach(post => {
      if (router.asPath.split('?')[0] === '/' + post.slug) {
        hasExpandFolder = true
      }
    })
    group.selected = hasExpandFolder
  })

  // 如果都没有选中默认打开第一个
  useEffect(() => {
    if (expandedGroups.length === 0) {
      setExpandedGroups([0])
    }
  }, [])

  // 折叠项切换，当折叠或展开数组时会调用
  const toggleItem = index => {
    let newExpandedGroups = [...expandedGroups] // 创建一个新的展开分组数组

    // 如果expandedGroups中不存在，增加入，若存在则移除
    if (expandedGroups.includes(index)) {
      // 如果expandedGroups中包含index，则移除index
      newExpandedGroups = newExpandedGroups.filter(
        expandedIndex => expandedIndex !== index
      )
    } else {
      // 如果expandedGroups中不包含index，则加入index
      newExpandedGroups.push(index)
    }
    // 是否排他
    if (GITBOOK_EXCLUSIVE_COLLAPSE) {
      // 如果折叠菜单排他性为 true，则只展开当前分组，关闭其他已展开的分组
      newExpandedGroups = newExpandedGroups.filter(
        expandedIndex => expandedIndex === index
      )
    }

    // 更新展开分组数组
    setExpandedGroups(newExpandedGroups)
  }
  if (!categoryFolders || categoryFolders.length === 0) {
    // 空白内容
    return (
      <div className='flex w-full items-center justify-center min-h-screen mx-auto md:-mt-20'>
        <p className='text-gray-500 dark:text-gray-300'>
          {locale.COMMON.NO_RESULTS_FOUND}{' '}
          {currentSearch && <div>{currentSearch}</div>}
        </p>
      </div>
    )
  }

  return (
    <div
      id='posts-wrapper'
      className='w-full flex-grow space-y-0.5 tracking-wider'>
      {/* 文章列表 */}
      {categoryFolders?.map((group, index) => (
        <NavPostItem
          key={index}
          group={group}
          onHeightChange={props.onHeightChange}
          expanded={expandedGroups.includes(index)} // 将展开状态传递给子组件
          toggleItem={() => toggleItem(index)} // 将切换函数传递给子组件
        />
      ))}
    </div>
  )
}

export default NavPostList
