# 主题功能说明
> 迁移自：[主题功能说明](https://docs.tangly1024.com/article/notion-next-themes)
> 发布日期：2023-6-27
> 最后编辑：2026-5-2
> 原栏目：⭐ 主题参数
> 标签：NotionNext、主题
> 摘要：主题与 main 分支 themes 目录对齐：默认 simple、挂件内切换见 conf/widget.config.js；修改 THEME 与在线预览说明。

## 主题功能介绍

NotionNext会扫描/themes目录下的文件夹，并根据文件夹的名字生成一个主题，只要在配置中将您的当前主题设置为**对应文件夹名字**即可，注意都是**小写**。
![主题文件夹](/legacy/d72e7a174586dd05.png)


## 主题预览

内置主题以 GitHub 仓库 `[themes/](https://github.com/notionnext-org/NotionNext/tree/main/themes)` 目录为准（会随版本迭代增减）。当前主线常见主题包括：`simple`（**新建仓库默认**，见 `blog.config.js` 的 `THEME`）、`next`、`medium`、`hexo`、`fukasawa`、`gitbook`、`matery`、`heo`、`nobelium`、`plog`、`landing`、`nav`、`starter`、`commerce`、`magzine`、`photo`、`movie`、`game`、`fuwari`、`claude`、`proxio`、`typography`、`example` 等。

可按用途粗选：GitBook 偏文档；Nav 偏导航聚合；Landing / Starter 偏落地页；Plog、Photo 偏图集；更多说明见各主题子文档或源码中对应 `config.js`。

点击 [预览站](https://preview.tangly1024.com/) 左下角挂件可在线切换主题。

![image.png](/legacy/3b8fc39f232c4fa7.png)
![image.png](/legacy/93ce46e019651e0a.png)


### 主题目录构成

![Untitled](/legacy/a056543acfec2e2f.png)

每个主题下都有四个部分组成，以example主题为例，目录下有四个元素：

- components 组件文件夹，下面存放着主题用到的所有组件，项目采用react架构，所有的按钮模块都是单独的组件。

- config.js 针对当前主题的配置

- index.js 存放主题的基础布局和对应的路由关系

- style.js 自定义的css样式


## 如何修改默认主题？

### 新手常见问题：固定 simple 主题并隐藏切换按钮

如果你只是想固定使用 `simple` 主题，并且不想让页面显示“切换主题”按钮，不需要改代码。

优先在 Notion Config 表里添加这三项：

```text
THEME=simple
THEME_SWITCH=false
WIDGET_PET_SWITCH_THEME=false
```

含义如下：

- `THEME=simple`：固定使用 simple 主题。
- `THEME_SWITCH=false`：隐藏页面上的主题切换按钮。
- `WIDGET_PET_SWITCH_THEME=false`：防止点击宠物挂件时切换主题。

如果你没有使用 Notion Config，而是在 Vercel 后台配置环境变量，则填写：

```text
NEXT_PUBLIC_THEME=simple
NEXT_PUBLIC_THEME_SWITCH=false
NEXT_PUBLIC_WIDGET_PET_SWITCH_THEME=false
```

改完后重新部署一次。如果重新部署后仍然不是 `simple`，请先检查 Notion Config 表里是否已经写了其它 `THEME`，因为 Notion Config 的优先级高于 Vercel 环境变量，也高于 GitHub 代码里的默认值。

可以改变blog.config.js配置中`THEME`这一项的值；示例如下：

- 方法1：改动github中的源代码：
```JavaScript
THEME: process.env.NEXT_PUBLIC_THEME || 'simple', // 与当前主仓库默认值一致；可按需改为 hexo、next 等文件夹名（小写）
```

- 方法2 ， 在vercel后台添加环境变量: `NEXT_PUBLIC_THEME`
![添加环境变量后记得在Deployment中重新部署](/legacy/54989b0a8ef22f5a.png)

- 方法3： 使用Notion_config，在您的notion笔记中配置默认主题


### 在线切换主题

您可以像我的博客站一样，在页面上开启一个实时切换主题的按钮，以供预览；开启方式：在主仓库 `[conf/widget.config.js](https://github.com/notionnext-org/NotionNext/blob/main/conf/widget.config.js)` 中调整（或在部署后台配置环境变量 `NEXT_PUBLIC_THEME_SWITCH`）：

```JavaScript
THEME_SWITCH: process.env.NEXT_PUBLIC_THEME_SWITCH || false, // 是否显示切换主题按钮；预览站常开便于体验
```

说明：此项已自 `blog.config.js` 拆至挂件配置；亦可在 Notion Config 表格中写同名键覆盖，优先级仍为 Notion Config 高于环境变量、高于代码默认值。

开启后效果如下：网页上会始终悬挂一个可以拖拽的面板，用于切换主题。

![Untitled](/legacy/8887786b5f3ad411.png)

### 主题控制台与调色板

新版主题切换工具同时提供“主题切换”和“主题控制台”两个入口。主题控制台可以实时调整当前主题的信息配置与配色，确认效果后复制到 `notion_config`。详细使用方式见 [主题控制台与调色板](./theme-console.md)。


## 如何个性化您的主题


### 主题的微调

- 可以参考本文档丶关于各个主题可支持的配置进行修改：

![Untitled](/legacy/844fc33bec7482e4.png)

- 另外您可以参考开发指引中的教程来自定义您的主题。
[NotionNext开发先导 | NotionNext帮助手册](/user-guide/development/getting-started)

小白入门如何开发notionnext，下载NotionNext、启动NotionNext、提交合并到NotionNext等。
[NotionNext用配置调整样式 | NotionNext帮助手册](/user-guide/development/custom-style)

不会react、不会 nextjs、不会webpack、不会TailWindCSS如何调整样式


### 创建您的主题

您可以复制一个现有的主题，并在此基础进行二次开发。更多关于创建主题与开发的功能，请阅读开发教程:

[NotionNext自建主题 | NotionNext帮助手册](/user-guide/development/own-theme)

简单几步骤即可创建属于自己的主题

也欢迎您将自己开发设计的主题，通过PR的方式提交到NotionNext中央仓库中，提供给更多站友们使用。


## 最后

接下来在这个主题配置栏目下我将逐一介绍各个主题的配置，但在看主题个性配置前，请确保您已经完整阅读站点的基础配置部分：‣ 。

## 原文链接

https://docs.tangly1024.com/article/notion-next-themes
