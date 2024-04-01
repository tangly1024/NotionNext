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
export const siteConfig = (key, defaultVal = null, extendConfig = null) => {
  let global = null
  try {
    const isClient = typeof window !== 'undefined'
    // eslint-disable-next-line react-hooks/rules-of-hooks
    global = isClient ? useGlobal() : {}
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // global = useGlobal()
  } catch (error) {}

  // 首先 配置最优先读取NOTION中的表格配置
  let val = null
  let siteInfo = null

  if (global) {
    val = global.NOTION_CONFIG?.[key]
    siteInfo = global.siteInfo
    // console.log('当前变量', key, val)
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

  // 其次 有传入的配置参考，则尝试读取
  if (!val && extendConfig) {
    val = extendConfig[key]
  }

  // 其次 NOTION没有找到配置，则会读取blog.config.js文件
  if (!val) {
    val = BLOG[key]
  }

  if (!val) {
    return defaultVal
  } else {
    if (typeof val === 'string') {
      if (val === 'true' || val === 'false') {
        return JSON.parse(val)
      }
      if (/^\d+$/.test(val)) {
        // 如果是数字，使用parseFloat或者parseInt将字符串转换为数字
        return parseInt(val)
      }
      return val
    } else {
      try {
        return JSON.parse(val)
      } catch (error) {
        // 如果值是一个字符串但不是有效的 JSON 格式，直接返回字符串
        return val
      }
    }
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
