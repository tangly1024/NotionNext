import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import BlogPostCard from './BlogPostCard'
import NavPostItem from './NavPostItem'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const NavPostList = props => {
  const { filteredNavPages, post } = props
  const { locale, currentSearch } = useGlobal()
  const router = useRouter()

  // 按分类将文章分组成文件夹
  const categoryFolders = groupArticles(filteredNavPages)

  // 存放被展开的分组
  const [expandedGroups, setExpandedGroups] = useState([])

  // 是否排他折叠，一次只展开一个文件夹
  const GITBOOK_EXCLUSIVE_COLLAPSE = siteConfig(
    'GITBOOK_EXCLUSIVE_COLLAPSE',
    null,
    CONFIG
  )

  // 展开文件夹
  useEffect(() => {
    setTimeout(() => {
      // 默认展开一个
      const defaultOpenIndex = getDefaultOpenIndexByPath(
        categoryFolders,
        decodeURIComponent(router.asPath.split('?')[0])
      )
      setExpandedGroups([defaultOpenIndex])
    }, 500)
  }, [router, filteredNavPages])

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

  // 空数据返回
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
  // 如果href
  const href = siteConfig('GITBOOK_INDEX_PAGE') + ''

  const homePost = {
    id: '-1',
    title: siteConfig('DESCRIPTION'),
    href: href.indexOf('/') !== 0 ? '/' + href : href
  }

  return (
    <div
      id='posts-wrapper'
      className='w-full flex-grow space-y-0.5 pr-4 tracking-wider'>
      {/* 当前文章 */}
      <BlogPostCard className='mb-4' post={homePost} />

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

// 按照分类将文章分组成文件夹
function groupArticles(filteredNavPages) {
  if (!filteredNavPages) {
    return []
  }
  const groups = []
  const AUTO_SORT = siteConfig('GITBOOK_AUTO_SORT', true, CONFIG)

  for (let i = 0; i < filteredNavPages.length; i++) {
    const item = filteredNavPages[i]
    const categoryName = item?.category ? item?.category : '' // 将category转换为字符串

    let existingGroup = null
    // 开启自动分组排序；将同分类的自动归到同一个文件夹，忽略Notion中的排序
    if (AUTO_SORT) {
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
  }
  return groups
}

/**
 * 查看当前路由需要展开的菜单索引
 * 路过都没有，则返回0，即默认展开第一个
 * @param {*} categoryFolders
 * @param {*} path
 * @returns {number} 返回需要展开的菜单索引
 */
function getDefaultOpenIndexByPath(categoryFolders, path) {
  // 默认展开第一个索引
  let defaultIndex = 0

  // 查找满足条件的第一个索引
  const index = categoryFolders.findIndex(group => {
    return group.items.some(post => path === '/' + post.slug)
  })

  // 如果找到满足条件的索引，则设置为该索引
  if (index !== -1) {
    defaultIndex = index
  }

  return defaultIndex
}
export default NavPostList
