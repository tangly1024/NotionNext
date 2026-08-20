# 菜单管理-二级菜单
> 迁移自：[菜单管理-二级菜单](https://docs.tangly1024.com/article/notion-next-secondary-menu)
> 发布日期：2023-3-23
> 最后编辑：2024-7-2
> 原栏目：🛠 站点配置
> 标签：NotionNext
> 摘要：NotionNext 3.13.0上线，支持更灵活的菜单配置

## 菜单功能

在NotionNext 3.12 之前的旧版本中，网站的[菜单栏由Page控制](https://docs.tangly1024.com/zh/features/singlePage)。

> 类型为`Page`的文章，不会展示在博文列表，而是在导航栏中出现菜单入口。

这一旧方案有两个弊端：一是若想关闭自带菜单，例如分类、归档、搜索，旧需要修改配置文件，很不方便；另一个弊端是，此方案若要实现二级下拉菜单显得力不从心。于是本文的自定义菜单`Menu`方案诞生了。


## 新菜单效果

所有菜单都在您的Notion中自定义，旧的Page菜单将被完全覆盖。同时、系统自带的主页分类、归档、搜索等按钮都需要您**自行配置**。

![Untitled](/legacy/3c8b11653f811821.png)


## 开始

首先，请**更新您的NotionNext至3.13.0以上版本**；访问升级指南或在交流群寻求帮助。

[NotionNext升级指南 | TANGLY’s BLOG](/user-guide/update)

当NotionNext发布新版后，如何更新你的项目？

其次，在您的`blog.config.js`中，开启完全自定义菜单:

```JavaScript
**CUSTOM_MENU**: process.env.NEXT_PUBLIC_CUSTOM_MENU || true, // 支持Menu 类型
```

当该值为true时，原先读取Page生成菜单的功能将被自定义菜单覆盖。

::: tip 提示
老版本推荐在环境变量中配置；4.0以后得版本可以在Notion_Config中设置： ‣
:::


### 添加普通菜单-`Menu`

在notion中添加一个类型为`Menu`的页面：并包含以下字段

示例配置

![Untitled](/legacy/81137b00ec78f78f.png)


### 添加子菜单-`SubMenu`

子菜单绑定方法：在列表中，`SubMenu`紧跟在`Menu`后面即可做为子菜单。

![图片示例，这三个菜单构成一组一级菜单和二级菜单](/legacy/40b43414969a8378.png)

子菜单3点注意：

1. ⚠️ `**Menu**`**后面一旦挂载了**`**SubMenu**`**，则此**`**Menu**`**就无法点击跳转，只能作为展开菜单使用。**⚠️

1. 只有普通菜单`Menu` 后能挂子菜单`SubMenu`；`Menu`不能挂`Menu`、`SubMenu`不能挂`SubMenu`；

1. `SubMenu`若没有紧跟在一个`Menu`后面，则成为孤儿菜单，不会显示。

::: tip 提示
提示： 菜单的路径分为**相对路径**和**绝对路径**；请使用绝对路径。
:::

::: tip 4.10.9 更新
如果菜单 `slug` 指向一个 `status=Invisible` 的隐藏页面，NotionNext 会优先使用该隐藏页面最终生成的 `href`。这适合把“隐藏页面”作为菜单入口背后的真实内容页，同时仍避免它出现在首页、归档、RSS、Sitemap 和搜索索引里。

未发布的 `Draft` 页面不会因为同名菜单而被公开；如果只是想跳转到外部链接或手写路径，继续在 `slug` 中填写完整路径即可。
:::

`/about`  这是一个**绝对路径**，它以左斜杆/开头，在博客的任意页面点击此菜单都会跳到 [http://域名/about](http://域名/about) 该路径。

`about` 这是一个**相对路径**，它没有左斜杆/开头，如果在博客首页点击菜单会跳到  [http://域名/about](http://域名/about) 该路径，然如果在 其它页面，例如 `http://域名/tag/标签` 这个页面下，点击菜单，会跳到 [http://域名/tag/标签/about](http://域名/tag/标签/about) ，这会导致你的页面访问错误。


## 参考配置

可参考我的notion模板进行配置：

[https://www.notion.so/tanghh/02ab3b8678004aa69e9e415905ef32a5?v=b7eb215720224ca5827bfaa5ef82cf2d&pvs=4](https://www.notion.so/tanghh/02ab3b8678004aa69e9e415905ef32a5?v=b7eb215720224ca5827bfaa5ef82cf2d&pvs=4)

![Untitled](/legacy/ce7e9d2106869ce4.png)


## 特别注意

::: tip 提示
Menu,SubMenu 这两个类型本质只是菜单，唯一功能是跳转到slug指定的页面，指定页面可以是任意page\post\外链； 但Menu和SubMenu本身不应该放文章内容。
:::

::: tip 菜单图标
`4.10.9` 修复了 Claude、Typography、Game、Nobelium、Plog 等主题中菜单或子菜单图标缺失的问题。若你在 Notion 菜单数据里配置了 Font Awesome 类名，例如 `fas fa-home`，升级后这些主题会按菜单项自身的 icon 字段显示。
:::

::: tip 提示
**特别提醒：**
在V3.13版本中 ，不要在您的数据库中添加多个视图，这将会导致您的菜单乱序。如需添加视图以便分类整理文章，建议另外新建一个视图单页，参考下文： [https://github.com/notionnext-org/NotionNext/issues/1056](https://github.com/notionnext-org/NotionNext/issues/1056)
:::

在V4.0之后的新版本可以忽略此问题。


## 关于菜单的使用方式示例

::: info 说明
notion中添加Menu类型数据，将仅作为跳转功能使用，menu的slug字段将指定跳转的路径，而menu这条数据的**页面内容**没有任何实际作用。
:::


### Menu的五种使用示例:

Menu菜单总共可以有五种用法，下面是每一种用法的示例，表格第一列是这种用法的称呼，右边两列分别是 title、slug两个值的示例，最右一列是说明。


## 关于菜单缓存

NotionNext为每一个页面都单独做了缓存，如果改动了菜单，即使刷新首页，让新菜单生效；但其它每个文章页面的菜单仍然是旧的版本，只有但用户访问了一次其他页面，会出发刷新缓存，再次访问就是新的菜单。

如果嫌每个页面都要刷新很麻烦，则可以在vercel后台直接redeploy，彻底清除所有缓存。

## 原文链接

https://docs.tangly1024.com/article/notion-next-secondary-menu
