import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { vocabCategories } from '@/data/vocabData';
import { wordDataMap } from '@/data/words';

const CATEGORY_COVERS = {
  health:
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80',
  travel:
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80',
  hsk:
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
  default:
    'https://images.unsplash.com/photo-1516542076529-1ea3854896f?auto=format&fit=crop&w=900&q=80',
};

const getProgressStorageKey = (categoryId, listId) =>
  `word_progress_vocab_${categoryId}_${listId}`;

export default function VocabularyIndexPage() {
  const [openId, setOpenId] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [totalsMap, setTotalsMap] = useState({});
  const loadedRef = useRef(new Set());

  const currentBg = useMemo(() => {
    if (!openId) return CATEGORY_COVERS.default;
    return CATEGORY_COVERS[openId] || CATEGORY_COVERS.default;
  }, [openId]);

  // 读取本地进度（WordCard 保存的 currentIndex）
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const readProgress = () => {
      const next = {};
      vocabCategories.forEach((cat) => {
        (cat.items || []).forEach((item) => {
          const key = `${cat.id}_${item.id}`;
          const raw = localStorage.getItem(getProgressStorageKey(cat.id, item.id));
          if (raw === null) {
            next[key] = null; // 未开始
            return;
          }
          const num = Number(raw);
          next[key] = Number.isFinite(num) && num >= 0 ? num : null;
        });
      });
      setProgressMap(next);
    };

    readProgress();
    window.addEventListener('focus', readProgress);
    window.addEventListener('storage', readProgress);
    return () => {
      window.removeEventListener('focus', readProgress);
      window.removeEventListener('storage', readProgress);
    };
  }, []);

  // 展开某个大分类时，按需加载该分类词库，计算每个二级列表总词数
  useEffect(() => {
    if (!openId) return;
    if (loadedRef.current.has(openId)) return;

    const loader = wordDataMap?.[openId];
    loadedRef.current.add(openId);
    if (!loader) return;

    let cancelled = false;

    (async () => {
      try {
        const categoryWords = await loader();
        if (cancelled) return;

        const category = vocabCategories.find((c) => c.id === openId);
        if (!category) return;

        const next = {};
        (category.items || []).forEach((item) => {
          const arr = categoryWords?.[item.id];
          next[`${openId}_${item.id}`] = Array.isArray(arr) ? arr.length : 0;
        });

        setTotalsMap((prev) => ({ ...prev, ...next }));
      } catch (e) {
        // 静默失败，页面照常显示
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [openId]);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${currentBg})` }}
      />
      <div className="fixed inset-0 -z-10 bg-slate-900/35 backdrop-blur-[2px]" />

      <div className="mx-auto w-full max-w-xl px-4 py-5">
        <div className="rounded-2xl border border-white/40 bg-white/30 p-4 shadow-lg backdrop-blur-xl">
          <h1 className="text-2xl font-extrabold text-white drop-shadow">单词分类</h1>
          <p className="mt-1 text-sm text-white/90">点击大分类展开二级分类</p>
        </div>

        <div className="mt-4 space-y-3">
          {vocabCategories.map((cat) => {
            const isOpen = openId === cat.id;

            return (
              <section
                key={cat.id}
                className="overflow-hidden rounded-2xl border border-white/40 bg-white/30 shadow-lg backdrop-blur-xl"
              >
                {/* 大分类头部 */}
                <button
                  onClick={() => setOpenId((prev) => (prev === cat.id ? null : cat.id))}
                  className="flex w-full items-center justify-between px-4 py-4 text-left"
                >
                  <div>
                    <h2 className="text-base font-bold text-white">{cat.title}</h2>
                    <p className="mt-1 text-xs text-white/85">{cat.description}</p>
                  </div>
                  <span
                    className={`text-white/80 transition-transform ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  >
                    ▶
                  </span>
                </button>

                {/* 二级分类 */}
                {isOpen && (
                  <div className="border-t border-white/30 bg-white/20 px-3 py-3">
                    <div className="space-y-2">
                      {(cat.items || []).map((item) => {
                        const rowKey = `${cat.id}_${item.id}`;
                        const savedIndex = progressMap[rowKey]; // null 或 数字
                        const total = totalsMap[rowKey]; // 可能 undefined（未加载到）
                        const done = savedIndex === null ? 0 : savedIndex + 1;
                        const safeDone =
                          typeof total === 'number' && total > 0
                            ? Math.min(done, total)
                            : done;
                        const percent =
                          typeof total === 'number' && total > 0
                            ? Math.round((safeDone / total) * 100)
                            : 0;

                        let progressText = '加载中...';
                        if (typeof total === 'number') {
                          if (total === 0) progressText = '暂无词条';
                          else if (safeDone <= 0) progressText = `未开始 · 共 ${total} 词`;
                          else progressText = `进度 ${safeDone}/${total} · ${percent}%`;
                        }

                        const cover =
                          item.cover ||
                          cat.cover ||
                          CATEGORY_COVERS[cat.id] ||
                          CATEGORY_COVERS.default;

                        const disabled = !!item.locked;
                        const href = `/vocabulary/player?category=${cat.id}&listId=${item.id}`;

                        const card = (
                          <div
                            className={`flex items-center gap-3 rounded-xl border px-3 py-3 ${
                              disabled
                                ? 'border-slate-200 bg-slate-100 opacity-60'
                                : 'border-white/70 bg-white/85'
                            }`}
                          >
                            {/* 左：小封面 */}
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                              <img
                                src={cover}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            {/* 右：文字 + 进度 */}
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-bold text-slate-800">
                                {item.title}
                              </div>
                              {item.subtitle ? (
                                <div className="mt-0.5 truncate text-xs text-slate-500">
                                  {item.subtitle}
                                </div>
                              ) : null}

                              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                <div
                                  className="h-full rounded-full bg-blue-500 transition-all"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <div className="mt-1 text-[11px] text-slate-600">
                                {progressText}
                              </div>
                            </div>
                          </div>
                        );

                        if (disabled) return <div key={item.id}>{card}</div>;
                        return (
                          <Link key={item.id} href={href} className="block">
                            {card}
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
