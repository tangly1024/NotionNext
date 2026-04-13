/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return (
    <style jsx global>{`
      :root {
        --ai-bg: #f7f7f9;
        --ai-title: #425AEF;
        --ai-title-text: #fff;
        --ai-card-bg: #fff;
        --ai-card-border: #e3e8f7;
        --heo-surface-strong: #ffffff;
        --heo-surface-dark: #070B14;
        --heo-text: rgba(0, 0, 0, 0.88);
      }
        
      .dark {
        --ai-bg: #21232a;
        --ai-title: #f2b94b;
        --ai-title-text: #1b1c20;
        --ai-card-bg: #1d1e22;
        --ai-card-border: #3d3d3f;
      }

      html.dark {
        --heo-text: rgba(255, 255, 255, 0.88);
      }

      * {
        box-sizing: border-box;
      }

      body {
        background-color: #f7f9fe;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(60, 60, 67, 0.4);
        border-radius: 8px;
        cursor: pointer;
      }

      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      .recent-top-post-group::-webkit-scrollbar,
      .scroll-hidden::-webkit-scrollbar {
        display: none;
      }

      /* 公告栏中的字体固定白色 */
      #theme-heo #announcement-content .notion {
        color: white;
      }

      #more {
        white-space: nowrap;
      }

      .today-card-cover {
        -webkit-mask-image: linear-gradient(to top, transparent 5%, black 60%);
        mask-image: linear-gradient(to top, transparent 5%, black 60%);
      }

      // AI打字机，闪烁光标
      .blinking-cursor {
        background-color: var(--ai-title);
        width: 10px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        margin-left: 4px;
        animation: blinking-cursor 0.5s infinite;
        -webkit-animation: blinking-cursor 0.5s infinite;
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

      // 标签滚动动画
      .tags-group-wrapper {
        animation: rowup 60s linear infinite;
      }

      @keyframes rowup {
        0% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(-50%);
        }
      }

      /* Loading 动画样式 */
      #loading-box {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        height: 100dvh;
        z-index: 1001;
        opacity: 1;
        visibility: visible;
        transition:
          opacity .4s ease 1.6s,
          visibility 0s linear 2.0s;
      }

      #loading-box.loaded {
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
      }

      /* 退出动画：滑出效果 */
      #loading-box.loaded .loading-bg,
      #loading-box.loaded .loading-animation {
        border-radius: 3rem;
        transform: translateX(100%);
        transition: 1.3s ease;
      }

      #loading-box.loaded .loading-bg {
        transition-delay: 0.3s;
      }

      #loading-box .loading-bg,
      #loading-box .loading-animation {
        position: absolute;
        width: 100%;
        height: 100%;
        will-change: transform;
      }

      #loading-box .loading-bg {
        background: #4f65f0 url("/loadings.svg") repeat;
        background-size: 30%;
      }

      html.dark #loading-box .loading-bg {
        background: #eab308 url("/loadings.svg") repeat;
        background-size: 30%;
      }

      #loading-box .loading-animation {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: var(--heo-surface-strong);
      }

      html.dark #loading-box .loading-animation {
        background: var(--heo-surface-dark);
      }

      #loading-box .loading-animation .loading {
        width: 16rem;
        height: 16rem;
      }

      /* SVG 描边动画 */
      #loading-box .loading-animation .loading path {
        stroke: var(--heo-text);
        stroke-width: 0.5px;
        animation: dashArray 5s ease-in-out infinite, dashOffset 5s linear infinite;
      }

      #loading-box .loading-animation .loading path.color {
        stroke: #4f65f0;
      }

      html.dark #loading-box .loading-animation .loading path {
        stroke: var(--heo-text);
      }

      html.dark #loading-box .loading-animation .loading path.color {
        stroke: #eab308;
      }

      /* Loading 文字及故障效果 */
      #loading-box .loading-text {
        position: relative;
        margin-top: 1rem;
        font-size: 26px;
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: 0.3rem;
        z-index: 1;
        animation: shift 1s ease-in-out infinite alternate;
        color: var(--heo-text);
      }

      #loading-box .loading-text:before,
      #loading-box .loading-text:after {
        display: block;
        content: attr(data-glitch);
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0.8;
      }

      #loading-box .loading-text:before {
        animation: glitch 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
        color: #ff5252;
        z-index: -1;
      }

      #loading-box .loading-text:after {
        animation: glitch 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
        color: #2ecc71;
        z-index: -2;
      }

      html.dark #loading-box .loading-text {
        color: var(--heo-text);
      }

      html.dark #loading-box .loading-text:before {
        color: #f97316;
      }

      html.dark #loading-box .loading-text:after {
        color: #22c55e;
      }

      /* Keyframes */
      @keyframes dashArray {
        0% { stroke-dasharray: 0 1 359 0; }
        50% { stroke-dasharray: 0 359 1 0; }
        100% { stroke-dasharray: 359 1 0 0; }
      }

      @keyframes dashOffset {
        0% { stroke-dashoffset: 365; }
        100% { stroke-dashoffset: 5; }
      }

      @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-3px, 3px); }
        40% { transform: translate(-3px, -3px); }
        60% { transform: translate(3px, 3px); }
        80% { transform: translate(3px, -3px); }
        100% { transform: translate(0); }
      }

      @keyframes shift {
        0%, 40%, 44%, 58%, 61%, 65%, 69%, 73%, 100% { transform: skewX(0deg); }
        41% { transform: skewX(10deg); }
        42% { transform: skewX(-10deg); }
        59% { transform: skewX(40deg) skewY(10deg); }
        60% { transform: skewX(-40deg) skewY(-10deg); }
        63% { transform: skewX(10deg) skewY(-5deg); }
        70% { transform: skewX(-50deg) skewY(-20deg); }
        71% { transform: skewX(10deg) skewY(-10deg); }
      }

      @media (prefers-reduced-motion: reduce) {
        #loading-box,
        #loading-box * {
          animation: none !important;
          transition: none !important;
        }
        #loading-box.loaded .loading-bg,
        #loading-box.loaded .loading-animation {
          transform: none !important;
        }
      }

      @media (max-width: 768px) {
        #loading-box.loaded .loading-bg,
        #loading-box.loaded .loading-animation {
          transition-duration: 0.7s;
        }
      }

      /* AI文章摘要字体大小 */
      .font-bold.ml-2 {
        font-size: 18px;
      }

      /* 卡片遮罩背景颜色 */
      .bg-black {
        box-shadow: 
          0 -120px 140px -12px rgba(26, 34, 64, 0.95) inset,
          0 -80px 100px -8px rgba(85, 60, 154, 0.6) inset;
      }

      /* 标签颜色 */
      .hover\:bg-indigo-600:hover {
        background-color: #ff6817;
      }
      .group:hover .md\:group-hover\:bg-indigo-600 {
        background-color: #ff6817;
      }
      .bg-indigo-600 {
        background-color: #ff6817;
      }
      .hover\:text-indigo-600:hover {
        color: #3a86ff;
      }

      /* 推荐文章字体颜色 */
      .group:hover .group-hover\:text-indigo-600 {
        color: #3a86ff;
      }

      /* 首页字体颜色 */
      .group:hover .group-hover\:text-indigo-700 {
        color: #3a86ff;
      }
      .hover\:text-indigo-700:hover {
        color: #3a86ff;
      }

      /* 目录字体颜色 */
      .text-indigo-600 {
        color: #3a86ff;
      }

      /* 复选框颜色 */
      .hover\:border-indigo-600:hover {
        border-color: rgba(58, 134, 255, 0.6);
        box-shadow:
          0 0 0 1px rgba(58, 134, 255, 0.6),
          0 8px 24px rgba(58, 134, 255, 0.1);
        transition: border-color 0.25s cubic-bezier(.2,.8,.2,1),
                    box-shadow 0.25s cubic-bezier(.2,.8,.2,1);
      }
      .hover\:border-blue-600:hover {
        border-color: rgba(160, 210, 255, 0.65);
        box-shadow:
          inset 0 0 0 999px rgba(160, 210, 255, 0.05),
          inset 0 1px 0 rgba(255, 255, 255, 0.20),
          0 0 0 6px rgba(140, 200, 255, 0.22),
          0 12px 30px rgba(0, 0, 0, 0.12);
        transition:
          border-color 0.22s cubic-bezier(.2,.8,.2,1),
          box-shadow 0.22s cubic-bezier(.2,.8,.2,1);
      }
      .dark .hover\:border-indigo-600:hover {
        border-color: rgba(120, 170, 255, 0.75);
        box-shadow:
          0 0 0 1px rgba(120, 170, 255, 0.45),
          0 10px 26px rgba(0, 0, 0, 0.45);
      }
      .dark .hover\:border-blue-600:hover {
        border-color: rgba(170, 215, 255, 0.70);
        box-shadow:
          inset 0 0 0 999px rgba(170, 215, 255, 0.035),
          inset 0 1px 0 rgba(255, 255, 255, 0.10),
          0 0 0 6px rgba(140, 200, 255, 0.20),
          0 16px 40px rgba(0, 0, 0, 0.55);
      }

      .notion a:not(.notion-page-link):not(.notion-collection-card):not(.notion-hash-link):not(.notion-bookmark):not(.blog-link) {
          position: relative;
          color: rgba(33, 150, 243, 1);
          transition: box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          text-decoration: none;
          border-radius: 5px;
      }

      .notion a:not(.notion-page-link):not(.notion-collection-card):not(.notion-hash-link):not(.notion-bookmark)::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -0.07em;
          width: 0;
          height: 0.1rem;
          background-image: linear-gradient(90.68deg, #b439df 0.26%, #e5337e 102.37%);
          transition: width 0.3s ease, left 0.3s ease;
          display: block;
          transform: translateX(-50%);
      }

      .notion a:not(.notion-page-link):not(.notion-collection-card):not(.notion-hash-link):not(.notion-bookmark):not(.blog-link):hover,
      .notion a:not(.notion-page-link):not(.notion-collection-card):not(.notion-hash-link):not(.notion-bookmark):not(.blog-link):focus {
          box-shadow: inset 0 -1.5em 0 rgba(33, 150, 243, 0.2);
          color: rgba(33, 150, 243, 1);
          border-radius: 6px;
      }

      .notion a:not(.notion-page-link):not(.notion-collection-card):not(.notion-hash-link):not(.notion-bookmark):not(.blog-link):hover::after,
      .notion a:not(.notion-page-link):not(.notion-collection-card):not(.notion-hash-link):not(.notion-bookmark):not(.blog-link):focus::after {
          width: 100%;
          left: 50%;
      }

      .notion-table-of-contents-item:hover {
        background-color: #ebf4ff !important;
      }

      .dark .notion-table-of-contents-item:hover {
        background-color: #9a34122e !important;
      }
    `}</style>
  )
}

export { Style }