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

      .shadow-movie {
        box-shadow:
          0 26px 58px 0 rgba(0, 0, 0, 0.22),
          0 5px 14px 0 rgba(0, 0, 0, 0.18);
      }
    `}</style>
  )
}

export { Style }
