# 验证码解锁文章OpenWrite/TechGrow
> 迁移自：[验证码解锁文章OpenWrite/TechGrow](https://docs.tangly1024.com/article/wechat-offical-account)
> 发布日期：2024-9-5
> 最后编辑：2026-4-30
> 原栏目：🔊 运营教程

::: warning 注意
~~OpenWrite停止此项服务，公众号引流的方案失效了，因此以下文章内容已过期。~~
新版本引入 TechGrow方案进行验证码解锁：
感謝[大佬](https://github.com/yunhe-dev)的[https://yunhe.dev/](https://yunhe.dev/)提交：[https://github.com/notionnext-org/NotionNext/pull/3826](https://github.com/notionnext-org/NotionNext/pull/3826)
使用体验和OpenWrite一致，页面显示查看更多按钮，用户点击后需要关注公众号查看内容：
![05059467ede12063fcbfb0d7bb619f58.png](/legacy/1babe0067f81a105.png)
![image.png](/legacy/17f98076ad7a917b.png)
:::


## 参考官方文档

先登录注册TechGrow并创建一个网站，获取BlogID

[TechGrow 开放平台](https://open.techgrow.cn/)

专注于自媒体引流的免费开放平台。

其次在公众号后台关键词回复：

[主流博客 | TechGrow 官方文档](https://docs.techgrow.cn/v2/wechat/tutorial/common/#%E7%AC%AC%E4%BA%8C%E6%AD%A5-%E8%AE%BE%E7%BD%AE%E5%85%AC%E4%BC%97%E5%8F%B7)

博客引流微信公众号

最后在NotioNext配置中心加入4个必要配置


### TechGrow 配置说明

（详细可见代码 `**/conf/techgrow.config**` ）。

在 Notion 的 Config 页面可直接用同名键配置（优先于 `blog.config.js`）：

必填：(这里的配置和以前的OpenWriteE几乎完全一致，老用户只要将 `OPEN_WRITE `替换成 `TECH_GROW`即可)

常用（选填）：

- `TECH_GROW_ARTICLE_CONTENT_ID`（默认 `notion-article`）

- `TECH_GROW_BTN_TEXT`

- `TECH_GROW_VALIDITY_DURATION`（小时）

名单规则：

- `TECH_GROW_WHITE_LIST`：这些路径放行

- `TECH_GROW_YELLOW_LIST`：仅这些路径启用拦截（优先级高于白名单）

在`TechGrow`后台创建博客后，可以在 “使用” 按钮中找到相应的操作：

![image.png](/legacy/eef1179417712554.png)

---

---

以下是OpenWrite时期留下的文档，体验与TechGrow完全一致，需要注意把所有域名中带openwrite的部分都替换成 techgrow


## 如何解锁

在阅读文章详情时，默认会隐藏掉一半的文章内容，后半段需要解锁观看。

1. 点击文章底部的“原创不易，完成人机验证，阅读全文“
![image.png](/legacy/f6165fc5edf5ff76.png)

1. 在弹出的对话框中，可以看到引导提示：在微信中搜索公众号名，或扫码关注公众号
![image.png](/legacy/fa9bcaa24ca3b187.png)

1. 在公众号，点击左下角“验证码”；（或直接在聊天框发送“验证码”）。
![image.png](/legacy/3229a472d9989ad1.png)
公众号会推送一个链接，访问链接即可看到验证码
![image.png](/legacy/d7d8ddd943773c96.png)

1. 回到网页中输入验证码，并点击提交即可
![image.png](/legacy/6c96f5ab1509bf8b.png)

::: tip 提示
  - 目前已支持所有主题，验证码只需要输入一次，即可解锁全站访问。
  - 需要更新到4.7.0的版本之后才支持本功能。
:::

::: tip 提示
本功能由[自动驾驶小白说](https://www.helloxiaobai.cn/about)倾情赞助。
![9a9d5135-ccdb-4c3e-aa57-4912b75d87a6.png](/legacy/c532f06c53ec0bc6.png)
[自动驾驶小白说](https://www.helloxiaobai.cn/about), 输出专业自动驾驶算法教程的开发者社区. 🦈
:::


## NotionNext配置说明

::: tip 提示
在2025-01-19的版本后加入了黄名单配置，设置后只锁定部分文章
:::

在您的Notion配置中心添加以下配置，即可在网页上激活文章验证码解锁功能

要实现这个配置，你需要先注册OpenWrite平台，获取blogId，并且设置一个用于回复的关键词绑定。


## 配置的ID从哪里来

1. 进入 Open Write 页面：
  - 注册：**[http://admin.openwrite.cn/](http://admin.openwrite.cn/)**
  - 登录：**[https://readmore.openwrite.cn/login](https://readmore.openwrite.cn/login)**

1. 「配置页面」-&gt;「添加博客」
![readmore-1.png](/legacy/82f7f6a47ab6385a.png)

1. 根据提示填写你的信息，之后就会生成整合方案
![readmore-4.png](/legacy/c0bec2ce3091011f.png)


### 关键步骤

1. 我们需要记录这里的`blogId`这个参数，即上图中`blogId`后面`打马赛克`的部分。

1. 按照提示需要在公众号后台设置**关键词回复**。


## 公众号二维码图片哪里来？

1. 在**公众号**管理中心，找到并点击“设置”，找到“账号信息”

1. 在账号信息页面，找到“**二维码**”，然后点击“更多尺寸”

1. 进入更多尺寸的页面，会呈现出常用的**二维码**尺寸，和建议扫描的距离，根据需要，选择下载，即可获得相应的**公众号二维码**。


## 公众号关键词回复如何设置？

公众号后台找到 ： 自动回复→关键词回复→添加回复

![image.png](/legacy/3f86711721ed6fce.png)

参考我的配置如下：

![image.png](/legacy/bba7c284aabc4503.png)

::: tip 提示
自动回复的内容中，最重要的就是要带上Openwrite后台提供的验证码链接，用户点击此链接后可以获得验证码，示例：

**&lt;a href="https://readmore.openwrite.cn/code/generate?****blogId****=****xxxxx****"&gt;点此链接，获取博客解锁验证码&lt;/a&gt;
**
注意，这里每个人的链接是不同的，特别是blogId这个参数。
:::


## 参考

OpenWrite官方文档：

[博客导流公众号](https://openwrite.cn/guide/readmore/readmore.html)

做最懂自媒体的工具平台

## 原文链接

https://docs.tangly1024.com/article/wechat-offical-account
