# VPS本地服务器
> 迁移自：[VPS本地服务器](https://docs.tangly1024.com/article/deploy-notion-next-on-vps)
> 发布日期：2022-11-20
> 最后编辑：2026-5-2
> 原栏目：🚀 安装部署
> 标签：NotionNext、部署方案、VPS
> 摘要：在你的云服务器上手动部署NotionNext

::: tip 提示
更新记录：
20250708，添加了用Docker运行项目的文档教程。
:::


## 前言

NotionNext可以轻松地使用Vercel免费托管，不过免费的流量和函数执行次数有限，如果你的网站访问量非常大，可以尝试在自己的云服务器、vps上部署。

用国内的VPS部署服务、会大大提升网站的访问速度。

::: tip 提示
可以选择裸机安装Nodejs环境启动项目，注意：服务器的操作系统、CPU内存配置都有可能影响到服务运行。推荐用Docker容器化部署。
:::

::: tip 提示
比较推荐有技术经验的小伙伴使用这套方案！
:::

分享一篇网友自己实践分享的教程：

[建站|VPS裸机安装NotionNext个人博客 | Ywba's Blog](https://www.ywba.top/article/375dc6b6-1eaa-4a0f-bbc1-f2149b285b7a)

个人博客


## 安装步骤

::: tip 提示
准备一台任意操作系统的VPS云服务器，不同系统的安装步骤大同小异，以下我用 `linux-centos-7` 主机为例
:::

安装分为三个步骤，一是下载NotionNext代码；二是安装运行环境、三是启动项目。


### 一、NotionNext代码下载

1. 安装Git
::: tip 提示
git是一个代码托管工具，你可以用它来下载github上的代码。
```Bash
# 一个命令安装
yum install git -y
```
:::
<details>
<summary>执行效果</summary>

```Bash
[root@tangly1024 ~]# yum install git -y
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: mirror.lzu.edu.cn
 * extras: mirrors.ustc.edu.cn
 * updates: mirror.lzu.edu.cn
base                                                                                                                                                         | 3.6 kB  00:00:00
extras                                                                                                                                                       | 2.9 kB  00:00:00
updates                                                                                                                                                      | 2.9 kB  00:00:00
(1/2): extras/7/x86_64/primary_db                                                                                                                            | 249 kB  00:00:00
(2/2): updates/7/x86_64/primary_db                                                                                                                           |  18 MB  00:00:02
Resolving Dependencies
--&gt; Running transaction check
---&gt; Package git.x86_64 0:1.8.3.1-23.el7_8 will be installed
--&gt; Processing Dependency: perl-Git = 1.8.3.1-23.el7_8 for package: git-1.8.3.1-23.el7_8.x86_64
--&gt; Processing Dependency: perl(Term::ReadKey) for package: git-1.8.3.1-23.el7_8.x86_64
--&gt; Processing Dependency: perl(Git) for package: git-1.8.3.1-23.el7_8.x86_64
--&gt; Processing Dependency: perl(Error) for package: git-1.8.3.1-23.el7_8.x86_64
--&gt; Running transaction check
---&gt; Package perl-Error.noarch 1:0.17020-2.el7 will be installed
---&gt; Package perl-Git.noarch 0:1.8.3.1-23.el7_8 will be installed
---&gt; Package perl-TermReadKey.x86_64 0:2.30-20.el7 will be installed
--&gt; Finished Dependency Resolution

Dependencies Resolved

====================================================================================================================================================================================
 Package                                         Arch                                  Version                                            Repository                           Size
====================================================================================================================================================================================
Installing:
 git                                             x86_64                                1.8.3.1-23.el7_8                                   base                                4.4 M
Installing for dependencies:
 perl-Error                                      noarch                                1:0.17020-2.el7                                    base                                 32 k
 perl-Git                                        noarch                                1.8.3.1-23.el7_8                                   base                                 56 k
 perl-TermReadKey                                x86_64                                2.30-20.el7                                        base                                 31 k

Transaction Summary
====================================================================================================================================================================================
Install  1 Package (+3 Dependent packages)

Total download size: 4.5 M
Installed size: 22 M
Downloading packages:
warning: /var/cache/yum/x86_64/7/base/packages/perl-Error-0.17020-2.el7.noarch.rpm: Header V3 RSA/SHA256 Signature, key ID f4a80eb5: NOKEY
Public key for perl-Error-0.17020-2.el7.noarch.rpm is not installed
(1/4): perl-Error-0.17020-2.el7.noarch.rpm                                                                                                                   |  32 kB  00:00:00
(2/4): perl-Git-1.8.3.1-23.el7_8.noarch.rpm                                                                                                                  |  56 kB  00:00:00
(3/4): perl-TermReadKey-2.30-20.el7.x86_64.rpm                                                                                                               |  31 kB  00:00:00
(4/4): git-1.8.3.1-23.el7_8.x86_64.rpm                                                                                                                       | 4.4 MB  00:00:01
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Total                                                                                                                                               3.9 MB/s | 4.5 MB  00:00:01
Retrieving key from file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
Importing GPG key 0xF4A80EB5:
 Userid     : "CentOS-7 Key (CentOS 7 Official Signing Key) &lt;security@centos.org&gt;"
 Fingerprint: 6341 ab27 53d7 8a78 a7c2 7bb1 24c6 a8a7 f4a8 0eb5
 Package    : centos-release-7-9.2009.0.el7.centos.x86_64 (@anaconda)
 From       : /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : 1:perl-Error-0.17020-2.el7.noarch                                                                                                                                1/4
  Installing : perl-TermReadKey-2.30-20.el7.x86_64                                                                                                                              2/4
  Installing : perl-Git-1.8.3.1-23.el7_8.noarch                                                                                                                                 3/4
  Installing : git-1.8.3.1-23.el7_8.x86_64                                                                                                                                      4/4
  Verifying  : git-1.8.3.1-23.el7_8.x86_64                                                                                                                                      1/4
  Verifying  : 1:perl-Error-0.17020-2.el7.noarch                                                                                                                                2/4
  Verifying  : perl-Git-1.8.3.1-23.el7_8.noarch                                                                                                                                 3/4
  Verifying  : perl-TermReadKey-2.30-20.el7.x86_64                                                                                                                              4/4

Installed:
  git.x86_64 0:1.8.3.1-23.el7_8

Dependency Installed:
  perl-Error.noarch 1:0.17020-2.el7                         perl-Git.noarch 0:1.8.3.1-23.el7_8                         perl-TermReadKey.x86_64 0:2.30-20.el7

Complete!
```

</details>

1. 从Github仓库拉取代码
```Bash
# 来到您的用户主目录
cd ~

# 将Git上的代码下载到服务器中 ;
git clone https://github.com/notionnext-org/NotionNext &&

# 若您的服务器因为网络问题，无法访问github，可手动下载NotionNext代码 上传至服务器
```


## 二、运行项目

可以使用Docker运行，或者系统安装NodeJS环境运行，出于兼容性和稳定性的考虑，这里推荐使用Docker方案运行。


#### 1. Docker运行

原先文档是推荐在服务器上使用NodeJS环境，奈何当前新版要用到 Node 22 及以上的环境，这里有部分服务器无法兼容安装。同时Docker本身的稳定性也更加适合在生产环境使用，因此我在2025年7月8日更新了这部分手册，加入了Docker运行方案。

1. 安装Docker最新版(CentOS为例)
```Bash
# 1.更新系统
sudo yum update -y
# 2.安装依赖
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
 # 3.添加国内阿里镜像下载源
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
# 4.下载安装docker
sudo yum install -y docker-ce
# 5.启动docker
sudo systemctl start docker
```
<details>
<summary>其它操作系统-Debian</summary>

```JavaScript
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list &gt; /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

</details>

1. 创建Dockerfile文件
由于国内防火墙的规定，Docker的镜像网络访问受限，现在Docker要下载官方NodeJs环境变得困难，因此推荐使用国内替代的镜像源下载(来自[https://docker.aityp.com/](https://docker.aityp.com/))。以下是我尝试成功的完整版本（已将镜像替换成国内版本，可能存在过期风险）。
```Bash
# 1.确保当前目录是NotionNext代码文件夹
cd NotionNext

# 2.创建构建文件
cat &gt; Dockerfile &lt;&lt;EOF
# 第一阶段：基础镜像
FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/library/node:22-alpine AS base

# 第二阶段：依赖安装
FROM base AS deps
# 声明阶段参数（推荐方式）
ARG NOTION_PAGE_ID
ARG NEXT_PUBLIC_THEME
# 安装依赖
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
RUN yarn config set registry https://registry.npmmirror.com && \
    yarn config set disturl https://npmmirror.com/dist && \
    yarn install --frozen-lockfile --network-timeout 600000

# 第三阶段：构建
FROM base AS builder
ARG NOTION_PAGE_ID
ARG NEXT_PUBLIC_THEME
ENV NEXT_BUILD_STANDALONE=true
ENV NEXT_DEBUG=${NEXT_DEBUG:-false}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# 第四阶段：运行
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 个人仓库把将配置好的.env.local文件放到项目根目录，可自动使用环境变量
# COPY --from=builder /app/.env.local ./

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node", "server.js"]
EOF
```

1. 开始构建
以下命令将读取当前NotionNext文件夹下的Dockerfile文件，按照文件内容下载Nodejs环境，并将NotionNext代码包括blog.config.js等配置打包进环境中，成为一个可执行的Docker镜像，并且镜像名为my-app。
```Bash
docker build --build-arg NEXT_DEBUG=true -t my-app .
```
根据服务器网络环境，首次打包过程可能要十分钟左右。
![image.png](/legacy/5a93178d5c15f55c.png)

1. 使用docker运行项目
```Bash
docker run -d -p 3000:3000 --name app --restart unless-stopped my-app
```

1. 重启docker项目
```Bash
docker restart app
```
更多关于docker的用法，请查阅手册或借助AI使用。

1. 更新项目
拉取最新代码，或者修改对应的配置文件后，执行以下命令重新打包
```Bash
docker build --build-arg NEXT_DEBUG=true -t my-app .
```
然后关停旧的服务
```Bash
docker rm -f app
```
启动新服务
```Bash
docker run -d -p 3000:3000 --name app --restart unless-stopped my-app
```


#### 2. 系统中运行（本地安装NodeJS环境）

除了上述的Docker环境运行，还可以在系统中直接安装NodeJS环境运行。若要在系统中安装Nodejs，推荐使用`nvm`进行安装，NVM（Node version manager）是nodejs的专用版本管理器，可以快速方便地**安装**并**切换**nodejs的版本，方便以后升级NodeJS环境。

- 关于NodeJs环境的警告
  - 如果服务器版本不兼容最新版本的nodejs，运行时出现如下错误，需要尝试升级系统的模块组件（危险操作），或尝试用上面推荐的Docker方案。
::: warning 注意
运行nodejs命令时出现如下相关错误：
`npm install -g yarn
`
node: /lib64/libstdc++.so.6: version `GLIBCXX_3.4.21' not found (required by node) node: /lib64/libstdc++.so.6: version `
:::

安装NVM与NodeJS步骤：

1. 使用git下载nvm源代码
```Bash
# 用git从github下载nvm源码。
git clone https://github.com/cnpm/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
```
::: info 问题
若您的服务器 因为网络限制 无法访问github，可使用国内的gitee下载nvm源码：

`git clone https://gitee.com/koalakit/nvm.git ~/.nvm && cd ~/.nvm && git checkout \`git describe --abbrev=0 --tags``
:::

1. 使用nvm安装Nodejs
```Bash
# 1. 将nvm设置为系统环境变量
echo "source ~/.nvm/nvm.sh" &gt;&gt; ~/.bashrc

# 2. 更新变量环境
source ~/.bashrc

# 3. 安装 nodejs ， 这里举例使用 Node 22（与官方 README 要求一致），其它版本请自行按需选择
nvm install 22
```
::: tip 提示
题外话：
用 `nvm list-remote` 命令可查看所有可安装的nodejs版本
用 `nvm ls`可查看所有已安装到本地的nodejs 版本
:::

1. 安装yarn环境
NodeJS 自带了 NPM（Node Package Manager），他可以用来安装打包编译NotionNext这类基于Webpack打包的项目。不过npm不太好用，这里安装一个npm升级版yarn。
```Java
# 1.【可选步骤】 NPM切换国内淘宝网镜像，便于加速安装。
npm config set registry https://registry.npmmirror.com

# 2. npm 全局安装 yarn
npm install -g yarn
```

NodeJs运行NotionNext

1. 安装NotionNext依赖
```JavaScript
# 执行以下命令，使用yarn安装项目所有依赖的脚本和库
yarn
```
如果你没有安装yarn，也可以用 `npm install` 命令进行安装依赖。

1. 项目编译
每次`修改代码`，包括`修改blog.config.js文件`的内容后，都需要重新执行这步骤。
```Bash
# 2.打包编译
yarn build

# 3.将你的notion_page_id设为环境变量，例如：
NOTION_PAGE_ID=29d5ia78b858e4a3bbc13e51b5400fb82
```

1. 启动项目
```JavaScript
# 执行命令启动
yarn start
```
<details>
<summary>执行效果记录</summary>

```Bash
[root@tangly1024 NotionNext]# yarn
yarn install v1.22.19
info No lockfile found.
[1/4] Resolving packages...
warning react-notion-x &gt; react-use &gt; nano-css &gt; sourcemap-codec@1.4.8: Please use @jridgewell/sourcemap-codec instead
warning valine &gt; leancloud-storage &gt; uuid@3.4.0: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
warning valine &gt; leancloud-storage &gt; leancloud-realtime &gt; uuid@3.4.0: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
warning valine &gt; leancloud-storage &gt; superagent@3.8.3: Please upgrade to v7.0.2+ of superagent.  We have fixed numerous issues with streams, form-data, attach(), filesystem errors not bubbling up (ENOENT on attach()), and all tests are now passing.  See the releases tab for more information at &lt;https://github.com/visionmedia/superagent/releases&gt;.
warning valine &gt; leancloud-storage &gt; superagent &gt; formidable@1.2.6: Please upgrade to latest, formidable@v2 or formidable@v3! Check these notes: https://bit.ly/2ZEqIau
warning valine &gt; leancloud-storage &gt; leancloud-realtime &gt; @leancloud/platform-adapters-browser &gt; @leancloud/adapters-superagent &gt; superagent@5.3.1: Please upgrade to v7.0.2+ of superagent.  We have fixed numerous issues with streams, form-data, attach(), filesystem errors not bubbling up (ENOENT on attach()), and all tests are now passing.  See the releases tab for more information at &lt;https://github.com/visionmedia/superagent/releases&gt;.
warning valine &gt; leancloud-storage &gt; leancloud-realtime &gt; @leancloud/platform-adapters-browser &gt; @leancloud/adapters-superagent &gt; superagent &gt; formidable@1.2.6: Please upgrade to latest, formidable@v2 or formidable@v3! Check these notes: https://bit.ly/2ZEqIau
warning @waline/client &gt; vue &gt; @vue/compiler-sfc &gt; magic-string &gt; sourcemap-codec@1.4.8: Please use @jridgewell/sourcemap-codec instead
[2/4] Fetching packages...
[3/4] Linking dependencies...
warning "gitalk &gt; react-flip-move@2.9.14" has incorrect peer dependency "react@0.13.x || 0.14.x || 15.x.x".
warning "gitalk &gt; react-flip-move@2.9.14" has incorrect peer dependency "react-dom@0.13.x || 0.14.x || 15.x.x".
warning "react-facebook &gt; react-spinner-children@1.0.8" has incorrect peer dependency "react@15.x || 16.x".
warning " &gt; react-messenger-customer-chat@0.8.0" has incorrect peer dependency "react@^0.14.0 || ^15.0.0-0 || ^16.0.0-0".
warning "react-notion-x &gt; react-lazy-images@1.1.0" has incorrect peer dependency "react@^15 || ^16".
warning "react-notion-x &gt; react-lazy-images@1.1.0" has incorrect peer dependency "react-dom@^15 || ^16".
warning "react-notion-x &gt; react-image@4.0.3" has unmet peer dependency "@babel/runtime@&gt;=7".
warning "react-notion-x &gt; react-pdf &gt; file-loader@6.2.0" has unmet peer dependency "webpack@^4.0.0 || ^5.0.0".
warning "eslint-config-next &gt; @typescript-eslint/parser &gt; @typescript-eslint/typescript-estree &gt; tsutils@3.21.0" has unmet peer dependency "typescript@&gt;=2.8.0 || &gt;= 3.2.0-dev || &gt;= 3.3.0-dev || &gt;= 3.4.0-dev || &gt;= 3.5.0-dev || &gt;= 3.6.0-dev || &gt;= 3.6.0-beta || &gt;= 3.7.0-dev || &gt;= 3.7.0-beta".
[4/4] Building fresh packages...
success Saved lockfile.
Done in 214.69s.
[root@tangly1024 NotionNext]# yarn build
yarn run v1.22.19
$ next build && next-sitemap --config next-sitemap.config.js
info  - Loaded env from /root/NotionNext/.env.local
Attention: Next.js now collects completely anonymous telemetry regarding usage.
This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://nextjs.org/telemetry

info  - Checking validity of types
info  - Creating an optimized production build
info  - Compiled successfully
info  - Collecting page data .[请求API] from:page-paths id:02ab3b8678004aa69e9e415905ef32a5
[请求API] from:tag-static-path id:02ab3b8678004aa69e9e415905ef32a5
[请求API] from:tag-page-static-path id:02ab3b8678004aa69e9e415905ef32a5
info  - Collecting page data ..[请求API] from:category-paths id:02ab3b8678004aa69e9e415905ef32a5
[请求API] from:category-paths id:02ab3b8678004aa69e9e415905ef32a5
info  - Collecting page data ...[响应成功]: from:page-paths
[API耗时] 1754ms
info  - Collecting page data .[响应成功]: from:tag-static-path
[API耗时] 1736ms
[响应成功]: from:tag-page-static-path
[API耗时] 1714ms
info  - Collecting page data ..[响应成功]: from:category-paths
[API耗时] 1778ms
info  - Collecting page data ...[响应成功]: from:category-paths
[API耗时] 2140ms
info  - Collecting page data
[    ] info  - Generating static pages (0/23)[请求API] from:search-props id:02ab3b8678004aa69e9e415905ef32a5
[请求API] from:404 id:02ab3b8678004aa69e9e415905ef32a5
[请求API] from:index id:02ab3b8678004aa69e9e415905ef32a5
[请求API] from:category-index-props id:02ab3b8678004aa69e9e415905ef32a5
[请求API] from:archive-index id:02ab3b8678004aa69e9e415905ef32a5
[请求API] from:tag-index-props id:02ab3b8678004aa69e9e415905ef32a5
[请求API] from:search-props id:02ab3b8678004aa69e9e415905ef32a5
[=== ] info  - Generating static pages (8/23)[响应成功]: from:tag-index-props
[API耗时] 1587ms
[请求API] from:search-props id:02ab3b8678004aa69e9e415905ef32a5
[响应成功]: from:404
[API耗时] 1668ms
[请求API] from:tag-props id:02ab3b8678004aa69e9e415905ef32a5
[响应成功]: from:index
[API耗时] 1774ms
[响应成功]: from:search-props
[API耗时] 1819ms
[响应成功]: from:archive-index
[API耗时] 1788ms
[请求API] from:tag-props id:02ab3b8678004aa69e9e415905ef32a5
[请求API] from:tag-props id:02ab3b8678004aa69e9e415905ef32a5
[响应成功]: from:search-props
[API耗时] 1737ms
[请求API] from:tag-props id:02ab3b8678004aa69e9e415905ef32a5
[请求API] from:category-props id:02ab3b8678004aa69e9e415905ef32a5
[ ===] info  - Generating static pages (14/23)[响应成功]: from:category-index-props
[API耗时] 1958ms
[请求API] from:category-props id:02ab3b8678004aa69e9e415905ef32a5
[   =] info  - Generating static pages (15/23)[响应成功]: from:search-props
[API耗时] 1720ms
[响应成功]: from:tag-props
[API耗时] 1687ms
[    ] info  - Generating static pages (17/23)[响应成功]: from:category-props
[API耗时] 1606ms
[响应成功]: from:tag-props
[API耗时] 1707ms
[响应成功]: from:tag-props
[API耗时] 1698ms
[响应成功]: from:tag-props
[API耗时] 1728ms
[响应成功]: from:category-props
[API耗时] 1730ms
info  - Generating static pages (23/23)
info  - Finalizing page optimization

Page                                                          Size     First Load JS
┌ ● / (ISR: 5 Seconds) (1930 ms)                              524 B           543 kB
├   /_app                                                     0 B             542 kB
├ ● /[...slug]                                                1.58 kB         544 kB
├ ○ /404 (1811 ms)                                            640 B           543 kB
├ ● /archive (ISR: 1 Seconds) (1806 ms)                       656 B           543 kB
├ ● /category (ISR: 1 Seconds) (2097 ms)                      667 B           543 kB
├ ● /category/[category] (ISR: 1 Seconds) (3373 ms)           707 B           543 kB
├   ├ /category/技术分享 (1748 ms)
├   └ /category/学习思考 (1619 ms)
├ ● /category/[category]/page/[page]                          716 B           543 kB
├ λ /feed                                                     249 B           542 kB
├ ● /page/[page]                                              652 B           543 kB
├ ● /search (ISR: 1 Seconds) (1944 ms)                        801 B           543 kB
├ ● /search/[keyword] (ISR: 1 Seconds) (1899 ms)              678 B           543 kB
├   └ /search/NotionNext BLOG (1759 ms)
├ ● /search/[keyword]/page/[page] (ISR: 1 Seconds) (1867 ms)  687 B           543 kB
├   └ /search/NotionNext BLOG/page/1 (1735 ms)
├ ● /tag (ISR: 1 Seconds) (1606 ms)                           651 B           543 kB
├ ● /tag/[tag] (ISR: 1 Seconds) (6924 ms)                     679 B           543 kB
├   ├ /tag/开发 (1743 ms)
├   ├ /tag/思考 (1730 ms)
├   ├ /tag/建站 (1715 ms)
├   └ /tag/文字 (1709 ms)
└ ● /tag/[tag]/page/[page]                                    687 B           543 kB
+ First Load JS shared by all                                 542 kB
  ├ chunks/framework-bb5c596eafb42b22.js                      42.1 kB
  ├ chunks/main-c9bcff17d385c69a.js                           28.7 kB
  ├ chunks/pages/_app-e8a826e85bd57a50.js                     469 kB
  ├ chunks/webpack-de079d6da0c84f1e.js                        2.32 kB
  └ css/02c66091ce82e882.css                                  31.3 kB

λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
○  (Static)  automatically rendered as static HTML (uses no initial props)
●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
   (ISR)     incremental static regeneration (uses revalidate in getStaticProps)

Loaded env from /root/NotionNext/.env.local
Done in 113.42s.
[root@tangly1024 NotionNext]# yarn start
yarn run v1.22.19
$ next start
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Loaded env from /root/NotionNext/.env.local
```

</details>


## 三、访问项目

::: tip 提示
项目默认将在 3000端口启动，访问你的服务器 [http://ip:3000](http://ip:3000) 即可打开网站。
:::

::: tip 提示
有时候3000端口可能无法访问，原因是服务器防火墙，以及云服务厂商的安全组限制。
:::

<details>
<summary>关于阿里云服务器安全组 点击展开</summary>

阿里云在云服务器ECS→安全组中，手动添加一个安全组，暴露端口3000，授权对象0.0.0.0/0 表示所有ip的人都可以访问这个端口。另外，推荐再添加一个80端口暴露的安全组，便于nginx访问。
![Untitled](/legacy/d20ed0cf81e3daa7.png)

</details>

- 访问效果，用服务器ip加端口号打开了网页

![Untitled](/legacy/14cdfe822241c594.png)

::: tip 提示
这种模式运行，您的服务器控制台会实时打印出网站的日志，以便于调试和排查问题。
:::


## 四、NodeJS项目后台运行

::: warning 注意
若使用的是系统的NodeJs方式运行，则需要此处的步骤进行后台挂起，若用的是Docker运行，则此章节的文档可以忽略。
:::

直接使用 `yarn start`启动服务主要用于调试排查日志，一旦你关闭ssh终端或登出服务器，这个进程也会随之关闭。


### 方式一：nohup运行

nohup是linux系统的指令，用于在系统后台不挂断地运行命令。为了让你的网站始终在后台保持运行，可以用以下方式：

1. 按`ctrl+c` 退出上面正运行的yarn进程

1. 改用nohup运行
```Bash
cd NotionNext

nohup yarn start &gt;/dev/null 2&gt;&1 &
```
::: tip 提示
若想要输出日志文件，可执行`nohup yarn start &gt; notionnext.log 2&gt;&1 &`；
:::
<details>
<summary>执行结果</summary>

```Bash
[root@tangly1024 ~]# nohup yarn start &gt;/dev/null 2&gt;&1 &
[1] 5240
# 会打印出后台 运行的进程号。
```

</details>


#### 如何关闭进程

```Bash
pkill -f "yarn start"
```


### 方式二：使用PM2管理NotionNext

PM2作为Node的进程管理工具，可以提升您维护站点的效率，您可以阅读《[**使用PM2启动Notionnext实现多开和进程守护**](https://jjdctg.com/pm2)**》获取帮助。**

[https://jjdctg.com/pm2](https://jjdctg.com/pm2)


## 五、NodeJS网站崩溃问题

::: warning 注意
此处特指用Nodejs运行项目可能出现的问题，若使用docker运行则可忽略此章节文档。
:::

部分网友的服务器运行NotionNext站点后，总会出现过一段时间 站点进程莫名其妙被杀死，导致网站暂停，这个问题，我目前还没有找到原因，也有可能是服务器配置不够导致的。

如果您的站点出现这种情况，可以尝试这种做法，创建一个启动脚本启动网站，并且实时检测网站关闭时自动启动站点：

1. 创建一个脚本`**start_yarn.sh**`** 在服务器NotionNext文件夹下，**脚本的内容如下：

```Bash
#!/bin/bash

while true; do
    # 检查 Yarn 进程是否存在
    if pgrep -x "yarn" &gt; /dev/null; then
        echo "Yarn process is already running."
    else
        # 执行命令
        nohup yarn start &gt;/dev/null 2&gt;&1 &

        # 获取最新启动的进程ID
        pid=$!

        echo "Yarn process started with PID: $pid"
    fi

    # 等待一段时间后重新执行
    sleep 5
done
```

<details>
<summary>如何将此脚本粘贴到文件中并保存？</summary>

```Bash
# 进入项目文件夹
cd NotionNext
# 用编辑器创建并打开这个文件
vim start_yarn.sh

# 按键盘上的 i ， 进入INSERT编辑模式
# 复制上方的脚本内容，按下快捷键 SHIRT + Insert 键粘贴到start_yarn.sh
# 按键盘的的Esc件，退出编辑模式
# 输入 :wq  在按下回车键，保存脚本。
```

</details>

1. 为这个脚本添加可执行的权限
```Bash
chmod +x start_yarn.sh
```

1. 运行启动脚本
```Bash
nohup ./start_yarn.sh &gt; /dev/null 2&gt;&1 &
```

1. 运行关闭脚本
```Bash
pkill -f "yarn"
```


## 六、关于本地代码配置修改

::: warning 注意
如果用Docker方案，建议直接修改**NOTION_CONFIG**或**配置文件config.js**，因为Docker对环境变量的兼容性不太够。
:::


### 1.用环境变量修改配置

::: tip 提示
用环境变量的好处是，不需要修改代码，不用重新打包编译。直接重启服务即可。
:::

- `NOTION_PAGE_ID`等诸多配置支持用环境变量配置。
```Bash
# 1.设置环境变量
NOTION_PAGE_ID=29d5ia78b858e4a3bbc13e51b5400fb82
# 2.关闭旧进程
# 命令参考上文
# 3.后台运行
nohup yarn start &gt;/dev/null 2&gt;&1 &
```
::: tip 提示
删除环境变量可用以下命令： `unset NOTION_PAGE_ID`
:::

- 支持环境变量的配置可参考[blog.config.js](https://github.com/notionnext-org/NotionNext/blob/main/blog.config.js) 文件


### 2.修改代码

- 如果修改blog.config.js或其他代码文件，NodeJS环境需要重新执行 `yarn build` 才可 生效，Docker环境重新执行前面的docker build 相关命令即可重新构建镜像。

- 您可以在项目根目录的[`.env.local`](https://github.com/notionnext-org/NotionNext/blob/main/.env.local)文件中配置您的环境变量

- 重新编译后需要先关闭旧进程，再用 `yarn start` 重启服务 。


### 3.自定义端口

使用系统的NodeJS环境部署，假如3000端口被占用，或您想多开notionnext可用以下命令指定端口

```Bash
yarn start -p 8080
# -p [自定义端口号]
```

若是Docker环境运行，则使用Docker自带的端口映射功能即可。

```Bash
docker run -d -p 8080:3000 --name app my-app
```


## 隐藏端口：Nginx反向代理

- 为了隐藏你的3000端口号，用一个nginx就可以，如果你有宝塔面板之类的运维工具可以很方便地一键配置。

- 小白安装nginx
```Bash
# 添加nginx源
sudo rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm

# 安装nginx
sudo yum install nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```
<details>
<summary>安装成功访问服务器地址 效果：</summary>

![Untitled](/legacy/5230d0a76a185ecc.png)

</details>

- 反向代理配置参考
修改相关配置文件 `/etc/nginx/conf.d/default.conf`
```Bash
# 用vi编辑器修改
vi /etc/nginx/conf.d/default.conf

# 在 `location /` 下增加一行
proxy_pass  http://127.0.0.1:3000;

# 刷新ng配置
sudo systemctl reload nginx
```
![Untitled](/legacy/d9c0b9c8993d87de.png)
![Untitled](/legacy/57309076477fc1c5.png)
::: tip 提示
如果访问出错可能是SELinux设置不允许nginx的转发 ，执行 `setsebool -P httpd_can_network_connect on` 即可修复。
:::

## VPS部署NotionNext如何自动更新？
因为代码是在自己的服务器上拉取和部署，所以每次都要执行更新代码，编译代码，并重启服务的步骤，建议是创建一个`update.sh`脚本在服务器上。
示例代码，仅供参考：
```Bash
#!/bin/bash

# 切换到工作目录
cd NotionNext

# 从仓库更新拉取最新代码
git pull https://github.com/notionnext-org/NotionNext

# 编译新版代码
yarn build

# 启动
yarn start
```
这是最简易的自动脚本，当然也可以做成可交互的高级脚本。

## 原文链接

https://docs.tangly1024.com/article/deploy-notion-next-on-vps
