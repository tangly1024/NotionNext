# 基础教程-如何用Git提交代码
> 迁移自：[基础教程-如何用Git提交代码](https://docs.tangly1024.com/article/notionnext-how-to-pr)
> 发布日期：2024-2-27
> 最后编辑：2024-9-12
> 原栏目：⌨ 开发教程

## 提交/贡献代码

通过GithubDesktop\VSCode\TortoiseGit等工具，将您的代码提交后，推送到Github云端即可，Vercel会自动部署代码中的更新。


### 1.****创建新主题****

如果您想创建一个新主题、并提交到NotionNext，请复制一个[`/themes/example`](https://github.com/notionnext-org/NotionNext/blob/main/themes/example)文件夹在[`themes`](https://github.com/notionnext-org/NotionNext/blob/main/themes)目录下，并修改文件夹的名称主题的名称。


### 2.**添加本地化**

如果您的语言尚未得到NotionNext的支持，欢迎贡献本地化！按照以下步骤添加新的本地化：
1. 在[/lib/lang](https://github.com/notionnext-org/NotionNext/blob/main/lib/lang)中复制一个[en-US.js](https://github.com/notionnext-org/NotionNext/blob/main/lib/lang/en-US.js)文件，并将文件命名为语言的代码（例如`zh-CN.js`）。
2. 开始翻译字符串。
3. 将您的语言配置添加到[lang.js](https://github.com/notionnext-org/NotionNext/blob/main/lib/lang.js)中。

欢迎将你的代码分支，合并到NotionNext主仓库中，要为NotionNext做出贡献，请按照以下步骤操作：


### 3.提交代码到NotionNext

1. 将存储库[fork](https://github.com/notionnext-org/NotionNext/fork)到您的GitHub帐户。

1. 将存储库clone到您的设备上（或使用Codespaces之类的东西）。

1. 在存储库中创建一个新分支，分支名按照改动的内容命名，建议是`feat/`或`bug/`开头。

1. 在分支中进行修改。

1. 提交修改并推送分支。(请勿在分支中提交您自己的配置信息)
![Untitled](/legacy/ead1ee047149aec5.png)

1. 从fork中的分支[创建](https://github.com/notionnext-org/NotionNext/compare)到NotionNext的`main`分支的[PR](https://github.com/notionnext-org/NotionNext/compare)。

### 4. 提交 PR 前检查用户文档

如果 PR 新增或修改了站长能使用的功能、主题配置、环境变量、Notion Config 配置项、部署步骤或插件开关，请同步更新 `docs/user-guide/` 或 `docs/developer/` 中对应说明。

不要在这类 PR 中勾选“用户文档不适用”。只有纯内部重构、测试修正、依赖维护、拼写修正，且不会改变站长使用方式时，才可以标记为不适用。

常见位置：

- 主题配置：`docs/user-guide/themes/<theme>.md`
- 全站配置：`docs/user-guide/config-site.md` 或 `docs/user-guide/reference/features.md`
- 开发者约定：`docs/developer/`
- 文档维护流程：`docs/user-guide/maintain-docs.md`

## 原文链接

https://docs.tangly1024.com/article/notionnext-how-to-pr
