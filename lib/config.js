'use client'

import BLOG from '@/blog.config'
import { useGlobal } from './global'

/**
 * 读取配置
 * 1. 优先读取NotionConfig表
 * 2. 其次读取环境变量
 * 3. 再读取blog.config.js文件
 * @param {*} key
 * @returns
 */
export const siteConfig = (key) => {
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
    console.log('当前变量', key, val)
  }

  if (!val) {
    // 这里针对部分key做一些兼容处理
    switch (key) {
      case 'HOME_BANNER_IMAGE':
        val = siteInfo?.pageCover // 封面图取Notion的封面
        break
      case 'AVATAR':
        val = siteInfo?.icon // 封面图取Notion的封面
        break
      case 'TITLE':
        val = siteConfig('TITLE') // 标题取Notion中的标题
        break
    }
  }

  // 其次 NOTION没有找到配置，则会读取blog.config.js文件
  if (!val) {
    val = BLOG[key]
  }
  console.log('配置', key, val)
  return val
}
