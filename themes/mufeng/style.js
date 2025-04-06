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
    color: #276077;
  }
  
  .dark #theme-simple .blog-item-title {
    color: #d1d5db;
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
  
  /* 滚动条样式 */
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }
  
  .scrollbar-thumb-gray-400::-webkit-scrollbar-thumb {
    background-color: #9ca3af;
    border-radius: 2px;
  }
  
  .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
    background-color: #4b5563;
    border-radius: 2px;
  }
  
  .scrollbar-track-gray-100::-webkit-scrollbar-track {
    background-color: #f3f4f6;
  }
  
  .scrollbar-track-gray-800::-webkit-scrollbar-track {
    background-color: #1f2937;
  }
  
  /* 自定义目录样式 */
  .catalog-item {
    transition: all 0.2s ease-in-out;
  }
  
  .catalog-item:hover {
    transform: translateX(2px);
  }

  /* 文章悬浮目录样式 */
  .floating-toc {
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .dark .floating-toc {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .floating-toc:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  }

  .dark .floating-toc:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
  }

  /* 标题高亮效果 */
  .bg-yellow-100 {
    background-color: rgba(254, 243, 199, 0.5) !important;
    transition: background-color 2s ease-out;
  }

  .dark .bg-yellow-900 {
    background-color: rgba(120, 53, 15, 0.3) !important;
    transition: background-color 2s ease-out;
  }

  /* 目录滚动渐变遮罩 */
  .bg-gradient-to-t {
    background-image: linear-gradient(to top, var(--tw-gradient-stops));
  }

  .from-white {
    --tw-gradient-from: white;
    --tw-gradient-stops: var(--tw-gradient-from), transparent;
  }

  .dark .from-black {
    --tw-gradient-from: black;
    --tw-gradient-stops: var(--tw-gradient-from), transparent;
  }

  .to-transparent {
    --tw-gradient-to: transparent;
  }

  /* 标签和分类样式 */
  .hover\:bg-red-50:hover {
    background-color: rgba(254, 226, 226, 0.5);
  }

  .dark .dark\:hover\:bg-gray-700:hover {
    background-color: rgba(55, 65, 81, 0.7);
  }

  /* 阅读次数动画 */
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* 数字变化动画 */
  .number-transition {
    transition: all 0.5s ease;
  }

  .number-transition:hover {
    color: #ef4444;
  }

  `}</style>
}

export { Style }
