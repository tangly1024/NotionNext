import React, { useState, useEffect, useMemo } from 'react';
import { SEOContentAnalyzer as SEOAnalyzer } from '../lib/seo/contentAnalyzer';

/**
 * SEO内容分析器组件
 * 提供可视化的SEO内容分析界面
 */
export default function SEOContentAnalyzer({ 
  content, 
  keywords = [], 
  currentUrl, 
  allPages = [],
  onAnalysisComplete 
}) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const analyzer = useMemo(() => new SEOAnalyzer(), []);

  useEffect(() => {
    if (content) {
      performAnalysis();
    }
  }, [content, keywords, currentUrl, allPages]);

  const performAnalysis = () => {
    setLoading(true);
    try {
      // SEO分析是同步操作，不需要await
      const result = analyzer.analyzeContent({
        content,
        keywords,
        currentUrl,
        allPages
      });
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (error) {
      console.error('SEO分析失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="seo-analyzer-loading">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">正在分析内容...</span>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="seo-analyzer-empty">
        <p>请提供内容进行SEO分析</p>
      </div>
    );
  }

  return (
    <div className="seo-content-analyzer">
      {/* 总体评分 */}
      <div className="seo-score-overview mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">SEO内容分析</h3>
          <div className="flex items-center">
            <ScoreCircle score={analysis.overallScore} />
            <span className="ml-2 text-sm text-gray-600">
              {analysis.summary.description}
            </span>
          </div>
        </div>
        
        {analysis.summary.issueCount.total > 0 && (
          <div className="mt-2 text-sm">
            <span className="text-red-600">
              {analysis.summary.issueCount.high} 个高优先级问题
            </span>
            <span className="text-yellow-600 ml-4">
              {analysis.summary.issueCount.medium} 个中优先级问题
            </span>
          </div>
        )}
      </div>

      {/* 标签导航 */}
      <div className="seo-tabs mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: '概览' },
              { id: 'keywords', label: '关键词' },
              { id: 'headings', label: '标题结构' },
              { id: 'readability', label: '可读性' },
              { id: 'links', label: '内部链接' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 标签内容 */}
      <div className="seo-tab-content">
        {activeTab === 'overview' && (
          <OverviewTab analysis={analysis} />
        )}
        {activeTab === 'keywords' && (
          <KeywordsTab analysis={analysis.detailed.keywords} />
        )}
        {activeTab === 'headings' && (
          <HeadingsTab analysis={analysis.detailed.headings} />
        )}
        {activeTab === 'readability' && (
          <ReadabilityTab analysis={analysis.detailed.readability} />
        )}
        {activeTab === 'links' && (
          <LinksTab analysis={analysis.detailed.links} />
        )}
      </div>
    </div>
  );
}

/**
 * 评分圆环组件
 */
function ScoreCircle({ score }) {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-gray-300"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={getScoreColor(score)}
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${score}, 100`}
          strokeLinecap="round"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
    </div>
  );
}

/**
 * 概览标签
 */
function OverviewTab({ analysis }) {
  return (
    <div className="overview-tab">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ScoreCard 
          title="关键词优化" 
          score={analysis.detailed.keywords.overallScore || 0}
          icon="🔍"
        />
        <ScoreCard 
          title="标题结构" 
          score={analysis.detailed.headings.score || 0}
          icon="📝"
        />
        <ScoreCard 
          title="可读性" 
          score={analysis.detailed.readability.score || 0}
          icon="📖"
        />
        <ScoreCard 
          title="内部链接" 
          score={analysis.detailed.links.score || 0}
          icon="🔗"
        />
      </div>

      {/* 主要建议 */}
      {analysis.recommendations.length > 0 && (
        <div className="recommendations">
          <h4 className="text-md font-semibold mb-3">优化建议</h4>
          <div className="space-y-2">
            {analysis.recommendations.slice(0, 5).map((rec, index) => (
              <RecommendationItem key={index} recommendation={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 评分卡片组件
 */
function ScoreCard({ title, score, icon }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="score-card bg-white p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{score}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getScoreColor(score)}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

/**
 * 建议项组件
 */
function RecommendationItem({ recommendation }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '一般';
    }
  };

  return (
    <div className="recommendation-item flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(recommendation.priority)}`}>
        {getPriorityLabel(recommendation.priority)}
      </span>
      <div className="flex-1">
        <p className="text-sm text-gray-800">{recommendation.message}</p>
        <p className="text-xs text-gray-500 mt-1">分类: {recommendation.category}</p>
      </div>
    </div>
  );
}

