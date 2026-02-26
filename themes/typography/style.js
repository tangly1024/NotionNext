/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持 tailwindCSS 的 @apply 语法
 * @returns
 */
const Style = () => {
  return (
    <style jsx global>{`
      html {
        -webkit-font-smoothing: antialiased;
      }
      .font-typography {
        font-weight: 400;
        font-family:
          Source Sans Pro,
          Roboto,
          Helvetica,
          Helvetica Neue,
          Source Han Sans SC,
          Source Han Sans TC,
          PingFang SC,
          PingFang HK,
          PingFang TC,
          sans-serif !important;
        }
      }
      // 底色
      .dark body {
        background-color: rgb(35, 34, 34);
      }
      // 文本不可选取
      .forbid-copy {
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
      }

      .dark #theme-typography {
        background-image: linear-gradient(
              to right,
              rgb(255 255 255 / 0.04) 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, rgb(255 255 255 / 0.04) 1px, transparent 1px);
      }

      #theme-typography {
        --primary-color: #2e405b;
        background-color: rgb(255 255 255) / 1;
        color: #2e405b;
        background-size: 7px 7px;
        text-shadow: 1px 1px 1px rgb(0 0 0 / 0.04);
        background-image: linear-gradient(
            to right,
            rgb(0 0 0 / 0.04) 1px,
            transparent 1px
          ),
          linear-gradient(to bottom, rgb(0 0 0 / 0.04) 1px, transparent 1px);
      }

      #theme-typography #blog-name {
        font-family: HiraMinProN-W6, 'Source Han Serif CN',
          'Source Han Serif SC', 'Source Han Serif TC', serif;
      }

      #theme-typography #blog-name-en {
        font-family: HiraMinProN-W6, 'Source Han Serif CN',
          'Source Han Serif SC', 'Source Han Serif TC', serif;
      }

      #theme-typography .blog-item-title {
        color: #276077;
      }

      .dark #theme-typography .blog-item-title {
        color: #d1d5db;
      }

      .notion {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }

      #container-wrapper .scroll-hidden {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
    `}</style>
  )
}

export { Style }
