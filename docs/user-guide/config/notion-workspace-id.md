# NOTION_WORKSPACE_ID（工作区归属校验）
> 发布日期：2026-10-14
> 栏目：🛠 站点配置
> 关联：[Issue #4554](https://github.com/notionnext-org/NotionNext/issues/4554) · [PR #4555](https://github.com/notionnext-org/NotionNext/pull/4555)

## 背景

NotionNext 支持通过「按 ID 访问」的方式直接渲染一篇文章（例如分享链接、内嵌子页面）。此前该路径缺少归属校验：只要 URL 最后一段是任意一个「分享到网络」的 Notion 块 id，NotionNext 就会把它当作文章渲染到你的域名下——**即使是别人工作区的内容**（Issue #4554）。

新版本已在按 ID 兜底渲染前增加**工作区归属校验**：取回记录所属的工作区必须与本站一致，否则返回 404。

## 是否需要配置？

**默认无需配置。** 未配置时程序会自动从你的根页面（`NOTION_PAGE_ID`）记录里读取工作区 id 并缓存，校验照常生效。

配置 `NOTION_WORKSPACE_ID` 的收益：

- 省去一次启动时的 Notion 根页面请求
- 自动推导失败时（如根页面权限受限）作为兜底

## 配置方法

在 Vercel 环境变量或 `local.env` / `.env.local` 中添加：

```env
# 可选：博客所在 Notion 工作区(space) id
# 支持 32 位裸 id 或带连字符的 uuid，多工作区用英文逗号分隔
NOTION_WORKSPACE_ID=097e5f674880459d8e1b4407758dc4fb
```

### 如何获取工作区 id

打开你的 Notion 根页面（即 `NOTION_PAGE_ID` 指向的页面），从浏览器地址栏复制页面 id 即可（同一工作区的任意页面 id 均可）。格式如：

```text
https://www.notion.so/My-Site-097e5f674880459d8e1b4407758dc4fb
                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 这一段就是
```

## 多站点说明

- `NOTION_PAGE_ID` 配置了多个站点（逗号分隔）且分属不同工作区时，这些工作区都会被自动允许，无需额外配置
- 若手动配置 `NOTION_WORKSPACE_ID`，请用逗号列出**所有**站点所在的工作区 id

## 行为说明

| 场景 | 结果 |
| --- | --- |
| 本站文章（slug / 列表匹配） | 不受影响，不走校验 |
| 本站内容按 id 访问、内嵌子页面 | 正常渲染 |
| 他人工作区分享的内容 | 404，并输出告警日志 |
| 工作区 id 暂时无法确认（网络故障等） | 404（宁可拒绝，不误放行），恢复后自动重试 |
