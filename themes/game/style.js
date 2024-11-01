/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return (
    <style jsx global>{`
      // 底色
      .dark body {
        background-color: black;
      }

      body {
        background-color: #ffffff;
      }

      /* 自定义滚动条样式（适用于 Chrome、Safari 和 Edge） */
      html::-webkit-scrollbar {
        width: 12px;
      }

      html::-webkit-scrollbar-track {
        background-color: black;
      }

      html::-webkit-scrollbar-thumb {
        background: #4e4e4e;
      }
    `}</style>
  )
}

export { Style }
