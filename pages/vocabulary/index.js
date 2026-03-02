import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { vocabCategories } from '@/data/vocabData';
import { wordDataMap } from '@/data/words';

const FALLBACK_BG =
  'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=1200&q=80';
const FALLBACK_THUMB =
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80';

const getTitle = (obj) => obj?.title || obj?.name || obj?.zh || obj?.id || '未命名';
const getDesc = (obj) => obj?.description || obj?.desc || '';
const getSub = (obj) => obj?.subtitle || obj?.sub || '';

const progressKey = (categoryId, listId) => `word_progress_vocab_${categoryId}_${listId}`;

export default function VocabularyIndexPage() {
  const [openId, setOpenId] = useState(vocabCategories?.[0]?.id || null);
  const [totalsMap, setTotalsMap] = useState({});
  const [progressMap, setProgressMap] = useState({});
  const loadedRef = useRef(new Set());

  const currentCategory = useMemo(
    () => vocabCategories.find((c) => c.id === openId),
    [openId]
  );

  const bgImage = currentCategory?.cover || FALLBACK_BG;

  const loadProgress = () => {
    if (typeof window === 'undefined') return;
    const next = {};
    vocabCategories.forEach((cat) => {
      (cat.items || []).forEach((item) => {
        const raw = localStorage.getItem(progressKey(cat.id, item.id));
        const idx = Number(raw);
        next[`${cat.id}_${item.id}`] = Number.isFinite(idx) && idx >= 0 ? idx + 1 : 0;
      });
    });
    setProgressMap(next);
  };

  useEffect(() => {
    loadProgress();
    window.addEventListener('focus', loadProgress);
    window.addEventListener('storage', loadProgress);
    return () => {
      window.removeEventListener('focus', loadProgress);
      window.removeEventListener('storage', loadProgress);
    };
  }, []);

  // 展开分类时，按二级列表独立加载统计总词数（JSON 独立文件）
  useEffect(() => {
    if (!openId) return;
    if (loadedRef.current.has(openId)) return;
    loadedRef.current.add(openId);

    let cancelled = false;

    (async () => {
      const cat = vocabCategories.find((c) => c.id === openId);
      if (!cat) return;

      const tasks = (cat.items || []).map(async (item) => {
        const key = `${openId}/${item.id}`;
        const loader = wordDataMap[key];
        if (typeof loader !== 'function') return [`${openId}_${item.id}`, 0];

        try {
          const list = await loader();
          return [`${openId}_${item.id}`, Array.isArray(list) ? list.length : 0];
        } catch {
          return [`${openId}_${item.id}`, 0];
        }
      });

      const entries = await Promise.all(tasks);
      if (cancelled) return;

      setTotalsMap((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    })();

    return () => {
      cancelled = true;
    };
  }, [openId]);

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -2,
          backgroundImage: `linear-gradient(rgba(2,6,23,0.58), rgba(2,6,23,0.58)), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
        <div
          style={{
            borderRadius: 16,
            padding: 16,
            background: 'rgba(255,255,255,0.90)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}
        >
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#0f172a' }}>单词分类</h1>
          <p style={{ marginTop: 6, color: '#475569' }}>点击大分类展开二级分类</p>
        </div>

        <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
          {vocabCategories.map((cat) => {
            const isOpen = openId === cat.id;

            return (
              <section
                key={cat.id}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.88)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.85)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                }}
              >
                <button
                  onClick={() => setOpenId((prev) => (prev === cat.id ? null : cat.id))}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: 'transparent',
                    padding: 14,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{getTitle(cat)}</div>
                    <div style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>{getDesc(cat)}</div>
                  </div>
                  <div
                    style={{
                      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      color: '#64748b',
                      fontWeight: 700,
                    }}
                  >
                    ▶
                  </div>
                </button>

                {isOpen && (
                  <div style={{ borderTop: '1px solid #e2e8f0', padding: 10, background: '#f8fafc' }}>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {(cat.items || []).map((item) => {
                        const rowKey = `${cat.id}_${item.id}`;
                        const total = totalsMap[rowKey] ?? 0;
                        const done = Math.min(progressMap[rowKey] ?? 0, total || 0);
                        const percent = total > 0 ? Math.round((done / total) * 100) : 0;
                        const cover = item.cover || cat.cover || FALLBACK_THUMB;

                        const row = (
                          <div
                            style={{
                              display: 'flex',
                              gap: 12,
                              alignItems: 'center',
                              background: '#fff',
                              border: '1px solid #e2e8f0',
                              borderRadius: 12,
                              padding: 10,
                              opacity: item.locked ? 0.55 : 1,
                            }}
                          >
                            <div
                              style={{
                                width: 68,
                                height: 68,
                                borderRadius: 10,
                                overflow: 'hidden',
                                flexShrink: 0,
                                background: '#e2e8f0',
                              }}
                            >
                              <img
                                src={cover}
                                alt={getTitle(item)}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>

                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: '#0f172a',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {getTitle(item)}
                              </div>
                              <div
                                style={{
                                  marginTop: 2,
                                  fontSize: 12,
                                  color: '#64748b',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {getSub(item)}
                              </div>

                              <div
                                style={{
                                  marginTop: 8,
                                  height: 6,
                                  borderRadius: 999,
                                  background: '#e2e8f0',
                                  overflow: 'hidden',
                                }}
                              >
                                <div
                                  style={{
                                    width: `${percent}%`,
                                    height: '100%',
                                    background: '#3b82f6',
                                  }}
                                />
                              </div>
                              <div style={{ marginTop: 4, fontSize: 11, color: '#475569' }}>
                                {total > 0 ? `进度 ${done}/${total} · ${percent}%` : '未开始'}
                              </div>
                            </div>
                          </div>
                        );

                        if (item.locked) return <div key={item.id}>{row}</div>;

                        // 关键：这里保证带参数跳转
                        return (
                          <Link
                            key={item.id}
                            href={`/vocabulary/player?category=${encodeURIComponent(cat.id)}&listId=${encodeURIComponent(item.id)}`}
                            style={{ textDecoration: 'none' }}
                          >
                            {row}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
