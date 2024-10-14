'use client'

import BLOG from '@/blog.config'
import { useGlobal } from './global'
import { deepClone, isUrl } from './utils'

/**
 * 读取配置顺序
 * 1. 优先读取NotionConfig表
 * 2. 其次读取环境变量
 * 3. 再读取blog.config.js / 或各个主题的CONFIG文件
 * @param {*} key ； 参数名
 * @param {*} defaultVal ; 参数不存在默认返回值
 * @param {*} extendConfig ; 参考配置对象{key:val}，如果notion中找不到优先尝试在这里面查找
 * @returns
 */
export const siteConfig = (key, defaultVal = null, extendConfig = {}) => {
  if (!key) {
    return null
  }

  // 特殊配置处理；以下配置只在服务端生效；而Global的NOTION_CONFIG仅限前端组件使用，因此需要从extendConfig中读取
  switch (key) {
    case 'NEXT_REVALIDATE_SECOND':
    case 'POST_RECOMMEND_COUNT':
    case 'IMAGE_COMPRESS_WIDTH':
    case 'PSEUDO_STATIC':
    case 'POSTS_SORT_BY':
    case 'POSTS_PER_PAGE':
    case 'POST_PREVIEW_LINES':
    case 'POST_URL_PREFIX':
    case 'POST_LIST_STYLE':
    case 'POST_LIST_PREVIEW':
    case 'POST_URL_PREFIX_MAPPING_CATEGORY':
    case 'IS_TAG_COLOR_DISTINGUISHED':
    case 'TAG_SORT_BY_COUNT':
      return convertVal(extendConfig[key] || defaultVal || BLOG[key])
    default:
  }

  let global = {}
  try {
    // const isClient = typeof window !== 'undefined'
    // eslint-disable-next-line react-hooks/rules-of-hooks
    global = useGlobal()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // global = useGlobal()
  } catch (error) {
    // 本地调试用
    // console.warn('SiteConfig警告', key, error)
  }

  // 配置最优先读取NOTION中的表格配置
  let val = null
  let siteInfo = null

  if (global) {
    siteInfo = global.siteInfo
    val = global.NOTION_CONFIG?.[key] || global.THEME_CONFIG?.[key]
  }

  if (!val) {
    // 这里针对部分key做一些兼容处理
    switch (key) {
      case 'HOME_BANNER_IMAGE':
        val = siteInfo?.pageCover // 封面图取Notion的封面
        break
      case 'AVATAR':
        val = siteInfo?.icon // 封面图取Notion的头像
        break
      case 'TITLE':
        val = siteInfo?.title // 标题取Notion中的标题
        break
      case 'DESCRIPTION':
        val = siteInfo?.description // 标题取Notion中的标题
        break
    }
  }

  // 其次 有传入的extendConfig，则尝试读取
  if (!val && extendConfig) {
    val = extendConfig[key]
  }

  // 其次 NOTION没有找到配置，则会读取blog.config.js文件
  if (!val) {
    val = BLOG[key]
  }

  if (!val) {
    return defaultVal
  }

  return convertVal(val)
}

export const cleanJsonString = val => {
  // 使用正则表达式去掉不必要的空格、换行符和制表符
  return val.replace(/\s+/g, ' ').trim()
}

/**
 * 从环境变量和NotionConfig读取的配置都是string类型；
 * 这里识别出配置的字符值若为否 数字、布尔、[]数组，{}对象，若是则转成对应类型
 * 使用JSON和eval两个函数
 * @param {*} val
 * @returns
 */
export const convertVal = val => {
  // 如果传入参数本身就是 obj、数组、boolean，就无需处理
  if (typeof val !== 'string' || !val) {
    return val
  }

  // 检测是否数字并避免数值溢出
  if (/^\d+$/.test(val)) {
    const parsedNum = Number(val)
    // 如果数值大于 JavaScript 最大安全整数，则作为字符串返回
    if (parsedNum > Number.MAX_SAFE_INTEGER) {
      return val + ''
    }
    return parsedNum
  }

  // 检测是否为布尔值
  if (val === 'true' || val === 'false') {
    return JSON.parse(val)
  }

  // 检测是否为 URL
  if (isUrl(val)) {
    return val
  }

  // 配置值前可能有污染的空格
  // 如果字符串中没有 '[' 或 '{'，则直接返回
  if (!val.trim().startsWith('{') && !val.trim().startsWith('[')) {
    return val
  }

  // 转换 [] , {} 这类字符串为对象
  try {
    val = cleanJsonString(val)
    const parsedJson = JSON.parse(val)
    // 检查解析后的结果是否为对象
    if (parsedJson !== null) {
      return parsedJson
    }
  } catch (error) {
    // 解析失败，返回原始字符串
    return val
  }

  return val
}

/**
 * 读取所有配置
 * 1. 优先读取NotionConfig表
 * 2. 其次读取环境变量
 * 3. 再读取blog.config.js文件
 * @param {*} key
 * @returns
 */
export const siteConfigMap = () => {
  const val = deepClone(BLOG)
  for (const key in val) {
    val[key] = siteConfig(key)
    // console.log('site', key, val[key], siteConfig(key))
  }
  return val
}
