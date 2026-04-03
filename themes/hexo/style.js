/* eslint-disable react/no-unknown-property */
import { siteConfig } from '@/lib/config'
import CONFIG from './config'

/**
 * 这里的css样式只对当前主题生效
 * 主题客制化css
 * 修复版：解决 ID 为 theme-next 导致的样式失效问题 + 修复透明图片黑底
 * @returns
 */
const Style = () => {
  // 从配置中获取主题色，如果没有配置则使用默认值 #928CEE
  const themeColor = siteConfig('HEXO_THEME_COLOR', '#928CEE', CONFIG)

  return (
    <style jsx global>{`
      :root {
        --theme-color: ${themeColor};
      }

      /* ================================== */
      /* 1. 核心修复：针对透明图片去黑底 */
      /* ================================== */
      
      /* 使用 :has() 选择器精准定位包含 appstore.png 的卡片 
         支持 theme-next 和 theme-hexo 两种 ID
      */
      html:not(.dark) #theme-next div:has(> img[src*="appstore.png"]),
      html:not(.dark) #theme-hexo div:has(> img[src*="appstore.png"]) {
        background-color: transparent !important; /* 强制背景透明 */
        background-image: none !important;        /* 移除任何背景图 */
        box-shadow: none !important;              /* 移除阴影 */
      }

      /* 隐藏该卡片上的黑色渐变遮罩 */
      html:not(.dark) #theme-next div:has(> img[src*="appstore.png"])::before,
      html:not(.dark) #theme-hexo div:has(> img[src*="appstore.png"])::before {
        display: none !important;
        background: none !important;
      }

      /* 强制卡片内的文字变黑 */
      html:not(.dark) #theme-next div:has(> img[src*="appstore.png"]) *,
      html:not(.dark) #theme-hexo div:has(> img[src*="appstore.png"]) * {
        color: #000 !important;
        text-shadow: none !important;
      }


      /* ================================== */
      /* 2. 全局背景与通用样式 (已修正 ID) */
      /* ================================== */
      
      /* 兼容 theme-next 和 theme-hexo */
      #theme-next body, #theme-hexo body {
        background-color: #f5f5f5;
      }
      .dark #theme-next body, .dark #theme-hexo body {
        background-color: #121212; 
      }

      /* 菜单下划线动画 */
      #theme-next .menu-link, #theme-hexo .menu-link {
        text-decoration: none;
        background-image: linear-gradient(
          var(--theme-color),
          var(--theme-color)
        );
        background-repeat: no-repeat;
        background-position: bottom center;
        background-size: 0 2px;
        transition: background-size 100ms ease-in-out;
      }

      #theme-next .menu-link:hover, #theme-hexo .menu-link:hover {
        background-size: 100% 2px;
        color: var(--theme-color);
      }

      /* ================================== */
      /* 3. 各种组件颜色覆盖 (已修正 ID) */
      /* ================================== */

      /* 标题悬浮 */
      #theme-next h2:hover .menu-link, #theme-hexo h2:hover .menu-link {
        color: var(--theme-color) !important;
      }

      /* 下拉菜单 */
      #theme-next li[class*='hover:bg-indigo-500']:hover, #theme-hexo li[class*='hover:bg-indigo-500']:hover {
        background-color: var(--theme-color) !important;
      }

      /* Tag */
      #theme-next a[class*='hover:bg-indigo-400']:hover, #theme-hexo a[class*='hover:bg-indigo-400']:hover {
        background-color: var(--theme-color) !important;
      }

      /* 社交图标 */
      #theme-next i[class*='hover:text-indigo-600']:hover, #theme-hexo i[class*='hover:text-indigo-600']:hover {
        color: var(--theme-color) !important;
      }
      .dark #theme-next i[class*='dark:hover:text-indigo-400']:hover, .dark #theme-hexo i[class*='dark:hover:text-indigo-400']:hover {
        color: var(--theme-color) !important;
      }

      /* 导航文字 */
      #theme-next #nav div[class*='hover:text-indigo-600']:hover, #theme-hexo #nav div[class*='hover:text-indigo-600']:hover {
        color: var(--theme-color) !important;
      }

      /* 搜索高亮 */
      #theme-next div[class*='hover:bg-indigo-400']:hover, #theme-hexo div[class*='hover:bg-indigo-400']:hover {
        background-color: var(--theme-color) !important;
      }

      /* 进度条 */
      #theme-next .bg-indigo-600, #theme-hexo .bg-indigo-600 {
        background-color: var(--theme-color) !important;
      }

      /* 目录高亮 */
      #theme-next .border-indigo-800, #theme-hexo .border-indigo-800 {
        border-color: var(--theme-color) !important;
      }
      #theme-next .text-indigo-800, #theme-hexo .text-indigo-800 {
        color: var(--theme-color) !important;
      }
      
      /* 深色模式下的目录 */
      .dark #theme-next .catalog-item, .dark #theme-hexo .catalog-item {
        color: white !important;
        border-color: white !important;
      }
      .dark #theme-next .catalog-item:hover, .dark #theme-hexo .catalog-item:hover {
        color: var(--theme-color) !important;
      }
      .dark #theme-next .catalog-item.font-bold, .dark #theme-hexo .catalog-item.font-bold {
        border-color: var(--theme-color) !important;
      }

      /* 右键菜单 */
      #theme-next .hover\:bg-blue-600:hover, #theme-hexo .hover\:bg-blue-600:hover {
        background-color: var(--theme-color) !important;
      }

      /* 隐藏 footer (保留你之前的设置) */
      .tk-footer {
        opacity: 0;
      }

      /* 选中颜色 */
      ::selection {
        background: color-mix(in srgb, var(--theme-color) 30%, transparent);
      }

      /* 滚动条 */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background-color: var(--theme-color);
        border-radius: 4px;
      }
      * {
        scrollbar-width: thin;
        scrollbar-color: var(--theme-color) transparent;
      }
    `}</style>
  )
}

export { Style }
