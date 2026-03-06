'use client';

import Link from 'next/link';
import { vocabCategories } from '@/data/vocabData';

// ==========================================
// 纯原生 SVG 图标 (彻底解决所有打包报错问题)
// ==========================================
const IconBookOpen = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
const IconChevronRight = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

// 动态生成绝对不重复的精美配图
const getCover = (id, originalCover) => {
  if (originalCover && !originalCover.includes('pixabay.com/zh/images/download')) {
    return originalCover;
  }
  return `https://picsum.photos/seed/${id}/200/200`;
};

export default function VocabularyIndexPage() {
  return (
    // 极简浅色背景，告别黑灰压抑感
    <main style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', paddingBottom: 80, fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px' }}>
        
        {/* 顶部清新标题区 */}
        <header style={{ marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, backgroundColor: '#DBEAFE', color: '#2563EB', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <IconBookOpen size={24} />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>
            词汇学习库
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 8, fontWeight: 500 }}>
            选择一个核心模块，开始沉浸式学习
          </p>
        </header>

        {/* 极简卡片列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {vocabCategories.map((cat) => {
            const itemsCount = (cat.items || []).length;
            
            return (
              <Link key={cat.id} href={`/vocabulary/${cat.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: 16,
                  borderRadius: 24,
                  boxShadow: '0 4px 20px -4px rgba(0,0,0,0.05)',
                  border: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'transform 0.1s',
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  
                  {/* 左侧精美方图 */}
                  <div style={{ width: 80, height: 80, borderRadius: 16, overflow: 'hidden', backgroundColor: '#E2E8F0', flexShrink: 0 }}>
                    <img 
                      src={getCover(cat.id, cat.cover)} 
                      alt={cat.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = getCover(cat.id + 'fallback', null); }}
                    />
                  </div>

                  {/* 中间文字 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cat.title}
                    </h2>
                    <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                      {cat.description || `包含 ${itemsCount} 个学习阶段`}
                    </p>
                  </div>

                  {/* 右侧箭头 */}
                  <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', flexShrink: 0 }}>
                    <IconChevronRight size={18} />
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
