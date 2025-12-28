/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return (
    <style jsx global>{`
      body {
        background-color: #f7f9fe;
      }

      // 公告栏中的字体固定白色
      #theme-heo #announcement-content .notion {
        color: white;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(60, 60, 67, 0.4);
        border-radius: 8px;
        cursor: pointer;
      }

      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      #more {
        white-space: nowrap;
      }

      .today-card-cover {
        -webkit-mask-image: linear-gradient(to top, transparent 5%, black 70%);
        mask-image: linear-gradient(to top, transparent 5%, black 70%);
      }

      .recent-top-post-group::-webkit-scrollbar {
        display: none;
      }

      .scroll-hidden::-webkit-scrollbar {
        display: none;
      }

      * {
        box-sizing: border-box;
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

    /****** 新增style by arale ******/
      .text-black {
        color:#424242 ;
      }

      .dark\:hover\:bg-indigo-600:hover:is(.dark *) {
      background-color:#d68272 !important;
      }


      #nav-mobile > div:nth-child > a {
      font-size: 16px;
      font-weight: 350;
      }


      #container-inner {
          margin-bottom: 20px;
      }


       #notion-article > main {
       color:#424242 !important;
       }

      #notion-article > main.notion:is(.dark *) {
      color:#fff !important;
      }


     #post-info > div {
     font-weight:600 !important;
     }

     

      #__next-build-watcher {
      display:none;
      }

      #pc-next-post {
      display:none;
      }

    `}</style>
  )
}

export { Style }

