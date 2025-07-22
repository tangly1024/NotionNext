import React, { useState } from 'react';

/**
 * SEO优化建议组件
 * 提供个性化的SEO优化建议和行动计划
 */
export default function SEORecommendations({ recommendations = [], onApplyRecommendation }) {
  const [filter, setFilter] = useState('all');
  const [expandedRecs, setExpandedRecs] = useState(new Set());
  const [appliedRecs, setAppliedRecs] = useState(new Set());

  // 过滤建议
  const filteredRecommendations = recommendations.filter(rec => {
    if (filter === 'all') return true;
    if (filter === 'applied') return appliedRecs.has(rec.id);
    if (filter === 'pending') return !appliedRecs.has(rec.id);
    return rec.priority === filter;
  });

  const toggleExpanded = (recId) => {
    const newExpanded = new Set(expandedRecs);
    if (newExpanded.has(recId)) {
      newExpanded.delete(recId);
    } else {
      newExpanded.add(recId);
    }
    setExpandedRecs(newExpanded);
  };

  const handleApplyRecommendation = (recommendation) => {
    const newApplied = new Set(appliedRecs);
    newApplied.add(recommendation.id);
    setAppliedRecs(newApplied);
    
    if (onApplyRecommendation) {
      onApplyRecommendation(recommendation);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return '💡';
      default: return '📝';
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
      case 'content': return '📝';
      case 'technical': return '⚙️';
      case 'performance': return '⚡';
      case 'keywords': return '🔍';
      case 'links': return '🔗';
      case 'meta': return '🏷️';
      case 'images': return '🖼️';
      case 'mobile': return '📱';
      default: return '💡';
    }
  };

  const getImpactLevel = (impact) => {
    switch (impact) {
      case 'high': return { text: '高影响', color: 'text-green-600 bg-green-100' };
      case 'medium': return { text: '中影响', color: 'text-yellow-600 bg-yellow-100' };
      case 'low': return { text: '低影响', color: 'text-blue-600 bg-blue-100' };
      default: return { text: '未知', color: 'text-gray-600 bg-gray-100' };
    }
  };

  const getDifficultyLevel = (difficulty) => {
    switch (difficulty) {
      case 'easy': return { text: '简单', color: 'text-green-600' };
      case 'medium': return { text: '中等', color: 'text-yellow-600' };
      case 'hard': return { text: '困难', color: 'text-red-600' };
      default: return { text: '未知', color: 'text-gray-600' };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* 头部控制 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">
            SEO优化建议 ({filteredRecommendations.length})
          </h3>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">过滤:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="all">全部建议</option>
                <option value="high">高优先级</option>
                <option value="medium">中优先级</option>
                <option value="low">低优先级</option>
                <option value="pending">待处理</option>
                <option value="applied">已应用</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 建议列表 */}
      <div className="divide-y divide-gray-200">
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map((recommendation, index) => {
            const recId = recommendation.id || `rec-${index}`;
            const isExpanded = expandedRecs.has(recId);
            const isApplied = appliedRecs.has(recId);
            const impact = getImpactLevel(recommendation.impact);
            const difficulty = getDifficultyLevel(recommendation.difficulty);
            
            return (
              <div key={recId} className={`p-4 ${getPriorityColor(recommendation.priority)} ${isApplied ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg">{getPriorityIcon(recommendation.priority)}</span>
                      <span className="text-lg">{getCategoryIcon(recommendation.category)}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          {recommendation.title}
                          {isApplied && <span className="ml-2 text-green-600">✅</span>}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {recommendation.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* 标签 */}
                    <div className="flex items-center space-x-2 mb-3 pl-12">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${impact.color}`}>
                        📈 {impact.text}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded bg-gray-100 ${difficulty.color}`}>
                        🔧 {difficulty.text}
                      </span>
                      {recommendation.estimatedTime && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-600">
                          ⏱️ {recommendation.estimatedTime}
                        </span>
                      )}
                    </div>
                    
                    {/* 展开的详细信息 */}
                    {isExpanded && (
                      <div className="mt-4 pl-12 space-y-4">
                        {recommendation.steps && recommendation.steps.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">实施步骤:</h5>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                              {recommendation.steps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                        
                        {recommendation.benefits && recommendation.benefits.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">预期收益:</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {recommendation.benefits.map((benefit, idx) => (
                                <li key={idx}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {recommendation.tools && recommendation.tools.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">推荐工具:</h5>
                            <div className="flex flex-wrap gap-2">
                              {recommendation.tools.map((tool, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                  🛠️ {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {recommendation.resources && recommendation.resources.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">参考资源:</h5>
                            <div className="space-y-1">
                              {recommendation.resources.map((resource, idx) => (
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
                        
                        {recommendation.warning && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="flex items-start">
                              <span className="text-yellow-600 mr-2">⚠️</span>
                              <p className="text-sm text-yellow-700">{recommendation.warning}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleExpanded(recId)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title={isExpanded ? "收起详情" : "展开详情"}
                    >
                      {isExpanded ? '🔼' : '🔽'}
                    </button>
                    
                    {!isApplied && (
                      <button
                        onClick={() => handleApplyRecommendation(recommendation)}
                        className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200 transition-colors"
                        title="标记为已应用"
                      >
                        ✅ 应用
                      </button>
                    )}
                    
                    {recommendation.learnMoreUrl && (
                      <a
                        href={recommendation.learnMoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors"
                        title="了解更多"
                      >
                        📚 详情
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">暂无建议</h4>
            <p className="text-gray-600">
              {filter === 'all' ? '当前没有SEO优化建议' : `没有符合条件的建议`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * SEO建议摘要组件
 */
export function SEORecommendationsSummary({ recommendations = [] }) {
  const summary = recommendations.reduce((acc, rec) => {
    acc.total++;
    acc[rec.priority] = (acc[rec.priority] || 0) + 1;
    acc[rec.impact] = (acc[rec.impact] || 0) + 1;
    return acc;
  }, { 
    total: 0, 
    high: 0, 
    medium: 0, 
    low: 0,
    highImpact: 0,
    mediumImpact: 0,
    lowImpact: 0
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">建议摘要</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
          <div className="text-sm text-gray-600">总建议数</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{summary.high}</div>
          <div className="text-sm text-gray-600">🚨 高优先级</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{summary.medium}</div>
          <div className="text-sm text-gray-600">⚠️ 中优先级</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{summary.low}</div>
          <div className="text-sm text-gray-600">💡 低优先级</div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-700 mb-3">按影响程度分布</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">{summary.highImpact || 0}</div>
            <div className="text-xs text-gray-600">高影响</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">{summary.mediumImpact || 0}</div>
            <div className="text-xs text-gray-600">中影响</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">{summary.lowImpact || 0}</div>
            <div className="text-xs text-gray-600">低影响</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 快速行动建议组件
 */
export function QuickActionRecommendations({ recommendations = [] }) {
  const quickActions = recommendations
    .filter(rec => rec.difficulty === 'easy' && rec.impact === 'high')
    .slice(0, 3);

  if (quickActions.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        ⚡ 快速优化建议
        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
          高影响 · 易实施
        </span>
      </h3>
      
      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <div key={index} className="flex items-center p-3 bg-white rounded-lg border">
            <span className="text-lg mr-3">{getCategoryIcon(action.category)}</span>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{action.title}</h4>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
            <div className="text-sm text-green-600 font-medium">
              {action.estimatedTime || '< 30分钟'}
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
    case 'content': return '📝';
    case 'technical': return '⚙️';
    case 'performance': return '⚡';
    case 'keywords': return '🔍';
    case 'links': return '🔗';
    case 'meta': return '🏷️';
    case 'images': return '🖼️';
    case 'mobile': return '📱';
    default: return '💡';
  }
}