/**
 * 关键词标签
 */
function KeywordsTab({ analysis }) {
  if (!analysis || analysis.error) {
    return <div className="text-red-600">关键词分析失败: {analysis?.error}</div>;
  }

  return (
    <div className="keywords-tab">
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3">关键词密度分析</h4>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600">
            总词数: <span className="font-medium">{analysis.totalWords}</span>
          </p>
        </div>
        
        {analysis.keywordAnalysis && analysis.keywordAnalysis.length > 0 ? (
          <div className="space-y-3">
            {analysis.keywordAnalysis.map((keyword, index) => (
              <div key={index} className="keyword-item border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{keyword.keyword}</span>
                  <span className="text-sm text-gray-600">
                    {keyword.density}% ({keyword.count}次)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${
                      keyword.recommendation.level === 'optimal' ? 'bg-green-500' :
                      keyword.recommendation.level === 'low' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(keyword.density * 10, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{keyword.recommendation.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">未指定关键词进行分析</p>
        )}
      </div>

      {analysis.topKeywords && analysis.topKeywords.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-3">高频词汇</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {analysis.topKeywords.map((word, index) => (
              <div key={index} className="bg-blue-50 px-3 py-2 rounded-lg text-center">
                <div className="font-medium text-blue-800">{word.word}</div>
                <div className="text-xs text-blue-600">{word.count}次</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 标题结构标签
 */
function HeadingsTab({ analysis }) {
  if (!analysis || analysis.error) {
    return <div className="text-red-600">标题分析失败: {analysis?.error}</div>;
  }

  return (
    <div className="headings-tab">
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3">标题层级结构</h4>
        
        {analysis.headings && analysis.headings.length > 0 ? (
          <div className="headings-list space-y-2 mb-6">
            {analysis.headings.map((heading, index) => (
              <div key={index} className="heading-item flex items-center space-x-3 p-2 border-l-4 border-blue-500 bg-blue-50">
                <span className="text-sm font-medium text-blue-600">
                  H{heading.level}
                </span>
                <span className="flex-1">{heading.text}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mb-6">未发现标题标签</p>
        )}

        {analysis.issues && analysis.issues.length > 0 && (
          <div className="issues mb-6">
            <h5 className="font-medium mb-2 text-red-600">发现的问题</h5>
            <div className="space-y-2">
              {analysis.issues.map((issue, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  issue.severity === 'high' ? 'bg-red-50 border-red-200' :
                  issue.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                } border`}>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                      issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {issue.severity === 'high' ? '高' : issue.severity === 'medium' ? '中' : '低'}
                    </span>
                    <span className="text-sm">{issue.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.suggestions && analysis.suggestions.length > 0 && (
          <div className="suggestions">
            <h5 className="font-medium mb-2 text-green-600">优化建议</h5>
            <ul className="space-y-1">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 可读性标签
 */
function ReadabilityTab({ analysis }) {
  if (!analysis || analysis.error) {
    return <div className="text-red-600">可读性分析失败: {analysis?.error}</div>;
  }

  return (
    <div className="readability-tab">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="metric-card bg-white p-4 rounded-lg border">
          <h5 className="font-medium text-gray-700">总词数</h5>
          <p className="text-2xl font-bold text-blue-600">{analysis.metrics.wordCount}</p>
        </div>
        <div className="metric-card bg-white p-4 rounded-lg border">
          <h5 className="font-medium text-gray-700">句子数</h5>
          <p className="text-2xl font-bold text-green-600">{analysis.metrics.sentenceCount}</p>
        </div>
        <div className="metric-card bg-white p-4 rounded-lg border">
          <h5 className="font-medium text-gray-700">段落数</h5>
          <p className="text-2xl font-bold text-purple-600">{analysis.metrics.paragraphCount}</p>
        </div>
        <div className="metric-card bg-white p-4 rounded-lg border">
          <h5 className="font-medium text-gray-700">平均句长</h5>
          <p className="text-2xl font-bold text-orange-600">{analysis.metrics.averageWordsPerSentence}</p>
        </div>
        <div className="metric-card bg-white p-4 rounded-lg border">
          <h5 className="font-medium text-gray-700">阅读时间</h5>
          <p className="text-2xl font-bold text-red-600">{analysis.metrics.readingTime}分钟</p>
        </div>
        <div className="metric-card bg-white p-4 rounded-lg border">
          <h5 className="font-medium text-gray-700">可读性评分</h5>
          <p className="text-2xl font-bold text-indigo-600">{Math.round(analysis.metrics.fleschScore)}</p>
        </div>
      </div>

      {analysis.readingLevel && (
        <div className="reading-level mb-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium mb-2">阅读难度等级</h5>
          <p className="text-lg font-semibold text-blue-600">{analysis.readingLevel.description}</p>
        </div>
      )}

      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="readability-recommendations">
          <h5 className="font-medium mb-3 text-yellow-600">可读性建议</h5>
          <div className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-gray-800">{rec.message}</p>
                <p className="text-xs text-gray-500 mt-1">类型: {rec.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 内部链接标签
 */
function LinksTab({ analysis }) {
  if (!analysis || analysis.error) {
    return <div className="text-red-600">链接分析失败: {analysis?.error}</div>;
  }

  return (
    <div className="links-tab">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="metric-card bg-white p-4 rounded-lg border">
          <h5 className="font-medium text-gray-700">内部链接数</h5>
          <p className="text-2xl font-bold text-blue-600">{analysis.metrics.totalInternalLinks}</p>
        </div>
        <div className="metric-card bg-white p-4 rounded-lg border">
          <h5 className="font-medium text-gray-700">链接密度</h5>
          <p className="text-2xl font-bold text-green-600">{analysis.metrics.linkDensity}%</p>
        </div>
        <div className="metric-card bg-white p-4 rounded-lg border">
          <h5 className="font-medium text-gray-700">唯一链接</h5>
          <p className="text-2xl font-bold text-purple-600">{analysis.metrics.uniqueLinks}</p>
        </div>
        <div className="metric-card bg-white p-4 rounded-lg border">
          <h5 className="font-medium text-gray-700">空锚文本</h5>
          <p className="text-2xl font-bold text-red-600">{analysis.metrics.emptyAnchorTexts}</p>
        </div>
      </div>

      {analysis.links && analysis.links.length > 0 && (
        <div className="links-list mb-6">
          <h5 className="font-medium mb-3">内部链接列表</h5>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {analysis.links.map((link, index) => (
              <div key={index} className="link-item p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-blue-600">{link.anchorText || '(空锚文本)'}</p>
                    <p className="text-sm text-gray-600">{link.href}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="link-suggestions mb-6">
          <h5 className="font-medium mb-3 text-orange-600">链接优化建议</h5>
          <div className="space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-gray-800">{suggestion.message}</p>
                {suggestion.relatedPages && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">推荐相关页面:</p>
                    <div className="space-y-1">
                      {suggestion.relatedPages.map((page, pageIndex) => (
                        <div key={pageIndex} className="text-xs text-blue-600">
                          {page.title} (相似度: {page.similarity}%)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.relatedPages && analysis.relatedPages.length > 0 && (
        <div className="related-pages">
          <h5 className="font-medium mb-3 text-green-600">相关页面推荐</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.relatedPages.slice(0, 6).map((page, index) => (
              <div key={index} className="related-page p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-800">{page.title}</p>
                <p className="text-sm text-green-600">相似度: {page.similarity}%</p>
                {page.summary && (
                  <p className="text-xs text-gray-600 mt-1">{page.summary.substring(0, 100)}...</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}