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

// 动态生成高清大图
const getCover = (id, originalCover) => {
  if (originalCover && !originalCover.includes('pixabay.com/zh/images/download')) {
    return originalCover;
  }
  return `https://picsum.photos/seed/${id}/800/400`;
};

export default function VocabularyIndexPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', paddingBottom: 80, fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px' }}>
        
        {/* 顶部标题区 */}
        <header style={{ marginBottom: 24 }}>
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

        {/* 🌟 核心改动：文字叠加在图片上的大卡片 🌟 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {vocabCategories.map((cat) => {
            const itemsCount = (cat.items || []).length;
            
            return (
              <Link key={cat.id} href={`/vocabulary/${cat.id}`} style={{ textDecoration: 'none' }}>
                <div 
                  style={{
                    height: 160, // 固定高度，既不占太多屏幕，又能展示图片
                    borderRadius: 24,
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 8px 30px -6px rgba(0,0,0,0.15)',
                    transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                  onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  
                  {/* 背景图片 */}
                  <img 
                    src={getCover(cat.id, cat.cover)} 
                    alt={cat.title} 
                    style={{ 
                      position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                      zIndex: 0
                    }}
                    onError={(e) => { e.currentTarget.src = getCover(cat.id + 'fb', null); }}
                  />
                  
                  {/* 黑色渐变遮罩 (让白色文字清晰可见) */}
                  <div style={{ 
                    position: 'absolute', inset: 0, zIndex: 1,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)' 
                  }} />

                  {/* 文字内容 (叠加在最上层) */}
                  <div style={{ 
                    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
                    padding: '20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'
                  }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
                      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: 0, lineHeight: 1.2, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        {cat.title}
                      </h2>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: '4px 0 0 0', fontWeight: 500 }}>
                        {cat.description || `包含 ${itemsCount} 个学习单元`}
                      </p>
                    </div>

                    {/* 半透明圆圈箭头 */}
                    <div style={{ 
                      width: 40, height: 40, borderRadius: '50%', 
                      backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF'
                    }}>
                      <IconChevronRight size={20} />
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
