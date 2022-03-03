/**
 * 修改 from 后面的路径，实现主题切换
 */

import * as Next from './Next'
import * as Fukasawa from './Fukasawa'
import * as Hexo from './Hexo'
import * as Medium from './Medium'
import * as Empty from './Empty'
export * from './Medium'
export const ThemeMap = {
  Next,
  Fukasawa,
  Hexo,
  Medium,
  Empty
}
