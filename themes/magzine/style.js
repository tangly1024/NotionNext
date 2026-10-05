/* eslint-disable react/no-unknown-property */
import CONFIG from './config'
import { buildThemePrimaryCss } from '@/lib/themeColorCss'
import { themeConsoleStyle } from '@/lib/themeConsoleStyle'
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

      /* 自定义滚动条样式（适用于 Chrome、Safari 和 Edge） */
      html::-webkit-scrollbar {
        width: 12px;
      }

      html::-webkit-scrollbar-track {
        background-color: transparent;
      }

      html::-webkit-scrollbar-thumb {
        background: #4e4e4e;
      }

      ${themeConsoleStyle('magzine', CONFIG)}
      ${buildThemePrimaryCss('#theme-magzine', '--magzine-console-primary')}

      #theme-magzine .cta a:hover,
      #theme-magzine .cta a:focus-visible {
        color: #111827 !important;
      }

  `}</style>
  )
}

export { Style }
