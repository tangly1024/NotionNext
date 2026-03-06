'use client';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { vocabCategories } from '@/data/vocabData';

// ==========================================
// 纯原生 SVG 图标
// ==========================================
const IconChevronLeft = ({ size = 22 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const IconLock = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

const getCover = (id, originalCover) => {
  if (originalCover && !originalCover.includes('pixabay.com/zh/images/download')) return originalCover;
  return `https://picsum.photos/seed/${id}/150/150`; // 获取小图
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
            style={{ width: 40, height: 40, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
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

        {/* 🌟 核心：一排三个的网格布局 🌟 */}
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
                  backgroundColor: '#FFFFFF',
                  borderRadius: 20,
                  padding: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  border: '1px solid #F1F5F9',
                  height: '100%',
                  opacity: isLocked ? 0.5 : 1, // 如果锁定则变半透明
                  transition: 'transform 0.1s'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  
                  {/* 卡片内部的正方形图片 */}
                  <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 12, overflow: 'hidden', backgroundColor: '#E2E8F0', position: 'relative', marginBottom: 8 }}>
                    <img 
                      src={getCover(sub.id, sub.cover)} 
                      alt={sub.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = getCover(sub.id + 'fb', null); }}
                    />
                    
                    {/* 如果是锁定状态，在图片上蒙一层黑纱并显示锁 */}
                    {isLocked && (
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                        <IconLock size={20} />
                      </div>
                    )}
                  </div>

                  {/* 标题 */}
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', margin: 0, textAlign: 'center', lineHeight: 1.2, width: '100%', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {sub.title}
                  </h3>
                  
                  {/* 副标题 */}
                  {sub.subtitle && (
                    <p style={{ fontSize: 10, color: '#94A3B8', margin: '4px 0 0 0', textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sub.subtitle}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
                }
