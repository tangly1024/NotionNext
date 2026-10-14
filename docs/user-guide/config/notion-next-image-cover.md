# 图片/封面管理
> 迁移自：[图片/封面管理](https://docs.tangly1024.com/article/notion-next-image-cover)
> 发布日期：2023-11-9
> 最后编辑：2026-10-14
> 原栏目：🛠 站点配置
> 摘要：NotionNext 修改封面图背景图等

## 网站图片如何修改

::: warning 注意
注意！网站图片的大小直接影响整点的性能。
建议在保证图片清晰可见的前提下，尽可能压缩文件大小。建议调整图片尺寸并进行压缩，有条件的推荐转换成webp格式后上传。
:::


### 上传网站头像

Notion模板中左上角的图标对应就是用户头像，可以点击 选择 `Upload an image` → `Choose an imgae` ，进行本地上传

![Untitled](/legacy/cec52dcb1346320a.png)

上传成功后会影响到各个主题的头像位置，例如Hexo的头像：

![Untitled](/legacy/00cde5291e0e6480.png)


### 修改站点封面图

像hexo、matery这两个主题的首屏就是用户的封面图片

![Untitled](/legacy/b504a733d6ec1470.png)

修改方式如下：

Notion笔记中上方封面图的右侧，点击`Change cover`

![Untitled](/legacy/c79d93e87daae82f.png)

您可以选择notion自带的Gallery画册、或者上传自己的图片，或者使用Link外部链接，以及Notion推荐的Unsplash图库

![Untitled](/legacy/d07205dfc7630da1.png)


### 文章的封面图

和修改网站的封面图类似的操作，点击上方的`change cover` 即可；修改后会同步到博客列表中的图片（如后一张图）

![Untitled](/legacy/c07a9ef55fe7f11d.webp)
![Untitled](/legacy/652f716d3c3a74c7.png)

博客封面优先读取Notion中的文章封面，若Notion中文章设置封面为空，则会显示`RANDOM_IMAGE_URL` 的内容。

如果没有设置封面，此时会显示添加封面（Add Cover）按钮。

![image.png](/legacy/c76efc1fff8acbe6.png)

在修改封面的功能中，可以点击移除(Remove)从而移除封面。

![image.png](/legacy/b060b667b3c5b3c5.png)


### 使用外部链接的技巧

您可以在Notion中将封面设置为一个link类型，只想随机图片的api地址时，网站打开后会动态获取随机封面；若不同文章用的同一个随机api作为封面地址，每篇文章的封面也是不同的。

示例：


#### unsplash 随机api

Unsplash Source（`https://source.unsplash.com/random`）已于 2021 年 11 月 25 日宣布弃用，并于 2024 年 6 月 11 日发布最终下线公告。目前该接口已不再受官方支持，也不建议继续使用，详见 [Unsplash API Changelog](https://unsplash.com/documentation/changelog)。

现在更推荐使用 Notion 原生 Unsplash：打开页面后点击 `添加封面（Add cover）`，再点击封面右上角的 `更改（Change）`，在弹出面板最右侧选择 `Unsplash`，搜索并选择图片即可。

如需通过 API 使用 Unsplash 图片，请使用官方 [Unsplash API](https://unsplash.com/developers) 获取图片 URL（需要申请 Access Key），再将返回的图片地址设置为 Notion 封面。对于普通博客，也可以直接上传封面，或使用固定图片 URL、自有存储/CDN，以保证封面稳定。

> 以下为接口下线前的原有说明，仅作历史记录：
>
> 我将每个封面图设置为：[https://source.unsplash.com/random](https://source.unsplash.com/random)；这是 **Unsplash** 提供的随机图片链接，每次打开都会跳转到不同的图片。（当前接口已停止服务）
>
> **Unsplash** 当时可以指定图片的风格类型、作者等，更多帮助可以参考此文：[https://zhuanlan.zhihu.com/p/139132649](https://zhuanlan.zhihu.com/p/139132649)
>
> ![image](/legacy/dea5b128580f4605.png)
>
> 在网站中看到的图片效果，刷新页面后封面图会重新生成。
>
> ![image](/legacy/4f466eb1e78dbb6e.png)
> ![image](/legacy/7ae027b6040b432c.png)

除了unsplash的api，也支持任意随机图片的api，例如这个国人开发的[图片api](https://tuapi.eees.cc/)


### eees国产随机图片API

将封面设置为图片api地址： [https://tuapi.eees.cc/api.php?category=dongman&type=302](https://tuapi.eees.cc/api.php?category=dongman&type=302)

关于此api的使用方式，可参考官方说明 [https://tuapi.eees.cc/](https://tuapi.eees.cc/)

![image](/legacy/bd11977e02a861e3.png)

效果l如下

![image](/legacy/8c4bea09d4352f01.png)
![image](/legacy/aca57b7a530ccc7a.png)

![image.png](/legacy/cc35b0283ed2f202.png)

## 常见问题

### 随机封面图不生效

先确认配置位置。`RANDOM_IMAGE_URL` 目前只支持文件配置或部署环境变量，例如：

```text
NEXT_PUBLIC_RANDOM_IMAGE_URL=https://example.com/random-image
NEXT_PUBLIC_RANDOM_IMAGE_NOT_REPLACE_TEXT=images.unsplash.com
```

它不会从 Notion Config 中读取。

再检查文章自己的封面。如果文章已经设置了普通自定义封面，NotionNext 会优先使用这张图，不会强制替换成随机图。想让随机图生效，可以移除文章封面，或把封面设置成会被 `RANDOM_IMAGE_NOT_REPLACE_TEXT` 命中的图片地址。

如果所有文章都显示同一张随机图，通常是随机图片 API 被缓存。NotionNext 会自动给图片 URL 追加文章 ID 参数，但部分图片服务会忽略这个参数；这种情况需要换一个支持按 query 返回不同图片的 API。

## 原文链接

https://docs.tangly1024.com/article/notion-next-image-cover
