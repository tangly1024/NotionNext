'use client'

import BLOG from '@/blog.config'
import { useGlobal } from './global'
import { deepClone } from './utils'

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

  // 特殊配置处理；某些配置只在服务端生效；而Global的NOTION_CONFIG仅限前端组件使用，因此需要从extendConfig中读取
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

  // 首先 配置最优先读取NOTION中的表格配置
  let val = null
  let siteInfo = null

  if (global) {
    val = global.NOTION_CONFIG?.[key]
    siteInfo = global.siteInfo
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

  // 从Notion_CONFIG读取的配置通常都是字符串，适当转义
  return convertVal(val)
}

/**
 * 配置默认都是string类型；
 * 识别配置的值是否数字、布尔、[]数组，若是则转成对应类型
 * @param {*} val
 * @returns
 */
export const convertVal = val => {
  if (typeof val === 'string') {
    // 解析布尔
    if (val === 'true' || val === 'false') {
      return JSON.parse(val)
    }

    // 解析数字，parseInt将字符串转换为数字
    if (/^\d+$/.test(val)) {
      return parseInt(val)
    }
    //  转移 [] , {} 这种json串为json对象
    try {
      const parsedJson = JSON.parse(val)
      // 检查解析后的结果是否是对象或数组
      if (typeof parsedJson === 'object' && parsedJson !== null) {
        return parsedJson
      }
    } catch (error) {
      // JSON 解析失败，返回原始字符串值
      return val
    }
  }

  try {
    return JSON.parse(val)
  } catch (error) {
    // 如果值是一个字符串但不是有效的 JSON 格式，直接返回字符串
    return val
  }
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
