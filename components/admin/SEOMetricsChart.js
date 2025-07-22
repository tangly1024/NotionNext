import React, { useState, useEffect } from 'react';

/**
 * SEO指标图表组件
 * 提供各种SEO指标的可视化展示
 */
export default function SEOMetricsChart({ data, type = 'bar' }) {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    // 动画效果
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 100);

    return () => clearTimeout(timer);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-500">暂无数据</p>
        </div>
      </div>
    );
  }

  if (type === 'bar') {
    return <BarChart data={data} animationProgress={animationProgress} />;
  }

  if (type === 'line') {
    return <LineChart data={data} animationProgress={animationProgress} />;
  }

  if (type === 'pie') {
    return <PieChart data={data} animationProgress={animationProgress} />;
  }

  return <BarChart data={data} animationProgress={animationProgress} />;
}

/**
 * 柱状图组件
 */
function BarChart({ data, animationProgress }) {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="h-64 flex items-end justify-between p-4 bg-white rounded-lg border">
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 200 * (animationProgress / 100);
        
        return (
          <div key={index} className="flex flex-col items-center flex-1 mx-1">
            <div className="text-xs text-gray-600 mb-1 font-medium">
              {item.value}
            </div>
            <div
              className={`w-full rounded-t transition-all duration-1000 ease-out ${
                item.color || 'bg-blue-500'
              }`}
              style={{ height: `${height}px` }}
            ></div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * 折线图组件
 */
function LineChart({ data, animationProgress }) {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 300;
    const y = 200 - ((item.value - minValue) / range) * 180;
    return `${x},${y}`;
  }).join(' ');

  const animatedPoints = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 300;
    const y = 200 - ((item.value - minValue) / range) * 180 * (animationProgress / 100);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="h-64 p-4 bg-white rounded-lg border">
      <svg width="100%" height="200" viewBox="0 0 300 200">
        {/* 网格线 */}
        <defs>
          <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* 折线 */}
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={animatedPoints}
          className="transition-all duration-1000 ease-out"
        />
        
        {/* 数据点 */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 300;
          const y = 200 - ((item.value - minValue) / range) * 180 * (animationProgress / 100);
          
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                className="transition-all duration-1000 ease-out"
              />
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {item.value}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* X轴标签 */}
      <div className="flex justify-between mt-2">
        {data.map((item, index) => (
          <div key={index} className="text-xs text-gray-500 text-center flex-1">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 饼图组件
 */
function PieChart({ data, animationProgress }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  return (
    <div className="h-64 flex items-center justify-center p-4 bg-white rounded-lg border">
      <div className="flex items-center">
        {/* 饼图 */}
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="2"
            />
            
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360 * (animationProgress / 100);
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += (percentage / 100) * 360;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  className="transition-all duration-1000 ease-out"
                />
              );
            })}
          </svg>
        </div>
        
        {/* 图例 */}
        <div className="ml-6 space-y-2">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            
            return (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 rounded mr-2"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-sm text-gray-700">
                  {item.label}: {item.value} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * SEO趋势图表组件
 */
export function SEOTrendChart({ trendData }) {
  if (!trendData || trendData.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">📈 SEO趋势</h3>
        <div className="flex items-center justify-center h-48 bg-gray-50 rounded">
          <p className="text-gray-500">暂无趋势数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">📈 SEO趋势</h3>
      <SEOMetricsChart data={trendData} type="line" />
    </div>
  );
}

/**
 * SEO评分分布图表组件
 */
export function SEOScoreDistribution({ distribution }) {
  const chartData = [
    { label: '优秀', value: distribution.excellent, color: 'bg-green-500' },
    { label: '良好', value: distribution.good, color: 'bg-blue-500' },
    { label: '一般', value: distribution.fair, color: 'bg-yellow-500' },
    { label: '较差', value: distribution.poor, color: 'bg-orange-500' },
    { label: '很差', value: distribution.veryPoor, color: 'bg-red-500' }
  ].filter(item => item.value > 0);

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">📊 评分分布</h3>
      <SEOMetricsChart data={chartData} type="pie" />
    </div>
  );
}

/**
 * SEO问题类型统计图表
 */
export function SEOIssueTypeChart({ issues }) {
  const issueTypes = {};
  
  issues.forEach(issue => {
    issueTypes[issue.category] = (issueTypes[issue.category] || 0) + issue.count;
  });

  const chartData = Object.entries(issueTypes).map(([category, count]) => ({
    label: category,
    value: count
  }));

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">🔍 问题类型统计</h3>
      <SEOMetricsChart data={chartData} type="bar" />
    </div>
  );
}