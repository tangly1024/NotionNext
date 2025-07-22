import React from 'react';
import Head from 'next/head';
import SEOAnalysisExample from '../components/examples/SEOAnalysisExample';

/**
 * SEO测试页面
 * 提供SEO内容分析工具的测试界面
 */
export default function SEOTestPage() {
  return (
    <>
      <Head>
        <title>SEO内容分析工具测试 - NotionNext</title>
        <meta name="description" content="测试和演示SEO内容分析工具的功能，包括关键词密度分析、标题结构检查、可读性分析和内部链接优化。" />
        <meta name="keywords" content="SEO, 内容分析, 关键词密度, 可读性, 内部链接, 搜索引擎优化" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <SEOAnalysisExample />
        </div>
      </div>
    </>
  );
}

// 静态生成页面
export async function getStaticProps() {
  return {
    props: {},
    // 重新验证时间（秒）
    revalidate: 3600
  };
}