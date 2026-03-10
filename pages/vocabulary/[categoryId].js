'use client';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { vocabCategories } from '@/data/vocabData';

// ==========================================
// 纯原生 SVG 图标
// ==========================================
const IconChevronLeft = ({ size = 22 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const IconLock = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const getCover = (id, originalCover) => {
  if (originalCover && !originalCover.includes('pixabay.com/zh/images/download')) return originalCover;
  return `https://picsum.photos/seed/${id}/300/300`; // 稍微调大了分辨率以保证清晰度
};

const pick = (v) => (Array.isArray(v) ? v[0] : v);

export default function CategoryPage() {
  const router = useRouter();
  const categoryId = pick(router.query.categoryId);
  
  if (!router.isReady) return null;

  const categoryData = vocabCategories.find((c) => c.id === categoryId);

  if (!categoryData) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>未找到该分类</div>;
  }

  const subItems = categoryData.items || [];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', paddingBottom: 80, fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>
        
        {/* 顶部返回键与标题 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button 
            onClick={() => router.push('/vocabulary')}
            style={{ 
              width: 40, 
              height: 40, 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #E2E8F0', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#475569', 
              cursor: 'pointer', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
            }}
          >
            <IconChevronLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', margin: 0 }}>
              {categoryData.title}
            </h1>
            <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
              共 {subItems.length} 个学习模块
            </p>
          </div>
        </div>

        {/* 🌟 核心：一排三个的网格布局 (图片背景+悬浮文字) 🌟 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', // 强制分为3列
          gap: 12 // 卡片间距
        }}>
          {subItems.map((sub) => {
            const isLocked = sub.locked;
            const targetUrl = `/vocabulary/player?category=${encodeURIComponent(categoryData.id)}&listId=${encodeURIComponent(sub.id)}`;

            return (
              <Link 
                key={sub.id} 
                href={isLocked ? '#' : targetUrl}
                onClick={(e) => { if(isLocked) e.preventDefault(); }}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '3 / 4', // 保证正方形比例
                  borderRadius: 18,
                  overflow: 'hidden',
                  backgroundColor: '#E2E8F0',
                  boxShadow: '0 6px 16px rgba(15,23,42,0.08)',
                  opacity: isLocked ? 0.65 : 1, // 锁定时轻微透明
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  cursor: isLocked ? 'not-allowed' : 'pointer'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.94)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.94)'}
                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  
                  {/* 底层背景图片 */}
                  <img 
                    src={getCover(sub.id, sub.cover)} 
                    alt={sub.title}
                    style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                    onError={(e) => { e.currentTarget.src = getCover(sub.id + 'fb', null); }}
                  />

                  {/* 底部渐变遮罩 (保证白色文字清晰可见) */}
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.3) 50%, transparent 100%)' 
                  }} />
                  
                  {/* 如果是锁定状态，在正中间显示锁 */}
                  {isLocked && (
                    <div style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      backgroundColor: 'rgba(15,23,42,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'rgba(255,255,255,0.9)' 
                    }}>
                      <IconLock size={28} />
                    </div>
                  )}

                  {/* 悬浮在底部的文字信息 */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}>
                    {/* 标题 */}
                    <h3 style={{ 
                      fontSize: 14, 
                      fontWeight: 800, 
                      color: '#FFFFFF', 
                      margin: 0, 
                      lineHeight: 1.25, 
                      width: '100%', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden',
                      textShadow: '0 2px 6px rgba(0,0,0,0.6)'
                    }}>
                      {sub.title}
                    </h3>
                    
                    {/* 副标题 */}
                    {sub.subtitle && (
                      <p style={{ 
                        fontSize: 10, 
                        color: 'rgba(255,255,255,0.8)', 
                        margin: '4px 0 0 0', 
                        width: '100%', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                      }}>
                        {sub.subtitle}
                      </p>
                    )}
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
