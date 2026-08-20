# 自定义数据库表头
> 迁移自：[自定义数据库表头](https://docs.tangly1024.com/article/notion-next-custom-properties)
> 发布日期：2022-9-22
> 最后编辑：2024-1-31
> 原栏目：🛠 站点配置
> 标签：NotionNext
> 摘要：可以在你的notion中自定义表头的名字了

## 前言

NotionNext现在支持在你的数据库中自定义属性名字了。感谢 [JensonMiao (jenson) (github.com)](https://github.com/JensonMiao) 大佬的代码贡献。


## 背景

[NotionNext](https://tangly1024.com/article/notion-next)支持将你的Notion数据库渲染成博客网站，前提是需要先复制以下NOTION模板：

[NOTION BLOG](https://www.notion.so/tanghh/02ab3b8678004aa69e9e415905ef32a5?v=b7eb215720224ca5827bfaa5ef82cf2d)

演示站点描述

这个模板中每个文章都有这几个关键表头不能缺少，你的数据库必须按照此格式，才能被NotionNext站点被正确地读取到数据。

```Bash
type，status，title，summary，slug，category，date，tags，icon，password
```

![Untitled](/legacy/65f783ffa2963665.png)

字段说明可参考此文：

[示例文章 | NOTION BLOG](https://preview.tangly1024.com/article/example-1)

君不见黄河之水天上来，奔流到海不复回。 君不见高堂明镜悲白发，朝如青丝暮成雪。 人生得意须尽欢，莫使金樽空对月。 天生我材必有用，千金散尽还复来。 烹羊宰牛且为乐，会须一饮三百杯。 岑夫子，丹丘生，将进酒，杯莫停。 与君歌一曲，请君为我倾耳听。 钟鼓馔玉不足贵，但愿长醉不愿醒。 古来圣贤皆寂寞，惟有饮者留其名。 陈王昔时宴平乐，斗酒十千恣欢谑。 主人何为言少钱，径须沽取对君酌。 五花马、千金裘，呼儿将出换美酒，与尔同销万古愁。 加锁文章 - 密码123456 ，这篇文章在站点中会被替换成博文内部的链接。 例如 https://www.notion.so/tanghh/4d7cafcd57a4425590c5821a6f40dfe8 会被替换为 /article/4d7cafcd57a4425590c5821a6f40dfe8 在notion中输入@ 符号后输入文章名即可搜索关联 。（注意：仅限用此形式，若以书签形式引用notion页面，将被视为外部链接） 若要部署你的NotionNext项目，请复制该模板，并按照模板格式创建文章： 系统支持 以下六种插件，并且可以同时开启，点击评论区的Tab来体验。


## 自定义属性名

如果你的有自己的想法，可以将表头改成中文，这样的数据库也可以被NotionNext渲染成网站：

![Untitled](/legacy/5ef8286331a22107.png)


### 前提是

你要在NotionNext的 [blog.config.js](https://github.com/notionnext-org/NotionNext/blob/main/blog.config.js#L133-L144) 代码中做一些小小的配置：找到[以下代码](https://github.com/notionnext-org/NotionNext/blob/abc4a32409c9efb7a9fe527eea37c3fdba69a453/blog.config.js#L126-L135)，代码左侧是系统的默认字段名，右边则是你的Notion数据库中对应的字段名。修改代码后，你的站点就会重新生效，按照中文表头读取Notion数据库。

![Untitled](/legacy/8a095c2234a52d84.png)

<details>
<summary>或者不修改代码，在vercel的环境变量中配置也是可以的，不过修改环境变量要手动Redploy。</summary>

```Bash
NEXT_PUBLIC_NOTION_PROPERTY_PASSWORD=密码
NEXT_PUBLIC_NOTION_PROPERTY_TYPE=类型
NEXT_PUBLIC_NOTION_PROPERTY_TITLE=标题
NEXT_PUBLIC_NOTION_PROPERTY_STATUS=状态
NEXT_PUBLIC_NOTION_PROPERTY_SUMMARY=摘要
NEXT_PUBLIC_NOTION_PROPERTY_SLUG=链接
NEXT_PUBLIC_NOTION_PROPERTY_CATEGORY=分类
NEXT_PUBLIC_NOTION_PROPERTY_DATE=日期
NEXT_PUBLIC_NOTION_PROPERTY_TAGS=标签
NEXT_PUBLIC_NOTION_PROPERTY_ICON=图标
```

</details>


## 结语

感谢网友们对此项目的贡献，有遇到问题，或者新想法欢迎[提交issue](https://github.com/notionnext-org/NotionNext/issues/new/choose)。

## 原文链接

https://docs.tangly1024.com/article/notion-next-custom-properties
