'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { vocabCategories } from '@/data/vocabData';

// 备用图片
const FALLBACK_BG = 'https://picsum.photos/seed/vocab-bg/1200/800';
const FALLBACK_THUMB = 'https://picsum.photos/seed/vocab-thumb/400/400';

const getTitle = (obj) => obj?.title || obj?.name || obj?.zh || obj?.id || '未命名';
const getDesc = (obj) => obj?.description || obj?.desc || '暂无简介';

// ==========================================
// 原生 SVG 图标 (彻底摆脱 lucide-react 依赖，解决打包报错)
// ==========================================
const IconChevronDown = ({ size = 22 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const IconChevronRight = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const IconFileText = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" x2="8" y1="13" y2="13"/>
    <line x1="16" x2="8" y1="17" y2="17"/>
    <line x1="10" x2="8" y1="9" y2="9"/>
  </svg>
);

// ==========================================
// 1. 折叠菜单组件 (大分类卡片)
// ==========================================
const CategoryAccordion = ({ cat }) => {
  const [isOpen, setIsOpen] = useState(false);

  const cover = cat.cover || FALLBACK_BG;
  
  // 智能兼容：如果没有子分类，自动生成一个
  const subCategories = cat.subCategories && cat.subCategories.length > 0 
    ? cat.subCategories 
    : [
        {
          id: cat.id, 
          title: '全部词汇', 
          desc: '点击进入此分类下的所有词汇学习',
          cover: cat.cover || FALLBACK_THUMB
        }
      ];

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
          alt={getTitle(cat)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s',
            transform: isOpen ? 'scale(1.05)' : 'scale(1)',
          }}
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
              {getTitle(cat)}
            </h2>
            <p style={{ fontSize: 13, color: '#cbd5e1', margin: '4px 0 0 0', fontWeight: 500 }}>
              包含 {subCategories.length} 个学习模块
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
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}>
            <IconChevronDown size={22} />
          </div>
        </div>
      </div>

      {/* --- 二级分类折叠区域 (纯 CSS Grid 原生动画，告别外部库) --- */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s ease-in-out',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 4px 0 4px' }}>
            {subCategories.map((sub) => {
              const subCover = sub.cover || FALLBACK_THUMB;
              
              return (
                <Link
                  key={sub.id}
                  href={`/vocabulary/${encodeURIComponent(sub.id)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      borderRadius: 20,
                      padding: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      border: '1px solid rgba(255,255,255,0.6)',
                      transition: 'transform 0.1s',
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {/* 左侧方形图片 */}
                    <div style={{
                      width: 64,
                      height: 64,
                      borderRadius: 14,
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundColor: '#e2e8f0',
                    }}>
                      <img
                        src={subCover}
                        alt={getTitle(sub)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
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
                        {getTitle(sub)}
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
                        {getDesc(sub)}
                      </p>
                    </div>

                    {/* 箭头 */}
                    <div style={{ color: '#94a3b8', paddingLeft: 4 }}>
                      <IconChevronRight size={20} />
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
  const firstCover = useMemo(() => vocabCategories?.[0]?.cover || FALLBACK_BG, []);

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
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
