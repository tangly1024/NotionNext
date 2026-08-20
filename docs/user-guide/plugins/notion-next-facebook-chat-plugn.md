# Facebook聊天插件[已失效]
> 迁移自：[Facebook聊天插件[已失效]](https://docs.tangly1024.com/article/notion-next-facebook-chat-plugn)
> 发布日期：2023-8-4
> 最后编辑：2024-9-21
> 原栏目：🧷 外部扩展

## 通知

::: tip 提示
Facebook 官方宣布：从 2024 年 5 月 9 日起，聊天插件将不再可用。

可以选择使用[SaleSmartly 插件](/user-guide/plugins/notion-next-salesmatly-pulgin)作为页面聊天客服。
:::


## 文档

以下是旧文档

::: tip 提示
最后更新域于0230906， 修改了原文档中第四点，获取PAGE_ID的方式；用原先方法获取的PAGE_ID，将导致聊天插件加载失败。
:::

::: tip 提示
FaceBook 官方提供的聊天插件，可以方便您与访客实时聊天。
:::

> 全程大约10分钟，即可获得你的facebook插件。


## 使用效果

网页`右下角`弹出一个聊天框，用户可以与站长聊天，可以选择访客匿名、或登录Facebook的Messenger。

![Untitled](/legacy/4bc58535ac58be89.png)
![Untitled](/legacy/aa454314fa5bd758.png)

站长在pc端的后台，或者app上都可以事实查看消息

![Untitled](/legacy/47600214d95d8abb.png)
![Untitled](/legacy/2994063b03dd32f2.jpg)


## 配置方式

在NotionNext后台添加两个环境变量即可开启FBChat插件 ， 对应配置文件路径 [blog.config.js](https://github.com/notionnext-org/NotionNext/blob/70cc96d8f16e71abc8a21e777c4b984680ab5a4b/blog.config.js#L99-L100) 。

这两个参数如何获得，请阅读下方的注册方法部分。


## 开通方法

注册并登录您的facebook账号

[https://www.facebook.com/login/](https://www.facebook.com/login/)


### 一、开通你的公共主页

facebook上创建一个公共主页很简单，按照步骤创建好主页后，即可获得你的`PAGE-ID`

1. 点击页面左侧的公共主页
![Untitled](/legacy/2182aa8629406609.png)

1. 点击新建公共主页
![Untitled](/legacy/366af337d160e55f.png)

1. 填写资料完成注册
填写完成后，会引导你完成一些基础的主页配置，自行选择配置即可。
![Untitled](/legacy/2acc8f75747b5c64.png)

1. 如何获取`PAGE_ID`
  - 原先获取PAGE_ID的方式是错误的：
~~完成后，按照提示返回主页。在你的公共主页地址栏URL中可以看到你的 ~~`~~PAGE_ID~~`~~；例如此处我的PAGE_ID 就是 ~~~~`100095411623547`~~
<details>
<summary>错误截图</summary>

![Untitled](/legacy/e365517c5a367f0a.png)

</details>
正确方式，在公共主页左侧点击`设置` → 点击`品牌内容`
![Untitled](/legacy/15b9d7b2bf8b3ec5.png)
![Untitled](/legacy/af5c89c30b3f234a.png)
点击品牌内容后跳转的页面中就包含了页面ID PAGE_ID 参数，此处我的PAGE_ID是`100411122875215`
![Untitled](/legacy/049e5d6f1c234562.png)

1. 配置白名单
为了让您的网站允许使用该公共主页的messenger功能，需要如下配置：
点击右上角头像 → 设置与隐私 →  设置 ； 来到你的设置中心
![Untitled](/legacy/e223ec35c281cd22.png)
![Untitled](/legacy/5d22924c2a61a0c7.png)
设置中心左侧点击新版公共主页体验
![Untitled](/legacy/be5a25a43b44fe76.png)
在新版公共主页体验中，点击高级消息功能，并输入您的站点域名，点击添加即可。
![Untitled](/legacy/447f67a64a860c90.png)


### 二、开通开发者权限

完成此步骤，你就能获得自己的专属应用id，用此id可以调用facebook的功能

1. 点击下方链接，申请开发者
[https://developers.facebook.com/async/registration](https://developers.facebook.com/async/registration)

1. 点击继续
并按照要求验证手机号和邮箱
![Untitled](/legacy/9e0715412f44815f.png)

1. 最后一步，完成注册
这里选择你的属性，可以任选，不影响后续操作
![Untitled](/legacy/9e2c61cbc3fa2d66.png)

1. 创建一个应用
注册完成自动会来到此开发者首页，您以后也可以随时访问 [https://developers.facebook.com/apps/](https://developers.facebook.com/apps/) 来查看您的应用。
点击创建
![Untitled](/legacy/56abf47819f8bfe2.png)

1. 配置应用
选择facebook，点击继续
![Untitled](/legacy/7496b9fd51e54fe3.png)
填写完应用名字，直接点击创建应用即可。
![Untitled](/legacy/169699be945c3d78.png)

1. 获取`APP_ID`
在应用首页即可看到
![Untitled](/legacy/1f77013698ca8111.png)


## 完成

至此，你已经获取到了`APP_ID`和`PAGE_ID`。

在NotionNext后台添加两个环境变量即可开启FBChat插件 ， 对应配置文件路径 [blog.config.js](https://github.com/notionnext-org/NotionNext/blob/70cc96d8f16e71abc8a21e777c4b984680ab5a4b/blog.config.js#L99-L100) 。


## 关于Facebook后台设置

您可以在facebook后台设置这个聊天插件的预设回复，营业时间等等属性，这里不做赘述。

配置入口：在您的facebook公共主页的设置菜单中，点击 [Meta Business Suite](https://business.facebook.com/) （商务套件）。

![Untitled](/legacy/ad1efd1ddb96900f.png)


### 商务后台页面

除了上面的入口，你也可以直接访问右边链接 [https://business.facebook.com/](https://business.facebook.com/)

后台可以查看所有和你聊天的信息，右上角可以配置对应的自动回复等功能，和微信公众号类似。

![Untitled](/legacy/dd37079f2aa603b5.png)

同时，后台也支持您自定义插件的样式、位置、以及自动回复的内容~

![Untitled](/legacy/e88732bbca36d260.png)


### 客户端

这个功能使用的是Facebook的Messenger聊天工具，你可以下载一个Facebook、或者Messenger、或者和我一样下载一个 Business Suite (facebook的运营全家桶)。

![Untitled](/legacy/45bde7054588ffeb.jpg)


## 参考

- 官方介绍
[https://developers.facebook.com/docs/messenger-platform/discovery/facebook-chat-plugin](https://developers.facebook.com/docs/messenger-platform/discovery/facebook-chat-plugin)

- React插件代码
[https://github.com/Yoctol/react-messenger-customer-chat](https://github.com/Yoctol/react-messenger-customer-chat)

## 原文链接

https://docs.tangly1024.com/article/notion-next-facebook-chat-plugn
