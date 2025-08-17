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
      // 毛玻璃背景色
      .bg-glassmorphism {
        background: hsla(0, 0%, 100%, 0.4);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
      }

      .dark .bg-glassmorphism {
        background: hsla(0, 0%, 0%, 0.4);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
      }
    `}</style>
  )
}

export { Style }
