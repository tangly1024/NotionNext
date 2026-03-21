# 基于 NotionNext Heo 主题的深度定制增强版
>
> 🎨 **极致 UI 质感** | ⚡ **秒级加载体验** | 🔍 **SEO 深度重构** | 🤖 **AI 智能摘要**
>
> 本项目打破模板化局限，聚焦个人博客的**精致感**与**高性能**。通过全量重构核心组件、注入全局自定义 CSS、优化资源加载策略及完善 SEO 架构，打造一款**更美观、更快速、更具辨识度**的 Notion 驱动博客。

---

## ✨ 核心特性 (Core Features)

### 🎨 视觉美学：全量重构与质感升级
不仅仅是换肤，而是对交互逻辑与视觉体系的全面焕新。
- **专属配色体系**：摒弃默认靛蓝，定制**暖橙 + 湖蓝**双主色体系，全量覆盖标签、按钮、链接及表单元素，统一视觉风格。
- **核心组件重写**：深度重构导航、文章卡片、页脚、代码高亮 (PrismMac) 等 **20+** 核心模块，适配精致博客定位。
- **毛玻璃导航栏**：采用渐变背景 + backdrop-filter 模糊效果，打造现代感十足的导航体验。
- **分类标签胶囊形式**：新增圆润胶囊样式，选中状态渐变高亮，交互反馈更加直观。
- **圆角系统优化**：文章卡片、图片、目录等组件统一圆角，视觉更加柔和。
- **暗黑模式深度美化**：专门优化的暗黑模式配色，提升对比度和阅读体验。
- **🤖 AI 文章摘要**：新增 `AISummar.js` 专属组件，提炼文章核心观点，大幅提升阅读效率。
- **Tailwind 扩展**：扩展自定义配置规则，实现像素级的样式控制。

### 💎 交互动效：电影级体验
- **沉浸式页脚**：新增多色渐变流动动画 (16s 缓动)，搭配玻璃态光泽与立体阴影，打造极具质感的底部体验。
- **液态玻璃按钮**：重构全站按钮，采用多色渐变光效 + 悬停上浮 + 点击缩放反馈，兼具美感与无障碍优化。
- **定制化光标与滚动条**：
  - 双状态专属鼠标指针（普通/悬停），强化品牌辨识度。
  - 45°斜纹光影滚动条，兼顾美观与操作手感。
- **玻璃态加载进度条**：深度美化 `pace.js`，采用毛玻璃效果 + 四色渐变流动，消除等待焦虑。
- **阅读体验优化**：
  - 文章内链新增渐变下划线与背景高亮动效。
  - 搜索框聚焦外发光过渡，提升交互反馈感。
- **性能友好动效**：针对 `prefers-reduced-motion` 设备自动禁用冗余动画，利用 `will-change` 优化渲染性能，拒绝卡顿。
- **Lenis 平滑滚动**：集成高性能平滑滚动库，采用 cubic 缓动函数，消除滑动抖动。
- **樱花/星空动画优化**：动态调整粒子数量，根据设备性能自动适配。
- **加载动画增强**：增加光影效果，使等待过程更具观赏性。
- **目录交互优化**：选中高亮、悬停动效、圆角边框，导航更直观。

### ⚡ 性能飞跃：极速加载与资源调度
每一毫秒的提升，只为更流畅的阅读体验。
- **静态资源 CDN 化**：AOS 等库迁移至稳定 CDN，剔除本地冗余，显著减小项目体积。
- **并行加载策略**：重构评论与动画组件，由串行改为 `Promise.all` 并行加载，大幅提升首屏速度 (FCP)。
- **感知性能优化**：
  - 集成 `instant.page` 链接预加载，实现页面“秒开”。
  - 重写 `LazyImage` 与 `Lenis` 平滑滚动组件，平衡流畅度与性能损耗。
- **智能缓存机制**：页面缓存周期从 60 秒延长至 **30 天**，大幅降低 Vercel 服务端消耗，提升复访速度。
- **动画性能优化**：樱花、星空动画根据设备性能动态调整
- **项目瘦身**：彻底清理无用文档、废弃脚本及广告配置，保持代码库纯净。

