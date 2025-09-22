import { conditionalClasses, combineClasses } from '@/lib/utils/responsive'

/**
 * 改进的条件类名渲染组件
 * 替代复杂的模板字符串条件渲染
 */

/**
 * 分页按钮组件 - 示例重构
 */
export const PaginationButton = ({ 
  isVisible, 
  isActive, 
  isPrev, 
  isNext, 
  onClick, 
  children,
  className = '' 
}) => {
  const buttonClasses = conditionalClasses({
    'block': isVisible,
    'hidden': !isVisible,
    'invisible': !isVisible && (isPrev || isNext),
    'dark:text-white': true,
    'relative w-full flex-1 h-14': true,
    'flex items-center transition-all duration-200': true,
    'justify-center py-2 px-2': true,
    'bg-white dark:bg-[#1e1e1e]': true,
    'border rounded-xl cursor-pointer': true,
    'opacity-70': isActive,
    'hover:bg-gray-50 dark:hover:bg-gray-800': !isActive
  })

  return (
    <div
      className={combineClasses(buttonClasses, className)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

/**
 * 菜单项组件 - 示例重构
 */
export const MenuItem = ({
  isSelected,
  isOpen,
  isDarkMode,
  href,
  children,
  className = ''
}) => {
  const linkClasses = conditionalClasses({
    'text-white': isSelected && !isDarkMode,
    'text-black': !isSelected && !isDarkMode,
    'text-gray-300': isDarkMode,
    'bg-blue-600 dark:bg-yellow-600': isSelected,
    'hover:bg-gray-100 dark:hover:bg-gray-700': !isSelected,
    'px-4 py-2 rounded-md transition-colors duration-200': true
  })

  return (
    <a
      href={href}
      className={combineClasses(linkClasses, className)}
    >
      {children}
    </a>
  )
}

/**
 * 折叠箭头组件 - 示例重构
 */
export const CollapseArrow = ({ 
  isOpen, 
  className = '',
  iconClass = 'fas fa-chevron-down'
}) => {
  const arrowClasses = conditionalClasses({
    [iconClass]: true,
    'transition-transform duration-200': true,
    'rotate-180': isOpen,
    'rotate-0': !isOpen
  })

  return <i className={combineClasses(arrowClasses, className)} />
}

/**
 * 响应式容器组件
 */
export const ResponsiveContainer = ({
  children,
  fullWidth = false,
  showPageCover = false,
  className = ''
}) => {
  const containerClasses = conditionalClasses({
    'w-full': true,
    '2xl:max-w-6xl md:max-w-4xl': !fullWidth,
    'md:pr-2': showPageCover,
    'md:pr-12': !showPageCover,
    'px-4 sm:px-6 lg:px-8': true
  })

  return (
    <div className={combineClasses(containerClasses, className)}>
      {children}
    </div>
  )
}

/**
 * 标签组件 - 示例重构
 */
export const Tag = ({
  tag,
  isSelected = false,
  onClick,
  className = ''
}) => {
  const tagClasses = conditionalClasses({
    'inline-block px-3 py-1 m-1 rounded-full text-sm': true,
    'transition-colors duration-200 cursor-pointer': true,
    'text-white bg-blue-600 dark:bg-yellow-600': isSelected,
    'text-gray-600 bg-gray-200 dark:text-gray-300 dark:bg-gray-700': !isSelected,
    'hover:bg-blue-500 dark:hover:bg-yellow-500': isSelected,
    'hover:bg-gray-300 dark:hover:bg-gray-600': !isSelected
  })

  return (
    <span
      className={combineClasses(tagClasses, className)}
      onClick={() => onClick?.(tag)}
    >
      {tag?.name || tag}
    </span>
  )
}

/**
 * 卡片组件
 */
export const Card = ({
  children,
  hover = true,
  shadow = true,
  padding = 'md',
  className = ''
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const cardClasses = conditionalClasses({
    'bg-white dark:bg-gray-800': true,
    'border border-gray-200 dark:border-gray-700': true,
    'rounded-lg': true,
    'transition-all duration-200': hover,
    'hover:shadow-lg hover:scale-105': hover,
    'shadow-md': shadow,
    [paddingClasses[padding]]: true
  })

  return (
    <div className={combineClasses(cardClasses, className)}>
      {children}
    </div>
  )
}

export default {
  PaginationButton,
  MenuItem,
  CollapseArrow,
  ResponsiveContainer,
  Tag,
  Card
}