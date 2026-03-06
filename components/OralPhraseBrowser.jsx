'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  Volume2,
  Settings2,
  X,
  Loader2,
  Play,
  Square,
  Heart,
  Languages
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { pinyin } from 'pinyin-pro';

// ===============================
// 工具
// ===============================
function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(37,99,235,${alpha})`;
  const c = hex.replace('#', '');
  const full = c.length === 3 ? c.split('').map((s) => s + s).join('') : c;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function normalizePhrase(item, index) {
  const chinese = item.chinese || item.zh || item.text || '';
  return {
    id: item.id || `${index}`,
    chinese,
    pinyin: item.pinyin || (chinese ? pinyin(chinese, { toneType: 'symbol' }) : ''),
    translation: item.burmese || item.translation || item.en || item.meaning || '',
    xieyin: item.xieyin || '',
    note: item.note || '',
    audioZh: item.audioZh || item.zhAudio || '',
    audioSecondary: item.audioSecondary || item.myAudio || item.translationAudio || '',
  };
}

// ===============================
// 音频引擎
// ===============================
const AudioEngine = {
  current: null,

  stop() {
    if (this.current) {
      this.current.pause();
      this.current.currentTime = 0;
      this.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },

  play(url) {
    return new Promise((resolve) => {
      this.stop();
      if (typeof window === 'undefined' || !url) {
        resolve();
        return;
      }

      const audio = new Audio(url);
      this.current = audio;

      audio.onended = () => {
        this.current = null;
        resolve();
      };
      audio.onerror = () => {
        this.current = null;
        resolve();
      };
      audio.play().catch(() => {
        this.current = null;
        resolve();
      });
    });
  },

  playTTS(text, voice, rate) {
    if (!text) return Promise.resolve();
    const url = `/api/tts?t=${encodeURIComponent(text)}&v=${encodeURIComponent(
      voice
    )}&r=${encodeURIComponent(rate)}`;
    return this.play(url);
  }
};

// ===============================
// 设置面板
// ===============================
function SettingsPanel({
  settings,
  setSettings,
  onClose,
  secondaryLabel = '缅文'
}) {
  const zhOptions = [
    { label: '小晓', value: 'zh-CN-XiaoxiaoMultilingualNeural' },
    { label: '小辰', value: 'zh-CN-XiaochenNeural' },
    { label: '小颜', value: 'zh-CN-XiaoyNe云 'N-YunxiaNeural' }
  ];

  const secondaryOptions = [
    { label: 'Thiha', value: 'my-MM-ThihaNeural' },
    { label: 'Nilar', value: 'my-MM-NilarNeural' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      className="fixed top-16 right-4 z-[2000] w-72 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
          播放设置
        </span>
        <button onClick={onClose}>
          <X size={16} className="text-slate-400 hover:text-red-500" />
        </button>
      </div>

      <div className="space-y-5 p-5">
        {/* 中文 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">中文朗读</span>
            <button
              onClick={() =>
                setSettings((s) => ({ ...s, zhEnabled: !s.zhEnabled }))
              }
              className={`relative h-5 w-10 rounded-full transition ${
                settings.zhEnabled ? 'bg-blue-500' : 'bg-slate-200'
              }`}
            >
              <span
                className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition"
                style={{ left: settings.zhEnabled ? 22 : 2 }}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {zhOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() =>
                  setSettings((s) => ({ ...s, zhVoice: opt.value }))
                }
                className={`rounded border px-2 py-1.5 text-[10px] font-bold transition ${
                  settings.zhVoice === opt.value
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'border-slate-100 bg-white text-slate-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-slate-400">语速</span>
            <input
              type="range"
              min="-50"
              max="50"
              step="10"
              value={settings.zhRate}
              onChange={(e) =>
                setSettings((s) => ({ ...s, zhRate: Number(e.target.value) }))
              }
              className="h-1 flex-1 appearance-none rounded-lg bg-slate-100 accent-blue-500"
            />
            <span className="w-7 text-right font-mono text-[10px] text-slate-400">
              {settings.zhRate}
            </span>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* 第二语言 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              {secondaryLabel}朗读
            </span>
            <button
              onClick={() =>
                setSettings((s) => ({
                  ...s,
                  secondaryEnabled: !s.secondaryEnabled
                }))
              }
              className={`relative h-5 w-10 rounded-full transition ${
                settings.secondaryEnabled ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            >
              <span
                className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition"
                style={{ left: settings.secondaryEnabled ? 22 : 2 }}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {secondaryOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() =>
                  setSettings((s) => ({ ...s, secondaryVoice: opt.value }))
                }
                className={`rounded border px-2 py-1.5 text-[10px] font-bold transition ${
                  settings.secondaryVoice === opt.value
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                    : 'border-slate-100 bg-white text-slate-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-slate-400">语速</span>
            <input
              type="range"
              min="-50"
              max="50"
              step="10"
              value={settings.secondaryRate}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  secondaryRate: Number(e.target.value)
                }))
              }
              className="h-1 flex-1 appearance-none rounded-lg bg-slate-100 accent-emerald-500"
            />
            <span className="w-7 text-right font-mono text-[10px] text-slate-400">
              {settings.secondaryRate}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ===============================
