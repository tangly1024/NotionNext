// 这里编写自定义js脚本；将被静态引入到页面中
        // ==UserScript==
// @name                #相亲相爱一嘉人#
// @description         在哔站右下角添加嘉然小姐的live2d模型
// @version             1.0.1
// @namespace           https://github.com/journey-ad
// @author              journey-ad
// @include             /^https:\/\/(www|live|space|t)\.bilibili\.com\/.*$/
// @icon                https://www.google.com/s2/favicons?domain=bilibili.com
// @license             GPL v2
// @run-at              document-end
// @grant               none
// ==/UserScript==

(async function () {
  'use strict';

  if (inIframe()) {
    console.log('iframe中不加载');
    return false;
  }

  const 引流 = [
    "https://space.bilibili.com/672328094",
    "https://www.bilibili.com/video/BV1FZ4y1F7HH",
    "https://www.bilibili.com/video/BV1FX4y1g7u8",
    "https://www.bilibili.com/video/BV1aK4y1P7Cg",
    "https://www.bilibili.com/video/BV17A411V7Uh",
    "https://www.bilibili.com/video/BV1JV411b7Pc",
    "https://www.bilibili.com/video/BV1AV411v7er",
    "https://www.bilibili.com/video/BV1564y1173Q",

    "https://www.bilibili.com/video/BV1MX4y1N75X",
    "https://www.bilibili.com/video/BV17h411U71w",
    "https://www.bilibili.com/video/BV1ry4y1Y71t",
    "https://www.bilibili.com/video/BV1Sy4y1n7c4",
    "https://www.bilibili.com/video/BV15y4y177uk",
    "https://www.bilibili.com/video/BV1PN411X7QW",
    "https://www.bilibili.com/video/BV1Dp4y1H7iB",
    "https://www.bilibili.com/video/BV1bi4y1P7Eh",
    "https://www.bilibili.com/video/BV1vQ4y1Z7C2",
    "https://www.bilibili.com/video/BV1oU4y1h7Sc",
  ]

  const CUSTOM_CSS = `#pio-container {
  display: block !important;
  bottom: -0.3rem;
  z-index: 22637261;
  transition: transform 0.3s;
  cursor: grab;
}

#pio-container:hover {
  transform: translateY(-0.3rem);
}

#pio-container:active {
  cursor: grabbing;
}

#pio-container .pio-dialog {
  right: 10%;
  line-height: 1.5;
  background: rgba(255, 255, 255, 0.9);
}

#pio {
  height: 240px;
}

.pio-action .pio-home {
  display: none;
}

.pio-action span {
  background: none;
  background-size: 100%;
  border: 1px solid #fdcf7b;
  border: 0;
  width: 2em;
  height: 2em;
  margin-bottom: 0.6em;
}

.pio-action .pio-skin {
  background: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 512c0 282.774 229.226 512 512 512s512-229.226 512-512S794.774 0 512 0 0 229.226 0 512z' fill='%23FEC43C'/%3E%3Cpath d='M1013.76 408.576C965.632 175.104 759.808 0 512 0 229.376 0 0 229.376 0 512c0 123.904 44.032 236.544 116.736 324.608 87.04 48.128 186.368 74.752 292.864 74.752 301.056 0 550.912-217.088 604.16-502.784z' fill='%23FFD73A'/%3E%3Cpath d='M233.456 460.383a93.759 93.759 0 1 0 187.526 0c0-51.783-41.984-93.76-93.767-93.76s-93.759 41.977-93.759 93.76zm458.39 0c0 51.782 41.976 93.759 93.759 93.759s93.759-41.984 93.759-93.76c0-51.782-41.984-93.758-93.76-93.758-51.782 0-93.758 41.976-93.758 93.759z' fill='%23873A18'/%3E%3Cpath d='M556.41 689.577H410.561c-17.707 0-31.256-13.548-31.256-31.255 0-17.715 13.549-31.256 31.256-31.256h145.85c17.714 0 31.255 13.548 31.255 31.256s-13.549 31.255-31.256 31.255zM320.97 429.127H156.357c-14.588 0-27.089-13.548-27.089-31.256s12.5-31.247 27.097-31.247H320.96c14.58 0 27.089 13.54 27.089 31.247 0 17.715-12.509 31.256-27.097 31.256zm454.215 0H618.92c-17.715 0-31.255-13.548-31.255-31.256s13.548-31.247 31.255-31.247h156.263c17.715 0 31.255 13.54 31.255 31.247 0 17.715-13.548 31.256-31.255 31.256z' fill='%23873A18'/%3E%3Cpath d='M102.4 327.68C46.08 327.68 0 281.6 0 225.28 0 133.12 102.4 0 102.4 0s102.4 133.12 102.4 225.28c0 56.32-46.08 102.4-102.4 102.4z' fill='%2361A3E0'/%3E%3C/svg%3E");
}

.pio-action .pio-info {
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Crect transform='rotate(45.001 238.211 363.575)' x='29.285' y='22.411' width='273.903' height='505.038' rx='70' ry='70' fill='%23dcdcdc'/%3E%3Cpath d='M218.543 249.999l-47.186 47.186c-8.987 8.988-8.987 22.47 0 31.457 8.988 8.988 22.47 8.988 31.457 0L250 281.456l15.728 15.729c17.976 17.976 17.976 46.063 0 64.038l-64.037 64.038c-17.976 17.975-46.063 17.975-64.038 0l-64.038-64.038c-17.975-17.975-17.975-46.062 0-64.038l64.038-64.037c17.975-17.976 46.062-17.976 64.038 0l16.852 16.851z' fill='%23fff'/%3E%3Cpath d='M281.457 249.999l47.186-47.186c8.988-8.987 8.988-22.469 0-31.457-8.987-8.987-22.469-8.987-31.457 0L250 218.542l-15.729-15.729c-17.975-17.975-17.975-46.062 0-64.037l64.038-64.038c17.975-17.975 46.062-17.975 64.038 0l64.037 64.038c17.977 17.975 17.977 46.062 0 64.037l-64.037 64.038c-17.976 17.976-46.063 17.976-64.038 0l-16.852-16.852z' fill='%2361a3e0'/%3E%3C/svg%3E");
}

.pio-action .pio-top {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M262.737 70.075c-3.175-2.89-8.439-5.365-12.737-5.365-4.29 0-9.448 2.37-12.632 5.263l-87.814 87.812c-2.921 3.255-5.23 8.518-5.23 12.73 0 4.203 2.196 9.353 5.118 12.617 3.246 2.915 8.621 5.345 12.842 5.345 4.203 0 9.353-2.197 12.617-5.118l75.093-74.848 74.992 74.993c3.175 2.889 8.433 5.359 12.731 5.359 4.29 0 9.448-2.371 12.632-5.263 2.918-3.247 5.329-8.61 5.329-12.827 0-4.204-2.197-9.354-5.118-12.616zm-103.97 233.514v-36.181H19.695v36.181h51.447v131.444h36.178V303.589zm126.788-35.923h-63.85c-8.732.187-18.571 3.868-25.539 10.451-6.579 6.961-10.367 16.85-10.557 25.589v95.488c.179 8.709 3.781 18.668 10.493 25.582 6.913 6.712 16.839 10.334 25.548 10.514h63.849c8.732-.187 18.571-3.868 25.538-10.45 6.581-6.962 10.368-16.852 10.558-25.59v-95.488c-.187-8.733-3.87-18.573-10.452-25.539-6.962-6.581-16.85-10.367-25.588-10.557zm-.14 131.589l.003.105.403.021a20.74 20.74 0 0 0-.322-.013h-.08c.006.172.014.313.021.414l-.027-.414h-.118l.01-.013.107.005-.007-.117-.033.025-.079.1h-63.648l-.106.003-.032.438c.007-.092.015-.243.021-.438-.163.005-.283.012-.365.017l.365-.023.003-.139-.055-.039-.301-.208.356.244.001-.029v-95.493a3.627 3.627 0 0 0-.004-.108l-.417-.028c.106.007.253.014.417.019a10.069 10.069 0 0 0-.023-.42l.031.42.123.004.016-.022.087-.113.036-.047-.137.182.044.001h63.551l.096.074.064.05-.001.049zm184.441-121.032c-6.963-6.58-16.852-10.367-25.59-10.557h-88.627V435.29h36.181v-68.165h52.39c8.732-.187 18.572-3.87 25.54-10.452 6.579-6.961 10.366-16.851 10.556-25.588v-27.323c-.187-8.733-3.868-18.572-10.45-25.539zm-25.471 52.609l.003.105.437.032a10.682 10.682 0 0 0-.437-.021c.007.211.017.355.023.436l-.033-.436a79.554 79.554 0 0 0-.142-.003l-.038.054-.112.166-.119.175.262-.396H391.82v-27.099h52.451l.112-.004.025-.405a14.96 14.96 0 0 0-.018.405c.171-.006.313-.015.416-.023l-.416.031-.004.122-.01-.008.007-.113-.119.008.041.054.081.062-.001.045z' fill='%234c4c4c'/%3E%3C/svg%3E");
}

.pio-action .pio-close {
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M249.999 198.668L352.665 96c14.667-14.666 36.668-14.666 51.335 0 14.666 14.667 14.666 36.668 0 51.334L301.333 250 404 352.668c14.666 14.667 14.666 36.666 0 51.332-14.667 14.667-36.667 14.667-51.334 0L249.999 301.334 147.333 404c-14.668 14.667-36.666 14.667-51.334 0-14.666-14.666-14.666-36.665 0-51.332L198.666 250 95.999 147.334c-14.666-14.666-14.666-36.667 0-51.334 14.668-14.666 36.665-14.666 51.333 0l102.667 102.668z' fill='%23873a18'/%3E%3C/svg%3E");
}
`

  // 用到的库
  const LIBS = [
    'https://cdn.jsdelivr.net/gh/journey-ad/blog-img@94eb7e2/live2d/lib/pio.css',
    'https://cdn.jsdelivr.net/npm/greensock@1.20.2/dist/TweenLite.js',
    'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
    'https://cdn.jsdelivr.net/npm/pixi.js@5.3.6/dist/pixi.min.js',
    'https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.3.1/dist/cubism4.min.js',
    'https://cdn.jsdelivr.net/gh/journey-ad/blog-img@94eb7e2/live2d/lib/pio_sdk4.js',
    'https://cdn.jsdelivr.net/gh/journey-ad/blog-img@94eb7e2/live2d/lib/pio.js'
  ]

  const reqArr = LIBS.map(src => loadSource(src))

  // 创建顺序加载队列
  const doTask = reqArr.reduce((prev, next) => prev.then(() => next()), Promise.resolve());

  // 队列执行完毕后
  doTask.then(() => {
    // 移除自带看板娘
    const haruna = document.getElementById('my-dear-haruna-vm')
    haruna && haruna.remove()

    // 初始化pio
    _pio_initialize_pixi()

    // 添加自定义样式
    addStyle(CUSTOM_CSS)

    加载圣·嘉然()

    console.log("all done.")
  });

  // 初始化设定
  const initConfig = {
    mode: "fixed",
    hidden: true,
    content: {
      link: 引流[Math.floor(Math.random() * 引流.length)], // 引流链接
      referer: "Hi!", // 存在访问来源时的欢迎文本
      welcome: ["Hi!"], // 未开启时间问好时的欢迎文本
      skin: ["诶，想看看其他团员吗？", "替换后入场文本"], // 0更换模型提示文案  1更换完毕入场文案
      custom: [
        // 鼠标移上去提示元素
        { "selector": ".most-viewed-panel .most-viewed-item, .live-up-list .live-detail, .card .user-name, .user .name, .post-content .content-full a, .tag-list .content, .title, h2 a[title]", "type": "link" }
      ],
    },
    model: [
      // 待加载的模型列表
      "https://cdn.jsdelivr.net/gh/journey-ad/blog-img/live2d/Diana/Diana.model3.json",
      "https://cdn.jsdelivr.net/gh/journey-ad/blog-img/live2d/Ava/Ava.model3.json",
    ],
    tips: true, // 时间问好
    onModelLoad: onModelLoad // 模型加载完成回调
  }

  let pio_reference // pio实例

  function 加载圣·嘉然() {
    pio_reference = new Paul_Pio(initConfig)

    pio_alignment = "right" // 右下角

    const closeBtn = document.querySelector(".pio-container .pio-action .pio-close")
    closeBtn.insertAdjacentHTML('beforebegin', '<span class="pio-top"></span>')
    const topBtn = document.querySelector(".pio-container .pio-action .pio-top")
    // 返回顶部
    topBtn.onclick = function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    topBtn.onmouseover = function () {
      pio_reference.modules.render("想回到页面顶部吗？");
    };

    // Then apply style
    pio_refresh_style()
  }

  // 模型加载完成回调
  function onModelLoad(model) {
    const canvas = document.getElementById("pio")
    const modelNmae = model.internalModel.settings.name
    const coreModel = model.internalModel.coreModel
    const motionManager = model.internalModel.motionManager

    let touchList = [
      {
        text: "点击展示文本1",
        motion: "Idle"
      },
      {
        text: "点击展示文本2",
        motion: "Idle"
      }
    ]

    // 播放动作
    function playAction(action) {
      action.text && pio_reference.modules.render(action.text) // 展示文案
      action.motion && pio_reference.model.motion(action.motion) // 播放动作

      if (action.from && action.to) {
        // 指定部件渐入渐出
        Object.keys(action.from).forEach(id => {
          const hidePartIndex = coreModel._partIds.indexOf(id)
          TweenLite.to(coreModel._partOpacities, 0.6, { [hidePartIndex]: action.from[id] });
          // coreModel._partOpacities[hidePartIndex] = action.from[id]
        })

        motionManager.once("motionFinish", (data) => {
          Object.keys(action.to).forEach(id => {
            const hidePartIndex = coreModel._partIds.indexOf(id)
            TweenLite.to(coreModel._partOpacities, 0.6, { [hidePartIndex]: action.to[id] });
            // coreModel._partOpacities[hidePartIndex] = action.to[id]
          })
        })
      }
    }

    canvas.onclick = function () {
      // 除闲置动作外不打断
      if (motionManager.state.currentGroup !== "Idle") return

      // 随机选择并播放动作
      const action = pio_reference.modules.rand(touchList)
      playAction(action)
    }

    if (modelNmae === "Diana") {
      // 嘉然小姐

      // 入场动作及文案
      initConfig.content.skin[1] = ["我是吃货担当 嘉然 Diana~", "嘉心糖们 想然然了没有呀~", "有人在吗？"]
      playAction({ motion: "Tap抱阿草-左手" })

      // 点击动作及文案，不区分区域
      touchList = [
        {
          text: "嘉心糖屁用没有",
          motion: "Tap生气 -领结"
        },
        {
          text: "有人急了，但我不说是谁~",
          motion: "Tap= =  左蝴蝶结"
        },
        {
          text: "呜呜...呜呜呜....",
          motion: "Tap哭 -眼角"
        },
        {
          text: "想然然了没有呀~",
          motion: "Tap害羞-中间刘海"
        },
        {
          text: "阿草好软呀~",
          motion: "Tap抱阿草-左手"
        },
        {
          text: "不要再戳啦！好痒！",
          motion: "Tap摇头- 身体"
        },
        {
          text: "嗷呜~~~",
          motion: "Tap耳朵-发卡"
        },
        {
          text: "zzZ。。。",
          motion: "Leave"
        },
        {
          text: "哇！好吃的！",
          motion: "Tap右头发"
        },
      ]

    } else if (modelNmae === "Ava") {
      initConfig.content.skin[1] = ["我是<s>拉胯</s>Gamer担当 向晚 AvA~", "怎么推流辣！", "AAAAAAAAAAvvvvAAA 向晚！"]
      playAction({
        motion: "Tap左眼",
        from: {
          "Part15": 1
        },
        to: {
          "Part15": 0
        }
      })

      touchList = [
        {
          text: "水母 水母~ 只是普通的生物",
          motion: "Tap右手"
        },
        {
          text: "可爱的鸽子鸽子~我喜欢你~",
          motion: "Tap胸口项链",
          from: {
            "Part12": 1
          },
          to: {
            "Part12": 0
          }
        },
        {
          text: "好...好兄弟之间喜欢很正常啦",
          motion: "Tap中间刘海",
          from: {
            "Part12": 1
          },
          to: {
            "Part12": 0
          }
        },
        {
          text: "啊啊啊！怎么推流辣",
          motion: "Tap右眼",
          from: {
            "Part16": 1
          },
          to: {
            "Part16": 0
          }
        },
        {
          text: "你怎么老摸我，我的身体是不是可有魅力",
          motion: "Tap嘴"
        },
        {
          text: "AAAAAAAAAAvvvvAAA 向晚！",
          motion: "Tap左眼",
          from: {
            "Part15": 1
          },
          to: {
            "Part15": 0
          }
        }
      ]

      // 钻头比较大，宽度*1.2倍，模型位移也要重新计算
      canvas.width = model.width * 1.2
      model.x = canvas.width - model.width

      // 模型问题，手动隐藏指定部件
      const hideParts = [
        "Part5", // 晕
        "neko", // 喵喵拳
        "game", // 左手游戏手柄
        "Part15", // 墨镜
        "Part21", // 右手小臂
        "Part22", // 左手垂下
        "Part", // 双手抱拳
        "Part16", // 惊讶特效
        "Part12" // 小心心
      ]
      const hidePartsIndex = hideParts.map(id => coreModel._partIds.indexOf(id))
      hidePartsIndex.forEach(idx => {
        coreModel._partOpacities[idx] = 0
      })
    }
  }

  // 检测是否处于iframe内嵌环境
  function inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  // 加载js或css，返回函数包裹的promise实例，用于顺序加载队列
  function loadSource(src) {
    return () => {
      return new Promise(function (resolve, reject) {
        const TYPE = src.split('.').pop()
        let s = null;
        let r = false;
        if (TYPE === 'js') {
          s = document.createElement('script');
          s.type = 'text/javascript';
          s.src = src;
          s.async = true;

        } else if (TYPE === 'css') {
          s = document.createElement('link');
          s.rel = 'stylesheet';
          s.type = 'text/css';
          s.href = src;

        }
        s.onerror = function (err) {
          reject(err, s);
        };
        s.onload = s.onreadystatechange = function () {
          // console.log(this.readyState); // uncomment this line to see which ready states are called.
          if (!r && (!this.readyState || this.readyState == 'complete')) {
            r = true;
            console.log(src)
            resolve();
          }
        };
        const t = document.getElementsByTagName('script')[0];
        t.parentElement.insertBefore(s, t);
      });
    }
  }

  // 添加css
  function addStyle(css) {
    if (typeof GM_addStyle != "undefined") {
      GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
      PRO_addStyle(css);
    } else {
      const node = document.createElement("style");
      node.type = "text/css";
      node.appendChild(document.createTextNode(css));
      const heads = document.getElementsByTagName("head");

      if (heads.length > 0) {
        heads[0].appendChild(node);
      } else {
        // no head yet, stick it whereever
        document.documentElement.appendChild(node);
      }
    }
  }

})();
