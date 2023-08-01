/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return <style jsx global>{`
    
    .test {
      text-color: red;
    }
    // 文本不可选取
    .forbid-copy {
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

  `}</style>
}

export { Style }
