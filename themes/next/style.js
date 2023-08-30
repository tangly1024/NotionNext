/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return <style jsx global>{`

    // 底色
    body{
        background-color: #eeedee
    }
    .dark body{
        background-color: black;
    }
    #announcement-content #
    notion-article{
      text-align: start;
      font-size: 6px;
    }

  `}</style>
}

export { Style }
