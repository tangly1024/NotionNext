/* eslint-disable react/no-unknown-property */
import { responsiveClasses, MOBILE_OPTIMIZED_LAYOUTS } from '@/lib/utils/responsive'

/**
 * 移动端优化样式 - 通用主题增强
 * 为所有主题提供统一的移动端优化
 */
const MobileOptimizedStyle = ({ themeId }) => {
  return (
    <style jsx global>{`
      /* === 通用移动端优化 === */
      
      /* 触摸设备优化 */
      @media (hover: none) and (pointer: coarse) {
        /* 增大触摸目标 */
        ${themeId} button,
        ${themeId} a,
        ${themeId} .clickable {
          min-height: 44px;
          min-width: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        /* 优化点击反馈 */
        ${themeId} button:active,
        ${themeId} a:active,
        ${themeId} .clickable:active {
          opacity: 0.7;
          transform: scale(0.98);
        }
      }
      
      /* 小屏幕设备优化 */
      @media (max-width: 767px) {
        /* 容器和间距 */
        ${themeId} .container {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        
        /* 文字大小调整 */
        ${themeId} h1 {
          font-size: 1.875rem; /* 30px */
          line-height: 2.25rem;
        }
        
        ${themeId} h2 {
          font-size: 1.5rem; /* 24px */
          line-height: 2rem;
        }
        
        ${themeId} h3 {
          font-size: 1.25rem; /* 20px */
          line-height: 1.75rem;
        }
        
        /* 导航菜单优化 */
        ${themeId} .nav-menu {
          flex-direction: column;
          width: 100%;
        }
        
        ${themeId} .nav-item {
          width: 100%;
          text-align: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .dark ${themeId} .nav-item {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }
        
        /* 卡片布局优化 */
        ${themeId} .card-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        ${themeId} .card {
          margin-bottom: 1rem;
        }
        
        /* 表格响应式 */
        ${themeId} table {
          font-size: 0.875rem;
        }
        
        ${themeId} .table-responsive {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        /* 图片优化 */
        ${themeId} img {
          max-width: 100%;
          height: auto;
        }
        
        /* 侧边栏隐藏 */
        ${themeId} .sidebar {
          display: none;
        }
        
        ${themeId} .sidebar.mobile-visible {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 50;
          background: white;
          overflow-y: auto;
        }
        
        .dark ${themeId} .sidebar.mobile-visible {
          background: #1a1a1a;
        }
      }
      
      /* 平板设备优化 */
      @media (min-width: 768px) and (max-width: 1023px) {
        ${themeId} .card-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        
        ${themeId} .sidebar {
          width: 250px;
        }
      }
      
      /* 暗黑模式优化 */
      .dark ${themeId} {
        /* 确保暗黑模式下的对比度 */
        color: #e5e5e5;
      }
      
      .dark ${themeId} .card {
        background-color: #2a2a2a;
        border-color: #404040;
      }
      
      .dark ${themeId} .nav-item:hover {
        background-color: #3a3a3a;
      }
      
      /* 可访问性增强 */
      ${themeId} .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      
      /* 焦点样式 */
      ${themeId} *:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      
      .dark ${themeId} *:focus {
        outline-color: #60a5fa;
      }
      
      /* 高对比度模式支持 */
      @media (prefers-contrast: high) {
        ${themeId} {
          filter: contrast(150%);
        }
      }
      
      /* 减少动画选项 */
      @media (prefers-reduced-motion: reduce) {
        ${themeId} * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      /* 横屏手机优化 */
      @media (max-height: 500px) and (orientation: landscape) {
        ${themeId} .header {
          height: auto;
          min-height: 60px;
        }
        
        ${themeId} .mobile-nav {
          max-height: 70vh;
          overflow-y: auto;
        }
      }
    `}</style>
  )
}

export { MobileOptimizedStyle }