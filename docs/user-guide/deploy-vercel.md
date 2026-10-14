# Vercel 部署 NotionNext
> 迁移自：[Vercel部署NotionNext](https://docs.tangly1024.com/article/vercel-deploy-notion-next)
> 发布日期：2023-2-10
> 最后编辑：2026-5-2
> 原栏目：🚀 安装部署
> 标签：NotionNext、部署方案
> 摘要：Vercel是一款国外的Serverless托管平台，对个人用户使用几乎免费，而且方便快捷，用Vercel托管你的Notion站点，无需再操心服务器的维护与资费问题。

## 前言

遵循此教程您将在[Vercel](https://tangly1024.com/article/vercel)上免费搭建一个[NotionNext](/user-guide/intro)博客。

::: info 问题
[NotionNext](/user-guide/intro)是一个开源站点系统，可以把你的 Notion 内容发布为博客、作品集、知识库、导航站或产品官网。

Vercel是一个来自国外的在线脚本托管平台，对于个人使用，其免费版已经完全足够，因此您无需购买服务器即可搭建自己的网站。
:::

站点效果预览→：[https://preview.tangly1024.com/](https://preview.tangly1024.com/) , 站点左下角图标点击可以体验主题切换：

![image.png](/legacy/a83043dbc31d736e.png)

想查看更多网站搭建效果，欢迎访问友情链接：[https://blog.tangly1024.com/links](https://blog.tangly1024.com/links)


### 部署步骤

部署站点只需三步，分别是：

1. 复制官方 Notion 模板

1. Fork 官方 GitHub 仓库

1. 在 Vercel 中一键部署

部署文档已经过大量站长实践验证。若无法完成独立部署，先查看 [获取帮助](/user-guide/help/) 中的社区支持和付费协助说明。


### 视频帮助

**我录了一个1分38秒的简略视频**，演示了整个部署过程，最终以文档为主。

<div class="legacy-video-embed">
  <iframe
    src="https://player.bilibili.com/player.html?aid=913088616&bvid=BV1fM4y1L7Qi&cid=1203316294&page=1"
    title="NotionNext Vercel 部署演示视频"
    loading="lazy"
    allowfullscreen
  ></iframe>
</div>

- 另外有 YouTube 网友也分享了部署过程，可以参考：

<div class="legacy-bookmark-list">
  <a class="legacy-bookmark-card" href="https://www.youtube.com/watch?v=zWlPyDQCkrk" target="_blank" rel="noreferrer">
    <span class="legacy-bookmark-content">
      <strong>将您的 Notion 笔记变为博客站，所有文章的编写发布都只在您的 Notion 笔记中完成</strong>
      <span>Maple Tech 分享的 NotionNext 建站与 Vercel 部署过程。</span>
      <small>youtube.com/watch?v=zWlPyDQCkrk</small>
    </span>
    <img src="https://i.ytimg.com/vi/zWlPyDQCkrk/maxresdefault.jpg" alt="NotionNext YouTube 部署教程封面" loading="lazy" />
  </a>

  <a class="legacy-bookmark-card" href="https://www.youtube.com/watch?v=AbI70b9KfXE" target="_blank" rel="noreferrer">
    <span class="legacy-bookmark-content">
      <strong>零基础入门 NotionNext 网站搭建、个人博客、网站快速搭建部署教程</strong>
      <span>404 实验室分享的零基础 NotionNext 网站搭建教程。</span>
      <small>youtube.com/watch?v=AbI70b9KfXE</small>
    </span>
    <img src="https://i.ytimg.com/vi/AbI70b9KfXE/maxresdefault.jpg" alt="零基础 NotionNext YouTube 教程封面" loading="lazy" />
  </a>
</div>

## 一、创建您的Notion页面


### 复制模板

1. 请先注册登陆您的[Notion](https://www.notion.so/)账号。

1. 点击下方链接，打开模板
[Notion Blog](https://tanghh.notion.site/02ab3b8678004aa69e9e415905ef32a5)

一个NotionNext搭建的博客

1. 在右上角点击**Duplicate**复制模板，如图所示。点击后会将这个博客数据模板复制到您的笔记空间中。
![点击右上角的Duplicate，将模板复制到您的笔记中](/legacy/b6b81e01d512a122.png)


### 获取页面ID

1. 在Notion笔记中：在页面右上角的菜单栏中，依次点击**Share**→**Published**→**Share To Web，**开启页面分享，获取**共享链接**
  - 如下图所示，点击右上角 **Share ，**在弹出窗口中点击 **Publish **→ **Share to web**  (点击展开截图)
![Untitled](/legacy/529223fa2a1ffd16.png)

1. 复制**页面ID**
页面ID在您的共享链接中、域名中间的一串**32位字母与数字**。
  - 如下图所示：
![Untitled](/legacy/3be621dcdd736f88.png)
  - 页面ID注意

> **如何识别页面ID**
>
> 页面 ID 是 Notion 共享链接中那段**连续 32 位的字母和数字**。只复制这 32 位字符串即可，不要复制 `?v=`、`?pvs=` 以及它们后面的参数。
>
> 示例一：
>
> `https://www.notion.so/tanghh/02ab3b8678004aa69e9e415905ef32a5?v=b7eb215720224ca5827bfaa5ef82cf2d`
>
> 这里的页面 ID 是：
>
> `02ab3b8678004aa69e9e415905ef32a5`
>
> 示例二：新版 Notion 可能会把页面标题放进链接里，例如：
>
> `https://www.notion.so/tanghh/Today-261c36d269a74acd97682af86d7bc9a0?pvs=4`
>
> 这里的页面 ID 是：
>
> `261c36d269a74acd97682af86d7bc9a0`

请将您的**页面ID**记录下来，步骤三配置环境变量时会用到。


## 二、复制源代码

::: tip 提示
注意，请不要使用qq邮箱等国内邮箱，**尽量使用hotmail或gmail等国际邮箱**，否则下一步登陆vercel后会提示账号被封禁。
:::

1. 请先注册并登陆[Github账号](https://github.com/)，

1. 仅需点击下方链接，即可一键 **Fork（复刻）** 官方项目。
[Fork NotionNext](https://github.com/notionnext-org/NotionNext/fork)


## 三、Vercel部署


### 准备账号

注册登陆[Vercel](https://vercel.com/) ，这里推荐选择Github账号登录。

![Untitled](/legacy/13e02f9b76e15fe6.png)

<details>
<summary>注册vercel账号可能遇到的问题</summary>

若注册时提示 `Error:This user account is blocked.Contact support@vercel.com for more information.`
这是由于 `Vercel` 不支持大部分国内邮箱。可以将 `github` 账号主邮箱改为 `Gmail` 邮箱。
**但是**根据群友反应，将 `github` 账号主邮箱切换为 `Gmail` 以后，`Vercel` 又会提示需要使用手机号码验证。然而 `github` 并没有提供手机号码绑定的内容。
综上，建议一开始注册 `github` 账号时就使用 `Gmail` 等国外邮箱进行注册。
  1. 国内访问`Gmail`的方案：
  - 直接使用 QQ 邮箱手机版，它提供 `Gmail` 的访问路线，可以直接注册并使用。使用 `Ghelper` 等浏览器插件访问。详情可以参考这篇文章：[玩转 Microsoft-Edge](https://github.com/Zfour/python_github_calendar_api/blob/master/posts/8c8df126)
  1. 若是执着于当前`Github`账号，可以参考以下方案进行尝试:
  - 完成了 `Gmail` 等国外邮箱的注册，打开 [github-&gt; 头像 -&gt;settings-&gt;Emails](https://github.com/settings/emails)&gt;Add email address, 并完成邮箱验证。在Add email address 下方的Primary email address 选项中将 `Gmail` 设置为主邮箱。

</details>


### 导入代码

1. 点击下方创建新项目
[New Project - Vercel](https://vercel.com/new)

To deploy a new Project, import an existing Git Repository or get started with one of our Templates.

1. 在代码仓库列表中选择导入**NotionNext**
![2.点击导入您的NotionNext项目](/legacy/fe71592782250a93.png)
::: tip 提示
注意：这里步骤放慢些，**不要急着**点击页面上的**Deploy**按钮，先看下方教程。
:::


### 配置页面ID并部署

1. 点击**Environment Variables**（环境变量），并添加一个属性名称为`**NOTION_PAGE_ID**`**，**值为步骤一获取的**页面ID**。
例如，我的页面ID是：`02ab3b8678004aa69e9e415905ef32a5`，则配置如下：
![左侧填写 NOTION_PAGE_ID ， 右侧填写 页面ID的值](/legacy/1b6bad1ad0dee297.png)
填写后要**点击右边的****`Add`****按钮**确认添加

1. 点击`Deploy`按钮，静候两分钟等待部署。
![1.点击Deploy进行自动部署](/legacy/9a881298d4a9b142.png)

### 可选：开启 Fluid Compute

NotionNext 默认兼容未开启 Fluid Compute 的 Vercel Hobby 项目，部署时无需为此更改设置。若希望 Vercel Functions 复用运行实例、改善冷启动并提升并发处理能力，可在项目的 **Settings → Functions → Fluid Compute** 中开启，然后重新部署使设置生效；也可在 `vercel.json` 显式设置 `"fluid": true`，将选择随仓库配置。两种方式选其一即可。

Fluid Compute 是可选的性能优化，不是 NotionNext 的部署前提。不开启时，Hobby 旧计算模式的函数时长上限为 60 秒；NotionNext 的缓存维护函数兼容此限制，`/api/revalidate` 每批运行约 45 秒后通过 HTTP 202 和 `remainingPaths` 续传。开启后 Hobby 函数时长上限为 300 秒，Fluid Compute 可优化函数实例复用与并发，但 NotionNext 仍采用较短批次预算以便及时返回续传结果。其他套餐的限制请以 Vercel 当前方案文档为准：[Functions 最大执行时间](https://vercel.com/docs/functions/limitations#max-duration)、[Fluid Compute](https://vercel.com/docs/fluid-compute)。


## 四、完成🎉🎉🎉

1. 在部署完成页面，点击`Go to Dashboard`访问控制台
![Untitled](/legacy/78f86a1a1c05b5c3.png)

1. 在控制台右上角的`Visit`按钮访问您的站点。或在DOMAINS中获取您的网站地址
![2.在Vercel控制台中找到访问地址](/legacy/0cde1f7486038757.png)


## 注意事项

::: tip 提示
NotionNext会实时抓取Notion笔记内容
(由于缓存和网络延迟，最多刷新两次页面即可看到同步结果)。
:::

::: warning 注意
**若您的站点始终无法同步笔记的数据**，请再次检查上面的步骤，或者干脆重来一遍：
1. 在Notion中检查您的`NOTION_PAGE_ID` 格式是否正确、并已开起页面分享。
2. Vercel后台环境变量中`NOTION_PAGE_ID`是否配置，并重新配置后尝试`Redeploy`。
如何检查Vercel后台环境变量配置：
![Untitled](/legacy/27a7df016686481d.png)
如何重新部署
![Untitled](/legacy/1f4cae5794779d16.png)
:::


## 自定义您的站点

到这里，您已拥有了自己的独立博客，站点的一切内容：标题、描述、头像、菜单栏等所有配置都可随心所欲地定制。

接下来，请访问下方的《**NotionNext 操作手册**》获取更多站点配置的帮助！

[NotionNext-快速免费搭建网站 | NotionNext文档](/user-guide/intro)

无需服务器、即使是小白也能几分钟搭建自己的独立博客站～如果你在使用Notion这款神级笔记本的话，不妨来试试顺手建个网站🤣🤣🤣，这是一款基于NotionAPI的博客系统。

## 原文链接

https://docs.tangly1024.com/article/vercel-deploy-notion-next
