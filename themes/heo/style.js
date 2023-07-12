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

    // 公告栏中的字体固定白色
    #announcement-content .notion{
        color: white;
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(60, 60, 67, 0.4);
        border-radius: 8px;
        cursor: pointer;
    }

    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

  `}</style>
}

export { Style }
