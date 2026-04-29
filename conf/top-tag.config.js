/**
 * 全局置顶配置
 *
 * 使用方式：
 * - 在 Notion 的 Config 页填写 `TOP_TAG`（同名覆盖）
 * - 或在环境变量中设置 `NEXT_PUBLIC_TOP_TAG` / `TOP_TAG`
 *
 * 开启后：
 * - 仅当存在多个置顶文章时，才按最近更新时间倒序排序置顶子集
 * - 其它非置顶文章的相对顺序不变
 */
module.exports = {
  TOP_TAG: process.env.NEXT_PUBLIC_TOP_TAG || process.env.TOP_TAG || ''
}

