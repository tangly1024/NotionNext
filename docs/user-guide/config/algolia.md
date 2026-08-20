# Algolia搜索引擎
> 迁移自：[Algolia搜索引擎](https://docs.tangly1024.com/article/notion-next-algolia)
> 发布日期：2023-7-30
> 最后编辑：2026-5-2
> 原栏目：🧷 外部扩展
> 摘要：NotionNext如何配置Algolia

::: info 问题
NotionNext4.0 系列支持algolia全文搜索
这样即使你的站点是纯静态部署，也可以支持全文搜索。
:::


## 什么是Algolia

Algolia是一家提供全文搜索和实时搜索解决方案的云服务提供商。它专注于提供高效、快速和可定制的搜索功能，为网站和应用程序提供强大的搜索体验。

将Algolia添加到博客中有以下几个好处：

1. **强大的搜索性能**：Algolia提供快速的搜索响应时间和高效的搜索算法，能够在大规模数据集上实现实时搜索。这意味着您的博客读者可以快速找到他们感兴趣的内容，提升用户体验。

1. **智能搜索功能**：Algolia具有先进的搜索功能，包括拼写纠正、近义词处理、相关性排序等。它能够理解用户的意图并提供准确的搜索结果，即使用户输入的关键词拼写有误或者使用了近义词。

1. **定制搜索体验**：Algolia提供了丰富的API和工具，使您能够定制搜索结果的外观和行为。您可以根据自己的需求自定义搜索结果的排序方式、过滤器、标签和高亮显示等，以满足您的博客特定的搜索需求。

1. **可扩展性和稳定性**：Algolia是一个可扩展和可靠的云服务提供商，能够处理高并发的搜索请求并保持良好的性能。无论您的博客访问量增长到何种规模，Algolia都能够处理并提供稳定的搜索服务。

综上所述，安装Algolia可以提升您的博客搜索功能，为读者提供更好的搜索体验，并提高内容的可发现性和可访问性。


### 关于资费

免费方案，每月10000次搜索请求，存放10000条数据，普通百姓够用了。

![Untitled](/legacy/6ef826c1cace6835.png)


## 如何开启Algolia搜索

::: info 问题
~~目前只有HEO主题支持Algolia搜索弹框
~~所有主题已支持Algolia
:::

只需在部署平台的环境变量中添加以下四项配置即可开启，相关配置可参考仓库 [conf/plugin.config.js](https://github.com/notionnext-org/NotionNext/blob/main/conf/plugin.config.js)。

在algolia后台可以查询到 apikey相关参数，[https://dashboard.algolia.com/account/api-keys/](https://dashboard.algolia.com/account/api-keys/)

接下来我将详细展示注册使用Algolia的步骤。


## 配置Algolia


### 1. 注册

点击下方链接注册

[Sign in](https://dashboard.algolia.com/users/sign_in)

Algolia's Search API makes it easy to deliver a great search experience in your apps & websites. Algolia Search provides hosted full-text, numerical, faceted and geolocalized search.

任选方式注册，我这里演示用github一键登录

![Untitled](/legacy/94b0fe3df2ea1f61.png)


### 2. 首次登录配置

<details>
<summary>旧版本页面已废弃</summary>

通常会跳到这个引导页面，提示您创建您的第一个数据库，这里我演示填写 demo作为数据库名，并点击Create index 创建。
![Untitled](/legacy/b0e00a87de78f378.png)
第二步，Algolia会提示您上传数据，这里我们不用上传，NotionNext会自动在您创建修改文章时创建。
![Untitled](/legacy/a2cc131f41df2da5.png)

</details>

Algolia新版本首次登录打开会自动跳转到另一个版本的引导页面会强制要求你导入初始数据。

解决方法是点击右上角的Skip now，

![image.png](/legacy/9072aafdc421f5f0.png)

或者直接访问这个链接：

[https://dashboard.algolia.com/account/overview](https://dashboard.algolia.com/account/overview)

在左侧菜单栏找到数据库→Indices→Create Index创建你的数据库，创建好后进入下一步获取API-Keys。

![image.png](/legacy/aa3db3cd90f77dce.png)

![image.png](/legacy/6f8e85a2316af0db.png)


### 3. 获取API-keys

点击左下角设置，然后在设置页面右上角找到API Keys

![Untitled](/legacy/65fd86d9bb2d07e9.png)


#### 获取三个重要参数

![Untitled](/legacy/86cc8ec92803f0ba.png)

最右侧可以点击复制秘钥，这三个秘钥对应NotionNext后台环境变量如下：


## 完成配置

在vercel后台填写这四个配置后，重新 Redeploy 即可。

![Untitled](/legacy/e63489d626c19dae.png)

在访问页面时，会自动生成文章的索引

![Untitled](/legacy/521c2a4575b942fc.png)

## 原文链接

https://docs.tangly1024.com/article/notion-next-algolia
