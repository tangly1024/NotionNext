'use client'

import BLOG from '@/blog.config'
import { useGlobal } from './global'
import { deepClone } from './utils'

/**
 * 读取配置
 * 1. 优先读取NotionConfig表
 * 2. 其次读取环境变量
 * 3. 再读取blog.config.js文件
 * @param {*} key ； 参数名
 * @param {*} defaultVal ; 参数不存在默认返回值
 * @returns
 */
export const siteConfig = (key, defaultVal = null) => {
  let global = null
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    global = useGlobal()
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
    }
  }

  // 其次 NOTION没有找到配置，则会读取blog.config.js文件
  if (!val) {
    val = BLOG[key]
  }
  if (!val) {
    val = defaultVal
  }
  //   console.log('实际配置', key, val)
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
