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
    .theme-color {
      color: #DAB88B;
    }
    .theme-bg-color {
      background: #DAB88B;
    }
    .theme-bg:hover {
      background: #DAB88B;
    }
    .theme-hexo-color:hover {
      color: #DAB88B;
    }
    .theme-border-left:hover {
      border-left: 2px solid #DAB88B;
    }
    .theme-bg-font:hover {
      color: #fff;
      background: #DAB88B;
    }
    .copyright-border-left {
      border-left: 2px solid #DAB88B;
    }
    .nav-angle {
      padding-left: 0.5rem;
    }
  
    /*  菜单下划线动画 */
    #theme-hexo .menu-link {
        text-decoration: none;
        {/* background-image: linear-gradient(#928CEE, #928CEE); */}
        {/* background-image: linear-gradient(#87CBB9, #87CBB9); */}
        background-image: linear-gradient(#DAB88B, #DAB88B);
        background-repeat: no-repeat;
        background-position: bottom center;
        background-size: 0 2px;
        transition: background-size 100ms ease-in-out;
    }
    
    #theme-hexo .menu-link:hover {
        background-size: 100% 2px;
        {/* color: #928CEE; */}
        {/* color: #87CBB9; */}
        color: #DAB88B;
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
        background-color: #DAB88B;
    }

    * {
        scrollbar-width:thin;
        scrollbar-color: #DAB88B transparent
    }
    
    /* 分页组件相关样式 */
    /* 分页容器样式 */
    .pagination-container {
        color: #DAB88B;
    }
    
    /* 页码和前后图标的基本样式 */
    .pagination-item {
        color: #DAB88B;
        border-color: #DAB88B;
    }
    
    /* 当前选中页码的样式 */
    .pagination-item-active {
        background-color: #DAB88B;
        color: white;
    }
    
    /* 当前选中页码的悬浮样式 */
    .pagination-item-active:hover {
        background-color: #C9A77B; /* 稍深一点的颜色用于悬停效果 */
    }
    
    /* 页码和前后图标的悬浮样式 */
    a.pagination-item:hover {
        background-color: #DAB88B;
        border-color: #DAB88B;
        color: white;
    }

  `}</style>)
}

export { Style }
