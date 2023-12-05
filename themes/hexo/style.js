/* eslint-disable react/no-unknown-property */
/**
 * 这里的css样式只对当前主题生效
 * 主题客制化css
 * @returns
 */
const Style = () => {
  return (<style jsx global>{`
    // 底色
    body{
        background-color: #f5f5f5
    }
    .dark body{
        background-color: black;
    }
  
    /*  菜单下划线动画 */
    #theme-hexo .menu-link {
        text-decoration: none;
        background-image: linear-gradient(#928CEE, #928CEE);
        background-repeat: no-repeat;
        background-position: bottom center;
        background-size: 0 2px;
        transition: background-size 100ms ease-in-out;
    }
    
    #theme-hexo .menu-link:hover {
        background-size: 100% 2px;
        color: #928CEE;
    }

    /* 设置了从上到下的渐变黑色 */
    #theme-hexo .header-cover::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background:  linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0.5) 100%);
    }

    /* Custem */
    .tk-footer{
        opacity: 0;
    }

    // 选中字体颜色
    ::selection {
        background: rgba(45, 170, 219, 0.3);
    }

    // 自定义滚动条
    ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #49b1f5;
    }

    * {
        scrollbar-width:thin;
        scrollbar-color: #49b1f5 transparent
    }
    

  }</style>)
}

/* 静态文件导入 自定义样式*/
.mr-2.fas.fa-bullhorn{
    color: #f00;
}
/* 页脚footer渐变色滚动动画 */
@-webkit-keyframes Gradient {
    0% {
        background-position: 0 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0 50%;
    }
}

@-moz-keyframes Gradient {
    0% {
        background-position: 0 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0 50%;
    }
}

@keyframes Gradient {
    0% {
        background-position: 0 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0 50%;
    }
}
footer {
    background: linear-gradient(-45deg, #ee7752, #ce3e75, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    -webkit-animation: Gradient 10s ease infinite;
    -moz-animation: Gradient 10s ease infinite;
    animation: Gradient 10s ease infinite;
    -o-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
footer:before {
    background-color: rgba(0, 0, 0, 0);
}
/* 首页黑夜霓虹灯 */
.text-4xl,
.text-lg,
#typed {
  animation: light_15px 10s linear infinite;
}
/* 关键帧描述 */
@keyframes light_15px {
  0% {
    text-shadow: #5636ed 0 0 15px;
  }
  12.5% {
    text-shadow: #11ee5e 0 0 15px;
  }
  25% {
    text-shadow: #f14747 0 0 15px;
  }
  37.5% {
    text-shadow: #f1a247 0 0 15px;
  }
  50% {
    text-shadow: #f1ee47 0 0 15px;
  }
  50% {
    text-shadow: #b347f1 0 0 15px;
  }
  62.5% {
    text-shadow: #002afa 0 0 15px;
  }
  75% {
    text-shadow: #ed709b 0 0 15px;
  }
  87.5% {
    text-shadow: #39c5bb 0 0 15px;
  }
  100% {
    text-shadow: #5636ed 0 0 15px;
  }
}

@keyframes light_10px {
  0% {
    text-shadow: #5636ed 0 0 10px;
  }
  12.5% {
    text-shadow: #11ee5e 0 0 10px;
  }
  25% {
    text-shadow: #f14747 0 0 10px;
  }
  37.5% {
    text-shadow: #f1a247 0 0 10px;
  }
  50% {
    text-shadow: #f1ee47 0 0 10px;
  }
  50% {
    text-shadow: #b347f1 0 0 10px;
  }
  62.5% {
    text-shadow: #002afa 0 0 10px;
  }
  75% {
    text-shadow: #ed709b 0 0 10px;
  }
  87.5% {
    text-shadow: #39c5bb 0 0 10px;
  }
  100% {
    text-shadow: #5636ed 0 0 10px;
  }
}
@keyframes light_5px {
  0% {
    text-shadow: #5636ed 0 0 5px;
  }
  12.5% {
    text-shadow: #11ee5e 0 0 5px;
  }
  25% {
    text-shadow: #f14747 0 0 5px;
  }
  37.5% {
    text-shadow: #f1a247 0 0 15px;
  }
  50% {
    text-shadow: #f1ee47 0 0 5px;
  }
  50% {
    text-shadow: #b347f1 0 0 5px;
  }
  62.5% {
    text-shadow: #002afa 0 0 5px;
  }
  75% {
    text-shadow: #ed709b 0 0 5px;
  }
  87.5% {
    text-shadow: #39c5bb 0 0 5px;
  }
  100% {
    text-shadow: #5636ed 0 0 5px;
  }
}
/*背景颜色渐变*/
/*
#wrapper{
  background: -webkit-linear-gradient(0deg, #ffd7e4 0%, #c8f1ff 100%)
}
*/
#wrapper{
  background: linear-gradient(
  100deg,
  hsl(229deg 100% 77%) 0%,
  hsl(239deg 93% 80%) 15%,
  hsl(251deg 85% 79%) 22%,
  hsl(262deg 77% 78%) 28%,
  hsl(273deg 69% 77%) 33%,
  hsl(285deg 61% 76%) 37%,
  hsl(297deg 54% 75%) 42%,
  hsl(308deg 58% 76%) 46%,
  hsl(318deg 67% 78%) 50%,
  hsl(325deg 76% 79%) 54%,
  hsl(331deg 83% 81%) 58%,
  hsl(337deg 89% 82%) 63%,
  hsl(342deg 94% 83%) 67%,
  hsl(347deg 98% 84%) 72%,
  hsl(352deg 100% 85%) 78%,
  hsl(357deg 100% 86%) 85%,
  hsl(2deg 100% 87%) 100%
  )}
.dark #wrapper{
  background: none;
}
/* 侧边栏个人信息卡片动态渐变色 */
.shadow-md{
  background: linear-gradient(
    -45deg,
    #e8d8b9,
    #eccec5,
    #a3e9eb,
    #bdbdf0,
    #eec1ea
  );
  position: relative;
  background-size: 400% 400%;
  -webkit-animation: Gradient 10s ease infinite;
  -moz-animation: Gradient 10s ease infinite;
  animation: Gradient 10s ease infinite !important;
}
@-webkit-keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@-moz-keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
/* 黑夜模式适配 */
.dark .shadow-md {
  background:  #191919ee;
}
/* 公告卡片动态渐变色 */
#announcement-wrapper{
  background: linear-gradient(
    -45deg,
    #e8d8b9,
    #eccec5,
    #a3e9eb,
    #bdbdf0,
    #eec1ea
  );
  position: relative;
  background-size: 400% 400%;
  -webkit-animation: Gradient 10s ease infinite;
  -moz-animation: Gradient 10s ease infinite;
  animation: Gradient 10s ease infinite !important;
}
@-webkit-keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@-moz-keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
/* 黑夜模式适配 */
.dark #announcement-wrapper {
  background:  #191919ee;
}
/* 头像呼吸灯 */
.light .rounded-full {
  animation: huxi_light 3s ease-in-out infinite;
}
.dark .rounded-full {
  animation: huxi_dark 3s ease-in-out infinite;
}
@keyframes huxi_dark {
  0% {
    box-shadow: 0px 0px 1px 1px #b7eaff;
  }
  50% {
    box-shadow: 0px 0px 5px 5px #f1c4f9;
  }
  100% {
    box-shadow: 0px 0px 1px 1px #ff5c5c;
  }
}
@keyframes huxi_light {
  0% {
    box-shadow: 0px 0px 1px 1px #e9f5fa;
  }
  50% {
    box-shadow: 0px 0px 5px 5px #e9f5fa;
  }
  100% {
    box-shadow: 0px 0px 1px 1px #e9f5fa;
  }
}
#theme-fukasawa .sideLeft hr{
    opacity: .04;
}

export { Style }
