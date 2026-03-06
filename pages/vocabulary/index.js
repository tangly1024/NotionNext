'use client';

import Link from 'next/link';
import { vocabCategories } from '@/data/vocabData';

// 原生 SVG 图标
const IconBookOpen = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
const IconChevronRight = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

// 动态生成高清大图 (宽图模式)
const getCover = (id, originalCover) => {
  if (originalCover && !originalCover.includes('pixabay.com/zh/images/download')) {
    return originalCover;
  }
  // 使用 picsum 的 seed 模式生成 800x400 的宽比例随机图
  return `https://picsum.photos/seed/${id}/800/450`;
};

export default function VocabularyIndexPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', paddingBottom: 80, fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px' }}>
        
        {/* 顶部标题区 */}
        <header style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, backgroundColor: '#DBEAFE', color: '#2563EB', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconBookOpen size={22} />
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>
              词汇库
            </h1>
          </div>
          <p style={{ fontSize: 14, color: '#64748B', marginLeft: 52, fontWeight: 500 }}>
            选择核心模块，开始沉浸式学习
          </p>
        </header>

        {/* 🌟 核心改动：大图卡片列表 🌟 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {vocabCategories.map((cat) => {
            const itemsCount = (cat.items || []).length;
            
            return (
              <Link key={cat.id} href={`/vocabulary/${cat.id}`} style={{ textDecoration: 'none' }}>
                <div 
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    overflow: 'hidden', // 必须隐藏溢出，否则图片圆角不生效
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)', // 更强的投影，增加立体感
                    border: '1px solid #F1F5F9',
                    transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                  onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  
                  {/* 上半部分：大封面图 (16:9 比例) */}
                  <div style={{ width: '100%', aspectRatio: '16 / 9', backgroundColor: '#E2E8F0', position: 'relative' }}>
                    <img 
                      src={getCover(cat.id, cat.cover)} 
                      alt={cat.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = getCover(cat.id + 'fb', null); }}
                    />
                    
                    {/* 图片上的渐变遮罩 (让文字区域过渡更自然) */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.05), transparent 30%)' }} />
                  </div>

                  {/* 下半部分：文字信息 */}
                  <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1E293B', margin: 0, marginBottom: 6 }}>
                        {cat.title}
                      </h2>
                      <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {cat.description || `包含 ${itemsCount} 个精选单元`}
                      </p>
                    </div>

                    {/* 进入箭头按钮 */}
                    <div style={{ 
                      width: 44, height: 44, borderRadius: '50%', backgroundColor: '#F1F5F9', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: '#475569', marginLeft: 16, flexShrink: 0 
                    }}>
                      <IconChevronRight size={22} />
                    </div>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
