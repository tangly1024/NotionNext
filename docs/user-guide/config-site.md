# 如何配置站点
> 迁移自：[如何配置站点](https://docs.tangly1024.com/article/how-to-config-notion-next)
> 发布日期：2024-5-13
> 最后编辑：2026-5-2
> 原栏目：🛠 站点配置
> 标签：NotionNext
> 摘要：如何配置NotionNext站点

按照前面的教程部署成功后，后续您可以随时更新您的站点配置，诸如切换主题、开启音乐组件、开启评论插件、开启动画特效、修改网站字体等等。

配置方式分为三种，分别是：

1. 在Notion笔记中修改

1. Github修改配置代码

1. Vercel环境变量添加配置

以下展开说明

## 新手先看：固定主题并关闭主题切换

如果你只是想把网站固定成 `simple` 主题，并去掉页面上的“切换主题”按钮，优先在 Notion Config 表里添加：

```text
THEME=simple
THEME_SWITCH=false
WIDGET_PET_SWITCH_THEME=false
```

如果你使用 Vercel 环境变量，则添加：

```text
NEXT_PUBLIC_THEME=simple
NEXT_PUBLIC_THEME_SWITCH=false
NEXT_PUBLIC_WIDGET_PET_SWITCH_THEME=false
```

改完后重新部署一次。若部署后仍然不是 `simple`，先检查 Notion Config 表里是否已有其它 `THEME` 配置；Notion Config 会覆盖 Vercel 环境变量和 GitHub 代码默认值。


## 1. 在Notion中修改

网站的图标、标题、描述、封面图将直接读取您的Notion模板

![Untitled](/legacy/f13022d184ee3a2d.png)
![图标①、标题②、描述③及封面图④ 分别对应站点的**作者头像**、**站点标题****站点描述**和**封面大图**。](/legacy/a3c865bb3bc262dd.png)

::: tip 提示
在4.1 之前的版本（1.0 - 4.0） 中，很多配置需要到配置文件或环境变量里改，这需要用户打开编辑器或者登录github，乃至登录vercel后台编辑环境变量。

4.1版本之后，支持在Notion中创建一个Config文档，并且随时可以在Notion中编辑配置文件。
:::


### 使用Notion-Config

::: tip 提示
在Notion中编辑一个文档，即可实时同步站点配置，开关功能等等，无需登录github、vercel或者服务器。
:::


#### 如何使用？

在您起初复制的这份数据库模板中，我后续更新了一个 **type** 为 **Config** 的文档，文档中包含了一个数据表格，格式如下：

![配置中心-Config](/legacy/c0a66c338d215735.png)
![配置中心的内置表格](/legacy/175d91ab905f2e22.png)


#### 配置中心使用说明

1. 仅 **V4.1.0** 之后的版本中支持该配置页面

1. 此处配置的优先级最高，它将覆盖Vercel环境变量、覆盖blog.config.js。

1. 您可以在`blog.config.js`以及各个主题的`config.js`中找到支持的配置，在4.8.0之后的版本，为了减少`blog.config.js`的体积，不同模块的配置被拆分到了 `/conf/xx.js` 中
![image.png](/legacy/13a2b97c3617197f.png)
各类配置的参考路径： [https://github.com/notionnext-org/NotionNext/tree/main/conf](https://github.com/notionnext-org/NotionNext/tree/main/conf)
主题支持的配置内容参考路径： [https://github.com/notionnext-org/NotionNext/blob/main/themes/example/config.js](https://github.com/notionnext-org/NotionNext/blob/main/themes/example/config.js)

1. `NOTION_PAGE_ID` 必须在你的环境变量或代码中配置，不支持Notion_Config文档配置

1. 配置中心的表格中我预置了几个常用配置，您可以按照自己的需求手动添加更多配置
点击右上角的`new`或者左侧加号`+`都可以新增一行配置，然后填入对应的“配置名”和“配置值”
![Untitled](/legacy/dfa8945c4ec07eff.png)

1. 强烈建议添加的配置
`**AUTHOR**`，作者名
`**LINK**`，你的站点网址
`**CONTACT_EMAIL **`, 你的联系邮箱，更多联系方式，在此查看配置方式： [https://github.com/notionnext-org/NotionNext/blob/main/conf/contact.config.js](https://github.com/notionnext-org/NotionNext/blob/main/conf/contact.config.js)
（务必配置你自己的联系方式！）


#### 表格字段说明


#### 支持主题配置与复杂格式

基本上所有的主题配置项都可以使用`NOTION_CONFIG`。但需要注意的是，如果配置的内容是一个数组或者对象的话，需要将NOTION_CONFIG中的内容转成**双引号的json**格式，否则会无法读取，例如HEO主题下支持四项配置：

```JavaScript
// 以下三种配置分别代表布尔、普通字符、对象、数组四种类型。
HEO_HOME_BANNER_ENABLE: true,
HEO_SITE_CREATE_TIME: '2024-05-09',
HEO_HERO_CATEGORY_1: { title: '必看精选', url: '/tag/必看精选' },
HEO_NOTICE_BAR: [
  { title: '欢迎来到我的博客', url: '/user-guide/intro' },
  { title: '访问文档中心获取更多帮助', url: '/user-guide/intro' }
],
```

这四种类型在`Notion_Config`中的参考配置如下,其中对象和数组都转成了json格式：

配置后的效果示例：

[CONFIG-TABLE | Notion](https://www.notion.so/tanghh/1e9b9ee182c6474782b55cd3a2e1c396?v=a573d986661d402aac46970d8f20c083&pvs=4)

Built with Notion, the all-in-one connected workspace with publishing capabilities.


### 如何将代码中的Config转换成JSON？

如何将config中的对象转成json可以借助AI，或者一些在线json格式化工具。

![image.png](/legacy/0f62bc102d9f0c2e.png)


### 老用户升级

对于新用户（2024年起）：您复制的数据库模板中已经默认自带了此配置页面。

老用户升级（2023年及以前）：您可以**复制下面链接中的《配置中心》**文档，即可支持NotionConfig功能。

[Notion – The all-in-one workspace for your notes, tasks, wikis, and databases.](https://www.notion.so/tanghh/02ab3b8678004aa69e9e415905ef32a5)

A new tool that blends your everyday work apps into one. It's the all-in-one workspace for you and your team

单击此文档左侧的六个点即可选中，按下Ctrl+C复制文档。然后在您的Notion模板页面中按下Ctrl+V粘贴即可。

![Untitled](/legacy/8551ccd7c1216e06.png)


## 2. 修改代码

::: tip 提示
重要：站点的大部分配置都可以在您代码仓库的 **[blog.config.js](https://github.com/notionnext-org/NotionNext/blob/main/blog.config.js)**** **文件中找到；
您只需修改对应的配置，Vercel将自动部署您Github仓库中的最新代码。
:::

::: tip 提示
若您更新到了NotionNext4.1之后的版本，推荐您直接在Notion-Config文件中添加配置，它将覆盖blog.config.js中的配置。
:::

配置方法：在您的github中找到此文件，点击右上角的编辑按钮，即可修改参数。

![Untitled](/legacy/5f24f0f166a05643.png)

::: tip 提示
每次修改代码后，Vercel自动创建一个部署任务以打包部署您的最新代码，且每次部署任务都有唯一的**网址提供预览**。
  - 若编译**成功：**您的线上域名会更新为此次部署的**最新版本**。
  - 若部署**失败：**例如代码格式错误、拼写错误，则这次部署则会作废，线上原先运行中的旧版网站**不受任何影响**。您可以查看后台部署日志找到错误原因。
<details>
<summary>附-如何获取部署日志</summary>

截图您的部署日志，向[群友](/user-guide/help/feedback)寻求帮助
      1. 在Vercel的后台看到您的每次部署记录(点击展开)
![Untitled](/legacy/8b4050dd2f9d0b67.png)
      1. 请截图部署的错误日志，错误信息越完整越好；
![Untitled](/legacy/665f2e790c2ff248.png)

</details>
:::


#### 修改示例

> 以下示例修改了网站的默认作者

- 修改前
```JavaScript
AUTHOR: process.env.NEXT_PUBLIC_AUTHOR || 'NotionNext', // 修改前 作者 NotionNext
```

- 修改后
```JavaScript
AUTHOR: process.env.NEXT_PUBLIC_AUTHOR || 'momo', // 修改后 作者 momo
```

> 以下示例修改了当前网站的网址

- 修改前
```JavaScript
LINK: process.env.NEXT_PUBLIC_LINK || '/user-guide/intro', // 修改前网址
```

- 修改后
```JavaScript
LINK: process.env.NEXT_PUBLIC_LINK || 'https://qq.com', // 修改后
```
::: tip 提示
请将这项配置修改为您的站点域名，否则会影响分享和版权申明的功能使用
:::


## 3. 在环境变量中配置

除了直接修改代码配置`blog.config.js` ，也可以在vercel后台添加环境变量；这样做的好处是减少对代码的改动，也避免了后续升级时代码发生冲突的概率。

::: tip 提示
网站配置优先来自**NotionConfig**，其次**环境变量**，最后**代码配置**。
:::


#### 内置主题名称一览（与仓库同步）

`NEXT_PUBLIC_THEME` / `THEME` 的取值需与仓库 `[themes/](https://github.com/notionnext-org/NotionNext/tree/main/themes)` 下的**文件夹名**一致（`next.config.js` 会在构建时扫描该目录）。以当前 **main** 分支为例，内置主题包括：**claude**、**commerce**、**example**、**fukasawa**、**fuwari**、**game**、**gitbook**、**heo**、**hexo**、**landing**、**magzine**、**matery**、**medium**、**movie**、**nav**、**next**、**nobelium**、**opc**、**photo**、**plog**、**proxio**、**simple**、**starter**、**typography**。

- **默认**一般为 **simple**；与 `blog.config.js` 中 `THEME` 的写法保持一致即可。

- **example** 多为主题/配置的参考示例，生产站点更常选用 simple、hexo、heo、fuwari、claude 等其它主题。

- 文件夹名为 **magzine**（与英文 magazine 拼写不同，请勿写错）。

- 各主题个性化选项与预览方式见文档 [《⭐️主题配置》](/user-guide/themes/overview)；若你本地或 fork 的 `themes/` 与官方不一致，以实际目录为准。

- 在`blog.config.js` 文件中可以看到类似 `process.env.NEXT_PUBLIC_THEME` 的格式，这意味着此类参数支持在Vercel中使用环境变量来配置。默认主题为 `simple`；若需在页面上显示主题切换菜单，可在仓库 `conf/widget.config.js` 中配置 `THEME_SWITCH`（可选用环境变量 `NEXT_PUBLIC_THEME_SWITCH`）。
```JavaScript
NOTION_PAGE_ID: process.env.NOTION_PAGE_ID || '02ab3b8678004aa69e9e415905ef32a5',
THEME: process.env.NEXT_PUBLIC_THEME || 'simple', // 默认主题（与仓库 blog.config.js 一致）
LINK: process.env.NEXT_PUBLIC_LINK || '/user-guide/intro', // 站点域名
```

- 网站优先读取环境变量配置、其次是文件中的配置。
::: tip 提示
用后台环境变量配置的好处：有些敏感信息不适合直接在代码中修改，例如一些第三方插件的key，这时候推荐通过环境变量来配置。
:::

<details>
<summary>Vercel环境变量如何操作 (点击展开教程)</summary>

  1. 项目主页点击`Settings`，并选择`Environment Variables`配置环境变量
![Untitled](/legacy/42709cbcd16f30f9.png)
  1. 找到Setting → Environment Variables
![Untitled](/legacy/85bd32320336be3a.png)
  1. 在Key中填写配置名称，Value中填写配置的值，如下图:
![4DA432EF-AC19-46EA-AF59-DD0BC45C6483.jpeg](/legacy/604775d846955850.jpg)
  1. 环境变量修改后，点击顶部`Deployments`标签，将列表中最上面的一条部署记录`Redeploy`即可（如下图）
![Untitled](/legacy/964e0c08eaa8c73f.png)

#### 修改示例

### 如何知道key？
在[blog.config.js](https://github.com/notionnext-org/NotionNext/blob/main/blog.config.js)文件中可以看到大量的配置项，配置项中的类似 `process.env.``**NEXT_PUBLIC_THEME**`** **； 这样的结构中、加粗部分就是key的名字。例如以下配置表明当前仓库默认值主题为 **simple**（也可通过环境变量改为 hexo 等）。
```JavaScript
THEME: process.env.NEXT_PUBLIC_THEME || 'simple', // 默认主题
```
如果需要将主题变为 hexo，则可以添加如下环境变量:

#### 获取key示例2
同样地，再以修改网站的联系邮箱地址为例，blog.config.js中修改邮箱地址的配置如下：
```JavaScript
CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || ''  // 填写邮箱地址
```
如果直接修改配置是这样的：
```JavaScript
CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '123456@qq.com'  // 填写邮箱地址
```
若不想修改文件，只改环境变量，则添加以下环境变量即可

</details>


### VPS本地部署如何操作环境变量

若您不是用vercel托管，而是在自己的服务器上部署，则可以直接在项目根目录的 .env.local 文件中添加环境变量即可：

```JavaScript
# 环境变量 @see https://www.nextjs.cn/docs/basic-features/environment-variables
NOTION_PAGE_ID=xxxxxxxx
NEXT_PUBLIC_THEME=simple
NEXT_PUBLIC_LINK=http://xxx.com
```


## 4. 不同主题的个性化配置

每个主题都有自己个性化的配置，例如Hexo这个主题首页有个专属的欢迎语

> hi，我是一个程序员

这该如何更改？需要访问这个主题的说明文档，请参阅此文档教程的 [《⭐️主题配置》](/user-guide/themes/overview)部分

## 原文链接

https://docs.tangly1024.com/article/how-to-config-notion-next
