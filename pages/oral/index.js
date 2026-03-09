'use client';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { oralCategories } from '@/data/oralData';

const IconLock = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const pick = (v) => (Array.isArray(v) ? v[0] : v);

const getCover = (id, originalCover) => {
  if (originalCover) return originalCover;
  return `https://picsum.photos/seed/oral-sub-${id}/300/300`;
};

export default function OralCategoryPage() {
  const router = useRouter();
  const categoryId = pick(router.query.categoryId);

  if (!router.isReady) return null;

  const categoryData = oralCategories.find((c) => c.id === categoryId);

  if (!categoryData) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: 24 }}>
        <div style={{ textAlign: 'center', color: '#64748B' }}>未找到该分类</div>
      </main>
    );
  }

  const subItems = Array.isArray(categoryData.items) ? categoryData.items : [];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', paddingBottom: 80, fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px 32px' }}>
        
        {/* 三列网格 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12
        }}>
          {subItems.map((sub) => {
            const isLocked = !!sub.locked;
            const targetUrl = `/oral/player?category=${encodeURIComponent(categoryData.id)}&listId=${encodeURIComponent(sub.id)}`;

            const card = (
              <div className={`oral-sub-card ${isLocked ? 'locked' : ''}`}>
                <div style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: 14,
                  overflow: 'hidden',
                  backgroundColor: '#E2E8F0',
                  position: 'relative',
                  marginBottom: 8
                }}>
                  <img
                    src={getCover(sub.id, sub.cover)}
                    alt={sub.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      const fallback = `https://picsum.photos/seed/oral-sub-${sub.id}-fallback/300/300`;
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />

                  {isLocked && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(15,23,42,0.42)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF'
                    }}>
                      <IconLock size={20} />
                    </div>
                  )}
                </div>

                <h3 style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#1E293B',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  width: '100%',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {sub.title}
                </h3>

                {sub.subtitle ? (
                  <p style={{
                    fontSize: 10,
                    color: '#94A3B8',
                    margin: '4px 0 0 0',
                    textAlign: 'center',
                    width: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {sub.subtitle}
                  </p>
                ) : null}
              </div>
            );

            if (isLocked) {
              return <div key={sub.id}>{card}</div>;
            }

            return (
              <Link
                key={sub.id}
                href={targetUrl}
                style={{ textDecoration: 'none' }}
                prefetch={false}
              >
                {card}
              </Link>
            );
          })}
        </div>

        <style jsx>{`
          .oral-sub-card {
            background-color: #ffffff;
            border-radius: 20px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
            border: 1px solid #f1f5f9;
            min-height: 100%;
            transition: transform 0.14s ease, box-shadow 0.14s ease;
          }

          .oral-sub-card.locked {
            opacity: 0.62;
          }

          .oral-sub-card:active {
            transform: scale(0.965);
          }

          @media (hover: hover) {
            .oral-sub-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
            }
          }
        `}</style>
      </div>
    </main>
  );
}
