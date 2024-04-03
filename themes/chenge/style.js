/* eslint-disable react/no-unknown-property */
/**
 * 这里的css样式只对当前主题生效
 * 主题客制化css
 * @returns
 */
const Style = () => {
  return (<style jsx global>{`
    :root {
        --grey-0: #fff;
        --grey-1: #fdfdfd;
        --grey-2: #f7f7f7;
        --grey-3: #eff2f3;
        --grey-4: #ccc;
        --grey-5: #999;
        --grey-6: #666;
        --grey-7: #333;
        --grey-8: #222;
        --grey-9: #000;
        --grey-1-a0: rgba(253,253,253,0);
        --grey-1-a7: rgba(253,253,253,0.7);
        --grey-1-a5: rgba(253,253,253,0.5);
        --grey-1-a3: rgba(253,253,253,0.3);
        --color-cyan-light: #e3fdf5; 
        --color-pink-light: #ffe6fa; 
        --grey-a7: rgba(253,253,253,0.7);
        --grey-a5: rgba(253,253,253,0.5);
        --grey-a3: rgba(253,253,253,0.3);
        --grey-a0: #f5f5f5;
        --grey: #333;
        --aqua: #3e999f;
        --color-purple: #928CEE;
        --color-pink:#ed6ea0;
        --color-orange: #ec8c69;
        --color-red: #e9546b;
        --color-yellow: #eab700;
        --color-green: #0a7426;
        --color-aqua: #3e999f;
        --color-blue: #38a1db;
        --menu-bg: linear-gradient(90deg, var(--aqua) 0%, var(--aqua) 100%);
        --nav-bg: linear-gradient(-225deg, var(--color-cyan-light) 0%, var(--color-pink-light) 100%);
        --tab-bg: linear-gradient(to right,var(--color-pink) 0,var(--color-orange) 100%);
        --body-bg-shadow: var(--grey-2);
        --ai-bg: #f1f3f8;
        --ai-title: #425AEF;
        --ai-title-text: #fff;
        --ai-card-bg: #fff;
        --ai-card-border: #e3e8f7;
    }

    .dark {
        --grey-0: #222;
        --grey-1: #21252b;
        --grey-2: #363636;
        --grey-3: #444;
        --grey-4: #666;
        --grey-5: #aaa;
        --grey-6: #ccc;
        --grey-7: #ddd;
        --grey-8: #eee;
        --grey-9: #f7f7f7;
        --grey-1-a7: rgba(34,34,34,0.7);
        --grey-1-a5: rgba(34,34,34,0.5);
        --grey-1-a3: rgba(34,34,34,0.3);
        --grey-1-a0: rgba(34,34,34,0);
        --color-cyan-light: #2d3230;
        --color-pink-light: #322d31;
        --grey-a7: rgba(34,34,34,0.7);
        --grey-a5: rgba(34,34,34,0.5);
        --grey-a3: rgba(34,34,34,0.3);
        --grey-a0: #21252b;
        --grey: #aaa;
        --color-pink: rgba(241,139,179,0.8);
        --color-orange: rgba(240,163,135,0.8);
        --color-red: rgba(237,118,137,0.9);
        --aqua: #97d3d6;
        --body-bg-shadow: #000;
        --ai-bg: #30343f;
        --ai-title: #f2b94b;
        --ai-title-text: #1d1e22;
        --ai-card-bg: #1d1e22;
        --ai-card-border: #3d3d3f;
    }

    // iconfont 图标支持
    .icon {
        width: 1em; height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }

    // AI打字机，闪烁光标
    .blinking-cursor {
        background-color: var(--ai-title);
        width: 10px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        animation: blinking-cursor 0.5s infinite;
        -webkit-animation: blinking-cursor 0.5s infinite;
        margin-left: 4px;
      }
      
    @keyframes blinking-cursor {
        0% {
            opacity: 1;
        }
        
        40% {
            opacity: 1;
        }
        
        50% {
            opacity: 0;
        }
        
        90% {
            opacity: 0;
        }
        
        100% {
            opacity: 1;
        }
    }
      

    // 底色
    body{
        background-color: #f5f5f5
    }
    .dark body{
        background-color: black;
    }

    //文章封面
    .left-clip-path {
        -webkit-clip-path: polygon(0 0,92% 0,100% 100%,0 100%);
        clip-path: polygon(0 0,92% 0,100% 100%,0 100%);
    }
    .right-clip-path {
        -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 8% 100%);
        clip-path: polygon(0 0, 100% 0, 100% 100%, 8% 100%);
    }

    //标题阴影
    .text-shadow {
        text-shadow: 0 0.2rem 0.3rem rgba(0,0,0,.5);
    }

    .text-shadow-none {
        text-shadow: none;
    }

    @media (min-width: 768px) {
    .md\:left-clip-path { 
        -webkit-clip-path: polygon(0 0, 92% 0, 100% 100%, 0 100%);
        clip-path: polygon(0 0, 92% 0, 100% 100%, 0 100%);
    }

    .md\:right-clip-path {
        -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 8% 100%);
        clip-path: polygon(0 0, 100% 0, 100% 100%, 8% 100%);
    }
    }


    .waves {
        width: 100%;
        height: 10vh;
        //margin-bottom: -.6875rem;
        min-height: 3.125rem;
        max-height: 9.375rem;
        position: relative
    }
    
    @media (max-width: 767px) {
        .waves {
            height:10vh
        }
    }
    
    .parallax>use {
        -webkit-animation: wave 25s cubic-bezier(.55,.5,.45,.5) infinite;
        animation: wave 25s cubic-bezier(.55,.5,.45,.5) infinite
    }
    
    .parallax>use:nth-child(1) {
        -webkit-animation-delay: -2s;
        animation-delay: -2s;
        -webkit-animation-duration: 7s;
        animation-duration: 7s;
        fill: var(--grey-1-a7)
    }
    
    .parallax>use:nth-child(2) {
        -webkit-animation-delay: -3s;
        animation-delay: -3s;
        -webkit-animation-duration: 10s;
        animation-duration: 10s;
        fill: var(--grey-1-a5)
    }
    
    .parallax>use:nth-child(3) {
        -webkit-animation-delay: -4s;
        animation-delay: -4s;
        -webkit-animation-duration: 13s;
        animation-duration: 13s;
        fill: var(--grey-1-a3)
    }
    
    .parallax>use:nth-child(4) {
        -webkit-animation-delay: -5s;
        animation-delay: -5s;
        -webkit-animation-duration: 20s;
        animation-duration: 20s;
        fill: var(--grey-1)
    }
    
    @-webkit-keyframes wave {
        0% {
            transform: translate3d(-90px,0,0)
        }
    
        100% {
            transform: translate3d(85px,0,0)
        }
    }
    
    @keyframes wave {
        0% {
            transform: translate3d(-90px,0,0)
        }
    
        100% {
            transform: translate3d(85px,0,0)
        }
    }

    /*  菜单下划线动画 */
    #theme-hexo .menu-link {
        text-decoration: none;
        background-image: var(--menu-bg);
        background-repeat: no-repeat;
        background-position: bottom center;
        background-size: 0 2px;
        transition: background-size 400ms ease-in-out;
    }
    
    #theme-hexo .menu-link:hover {
        background-size: 100% 2px;
        color: var(--aqua);
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
    // ::-webkit-scrollbar {
    //     width: 0.5rem;
    //     height: 0.5rem;
    // }

    // ::-webkit-scrollbar-track {
    //     background: transparent;
    // }

    // ::-webkit-scrollbar-thumb {
    //     background-color: #6b6c6d;
    // }

    ::-webkit-scrollbar {
        width: 0.3125rem;
        height: .3125rem;
        background: 0 0
    }

    ::-webkit-scrollbar-track {
        border-radius: .3125rem;
        background: 0 0
    }

    ::-webkit-scrollbar-track-piece {
        background: 0 0
    }

    ::-webkit-scrollbar-button {
        background: 0 0;
        height: 0
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 1.25rem;
        background-clip: padding-box;
        background-color: var(--color-red) ;
        // background-image: linear-gradient(
        //     45deg,
        //     var(--color-pink) 10%,
        //     transparent 10%,
        //     transparent 20%,
        //     var(--color-pink) 20%,
        //     var(--color-pink) 30%,
        //     transparent 30%,
        //     transparent 40%,
        //     var(--color-pink) 40%,
        //     var(--color-pink) 50%,
        //     transparent 50%,
        //     transparent 60%,
        //     var(--color-pink) 60%,
        //     var(--color-pink) 70%,
        //     transparent 70%,
        //     transparent 80%,
        //     var(--color-pink) 80%,
        //     var(--color-pink) 90%,
        //     transparent 90%,
        //     transparent 100%)
        // background-image: linear-gradient(
        //     0deg,
        //     var(--color-pink) 0%,
        //     var(--color-orange) 100%
        // )
    }
    

  `}</style>)
}

export { Style }
