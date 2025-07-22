import React, { useState } from 'react'
import Breadcrumbs, { 
  SimpleBreadcrumbs, 
  StyledBreadcrumbs, 
  useBreadcrumbs,
  BreadcrumbVariants 
} from '../Breadcrumbs'

/**
 * 面包屑导航使用示例
 */
export default function BreadcrumbExample() {
  const [selectedVariant, setSelectedVariant] = useState('default')
  
  // 模拟数据
  const mockPageData = {
    type: 'Post',
    title: '如何使用面包屑导航优化SEO',
    slug: 'breadcrumb-seo-guide',
    category: ['技术', 'SEO'],
    tags: ['面包屑', 'SEO', '用户体验']
  }
  
  const mockSiteInfo = {
    title: 'NotionNext博客',
    link: 'https://example.com'
  }
  
  const mockLocale = {
    COMMON: {
      HOME: '首页',
      CATEGORY: '分类',
      TAGS: '标签'
    },
    NAV: {
      ARCHIVE: '归档',
      SEARCH: '搜索'
    }
  }
  
  // 自定义面包屑数据
  const customBreadcrumbs = [
    { name: '首页', url: '/' },
    { name: '技术文档', url: '/docs' },
    { name: 'SEO指南', url: '/docs/seo' },
    { name: '面包屑导航', url: '/docs/seo/breadcrumbs' }
  ]
  
  // 简单面包屑数据
  const simpleBreadcrumbs = [
    { name: '首页', url: '/' },
    { name: '博客', url: '/blog' },
    { name: '当前文章', url: '/blog/current-post' }
  ]
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          面包屑导航组件示例
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          展示不同模式和样式的面包屑导航实现
        </p>
      </div>
      
      {/* 基本面包屑 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          1. 基本面包屑（自动模式）
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <Breadcrumbs
            pageData={mockPageData}
            siteInfo={mockSiteInfo}
            locale={mockLocale}
            mode="auto"
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          根据页面数据自动生成面包屑导航，包含分类层级
        </p>
      </section>
      
      {/* 智能面包屑 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          2. 智能面包屑（基于URL）
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <Breadcrumbs
            pageData={mockPageData}
            siteInfo={mockSiteInfo}
            locale={mockLocale}
            mode="smart"
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          基于当前URL路径智能生成面包屑导航
        </p>
      </section>
      
      {/* 自定义面包屑 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          3. 自定义面包屑
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <Breadcrumbs
            customBreadcrumbs={customBreadcrumbs}
            siteInfo={mockSiteInfo}
            mode="custom"
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          使用自定义数据生成面包屑导航
        </p>
      </section>
      
      {/* 简化面包屑 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          4. 简化面包屑组件
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <SimpleBreadcrumbs items={simpleBreadcrumbs} />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          适用于简单场景的轻量级面包屑组件
        </p>
      </section>
      
      {/* 样式变体 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          5. 样式变体
        </h2>
        
        {/* 变体选择器 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(BreadcrumbVariants).map(variant => (
            <button
              key={variant}
              onClick={() => setSelectedVariant(variant)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedVariant === variant
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {variant}
            </button>
          ))}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <StyledBreadcrumbs
            variant={selectedVariant}
            customBreadcrumbs={customBreadcrumbs}
            siteInfo={mockSiteInfo}
            mode="custom"
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          选择不同的样式变体查看效果
        </p>
      </section>
      
      {/* 配置选项 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          6. 配置选项示例
        </h2>
        
        {/* 自定义分隔符 */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            自定义分隔符
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
            <Breadcrumbs
              customBreadcrumbs={customBreadcrumbs}
              siteInfo={mockSiteInfo}
              mode="custom"
              separator=">"
            />
            <Breadcrumbs
              customBreadcrumbs={customBreadcrumbs}
              siteInfo={mockSiteInfo}
              mode="custom"
              separator="→"
            />
            <Breadcrumbs
              customBreadcrumbs={customBreadcrumbs}
              siteInfo={mockSiteInfo}
              mode="custom"
              separator="•"
            />
          </div>
        </div>
        
        {/* 限制项目数量 */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            限制项目数量（maxItems=3）
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <Breadcrumbs
              customBreadcrumbs={customBreadcrumbs}
              siteInfo={mockSiteInfo}
              mode="custom"
              maxItems={3}
            />
          </div>
        </div>
        
        {/* 隐藏首页 */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            隐藏首页链接
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <Breadcrumbs
              customBreadcrumbs={customBreadcrumbs}
              siteInfo={mockSiteInfo}
              mode="custom"
              showHome={false}
            />
          </div>
        </div>
      </section>
      
      {/* Hook使用示例 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          7. Hook使用示例
        </h2>
        <BreadcrumbHookExample 
          pageData={mockPageData}
          siteInfo={mockSiteInfo}
          locale={mockLocale}
        />
      </section>
      
      {/* 结构化数据预览 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          8. 结构化数据
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            面包屑组件自动生成JSON-LD结构化数据，有助于SEO优化
          </p>
          <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首页",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem", 
      "position": 2,
      "name": "技术文档",
      "item": "https://example.com/docs"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "SEO指南", 
      "item": "https://example.com/docs/seo"
    }
  ]
}, null, 2)}
          </pre>
        </div>
      </section>
    </div>
  )
}

/**
 * Hook使用示例组件
 */
function BreadcrumbHookExample({ pageData, siteInfo, locale }) {
  const { breadcrumbs, generateStructuredData } = useBreadcrumbs(
    pageData, 
    siteInfo, 
    locale,
    { optimize: true, optimizeOptions: { maxItems: 4 } }
  )
  
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        使用 useBreadcrumbs Hook 获取面包屑数据：
      </p>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="text-sm">
          <strong>面包屑数量：</strong> {breadcrumbs.length}
        </div>
        <div className="text-sm mt-1">
          <strong>面包屑路径：</strong> {breadcrumbs.map(b => b.name).join(' > ')}
        </div>
        <button
          onClick={() => {
            const structuredData = generateStructuredData()
            console.log('结构化数据:', structuredData)
            alert('结构化数据已输出到控制台')
          }}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
        >
          生成结构化数据
        </button>
      </div>
    </div>
  )
}