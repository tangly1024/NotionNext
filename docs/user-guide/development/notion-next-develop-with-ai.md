# 借助AI开发NotionNext
> 迁移自：[借助AI开发NotionNext](https://docs.tangly1024.com/article/notion-next-develop-with-ai)
> 发布日期：2025-4-25
> 最后编辑：2026-5-2
> 原栏目：⌨ 开发教程

## 前言

如果不会任何编程语言能否定制一个新主题？

结论是可以的，但是会有些难，相当于完全没有某个行业的客户积累与产品积累，却要一下子开一家这个行业的公司。但是如果你擅长通过AI进行自主学习与挖掘的话，会有一定的帮助。


## 云环境

建议先阅读‣ 这篇文章，其中介绍了开发NotionNext项目可能需要具备的一些基础知识。


### GitHub Codespaces

GitHub 本身自带 Codespaces 云环境，简单来说，在您的 GitHub 仓库中，点击 Code、再点击 **Create codespace** 打开云端开发环境；也可在加号处新建一个云开发空间：

![28f32ba842c3ed98116d7a6e2ad5c29.png](/legacy/e77927a16e23b9c3.png)

在 Codespace 云空间中，界面与本地使用的 **VS Code** 相近。点击上方右侧的 Copilot 图标即可与 AI 聊天。

![image.png](/legacy/fec8dc5f53d7f1fb.png)

Copilot会实时关注您当前打开的文件。通过对话，可以实现对文件的修改或建议。


### Google Firebase Studio

Google推出了FirebaseStudio，支持将您的github项目导入这个云环境进行开发，其原理和Github的Codespace差不多。

不过FirebaseStudio似乎不能汉化界面，会有一定使用难度。另一方面gemini的ai用量不像copilot专为编程设计、后者有大量的github、vscode用户群体，因此能力有限，问几句话就歇菜了。

![image.png](/legacy/43a9e2122e987f4d.png)

因此我还是建议使用Codespace作为云开发环境，不但与github的集成更好，同时Copilot的AI性能更强大。


## 使用Firebase进行AI开发演示

点击下方链接，访问并注册Firebase。

[https://studio.firebase.google.com/](https://studio.firebase.google.com/)

![image.png](/legacy/f16a67253dde79a2.png)

来到项目首页，选择ImportRepo

![image.png](/legacy/11f391869e296bfb.png)

输入Github空间即可

![image.png](/legacy/6a7806b53f1080b8.png)

Firebase会自动导入项目代码并进行环境安装。

![image.png](/legacy/8e06ab05311d9b7f.png)

安装完成后代码显示如下

![image.png](/legacy/9dfe4df0328b03da.png)


## 主题定制

这里用firebase示范，codespace的使用方法基本一致。


### 复制一个主题文件夹

不建议直接修改原先的主题，否则后续如果我也同步修改了这个主题文件夹，在更新的过程可能会产生大量的冲突。

在themes 目录，找到你较喜欢的主题，或者和你预期的新主题结构比较类似的主题，例如example主题文件夹。各主题的补充说明见仓库 [docs/themes](https://github.com/notionnext-org/NotionNext/tree/main/docs/themes)（如 Fuwari、Claude 等）。点击右键copy复制这个文件夹。

![image.png](/legacy/0a4be92d0f2060f3.png)

然后右键点击themes文件夹，选择paste粘贴至此。

![image.png](/legacy/43bc73fb5994a33f.png)

粘贴后会出现一个新的文件夹，我刚复制的文件夹是example 因此这里粘贴后的文件夹名字为example copy

![image.png](/legacy/bdd104d76776fa20.png)


### 重命名主题

我希望新主题名为dream，因此将example copy文件夹重命名，右键点击文件夹，选择rename，并且输入新的文件夹名称，按下回车确认即可。

![image.png](/legacy/f5ca83ba0b823745.png)

![image.png](/legacy/a94cfb41e1c57264.png)


## 修改主题内容

双击打开dream / index.js 文件，并且用附件形式引入这个文件：点击gemini聊天窗口下的附件按钮。选择file

![image.png](/legacy/8c7980c5224652cb.png)

在弹出的文件选择框中，选择当前的index.js文件。

![image.png](/legacy/9235c98b5cd3fafd.png)

> 如果是用Copilots的话可以省去此步骤

然后给gemini发一句话：

> 这个主题的顶部导航栏在哪，是哪个文件，并且在这个导航栏中做一个修改，在导航栏的左侧加一行蓝色文字，内容是“新主题dream”创建成功。
> 文件应该在/themes/dream/components目录下

紧接着ai会告诉你所有的内容，然后会给出一份代码修改建议：

![image.png](/legacy/5aa43dd8558d246f.png)

点击建议框右侧的Review changes可以审视修改的内容，点击左侧的Updates file，即可自动修改文件。


## 运行启动项目

启动项目之前可以先将当前主题切换为您刚创建的dream主题。最简单的方法可以是修改blog.config.js文件

![image.png](/legacy/50346835df66470c.png)

在控制台输入 npm run dev 即可运行项目

![image.png](/legacy/383ef20d0fce8b02.png)

运行启动后，**按住键盘Ctrl键再鼠标点击控制台打印处的http://locahost:3000** 即可打开实时调试页面：

![image.png](/legacy/f379c4ee6e108960.png)

firebase会自动分配一个临时网址用于访问调试页面。

![image.png](/legacy/93328a79c3c5e94f.png)

打开后即可看到刚刚的修改已经生效了，接下来您的所有代码修改都会实时反映在这个页面上。

我们可以切换到刚刚的编辑页面手动修改内容：

![image.png](/legacy/ca42502c177f35e3.png)

然后再看页面就已经生效了

![image.png](/legacy/024243b88fc53f56.png)

接下来就是不停的和AI对话，告诉他需要改什么，给出结果，然后你点击更新文件即可。


## 保存代码

### 让 AI 同步更新文档

AI 修改代码时，不要只让它改组件或配置文件。凡是新增或修改了站长会使用的功能，都要让 AI 一起检查并更新文档，尤其是：

- 新增 `themes/<theme>/config.js` 配置项；
- 新增环境变量、Notion Config 配置项或插件开关；
- 改变部署、构建、缓存、评论、统计、广告等使用方式；
- 修改主题的外观、交互或默认行为，并且站长需要知道如何开启、关闭或迁移。

可以直接把下面这段话发给 AI：

> 请先判断这次改动是否影响站长使用方式。如果新增或修改了用户可见配置、环境变量、Notion Config 键、主题行为或部署步骤，请同步更新 `docs/user-guide/` 或 `docs/developer/` 中对应文档；不要在 PR 描述中勾选“用户文档不适用”，除非本次改动确实只是内部重构或测试。

例如修改 HEO 主题配置时，优先检查 `docs/user-guide/themes/heo.md`；修改全站配置时，优先检查 `docs/user-guide/config-site.md`、`docs/user-guide/reference/features.md` 和 `docs/developer/CONFIGURATION.md`。

所有的代码需要提交到git仓库才能被保存，这里涉及到git的使用操作，git本身是为大型多人团队协作设计、其功能强大，需要一定的学习。我这里做一个最简单的提交代码的演示。

点击左侧的Source Control图标

![image.png](/legacy/44b501d4aa35e3d1.png)

这里列出了所有本次的更改内容，你需要将确定要保存的修改内容进行确认。

![image.png](/legacy/b64da90d4c02c220.png)

鼠标指向每个文件的右侧都会浮现一个加号，点击表示此文件需要保存到git仓库中。

![image.png](/legacy/724f484efb913b6f.png)

点击后的文件会显示再Staged Changes这个分栏下：

![image.png](/legacy/b491f007b69cc6ef.png)

可以点击Changes右侧的加号，一次性确认所有文件。

![image.png](/legacy/0e6dae3842759bbb.png)

要提交保存的文件确认后，在上方的Message栏中填写这次提交改动的功能说明，这是必填项，便于日后回查此次提交的内容。例如我在这里输入: “创建了新的主题dream”

![image.png](/legacy/2575a497cc9d54f4.png)

填写完说明内容后，点击下方的commit按钮提交，提交后下方列表就变空了，因为已经没有待确认和待提交的内容，所以这里就没有可以显示的内容。

![image.png](/legacy/938b55e65a5fc0a6.png)

我们注意到这里有一个按钮，如果你是创建了一个新的git分支会显示上面的Publish branch按钮，如果是在原有的分支例如main分支上进行开发，那么这里会显示 sync changes ，表示与你的github云端仓库需要进行同步。

![image.png](/legacy/96e6c3f8503d234b.png)

这里我们点击它，将内容同步到github云端。


### 授权Github

> 如果用的是github提供的codespace环境则无需下列步骤。

如果这里你是首次同步的话，会提示你要获得github插件的许可，点击同意即可；

![image.png](/legacy/cf9842e09b63c675.png)

然后会得到一个授权码，点击copy $ continue to github

![image.png](/legacy/6dd185929839837e.png)

在自动跳转到的页面中粘贴或输入验证码。

![image.png](/legacy/be4a73fab045f31a.png)

然后再在二次确认页面点击 Authorize Visual Studio Code即可。

![image.png](/legacy/13011e1050828590.png)

![image.png](/legacy/11c82c33f16150cd.png)

如果上述步骤走不通的话，firebase也支持用github的token进行提交验证，这是另一种可选的授权方案，不过基本用不到，此处不做展开。

![image.png](/legacy/0f442d3f4d9d85bd.png)


## 代码提交同步完成

此时再看你的SourceControl 页面，已经没有待提交、待审核、和带同步的任务了。

![image.png](/legacy/c7a6b6ddf555c1ec.png)

而在github项目中能看到刚刚的提交记录说明，和对应的文件内容

![image.png](/legacy/243ceed8545d7a57.png)

接下来vercel将会自动识别代码的修改并自动部署您的站点。

以上就是一个完整的，借助云环境+AI开发一个小功能，并同步到Github的流程。


## 结尾

需要注意的是，AI和云环境只是一个效率工具，本质是帮不懂的人快速入门学习，帮住本来就懂的人节省开发时间。因此要想彻底掌握开发，还需要结合学习NotionNext所使用的框架技术和文件目录的规范结构。

将来再过几年，等AI-Agent智能体普及之后，就完全不需要上面这么复杂的步骤了，到时候只要负责发布命令，如何实现都是智能体应该考虑的。

## 原文链接

https://docs.tangly1024.com/article/notion-next-develop-with-ai
