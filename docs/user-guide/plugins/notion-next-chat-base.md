# AI聊天机器人-ChatBase
> 迁移自：[AI聊天机器人-ChatBase](https://docs.tangly1024.com/article/notion-next-chat-base)
> 发布日期：2023-7-18
> 最后编辑：2024-9-7
> 原栏目：🧷 外部扩展

## 啥是ChatBase

Chatbase.co 是**一款为网站构建自定义ChatGPT 界面的工具**，用户只需上传文档或添加到网站的链接，就可以获得一个类似ChatGPT 的聊天机器人，并将它作为小组件添加到网站上。

网页右下角会出现一个对话框，您可以通过他搜索网页中的所有知识点。

![chatbase](/legacy/8a6597482301f9ba.png)

2024.4.29最新版本；配置成功的效果，右下角多出一个聊天按钮

![Untitled](/legacy/d850c66635bf13f7.png)

直接询问对话

![Untitled](/legacy/6f6380aa08eec94b.png)


## 配置方法

用环境变量或修改代码的方式，在[blog.config.js](https://github.com/notionnext-org/NotionNext/blob/48cb3ee6779c117bcb6b61e5cb89fbd1c541a115/blog.config.js#L156)中添加您的chatbase-id即可。

```YAML
//   ********挂件组件相关********
// Chatbase
CHATBASE_ID: process.env.NEXT_PUBLIC_CHATBASE_ID || null, // 是否显示chatbase机器人 https://www.chatbase.co/
```

另外，有了chatbase-id 您可以直接用内嵌网页的方式，将chatbase放在您的任意notion页面中，网页地址

```HTML
https://www.chatbase.co/chatbot-iframe/${BLOG.CHATBASE_ID}
```


## 获取ChatBase-id方法


### 1. 注册登录ChatBase

[Chatbase | ChatGPT for your website](https://www.chatbase.co/)

Build an AI chatbot from your knowledge base and add it to your website.


### 2. 根据引导，配置机器人的数据源

登陆成功后，创建一个新的聊天机器人，点击`New Chatbot`

![Untitled](/legacy/9c1164c894e27c1f.png)

这里要选择用什么数据源来训练机器人；默认是上传json文件，在这里我们选择爬取网站内容，点击Website：

![Untitled](/legacy/0fe659b18f69ff1d.png)

这里使用站点地图的方式提交内容，输入网址后面加上`/sitemap.xml`，如下图，这是NotionNext每个站点默认的地图位置。

![Untitled](/legacy/4b41756a5efb9633.png)

点击Load sitemap加载地图内容，此时平台会自动爬取您网站中的页面地址

![Untitled](/legacy/8beae3f4a44ff2b5.png)

（免费版只能读取10个页面生成机器人数据，这里我们要删除超出10个的多余链接）

我这边示例，只保留了几个重要链接，一个是about介绍页面，一个是archive归档页面，一篇文章；

点击Create Chatbot 训练机器人。

![Untitled](/legacy/75ebf34086de4c68.png)

等待进度条完成。最后可以在面板中看到配置信息

![Untitled](/legacy/5bed8f5da2971272.png)

在setting中可以设置默认欢迎语和用户提问的提示词，这里需要自己折腾一下，不展开叙述了。


### 3. 在Embed on Site 中找到id

点击Embed on site，会提示你需要将此机器人公开，

![Untitled](/legacy/1bf1ed140191d008.png)

选择 make public即可

![Untitled](/legacy/d935c6b9f3b25dae.png)

然后在弹出的确认框中就可以找到你的chatbotId了。

![Untitled](/legacy/be78700f51a776cd.png)


## 配置在NotionNext中

两种方案配置,任选其一：

1. 添加一个环境变量 `NEXT_PUBLIC_CHATBASE_ID`

1. 添加一个NotionConfig: `CHATBASE_ID`

## 原文链接

https://docs.tangly1024.com/article/notion-next-chat-base
