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
    

  `}</style>)
}

// style.js

import css from 'styled-jsx/css';

// 心形图标的样式
const heartIconStyles = css`
  #heart-icon {
    width: 20px;
    height: 20px;
    background-color: red;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    opacity: 0;
  }

  /* 心形图标的动画效果 */
  @keyframes showHeart {
    0% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 0; transform: scale(1); }
  }

  /* 点击时显示心形图标 */
  /* 假设你有一个触发点击事件的按钮，以id="click-button"为例 */
  #click-button {
    cursor: pointer;
  }

  #click-button:active ~ #heart-icon {
    animation: showHeart 1s ease;
  }
`;

export default heartIconStyles;

export { Style }
