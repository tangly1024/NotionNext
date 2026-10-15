# V4 发布历史

以下为 v4.10.0 之后的发布记录；较新的版本要点见[最新版本更新日志](./latest.md)。旧版 V4.9.0 及更早版本见本页归档。

| 版本 | 发布日期 | 发布说明 |
| --- | --- | --- |
| [v4.11.0](https://github.com/notionnext-org/NotionNext/releases/tag/v4.11.0) | 2026-10-14 | [功能与升级须知](./latest.md#_4-11-0-发布要点) · [完整变更](https://github.com/notionnext-org/NotionNext/compare/v4.10.10...v4.11.0) |
| [v4.10.10](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.10) | 2026-08-13 | [发布要点](./latest.md#_4-10-10-发布要点) · [完整变更](https://github.com/notionnext-org/NotionNext/compare/v4.10.9...v4.10.10) |
| [v4.10.9](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.9) | 2026-08-10 | [发布要点](./latest.md#_4-10-9-发布要点) · [完整变更](https://github.com/notionnext-org/NotionNext/compare/v4.10.8...v4.10.9) |
| [v4.10.8](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.8) | 2026-07-22 | [发布要点](./latest.md#_4-10-8-发布要点) · [完整变更](https://github.com/notionnext-org/NotionNext/compare/v4.10.7...v4.10.8) |
| [v4.10.7](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.7) | 2026-07-18 | [发布要点](./latest.md#_4-10-7-发布要点) · [完整变更](https://github.com/notionnext-org/NotionNext/compare/v4.10.6...v4.10.7) |
| [v4.10.6](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.6) | 2026-07-15 | [GitHub Release](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.6) · [完整变更](https://github.com/notionnext-org/NotionNext/compare/v4.10.5...v4.10.6) |
| [v4.10.5](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.5) | 2026-07-09 | [发布要点](./latest.md#_4-10-5-发布要点) · [完整变更](https://github.com/notionnext-org/NotionNext/compare/v4.10.4...v4.10.5) |
| [v4.10.4](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.4) | 2026-07-06 | [GitHub Release](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.4) · [完整变更](https://github.com/notionnext-org/NotionNext/compare/v4.10.3...v4.10.4) |
| [v4.10.3](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.3) | 2026-06-25 | [发布要点](./latest.md#_4-10-3-发布要点) · [完整变更](https://github.com/notionnext-org/NotionNext/compare/v4.10.2...v4.10.3) |
| [v4.10.2](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.2) | 2026-06-08 | [GitHub Release](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.2) · [完整变更](https://github.com/notionnext-org/NotionNext/compare/v4.10.1...v4.10.2) |
| [v4.10.1](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.1) | 2026-06-04 | [GitHub Release](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.1) · [完整变更](https://github.com/notionnext-org/NotionNext/compare/v4.10.0...v4.10.1) |
| [v4.10.0](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.0) | 2026-06-03 | [GitHub Release](https://github.com/notionnext-org/NotionNext/releases/tag/v4.10.0) |

---

# V4.9.0 及更早版本归档
> 迁移自：[V4.0 → V4.9.0](https://docs.tangly1024.com/article/v4.0)
> 发布日期：2023-7-8
> 最后编辑：2025-10-11
> 原栏目：✨ 更新日志
> 标签：更新历史

::: tip 提示
新加入的开发者们技艺高超，为大家带来了大量的优化与改动，感恩！
:::


## V4.0 更新总览

1. 升级Nextjs底层框架版本

1. 新主题[Magzine](/user-guide/themes/magzine)（专业杂志）

1. 新主题[Proxio ](/user-guide/themes/proxio)（一人公司）

1. 新主题[Typography](/user-guide/themes/typography)(活字印刷)

1. 公众号OpenWrite解锁

1. 加入[Coze-AI助手](/user-guide/plugins/notion-next-coze)

1. Gitbook主题改版

1. 部分整合Clerk登录

1. 主题切换组件微调

1. 重新梳理配置文件

1. 支持IconFont图标库

1. 已有特性功能的重构与优化


### V4.9 2025.8.26

[4.9.0](https://github.com/tangly1024/NotionNext/releases/tag/v4.9.0)版本代码影响范围较大，但对普通用户没有实际使用效益，因此未合并入main分支以供大众使用。
大版本升级，非专业人士小心驾驶。[https://github.com/tangly1024/NotionNext/tree/release/4.9.0](https://github.com/tangly1024/NotionNext/tree/release/4.9.0)

目前已知会经常打印一些api请求错误，大致是notion-client更新后的并发请求不稳定导致。尽管并不影响项目运行。


### **What's Changed**

- 针对NotionAPI的更新调整了代码，同时将4.8.6中的大量代码重构也进行合并。[#3568](https://github.com/tangly1024/NotionNext/pull/3568)

- 已知bug修复与开发层面的性能优化；对普通用户体验影响不大，可选择性更新

- starter主题新增lite模式，隐藏页头页脚便于嵌入 by **[@tangly1024](https://github.com/tangly1024)** in [#3490](https://github.com/tangly1024/NotionNext/pull/3490)

- Feat typography 博客英文标题 by **[@CreateSun](https://github.com/CreateSun)** in [#3489](https://github.com/tangly1024/NotionNext/pull/3489)

- fix: APlayer url update by **[@RedhairHambagu](https://github.com/RedhairHambagu)** in [#3520](https://github.com/tangly1024/NotionNext/pull/3520)

- feat: add SmartLink component for internal and external links by **[@qixing-jk](https://github.com/qixing-jk)** in [#3517](https://github.com/tangly1024/NotionNext/pull/3517)

- fix: correct logo ratio in Gitbook theme by **[@qixing-jk](https://github.com/qixing-jk)** in [#3515](https://github.com/tangly1024/NotionNext/pull/3515)

- feat: enhance mailto/tel link handling and streamline imports by **[@qixing-jk](https://github.com/qixing-jk)** in [#3486](https://github.com/tangly1024/NotionNext/pull/3486)

- feat(algolia): add data deletion functionality and execute in index.js by **[@qixing-jk](https://github.com/qixing-jk)** in [#3482](https://github.com/tangly1024/NotionNext/pull/3482)

- feat(getPageContentText): refactor content text extraction logic by **[@qixing-jk](https://github.com/qixing-jk)** in [#3480](https://github.com/tangly1024/NotionNext/pull/3480)

- fix(search): handle cases where slug is undefined by **[@qixing-jk](https://github.com/qixing-jk)** in [#3479](https://github.com/tangly1024/NotionNext/pull/3479)

- feat(email encrypt): implement base64 encoding for contact email config by **[@qixing-jk](https://github.com/qixing-jk)** in [#3478](https://github.com/tangly1024/NotionNext/pull/3478)


## V4.8更新总览

因为加入一些新的功能和配置，同时大量调整了配置文件，**更新时blog.config.js文件会发生大量冲突**，请小心驾驶。

推荐做法是：请备份所有原先的文件代码（下载保留或拉另一个分支备份），或者迁移到NOTION_CONFIG等方式，然后更新时选择放弃你的原有代码，从而确保代码一致性。

blog.config.js 配置文件太多，而且大部分用不到，因此拆分到 /conf/*.js 文件中，可以按需使用。

```JavaScript
// 原配置文件过长，且并非所有人都会用到，故此将配置拆分到/conf/目录下, 按需找到对应文件并修改即可
...require('./conf/comment.config'), // 评论插件
...require('./conf/contact.config'), // 作者联系方式配置
...require('./conf/post.config'), // 文章与列表配置
...require('./conf/analytics.config'), // 站点访问统计
...require('./conf/image.config'), // 网站图片相关配置
...require('./conf/font.config'), // 网站字体
...require('./conf/right-click-menu'), // 自定义右键菜单相关配置
...require('./conf/code.config'), // 网站代码块样式
...require('./conf/animation.config'), // 动效美化效果
...require('./conf/widget.config'), // 悬浮在网页上的挂件，聊天客服、宠物挂件、音乐播放器等
...require('./conf/ad.config'), // 广告营收插件
...require('./conf/plugin.config'), // 其他第三方插件 algolia全文索引

  // 高级用法
...require('./conf/layout-map.config'), // 路由与布局映射自定义，例如自定义特定路由的页面布局
...require('./conf/notion.config'), // 读取notion数据库相关的扩展配置，例如自定义表头
...require('./conf/dev.config'), // 开发、调试时需要关注的配置
```
可以在相关目录下找到对应文件配置
![image.png](/legacy/a068a6d31001ec5d.png)


### **V4.8.6** （2025-07-07）

![image](/legacy/5fbe0e79bae1b19e.png)


### **What's Changed**

- 4.8.5 封板 by **[@tangly1024](https://github.com/tangly1024)** in [#3430](https://github.com/tangly1024/NotionNext/pull/3430)

- fix: hexo主题中，移动端菜单适配主题色失效 by **[@LooseLi](https://github.com/LooseLi)** in [#3440](https://github.com/tangly1024/NotionNext/pull/3440)

- Notion数据库支持配置视图索引 by **[@tangly1024](https://github.com/tangly1024)** in [#3446](https://github.com/tangly1024/NotionNext/pull/3446)

- feat(aisummary): Return null when AI summary retrieval fails to preve… by **[@qixing-jk](https://github.com/qixing-jk)** in [#3474](https://github.com/tangly1024/NotionNext/pull/3474)

- fix(algoliasearch样式溢出问题): by **[@qixing-jk](https://github.com/qixing-jk)** in [#3475](https://github.com/tangly1024/NotionNext/pull/3475)

- fix(proxio): enable image click navigation in list view by **[@qixing-jk](https://github.com/qixing-jk)** in [#3473](https://github.com/tangly1024/NotionNext/pull/3473)

- feat(ArticleExpirationNotice): implement ArticleExpirationNotice comp… by **[@qixing-jk](https://github.com/qixing-jk)** in [#3472](https://github.com/tangly1024/NotionNext/pull/3472)

- feat(ArticleCopyright): initially implement the "not by AI" function by **[@qixing-jk](https://github.com/qixing-jk)** in [#3471](https://github.com/tangly1024/NotionNext/pull/3471)

- 增加主题 typography by **[@yakiisama](https://github.com/yakiisama)** in [#3461](https://github.com/tangly1024/NotionNext/pull/3461)


### **New Contributors**

- **[@yakiisama](https://github.com/yakiisama)** made their first contribution in [#3461](https://github.com/tangly1024/NotionNext/pull/3461)

**Full Changelog**: [v4.8.5...v4.8.6](https://github.com/tangly1024/NotionNext/compare/v4.8.5...v4.8.6)


### V4.8.5(2025-06-05)


### What's Changed

- 修复4.8.4已知问题

- 修復无标签编译出错 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/3331](https://github.com/tangly1024/NotionNext/pull/3331)

- Feat/theme proxio by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/3338](https://github.com/tangly1024/NotionNext/pull/3338)

- Feat/theme proxio by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/3339](https://github.com/tangly1024/NotionNext/pull/3339)

- proxio 切换主题时的背景色 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/3340](https://github.com/tangly1024/NotionNext/pull/3340)

- proxio 微调 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/3341](https://github.com/tangly1024/NotionNext/pull/3341)

- 微调白点 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/3342](https://github.com/tangly1024/NotionNext/pull/3342)

- proxio 白点动画相关 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/3349](https://github.com/tangly1024/NotionNext/pull/3349)

- Update 主题默认hexo by @wsa0227 in [https://github.com/tangly1024/NotionNext/pull/3328](https://github.com/tangly1024/NotionNext/pull/3328)

- fix: correct RightFloatArea hiding behavior when scrolling back to top by @LooseLi in [https://github.com/tangly1024/NotionNext/pull/3355](https://github.com/tangly1024/NotionNext/pull/3355)

- fix(修复tags为空时foreach报错的问题) by @qixing-jk in [https://github.com/tangly1024/NotionNext/pull/3329](https://github.com/tangly1024/NotionNext/pull/3329)

- Create [SECURITY.md](http://security.md/) by @expoli in [https://github.com/tangly1024/NotionNext/pull/3346](https://github.com/tangly1024/NotionNext/pull/3346)

- 修复画廊视图左右边线不展示Bug by @lusyoe in [https://github.com/tangly1024/NotionNext/pull/3371](https://github.com/tangly1024/NotionNext/pull/3371)

- build(react-notion-x): 升级 react-notion-x 至 7.3.0 by @qixing-jk in [https://github.com/tangly1024/NotionNext/pull/3374](https://github.com/tangly1024/NotionNext/pull/3374)

- add .nvmrc by @LooseLi in [https://github.com/tangly1024/NotionNext/pull/3394](https://github.com/tangly1024/NotionNext/pull/3394)

- build(nodejs): enforce Node.js &gt;=20 in engines and .nvmrc by @qixing-jk in [https://github.com/tangly1024/NotionNext/pull/3392](https://github.com/tangly1024/NotionNext/pull/3392)

- feat: Update Twikoo dependency from 1.6.17 to 1.6.42 by @ZZHow1024 in [https://github.com/tangly1024/NotionNext/pull/3365](https://github.com/tangly1024/NotionNext/pull/3365)

- feat: hexo主题的全站主题色配置和适配 by @LooseLi in [https://github.com/tangly1024/NotionNext/pull/3403](https://github.com/tangly1024/NotionNext/pull/3403)

- fix：兼容 Notion 的旧 AWS 链接格式与新的 attachment 链接，避免 embed 链接被错误处理 by @LooseLi in [https://github.com/tangly1024/NotionNext/pull/3353](https://github.com/tangly1024/NotionNext/pull/3353)

- fix: 样式隔离 by @LooseLi in [https://github.com/tangly1024/NotionNext/pull/3404](https://github.com/tangly1024/NotionNext/pull/3404)

- feat: upgrade twikoo to v1.6.44 by @eddiehe99 in [https://github.com/tangly1024/NotionNext/pull/3412](https://github.com/tangly1024/NotionNext/pull/3412)

- fix: spoiler隐藏文本失效 by @LooseLi in [https://github.com/tangly1024/NotionNext/pull/3429](https://github.com/tangly1024/NotionNext/pull/3429)

- fix: 修复深色模式下闪烁问题 by @LooseLi in [https://github.com/tangly1024/NotionNext/pull/3428](https://github.com/tangly1024/NotionNext/pull/3428)

- fix: 修复兼容 notion-client 索引 index 问题 by @JinliG in [https://github.com/tangly1024/NotionNext/pull/3425](https://github.com/tangly1024/NotionNext/pull/3425)

- Fix eslint errors by @LooseLi in [https://github.com/tangly1024/NotionNext/pull/3419](https://github.com/tangly1024/NotionNext/pull/3419)

- Update sync.yaml by @eddiehe99 in [https://github.com/tangly1024/NotionNext/pull/3414](https://github.com/tangly1024/NotionNext/pull/3414)


### New Contributors

- @wsa0227 made their first contribution in [https://github.com/tangly1024/NotionNext/pull/3328](https://github.com/tangly1024/NotionNext/pull/3328)

- @lusyoe made their first contribution in [https://github.com/tangly1024/NotionNext/pull/3371](https://github.com/tangly1024/NotionNext/pull/3371)

- @ZZHow1024 made their first contribution in [https://github.com/tangly1024/NotionNext/pull/3365](https://github.com/tangly1024/NotionNext/pull/3365)

- @eddiehe99 made their first contribution in [https://github.com/tangly1024/NotionNext/pull/3412](https://github.com/tangly1024/NotionNext/pull/3412)

- @JinliG made their first contribution in [https://github.com/tangly1024/NotionNext/pull/3425](https://github.com/tangly1024/NotionNext/pull/3425)

**Full Changelog**: [https://github.com/tangly1024/NotionNext/compare/v4.8.4...v4.8.5](https://github.com/tangly1024/NotionNext/compare/v4.8.4...v4.8.5)


### V4.8.4(2025-04-11)


### **What's Changed**

- 修复4.8.3已知问题 by **[@tangly1024](https://github.com/tangly1024)** in [#3192](https://github.com/tangly1024/NotionNext/pull/3192)

- feat: ✨ add missing translation strings by **[@noeFly](https://github.com/noeFly)** in [#3219](https://github.com/tangly1024/NotionNext/pull/3219)

- Improved zh-HK translations by **[@rickyltwong](https://github.com/rickyltwong)** in [#3207](https://github.com/tangly1024/NotionNext/pull/3207)

- Fix/mermaid by **[@qixing-jk](https://github.com/qixing-jk)** in [#3225](https://github.com/tangly1024/NotionNext/pull/3225)

- feat(localization): introduce localization to 404 texts by **[@YesYouKenSpace](https://github.com/YesYouKenSpace)** in [#3233](https://github.com/tangly1024/NotionNext/pull/3233)

- [Iconfont图标支持](/user-guide/config/notion-next-iconfont) by **[@tangly1024](https://github.com/tangly1024)** in [#3324](https://github.com/tangly1024/NotionNext/pull/3324)

- fix: enable all Notion file types to work properly by **[@LooseLi](https://github.com/LooseLi)** in [#3317](https://github.com/tangly1024/NotionNext/pull/3317)

- fix(文章排序) by **[@LooseLi](https://github.com/LooseLi)** in [#3310](https://github.com/tangly1024/NotionNext/pull/3310)

- build(tsconfig): update tsconfig to exclude the public directory by **[@qixing-jk](https://github.com/qixing-jk)** in [#3312](https://github.com/tangly1024/NotionNext/pull/3312)

- feat(contributors) by **[@LooseLi](https://github.com/LooseLi)** in [#3301](https://github.com/tangly1024/NotionNext/pull/3301)

- fix(下拉子菜单闪烁问题[#3154](https://github.com/tangly1024/NotionNext/issues/3154)) by **[@LooseLi](https://github.com/LooseLi)** in [#3299](https://github.com/tangly1024/NotionNext/pull/3299)

- 增加 Threads Social & Share button by **[@rickyltwong](https://github.com/rickyltwong)** in [#3298](https://github.com/tangly1024/NotionNext/pull/3298)

- fix: search bar function by **[@rickyltwong](https://github.com/rickyltwong)** in [#3297](https://github.com/tangly1024/NotionNext/pull/3297)

- 修复sitemap多个斜杠导致无法自动编入索引[#3260](https://github.com/tangly1024/NotionNext/issues/3260)；修复自定义备案链接不生效[#3267](https://github.com/tangly1024/NotionNext/issues/3267) [#3244](https://github.com/tangly1024/NotionNext/issues/3244) by **[@LooseLi](https://github.com/LooseLi)** in [#3287](https://github.com/tangly1024/NotionNext/pull/3287)

- fix: 🐛 修復 Hexo 主題下 404 頁面無法在地化 by **[@noeFly](https://github.com/noeFly)** in [#3222](https://github.com/tangly1024/NotionNext/pull/3222)

- Fix/iconfont by **[@tangly1024](https://github.com/tangly1024)** in [#3326](https://github.com/tangly1024/NotionNext/pull/3326)

- fix: 🐛 修復 i18n 無法套用語言變體 by **[@noeFly](https://github.com/noeFly)** in [#3223](https://github.com/tangly1024/NotionNext/pull/3223)

- fix(修复隐藏文章中无法显示只存在于隐藏文章中的标签的问题): by **[@qixing-jk](https://github.com/qixing-jk)** in [#3325](https://github.com/tangly1024/NotionNext/pull/3325)


### **New Contributors**

- **[@noeFly](https://github.com/noeFly)** made their first contribution in [#3219](https://github.com/tangly1024/NotionNext/pull/3219)

- **[@rickyltwong](https://github.com/rickyltwong)** made their first contribution in [#3207](https://github.com/tangly1024/NotionNext/pull/3207)

- **[@YesYouKenSpace](https://github.com/YesYouKenSpace)** made their first contribution in [#3233](https://github.com/tangly1024/NotionNext/pull/3233)

**Full Changelog**: [v4.8.3...v4.8.4](https://github.com/tangly1024/NotionNext/compare/v4.8.3...v4.8.4)


### V 4.8.3 (2025-02-02)


### What's Changed

- 修复`近期图片无法显示的问题`，兼容Notion文件新URL格式，Fix/image by [@tangly1024](https://github.com/tangly1024) in [#3191](https://github.com/tangly1024/NotionNext/pull/3191)

- 修改了版本号

- 定时发布相关修复，Fix/scheduler publish by [@tangly1024](https://github.com/tangly1024) in [#3169](https://github.com/tangly1024/NotionNext/pull/3169)

- 文章500错误，Fix get post 500 [#3167](https://github.com/tangly1024/NotionNext/issues/3167) by [@qixing-jk](https://github.com/qixing-jk) in [#3168](https://github.com/tangly1024/NotionNext/pull/3168)

- 祝大家新年快乐！

**Full Changelog**: [v4.8.2...v4.8.3](https://github.com/tangly1024/NotionNext/compare/v4.8.2...v4.8.3)


### V 4.8.2 (2025-01-19)


### What's Changed

- feat: 添加备案查询链接配置 by [@zzzhizhia](https://github.com/zzzhizhia) in [#3141](https://github.com/tangly1024/NotionNext/pull/3141)

- 公众号解锁添加[黄名单功能](https://www.notion.so/aadeb849777d4283b3013eec0d7314ee?pvs=25) by [@tangly1024](https://github.com/tangly1024) in [#3163](https://github.com/tangly1024/NotionNext/pull/3163)

- 解决sitemap有重复loc的问题 [#3161](https://github.com/tangly1024/NotionNext/pull/3161) by [@pei92](https://github.com/pei92) in [#3165](https://github.com/tangly1024/NotionNext/pull/3165)


### New Contributors

- [@zzzhizhia](https://github.com/zzzhizhia) made their first contribution in [#3141](https://github.com/tangly1024/NotionNext/pull/3141)

- [@pei92](https://github.com/pei92) made their first contribution in [#3161](https://github.com/tangly1024/NotionNext/pull/3161)

**Full Changelog**: [v4.8.1...v4.8.2](https://github.com/tangly1024/NotionNext/compare/v4.8.1...v4.8.2)


### V 4.8.1 （2025-01-05）


### What's Changed

- 版本号4.8.1 by [@tangly1024](https://github.com/tangly1024) in [#3116](https://github.com/tangly1024/NotionNext/pull/3116)

- 新增文章定时上架、下架功能 ,详见 [/user-guide/notion/notionnext-scheduled-article-release](/user-guide/notion/notionnext-scheduled-article-release)

- 优化spoiler-text.css，平滑过渡符合现代审美 by [@Hyphen-H](https://github.com/Hyphen-H) in [#3108](https://github.com/tangly1024/NotionNext/pull/3108)

- feat(使用全局变量的 notionAPI): 避免多次创建NotionAPI，有效利用内置的concurrency并发请求限制 by [@qixing-jk](https://github.com/qixing-jk) in [#3109](https://github.com/tangly1024/NotionNext/pull/3109)

- 优化缓存行为和调用方式 by [@qixing-jk](https://github.com/qixing-jk) in [#3111](https://github.com/tangly1024/NotionNext/pull/3111)

- Change the spelling of the STARTER_CTA_DESCRIPTION by [@Phillweston](https://github.com/Phillweston) in [#3110](https://github.com/tangly1024/NotionNext/pull/3110)

- 增强分享按钮的可读性和tags功能: 给Facebook/Twitter/Tumblr和Workplace 添加分享按钮的tags功能 by [@qixing-jk](https://github.com/qixing-jk) in [#3112](https://github.com/tangly1024/NotionNext/pull/3112)

- Perf vercel data cache by [@qixing-jk](https://github.com/qixing-jk) in [#3114](https://github.com/tangly1024/NotionNext/pull/3114)

- 初步实现UUID 重定向至slug功能 by [@qixing-jk](https://github.com/qixing-jk) in [#3113](https://github.com/tangly1024/NotionNext/pull/3113)

- Feat redis cache by [@qixing-jk](https://github.com/qixing-jk) in [#3117](https://github.com/tangly1024/NotionNext/pull/3117)


### New Contributors

- [@Hyphen-H](https://github.com/Hyphen-H) made their first contribution in [#3108](https://github.com/tangly1024/NotionNext/pull/3108)

**Full Changelog**: [v4.8.0...v4.8.1](https://github.com/tangly1024/NotionNext/compare/v4.8.0...v4.8.1)


### V 4.8.0（2025-01-01）


### What's Changed

- fix rss bug by [@tangly1024](https://github.com/tangly1024) in [#3104](https://github.com/tangly1024/NotionNext/pull/3104)

- fix  Meting播放器问题修复 by [@SnowWarri0r](https://github.com/SnowWarri0r) in [#3102](https://github.com/tangly1024/NotionNext/pull/3102)

- **feat ****[spoiler文字剧透遮罩css特性](https://github.com/tangly1024/NotionNext/issues/2841)** 支持spoiler text by [@qixing-jk](https://github.com/qixing-jk) in [#3099](https://github.com/tangly1024/NotionNext/pull/3099)

- fix : 取消 Heo 对 Hexo 文件的引用, 保持主题间的独立性 by [@Daleveral](https://github.com/Daleveral) in [#3095](https://github.com/tangly1024/NotionNext/pull/3095)

- fix (修复 hash 跳转): by [@qixing-jk](https://github.com/qixing-jk) in [#3093](https://github.com/tangly1024/NotionNext/pull/3093)

- fix 修复并优化 google adsense by [@qixing-jk](https://github.com/qixing-jk) in [#3092](https://github.com/tangly1024/NotionNext/pull/3092)

- feat aisummary wordcount by [@qixing-jk](https://github.com/qixing-jk) in [#3091](https://github.com/tangly1024/NotionNext/pull/3091)

- feat&fix (支持私有页面的数据访问): 使用react-notion-x要求的方式进行NotionAPI的配置 by [@qixing-jk](https://github.com/qixing-jk) in [#3082](https://github.com/tangly1024/NotionNext/pull/3082)

- feat 多主题的页面404跳转功能 by [@Phillweston](https://github.com/Phillweston) in [#2678](https://github.com/tangly1024/NotionNext/pull/2678)

- fix code format for busuanzi.js by [@Phillweston](https://github.com/Phillweston) in [#2680](https://github.com/tangly1024/NotionNext/pull/2680)


### New Contributors

- [@SnowWarri0r](https://github.com/SnowWarri0r) made their first contribution in [#3102](https://github.com/tangly1024/NotionNext/pull/3102)

**Full Changelog**: [v4.7.13...v4.8.0](https://github.com/tangly1024/NotionNext/compare/v4.7.13...v4.8.0)


## V4.7 更新 总览

- 增加了文章通过公众号解锁的功能。《[公众号验证码解锁教程](https://www.notion.so/aadeb849777d4283b3013eec0d7314ee?pvs=25)》

- 新的主题[Magzine](https://www.notion.so/101f93b9208b8025bc72f0131d58a06e?pvs=25)，用于缓解审美疲劳。

::: tip 提示
距离V5.0的会员系统越来越近，但考虑到国内使用这种网站登录会有大量的协议、隐私、安全、备案等问题，这样会徒增系统的复杂度。

在国外使用Google等第三方登录很方便，在国内就需要进一步考虑后续问题，目前偏向国内使用邮箱注册、结合其它的私域平台提供服务。

因此4.7版本中，尝试使用国内的微信公众号作为用户的管理渠道。而站点则作为主要的公域引流和品宣作用。
:::


## V4.7.13(2024-12-28)


### What's Changed

- feat(start主题 链接设置默认值与多语言化): 可能的站内链接部分使用Link，而非a，使其能正确多语言跳转 by [@qixing-jk](https://github.com/qixing-jk) in [#3076](https://github.com/tangly1024/NotionNext/pull/3076)

- fix : 修复 Artalk 评论插件在浅色/深色切换时的显示 Bug by [@Daleveral](https://github.com/Daleveral) in [#3080](https://github.com/tangly1024/NotionNext/pull/3080)

- Notion config的配置项可以使用对象数组等复杂结构和HEO主题的站点信息文案支持从Notion配置 by [@qixing-jk](https://github.com/qixing-jk) in [#3077](https://github.com/tangly1024/NotionNext/pull/3077)


### New Contributors

- [@Daleveral](https://github.com/Daleveral) made their first contribution in [#3080](https://github.com/tangly1024/NotionNext/pull/3080)

**Full Changelog**: [v4.7.12...v4.7.13](https://github.com/tangly1024/NotionNext/compare/v4.7.12...v4.7.13)


## V4.7.12(2024-12-21)


### What's Changed

- feat: 优化dockerfile,可使包体积从1.1G缩小至200M by [@owenyang0](https://github.com/owenyang0) in [#3006](https://github.com/tangly1024/NotionNext/pull/3006)

- Fix starter submenu btn css by [@BilikoX](https://github.com/BilikoX) in [#3004](https://github.com/tangly1024/NotionNext/pull/3004)

- Release/4.7.11 by [@tangly1024](https://github.com/tangly1024) in [#3014](https://github.com/tangly1024/NotionNext/pull/3014)

- 部分组件bug修复 by [@tangly1024](https://github.com/tangly1024) in [#3015](https://github.com/tangly1024/NotionNext/pull/3015)

- 修复-路由跳转时页面不可点击 by [@tangly1024](https://github.com/tangly1024) in [#3016](https://github.com/tangly1024/NotionNext/pull/3016)

- 修复分类和标签首页 by [@tangly1024](https://github.com/tangly1024) in [#3033](https://github.com/tangly1024/NotionNext/pull/3033)

- CNPM有点不靠谱 by [@tangly1024](https://github.com/tangly1024) in [#3046](https://github.com/tangly1024/NotionNext/pull/3046)

- Fix wrong call hook by [@qixing-jk](https://github.com/qixing-jk) in [#3040](https://github.com/tangly1024/NotionNext/pull/3040)

- feat(支持同步块格式的目录识别): by [@qixing-jk](https://github.com/qixing-jk) in [#3041](https://github.com/tangly1024/NotionNext/pull/3041)

- feat(支持文章内站内链接多语言跳转并优化性能): by [@qixing-jk](https://github.com/qixing-jk) in [#3073](https://github.com/tangly1024/NotionNext/pull/3073)

- feat(更换short_id实现方式): 避免因为缩短导致的潜在bug by [@qixing-jk](https://github.com/qixing-jk) in [#3072](https://github.com/tangly1024/NotionNext/pull/3072)


### New Contributors

- [@owenyang0](https://github.com/owenyang0) made their first contribution in [#3006](https://github.com/tangly1024/NotionNext/pull/3006)

**Full Changelog**: [v4.7.10...v4.7.12](https://github.com/tangly1024/NotionNext/compare/v4.7.10...v4.7.12)


## V4.7.11(2024-11-23)


### What's Changed

- feat: 优化dockerfile,可使包体积从1.1G缩小至200M by [@owenyang0](https://github.com/owenyang0) in [#3006](https://github.com/tangly1024/NotionNext/pull/3006)

- Fix starter submenu btn css by [@BilikoX](https://github.com/BilikoX) in [#3004](https://github.com/tangly1024/NotionNext/pull/3004)

- 重构动态路由，Release/4.7.11 by [@tangly1024](https://github.com/tangly1024) in [#3013](https://github.com/tangly1024/NotionNext/pull/3013)
  - 旧版本中blog.config.js 的 LAYOUT_MAPPINGS 作废，布局和路由关系在pages/下的相关页面中配置，使用`&lt;DynamicLayout theme=’’ layoutName=’’ /&gt;` 组件 ，示例：
```JavaScript
/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const Index = props =&gt; {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return &lt;DynamicLayout theme={theme} layoutName='**LayoutIndex**' {...props} /&gt;
}
```


### New Contributors

- [@owenyang0](https://github.com/owenyang0) made their first contribution in [#3006](https://github.com/tangly1024/NotionNext/pull/3006)

**Full Changelog**: [v4.7.10...v4.7.11](https://github.com/tangly1024/NotionNext/compare/v4.7.10...v4.7.11)


## V4.7.10(2024-11-20)


### What's Changed

修复一些已知bug

- Fix/emtpy global js by [@tangly1024](https://github.com/tangly1024) in [#2967](https://github.com/tangly1024/NotionNext/pull/2967)

- 4.7.9 by [@tangly1024](https://github.com/tangly1024) in [#2968](https://github.com/tangly1024/NotionNext/pull/2968)

- Gitbook 主题伪静态自动展开异常 by [@tangly1024](https://github.com/tangly1024) in [#2970](https://github.com/tangly1024/NotionNext/pull/2970)

- 配置文件读取规则 by [@tangly1024](https://github.com/tangly1024) in [#2995](https://github.com/tangly1024/NotionNext/pull/2995)

- Feat/minify by [@tangly1024](https://github.com/tangly1024) in [#2996](https://github.com/tangly1024/NotionNext/pull/2996)

- Feat/notion next backend by [@tangly1024](https://github.com/tangly1024) in [#2999](https://github.com/tangly1024/NotionNext/pull/2999)

- Release/4.7.10 by [@tangly1024](https://github.com/tangly1024) in [#3000](https://github.com/tangly1024/NotionNext/pull/3000)


## V4.7.9(2024-11-14)


### What's Changed

- 一些细节优化

- Fix 404 by [@qixing-jk](https://github.com/qixing-jk) in [#2942](https://github.com/tangly1024/NotionNext/pull/2942)

- 修复Nav主题移动端的菜单 by [@tangly1024](https://github.com/tangly1024) in [#2954](https://github.com/tangly1024/NotionNext/pull/2954)

- Feat/starter search by [@tangly1024](https://github.com/tangly1024) in [#2955](https://github.com/tangly1024/NotionNext/pull/2955)

- Heo sticky bug by [@tangly1024](https://github.com/tangly1024) in [#2956](https://github.com/tangly1024/NotionNext/pull/2956)

- Deploy/tencent edge one by [@tangly1024](https://github.com/tangly1024) in [#2957](https://github.com/tangly1024/NotionNext/pull/2957)

- movie-photo主题浅色模式字体颜色 by [@tangly1024](https://github.com/tangly1024) in [#2963](https://github.com/tangly1024/NotionNext/pull/2963)

- Magzine主题，移动端自动收起菜单 by [@tangly1024](https://github.com/tangly1024) in [#2965](https://github.com/tangly1024/NotionNext/pull/2965)

- 编译异常修复，菜单名为空通过编译 by [@tangly1024](https://github.com/tangly1024) in [#2966](https://github.com/tangly1024/NotionNext/pull/2966)


### New Contributors

- [@qixing-jk](https://github.com/qixing-jk) made their first contribution in [#2942](https://github.com/tangly1024/NotionNext/pull/2942)


## V4.7.8(2024-11-13)


### What's Changed

- Starter 页脚最新文章数量支持配置 by [@tangly1024](https://github.com/tangly1024) in [#2936](https://github.com/tangly1024/NotionNext/pull/2936)

- FIX:替换Twikoo默认CDN by [@BilikoX](https://github.com/BilikoX) in [#2928](https://github.com/tangly1024/NotionNext/pull/2928)

- fix: language switching now strictly follows URL path by [@dongzhenye](https://github.com/dongzhenye) in [#2926](https://github.com/tangly1024/NotionNext/pull/2926)

- Fix/url prefix notion config by [@tangly1024](https://github.com/tangly1024) in [#2951](https://github.com/tangly1024/NotionNext/pull/2951)

- refactor: improve version number management by [@dongzhenye](https://github.com/dongzhenye) in [#2943](https://github.com/tangly1024/NotionNext/pull/2943)


### New Contributors

- [@BilikoX](https://github.com/BilikoX) made their first contribution in [#2928](https://github.com/tangly1024/NotionNext/pull/2928)

- [@dongzhenye](https://github.com/dongzhenye) made their first contribution in [#2926](https://github.com/tangly1024/NotionNext/pull/2926)

**Full Changelog**: [v4.7.7...v4.7.8](https://github.com/tangly1024/NotionNext/compare/v4.7.7...v4.7.8)


## v4.7.7（2024-11-04）


### What's Changed

- Feat/theme movie background image by [@tangly1024](https://github.com/tangly1024) in [#2903](https://github.com/tangly1024/NotionNext/pull/2903)

- 部分组件统一;magzine页脚微调 by [@tangly1024](https://github.com/tangly1024) in [#2905](https://github.com/tangly1024/NotionNext/pull/2905)

- Game-主题搜索功能 by [@tangly1024](https://github.com/tangly1024) in [#2907](https://github.com/tangly1024/NotionNext/pull/2907)

- starter 主题 支持加密文章 by [@tangly1024](https://github.com/tangly1024) in [#2908](https://github.com/tangly1024/NotionNext/pull/2908)

- game 主题，页面加上通用的底部列表 by [@tangly1024](https://github.com/tangly1024) in [#2910](https://github.com/tangly1024/NotionNext/pull/2910)

- nobelium主题移动端标题栏 by [@tangly1024](https://github.com/tangly1024) in [#2911](https://github.com/tangly1024/NotionNext/pull/2911)

- Release/4.7.7 by [@tangly1024](https://github.com/tangly1024) in [#2923](https://github.com/tangly1024/NotionNext/pull/2923)

- Feat/theme-photo by [@tangly1024](https://github.com/tangly1024) in [#2921](https://github.com/tangly1024/NotionNext/pull/2921)


## **v4.7.6** （2024-10-30）


### What's Changed

- 4.7.5 by [@tangly1024](https://github.com/tangly1024) in [#2835](https://github.com/tangly1024/NotionNext/pull/2835)

- heo 英雄区 by [@tangly1024](https://github.com/tangly1024) in [#2836](https://github.com/tangly1024/NotionNext/pull/2836)

- starter主题的社交按钮配置 by [@tangly1024](https://github.com/tangly1024) in [#2844](https://github.com/tangly1024/NotionNext/pull/2844)

- Starter 英雄区配图新增横幅图片 by [@tangly1024](https://github.com/tangly1024) in [#2853](https://github.com/tangly1024/NotionNext/pull/2853)

- 修复网页无法用上下按键翻页 by [@tangly1024](https://github.com/tangly1024) in [#2877](https://github.com/tangly1024/NotionNext/pull/2877)

- 支持公安备案号配置 by [@tangly1024](https://github.com/tangly1024) in [#2898](https://github.com/tangly1024/NotionNext/pull/2898)

- redirect 语言bug by [@tangly1024](https://github.com/tangly1024) in [#2900](https://github.com/tangly1024/NotionNext/pull/2900)

**Full Changelog**: [v4.7.5...v4.7.6](https://github.com/tangly1024/NotionNext/compare/v4.7.5...v4.7.6)


## V4.7.5(2024-10-08)


### What's Changed

- 修复错误的标签 by [@tangly1024](https://github.com/tangly1024) in [#2831](https://github.com/tangly1024/NotionNext/pull/2831)

- 分页多语言 by [@tangly1024](https://github.com/tangly1024) in [#2832](https://github.com/tangly1024/NotionNext/pull/2832)

- 修复heo主题文字遮挡 by [@tangly1024](https://github.com/tangly1024) in [#2833](https://github.com/tangly1024/NotionNext/pull/2833)

- 修复菜单自定义名的bug by [@tangly1024](https://github.com/tangly1024) in [#2834](https://github.com/tangly1024/NotionNext/pull/2834)

**Full Changelog**: [v4.7.4...v4.7.5](https://github.com/tangly1024/NotionNext/compare/v4.7.4...v4.7.5)


## V4.7.4(2024-10-02)


### What's Changed

- 一些细微bug

- sign-in factor by [@tangly1024](https://github.com/tangly1024) in [#2769](https://github.com/tangly1024/NotionNext/pull/2769)

- sign-in factor-one by [@tangly1024](https://github.com/tangly1024) in [#2770](https://github.com/tangly1024/NotionNext/pull/2770)

- screen-width by [@tangly1024](https://github.com/tangly1024) in [#2771](https://github.com/tangly1024/NotionNext/pull/2771)

- nobelium主题调整 by [@tangly1024](https://github.com/tangly1024) in [#2772](https://github.com/tangly1024/NotionNext/pull/2772)

**Full Changelog**: [v4.7.3...v4.7.4](https://github.com/tangly1024/NotionNext/compare/v4.7.3...v4.7.4)


## V4.7.3 (2024-09-25)


### What's Changed

- gitbook导航文件夹悬停自动展开 by [@tangly1024](https://github.com/tangly1024) in [#2752](https://github.com/tangly1024/NotionNext/pull/2752)

- gitbook 导航文件夹hover-expand适配移动端 by [@tangly1024](https://github.com/tangly1024) in [#2753](https://github.com/tangly1024/NotionNext/pull/2753)

- Fix/theme starter inline config by [@tangly1024](https://github.com/tangly1024) in [#2756](https://github.com/tangly1024/NotionNext/pull/2756)

- Clerk登录、主题切换组件微调 by [@tangly1024](https://github.com/tangly1024) in [#2764](https://github.com/tangly1024/NotionNext/pull/2764)

**Full Changelog**: [v4.7.2...v4.7.3](https://github.com/tangly1024/NotionNext/compare/v4.7.2...v4.7.3)


## V4.7.2（2024-09-17）


### What's Changed

- Magzine主题，移动端添加目录功能

- 4.70版本 heo主题封面比例、动画更改 by [@laogou717](https://github.com/laogou717) in [#2726](https://github.com/tangly1024/NotionNext/pull/2726)


### New Contributors

- [@laogou717](https://github.com/laogou717) made their first contribution in [#2726](https://github.com/tangly1024/NotionNext/pull/2726)

**Full Changelog**: [v4.7.1...v4.7.2](https://github.com/tangly1024/NotionNext/compare/v4.7.1...v4.7.2)


## V4.7.1 (2024-09-13)


### What's Changed

- openwrite白名单 by [@tangly1024](https://github.com/tangly1024) in [#2702](https://github.com/tangly1024/NotionNext/pull/2702)

- 打包修复 by [@tangly1024](https://github.com/tangly1024) in [#2703](https://github.com/tangly1024/NotionNext/pull/2703)

- 支持配置验证后持续时长 by [@tangly1024](https://github.com/tangly1024) in [#2704](https://github.com/tangly1024/NotionNext/pull/2704)

- 修复openwrite被目录绕过的bug by [@tangly1024](https://github.com/tangly1024) in [#2709](https://github.com/tangly1024/NotionNext/pull/2709)

- build fix by [@tangly1024](https://github.com/tangly1024) in [#2710](https://github.com/tangly1024/NotionNext/pull/2710)

- OpenWrite解锁文章高度调整 by [@tangly1024](https://github.com/tangly1024) in [#2711](https://github.com/tangly1024/NotionNext/pull/2711)

- for build by [@tangly1024](https://github.com/tangly1024) in [#2717](https://github.com/tangly1024/NotionNext/pull/2717)

- workerThreads by [@tangly1024](https://github.com/tangly1024) in [#2718](https://github.com/tangly1024/NotionNext/pull/2718)

- 新主题 [magzine](https://www.notion.so/101f93b9208b8025bc72f0131d58a06e?pvs=25) by [@tangly1024](https://github.com/tangly1024) in [#2733](https://github.com/tangly1024/NotionNext/pull/2733)

**Full Changelog**: [v4.7.0...v4.7.1](https://github.com/tangly1024/NotionNext/compare/v4.7.0...v4.7.1)


## V4.7.0 （2024-09-05）


### What's Changed

- HEO添加加载动画 by [@tangly1024](https://github.com/tangly1024) in [#2683](https://github.com/tangly1024/NotionNext/pull/2683)

- heo 动画微调 by [@tangly1024](https://github.com/tangly1024) in [#2693](https://github.com/tangly1024/NotionNext/pull/2693)

- Update README.md by [@tangly1024](https://github.com/tangly1024) in [#2695](https://github.com/tangly1024/NotionNext/pull/2695)

- gitbook 主题添加loadingcover by [@tangly1024](https://github.com/tangly1024) in [#2699](https://github.com/tangly1024/NotionNext/pull/2699)

- 添加Openwrite公众号验证码+导流，Release/4.7.0 by [@tangly1024](https://github.com/tangly1024) in [#2700](https://github.com/tangly1024/NotionNext/pull/2700)

**Full Changelog**: [v4.6.2...v4.7.0](https://github.com/tangly1024/NotionNext/compare/v4.6.2...v4.7.0)


## V4.6更新 总览

- 底层升级：Next.js 14与Next.js 13相比，引入了多项新特性和改进，这些变化旨在提高性能、开发体验和应用的功能性。

<details>
<summary>更新明细</summary>


## V4.6.2(2024-08-28)

### What's Changed
  - 4.6.1 by [@tangly1024](https://github.com/tangly1024) in [#2541](https://github.com/tangly1024/NotionNext/pull/2541)
  - 主题分页相关调整,fix fukasawa scroll功能 by [@tangly1024](https://github.com/tangly1024) in [#2549](https://github.com/tangly1024/NotionNext/pull/2549)
  - 修复配置了prefix后，部分页面无法打开的bug by [@tangly1024](https://github.com/tangly1024) in [#2550](https://github.com/tangly1024/NotionNext/pull/2550)
  - fix medium lang by [@tangly1024](https://github.com/tangly1024) in [#2607](https://github.com/tangly1024/NotionNext/pull/2607)
  - 🪲 fix: unable to load synced blocks by [@EFLKumo](https://github.com/EFLKumo) in [#2592](https://github.com/tangly1024/NotionNext/pull/2592)
  - 修复：game主题下，向后翻页"Next"按钮不显示 by [@IVSpretender](https://github.com/IVSpretender) in [#2641](https://github.com/tangly1024/NotionNext/pull/2641)
  - 去除对BootCDN资源的调用 by [@wuyuhanzijin-PR](https://github.com/wuyuhanzijin-PR) in [#2635](https://github.com/tangly1024/NotionNext/pull/2635)
  - Fix dom exception problem by [@Phillweston](https://github.com/Phillweston) in [#2417](https://github.com/tangly1024/NotionNext/pull/2417)
  - HEO主题，支持首页博客配置为一列展示。
  - Hexo主题右侧固定

### New Contributors
  - [@EFLKumo](https://github.com/EFLKumo) made their first contribution in [#2592](https://github.com/tangly1024/NotionNext/pull/2592)
  - [@IVSpretender](https://github.com/IVSpretender) made their first contribution in [#2641](https://github.com/tangly1024/NotionNext/pull/2641)
  - [@wuyuhanzijin-PR](https://github.com/wuyuhanzijin-PR) made their first contribution in [#2635](https://github.com/tangly1024/NotionNext/pull/2635)
**Full Changelog**: [v4.6.1...v4.6.2](https://github.com/tangly1024/NotionNext/compare/v4.6.1...v4.6.2)

## V4.6.1(2024-06-27)

### What's Changed
  - Release/4.6.0 by [@tangly1024](https://github.com/tangly1024) in [#2503](https://github.com/tangly1024/NotionNext/pull/2503)
  - fix 伪静态 index url 异常 by [@tangly1024](https://github.com/tangly1024) in [#2504](https://github.com/tangly1024/NotionNext/pull/2504)
  - Do not compress svg image by [@flt6](https://github.com/flt6) in [#2518](https://github.com/tangly1024/NotionNext/pull/2518)
  - 修复外链编译打包问题 by [@tangly1024](https://github.com/tangly1024) in [#2530](https://github.com/tangly1024/NotionNext/pull/2530)
  - 修复第二页url by [@tangly1024](https://github.com/tangly1024) in [#2536](https://github.com/tangly1024/NotionNext/pull/2536)
  - example主题添加目录 by [@tangly1024](https://github.com/tangly1024) in [#2538](https://github.com/tangly1024/NotionNext/pull/2538)
  - 修复樱花特效 by [@tangly1024](https://github.com/tangly1024) in [#2539](https://github.com/tangly1024/NotionNext/pull/2539)
  - Heo主题资料卡牌按钮支持配置 by [@tangly1024](https://github.com/tangly1024) in [#2540](https://github.com/tangly1024/NotionNext/pull/2540)

### New Contributors
  - [@flt6](https://github.com/flt6) made their first contribution in [#2518](https://github.com/tangly1024/NotionNext/pull/2518)
**Full Changelog**: [v4.6.0...v4.6.1](https://github.com/tangly1024/NotionNext/compare/v4.6.0...v4.6.1)

## V4.6.**0（2024-06-17）**

### [What's Changed](https://github.com/tangly1024/NotionNext/releases/tag/v4.6.0)
  - **【重要】**底层升级
Nextjs框架从13.5.1飞升到14.2.4 ;
Nodejs最低版本从16.13.0升级为18.17.0；旧版Nodejs可能存在兼容性问题，请升级至18.17以上的nodejs版本。
  - v4.5.4 by [@tangly1024](https://github.com/tangly1024) in [#2457](https://github.com/tangly1024/NotionNext/pull/2457)
  - 修复静态页面开启时，文章url前缀设为空无法访问的bug by [@tangly1024](https://github.com/tangly1024) in [#2468](https://github.com/tangly1024/NotionNext/pull/2468)
  - hexo 主题page组件样式微调 by [@tangly1024](https://github.com/tangly1024) in [#2470](https://github.com/tangly1024/NotionNext/pull/2470)
  - hexo 微调，添加随机跳转按钮 by [@tangly1024](https://github.com/tangly1024) in [#2474](https://github.com/tangly1024/NotionNext/pull/2474)
  - 默认关闭自动重定向多语言 by [@tangly1024](https://github.com/tangly1024) in [#2475](https://github.com/tangly1024/NotionNext/pull/2475)
  - hexo主题加入几个新的社交按钮 by [@tangly1024](https://github.com/tangly1024) in [#2476](https://github.com/tangly1024/NotionNext/pull/2476)
  - Example主题支持配置：标题栏背景、文章页布局 by [@tangly1024](https://github.com/tangly1024) in [#2498](https://github.com/tangly1024/NotionNext/pull/2498)
**Full Changelog**: [v4.5.4...v4.6.0](https://github.com/tangly1024/NotionNext/compare/v4.5.4...v4.6.0)

</details>


## V4.5更新 总览

- 性能优化，细节优化，更快更高效。

- 配置优化，更多的NOTION_CONFIG支持，逐步将配置移动到NOTION_CONFIG，后续将废弃blog.config.js 和 环境变量。

- 使用体验优化，内链能自动替换为slug**，**SEO使用更加丝滑。

- 修复BUG，已知的bug。

<details>
<summary>更新明细</summary>


## V4.5.5**（2024-06-05）**

### What's Changed
  - 一些优化，fukasawa、gitbook主题、动效、伪静态404bug等 by [@tangly1024](https://github.com/tangly1024) in [#2457](https://github.com/tangly1024/NotionNext/pull/2457)
  - 修复静态页面开启时，文章url前缀设为空无法访问的bug by [@tangly1024](https://github.com/tangly1024) in [#2468](https://github.com/tangly1024/NotionNext/pull/2468)
  - hexo 主题page组件样式微调 by [@tangly1024](https://github.com/tangly1024) in [#2470](https://github.com/tangly1024/NotionNext/pull/2470)
  - hexo 微调，添加随机跳转按钮 by [@tangly1024](https://github.com/tangly1024) in [#2474](https://github.com/tangly1024/NotionNext/pull/2474)
  - 默认关闭自动重定向多语言 by [@tangly1024](https://github.com/tangly1024) in [#2475](https://github.com/tangly1024/NotionNext/pull/2475)
  - hexo主题加入几个新的社交按钮 by [@tangly1024](https://github.com/tangly1024) in [#2476](https://github.com/tangly1024/NotionNext/pull/2476)
支持小红书、微信公众号、知识星球 ，参考教程： ‣

## **v4.5.4 （2024-05-31）**

### What's Changed
  - HEO\PLOG 等主题细节调整、公告栏组件微调
  - 调整“localStorage中用户记录的是否深色模式”的保存时机 by [@Hscpro](https://github.com/Hscpro) in [#2436](https://github.com/tangly1024/NotionNext/pull/2436)
  - 通知组件 by [@tangly1024](https://github.com/tangly1024) in [#2456](https://github.com/tangly1024/NotionNext/pull/2456)
  - 添加页面可以隐藏评论的属性 by [@greyair](https://github.com/greyair) in [#2451](https://github.com/tangly1024/NotionNext/pull/2451)

### New Contributors
  - [@greyair](https://github.com/greyair) made their first contribution in [#2451](https://github.com/tangly1024/NotionNext/pull/2451)

## V4.5.3(2024-05-15)

### What's Changed
  - 优化NotionAPI调用，减少调用次数，加快响应速度、减少资源损耗。Release/4.5.3 by [@tangly1024](https://github.com/tangly1024) in [#2416](https://github.com/tangly1024/NotionNext/pull/2416)
  - 修复部分NOTION_CONFIG读取问题 by [@tangly1024](https://github.com/tangly1024) in [#2414](https://github.com/tangly1024/NotionNext/pull/2414)
  - 关于文章加锁和目录问题 by [@tangly1024](https://github.com/tangly1024) in [#2410](https://github.com/tangly1024/NotionNext/pull/2410)
  - 减小移动端图片加载尺寸，Feat/optimizing image loading for mobile devices by [@tangly1024](https://github.com/tangly1024) in [#2411](https://github.com/tangly1024/NotionNext/pull/2411)
**Full Changelog**: [v4.5.2...v4.5.3](https://github.com/tangly1024/NotionNext/compare/v4.5.2...v4.5.3)

## V4.5.2(2024-05-13)

### What's Changed
  - **Notion内链**自动识别替换成**文章内链** : 原先内链需要复制网站URL，现在直接引用NotionPage，会被自动识别替换站内文章链接 by [@tangly1024](https://github.com/tangly1024) in [#2409](https://github.com/tangly1024/NotionNext/pull/2409)，帮助： ‣
![Untitled](/legacy/86f47b4099af4a4f.png)
  - 文章url前缀`%category%` 支持映射，url里的中文分类名可以映射为自己想要的英文，便于统一url: by [@tangly1024](https://github.com/tangly1024) in [#2409](https://github.com/tangly1024/NotionNext/pull/2409) ;
示例：`xx.com/知行合一/slug` -&gt; `xx.com/learning/slug` 使用说明 ‣
![Untitled](/legacy/10ad882ba3fca4a4.png)
  - 整理NotionPage组件，新增配置 支持禁用database链接 by [@tangly1024](https://github.com/tangly1024) in [#2403](https://github.com/tangly1024/NotionNext/pull/2403)
在Notion_Config中添加以下配置，网页中的database将禁用点击跳转
  - matery 主题已知样式bug修复，导航栏透明色优化 by [@tangly1024](https://github.com/tangly1024) in [#2404](https://github.com/tangly1024/NotionNext/pull/2404)
  - 提炼 静/动态彩带特效、星空雨特效 到public，优化 线段粒子特效和樱花特效 在public中的代码 by [@Vixcity](https://github.com/Vixcity) in [#2405](https://github.com/tangly1024/NotionNext/pull/2405)
  - hotfix: 修复加密文章，解密后目录丢失问题
  - hotfix: 优化密码验证存储功能，加密文章输入过密码后、第二次访问无需重复输入。

## V4.5.1（2024-05-10）

### What's Changed
  - NotionConfig支持`PSEUDO_STATIC`（伪静态） 、`POST_URL_PREFIX`（文章URL前缀）、Feat/notion config by [@tangly1024](https://github.com/tangly1024) in [#2398](https://github.com/tangly1024/NotionNext/pull/2398)
  - sitemap,robots支持读取 NOTION_CONFIG by [@tangly1024](https://github.com/tangly1024) in [#2399](https://github.com/tangly1024/NotionNext/pull/2399)
  - 把nest提炼出来，放到public上面，优化体积，优化鼠标移动粒子特效的代码 by [@Vixcity](https://github.com/Vixcity) in [#2395](https://github.com/tangly1024/NotionNext/pull/2395)
  - v4.5.1 by [@tangly1024](https://github.com/tangly1024) in [#2400](https://github.com/tangly1024/NotionNext/pull/2400)
**Full Changelog**: [v4.5.0...v4.5.1](https://github.com/tangly1024/NotionNext/compare/v4.5.0...v4.5.1)

## V4.5.0 (2024-05-08)

### What's Changed
  - 支持文章用分类名+slug访问博文`%category%/%slug%`，使url语义化，更利于SEO Release/4.5.0 by [@tangly1024](https://github.com/tangly1024) in [#2391](https://github.com/tangly1024/NotionNext/pull/2391) ，使用说明：《[URL风格自定义](/user-guide/config/url-customize)》
  - Commerce 主题调整优化Feat/theme commerce fix by [@tangly1024](https://github.com/tangly1024) in [#2387](https://github.com/tangly1024/NotionNext/pull/2387)
    1. summary无法换行，支持使用&lt;br&gt;换行符实现
    1. summary 图片铺满布局
    1. 字体修改无法生效，可改成Times New Roman：参考此[配置](https://www.notion.so/tanghh/66140f77df6247929c800ac750302ebc?pvs=4)
    1. 主页左侧的默认是`Product Categories` 无法读取配置
    1. 增加公众号的图片和描述
![Untitled](/legacy/ac62445b21c63a6e.png)
  - 站点的favicon支持在notion-config配置，`BLOG_FAVICON` by [@tangly1024](https://github.com/tangly1024) in [#2364](https://github.com/tangly1024/NotionNext/pull/2364)
  - gitbook 新增自动提交密码功能 by [@tangly1024](https://github.com/tangly1024) in [#2389](https://github.com/tangly1024/NotionNext/pull/2389)
  - 樱花雨特效 封装到 public 静态文件中，减小项目核心文件体积和编译速度 by [@Vixcity](https://github.com/Vixcity) in [#2383](https://github.com/tangly1024/NotionNext/pull/2383)
  - SINCE配置的环境变量名修改`NEXT_PUBLIC_SINCE` by [@tangly1024](https://github.com/tangly1024) in [#2346](https://github.com/tangly1024/NotionNext/pull/2346)
  - 修复已知的样式异常 Release/v4.4.6 hotfix by [@tangly1024](https://github.com/tangly1024) in [#2351](https://github.com/tangly1024/NotionNext/pull/2351)
  - 修复丢失的目录 fix: medium theme page refresh causing the catalog loss by [@Femoon](https://github.com/Femoon) in [#2348](https://github.com/tangly1024/NotionNext/pull/2348)
  - 修复部分图片无法加载问题 Feat/next images domains by [@tangly1024](https://github.com/tangly1024) in [#2352](https://github.com/tangly1024/NotionNext/pull/2352)
  - 修复图片异常 img-url hotfix by [@tangly1024](https://github.com/tangly1024) in [#2353](https://github.com/tangly1024/NotionNext/pull/2353)
  - 图片配置 Deploy/preview.tangly1024.com by [@tangly1024](https://github.com/tangly1024) in [#2354](https://github.com/tangly1024/NotionNext/pull/2354)
  - 鼠标跟随动画 by [@tangly1024](https://github.com/tangly1024) in [#2381](https://github.com/tangly1024/NotionNext/pull/2381)
  - 替换 Twikoo 默认 CDN 地址 by [@SukkaW](https://github.com/SukkaW) in [#2369](https://github.com/tangly1024/NotionNext/pull/2369)

### New Contributors
  - [@SukkaW](https://github.com/SukkaW) made their first contribution in [#2369](https://github.com/tangly1024/NotionNext/pull/2369)

</details>


## V4.4总览

- 新主题：movie,《[Movie主题介绍](/user-guide/themes/movie)》

- 新主题：game ， 《[小游戏网站](/user-guide/themes/game)》

- 新主题：commerce； 一个适合企业产品展示的[简易官网](/user-guide/themes/commerce)

- 广告插件增强，支持文章段落随意插入广告 ： [《Google广告营收插件》](/user-guide/plugins/notion-next-google-adsense) ， [相关PR](https://github.com/tangly1024/NotionNext/pull/2192)。

- 全站多语言： 更灵活的多语言，站点菜单、公告、文章都可以按照不同地区访客深度定制化，《[全站多语言](/user-guide/config/notion-next-mulity-languages)》。

- 批量配置：支持在NOTION_CONFIG中，批量导入配置，使用教程：《[INLINE_CONFIG导入配置](/user-guide/config/notion-next-inline-config)》

- 细节优化、Bug修复。

<details>
<summary>更新明细</summary>


## **v4.4.6** (2024-04-28)

### What's Changed
  - 支持每篇文章单独的SEO关键词，读取文章的标签字段。
  - hotfix 修复评论问题comment by [@tangly1024](https://github.com/tangly1024) in [#2334](https://github.com/tangly1024/NotionNext/pull/2334)
  - matery 主题首页按钮毛玻璃 by [@tangly1024](https://github.com/tangly1024) in [#2335](https://github.com/tangly1024/NotionNext/pull/2335)
  - gitbook折叠菜单微调 by [@tangly1024](https://github.com/tangly1024) in [#2336](https://github.com/tangly1024/NotionNext/pull/2336)
  - twikoo 不预先加载 by [@tangly1024](https://github.com/tangly1024) in [#2343](https://github.com/tangly1024/NotionNext/pull/2343)
  - matery主题、example主题调整规范 hotfix by [@tangly1024](https://github.com/tangly1024) in [#2344](https://github.com/tangly1024/NotionNext/pull/2344)
  - V4.4.6 by [@tangly1024](https://github.com/tangly1024) in [#2345](https://github.com/tangly1024/NotionNext/pull/2345)
**Full Changelog**: [v4.4.5...v4.4.6](https://github.com/tangly1024/NotionNext/compare/v4.4.5...v4.4.6)

## **v4.4.5(2024-04-25)**

### What's Changed
  - matery主题微调 by [@tangly1024](https://github.com/tangly1024) in [#2325](https://github.com/tangly1024/NotionNext/pull/2325)
  - Gitbook主题：导航文章排他自动折叠 by [@tangly1024](https://github.com/tangly1024) in [#2331](https://github.com/tangly1024/NotionNext/pull/2331)
  - 目录样式：fix: Sidebar width changes and catalog styles by [@Femoon](https://github.com/Femoon) in [#2329](https://github.com/tangly1024/NotionNext/pull/2329)
  - 性能优化：评论插件异步加载 by [@tangly1024](https://github.com/tangly1024) in [#2332](https://github.com/tangly1024/NotionNext/pull/2332)
  - v4.4.5 by [@tangly1024](https://github.com/tangly1024) in [#2333](https://github.com/tangly1024/NotionNext/pull/2333)
**Full Changelog**: [v4.4.4...v4.4.5](https://github.com/tangly1024/NotionNext/compare/v4.4.4...v4.4.5)

## **v4.4.4** (2024-04-23)

### What's Changed
  - 新特性：NOTION_CONFIG支持配置FONT_URL by [@tangly1024](https://github.com/tangly1024) in [#2318](https://github.com/tangly1024/NotionNext/pull/2318)，参考《[字体字号使用说明](/user-guide/config/notion-next-web-font)》
  - 新特性，支持配置关闭文章标题中的icon：feat: add title icon configuration by [@Femoon](https://github.com/Femoon) in [#2310](https://github.com/tangly1024/NotionNext/pull/2310)
  - 修复bug：视频尺寸video-size by [@tangly1024](https://github.com/tangly1024) in [#2294](https://github.com/tangly1024/NotionNext/pull/2294)
  - 修复：fix: medium theme catalog miss by [@Femoon](https://github.com/Femoon) in [#2314](https://github.com/tangly1024/NotionNext/pull/2314)
  - 修复：heo顶部链接无法用notion-config配置的bug by [@tangly1024](https://github.com/tangly1024) in [#2316](https://github.com/tangly1024/NotionNext/pull/2316)
  - v4.4.4 by [@tangly1024](https://github.com/tangly1024) in [#2319](https://github.com/tangly1024/NotionNext/pull/2319)
**Full Changelog**: [v4.4.3...v4.4.4](https://github.com/tangly1024/NotionNext/compare/v4.4.3...v4.4.4)

## V4.4.3 (2024-04-12)

### What's Changed
  - 全站多语言支持，包括菜单和文章内容。具体使用参阅文档：
[/user-guide/config/notion-next-mulity-languages](/user-guide/config/notion-next-mulity-languages)
  - NotionConfig增强，支持`INLINE_CONFIG` ， 用json的格式批量导入配置。具体使用参阅文档：
[/user-guide/config/notion-next-inline-config](/user-guide/config/notion-next-inline-config)
  - 精减部分非必要的package.json依赖，`typed.js`、`npgrogress`、`mongodb`、`animejs`、`aos`等等。
  - 渐进式应用 PWA, 并支持game主题 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/2249](https://github.com/tangly1024/NotionNext/pull/2249)
by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/2251](https://github.com/tangly1024/NotionNext/pull/2251)
  - fix global head title by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/2219](https://github.com/tangly1024/NotionNext/pull/2219)
  - fix fukasawa card link by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/2220](https://github.com/tangly1024/NotionNext/pull/2220)
  - Feat/theme game pwa by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/2250](https://github.com/tangly1024/NotionNext/pull/2250)
  - Add MetingJS 自定义接口参数 by @yuzzzuy in [https://github.com/tangly1024/NotionNext/pull/2254](https://github.com/tangly1024/NotionNext/pull/2254)
  - theme-game 主题样式；背景微调 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/2255](https://github.com/tangly1024/NotionNext/pull/2255)
  - Feat/decoration of theme game by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/2256](https://github.com/tangly1024/NotionNext/pull/2256)
  - 修复 Live2D宠物读取配置失败的问题 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/2273](https://github.com/tangly1024/NotionNext/pull/2273)
  - Release/4.4.3 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/2280](https://github.com/tangly1024/NotionNext/pull/2280)

## v4.4.2(2024-03-24)

### What's Changed
  - 新主题 commerce Feat/theme commerce by [@tangly1024](https://github.com/tangly1024) in [#2216](https://github.com/tangly1024/NotionNext/pull/2216)
**Full Changelog**: [v4.4.1...v4.4.2](https://github.com/tangly1024/NotionNext/compare/v4.4.1...v4.4.2)

## v4.4.1(2024-03-24)

### What's Changed
  - 新主题 theme-game fix category style by [@tangly1024](https://github.com/tangly1024) in [#2215](https://github.com/tangly1024/NotionNext/pull/2215)
  - Feat/ad embed by [@tangly1024](https://github.com/tangly1024) in [#2192](https://github.com/tangly1024/NotionNext/pull/2192)
  - 修复站点标题闪烁的问题 by [@tangly1024](https://github.com/tangly1024) in [#2206](https://github.com/tangly1024/NotionNext/pull/2206)
  - theme-movie 加入部分检测 by [@tangly1024](https://github.com/tangly1024) in [#2211](https://github.com/tangly1024/NotionNext/pull/2211)
  - Feat/theme game by [@tangly1024](https://github.com/tangly1024) in [#2214](https://github.com/tangly1024/NotionNext/pull/2214)
**Full Changelog**: [v4.4.0...v4.4.1](https://github.com/tangly1024/NotionNext/compare/v4.4.0...v4.4.1)

## **v4.4.0**  (2024-03-17)

### What's Changed
  - frame-work lib/db by [@tangly1024](https://github.com/tangly1024) in [#2163](https://github.com/tangly1024/NotionNext/pull/2163)
  - theme-simple by [@tangly1024](https://github.com/tangly1024) in [#2167](https://github.com/tangly1024/NotionNext/pull/2167)
  - simple 主题微调 by [@tangly1024](https://github.com/tangly1024) in [#2170](https://github.com/tangly1024/NotionNext/pull/2170)
  - gitbook最新未读机制优化 by [@tangly1024](https://github.com/tangly1024) in [#2181](https://github.com/tangly1024/NotionNext/pull/2181)
  - 新主题：Feat/theme movie by [@tangly1024](https://github.com/tangly1024) in [#2183](https://github.com/tangly1024/NotionNext/pull/2183)
  - 增加全局搜索快键键操作提示 by [@lxw15337674](https://github.com/lxw15337674) in [#2177](https://github.com/tangly1024/NotionNext/pull/2177)
  - 修复夜间模式折叠按钮看不到，折叠按钮适配右边栏 by [@lxw15337674](https://github.com/lxw15337674) in [#2176](https://github.com/tangly1024/NotionNext/pull/2176)
  - 目录会填满侧边栏 by [@lxw15337674](https://github.com/lxw15337674) in [#2175](https://github.com/tangly1024/NotionNext/pull/2175)
**Full Changelog**: [v4.3.2...v4.4.0](https://github.com/tangly1024/NotionNext/compare/v4.3.2...v4.4.0)

</details>


## V4.3 特性概要

<details>
<summary>新主题 Starter</summary>

![Untitled](/legacy/e2385a397e692ebe.png)
为公司、创业者、独立开发者、开源技术社区设计。
原先Landing落地页主题的升级版，一站式解决您的 品牌展示，博客新闻、产品服务宣传、团队展示、资讯订阅、用户评价、FAQ、价格展示及收费、留言反馈、会员注册登录、隐私政策、服务协议、法律声明。
您可以在这个网站上介绍您的产品、并直接挂上付款链接；产品可以是线上课程、一款APP、一个游戏等等。
然后，这个主题是免费的。

</details>

<details>
<summary>新增注册、登录两个页面路由；具体业务暂未实现</summary>

目前仅starter主题 完善了这两个页面的UI，其它主题暂未实现。
![Untitled](/legacy/b72340ab3a1e5e3d.png)

</details>

<details>
<summary>字体配置优化可在Notion_Config中配置</summary>

![Untitled](/legacy/da6444192925d749.png)

</details>

<details>
<summary>更新明细</summary>


## **[v4.3.2](https://github.com/tangly1024/NotionNext/releases/tag/v4.3.2)**** (20240310)**

### What's Changed
  - 全局搜索弹窗夜间模式样式优化、移动端自适应。 by [@lxw15337674](https://github.com/lxw15337674) in [#2141](https://github.com/tangly1024/NotionNext/pull/2141)
  - Feat/theme simple gitbook by [@tangly1024](https://github.com/tangly1024) in [#2145](https://github.com/tangly1024/NotionNext/pull/2145)
  - nobelium主题支持列表预览 by [@tangly1024](https://github.com/tangly1024) in [#2153](https://github.com/tangly1024/NotionNext/pull/2153)
  - feat: Create sync.yaml, Add auto sync by [@labulac](https://github.com/labulac) in [#2152](https://github.com/tangly1024/NotionNext/pull/2152)
  - 升级codeQL版本，避免报错 by [@lxw15337674](https://github.com/lxw15337674) in [#2147](https://github.com/tangly1024/NotionNext/pull/2147)
  - feat: support whether to distinguish tags by color by [@KazooTTT](https://github.com/KazooTTT) in [#2148](https://github.com/tangly1024/NotionNext/pull/2148)
  - Feat/frame work 框架目录调整 by [@tangly1024](https://github.com/tangly1024) in [#2162](https://github.com/tangly1024/NotionNext/pull/2162)

### New Contributors
  - [@labulac](https://github.com/labulac) made their first contribution in [#2152](https://github.com/tangly1024/NotionNext/pull/2152)
**Full Changelog**: [v4.3.1...v4.3.2](https://github.com/tangly1024/NotionNext/compare/v4.3.1...v4.3.2)

## [V4.3.1 ](https://github.com/tangly1024/NotionNext/releases/tag/v4.3.1)（20240304）

### What's Changed
  - Starter 主题新增开关，可以控制首页模块显示，更新时备份您的配置 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1947](https://github.com/tangly1024/NotionNext/pull/1947)
  - theme heo wowjs by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1912](https://github.com/tangly1024/NotionNext/pull/1912)
  - redirect by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1914](https://github.com/tangly1024/NotionNext/pull/1914)
  - Fix/little change by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1917](https://github.com/tangly1024/NotionNext/pull/1917)
  - 异步加载AlgoliaModal by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1931](https://github.com/tangly1024/NotionNext/pull/1931)
  - Github Action添加arm64的Docker镜像 by @EmccK in [https://github.com/tangly1024/NotionNext/pull/1944](https://github.com/tangly1024/NotionNext/pull/1944)
  - 为Safari添加拖拽框的简略修复 by @YiGuan-z in [https://github.com/tangly1024/NotionNext/pull/1940](https://github.com/tangly1024/NotionNext/pull/1940)
  - fukasawa 适配algolia by @lxw15337674 in [https://github.com/tangly1024/NotionNext/pull/1932](https://github.com/tangly1024/NotionNext/pull/1932)
  - 全局搜索弹窗代码优化 by @lxw15337674 in [https://github.com/tangly1024/NotionNext/pull/1933](https://github.com/tangly1024/NotionNext/pull/1933)

### New Contributors
  - @EmccK made their first contribution in [https://github.com/tangly1024/NotionNext/pull/1944](https://github.com/tangly1024/NotionNext/pull/1944)
  - @YiGuan-z made their first contribution in [https://github.com/tangly1024/NotionNext/pull/1940](https://github.com/tangly1024/NotionNext/pull/1940)
  - @lxw15337674 made their first contribution in [https://github.com/tangly1024/NotionNext/pull/1932](https://github.com/tangly1024/NotionNext/pull/1932)
**Full Changelog**: [https://github.com/tangly1024/NotionNext/compare/v4.3.0...v4.3.1](https://github.com/tangly1024/NotionNext/compare/v4.3.0...v4.3.1)

## [v4.3.0](https://github.com/tangly1024/NotionNext/tree/v4.3.0) （20240223）

### What's Changed
  - Feat/post title icon by [@tangly1024](https://github.com/tangly1024) in [#1877](https://github.com/tangly1024/NotionNext/pull/1877)
  - Feat/landing theme pricing by [@tangly1024](https://github.com/tangly1024) in [#1879](https://github.com/tangly1024/NotionNext/pull/1879)
  - fix collection by [@tangly1024](https://github.com/tangly1024) in [#1885](https://github.com/tangly1024/NotionNext/pull/1885)
  - 字体设置中设置GoogleFonts可能失效，因为现在返回css而非woff，再加一个判断 by [@Li-Major](https://github.com/Li-Major) in [#1884](https://github.com/tangly1024/NotionNext/pull/1884)
  - gitbook 适配algolia by [@tangly1024](https://github.com/tangly1024) in [#1903](https://github.com/tangly1024/NotionNext/pull/1903)
  - 支持在NotionConfig中配置基础字体 by [@tangly1024](https://github.com/tangly1024) in [#1906](https://github.com/tangly1024/NotionNext/pull/1906)
  - Starter 主题 by [@tangly1024](https://github.com/tangly1024) in [#1910](https://github.com/tangly1024/NotionNext/pull/1910)

### New Contributors
  - [@Li-Major](https://github.com/Li-Major) made their first contribution in [#1884](https://github.com/tangly1024/NotionNext/pull/1884)
**Full Changelog**: [v4.2.4...v4.3.0](https://github.com/tangly1024/NotionNext/compare/v4.2.4...v4.3.0)

</details>


## V4.2 主要特性

- 优化主题切换速度

- 优化图片加载速度

- 加快打包编译速度

- 修复已知bug

- 支持在notiobn中自定义css和js

- 新增[Charity](/user-guide/analytics/clarity)统计插件支持，更好用的免费站点统计

<details>
<summary>更新明细</summary>


## V4.2.4(2024-02-04)

### What's Changed
  - 修复已知bug
  - Nav 主题菜单失效 by [@tangly1024](https://github.com/tangly1024) in [#1870](https://github.com/tangly1024/NotionNext/pull/1870)
  - feat: highlight the selected tag by [@KazooTTT](https://github.com/KazooTTT) in [#1872](https://github.com/tangly1024/NotionNext/pull/1872)
**Full Changelog**: [v4.2.3...v4.2.4](https://github.com/tangly1024/NotionNext/compare/v4.2.3...v4.2.4)

## **v4.2.3** (2024-02-02)

### What's Changed
  - 4.2已知bug的修修补补
  - Hexo主题微调 by [@tangly1024](https://github.com/tangly1024) in [#1854](https://github.com/tangly1024/NotionNext/pull/1854)
  - Fix/nav post card http by [@tangly1024](https://github.com/tangly1024) in [#1855](https://github.com/tangly1024/NotionNext/pull/1855)
  - Feat/some-little-improvement by [@tangly1024](https://github.com/tangly1024) in [#1857](https://github.com/tangly1024/NotionNext/pull/1857)
  - Fix/site title by [@tangly1024](https://github.com/tangly1024) in [#1863](https://github.com/tangly1024/NotionNext/pull/1863)
  - Fix/some bug founded by [@tangly1024](https://github.com/tangly1024) in [#1865](https://github.com/tangly1024/NotionNext/pull/1865)
**Full Changelog**: [v4.2.2...v4.2.3](https://github.com/tangly1024/NotionNext/compare/v4.2.2...v4.2.3)

## v4.2.2(2024-01-31)

### What's Changed
  - 博客封面封面Fix/heo cover post by [@tangly1024](https://github.com/tangly1024) in [#1834](https://github.com/tangly1024/NotionNext/pull/1834)
  - heo主题 404页面 by [@tangly1024](https://github.com/tangly1024) in [#1835](https://github.com/tangly1024/NotionNext/pull/1835)
  - Next主题支持algolia全文搜索 by [@tangly1024](https://github.com/tangly1024) in [#1836](https://github.com/tangly1024/NotionNext/pull/1836)
  - plog 模态框隐藏 by [@tangly1024](https://github.com/tangly1024) in [#1840](https://github.com/tangly1024/NotionNext/pull/1840)
  - 自定义菜单右键加入复制功能 by [@tangly1024](https://github.com/tangly1024) in [#1841](https://github.com/tangly1024/NotionNext/pull/1841)
  - 4.2.1编译问题fix build by [@tangly1024](https://github.com/tangly1024) in [#1843](https://github.com/tangly1024/NotionNext/pull/1843)
  - 4.2.1编译问题fix-build by [@tangly1024](https://github.com/tangly1024) in [#1845](https://github.com/tangly1024/NotionNext/pull/1845)
  - Release/4.2.2 by [@tangly1024](https://github.com/tangly1024) in [#1846](https://github.com/tangly1024/NotionNext/pull/1846)
**Full Changelog**: [v4.2.1...v4.2.2](https://github.com/tangly1024/NotionNext/compare/v4.2.1...v4.2.2)

## v4.2.1 (2024-01-30)

### What's Changed
修复bug, 增加优化。
  - 修复书签预览图无法展示的问题 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1799](https://github.com/tangly1024/NotionNext/pull/1799)
  - 支持隐藏单独的评论标签页 by @1208nn in [https://github.com/tangly1024/NotionNext/pull/1787](https://github.com/tangly1024/NotionNext/pull/1787)
  - Tabs组件导致的页面出现隐藏的可点击对象 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1811](https://github.com/tangly1024/NotionNext/pull/1811)
  - hexo主题支持Algolia全文搜索 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1812](https://github.com/tangly1024/NotionNext/pull/1812)
  - 支持微软clarity by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1831](https://github.com/tangly1024/NotionNext/pull/1831)
    - 支持[微软Charity](https://clarity.microsoft.com/)网站分析工具
可以深入洞察分析用户行为，甚至实时看到用户的访问视频，有助于站点进一步优化
![Untitled](/legacy/36a676938a221aae.png)
  - Fix：twioo初始化问题 by @velor2012 in [https://github.com/tangly1024/NotionNext/pull/1827](https://github.com/tangly1024/NotionNext/pull/1827)
  - Fix：修复在线切换主题时，页面多次渲染问题 by @velor2012 in [https://github.com/tangly1024/NotionNext/pull/1826](https://github.com/tangly1024/NotionNext/pull/1826)
  - Fix：callout 图片溢出 by @RylanBot in [https://github.com/tangly1024/NotionNext/pull/1821](https://github.com/tangly1024/NotionNext/pull/1821)
  - fix bug: 自定义数据库type字段属性后无法正确生成未显式定义slug的文章的路径 by @siuze in [https://github.com/tangly1024/NotionNext/pull/1817](https://github.com/tangly1024/NotionNext/pull/1817)
  - 修复nav主题下category和tag下文章链接不对的bug by @ayonliu in [https://github.com/tangly1024/NotionNext/pull/1804](https://github.com/tangly1024/NotionNext/pull/1804)
  - 修复部分文章无法加载的问题 by @Olimiya in [https://github.com/tangly1024/NotionNext/pull/1723](https://github.com/tangly1024/NotionNext/pull/1723)
  - Fix Add NAV Theme card Add Default Image by @emengweb in [https://github.com/tangly1024/NotionNext/pull/1575](https://github.com/tangly1024/NotionNext/pull/1575)

### New Contributors
  - @velor2012 made their first contribution in [https://github.com/tangly1024/NotionNext/pull/1827](https://github.com/tangly1024/NotionNext/pull/1827)
  - @siuze made their first contribution in [https://github.com/tangly1024/NotionNext/pull/1817](https://github.com/tangly1024/NotionNext/pull/1817)
  - @ayonliu made their first contribution in [https://github.com/tangly1024/NotionNext/pull/1804](https://github.com/tangly1024/NotionNext/pull/1804)
  - @Olimiya made their first contribution in [https://github.com/tangly1024/NotionNext/pull/1723](https://github.com/tangly1024/NotionNext/pull/1723)
**Full Changelog**: [https://github.com/tangly1024/NotionNext/compare/v4.2.0...v4.2.1](https://github.com/tangly1024/NotionNext/compare/v4.2.0...v4.2.1)

## **v4.2.0(2024-01-21)**
  - 支持在Notion中直接写CSS样式和JS
![Untitled](/legacy/a2595a9dcdbad3c0.png)
::: tip 提示
以前改动样式、主题的流程太麻烦，门槛也很高，还要改动Github代码提交，太麻烦了，不如简单点，全部放在笔记里。
未来希望所有的代码都支持在Notion中编辑，包括主题，插件。
  - 文章图片压缩处理，加快打开速度
:::

</details>


## 4.1 主要特性

1. 开发相关
新增siteConfig函数，可直接从Notion中读取配置，并且支持传入默认值

```JavaScript
/**
 * 读取配置顺序
 * 1. 优先读取NotionConfig表
 * 2. 其次读取环境变量
 * 3. 再读取blog.config.js / 或各个主题的CONFIG文件
 * @param {*} key ； 参数名
 * @param {*} extendConfig ; 参考配置对象{key:val}，如果notion中找不到优先尝试在这里面查找
 * @param {*} defaultVal ; 参数不存在默认返回值
 * @returns
 */
export const siteConfig = (key, defaultVal = null, extendConfig) =&gt; {
}
```

1. 使用相关
绝大部分配置支持在Notion中设置，减少对blog.config.js和vercel环境变量的配置

![Untitled](/legacy/4b36ee3a8532cf6f.png)
::: tip 提示
如何使用config文档，请参考 《[站点配置-配置入门](/user-guide/config-site)》
:::

<details>
<summary>更新详情</summary>


## **v4.1.5(2024-01-17)**

### What's Changed
  - 修复刷新页面时的语言切换 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1761](https://github.com/tangly1024/NotionNext/pull/1761)
  - Simple主题支持Algolia搜索 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1762](https://github.com/tangly1024/NotionNext/pull/1762)
  - 自定义右键菜单更新 by @1208nn in [https://github.com/tangly1024/NotionNext/pull/1771](https://github.com/tangly1024/NotionNext/pull/1771)
  - Correct Spelling by @Phillweston in [https://github.com/tangly1024/NotionNext/pull/1773](https://github.com/tangly1024/NotionNext/pull/1773)
  - fix: 评论区插件补丁+优化 by @RylanBot in [https://github.com/tangly1024/NotionNext/pull/1768](https://github.com/tangly1024/NotionNext/pull/1768)
  - 新增Dify对话机器人支持，新增默认docker-compose.yml by @sebastian0619 in [https://github.com/tangly1024/NotionNext/pull/1657](https://github.com/tangly1024/NotionNext/pull/1657)

### New Contributors
  - @Phillweston made their first contribution in [https://github.com/tangly1024/NotionNext/pull/1773](https://github.com/tangly1024/NotionNext/pull/1773)
  - @RylanBot made their first contribution in [https://github.com/tangly1024/NotionNext/pull/1768](https://github.com/tangly1024/NotionNext/pull/1768)
  - @sebastian0619 made their first contribution in [https://github.com/tangly1024/NotionNext/pull/1657](https://github.com/tangly1024/NotionNext/pull/1657)
**Full Changelog**: [https://github.com/tangly1024/NotionNext/compare/v4.1.4...v4.1.5](https://github.com/tangly1024/NotionNext/compare/v4.1.4...v4.1.5)

## **v4.1.4(2024-01-09)**

### What's Changed
  - 支持在Notion中开启全屏布局；Feat/fullwidth support by [@tangly1024](https://github.com/tangly1024) in [#1737](https://github.com/tangly1024/NotionNext/pull/1737)
  - 支持嵌入的音频视频在网页中播放； Fix/media video play by [@tangly1024](https://github.com/tangly1024) in [#1760](https://github.com/tangly1024/NotionNext/pull/1760)
**Full Changelog**: [v4.1.3...v4.1.4](https://github.com/tangly1024/NotionNext/compare/v4.1.3...v4.1.4)

## **v4.1.3(2023-12-27)**

### What's Changed
  - 支持全宽布局，可以指定Notion中的任意文章为宽屏显示，隐藏掉一些布局，只保留菜单栏。
开启右上角的FullWidth即可。(每个主题的效果不尽相同)
![Untitled](/legacy/d02a080e434a44f4.png)
  - Fukasawa支持配置MailChimp表单
/themes/fukasaw/config.js → 开启FUKASAWA_MAILCHIMP_FORM
⚠️ [需要配置MailChimp](/user-guide/plugins/mailchimp)
![Untitled](/legacy/8bcbd76b55b08092.png)
  - Fix/little bug for Next Fukasawa by [@tangly1024](https://github.com/tangly1024) in [#1730](https://github.com/tangly1024/NotionNext/pull/1730)
修复搜索的问题
Fukasawa、Next主题多语言的问题
  - Update lib/notion/getNotionConfig.js by [@1208nn](https://github.com/1208nn) in [#1700](https://github.com/tangly1024/NotionNext/pull/1700)
    - 允许配置文章NotionConfig 的类型为 Config 或者 CONFIG
    - 允许配置表名为 'Config-Table' 或 'CONFIG-TABLE'
    - 允许表头名为 'Enable' , 'Name', 'Value'。
**Full Changelog**: [v4.1.2...v4.1.3](https://github.com/tangly1024/NotionNext/compare/v4.1.2...v4.1.3)

## V4.1.2(2023-12-10)

### What's Changed
  - NotionConfig已知bug的修复 Fix/notion config by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1646](https://github.com/tangly1024/NotionNext/pull/1646)
  - 图片字体问题修复 some small fix about img font by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1649](https://github.com/tangly1024/NotionNext/pull/1649)
  - 4.1.1RSSbug修复 fix-notion-page-rss by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1697](https://github.com/tangly1024/NotionNext/pull/1697)
  - Update [README.md](http://readme.md/) by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1698](https://github.com/tangly1024/NotionNext/pull/1698)
  - 新增[51LA](https://www.51.la/)i站点统计支持 feat-51la-analytics by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1701](https://github.com/tangly1024/NotionNext/pull/1701)
    - 51LA统计 by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1702](https://github.com/tangly1024/NotionNext/pull/1702)
    - 51LA by @tangly1024 in [https://github.com/tangly1024/NotionNext/pull/1704](https://github.com/tangly1024/NotionNext/pull/1704)
**Full Changelog**: [https://github.com/tangly1024/NotionNext/compare/v4.1.1...v4.1.2](https://github.com/tangly1024/NotionNext/compare/v4.1.1...v4.1.2)

## V4.1.1 (2023-11-20)

### What's Changed
  - fix 修复heo主题从NotionConfig读取失败Bug by [@Heathcliff-third-space](https://github.com/Heathcliff-third-space) in [#1636](https://github.com/tangly1024/NotionNext/pull/1636)
  - [feat] 支持随机图片 url 统一配置 by [@jiashu1024](https://github.com/jiashu1024) in [#1622](https://github.com/tangly1024/NotionNext/pull/1622)
  - 预先添加便捷的环境变量feat: update .env.local based on blog.config.js by [@KazooTTT](https://github.com/KazooTTT) in [#1633](https://github.com/tangly1024/NotionNext/pull/1633)
  - bug关于搜索插件Fix algolia by [@KazooTTT](https://github.com/KazooTTT) in [#1632](https://github.com/tangly1024/NotionNext/pull/1632)
  - 微小优化调整 Just some small edit by [@1208nn](https://github.com/1208nn) in [#1626](https://github.com/tangly1024/NotionNext/pull/1626)

### New Contributors
  - [@Heathcliff-third-space](https://github.com/Heathcliff-third-space) made their first contribution in [#1636](https://github.com/tangly1024/NotionNext/pull/1636)
  - [@jiashu1024](https://github.com/jiashu1024) made their first contribution in [#1622](https://github.com/tangly1024/NotionNext/pull/1622)
  - [@KazooTTT](https://github.com/KazooTTT) made their first contribution in [#1633](https://github.com/tangly1024/NotionNext/pull/1633)
  - [@1208nn](https://github.com/1208nn) made their first contribution in [#1626](https://github.com/tangly1024/NotionNext/pull/1626)
**Full Changelog**: [v4.1.0...v4.1.1](https://github.com/tangly1024/NotionNext/compare/v4.1.0...v4.1.1)

## **v4.1.0**
  1. 配置支持读取Notion中的Config文档；省去修改代码和修改环境变量的麻烦。
  1. 网页上的切换主题按钮，样式微调。

</details>


## 4.0 主要特性

<details>
<summary>开发相关</summary>

新增Transition组件，优化过度动画
新增[Heroicon](https://heroicons.com/) 支持，轻量美观的图标
简化主题目录 /themes ，简化二次开发。

参考此文：[《创建您的主题》零基础小白，也能开发主题。](/user-guide/development/own-theme)

</details>

<details>
<summary>使用相关</summary>

新增Landing主题，适用于企业、产品展示
新增Plog主题，适用于照片博客
新增Nav主题，适用于导航站点
新增HEO主题，苹果风格，果冻主题
新增折叠代码框，减少文章版面占用
新增全局右键菜单
新增Netlify部署支持
支持模板添加多视图
ChatBase ai搜索
优化图片性能
新增全文搜索插件Algolia
修复Notion升级后导致的图片文字展示异常
修复其它已知bug

</details>

<details>
<summary>更新详情</summary>


## **v4.0.18**

### What's Changed
  - [Feat] 折叠代码块默认展开状态 by [@tangly1024](https://github.com/tangly1024) in [#1607](https://github.com/tangly1024/NotionNext/pull/1607)
  - [fix] 文章不存在封面的时候，不使用默认站点封面，导致不显示封面的问题 by [@expoli](https://github.com/expoli) in [#1600](https://github.com/tangly1024/NotionNext/pull/1600)
  - 博客封面随机图片支持 by [@tangly1024](https://github.com/tangly1024) in [#1608](https://github.com/tangly1024/NotionNext/pull/1608)
**Full Changelog**: [v4.0.17...v4.0.18](https://github.com/tangly1024/NotionNext/compare/v4.0.17...v4.0.18)

## **v4.0.17**

### What's Changed
  - Fix: 修复Notion上传视频无法播放
  - Fix: 修复 Medium 主题首页文章列表无封面图片时动画异常 by [@Femoon](https://github.com/Femoon) in [#1579](https://github.com/tangly1024/NotionNext/pull/1579)
  - Fix: 多级slug-bug by [@tangly1024](https://github.com/tangly1024) in [#1599](https://github.com/tangly1024/NotionNext/pull/1599)

### New Contributors
  - [@Femoon](https://github.com/Femoon) made their first contribution in [#1579](https://github.com/tangly1024/NotionNext/pull/1579)
**Full Changelog**: [v4.0.16...v4.0.17](https://github.com/tangly1024/NotionNext/compare/v4.0.16...v4.0.17)

## V4.0.16(20231018)

### What's Changed
  - 新主题 NAV - add theme nav & add pageIcon support of @lib/getNotionData by [@emengweb](https://github.com/emengweb) in [#1563](https://github.com/tangly1024/NotionNext/pull/1563)
  - style(heo): 修复在较小屏幕尺寸时，文章宽度样式问题 by [@real-jacket](https://github.com/real-jacket) in [#1513](https://github.com/tangly1024/NotionNext/pull/1513)
  - HEO 404页面深色模式 by [@tangly1024](https://github.com/tangly1024) in [#1572](https://github.com/tangly1024/NotionNext/pull/1572)
**Full Changelog**: [v4.0.15...v4.0.16](https://github.com/tangly1024/NotionNext/compare/v4.0.15...v4.0.16)

## V4.0.15(20230907)

### What's Changed
  - 修复bug，nobelium 主页日期错误 by [@tangly1024](https://github.com/tangly1024) in [#1493](https://github.com/tangly1024/NotionNext/pull/1493)
  - [fix] 修复pushUrl未配置相关Secrets报错邮件 by [@Ghlerrix](https://github.com/Ghlerrix) in [#1495](https://github.com/tangly1024/NotionNext/pull/1495)
  - 样式调整: fix heo style by [@real-jacket](https://github.com/real-jacket) in [#1499](https://github.com/tangly1024/NotionNext/pull/1499)
  - 修复最新文章发布排序 by [@tangly1024](https://github.com/tangly1024) in [#1510](https://github.com/tangly1024/NotionNext/pull/1510)
  - 修复页面中的文件附件无法下载的BUG [@tangly1024](https://github.com/tangly1024) in [#1511](https://github.com/tangly1024/NotionNext/pull/1511)
  - 已知遗留bug，页面的嵌入PDF文件无法在线预览

### New Contributors
  - [@real-jacket](https://github.com/real-jacket) made their first contribution in [#1499](https://github.com/tangly1024/NotionNext/pull/1499)
**Full Changelog**: [v4.0.14...v4.0.15](https://github.com/tangly1024/NotionNext/compare/v4.0.14...v4.0.15)

## V4.0.14(20230902)

### What's Changed
  - 修复因notion升级导致的图片无法显示的问题
  - fix nobelium主题搜索框丢失 by [@tangly1024](https://github.com/tangly1024) in [#1459](https://github.com/tangly1024/NotionNext/pull/1459)
  - Feat/wwads by [@tangly1024](https://github.com/tangly1024) in [#1465](https://github.com/tangly1024/NotionNext/pull/1465)
  - 优化百度推送和新增必应推送 by [@Ghlerrix](https://github.com/Ghlerrix) in [#1461](https://github.com/tangly1024/NotionNext/pull/1461)
  - Next style by [@LooseLi](https://github.com/LooseLi) in [#1479](https://github.com/tangly1024/NotionNext/pull/1479)
  - [fix] 修复未配置Action Secrets每日定时推送报错 by [@Ghlerrix](https://github.com/Ghlerrix) in [#1476](https://github.com/tangly1024/NotionNext/pull/1476)
**Full Changelog**: [v4.0.13...v4.0.14](https://github.com/tangly1024/NotionNext/compare/v4.0.13...v4.0.14)

## V4.0.13(20230815)

### What's Changed
  - 支持Artalk评论插件 by [@tangly1024](https://github.com/tangly1024) in [#1436](https://github.com/tangly1024/NotionNext/pull/1436)
  - Gitbook 侧边栏支持自动分组自动排序，修复分类名重复问题 by [@tangly1024](https://github.com/tangly1024) in [#1455](https://github.com/tangly1024/NotionNext/pull/1455)
gitbook主题将默认按照文章分类进行归组排序。从而解决在gitbook主题下，不同分类文章没有排在一起时，分类名会重复的问题。
在/themes/gitbook/config.js 中可以关闭自动分组排序
  - feat: 优化右键菜单，现在右键菜单不会超出窗口了 by [@mouyase](https://github.com/mouyase) in [#1454](https://github.com/tangly1024/NotionNext/pull/1454)
  - feat(vercel环境变量): 新增代码主题风格 by [@LooseLi](https://github.com/LooseLi) in [#1447](https://github.com/tangly1024/NotionNext/pull/1447)
  - 百度自动推送 by [@Ghlerrix](https://github.com/Ghlerrix) in [#1440](https://github.com/tangly1024/NotionNext/pull/1440)
提高百度收录的速度。使用Github Action每天定时推送链接至百度。
具体使用方法：将 baidupush.sh 里的 url和百度推送api token 换成自己的
  - fix：sidebar在768x1024 显示不正常 by [@Liboq](https://github.com/Liboq) in [#1439](https://github.com/tangly1024/NotionNext/pull/1439)

### New Contributors
  - [@Ghlerrix](https://github.com/Ghlerrix) made their first contribution in [#1440](https://github.com/tangly1024/NotionNext/pull/1440)
**Full Changelog**: [v4.0.12...v4.0.13](https://github.com/tangly1024/NotionNext/compare/v4.0.12...v4.0.13)

## V4.0.12(20230807)

### What's Changed
  - 集成WebWhiz by [@tangly1024](https://github.com/tangly1024) in [#1402](https://github.com/tangly1024/NotionNext/pull/1402)
  - Fix heo 评论插件为空时关闭文字占位 by [@tangly1024](https://github.com/tangly1024) in [#1408](https://github.com/tangly1024/NotionNext/pull/1408)
  - heo搜索 显示摘要 by [@tangly1024](https://github.com/tangly1024) in [#1409](https://github.com/tangly1024/NotionNext/pull/1409)
  - 修复文章丢失 by [@tangly1024](https://github.com/tangly1024) in [#1416](https://github.com/tangly1024/NotionNext/pull/1416)
  - fix：example 搜索 by [@Liboq](https://github.com/Liboq) in [#1419](https://github.com/tangly1024/NotionNext/pull/1419)
  - Nobelium主题菜单优化 by [@tangly1024](https://github.com/tangly1024) in [#1426](https://github.com/tangly1024/NotionNext/pull/1426)
  - Fix/comment cusdis by [@tangly1024](https://github.com/tangly1024) in [#1427](https://github.com/tangly1024/NotionNext/pull/1427)

## v4.0.11 (20230802)

### What's Changed
  - feat: 新增页面防复制功能 by [@LooseLi](https://github.com/LooseLi) in [#1381](https://github.com/tangly1024/NotionNext/pull/1381)
  - fb-messenger逻辑微调，用户点击后即刻弹出窗口
  - fix/menu-link-blank 调整外链菜单，使用新窗口打开 by [@tangly1024](https://github.com/tangly1024) in [#1394](https://github.com/tangly1024/NotionNext/pull/1394)
  - 修复next主题分页导航bug by [@tangly1024](https://github.com/tangly1024) in [#1395](https://github.com/tangly1024/NotionNext/pull/1395)
**Full Changelog**: [v4.0.10...v4.0.11](https://github.com/tangly1024/NotionNext/compare/v4.0.10...v4.0.11)

## v4.0.10 (20230801)

### What`s Change
修复文章中嵌套的单页无法打开的bug

## v4.0.9 (20230801)

### What`s Change
  - 支持netlify部署，修复项目用npm部署版本不兼容问题
  - 减轻代码依赖，内置的facebook、ackee、qrcode插件移到cdn外部调用，
  - 优化heo置顶推荐文章逻辑
  - 优化cusdis插件

## v4.0.8 (20230730)

### What`s Change
  - 允许Notion中创建多个数据视图，不会影响文章和菜单排序。
  - 方便用户按照自定义视图分组、分类、筛选文章
  - 默认按照第一个视图排序 ；
![Untitled](/legacy/1b189666cf2962f7.png)

## v4.0.7 （20230730）

### What's Changed
  - HEO主题右上角置顶文章逻辑调整，样式微调 Feat/heo top posts by [@tangly1024](https://github.com/tangly1024) in [#1371](https://github.com/tangly1024/NotionNext/pull/1371)
    - 详情见《[HEO主题配置说明文档](/user-guide/themes/heo)》
  - feat/是否显示开始阅读 by [@Vixcity](https://github.com/Vixcity) in [#1360](https://github.com/tangly1024/NotionNext/pull/1360)
  - 保存用户深色模式 by [@tangly1024](https://github.com/tangly1024) in [#1362](https://github.com/tangly1024/NotionNext/pull/1362)
  - fix hexo overflow-x by [@tangly1024](https://github.com/tangly1024) in [#1370](https://github.com/tangly1024/NotionNext/pull/1370)
**Full Changelog**: [v4.0.6...v4.0.7](https://github.com/tangly1024/NotionNext/compare/v4.0.6...v4.0.7)

## v4.0.6（20230727）

### What's Changed
修复已知4.0bug，感谢用户的反馈和提交❤
  - Feat/algolia by [@tangly1024](https://github.com/tangly1024) in [#1336](https://github.com/tangly1024/NotionNext/pull/1336)
  - fix medium 移动端目录溢出 by [@bpking1](https://github.com/bpking1) in [#1344](https://github.com/tangly1024/NotionNext/pull/1344)
  - Demo blog config by [@LooseLi](https://github.com/LooseLi) in [#1341](https://github.com/tangly1024/NotionNext/pull/1341)
  - fix:QQ分享按钮无效 by [@Liboq](https://github.com/Liboq) in [#1338](https://github.com/tangly1024/NotionNext/pull/1338)
  - Enhance code highlight switch by [@jxpeng98](https://github.com/jxpeng98) in [#1257](https://github.com/tangly1024/NotionNext/pull/1257)
  - 二段滑动bug by [@tangly1024](https://github.com/tangly1024) in [#1351](https://github.com/tangly1024/NotionNext/pull/1351)
  - Fix/heo style by [@tangly1024](https://github.com/tangly1024) in [#1353](https://github.com/tangly1024/NotionNext/pull/1353)
  - fix 随便逛逛两次点击报错 by [@tangly1024](https://github.com/tangly1024) in [#1354](https://github.com/tangly1024/NotionNext/pull/1354)
  - heo 添加最后更新日期，修复归档日期bug by [@tangly1024](https://github.com/tangly1024) in [#1355](https://github.com/tangly1024/NotionNext/pull/1355)

### New Contributors
  - [@bpking1](https://github.com/bpking1) made their first contribution in [#1344](https://github.com/tangly1024/NotionNext/pull/1344)
  - [@Liboq](https://github.com/Liboq) made their first contribution in [#1338](https://github.com/tangly1024/NotionNext/pull/1338)

## v4.0.5(20230724)

### What's Changed
修复已知bug
  - fix 移动端公式行标乱码 by [@tangly1024](https://github.com/tangly1024) in [#1319](https://github.com/tangly1024/NotionNext/pull/1319)
  - 可关闭RSS by [@tangly1024](https://github.com/tangly1024) in [#1320](https://github.com/tangly1024/NotionNext/pull/1320)
  - 横向滚动溢出 bug by [@tangly1024](https://github.com/tangly1024) in [#1323](https://github.com/tangly1024/NotionNext/pull/1323)
  - 修复主题切换问题 by [@tangly1024](https://github.com/tangly1024) in [#1324](https://github.com/tangly1024/NotionNext/pull/1324)
  - heo fix 隐藏移动端的深色按钮 by [@tangly1024](https://github.com/tangly1024) in [#1325](https://github.com/tangly1024/NotionNext/pull/1325)
  - medium 主题文章详情页 by [@tangly1024](https://github.com/tangly1024) in [#1327](https://github.com/tangly1024/NotionNext/pull/1327)
  - 自定义字体，示例 by [@tangly1024](https://github.com/tangly1024) in [#1328](https://github.com/tangly1024/NotionNext/pull/1328)
  - Footer bio by [@LooseLi](https://github.com/LooseLi) in [#1329](https://github.com/tangly1024/NotionNext/pull/1329)

### New Contributors
  - [@LooseLi](https://github.com/LooseLi) made their first contribution in [#1329](https://github.com/tangly1024/NotionNext/pull/1329)

## 4.0.4(20230723)

### What's Changed
  - Vercel静态部署模式支持，节省网站资费
在后台将编译命令改为 `yarn export` ，此时站点为纯静态部署，几乎不耗费vercel资源。适合访问量极大的博主使用。
代价:
    1. 每次发布文章都要在vercel后台手动`redeploy` 。
    1. 站点动态搜索不能用，后续将改用`algolia`方案支持。
![Untitled](/legacy/719a2633fb265b3c.png)
  - 字体相关Update CommonHead.js by [@jxpeng98](https://github.com/jxpeng98) in [#1312](https://github.com/tangly1024/NotionNext/pull/1312)
  - 支持外部favicon feat: support blog favicon configurable, use lcoal favicon.ico as default , also can use online resource by [@imesong](https://github.com/imesong) in [#1311](https://github.com/tangly1024/NotionNext/pull/1311)
  - 修复heo暗黑模式下，右侧最新文章列表背景仍为白色bug，并且在上部导航栏添加暗黑模式切换按钮 by [@jxpeng98](https://github.com/jxpeng98) in [#1303](https://github.com/tangly1024/NotionNext/pull/1303)
  - 修复:nobelium主题公告置顶展示 by [@hjwucc](https://github.com/hjwucc) in [#1302](https://github.com/tangly1024/NotionNext/pull/1302)
  - 调整info图标 change the icon of about in nav bar by [@jxpeng98](https://github.com/jxpeng98) in [#1300](https://github.com/tangly1024/NotionNext/pull/1300)

### New Contributors
  - [@imesong](https://github.com/imesong) made their first contribution in [#1311](https://github.com/tangly1024/NotionNext/pull/1311)
  - [@hjwucc](https://github.com/hjwucc) made their first contribution in [#1302](https://github.com/tangly1024/NotionNext/pull/1302)
**Full Changelog**: [v4.0.3...v4.0.4](https://github.com/tangly1024/NotionNext/compare/v4.0.3...v4.0.4)

## v4.0.3 (20230721)

### What`s Changed
  - 优化heo主题性能heo。
  - 修复4.0.2已知bug
    - [#1298](https://github.com/tangly1024/NotionNext/issues/1298)
    - [#1297](https://github.com/tangly1024/NotionNext/issues/1297)
    - [#1296](https://github.com/tangly1024/NotionNext/issues/1296)
**Full Changelog**: [v4.0.2...v4.0.3](https://github.com/tangly1024/NotionNext/compare/v4.0.2...v4.0.3)

## [v4.0.2](https://github.com/tangly1024/NotionNext/releases/tag/v4.0.2) (20230721)

#### What's Changed
  - 优化SEO，优化性能
    - 图片懒加载组件
    - 字体预渲染、图标预渲染
  - 添加百度站长验证 by [@tdouguo](https://github.com/tdouguo) in [#1289](https://github.com/tangly1024/NotionNext/pull/1289)
  - 提取谷歌广告 slot 编程环境变量 by [@tdouguo](https://github.com/tdouguo) in [#1291](https://github.com/tangly1024/NotionNext/pull/1291)
  - 修复已知bug
New Contributors
  - [@tdouguo](https://github.com/tdouguo) made their first contribution in [#1289](https://github.com/tangly1024/NotionNext/pull/1289)
**Full Changelog**: [v4.0.1...v4.1.0](https://github.com/tangly1024/NotionNext/compare/v4.0.1...v4.1.0)

## 4.0.1(20230719)
4.0.1 正式发布

### 新增
  - 新增全局右键自定义菜单，支持多语言。
  - 优化heo首屏动画，加快首页响应
  - 缩小悬浮切换主题按钮

### 修复已知bug
  - 移除iframe4chatbase by [@tangly1024](https://github.com/tangly1024) in [#1270](https://github.com/tangly1024/NotionNext/pull/1270)
  - 首页卡牌跳转链接配置文件 by [@tangly1024](https://github.com/tangly1024) in [#1278](https://github.com/tangly1024/NotionNext/pull/1278)
  - fix-top-group-height by [@tangly1024](https://github.com/tangly1024) in [#1279](https://github.com/tangly1024/NotionNext/pull/1279)
  - fix tag navbar by [@tangly1024](https://github.com/tangly1024) in [#1280](https://github.com/tangly1024/NotionNext/pull/1280)
  - fix-plog-menubar by [@tangly1024](https://github.com/tangly1024) in [#1281](https://github.com/tangly1024/NotionNext/pull/1281)

## 4.0.0 (20230718)
  1. 发布[HEO主题](/user-guide/themes/heo)
  1. 新增[ChatBase](/user-guide/plugins/notion-next-chat-base)聊天机器人

## PRE.4.0.0(20230708)
这是一个[预发布版本](https://github.com/tangly1024/NotionNext/tree/release/4.0.0)

### What`s Change
  1. 优化动画效果
  1. 优化Gitbook主题
  1. 优化深色模式按钮样式
  1. Themes目录结构调整
  1. 新增Landing企业/产品主页
  1. 新增Plog主题，适用于照片博客
  1. 代码框支持折叠，减少文章版面占用
  1. 修复gitbook主题评论区bug

### 4.0 计划
加入NotionNext的Notion插件应用，更便捷，更安全地导入Notion数据；您的Notion数据不必完全公开，应用正在筹备计划阶段。
[Notion – The all-in-one workspace for your notes, tasks, wikis, and databases.](https://www.notion.so/install-integration?response_type=code&client_id=8d047886-9d8d-472e-a6a2-4a9354459ab6&redirect_uri=https://tangly1024.com/auth&owner=user)

A new tool that blends your everyday work apps into one. It's the all-in-one workspace for you and your team

</details>

## 原文链接

https://docs.tangly1024.com/article/v4.0
