# Proxio主题

> 迁移自：[Proxio主题](https://docs.tangly1024.com/article/notion-next-proxio)
> 发布日期：2025-4-13
> 最后编辑：2025-4-13
> 原栏目：⭐ 主题参数

## 主题预览

![Proxio 主题预览](/images/themes-preview/proxio.webp)

在4.8.4之后的版本中引入，目前还在Alpha1.0体验测试阶段。后续版本中将持续迭代修复BUG。

![image.png](/legacy/3d64a9f07481fef5.png)

预览地址：[https://preview.tangly1024.com/?theme=proxio&mode=dark](https://preview.tangly1024.com/?theme=proxio&mode=dark)

## 主题特性

- “一人公司“主题，既是个人简历，也是公司介绍。

- 引入了鼠标白点追踪特效

- 引入了lenis网页滚动阻尼动效，页面滚动时会有阻尼感。

## 使用方法

- 将NotionNext当前主题配置为proxio即可

- 主题所有的配置文件可以在 [/themes/proxio/config.js](https://github.com/notionnext-org/NotionNext/blob/main/themes/proxio/config.js) 中找到。

## Proxio 主题调色

Proxio 主题提供一组主色变量，可在 Notion Config 表或 `themes/proxio/config.js` 中覆盖：

```js
PROXIO_COLOR_PRIMARY: '#3758f9'
PROXIO_COLOR_PRIMARY_HOVER: '#1b44c8'
PROXIO_COLOR_BG: '#ffffff'
PROXIO_COLOR_DARK: '#121212'
PROXIO_COLOR_TEXT_MUTED: '#637381'
```

切换到 Proxio 后，也可以在全局主题工具中查看当前调色板，并复制对应配置项。

## 相关说明

首页文章列表默认显示summary，当鼠标指向时会显示背景图片

如果希望文章列表直接显示每篇文章的主图，可以在 Notion Config 表或 `themes/proxio/config.js` 中设置：

```js
PROXIO_BLOG_AUTO_SHOW_COVER: true
```

![image.png](/legacy/dd46b067b0216714.png)

![image.png](/legacy/735ff1431cd689db.png)

支持在设置中将此处设置为别的占位图片，示例效果

![image.png](/legacy/f7b6781a59d0c099.png)

## 原文链接

https://docs.tangly1024.com/article/notion-next-proxio
