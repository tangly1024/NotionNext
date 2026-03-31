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
  return `https://picsum.photos/seed/${id}/300/300`;
};

// 页面组件：直接接收 getStaticProps 传来的 categoryData
export default function CategoryPage({ categoryData }) {
  const router = useRouter();
  
  // 防御性判断
  if (!categoryData) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>未找到该分类</div>;
  }

  const subItems = categoryData.items ||[];

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

        {/* 🌟 核心：一排三个的网格布局 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 12 
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
                  aspectRatio: '3 / 4',
                  borderRadius: 18,
                  overflow: 'hidden',
                  backgroundColor: '#E2E8F0',
                  boxShadow: '0 6px 16px rgba(15,23,42,0.08)',
                  opacity: isLocked ? 0.65 : 1,
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  cursor: isLocked ? 'not-allowed' : 'pointer'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.94)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.94)'}
                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  
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

                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.3) 50%, transparent 100%)' 
                  }} />
                  
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

// ==========================================
// 针对 Cloudflare 静态部署必加的两个方法
// ==========================================

export async function getStaticPaths() {
  // 遍历所有分类，生成对应的路由路径
  // 例如生成：[{ params: { categoryId: 'health' } }, { params: { categoryId: 'hsk' } }]
  const paths = vocabCategories.map((cat) => ({
    params: { categoryId: cat.id },
  }));

  return {
    paths,
    // fallback 为 false 意味着如果用户访问了不存在的分类ID，直接返回 404 页面
    fallback: false, 
  };
}

export async function getStaticProps({ params }) {
  // 这里的 params 包含了上面 getStaticPaths 生成的 categoryId
  const categoryId = params.categoryId;
  const categoryData = vocabCategories.find((c) => c.id === categoryId);

  // 防御性判断，如果没找到则重定向到 404
  if (!categoryData) {
    return { notFound: true };
  }

  // 将数据作为 props 传递给页面组件
  return {
    props: {
      categoryData,
    },
  };
                        }
