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
  // 文本不可选取
    .forbid-copy {
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
  
  #theme-simple #announcement-content {
    /* background-color: #f6f6f6; */
  }
  
  #theme-simple .blog-item-title {
    color: var(--notion-blue);
  }
  
  .dark #theme-simple .blog-item-title {
    color: #d1d5db;
  }

  #theme-simple .blog-item-title.simple-post-title-cover {
    color: #fff !important;
  }

  #theme-simple .text-blue-400,
  #theme-simple .text-blue-600,
  #theme-simple .border-blue-400 {
    color: var(--notion-blue) !important;
    border-color: var(--notion-blue) !important;
  }

  .dark #theme-simple .dark\\:text-blue-300 {
    color: var(--notion-blue) !important;
  }
  
  .notion {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  
  
  /*  菜单下划线动画 */
  #theme-simple .menu-link {
      text-decoration: none;
      background-image: linear-gradient(#dd3333, #dd3333);
      background-repeat: no-repeat;
      background-position: bottom center;
      background-size: 0 2px;
      transition: background-size 100ms ease-in-out;
  }
   
  #theme-simple .menu-link:hover {
      background-size: 100% 2px;
      color: #dd3333;
      cursor: pointer;
  }
  
  `}</style>
}

export { Style }
