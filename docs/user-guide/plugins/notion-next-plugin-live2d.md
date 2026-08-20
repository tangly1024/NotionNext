# Live2D宠物插件
> 迁移自：[Live2D宠物插件](https://docs.tangly1024.com/article/notion-next-plugin-live2d)
> 发布日期：2023-6-30
> 最后编辑：2024-9-7
> 原栏目：🧷 外部扩展

## 介绍

《Live2D》是一种应用于电子游戏的绘图渲染技术，技术由日本Cybernoids公司开发。通过一系列的连续图像和人物建模来生成一种类似三维模型的二维图像，对于以动画风格为主的冒险游戏来说非常有用，缺点是Live 2D人物无法大幅度转身，开发商正设法让该技术可显示360度图像。

开启Live2D宠物挂件后，你的页面的角落会出现这样一只可爱宠物，并且它会跟随着你的鼠标位置动起来。

![Untitled](/legacy/4ee50f29ad6388ed.png)


## 开启配置

目前所有主题都支持宠物挂件。

开启方式，源文件在[blog.config.js](https://github.com/notionnext-org/NotionNext/blob/8103e23aac7219789c77e412a1bc24dd2a2683b5/blog.config.js#L152C2-L158C1)中，默认是开状态

```JavaScript
// 悬浮挂件
  WIDGET_PET: process.env.NEXT_PUBLIC_WIDGET_PET || true, // 是否显示宠物挂件
  WIDGET_PET_LINK:
      process.env.NEXT_PUBLIC_WIDGET_PET_LINK ||
      'https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json', // 挂件模型地址 @see https://github.com/xiazeyu/live2d-widget-models
  WIDGET_PET_SWITCH_THEME: true, // 点击宠物挂件切换博客主题
```

您也可以直接通过设置环境变量`NEXT_PUBLIC_WIDGET_PET ` 的方式来控制开关


## 切换模型

`WIDGET_PET_LINK` 这个参数制定的是动画模型的加载地址，目前默认使用的是茶杯狗。

::: tip 提示
由于每个动画模型的高度不同，可能需要您在[代码中](https://github.com/notionnext-org/NotionNext/blob/8103e23aac7219789c77e412a1bc24dd2a2683b5/components/Live2D.js#L38)修改模型的高度height，否则会很怪异。

```HTML
&lt;canvas id="live2d" className='cursor-pointer' width="280" **height="250"** onClick={handleClick} alt='切换主题' title='切换主题' /&gt;
```
:::


## 模型预览

例如您想使用 `live2d-widget-model-chitose` 这个模型，则可以将`WIDGET_PET_LINK `的值设置为

```Bash
https://cdn.jsdelivr.net/npm/**live2d-widget-model-chitose**/assets/**chitose.model.json**
```

1. 黑猫
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-hijiki/assets/hijiki.model.json
```
![Untitled](/legacy/4199ef4729429e73.png)

1. 白猫
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-tororo/assets/tororo.model.json
```
![Untitled](/legacy/9ac5c4ab002221c5.png)

1. chitose
```Bash
https://cdn.jsdelivr.net/npm/**live2d-widget-model-chitose**/assets/**chitose.model.json**
```
![Untitled](/legacy/2934fea2d1ee712e.png)

1. epsilon
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-epsilon2_1/assets/Epsilon2.1.model.json
```
![Untitled](/legacy/8572a6008a00f41e.png)

1. gf
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-gf/assets/Gantzert_Felixander.model.json
```
![Untitled](/legacy/bbdd5ddaaf3aa98e.png)

1. haru
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-haru/01/assets/haru01.model.json
```
![Untitled](/legacy/6ca557acd1ae6f8e.png)

1. haru2
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-haru/02/assets/haru02.model.json
```
![Untitled](/legacy/e58027665da56ea5.png)

1. はると（haruto-遥人）
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-haruto/assets/haruto.model.json
```
![Untitled](/legacy/4b91e758edb6f693.png)

1. hibiki
高度需要调整为 `900`
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-hibiki/assets/hibiki.model.json
```
![Untitled](/legacy/ec1823e23d700412.png)

1. izumi
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-izumi/assets/izumi.model.json
```
![Untitled](/legacy/8c945e2b63ff72c3.png)

1. koharu
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-koharu/assets/koharu.model.json
```
![Untitled](/legacy/72272ed91d37d81c.png)

1. ni-j
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-ni-j/assets/ni-j.model.json
```
![Untitled](/legacy/85868bd777ece1fe.png)

1. miku
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-miku/assets/miku.model.json
```
![Untitled](/legacy/a1dd1dfbce449151.png)

1. nico
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-nico/assets/nico.model.json
```
![Untitled](/legacy/bc9f14486069cce1.png)

1. nietzche
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-nietzsche/assets/nietzche.model.json
```
![Untitled](/legacy/c5b5834a76180b3a.png)

1. nipsilon
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-nipsilon/assets/nipsilon.model.json
```
![Untitled](/legacy/d534621bb182382d.png)

1. nito
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-nito/assets/nito.model.json
```
![Untitled](/legacy/385eb189005f4483.png)

1. shizukui
建议高度500
```Bash
https://cdn.jsdelivr.net/npm/live2d-widget-model-shizuku/assets/shizuku.model.json
```
![Untitled](/legacy/9d64e0dc3f6b7766.png)

1. tsumiki
建议高度500
```HTML
https://cdn.jsdelivr.net/npm/live2d-widget-model-tsumiki/assets/tsumiki.model.json
```
![Untitled](/legacy/4593da0ca3febefb.png)

1. unitychan
```HTML
https://cdn.jsdelivr.net/npm/live2d-widget-model-unitychan/assets/unitychan.model.json
```
![Untitled](/legacy/46e48d76c9f64dce.png)

1. 茶杯狗
```HTML
https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko/assets/wanko.model.json
```
![Untitled](/legacy/e1ec4c6304945a24.png)

1. z16
建议高度500
```HTML
https://cdn.jsdelivr.net/npm/live2d-widget-model-z16/assets/z16.model.json
```
![Untitled](/legacy/36a00d0b066c28df.png)


## 更多模型预览

访问以下链接，在线预览102个模型，需要全程科学访问。
这些模型暂时没有cdn、用的github仓库链接，可能影响加载速度和国内访问，如果更好的cdn链接，欢迎提供分享。

[Live2d Cubism 2](https://imuncle.github.io/live2d/)


### 部分模型截图

1. bilibili-22娘
```Bash
https://raw.githubusercontent.com/imuncle/live2d/master/model/22/model.default.json
```
![Untitled](/legacy/89444792f938d6c0.png)

1. bilibili-22娘长高版本
```Bash
https://raw.githubusercontent.com/imuncle/live2d/master/model/22_high/model.json
```
![Untitled](/legacy/d30ab38b0f0ac5b1.png)

1. bilibili-33娘
```Bash
https://raw.githubusercontent.com/imuncle/live2d/master/model/33/model.default.json
```
![Untitled](/legacy/c39ff7d5efcd184d.png)

1. bilibili-33娘长高版本
```Bash
https://raw.githubusercontent.com/imuncle/live2d/master/model/33_high/model.default.json
```
![Untitled](/legacy/8b3f51dde9b19e12.png)

1. 布洛妮娅
```Bash
model/bronya/model.json
```
![Untitled](/legacy/10eb07dd2b559f66.png)

1. 布洛妮娅2
```Bash
model/bronya_1/model.json
```
![Untitled](/legacy/39ebbfd584e7cb81.png)

1. はる（haru-春）
```Bash
model/haru/haru_01.model.json
```
![Untitled](/legacy/48bf9ac8959ccb0b.png)

1. 茵蒂克丝(index)
```Bash
model/index/model.json
```
![Untitled](/legacy/e43a9669b471863c.png)

1. izumi
```Bash
model/izumi/izumi.model.json
```
![Untitled.png](/legacy/7ab2352d8aec11bc.png)

1. katou
```Bash
model/katou_01/katou_01.model.json
```
![Untitled](/legacy/cc8a8962514ed213.png)
  1. liang
```Bash
model/liang/2.json
```
![Untitled](/legacy/16d1864f8f85a160.png)

15. miku

```Bash
model/miku/miku.model.json
```
![Untitled](/legacy/82c89db882e03425.png)

1. 小埋 murakumo
```Bash
model/miku/miku.model.json
```
![Untitled](/legacy/c5a1c6abc98582de.png)

1. 茶杯狗
```Bash
model/wanko/wanko.model.json
```
![Untitled](/legacy/2262393472ab6397.png)

1. shizuku
```Bash
model/shizuku/shizuku.model.json
```
![Untitled](/legacy/3022275d3d00a675.png)
  1. pio
```Bash
model/Pio/model.json
```
![Untitled](/legacy/3bbf62118fea484b.png)
  1. 血小板
```Bash
model/platelet/model.json
```
![Untitled](/legacy/cee7f976febcb11b.png)
  1. 血小板 迷你
```Bash
model/platelet-2/model.json
```
![Untitled](/legacy/fd3c5fd936763c23.png)
  1. 蕾姆
```Bash
model/rem/model.json
```
![Untitled](/legacy/12607647a92df500.png)
  1. Tia
```Bash
model/Tia/index.json
```
![Untitled](/legacy/423d4c61ee411212.png)
  1. penchan
```Bash
model/penchan/penchan.model.json
```
![Untitled](/legacy/ed56c224216abc7a.png)
  1. dollsfrontline
```Bash
model/dollsfrontline/95type_405/normal/model.json
```
![Untitled](/legacy/1f558e7246bb5c81.png)
  1. dollsfrontline-armor
```Bash
model/dollsfrontline/armor/model1.json
```
![Untitled](/legacy/815545b517aab520.png)
  1. dollsfromtline-command
```Bash
model/dollsfrontline/command/model1.json
```
![Untitled](/legacy/4a73e7cac588b914.png)
  1. 当麻
```Bash
model/touma/touma.model.json
```
![Untitled](/legacy/6a2e315c9b4685ae.png)


## 最后

以上使用的是Cubism2版本的动画模型，您还可以体验一下以下Cubism3版本的动画模型。

高版本的模型支持更丰富更细节的动画，结合AI对话接口，有很大的开发空间。这里有点超纲，仅供预览，暂时不做支持，在线预览网址：

[Live2d Cubism 3](https://imuncle.github.io/live2d/live2d_3/)

![Untitled](/legacy/4bea1de64aad2e88.png)


## 参考

[https://github.com/imuncle/live2d](https://github.com/imuncle/live2d)

[live2d-widget-models/packages at master · xiazeyu/live2d-widget-models](https://github.com/xiazeyu/live2d-widget-models/tree/master/packages)

The model library for live2d-widget.js. Contribute to xiazeyu/live2d-widget-models development by creating an account on GitHub.

## 原文链接

https://docs.tangly1024.com/article/notion-next-plugin-live2d
