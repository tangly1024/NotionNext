/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return <style jsx global>{`
    
    // 底色
    .dark body{
        background-color: black;
    }

  `}</style>
}

// 视频聚合走马灯
      .notion-carousel {
        width: 100%; /* 根据需要调整 */
        overflow: hidden;
      }

      .notion-carousel-wrapper .notion-carousel {
        display: none;
      }

      .notion-carousel-wrapper .notion-carousel.active {
        display: block;
      }

      .notion-carousel-route div {
        cursor: pointer;
        margin-bottom: 0.2rem;
      }

      .notion-carousel-route div:hover {
        text-decoration: underline; 
      }

      .notion-carousel div {
        height: auto !important;
        aspect-ratio: 2/1 !important;
      }
    `}</style>
  )
}

export { Style }
