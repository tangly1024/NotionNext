/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return <style jsx global>{`
    //logo图片
    .h-logo{
      background:url(/heithon_dark.jpg);
      background-repeat: no-repeat;
      background-size: 100% auto;   
      background-position:50% 50%;
      background-color: white;
    }

    // 底色#eeedee
    body{
      background:url(/background.jpg);
      background-repeat: no-repeat;
      background-attachment:fixed; 
      background-size: cover;   
      background-position:50% 50%;
      background-color: black;
    }
    .post-card{
      opacity: 0.85;
      background-color: #black;
    }
    .dark body{
        background-color: black;
    }

    .article-padding {
      padding: 40px;
    }

    // 菜单下划线动画#4e80ee
    #theme-next .menu-link {
      text-decoration: none;
      background-image: linear-gradient(#d43b3b, #d43b3b);
      background-repeat: no-repeat;
      background-position: bottom center;
      background-size: 0 2px;
      transition: background-size 100ms ease-in-out;
    }
    #theme-next .menu-link:hover {
      background-size: 100% 2px;
      color: #d43b3b;
    }

  `}</style>
}

export { Style }