### 🔍 SEO 架构：搜索引擎友好重构
让优质内容更容易被世界发现。
- **SEO 核心重构**：全量重写 `SEO.js`，优化元标签、结构化数据 (Schema.org) 及 OG 标签生成逻辑。
- **精准关键词策略**：预设覆盖技术、资源、工具等维度的关键词矩阵，提升收录权重。
- **动态元数据**：针对不同页面类型（文章、分类、标签）动态生成 Title 与 Description，提升排名潜力。
- **H1标签优化**：文章标题正确使用 H1 标签，搜索引擎更易理解页面结构
- **图片Alt优化**：完善图片替代文本，提升图片搜索排名和可访问性
- **元数据完善**：动态生成不同页面类型的 Title 与 Description
- **Sitemap优化**：修复外链引用，完善生成规则

### 🛠️ 工程化与配置优化
- **Vercel 深度调优**：重构 `vercel.json`，新增 **82 行** 部署规则，优化缓存策略、路由重写及资源压缩，提升稳定性。
- **Next.js 构建优化**：完善 `next.config.js` 构建逻辑，提升打包效率与渲染性能。
- **依赖管理**：更新 `package.json`，移除冗余包，引入必要新依赖，确保安全性与功能性。

---

## ⚠️ 特别说明

> **这是一个高度个性化的定制版本 (Opinionated Fork)。**

### 兼容性说明
由于进行了深度精简和重构，**部分原版 NotionNext 的 Heo 主题的功能可能已被移除或修改**。如果你发现某些功能缺失，那很可能是因为我个人并未使用到该功能。

### 适用人群
- 追求极致视觉体验的用户
- 具备一定动手能力（能自行解决配置冲突）的用户
- 希望拥有独特博客风格的创作者

### 反馈与交流
- 如果你发现了 **Bug**，欢迎提交 Issue
- 如果你觉得某些样式与你的内容**不契合**，也欢迎提出建议
- *注：对于"恢复被移除功能"类的请求，可能不会立即采纳，但欢迎 PR 共同讨论*

<div align="center">

**如果这个项目对你有帮助，欢迎给个 Star ⭐️！**

</div>

---

# 帮助教程

访问帮助：[NotionNext帮助手册](https://docs.tangly1024.com/)

> 本项目教程为免费、公开资源，仅限个人学习使用，禁止利用本教程建立的博客发布非法内容、进行违法犯罪活动。严禁任何个人或组织将本教程用于商业用途，包括但不限于直接售卖、间接收费、或其他变相盈利行为。转载、复制或介绍本教程内容时，须保留作者信息并明确注明来源。 
> 本项目仅提供由作者团队授权的付费咨询服务，请注意辨别，谨防诈骗行为。任何未经授权的收费服务均可能存在法律风险。

Notion是一个能让效率暴涨的生产力引擎，可以帮你书写文档、管理笔记，搭建知识库，甚至可以为你规划项目、时间管理、组织团队、提高生产力、还有当前最强大的AI技术加持。

<hr/>

## 预览效果

在线演示：[https://easys.cc.cd/](https://easys.cc.cd/) 

## 致谢

感谢Craig Hart发起的Nobelium项目

<table><tr align="left">
  <td align="center"><a href="https://github.com/craigary" title="Craig Hart"><img src="https://avatars.githubusercontent.com/u/10571717" width="64px;"alt="Craig Hart"/></a><br/><a href="https://github.com/craigary" title="Craig Hart">Craig Hart</a></td>
</tr></table>

## 贡献者

致敬每一位开发者！

[![Contributors](https://contrib.rocks/image?repo=tangly1024/NotionNext)](https://github.com/tangly1024/NotionNext/graphs/contributors)

## 引用技术

- **框架**: [Next.js](https://nextjs.org)
- **样式**: [Tailwind CSS](https://www.tailwindcss.cn/)
- **渲染**: [React-notion-x](https://github.com/NotionX/react-notion-x)
- **评论**: [Twikoo](https://github.com/imaegoo/twikoo), [Giscus](https://giscus.app/zh-CN), [Gitalk](https://gitalk.github.io), [Cusdis](https://cusdis.com), [Utterances](https://utteranc.es)
- **图标**: [Fontawesome](https://fontawesome.com/v6/icons/)

## License

The MIT License.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=tangly1024/NotionNext&type=Date)](https://star-history.com/#tangly1024/NotionNext&Date)
