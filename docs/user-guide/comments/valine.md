# Valine
> 迁移自：[Valine](https://docs.tangly1024.com/article/notionnext-valine)
> 发布日期：2022-5-27
> 最后编辑：2024-1-31
> 原栏目：📩 评论插件
> 标签：NotionNext、插件、Valine
> 摘要：Valine插件需要LeanCloud后端提供数据库存储功能，请按照以下步骤配置。

## 关于

Valine和Waline都是支持云函数部署的快速、简洁的评论系统，理论上支持但不限于静态博客。

其中Waline 是从 Valine 衍生的带后端评论系统，可以看作是Valine的升级版，具备更多Valine不支持的功能，两者的数据结构是可以兼容的，你甚至可以同时安装Valine和Waline，两者的评论互通。

![Untitled](/legacy/ed1068911df67d07.png)

本文主要介绍LeanCloud+Vercel的部署方案教程；另外，您也可以下面这篇Zeabur方案的部署教程，体验也很方便顺滑：

> [**Zeabur**](https://zeabur.com/) 是一个帮助开发者们可以一键部署自己的服务的平台。整体和 Railway 比较类似，但是比它多了更多的功能，不需要绑定信用卡，免费额度也要比它高。

[Zeabur 部署](https://waline.js.org/guide/deploy/zeabur.html)

Zeabur (https://zeabur.com) 是一个帮助开发者们可以一键部署自己的服务的平台。整体和 Railway 比较类似，但是比它多了更多的功能，不需要绑定信用卡，免费额度也要比它高。 如何部署 点击 Fork (https://github.com/walinejs/zeabur-starter/fork) 按钮创建 Zeabur 启...


## 1. 注册LeanCloud

两个插件均要借助LeanCloud提供的云函数，云数据存储等功能，对于普通开发者来说免费版已经足够使用。

::: tip 提示
若您使用的是Zeabur的部署方案，则不需要额外注册一个LeanCloud。
:::


### 获取APP ID 和 APP Key

<details>
<summary>1.请先[登录](https://leancloud.cn/dashboard/login.html#/signin)或[注册](https://leancloud.cn/dashboard/login.html#/signup) `LeanCloud`, 进入[控制台](https://leancloud.cn/dashboard/applist.html#/apps)后点击左下角[创建应用](https://leancloud.cn/dashboard/applist.html#/newapp)：</summary>

![image](/legacy/f4ffa7172a352d5c.jpg)

</details>

<details>
<summary>2.进入刚刚创建的应用，选择左下角的`设置`&gt;`应用Key`，查看你的`APP ID`和`APP Key`。</summary>

![Untitled](/legacy/fd532d4e76f2541d.png)

</details>


## 2.NotionNext中配置VALINE

获取上述的`appId`、`appKey`等参数后，就可以直接在NotionNext（版本≥3.3.9）中激活valine了，**如果不想使用Valine可以直接跳到文章下一节《Waline部署》部分。**

在NotionNext的Vercel环境变量中配置以下内容：

<details>
<summary>环境变量配置示例：</summary>

![Untitled](/legacy/e793e5a6ab12947c.png)
![Untitled](/legacy/acb62c9761fad928.png)

</details>

<details>
<summary>`NEXT_PUBLIC_VALINE_SERVER_URLS` 说明</summary>

此参数选填，在应用内部会尝试自动获取，如果发现获取失败，请手动提供配置，配置方法：
在LeanCloud刚创建的应用中，选择左下角的`设置`&gt;`应用Key`，找到`Request 域名` 第一行： 注意，需要手动在域名前加上 `https://` 否则会无法访问valine评论。
![Untitled](/legacy/da10f2619c32793f.png)

</details>

::: tip 提示
完成配置后重新部署一下Vercel项目即可生效。
:::


### 其它可选的Valine配置

<details>
<summary>安全域名（可选） 点击展开</summary>

leanCloud支持设置自己的`安全域名`，设置后，仅列表中配置的域名才可以访问你的服务。例如我只在博客中用到valine服务，那么我的安全域名只需要配置为 /user-guide/intro。
![Untitled](/legacy/e25b923373344e12.png)

</details>

<details>
<summary>部署valine后台（可选）点击展开</summary>

valine没有自带后台，可以借助 [Valine-Admin](https://github.com/DesertsP/Valine-Admin) 几分钟就可以部署一个管理后台，支持行评论的查看、删除，以及邮件通知，垃圾评论过滤等功能。部署方式不在此文赘述，可以请参阅 官方文档中的“[**云引擎一键部署**](https://github.com/DesertsP/Valine-Admin#%E4%BA%91%E5%BC%95%E6%93%8E%E4%B8%80%E9%94%AE%E9%83%A8%E7%BD%B2)”部分.

</details>


## Q&A

1. 博客底部没有显示评论
  - 可能是NotionNext版本不是最新，请更新项目；
  - 可能是Vercel后台没有配置Valine/Waline的环境变量，配置后需要redeploy

1. 评论出现 ‘Unexpected end of JSON input’
配置的Waline地址有误，检查一下，参考此[issue](https://github.com/notionnext-org/NotionNext/issues/308)的回答

1. 评论出现错误提示 ‘fail to fetch’ 或者 ‘Network Error’
可能是Vercel部署的Waline出现了跨域网络限制，按F12打开控制台，查看是否有打印“缺少CORS头“，相关的错误提示。
解决办法：换DETA部署试一下。


## 更多

最新版本已经支持Twikoo评论插件，欢迎体验

[小唐笔记📒 | loading](/user-guide/comments/twikoo)

记录思考、分享编程技术

其他评论部署方式参考

[NotionNext如何添加评论插件 | TANGLY's BLOG](/user-guide/comments/overview)

NotionNext添加Cusdis/Giscus/Gitalk/Utterance的步骤教程

[https://source.unsplash.com/random/720x480/?encryption](https://source.unsplash.com/random/720x480/?encryption)

## 原文链接

https://docs.tangly1024.com/article/notionnext-valine
