# NotionNext

一个使用 NextJS + Notion API 实现的，部署在 Vercel 上的静态博客系统。为Notion和所有创作者设计。

<p>
  <a aria-label="GitHub commit activity" href="https://github.com/tangly1024/NotionNext/commits/main" title="GitHub commit activity">
    <img src="https://img.shields.io/github/commit-activity/m/tangly1024/NotionNext?style=for-the-badge"/>
  </a>
  <a aria-label="GitHub contributors" href="https://github.com/tangly1024/NotionNext/graphs/contributors" title="GitHub contributors">
    <img src="https://img.shields.io/github/contributors/tangly1024/NotionNext?color=orange&style=for-the-badge"/>
  </a>
  <a aria-label="Build status" href="#" title="Build status">
    <img src="https://img.shields.io/github/deployments/tangly1024/NotionNext/Production?logo=Vercel&style=for-the-badge"/>
  </a>
  <a aria-label="Powered by Vercel" href="https://vercel.com?utm_source=Craigary&utm_campaign=oss" title="Powered by Vercel">
    <img src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg" height="28"/>
  </a>
</p>

演示地址：[https://www.tangly1024.com/](https://www.tangly1024.com/)
## 亮点 ✨

**🚀 &nbsp;秒开，设备全适配**

- 快速的页面渲染和响应式设计
- 高效编译器的快速静态页面生成

**🤖 &nbsp;自动，无需重新部署**

- 部署在免费、高速的 Vercel 平台
- 支持增量式更新，更新文章后无需重复部署

**🚙 &nbsp;全功能，完全不操心**

- 评论、搜索、标签、分类
- 订阅、网站统计
- 本地化多语言
- 服务端渲染、优秀的SEO

**🎨 &nbsp;美观，轻松自定义**

- 丰富的配置项，更支持多语言
- 使用 Tailwind CSS，轻松实现二次开发

**🕸 &nbsp;网址美观、搜索引擎优化**

## 快速起步

- 给这个项目点个小星星 😉
- 将 [这个 Notion 模板](https://tanghh.notion.site/02ab3b8678004aa69e9e415905ef32a5) 制作副本，并分享这个页面给所有人
- [Fork](https://github.com/tangly1024/NotionNext/fork) 这个项目
- 在 `blog.config.js` 配置相关选项
- _(可选)_ 用自己的图片替换 `/public` 文件夹里的 `avatar.svg`、`favicon.svg` 和 `favicon.ico`
- 在 [Vercel](https://vercel.com) 上部署这个项目, 设定一下环境变量：
  - `NOTION_PAGE_ID`: 你刚刚分享出去的 Notion 页面网址中的页面 ID，通常是网址中工作区地址后的 32 位字符串
  - `NOTION_ACCESS_TOKEN`（可选）: 如果你决定不分享你的数据库，你可以使用 token 来让网页从 Notion 数据库中抓取数据。你可以在你的浏览器 cookies 中找到它，名称是 `token_v2'。
    - Notion token 的有效期只有 180 天，请确保在 Vercel Dashboard 上手动更新，我们可能会在未来切换到官方 API 来解决这个问题。此外，如果数据库是非公开到，Notion 中的图片可能无法正常显示到网页上。
- **稍微等等就可以访问了！** 简单吗?

## 引用技术

- **生成**: Next.js SSG 和 Incremental Static Regeneration
- **页面渲染**: [React-notion-x](https://github.com/NotionX/react-notion-x)
- **样式**: Tailwind CSS 和 `@tailwindcss/jit` compiler
- **评论**: Gitalk,Cusdis,Utterances
- **图标**：[fontawesome](https://fontawesome.com/v4.7/icons/?d=gallery)

## 页面样式主题
- 仿照 [fukasawa](https://andersnoren.se/themes/fukasawa) 分支-https://github.com/tangly1024/NotionNext/tree/theme-Fukasawa
  <details><summary>fukasawa截图</summary>
  <img src='https://github.com/tangly1024/NotionNext/blob/main/docs/screenshot-fukasawa.png?raw=true'/>
  </details>
- 仿照 [youtube] 主题 分支-https://github.com/tangly1024/NotionNext/tree/themw-youtube
  <details><summary>youtube截图</summary>
  <img src='https://github.com/tangly1024/NotionNext/blob/main/docs/screenshot-youtube.png?raw=true'/>
  </details>

## License

The MIT License.
