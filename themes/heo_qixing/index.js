/**
 *   HEO 主题说明
 *  > 主题设计者 [张洪](https://zhheo.com/)
 *  > 主题开发者 [tangly1024](https://github.com/tangly1024)
 *  1. 开启方式 在blog.config.js 将主题配置为 `HEO`
 *  2. 更多说明参考此[文档](https://docs.tangly1024.com/article/notionnext-heo)
 */

import CONFIG from './config'
import dynamic from 'next/dynamic'
import { LayoutBase } from './LayoutBase'

const LayoutIndex = dynamic(() =>
  import('./LayoutIndex').then(mod => mod.LayoutIndex)
)
const LayoutSearch = dynamic(() =>
  import('./LayoutSearch').then(mod => mod.LayoutSearch)
)
const LayoutArchive = dynamic(() =>
  import('./LayoutArchive').then(mod => mod.LayoutArchive)
)
const LayoutSlug = dynamic(() =>
  import('./LayoutSlug').then(mod => mod.LayoutSlug)
)
const Layout404 = dynamic(() =>
  import('./Layout404').then(mod => mod.Layout404)
)
const LayoutPostList = dynamic(() =>
  import('./LayoutPostList').then(mod => mod.LayoutPostList)
)
const LayoutCategoryIndex = dynamic(() =>
  import('./LayoutCategoryIndex').then(mod => mod.LayoutCategoryIndex)
)
const LayoutTagIndex = dynamic(() =>
  import('./LayoutTagIndex').then(mod => mod.LayoutTagIndex)
)

export {
  CONFIG as THEME_CONFIG,
  LayoutBase,
  LayoutIndex,
  LayoutSearch,
  LayoutArchive,
  LayoutSlug,
  Layout404,
  LayoutPostList,
  LayoutCategoryIndex,
  LayoutTagIndex
}