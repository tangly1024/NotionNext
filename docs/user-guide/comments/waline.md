# Waline
> 迁移自：[Waline](https://docs.tangly1024.com/article/notion-next-waline)
> 发布日期：2023-6-29
> 最后编辑：2026-5-12
> 原栏目：📩 评论插件
> 标签：Waline、NotionNext、插件

::: tip 提示
注意，本文中介绍的 LeanCloud 即将停止服务，因此文档已经过期，请参考Waline 官方文档部署
[Vercel 部署](https://waline.js.org/guide/deploy/vercel.html#%E9%83%A8%E7%BD%B2%E6%9C%8D%E5%8A%A1%E7%AB%AF)

欢迎使用 Waline，只需几个步骤，你就可以在你的网站中启用 Waline 提供评论与浏览量服务。 部署服务端 VercelVercel 点击上方按钮，跳转至 Vercel 进行 Server 端部署。 注 如果你未登录的话，Vercel 会让你注册或登录，请使用 GitHub 账户进行快捷登录。 输入一个你喜欢的 Vercel 项目名称并点击 Cr...
:::


## 1. 注册LeanCloud

Valine和Waline两个插件均要借助LeanCloud提供的云函数，云数据存储等功能，对于普通开发者来说免费版已经足够使用。

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

![Untitled](/legacy/d1361e8fe97109c2.png)

</details>


## 2.Waline部署方式

<details>
<summary>部署Waline方式1： Vercel</summary>

这种方案我目前遇到了点问题(详见下文部署踩坑部分)，问题原因是[官方代码](https://github.com/walinejs/waline/tree/main/example)不支持跨域，问题暂未解决。
<details>
<summary>Vercel踩坑说明 （点击展开）</summary>

我不确定是否你也会遇到相同的问题：
用vercel部署的评论插件，在电脑端进行评论时会提示“网络请求错误，由于CORS跨域错误，不允许请求waline服务” 。查看Vercedl后台日志则显示“响应超时”；同时，在手机端评论也提示错误“ Failed to fetch”。
产生的原因有两种
    1. URL配置错误，[https://waline.tangly1024.com](https://waline.tangly1024.com/) 结尾不能有斜杆。
    1. `Vercel`或`域名服务商`的问题导致触发了跨域限制。
![Untitled](/legacy/460fce1846c6e668.png)

</details>
  - 1. 点**[此链接](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftangly1024%2Fwaline&demo-title=WalineForNotionNext)**一键部署waline。
<details>
<summary>2. 配置环境变量 （点击展开）</summary>

    - 进入环境变量配置页面
在Vercel后台刚部署好的Waline项目中，找到 **Settings** →  **Environment Variables**：
![B60A41AC-6BC2-4F91-B3FB-FC742AD1BB27.png](/legacy/1a13c4dc8f6e6ea4.png)
    - 配置三个环境变量 `LEAN_ID`，`LEAN_KEY` ， `LEAN_MASTER_KEY` 。(它们的值分别对应上一步在 LeanCloud 中获得的 `APP ID`, `APP KEY`, `Master Key`。)，配置变量如下图：
![Untitled](/legacy/476b942890765788.png)
::: tip 提示
注意：
如果你使用 LeanCloud 国内版，请额外配置 `LEAN_SERVER` 环境变量，值为你绑定好的域名。否则可能会提示错误：”`serverURL option is required for apps from CN region`“，[详见此ISSUE](https://github.com/notionnext-org/NotionNext/issues/308#issuecomment-1157330084)。
    - 最后要`redeploy`这个项目使配置生效。
![Untitled](/legacy/4ef8e75bf93a31c6.png)
:::

</details>
<details>
<summary>3. 找到你的waline访问地址</summary>

在Vercel中找到访问Overview，可以通过Visit、或者DOMAINS下的域名访问到你的Waline服务，（当然你也可以选择自己进行域名映射）。如果有问题参阅[官方文档](https://waline.js.org/guide/get-started.html#vercel-%E9%83%A8%E7%BD%B2-%E6%9C%8D%E5%8A%A1%E7%AB%AF)，
![Untitled](/legacy/dcf5a9f9e8d3c16a.png)

</details>

</details>

<details>
<summary>部署Waline方式2： DETA</summary>

当你的Vercel服务有异常可以尝试此部署替代方案。
  - 1.点击 [一键部署](https://go.deta.dev/deploy?repo=https://github.com/walinejs/deta-starter)，未注册的需要注册登录。
  - 2.配置相关环境变量信息，点击Deploy按钮进行部署。
![Untitled](/legacy/9d5f122ebac73d2f.png)
  - 3. 部署后在后台如图右上角获取你的访问地址，将其配置到NotionNext中
![Untitled](/legacy/fc5d9259417c7cb5.png)

</details>

<details>
<summary>部署Waline方式3： Railway</summary>

此方式方式请参考博主[D_super](https://www.dsuper.xyz)的这篇文章配置《[NotionNext博客Waline评论系统](https://www.dsuper.xyz/article/waline-setting)》，文章步骤非常详尽👍

</details>

<details>
<summary>其它更多部署方式</summary>

按照官方文档，有 Vercel、Docker、Deta、CloudBase、Railway、百度云函数、阿里云函数等多种部署方式。以下我将介绍Vercel和Deta两种部署，其他的可以参阅[官方文档](https://waline.js.org/guide/server/intro.html):
[服务端介绍](https://waline.js.org/guide/server/intro.html)

除了在 Vercel 免费部署外，你可以通过 docker 进行部署或直接部署在自托管环境上。详见 独立部署 。 服务端大部分的配置可以通过通过环境变量进行配置，你也可以在主入口文件中配置一些高级选项。 有关配置的详细信息，详见 参考 → 服务端环境变量 和 参考 → 服务端配置 。 我们支持多种方式在用户评论时向用户或博主发出通知，详见 评论通知 。 我们支持社交帐号登录，目前支持 GitHub，Twitter, Facebook。 提示 我们计划在未来版本添加更多的社交应用支持，敬请期待。 除了官方默认的 LeanCloud 之外，Waline 还支持多种数据库，包括 MySQL, PostgreSQL, SQLite 以及 MongoDB。 你只需配置对应的数据库的环境变量，Waline 会自动根据你配置的环境变量切换到对应的数据存储服务。 详情请见 多数据库支持 。

</details>


### 部署完成

Waline本身是一个独立的评论页面，可以嵌入到任何网页中，例如我部署好的waline服务，映射为二级域名后地址如下：`https://waline.tangly1024.com` 。


#### Waline其他自定义配置

waline支持大量的自定义配置，请参考官方文档的说明：

[服务端环境变量](https://waline.js.org/reference/env.html#%E4%B8%BB%E8%A6%81%E9%85%8D%E7%BD%AE)

你可以通过下面的环境变量对 Waline 服务端进行配置。 注意 环境变量在更新后必须 重新部署 才能生效。 Vercel 需要在 Settings - Environment Variables 中进行设置。 等级标签 根据设置的等级条件以及用户的评论数，会为评论者增加等级标签。该功能默认关闭，可以通过配置环境变量 LEVELS 开启该功能。配置的形式为一串给定的数的逗号拼接，例如 0,10,20,50,100,200 表示的就是： 除了可以自定义等级判断规则之外，我们还可以在客户端自定义等级标签，详见 等级标签 。 默认只提供了 6 级文案，但并不表示只能有 6 个级别。具体的等级上限是根据你设置的等级判断规则来的。增加新的等级建议自己配置上等级对应的文案，没有提供文案的话默认展示的就是 Level 10 这样的默认文案。 用户注册和评论的邮件通知都会用到邮件服务。配置邮件服务相关变量后，用户注册会增加邮箱验证码确认相关的操作，用来防止恶意的注册。 提示 可以在 查看支持的服务商。 SMTP_SERVICE 和 ( SMTP_HOST、 SMTP_PORT) 任选其一即可，如果没有在列表中知道对应的 SMTP_SERVICE 的话则需要配 SMTP_HOST 和 SMTP_PORT ，它们一般可以在邮箱的设置中找到。 SMTP 的用户名通常均支持用户的完整邮箱，而密码大多同邮箱密码。 请特别注意部分邮箱 (如 163、qq 邮箱) 使用单独的 SMTP 密码。

- 垃圾评论过滤
Valine和Waline都用到akismet的垃圾评论过滤功能。在官网[https://akismet.com](https://akismet.com/account/)注册账号可以获取免费的key，
Valine需要在LeanCloud中配置`AKISMET_KEY`变量，而Waline则是在服务的后台`配置环境`变量。
![Untitled](/legacy/de44a339c36069ec.png)

- 邮件通知
推荐搭配使用 [Valine-Admin](https://github.com/DesertsP/Valine-Admin) 几分钟就可以部署管理后台，从而支持Valine和Waline的邮件通知，部署配置方式不在此文赘述，可以请参阅 官方文档中的“[**云引擎一键部署**](https://github.com/DesertsP/Valine-Admin#%E4%BA%91%E5%BC%95%E6%93%8E%E4%B8%80%E9%94%AE%E9%83%A8%E7%BD%B2)”部分.
::: tip 提示
Waline的网络请求稳定性不如Valine，而且Valine-Admin支持在LeanCloud后台中查看详细的邮件发送记录，比较便于调试和排查问题
:::

- LeanCloud后台查看邮件发送状态如下图（如果邮件发送失败也可以在这里定位错误）：
![Untitled](/legacy/f199ad33ac8d676b.png)


## 3.NotionNext中配置Waline

在**NotionNext**(版本需要≥3.3.9)中开启Waline：在Vercel环境变量中添加 一个环境变量：

`waline访问地址` 来自你上一步中部署好的Waline页面，他是一个独立的评论页面。

配置好上述变量后，重新部署即可。

## 原文链接

https://docs.tangly1024.com/article/notion-next-waline
