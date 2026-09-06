# 网站公告
> 迁移自：[网站公告](https://docs.tangly1024.com/article/notionnext-notice)
> 发布日期：2023-5-25
> 最后编辑：2024-1-31
> 原栏目：🛠 站点配置
> 标签：NotionNext
> 摘要：NotionNext在3.10以后的版本中支持在网站中挂一个公告栏，此功能在3.14版本中完善，所有主题都已支持公告。

::: tip 提示
NotionNext 3.10以后的版本开始支持网站公告，欢迎更新体验。
添加公告后，在网站显眼的位置会固定一个页面的内容。公告内容可以是文字视频、内嵌网页等等，有很大的自定义空间。
:::


## 公告效果

最新的3.14.0版本已经支持所有主题显示公告，效果如下。

![Untitled](/legacy/36e055f2ef0f1828.png)


## 添加方式


### 前提

请升级至最新版本的NotionNext，参考升级操作指南：

[NotionNext升级操作指南 | TANGLY’s BLOG](/user-guide/update)

当NotionNext发布新版后，如何更新你的项目？

推荐版本号&gt;3.14.0，在此版本后，所有的主题都支持了公告功能的展示。


### 配置

添加一个Type（类型）为Notice的页面即可，此页面是唯一的，网站只能有一个公告。

对于展示独立公告标题的主题，Notice 页面的标题会优先作为公告标题显示；如果没有可用标题，则继续使用主题原有的「公告 / Announcement」等默认或本地化标题。

![Untitled](/legacy/56d8cd9cf2c6ec48.png)


### 公告内容示例

![Untitled](/legacy/9a3bfe7e8e822f96.png)


## 特别说明

公告的排版，在notion中的文字默认居左对齐，但是在公告中显示时会默认居中。

![Untitled](/legacy/3a453675a33038e1.png)

如需调整，可以到主题下对应的 Announcement.js 中修改 公告的样式。

![每个主题下都有一个公告组件](/legacy/860297c19e29d443.png)

- 相关代码
```HTML
&lt;div className={className}&gt;
    &lt;section id='announcement-wrapper' className="dark:text-gray-300 border dark:border-black rounded-xl lg:p-6 p-4 bg-white dark:bg-hexo-black-gray"&gt;
        &lt;div&gt;&lt;i className='mr-2 fas fa-bullhorn' /&gt;{post?.title || locale.COMMON.ANNOUNCEMENT}&lt;/div&gt;
        {post && (&lt;div id="announcement-content"&gt;
        &lt;NotionPage post={post} className='text-center' /&gt;
    &lt;/div&gt;)}
    &lt;/section&gt;
&lt;/div&gt;
```

## 原文链接

https://docs.tangly1024.com/article/notionnext-notice
