import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  generateBreadcrumbs, 
  generateSmartBreadcrumbs,
  generateCustomBreadcrumbs,
  optimizeBreadcrumbs,
  BreadcrumbManager 
} from '@/lib/seo/breadcrumbGenerator'

/**
 * 面包屑导航组件
 * 支持多种生成模式和自定义样式
 */
export default function Breadcrumbs({
  pageData = {},
  siteInfo = {},
  locale = {},
  customBreadcrumbs = null,
  mode = 'auto', // 'auto', 'smart', 'custom'
  showHome = true,
  maxItems = 5,
  maxLength = 50,
  separator = '/',
  className = '',
  linkClassName = '',
  activeClassName = '',
  separatorClassName = '',
  enableStructuredData = true,
  onClick
}) {
  const router = useRouter()
  
  // 生成面包屑数据
  const generateBreadcrumbData = () => {
    let breadcrumbs = []
    
    switch (mode) {
      case 'custom':
        if (customBreadcrumbs) {
          breadcrumbs = generateCustomBreadcrumbs(customBreadcrumbs, siteInfo)
        }
        break
      case 'smart':
        breadcrumbs = generateSmartBreadcrumbs(router.asPath, siteInfo, locale)
        break
      case 'auto':
      default:
        breadcrumbs = generateBreadcrumbs(pageData, siteInfo, router, locale)
        break
    }
    
    // 优化面包屑显示
    return optimizeBreadcrumbs(breadcrumbs, {
      showHome,
      maxItems,
      maxLength
    })
  }
  
  const breadcrumbs = generateBreadcrumbData()
  
  // 如果没有面包屑数据，不渲染
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null
  }
  
  // 处理点击事件
  const handleClick = (crumb, index) => {
    if (onClick) {
      onClick(crumb, index)
    }
  }
  
  // 默认样式类
  const defaultClasses = {
    container: 'breadcrumbs flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400',
    link: 'hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200',
    active: 'text-gray-900 dark:text-gray-200 font-medium',
    separator: 'text-gray-400 dark:text-gray-500'
  }
  
  return (
    <>
      {/* 面包屑导航 */}
      <nav 
        className={className || defaultClasses.container}
        aria-label="面包屑导航"
      >
        <ol className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            const isEllipsis = crumb.isEllipsis
            
            return (
              <li key={index} className="flex items-center space-x-2">
                {isEllipsis ? (
                  <span className={activeClassName || defaultClasses.active}>
                    {crumb.name}
                  </span>
                ) : isLast ? (
                  <span 
                    className={activeClassName || defaultClasses.active}
                    aria-current="page"
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link 
                    href={crumb.url}
                    className={linkClassName || defaultClasses.link}
                    onClick={() => handleClick(crumb, index)}
                  >
                    {crumb.name}
                  </Link>
                )}
                
                {!isLast && (
                  <span className={separatorClassName || defaultClasses.separator}>
                    {separator}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      
      {/* 结构化数据 */}
      {enableStructuredData && (
        <BreadcrumbStructuredData 
          breadcrumbs={breadcrumbs} 
          baseUrl={siteInfo?.link} 
        />
      )}
    </>
  )
}

/**
 * 面包屑结构化数据组件
 */
function BreadcrumbStructuredData({ breadcrumbs, baseUrl }) {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null
  }
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs
      .filter(crumb => !crumb.isEllipsis)
      .map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.originalName || crumb.name,
        item: crumb.url.startsWith('http') ? crumb.url : `${baseUrl || ''}${crumb.url}`
      }))
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

/**
 * 简化的面包屑组件
 * 适用于简单场景
 */
export function SimpleBreadcrumbs({ 
  items = [], 
  separator = '/', 
  className = '',
  linkClassName = '',
  activeClassName = ''
}) {
  if (!items || items.length === 0) {
    return null
  }
  
  const defaultClasses = {
    container: 'breadcrumbs flex items-center space-x-2 text-sm text-gray-600',
    link: 'hover:text-gray-900 transition-colors',
    active: 'text-gray-900 font-medium',
    separator: 'text-gray-400'
  }
  
  return (
    <nav className={className || defaultClasses.container} aria-label="面包屑导航">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <li key={index} className="flex items-center space-x-2">
              {isLast ? (
                <span 
                  className={activeClassName || defaultClasses.active}
                  aria-current="page"
                >
                  {item.name || item.title}
                </span>
              ) : (
                <Link 
                  href={item.url || item.href}
                  className={linkClassName || defaultClasses.link}
                >
                  {item.name || item.title}
                </Link>
              )}
              
              {!isLast && (
                <span className={defaultClasses.separator}>
                  {separator}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * 面包屑Hook
 * 提供面包屑数据和管理功能
 */
export function useBreadcrumbs(pageData, siteInfo, locale, options = {}) {
  const router = useRouter()
  const [breadcrumbs, setBreadcrumbs] = React.useState([])
  const [manager] = React.useState(() => new BreadcrumbManager(siteInfo, locale))
  
  React.useEffect(() => {
    const newBreadcrumbs = manager.generate(pageData, router, options)
    setBreadcrumbs(newBreadcrumbs)
  }, [pageData, router.asPath, manager, options])
  
  return {
    breadcrumbs,
    manager,
    generateStructuredData: () => manager.generateStructuredData(breadcrumbs),
    renderHtml: (renderOptions) => manager.renderHtml(breadcrumbs, renderOptions)
  }
}

/**
 * 面包屑样式变体
 */
export const BreadcrumbVariants = {
  // 默认样式
  default: {
    container: 'breadcrumbs flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400',
    link: 'hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200',
    active: 'text-gray-900 dark:text-gray-200 font-medium',
    separator: 'text-gray-400 dark:text-gray-500'
  },
  
  // 卡片样式
  card: {
    container: 'breadcrumbs bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-2 text-sm',
    link: 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors',
    active: 'text-gray-900 dark:text-gray-200 font-medium',
    separator: 'text-gray-400 dark:text-gray-500'
  },
  
  // 简洁样式
  minimal: {
    container: 'breadcrumbs flex items-center space-x-1 text-xs text-gray-500',
    link: 'hover:text-gray-700 transition-colors',
    active: 'text-gray-700 font-medium',
    separator: 'text-gray-300'
  },
  
  // 大号样式
  large: {
    container: 'breadcrumbs flex items-center space-x-3 text-base text-gray-700 dark:text-gray-300',
    link: 'hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200',
    active: 'text-gray-900 dark:text-gray-100 font-semibold',
    separator: 'text-gray-400 dark:text-gray-500 text-lg'
  }
}

/**
 * 带样式变体的面包屑组件
 */
export function StyledBreadcrumbs({ variant = 'default', ...props }) {
  const styles = BreadcrumbVariants[variant] || BreadcrumbVariants.default
  
  return (
    <Breadcrumbs
      {...props}
      className={props.className || styles.container}
      linkClassName={props.linkClassName || styles.link}
      activeClassName={props.activeClassName || styles.active}
      separatorClassName={props.separatorClassName || styles.separator}
    />
  )
}