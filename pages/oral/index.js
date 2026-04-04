'use client';

import Link from 'next/link';
import { oralCategories } from '@/data/oralData';

// 原生 SVG 图标
const IconChevronRight = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const getCover = (id, originalCover) => {
  if (originalCover) return originalCover;
  return `https://picsum.photos/seed/oral-${id}/1200/600`;
};

export default function OralIndexPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', paddingBottom: 80, fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px 32px' }}>
        {/* 大卡片列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {oralCategories.map((cat) => {
            const itemsCount = Array.isArray(cat.items) ? cat.items.length : 0;

            return (
              <Link
                key={cat.id}
                href={`/oral/${cat.id}`}
                style={{ textDecoration: 'none' }}
                prefetch={false}
              >
                <div className="oral-cover-card" style={{
                  height: 168,
                  borderRadius: 24,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 10px 30px rgba(15,23,42,0.12)',
                  cursor: 'pointer'
                }}>
                  <img
                    src={getCover(cat.id, cat.cover)}
                    alt={cat.title}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      const fallback = `https://picsum.photos/seed/oral-${cat.id}-fallback/1200/600`;
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />

                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.36) 55%, rgba(0,0,0,0.08) 100%)'
                  }} />

                  <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: 20,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: 12
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 10px',
                        borderRadius: 999,
                        marginBottom: 10,
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.96)',
                        background: 'rgba(255,255,255,0.14)',
                        border: '1px solid rgba(255,255,255,0.16)'
                      }}>
                        {itemsCount} 个模块
                      </div>

                      <h2 style={{
                        margin: 0,
                        color: '#fff',
                        fontSize: 24,
                        fontWeight: 900,
                        lineHeight: 1.18,
                        letterSpacing: '-0.4px',
                        textShadow: '0 2px 8px rgba(0,0,0,0.32)'
                      }}>
                        {cat.title}
                      </h2>

                      <p style={{
                        margin: '6px 0 0 0',
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.88)',
                        fontWeight: 500,
                        lineHeight: 1.45
                      }}>
                        {cat.description || '点击进入分类'}
                      </p>
                    </div>

                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      background: 'rgba(255,255,255,0.18)',
                      border: '1px solid rgba(255,255,255,0.16)',
                      backdropFilter: 'blur(6px)',
                      WebkitBackdropFilter: 'blur(6px)'
                    }}>
                      <IconChevronRight size={20} />
                    </div>
                  </div>
                </div>

                <style jsx>{`
                  .oral-cover-card {
                    transition: transform 0.18s ease, box-shadow 0.18s ease;
                  }
                  .oral-cover-card:active {
                    transform: scale(0.985);
                  }
                  @media (hover: hover) {
                    .oral-cover-card:hover {
                      transform: translateY(-2px);
                      box-shadow: 0 16px 36px rgba(15,23,42,0.16);
                    }
                  }
                `}</style>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
