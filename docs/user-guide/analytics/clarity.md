# Clarity站点统计
> 迁移自：[Clarity站点统计](https://docs.tangly1024.com/article/notion-next-clarity)
> 发布日期：2024-1-31
> 最后编辑：2024-1-31
> 原栏目：📊 网站统计

## 什么是Clarity

微软推出的完全免费的站点统计数据，它是一个用户行为分析工具，可帮助你了解用户如何通过会话重播和热度地图等功能与网站交互。


### 优点

Microsoft Clarity有以下这些优点：

1. 墙内使用无忧，微软出品。

1. 无抽样，100%还原数据。

1. 100%免费，

1. 对站点大小量级无限制。

1. 接近实时的数据更新。

1. 不影响网站性能。

1. 可与其他分析工具集成。

1. 数据安全，不收集敏感信息。


## 效果

在后台查看实时访客，总访客、文章访问、等信息。

![Untitled](/legacy/b2dbace9e8189535.png)

支持实时查看用户访问的动作，您可以身临其境地了解到每一个用户在您的站点中，依次浏览了什么内容，点击了什么按钮，在哪篇文章停留得最久。

![Untitled](/legacy/ae70c409c22340f6.png)

同时clarity支持直接连接您的GoogleAnalytics数据，在clarity后台就可以查看GA的统计数据

![Untitled](/legacy/55c985eccb499a63.png)

> 接下来介绍如何部署


## 创建您的Clarity账户

登录clarity

[Microsoft Clarity - Free Heatmaps & Session Recordings](https://clarity.microsoft.com/)

Clarity is a free user behavior analytics tool that helps you understand how users are interacting with your website through session replays and heatmaps.

设置您的站点信息

![Untitled](/legacy/dabbd299f15edcb7.png)


### 获取Clarity的ID

创建好项目后选择手动安装

![Untitled](/legacy/937434fc1c9a586a.png)

页面中的这串10个字符就是您的ID

![Untitled](/legacy/abd6cc46cd509db2.png)


## 配置NotionNext

对应的配置文件在[blog.config.js：356行](https://github.com/notionnext-org/NotionNext/blob/eced20bfe7af015d69eef147af104df4c3ae88ee/blog.config.js#L356)，在NotionNext项目后台添加如下环境变量即可

您可以在blog.config.js 或者在 vercel环境变量，或者直接在notion-config中配置

## 原文链接

https://docs.tangly1024.com/article/notion-next-clarity
