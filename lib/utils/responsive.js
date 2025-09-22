/**
 * 响应式工具类
 * 提供统一的响应式断点和工具函数
 */

// 标准断点配置
export const BREAKPOINTS = {
  xs: '(max-width: 475px)',
  sm: '(max-width: 639px)', 
  md: '(max-width: 767px)',
  lg: '(max-width: 1023px)',
  xl: '(max-width: 1279px)',
  '2xl': '(max-width: 1535px)'
}

// 移动端检测
export const isMobile = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia(BREAKPOINTS.md).matches
}

// 平板检测
export const isTablet = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches
}

// 桌面端检测
export const isDesktop = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(min-width: 1024px)').matches
}

/**
 * 响应式类名生成器
 * @param {Object} classes - 响应式类名配置
 * @returns {string} - 生成的类名字符串
 * 
 * 用法示例:
 * const className = responsiveClasses({
 *   base: 'text-base',
 *   sm: 'text-sm',
 *   md: 'text-lg',
 *   lg: 'text-xl'
 * })
 */
export const responsiveClasses = (classes) => {
  const classArray = []
  
  if (classes.base) classArray.push(classes.base)
  if (classes.xs) classArray.push(`xs:${classes.xs}`)
  if (classes.sm) classArray.push(`sm:${classes.sm}`)
  if (classes.md) classArray.push(`md:${classes.md}`)
  if (classes.lg) classArray.push(`lg:${classes.lg}`)
  if (classes.xl) classArray.push(`xl:${classes.xl}`)
  if (classes['2xl']) classArray.push(`2xl:${classes['2xl']}`)
  
  return classArray.join(' ')
}

/**
 * 条件类名辅助函数
 * @param {Object} conditions - 条件配置
 * @returns {string} - 生成的类名字符串
 * 
 * 用法示例:
 * const className = conditionalClasses({
 *   'text-white': isDarkMode,
 *   'text-black': !isDarkMode,
 *   'font-bold': isSelected
 * })
 */
export const conditionalClasses = (conditions) => {
  return Object.entries(conditions)
    .filter(([_, condition]) => condition)
    .map(([className, _]) => className)
    .join(' ')
}

/**
 * 组合类名工具
 * @param {...string} classes - 类名参数
 * @returns {string} - 合并后的类名
 */
export const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

/**
 * 移动端优化的布局配置
 */
export const MOBILE_OPTIMIZED_LAYOUTS = {
  // 容器配置
  container: responsiveClasses({
    base: 'container mx-auto px-4',
    sm: 'px-6',
    lg: 'px-8'
  }),
  
  // 网格布局
  grid: {
    autoFit: responsiveClasses({
      base: 'grid gap-4',
      sm: 'grid-cols-1 gap-6',
      md: 'grid-cols-2',
      lg: 'grid-cols-3',
      xl: 'grid-cols-4'
    }),
    
    twoCol: responsiveClasses({
      base: 'grid gap-4',
      sm: 'grid-cols-1',
      md: 'grid-cols-2'
    }),
    
    threeCol: responsiveClasses({
      base: 'grid gap-4',
      sm: 'grid-cols-1',
      md: 'grid-cols-2',
      lg: 'grid-cols-3'
    })
  },
  
  // 弹性布局
  flex: {
    responsive: responsiveClasses({
      base: 'flex',
      sm: 'flex-col',
      md: 'flex-row'
    }),
    
    stack: responsiveClasses({
      base: 'flex flex-col space-y-4',
      md: 'flex-row space-y-0 space-x-4'
    })
  },
  
  // 间距配置
  spacing: {
    section: responsiveClasses({
      base: 'py-8 px-4',
      sm: 'py-12 px-6',
      lg: 'py-16 px-8'
    }),
    
    cardPadding: responsiveClasses({
      base: 'p-4',
      sm: 'p-6',
      lg: 'p-8'
    })
  },
  
  // 文字大小
  typography: {
    heading: responsiveClasses({
      base: 'text-2xl',
      sm: 'text-3xl',
      md: 'text-4xl',
      lg: 'text-5xl'
    }),
    
    subheading: responsiveClasses({
      base: 'text-lg',
      sm: 'text-xl',
      md: 'text-2xl'
    }),
    
    body: responsiveClasses({
      base: 'text-sm',
      sm: 'text-base'
    })
  }
}

/**
 * 主题响应式配置生成器
 * @param {string} themeName - 主题名称
 * @returns {Object} - 主题特定的响应式配置
 */
export const createThemeResponsiveConfig = (themeName) => {
  const baseId = `#theme-${themeName}`
  
  return {
    // 容器选择器
    container: `${baseId} .container`,
    
    // 移动端导航
    mobileNav: conditionalClasses({
      [`${baseId} .mobile-nav`]: true,
      'block': true,
      'md:hidden': true
    }),
    
    // 桌面端导航  
    desktopNav: conditionalClasses({
      [`${baseId} .desktop-nav`]: true,
      'hidden': true,
      'md:block': true
    }),
    
    // 侧边栏
    sidebar: conditionalClasses({
      [`${baseId} .sidebar`]: true,
      'w-full': true,
      'md:w-64': true,
      'lg:w-80': true
    })
  }
}

export default {
  BREAKPOINTS,
  isMobile,
  isTablet, 
  isDesktop,
  responsiveClasses,
  conditionalClasses,
  combineClasses,
  MOBILE_OPTIMIZED_LAYOUTS,
  createThemeResponsiveConfig
}