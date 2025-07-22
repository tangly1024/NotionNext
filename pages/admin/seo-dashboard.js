import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { batchAnalyzeSEO, generateSEOReport, exportSEOReport } from '../../lib/seo/seoUtils';

/**
 * SEO管理仪表板页面
 * 提供网站SEO分析、监控和管理功能
 */
export default function SEODashboard() {
  const [seoReport, setSeoReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPosts, setSelectedPosts] = useState([]);

  // 模拟数据 - 在实际使用中应该从API获取
  const mockPosts = [
    {
      title: 'Next.js SEO优化完整指南',
      slug: 'nextjs-seo-guide',
      summary: '详细介绍如何在Next.js项目中实现SEO优化，包括meta标签、结构化数据等',
      tags: ['Next.js', 'SEO', '优化'],
      category: '技术',
      publishDay: '2024-01-15',
      content: '<h1>Next.js SEO优化完整指南</h1><p>SEO优化是现代网站开发的重要组成部分...</p>'
    },
    {
      title: 'React性能优化最佳实践',
      slug: 'react-performance-optimization',
      summary: '分享React应用性能优化的实用技巧和最佳实践',
      tags: ['React', '性能优化', '最佳实践'],
      category: '技术',
      publishDay: '2024-01-10',
      content: '<h1>React性能优化最佳实践</h1><p>React应用的性能优化需要从多个方面考虑...</p>'
    },
    {
      title: 'JavaScript异步编程详解',
      slug: 'javascript-async-programming',
      summary: '深入理解JavaScript中的异步编程概念和实现方式',
      tags: ['JavaScript', '异步编程', 'Promise'],
      category: '技术',
      publishDay: '2024-01-05',
      content: '<h1>JavaScript异步编程详解</h1><p>异步编程是JavaScript的核心特性之一...</p>'
    }
  ];

  const mockSiteInfo = {
    title: 'NotionNext博客',
    link: 'https://example.com',
    description: '基于Notion的现代化博客系统',
    author: 'NotionNext'
  };

  useEffect(() => {
    // 页面加载时自动执行一次分析
    handleAnalyzeSite();
  }, []);

  const handleAnalyzeSite = async () => {
    setLoading(true);
    try {
      // 执行批量SEO分析
      const results = batchAnalyzeSEO(mockPosts, mockSiteInfo);
      const report = generateSEOReport(results);
      
      setSeoReport(report);
      setSelectedPosts(results);
    } catch (error) {
      console.error('SEO分析失败:', error);
      alert('SEO分析失败，请检查控制台错误信息');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (format) => {
    if (!seoReport) return;
    
    try {
      const exportData = exportSEOReport(seoReport, format);
      const blob = new Blob([exportData], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seo-report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    }
  };

  return (
    <>
      <Head>
        <title>SEO管理仪表板 - NotionNext</title>
        <meta name="description" content="网站SEO分析、监控和管理工具" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">SEO管理仪表板</h1>
            <p className="mt-2 text-gray-600">监控和优化网站的搜索引擎表现</p>
          </div>

          {/* 操作按钮 */}
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={handleAnalyzeSite}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  分析中...
                </>
              ) : (
                '🔍 开始SEO分析'
              )}
            </button>
            
            {seoReport && (
              <>
                <button
                  onClick={() => handleExportReport('json')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  📄 导出JSON
                </button>
                <button
                  onClick={() => handleExportReport('csv')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  📊 导出CSV
                </button>
              </>
            )}
          </div>

          {seoReport && (
            <>
              {/* 总体统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="总文章数"
                  value={seoReport.summary.totalPosts}
                  icon="📚"
                  color="blue"
                />
                <StatCard
                  title="平均评分"
                  value={`${seoReport.summary.averageScore}/100`}
                  icon="⭐"
                  color="green"
                />
                <StatCard
                  title="总问题数"
                  value={seoReport.summary.totalIssues}
                  icon="⚠️"
                  color="yellow"
                />
                <StatCard
                  title="优秀文章"
                  value={seoReport.summary.scoreDistribution.excellent}
                  icon="🏆"
                  color="purple"
                />
              </div>

              {/* 评分分布图表 */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">评分分布</h3>
                <ScoreDistributionChart distribution={seoReport.summary.scoreDistribution} />
              </div>

              {/* 标签导航 */}
              <div className="bg-white rounded-lg shadow-md mb-8">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 px-6">
                    {[
                      { id: 'overview', label: '概览', icon: '📊' },
                      { id: 'top-performers', label: '优秀文章', icon: '🏆' },
                      { id: 'needs-improvement', label: '待优化', icon: '🔧' },
                      { id: 'common-issues', label: '常见问题', icon: '❗' },
                      { id: 'recommendations', label: '建议', icon: '💡' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.icon} {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'overview' && (
                    <OverviewTab report={seoReport} posts={selectedPosts} />
                  )}
                  {activeTab === 'top-performers' && (
                    <TopPerformersTab posts={seoReport.topPerformers} />
                  )}
                  {activeTab === 'needs-improvement' && (
                    <NeedsImprovementTab posts={seoReport.needsImprovement} />
                  )}
                  {activeTab === 'common-issues' && (
                    <CommonIssuesTab issues={seoReport.commonIssues} />
                  )}
                  {activeTab === 'recommendations' && (
                    <RecommendationsTab recommendations={seoReport.recommendations} />
                  )}
                </div>
              </div>
            </>
          )}

          {!seoReport && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">开始SEO分析</h3>
              <p className="text-gray-500 mb-6">点击上方按钮开始分析网站的SEO表现</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * 统计卡片组件
 */
function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    purple: 'bg-purple-50 text-purple-700',
    red: 'bg-red-50 text-red-700'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * 评分分布图表组件
 */
function ScoreDistributionChart({ distribution }) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  
  const categories = [
    { key: 'excellent', label: '优秀 (90-100)', color: 'bg-green-500', count: distribution.excellent },
    { key: 'good', label: '良好 (80-89)', color: 'bg-blue-500', count: distribution.good },
    { key: 'fair', label: '一般 (70-79)', color: 'bg-yellow-500', count: distribution.fair },
    { key: 'poor', label: '较差 (60-69)', color: 'bg-orange-500', count: distribution.poor },
    { key: 'veryPoor', label: '很差 (0-59)', color: 'bg-red-500', count: distribution.veryPoor }
  ];

  return (
    <div className="space-y-4">
      {categories.map(category => {
        const percentage = total > 0 ? (category.count / total) * 100 : 0;
        return (
          <div key={category.key} className="flex items-center">
            <div className="w-24 text-sm text-gray-600">{category.label}</div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${category.color}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
            <div className="w-16 text-sm text-gray-900 text-right">
              {category.count} ({percentage.toFixed(1)}%)
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * 概览标签页
 */
function OverviewTab({ report, posts }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最新分析结果 */}
        <div>
          <h4 className="text-lg font-semibold mb-4">📈 最新分析结果</h4>
          <div className="space-y-3">
            {posts.slice(0, 5).map((post, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 truncate">{post.title}</h5>
                  <p className="text-sm text-gray-500">
                    {post.issues} 个问题 • 发布于 {post.analysis?.postInfo?.publishDate}
                  </p>
                </div>
                <div className="ml-4">
                  <ScoreBadge score={post.score} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 快速统计 */}
        <div>
          <h4 className="text-lg font-semibold mb-4">📊 快速统计</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">已分析文章</span>
              <span className="font-semibold">{report.summary.analyzedPosts}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">平均评分</span>
              <span className="font-semibold">{report.summary.averageScore}/100</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">需要改进</span>
              <span className="font-semibold text-orange-600">
                {report.summary.scoreDistribution.poor + report.summary.scoreDistribution.veryPoor}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">表现优秀</span>
              <span className="font-semibold text-green-600">
                {report.summary.scoreDistribution.excellent}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 优秀文章标签页
 */
function TopPerformersTab({ posts }) {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">🏆 表现优秀的文章</h4>
      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900">{post.title}</h5>
                <p className="text-sm text-gray-600 mt-1">/{post.slug}</p>
              </div>
              <div className="ml-4">
                <ScoreBadge score={post.score} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">暂无优秀文章数据</p>
      )}
    </div>
  );
}

/**
 * 待优化文章标签页
 */
function NeedsImprovementTab({ posts }) {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">🔧 需要优化的文章</h4>
      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900">{post.title}</h5>
                <p className="text-sm text-gray-600 mt-1">
                  /{post.slug} • {post.issues} 个问题
                </p>
              </div>
              <div className="ml-4">
                <ScoreBadge score={post.score} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">暂无需要优化的文章</p>
      )}
    </div>
  );
}

/**
 * 常见问题标签页
 */
function CommonIssuesTab({ issues }) {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">❗ 常见SEO问题</h4>
      {issues && issues.length > 0 ? (
        <div className="space-y-4">
          {issues.map((issue, index) => (
            <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-gray-900">{issue.category}</h5>
                <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded">
                  {issue.count} 次
                </span>
              </div>
              <p className="text-sm text-gray-600">{issue.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">暂无常见问题数据</p>
      )}
    </div>
  );
}

/**
 * 建议标签页
 */
function RecommendationsTab({ recommendations }) {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">💡 优化建议</h4>
      {recommendations && recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded mr-2 ${
                  rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                  rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-blue-200 text-blue-800'
                }`}>
                  {rec.priority === 'high' ? '高优先级' : 
                   rec.priority === 'medium' ? '中优先级' : '低优先级'}
                </span>
              </div>
              <p className="text-sm text-gray-700">{rec.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">暂无优化建议</p>
      )}
    </div>
  );
}

/**
 * 评分徽章组件
 */
function ScoreBadge({ score }) {
  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
      {score}/100
    </span>
  );
}

// 静态生成页面
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 3600 // 1小时重新验证
  };
}