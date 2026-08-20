# Google广告营收插件
> 迁移自：[Google广告营收插件](https://docs.tangly1024.com/article/notion-next-google-adsense)
> 发布日期：2023-8-7
> 最后编辑：2024-9-7
> 原栏目：🧷 外部扩展

::: tip 提示
通过网站上对接谷歌广告接口，可以让您的网站通过广告获取一笔美金收入。
:::


## 开通验证

谷歌广告的配置开通有很多限制

1. 申请开通谷歌[Adsense](https://www.google.com/adsense/)账号

1. 验证站点所有权（必须）:请按照GoogleAdsense 后台的要求验证你的站点所有权
比较推荐的做法是，把GoogleAdsense后台提供的 `ads.txt` 文件上传到您代码的 `public` 目录下。public目录专门用来放置网站的静态文件。例如您可以访问我的博客的ads验证文件 [https://blog.tangly1024.com/ads.txt](https://blog.tangly1024.com/ads.txt)


## 配置方式

1. 获取谷歌账号的 PUB_ID 填写到[站点配置](https://github.com/notionnext-org/NotionNext/blob/9197b3c6bbcefc02e253b6c13b8c0abdc9cdb84f/blog.config.js#L331)
![Untitled](/legacy/24c727d62c3c04c5.png)

1. 在谷歌后台创建四种类型的广告单元，获取广告单元的ID
![Untitled](/legacy/450a125a54560154.png)

1. 在[代码中配置](https://github.com/notionnext-org/NotionNext/blob/9197b3c6bbcefc02e253b6c13b8c0abdc9cdb84f/blog.config.js#L333-L336)广告单元ID
![Untitled](/legacy/1cada855df1a7c22.png)


### 旧版配置广告单元

需要改动代码，而且不能嵌入到文章的指定段落。

1. 在你需要引入特定自定义广告的地方添加组件代码 &lt;AdSlot /&gt; 即可 相关[AdSlot源码](https://github.com/notionnext-org/NotionNext/blob/9197b3c6bbcefc02e253b6c13b8c0abdc9cdb84f/components/GoogleAdsense.js#L51-L95)
![Untitled](/legacy/2243297ab514eb6b.png)

1. 相关使用案例 , [Simple主题首页](https://github.com/notionnext-org/NotionNext/blob/9197b3c6bbcefc02e253b6c13b8c0abdc9cdb84f/themes/simple/index.js#L74)加入了一个原生广告单元
![Untitled](/legacy/555bcf37a684b39e.png)


## 广告插件新版用法

在 **4.4.0 **的版本后，支持您在notion中插入 **&lt;ins/&gt;** 这个代码，它将自动在网页中变成广告单元，哪里想变放哪里。

文章内容支持嵌入广告：
在想要变成广告的位置输入一行text元素，内容是

```Plain Text
&lt;ins/&gt;
```

即可替换成广告。如下图是我在notion中插入的文字&lt;ins/&gt;：

![image](/legacy/d1285e5f6384962a.png)

在博客中广告会直接显示在文章中间的位置：

![image](/legacy/19867c262a408401.png)

## 原文链接

https://docs.tangly1024.com/article/notion-next-google-adsense