// 主组件
// ===============================
export default function OralPhraseBrowser({
  categoryTitle,
  title,
  subtitle,
  phrases = [],
  onBack,
  accent = '#2563EB',
  icon = '💬',
  favoriteStorageKey = 'oral_phrase_favs',
  settingsStorageKey = 'oral_phrase_settings',
  secondaryLabel = '缅文'
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [favorites, setFavorites] = useState([]);
  const [onlyFav, setOnlyFav] = useState(false);

  const loaderRef = useRef(null);
  const playTokenRef = useRef(0);

  const [settings, setSettings] = useState({
    zhEnabled: true,
    zhVoice: 'zh-CN-XiaoxiaoMultilingualNeural',
    zhRate: -10,
    secondaryEnabled: true,
    secondaryVoice: 'my-MM-ThihaNeural',
    secondaryRate: 0
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem(settingsStorageKey);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch {}
    }

    const savedFav = localStorage.getItem(favoriteStorageKey);
    if (savedFav) {
      try {
        setFavorites(JSON.parse(savedFav));
      } catch {}
    }
  }, [favoriteStorageKey, settingsStorageKey]);

  useEffect(() => {
    localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
  }, [settings, settingsStorageKey]);

  const normalized = useMemo(() => {
    return (phrases || []).map(normalizePhrase).filter((item) => item.chinese);
  }, [phrases]);

  const displayPhrases = useMemo(() => {
    if (!onlyFav) return normalized;
    return normalized.filter((item) => favorites.includes(item.id));
  }, [normalized, onlyFav, favorites]);

  useEffect(() => {
    setVisibleCount(20);
    window.scrollTo({ top: 0, behavior: 'auto' });
    AudioEngine.stop();
    setPlayingId(null);
    setIsPlayingAll(false);
  }, [title]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 20, displayPhrases.length));
        }
      },
      { rootMargin: '180px' }
    );

    const node = loaderRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [displayPhrases.length]);

  useEffect(() => {
    return () => AudioEngine.stop();
  }, []);

  const stopPlayback = () => {
    playTokenRef.current += 1;
    AudioEngine.stop();
    setPlayingId(null);
    setIsPlayingAll(false);
  };

  const playSingle = async (item) => {
    if (playingId === item.id) {
      stopPlayback();
      return;
    }

    const token = ++playTokenRef.current;
    setIsPlayingAll(false);
    setPlayingId(item.id);

    if (settings.zhEnabled && item.chinese) {
      if (item.audioZh) {
        await AudioEngine.play(item.audioZh);
      } else {
        await AudioEngine.playTTS(item.chinese, settings.zhVoice, settings.zhRate);
      }
      if (playTokenRef.current !== token) return;
    }

    if (settings.secondaryEnabled && item.translation) {
      await new Promise((r) => setTimeout(r, 260));
      if (playTokenRef.current !== token) return;

      if (item.audioSecondary) {
        await AudioEngine.play(item.audioSecondary);
      } else {
        await AudioEngine.playTTS(
          item.translation,
          settings.secondaryVoice,
          settings.secondaryRate
        );
      }
    }

    if (playTokenRef.current === token) {
      setPlayingId(null);
    }
  };

  const playAll = async () => {
    if (isPlayingAll) {
      stopPlayback();
      return;
    }

    const token = ++playTokenRef.current;
    setIsPlayingAll(true);

    for (const item of displayPhrases) {
      if (playTokenRef.current !== token) break;
      setPlayingId(item.id);

      if (settings.zhEnabled && item.chinese) {
        if (item.audioZh) {
          await AudioEngine.play(item.audioZh);
        } else {
          await AudioEngine.playTTS(item.chinese, settings.zhVoice, settings.zhRate);
        }
      }

      if (playTokenRef.current !== token) break;

      if (settings.secondaryEnabled && item.translation) {
        await new Promise((r) => setTimeout(r, 260));
        if (playTokenRef.current !== token) break;

        if (item.audioSecondary) {
          await AudioEngine.play(item.audioSecondary);
        } else {
          await AudioEngine.playTTS(
            item.translation,
            settings.secondaryVoice,
            settings.secondaryRate
          );
        }
      }

      await new Promise((r) => setTimeout(r, 220));
    }

    if (playTokenRef.current === token) {
      setPlayingId(null);
      setIsPlayingAll(false);
    }
  };

  const toggleFav = (id) => {
    const next = favorites.includes(id)
      ? favorites.filter((x) => x !== id)
      : [...favorites, id];

    setFavorites(next);
    localStorage.setItem(favoriteStorageKey, JSON.stringify(next));
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-slate-900">
      {/* 顶部栏 */}
      <div className="sticky top-0 z-40 border-b border-slate-100 bg-white/88 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
          <button
            onClick={onBack}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="min-w-0 flex-1 px-3 text-center">
            <div className="truncate text-sm font-black text-slate-800">
              {title}
            </div>
            <div className="truncate text-[10px] text-slate-400">
              {categoryTitle}
            </div>
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
          >
            <Settings2 size={20} />
          </button>
        </div>
      </div>

      {/* 内容 */}
      <div className="mx-auto max-w-md px-4 pb-24 pt-4">
        {/* 顶部信息卡 */}
        <div
          className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.06)]"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(
              accent,
              0.10
            )} 0%, rgba(255,255,255,0.96) 58%)`
          }}
        >
          <div className="mb-4 flex items-start gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-sm"
              style={{ background: hexToRgba(accent, 0.12) }}
            >
              {icon}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Oral Phrases
              </div>
              <h1 className="mt-1 text-2xl font-black leading-tight text-slate-900">
                {title}
              </h1>
              <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
                {subtitle || `共 ${normalized.length} 条短句`}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={playAll}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-sm active:scale-[0.98]"
              style={{ background: accent }}
            >
              {isPlayingAll ? <Square size={16} /> : <Play size={16} />}
              {isPlayingAll ? '停止播放' : '播放全部'}
            </button>

            <button
              onClick={() => setOnlyFav((v) => !v)}
              className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition active:scale-[0.98] ${
                onlyFav
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Heart size={16} fill={onlyFav ? 'currentColor' : 'none'} />
              收藏
            </button>
          </div>
        </div>

        {/* 空状态 */}
        {displayPhrases.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 text-slate-400">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Heart size={30} className="text-slate-300" />
            </div>
            <p className="text-sm font-bold">
              {onlyFav ? '还没有收藏的短句' : '当前模块暂无内容'}
            </p>
            <p className="mt-1 text-xs">
              {onlyFav ? '点击卡片上的心形即可收藏' : '请检查数据文件'}
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {displayPhrases.slice(0, visibleCount).map((item, index) => {
              const active = playingId === item.id;
              const isFav = favorites.includes(item.id);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                >
                  <div
                    className={`overflow-hidden rounded-[26px] border bg-white px-4 pb-4 pt-10 shadow-sm transition ${
                      active
                        ? 'border-blue-200 ring-2 ring-blue-100'
                        : 'border-slate-100'
                    }`}
                  >
                    {/* 顶部小标签 */}
                    <div className="pointer-events-none absolute" />
                    {(item.xieyin || item.note) && (
                      <div className="mb-3 flex justify-center">
                        <div
                          className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-black shadow-sm"
                          style={{
                            background: hexToRgba(accent, 0.08),
                            color: accent,
                            borderColor: hexToRgba(accent, 0.18)
                          }}
                        >
                          <Languages size={10} />
                          {item.xieyin || item.note}
                        </div>
                      </div>
                    )}

                    <div className="text-center">
                      <div className="mb-1 text-[13px] text-slate-400">
                        {item.pinyin}
                      </div>

                      <h3 className="text-[28px] font-black leading-tight text-slate-900">
                        {item.chinese}
                      </h3>

                      {item.translation ? (
                        <p className="mt-2 text-sm font-medium leading-relaxed text-blue-600">
                          {item.translation}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
                      <div
                        className="flex h-8 min-w-[32px] items-center justify-center rounded-full px-2 text-[11px] font-black"
                        style={{
                          background: hexToRgba(accent, 0.10),
                          color: accent
                        }}
                      >
                        {index + 1}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleFav(item.id)}
                          className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                            isFav
                              ? 'bg-rose-50 text-rose-500'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          <Heart size={17} fill={isFav ? 'currentColor' : 'none'} />
                        </button>

                        <button
                          onClick={() => playSingle(item)}
                          className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md transition active:scale-95"
                          style={{ background: accent }}
                        >
                          {active ? <Square size={18} /> : <Volume2 size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <div ref={loaderRef} className="py-8 text-center text-slate-400">
              {visibleCount < displayPhrases.length ? (
                <div className="flex items-center justify-center gap-2 text-xs font-bold">
                  <Loader2 className="animate-spin" size={16} />
                  正在加载更多...
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 opacity-60">
                  <div className="h-1 w-12 rounded-full bg-slate-200" />
                  <span className="text-[10px]">
                    已全部显示（{displayPhrases.length} 条）
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 设置弹层 */}
      <AnimatePresence>
        {showSettings && (
          <>
            <div
              className="fixed inset-0 z-[1999] bg-black/20 backdrop-blur-[2px]"
              onClick={() => setShowSettings(false)}
            />
            <SettingsPanel
              settings={settings}
              setSettings={setSettings}
              onClose={() => setShowSettings(false)}
              secondaryLabel={secondaryLabel}
            />
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .font-pinyin {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Helvetica, Arial, sans-serif;
        }
      `}</style>
    </div>
  );
}
