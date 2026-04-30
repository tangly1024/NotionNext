/**
 * 全局置顶排序工具（纯函数，无依赖主题/配置，便于测试）
 *
 * 规则（与你确认的 A 一致）：
 * - 开启 topTag（topTag 非空）才生效
 * - 只重排“置顶文章”子集
 * - “非置顶文章”的索引位置不变（尽量保持原排序不动）
 * - 置顶文章按 lastEditedDate（兜底 publishDate）倒序；相同时间保持稳定（原相对顺序）
 */

function getPostLatestTime(post) {
  // lastEditedDate：getPageProperties 里基于 notion last_edited_time 生成
  if (post?.lastEditedDate) {
    return post.lastEditedDate
  }
  // publishDate：兜底保证不会出现 NaN
  if (post?.publishDate) {
    return post.publishDate
  }
  return 0
}

export function sortPinnedPostsByLatestUpdate(posts, topTag) {
  if (!Array.isArray(posts) || !topTag) {
    return posts
  }

  const pinnedSlots = []
  const pinned = []
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i]
    const tags = Array.isArray(p?.tags) ? p.tags : []
    if (tags.includes(topTag)) {
      pinnedSlots.push(i)
      pinned.push({ post: p, idx: i })
    }
  }

  if (pinned.length <= 1) {
    // 0 或 1 个置顶：不改变顺序，避免无谓数组重排
    return posts
  }

  pinned.sort((a, b) => {
    const timeA = new Date(getPostLatestTime(a.post)).getTime()
    const timeB = new Date(getPostLatestTime(b.post)).getTime()
    if (timeB !== timeA) {
      return timeB - timeA
    }
    // 稳定：相同时间保持原相对顺序
    return a.idx - b.idx
  })

  // 关键：只重排置顶文章“自身在原列表中的索引位置”，不移动非置顶文章索引
  const result = [...posts]
  pinnedSlots.sort((a, b) => a - b) // 升序：保证最靠前的置顶槽位会拿到最新的置顶文章
  for (let i = 0; i < pinned.length; i++) {
    result[pinnedSlots[i]] = pinned[i].post
  }
  return result
}

