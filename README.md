# NotionNext

Forked from [NotionNext](https://github.com/tangly1024/NotionNext)

## Features
- 支持更多的页面，功能，更多特性、欢迎移步[我的博客](https://tangly1024.com/article/notion-next)查看
- Supports switching between themes

| Next | Medium | Hexo | Fukasawa |
|--|--|--|--|
| <img src='./docs/theme-next.png' width='300'/> [预览NEXT](https://preview.tangly1024.com/?theme=next)  | <img src='./docs/theme-medium.png' width='300'/> [预览MEDIUM](https://preview.tangly1024.com/?theme=medium) | <img src='./docs/theme-hexo.png' width='300'/> [预览HEXO](https://preview.tangly1024.com/?theme=hexo) | <img src='./docs/theme-fukasawa.png' width='300'/> [预览FUKASAWA](https://preview.tangly1024.com/?theme=fukasawa) |

*You can update the theme by changing the `THEME` in the `blog.config.js` file, didn't see one you like? Consider [contribute](/CONTRIBUTING.md) one~



## Quick Start
- Duplicate [This Notion Template](https://tanghh.notion.site/02ab3b8678004aa69e9e415905ef32a5) and shared it to public
- [Fork](https://github.com/tangly1024/NotionNext/fork) This Repo
  - _(可选)_ 用自己的图片替换 `/public` 文件夹里的 `avatar.jpg`、`favicon.svg` 和 `favicon.ico`
  - 在 `blog.config.js` 配置相关选项，`NOTION_PAGE_ID`: 你刚刚分享出去的 Notion 页面网址中的页面 ID，通常是网址中工作区地址后的 32 位字符串
- Deploy to [Vercel](https://vercel.com)

[NotionNext Document](https://docs.tangly1024.com/zh)

## Develop
- Node.js is required
```bash
yarn # install packages
yarn run dev # local dev
yarn run build # local build
yarn run start # start local Next JS service
```

## Based on

- **Framework**: [Next.js](https://nextjs.org)
- **CSS**: [Tailwind CSS](https://www.tailwindcss.cn/) 和 `@tailwindcss/jit` compiler
- **Redered**: [React-notion-x](https://github.com/NotionX/react-notion-x)
- **Comments**: [Giscus](https://giscus.app/zh-CN), [Gitalk](https://gitalk.github.io), [Cusdis](https://gitalk.github.io), [Utterances](https://utteranc.es)
- **Icons**：[fontawesome v5.15](https://fontawesome.com/v5.15/icons?d=gallery)

## Update logs
[Logs](https://docs.tangly1024.com/zh/changelog)


## License

The MIT License.
