# Mailchimp邮件订阅
> 迁移自：[Mailchimp邮件订阅](https://docs.tangly1024.com/article/notion-next-mailchimp)
> 发布日期：2023-7-4
> 最后编辑：2024-9-12
> 原栏目：🔊 运营教程

::: tip 提示
此功能主要针对国外用户的使用习惯开发。国内推荐使用公众号导流方案。
:::


## 序

NotionNext 后续版本将陆续支持Newsletter功能，目前基于Mailchimp邮件订阅，可以轻松实现您与读者建立紧密的链接。

按照本操作步骤，将为您创建一个Mailchimp的api-key以及对应的邮件列表id，便于您通过接口，对接自己的页面表单。

::: tip 提示
目前只有landing主题上支持了 Mailchimp的ui组件，后续将在其它主题中  也加入对应的UI组件。
预览体验：访问[NotionNext主页](/user-guide/intro)，在底部的邮件订阅处填写您的邮箱体验。
:::


### 什么是Mailchimp

MailChimp是目前最通用且易于使用的 电子邮件营销服务.

MailChimp 为您提供一个免费帐户，最多可拥有 2000 个电子邮件订阅者，每月发送 12000 封电子邮件，在给定的 2000 小时内限制为 24 封电子邮件。 这个限制对于任何初学者以及中级博主和营销人员来说都非常好。


## 操作步骤

你可以按照以下步骤在 Mailchimp 中找到你的邮件列表 ID 和 API KEY：

1. 登录你的 Mailchimp 账户，点击右上角的用户名，然后选择 "Account" 进入账户设置页面。

1. 在账户设置页面中，点击 "Extras" 选项卡，然后选择 "API keys"。
![Untitled](/legacy/4978e7a37b4da5c2.png)

1. 在 API keys 页面中，可以看到你现有的 API KEY 列表。如果没有 API KEY，请点击 "Create A Key" 按钮创建一个新的 API KEY。
![Untitled](/legacy/f42fd7e5c5aa57f1.png)
![Untitled](/legacy/d70110572d0258cf.png)

1. 复制你的 API KEY，并妥善保管。

1. 点击 "Audience" 选项卡，然后选择你要用来存储用户邮件地址的列表。
![Untitled](/legacy/a477adb79d48c463.png)

1. 在该列表的设置页面中，可以看到该列表的唯一 ID。复制该 ID。
![Untitled](/legacy/f53b8a9c99961057.png)


## 最后

现在你已经找到了你的 Mailchimp 邮件列表 ID 和 API KEY。将它们替换到你的代码中即可开始使用 Mailchimp API 来收集用户邮件地址了。

只需要在Vercel环境变量中添加两项配置，就可以实现网站的邮件订阅功能

新订阅请求需要邮箱持有人通过 Mailchimp 确认邮件完成订阅。页面显示“Subscription request received…”表示请求已经处理；为保护邮箱隐私，重复提交也会显示相同提示，不会自动恢复已退订成员。未收到确认邮件时，请检查垃圾邮件目录，或通过站点所有者提供的 Mailchimp 订阅表单重新订阅。

新订阅从原来的直接 `subscribed` 改为等待确认的 `pending`。升级后，请提醒读者完成确认邮件，并在 Mailchimp 后台确认订阅状态；页面接收成功提示不等于已加入正式收件名单。

Mailchimp 对永久删除等少数地址状态可能拒绝请求，此时页面仍会显示失败。新请求与 `Member Exists` 使用相同提示，但其他上游 400 仍返回 HTTP 400，不能据此认为所有邮箱状态都已隐藏。详细返回规则见 [Mailchimp 邮件订阅接口](../../developer/MAILCHIMP_SUBSCRIBE.zh-CN.md)。

## 原文链接

https://docs.tangly1024.com/article/notion-next-mailchimp
