/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持 tailwindCSS 的 @apply 语法
 * @returns
 */
const Style = () => {
  return (
    <style jsx global>{`
      html {
        -webkit-font-smoothing: antialiased;
      }
      .font-typography {
        font-weight: 400;
        font-family:
          Source Sans Pro,
          Roboto,
          Helvetica,
          Helvetica Neue,
          Source Han Sans SC,
          Source Han Sans TC,
          PingFang SC,
          PingFang HK,
          PingFang TC,
          sans-serif !important;
        }
      }
      // 底色
      .dark body {
        background-color: rgb(35, 34, 34);
      }
      // 文本不可选取
      .forbid-copy {
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
      }

      .dark #theme-typography {
        background-image: linear-gradient(
              to right,
              rgb(255 255 255 / 0.04) 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, rgb(255 255 255 / 0.04) 1px, transparent 1px);
      }

      #theme-typography {
        --primary-color: #2e405b;
        background-color: rgb(255 255 255) / 1;
        color: #2e405b;
        background-size: 7px 7px;
        text-shadow: 1px 1px 1px rgb(0 0 0 / 0.04);
        background-image: linear-gradient(
            to right,
            rgb(0 0 0 / 0.04) 1px,
            transparent 1px
          ),
          linear-gradient(to bottom, rgb(0 0 0 / 0.04) 1px, transparent 1px);
      }

      #theme-typography #blog-name {
        font-family: HiraMinProN-W6, 'Source Han Serif CN',
          'Source Han Serif SC', 'Source Han Serif TC', serif;
      }

      #theme-typography #blog-name-en {
        font-family: HiraMinProN-W6, 'Source Han Serif CN',
          'Source Han Serif SC', 'Source Han Serif TC', serif;
      }

      /* 深色模式下网站标题使用终端绿色 */
      .dark #theme-typography #blog-name,
      .dark #theme-typography #blog-name-en {
        color: #00FF00;
        text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
      }

      /* 深色模式下网站标题区域左侧竖线使用终端绿色 */
      .dark #theme-typography #site-header {
        border-color: #00FF00 !important;
        position: relative;
      }

      /* 终端光标闪烁动画 */
      @keyframes terminal-cursor-blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }

      /* 深色模式下网站标题区域hover显示闪烁光标 */
      @media (min-width: 768px) {
        .dark #theme-typography #site-header::after {
          content: '';
          position: absolute;
          bottom: 1rem; /* 与 pb-8 对齐 */
          left: 20px;
          width: 0.2em;
          height: 1em;
          background-color: #00FF00;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .dark #theme-typography #site-header:hover::after {
          opacity: 1;
          animation: terminal-cursor-blink 1s step-end infinite;
          box-shadow: 0 0 8px rgba(0, 255, 0, 0.8);
        }

      }

      /* 深色模式下目录当前项使用终端绿色 */
      .dark #theme-typography .catalog-item.active,
      .dark #theme-typography .catalog-item-active {
        color: #00FF00 !important;
        border-color: #00FF00 !important;
        text-shadow: 0 0 3px rgba(0, 255, 0, 0.4);
      }

      .notion {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }

      #container-wrapper .scroll-hidden {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }

      /* 目录自定义滚动条 */
      .catalog-list::-webkit-scrollbar {
        width: 3px;
      }
      .catalog-list::-webkit-scrollbar-track {
        background: transparent;
      }
      .catalog-list::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.15);
        border-radius: 3px;
      }
      .catalog-list::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.25);
      }
      .dark .catalog-list::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.15);
      }
      .dark .catalog-list::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.25);
      }

      /* 深色模式下代码块滚动条 */
      .dark pre::-webkit-scrollbar,
      .dark .notion-code::-webkit-scrollbar {
        height: 6px;
        width: 6px;
      }
      .dark pre::-webkit-scrollbar-track,
      .dark .notion-code::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }
      .dark pre::-webkit-scrollbar-thumb,
      .dark .notion-code::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
      }
      .dark pre::-webkit-scrollbar-thumb:hover,
      .dark .notion-code::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
      }
      /* Firefox */
      .dark pre,
      .dark .notion-code {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
      }

      /* 目录容器样式 */
      .catalog-wrapper {
        padding: 0.5rem 0;
      }
      .dark .catalog-wrapper {
      }
    `}</style>
  )
}

export { Style }
