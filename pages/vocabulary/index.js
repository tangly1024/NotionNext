'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { vocabCategories } from '@/data/vocabData';

// 绝对稳定的占位图（当你的本地图片找不到时，会显示这两张，证明代码没问题）
const FALLBACK_BG = 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=1200&q=80';
const FALLBACK_THUMB = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80';

// ==========================================
// 原生 SVG 图标 (零依赖，绝对不报错)
// ==========================================
const IconChevronDown = ({ size = 22 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);
const IconChevronRight = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
const IconFileText = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);
const IconLock = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

// ==========================================
// 1. 折叠菜单组件 (大分类卡片)
// ==========================================
const CategoryAccordion = ({ cat }) => {
  const [isOpen, setIsOpen] = useState(false);

  // 检查并使用封面，如果是无效的 Pixabay 链接，自动回退到占位图
  let cover = cat.cover || FALLBACK_BG;
  if (cover.includes('pixabay.com/zh/images/download')) cover = FALLBACK_BG;

  // 根据你的 vocabData.js，二级分类字段名叫 items
  const subItems = cat.items || [];

  return (
    <div style={{ marginBottom: 20 }}>
      {/* --- 大分类卡片 --- */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          height: 140,
          width: '100%',
          borderRadius: 24,
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.2)',
          transform: 'translateZ(0)',
        }}
      >
        <img
          src={cover}
          alt={cat.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s',
            transform: isOpen ? 'scale(1.05)' : 'scale(1)',
          }}
          onError={(e) => { e.currentTarget.src = FALLBACK_BG; }} // 图片加载失败时显示占位图
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.4) 50%, transparent 100%)',
          }}
        />
        
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              {cat.title}
            </h2>
            <p style={{ fontSize: 13, color: '#cbd5e1', margin: '4px 0 0 0', fontWeight: 500 }}>
              {cat.description || `包含 ${subItems.length} 个学习模块`}
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            borderRadius: '50%',
            padding: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            transition: 'transform 0.3s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}>
            <IconChevronDown size={22} />
          </div>
        </div>
      </div>

      {/* --- 二级分类折叠区域 --- */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s ease-in-out',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 4px 0 4px' }}>
            
            {subItems.length === 0 && (
              <div style={{ textAlign: 'center', padding: 20, color: '#94a3b8', fontSize: 14 }}>
                暂无子分类数据
              </div>
            )}

            {subItems.map((sub) => {
              let subCover = sub.cover || FALLBACK_THUMB;
              if (subCover.includes('pixabay.com/zh/images/download')) subCover = FALLBACK_THUMB;
              
              const isLocked = sub.locked;

              // 构造跳转到 Player 的链接参数
              const targetUrl = `/vocabulary/player?category=${encodeURIComponent(cat.id)}&listId=${encodeURIComponent(sub.id)}`;

              return (
                <Link
                  key={sub.id}
                  href={isLocked ? '#' : targetUrl}
                  style={{ textDecoration: 'none' }}
                  onClick={(e) => { if(isLocked) e.preventDefault(); }} // 如果锁定则阻止跳转
                >
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: 20,
                      padding: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      border: '1px solid rgba(255,255,255,0.6)',
                      transition: 'transform 0.1s',
                      opacity: isLocked ? 0.6 : 1, // 锁定的模块变灰
                    }}
                  >
                    {/* 左侧方形图片 */}
                    <div style={{
                      width: 64,
                      height: 64,
                      borderRadius: 14,
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundColor: '#e2e8f0',
                      position: 'relative'
                    }}>
                      <img
                        src={subCover}
                        alt={sub.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.src = FALLBACK_THUMB; }}
                      />
                      {/* 锁定遮罩层 */}
                      {isLocked && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                          <IconLock size={20} />
                        </div>
                      )}
                    </div>

                    {/* 右侧文字 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 800,
                        color: '#1e293b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {sub.title}
                      </h3>
                      <p style={{
                        margin: '4px 0 0 0',
                        fontSize: 12,
                        color: '#64748b',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.4
                      }}>
                        {sub.subtitle || '暂无简介'}
                      </p>
                    </div>

                    {/* 箭头 */}
                    <div style={{ color: '#94a3b8', paddingLeft: 4 }}>
                      {isLocked ? <IconLock size={20} /> : <IconChevronRight size={20} />}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. 页面主入口
// ==========================================
export default function VocabularyIndexPage() {
  
  // 提取第一张有效图片作为大背景
  const firstCover = useMemo(() => {
    const c = vocabCategories?.[0]?.cover;
    if (!c || c.includes('pixabay.com/zh/images/download')) return FALLBACK_BG;
    return c;
  }, []);

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* 底部全屏背景 */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -2,
          backgroundImage: `linear-gradient(rgba(15,23,42,0.6), rgba(15,23,42,0.8)), url(${firstCover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '30px 16px 100px 16px' }}>
        <header style={{ marginBottom: 30 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            词汇学习库
          </h1>
          <p style={{ fontSize: 14, color: '#cbd5e1', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconFileText size={16} /> 选择一个模块开始学习
          </p>
        </header>

        <div>
          {vocabCategories.map((cat) => (
            <CategoryAccordion key={cat.id} cat={cat} />
          ))}
        </div>
      </div>
    </main>
  );
}
