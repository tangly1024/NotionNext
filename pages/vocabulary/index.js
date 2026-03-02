import { useMemo } from 'react';
import Link from 'next/link';
import { vocabCategories } from '@/data/vocabData';

const FALLBACK_BG =
  'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=1200&q=80';
const FALLBACK_THUMB =
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80';

const getTitle = (obj) => obj?.title || obj?.name || obj?.zh || obj?.id || '未命名';
const getDesc = (obj) => obj?.description || obj?.desc || '';

export default function VocabularyIndexPage() {
  const firstCover = useMemo(() => vocabCategories?.[0]?.cover || FALLBACK_BG, []);

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* 背景 */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -2,
          backgroundImage: `linear-gradient(rgba(2,6,23,0.58), rgba(2,6,23,0.58)), url(${firstCover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
        {/* 只显示大分类列表 */}
        <div style={{ display: 'grid', gap: 12 }}>
          {vocabCategories.map((cat) => {
            const cover = cat.cover || FALLBACK_THUMB;

            return (
              <Link
                key={cat.id}
                href={`/vocabulary/${encodeURIComponent(cat.id)}`}
                style={{ textDecoration: 'none' }}
              >
                <section
                  style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.90)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.85)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      width: 86,
                      height: 86,
                      borderRadius: 12,
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: '#e2e8f0',
                    }}
                  >
                    <img
                      src={cover}
                      alt={getTitle(cat)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {getTitle(cat)}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 13,
                        color: '#64748b',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {getDesc(cat)}
                    </div>
                  </div>

                  <div style={{ color: '#64748b', fontWeight: 700 }}>进入</div>
                </section>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
