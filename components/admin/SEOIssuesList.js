import React, { useState } from 'react';

/**
 * SEO问题列表组件
 * 显示和管理SEO问题及修复建议
 */
export default function SEOIssuesList({ issues = [], onFixIssue, onIgnoreIssue }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [expandedIssues, setExpandedIssues] = useState(new Set());

  // 过滤和排序问题
  const filteredIssues = issues
    .filter(issue => {
      if (filter === 'all') return true;
      return issue.priority === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      if (sortBy === 'count') {
        return (b.count || 1) - (a.count || 1);
      }
      return 0;
    });

  const toggleExpanded = (issueId) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'keywords': return '🔍';
      case 'headings': return '📝';
      case 'readability': return '📖';
      case 'links': return '🔗';
      case 'meta': return '🏷️';
      case 'images': return '🖼️';
      case 'performance': return '⚡';
      default: return '❗';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* 头部控制 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">
            SEO问题列表 ({filteredIssues.length})
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 过滤器 */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">过滤:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="all">全部</option>
                <option value="high">高优先级</option>
                <option value="medium">中优先级</option>
                <option value="low">低优先级</option>
              </select>
            </div>
            
            {/* 排序 */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">排序:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="priority">优先级</option>
                <option value="category">分类</option>
                <option value="count">频次</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 问题列表 */}
      <div className="divide-y divide-gray-200">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue, index) => {
            const issueId = `${issue.category}-${index}`;
            const isExpanded = expandedIssues.has(issueId);
            
            return (
              <div key={issueId} className={`p-4 ${getPriorityColor(issue.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg">{getPriorityIcon(issue.priority)}</span>
                      <span className="text-lg">{getCategoryIcon(issue.category)}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {issue.category} - {issue.message}
                        </h4>
                        {issue.count && (
                          <p className="text-sm text-gray-600">
                            影响 {issue.count} 个页面
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* 展开的详细信息 */}
                    {isExpanded && (
                      <div className="mt-4 pl-12 space-y-3">
                        {issue.description && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-1">问题描述:</h5>
                            <p className="text-sm text-gray-600">{issue.description}</p>
                          </div>
                        )}
                        
                        {issue.solution && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-1">解决方案:</h5>
                            <p className="text-sm text-gray-600">{issue.solution}</p>
                          </div>
                        )}
                        
                        {issue.examples && issue.examples.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-1">示例:</h5>
                            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                              {issue.examples.map((example, idx) => (
                                <li key={idx}>{example}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {issue.resources && issue.resources.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-1">相关资源:</h5>
                            <div className="space-y-1">
                              {issue.resources.map((resource, idx) => (
                                <a
                                  key={idx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 block"
                                >
                                  📖 {resource.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleExpanded(issueId)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title={isExpanded ? "收起详情" : "展开详情"}
                    >
                      {isExpanded ? '🔼' : '🔽'}
                    </button>
                    
                    {onFixIssue && (
                      <button
                        onClick={() => onFixIssue(issue)}
                        className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200 transition-colors"
                        title="标记为已修复"
                      >
                        ✅ 修复
                      </button>
                    )}
                    
                    {onIgnoreIssue && (
                      <button
                        onClick={() => onIgnoreIssue(issue)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                        title="忽略此问题"
                      >
                        ❌ 忽略
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">太棒了！</h4>
            <p className="text-gray-600">
              {filter === 'all' ? '没有发现SEO问题' : `没有${filter}优先级的问题`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * SEO问题摘要组件
 */
export function SEOIssuesSummary({ issues = [] }) {
  const summary = issues.reduce((acc, issue) => {
    acc.total += issue.count || 1;
    acc[issue.priority] = (acc[issue.priority] || 0) + (issue.count || 1);
    return acc;
  }, { total: 0, high: 0, medium: 0, low: 0 });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">问题摘要</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
          <div className="text-sm text-gray-600">总问题数</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{summary.high}</div>
          <div className="text-sm text-gray-600">🔴 高优先级</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{summary.medium}</div>
          <div className="text-sm text-gray-600">🟡 中优先级</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{summary.low}</div>
          <div className="text-sm text-gray-600">🟢 低优先级</div>
        </div>
      </div>
      
      {summary.total > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">修复进度</span>
            <span className="text-gray-900">0 / {summary.total}</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * SEO问题类别统计组件
 */
export function SEOIssuesByCategory({ issues = [] }) {
  const categories = issues.reduce((acc, issue) => {
    const category = issue.category;
    if (!acc[category]) {
      acc[category] = { count: 0, high: 0, medium: 0, low: 0 };
    }
    acc[category].count += issue.count || 1;
    acc[category][issue.priority] += issue.count || 1;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">按类别统计</h3>
      
      <div className="space-y-3">
        {Object.entries(categories).map(([category, stats]) => (
          <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{getCategoryIcon(category)}</span>
              <div>
                <div className="font-medium text-gray-900">{category}</div>
                <div className="text-sm text-gray-600">
                  {stats.count} 个问题
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              {stats.high > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                  🔴 {stats.high}
                </span>
              )}
              {stats.medium > 0 && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                  🟡 {stats.medium}
                </span>
              )}
              {stats.low > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  🟢 {stats.low}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 辅助函数
function getCategoryIcon(category) {
  switch (category) {
    case 'keywords': return '🔍';
    case 'headings': return '📝';
    case 'readability': return '📖';
    case 'links': return '🔗';
    case 'meta': return '🏷️';
    case 'images': return '🖼️';
    case 'performance': return '⚡';
    default: return '❗';
  }
}