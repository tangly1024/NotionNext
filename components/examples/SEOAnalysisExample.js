import React, { useState } from 'react';
import SEOContentAnalyzer from '../SEOContentAnalyzer';
import { analyzePostSEO } from '../../lib/seo/seoUtils';

/**
 * SEO分析示例组件
 * 演示如何使用SEO内容分析工具
 */
export default function SEOAnalysisExample() {
  const [content, setContent] = useState(`
    <h1>如何优化网站SEO：完整指南</h1>
    
    <p>搜索引擎优化（SEO）是提高网站在搜索引擎结果页面排名的重要策略。本文将详细介绍SEO优化的各个方面。</p>
    
    <h2>什么是SEO</h2>
    <p>SEO是Search Engine Optimization的缩写，指的是通过优化网站内容和结构来提高搜索引擎排名的过程。</p>
    
    <h2>关键词研究</h2>
    <p>关键词研究是SEO的基础。你需要找到用户搜索的相关关键词，并在内容中合理使用这些关键词。</p>
    
    <h3>长尾关键词的重要性</h3>
    <p>长尾关键词虽然搜索量较低，但竞争度也较低，更容易获得排名。</p>
    
    <h2>内容优化</h2>
    <p>高质量的内容是SEO成功的关键。内容应该有价值、原创且与目标关键词相关。</p>
    
    <p>记住，SEO是一个长期的过程，需要持续的努力和优化。通过遵循最佳实践，你可以提高网站的搜索引擎排名。</p>
  `);

  const [keywords, setKeywords] = useState(['SEO', '搜索引擎优化', '关键词', '网站优化']);
  const [analysisResult, setAnalysisResult] = useState(null);

  const sampleAllPages = [
    {
      title: '网站性能优化指南',
      slug: 'website-performance-optimization',
      summary: '了解如何优化网站性能，提高加载速度和用户体验',
      tags: ['性能优化', '网站优化', '用户体验'],
      category: '技术'
    },
    {
      title: '内容营销策略',
      slug: 'content-marketing-strategy',
      summary: '制定有效的内容营销策略，吸引目标受众',
      tags: ['内容营销', '营销策略', '用户增长'],
      category: '营销'
    },
    {
      title: '移动端SEO优化',
      slug: 'mobile-seo-optimization',
      summary: '针对移动设备优化网站SEO，提高移动搜索排名',
      tags: ['移动SEO', 'SEO优化', '移动优化'],
      category: '技术'
    }
  ];

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    console.log('SEO分析完成:', result);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleKeywordsChange = (e) => {
    const keywordList = e.target.value.split(',').map(k => k.trim()).filter(k => k);
    setKeywords(keywordList);
  };

  return (
    <div className="seo-analysis-example max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">SEO内容分析工具演示</h1>
        <p className="text-gray-600">
          这个示例展示了如何使用SEO内容分析工具来评估和优化网页内容的SEO表现。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 输入区域 */}
        <div className="input-section">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">内容输入</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTML内容
              </label>
              <textarea
                value={content}
                onChange={handleContentChange}
                className="w-full h-64 p-3 border border-gray-300 rounded-md resize-none font-mono text-sm"
                placeholder="输入要分析的HTML内容..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目标关键词（用逗号分隔）
              </label>
              <input
                type="text"
                value={keywords.join(', ')}
                onChange={handleKeywordsChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="SEO, 搜索引擎优化, 关键词"
              />
            </div>

            <div className="text-sm text-gray-500">
              <p className="mb-2">分析包括：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>关键词密度分析</li>
                <li>标题层级结构检查</li>
                <li>内容可读性评估</li>
                <li>内部链接优化建议</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 分析结果区域 */}
        <div className="analysis-section">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">分析结果</h2>
            
            <SEOContentAnalyzer
              content={content}
              keywords={keywords}
              currentUrl="https://example.com/seo-guide"
              allPages={sampleAllPages}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">使用说明</h3>
        <div className="text-blue-700 space-y-2">
          <p>1. <strong>内容输入</strong>：在左侧文本框中输入要分析的HTML内容</p>
          <p>2. <strong>关键词设置</strong>：输入目标关键词，用逗号分隔</p>
          <p>3. <strong>查看分析</strong>：右侧会显示详细的SEO分析结果</p>
          <p>4. <strong>优化建议</strong>：根据分析结果中的建议优化内容</p>
        </div>
      </div>

      {/* 评分说明 */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">评分标准</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="score-legend">
            <div className="w-4 h-4 bg-green-500 rounded mb-1"></div>
            <div className="text-sm">
              <div className="font-medium">90-100分</div>
              <div className="text-gray-600">优秀</div>
            </div>
          </div>
          <div className="score-legend">
            <div className="w-4 h-4 bg-blue-500 rounded mb-1"></div>
            <div className="text-sm">
              <div className="font-medium">80-89分</div>
              <div className="text-gray-600">良好</div>
            </div>
          </div>
          <div className="score-legend">
            <div className="w-4 h-4 bg-yellow-500 rounded mb-1"></div>
            <div className="text-sm">
              <div className="font-medium">70-79分</div>
              <div className="text-gray-600">一般</div>
            </div>
          </div>
          <div className="score-legend">
            <div className="w-4 h-4 bg-orange-500 rounded mb-1"></div>
            <div className="text-sm">
              <div className="font-medium">60-69分</div>
              <div className="text-gray-600">较差</div>
            </div>
          </div>
          <div className="score-legend">
            <div className="w-4 h-4 bg-red-500 rounded mb-1"></div>
            <div className="text-sm">
              <div className="font-medium">0-59分</div>
              <div className="text-gray-600">很差</div>
            </div>
          </div>
        </div>
      </div>

      {/* API使用示例 */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">API使用示例</h3>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`import { analyzePostSEO } from '../lib/seo/seoUtils';

// 分析单篇文章
const analysis = await analyzePostSEO(post, allPosts, siteInfo);

// 使用分析组件
<SEOContentAnalyzer
  content={htmlContent}
  keywords={['关键词1', '关键词2']}
  currentUrl="https://example.com/page"
  allPages={allPages}
  onAnalysisComplete={(result) => {
    console.log('分析结果:', result);
  }}
/>`}
        </pre>
      </div>
    </div>
  );
}