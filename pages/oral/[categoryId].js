import Link from 'next/link';
import { oralCategories } from '@/data/oralData';

const IconLock = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const getCover = (id, originalCover) => {
  if (originalCover) return originalCover;
  return `https://picsum.photos/seed/oral-sub-${id}/600/600`;
};

export async function getStaticPaths() {
  const paths = oralCategories.map((cat) => ({
    params: { categoryId: cat.id },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const categoryId = params?.categoryId || null;
  const categoryData = oralCategories.find((c) => c.id === categoryId) || null;

  return {
    props: {
      categoryData,
    },
  };
}

export default function OralCategoryPage({ categoryData }) {
  if (!categoryData) {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
          padding: 24,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', color: '#64748B' }}>未找到该分类</div>
      </main>
    );
  }

  const subItems = Array.isArray(categoryData.items) ? categoryData.items : [];

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
        paddingBottom: 80,
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}
        >
          {subItems.map((sub) => {
            const isLocked = !!sub.locked;
            const targetUrl = `/oral/player?category=${encodeURIComponent(
              categoryData.id
            )}&listId=${encodeURIComponent(sub.id)}`;

            const card = (
              <div className={`oral-sub-card ${isLocked ? 'locked' : ''}`}>
                <img
                  src={getCover(sub.id, sub.cover)}
                  alt={sub.title}
                  className="oral-sub-image"
                  onError={(e) => {
                    const fallback = `https://picsum.photos/seed/oral-sub-${sub.id}-fallback/600/600`;
                    if (e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />

                <div className="oral-sub-soft-overlay" />

                <div className="oral-sub-text">
                  <h3 className="oral-sub-title">{sub.title}</h3>
                  {sub.subtitle ? (
                    <p className="oral-sub-subtitle">{sub.subtitle}</p>
                  ) : null}
                </div>

                {isLocked && (
                  <div className="oral-sub-lock-mask">
                    <div className="oral-sub-lock-badge">
                      <IconLock size={18} />
                    </div>
                  </div>
                )}
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
            position: relative;
            width: 100%;
            aspect-ratio: 1 / 1.18;
            overflow: hidden;
            border-radius: 12px;
            background: #e2e8f0;
            box-shadow:
              0 10px 30px rgba(15, 23, 42, 0.08),
              0 2px 8px rgba(15, 23, 42, 0.04);
            transition: transform 0.18s ease, box-shadow 0.18s ease;
            isolation: isolate;
          }

          .oral-sub-card:active {
            transform: scale(0.975);
          }

          @media (hover: hover) {
            .oral-sub-card:hover {
              transform: translateY(-3px);
              box-shadow:
                0 16px 34px rgba(15, 23, 42, 0.12),
                0 4px 10px rgba(15, 23, 42, 0.05);
            }
          }

          .oral-sub-image {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .oral-sub-soft-overlay {
            position: absolute;
            inset: 0;
            background:
              linear-gradient(
                to top,
                rgba(0, 0, 0, 0.3) 0%,
                rgba(0, 0, 0, 0.1) 45%,
                rgba(0, 0, 0, 0) 100%
              );
            z-index: 1;
          }

          .oral-sub-text {
            position: absolute;
            left: 8px;
            right: 8px;
            bottom: 8px;
            z-index: 2;
          }

          .oral-sub-title {
            margin: 0;
            font-size: 13px;
            font-weight: 900;
            line-height: 1.25;
            color: #ffffff;
            text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
            letter-spacing: -0.2px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .oral-sub-subtitle {
            margin: 4px 0 0 0;
            font-size: 10px;
            line-height: 1.3;
            color: rgba(255, 255, 255, 0.9);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
          }

          .oral-sub-lock-mask {
            position: absolute;
            inset: 0;
            z-index: 3;
            background: rgba(15, 23, 42, 0.22);
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
          }

          .oral-sub-lock-badge {
            width: 42px;
            height: 42px;
            border-radius: 999px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            background: rgba(255, 255, 255, 0.18);
            border: 1px solid rgba(255, 255, 255, 0.26);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow:
              0 8px 20px rgba(0, 0, 0, 0.16),
              inset 0 1px 0 rgba(255, 255, 255, 0.18);
          }

          @media (max-width: 420px) {
            .oral-sub-card {
              border-radius: 10px;
            }

            .oral-sub-lock-mask {
              border-radius: 10px; /* 和卡片一致 */
            }

            .oral-sub-text {
              left: 6px;
              right: 6px;
              bottom: 6px;
            }

            .oral-sub-title {
              font-size: 12px;
            }

            .oral-sub-subtitle {
              font-size: 9px;
            }
          }
        `}</style>
      </div>
    </main>
  );
}
