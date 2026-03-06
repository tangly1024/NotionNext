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
  Sparkles
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { pinyin } from 'pinyin-pro';

// ===============================
// 工具
// ===============================
function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(37,99,235,${alpha})`;

  const c = String(hex).replace('#', '');
  const full = c.length === 3 ? c.split('').map((s) => s + s).join('') : c;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return `rgba(37,99,235,${alpha})`;
  }

  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function safeParseJSON(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizePhrase(item, index) {
  const chinese = item?.chinese || item?.zh || item?.text || '';
  const cleanChinese = String(chinese).replace(/[，。！？；：、,.!?;:]/g, '');

  return {
    id: item?.id || `${index}`,
    chinese,
    pinyin: item?.pinyin || (cleanChinese ? pinyin(cleanChinese, { toneType: 'symbol' }) : ''),
    burmese: item?.burmese || item?.translation || item?.en || item?.meaning || '',
    xieyin: item?.xieyin || '',
    note: item?.note || '',
    audioZh: item?.audioZh || item?.zhAudio || '',
    audioSecondary: item?.audioSecondary || item?.myAudio || item?.translationAudio || ''
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
    { label: '小颜', value: 'zh-CN-XiaoyanNeural' },
    { label: '云夏', value: 'zh-CN-YunxiaNeural' }
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
      className="fixed right-4 top-16 z-[2000] w-72 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
          播放设置
        </span>
        <button type="button" onClick={onClose}>
          <X size={16} className="text-slate-400 hover:text-red-500" />
        </button>
      </div>

      <div className="space-y-5 p-5">
        {/* 中文 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">中文朗读</span>
            <button
              type="button"
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
                type="button"
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
              type="button"
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
                type="button"
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
// 拼读弹窗（精简版）
// ===============================
function SpellingModal({ item, onClose, settings }) {
  const chars = (item?.chinese || '').split('');
  const [activeCharIndex, setActiveCharIndex] = useState(-1);

  const playChar = async (char, index) => {
    setActiveCharIndex(index);
    const py = pinyin(char, { toneType: 'symbol' });
    await AudioEngine.playTTS(py, settings.zhVoice, settings.zhRate);
    setActiveCharIndex(-1);
  };

  const playWhole = async () => {
    setActiveCharIndex(-1);
    await AudioEngine.playTTS(item.chinese, settings.zhVoice, settings.zhRate);
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="relative w-full max-w-md rounded-t-[2rem] bg-white p-6 shadow-2xl sm:rounded-[2rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />

        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900">拼读练习</h3>
          <button type="button" onClick={onClose}>
            <X size={18} className="text-slate-400 hover:text-red-500" />
          </button>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {chars.map((char, i) => (
            <button
              type="button"
              key={`${char}-${i}`}
              onClick={() => playChar(char, i)}
              className={`flex flex-col items-center rounded-xl p-3 transition ${
                activeCharIndex === i
                  ? 'scale-105 bg-blue-50 ring-2 ring-blue-500'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <span className={`mb-1 text-xs ${activeCharIndex === i ? 'font-bold text-blue-600' : 'text-slate-400'}`}>
                {pinyin(char, { toneType: 'symbol' })}
              </span>
              <span className={`text-3xl font-black ${activeCharIndex === i ? 'text-blue-800' : 'text-slate-800'}`}>
                {char}
              </span>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={playWhole}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white active:scale-95"
          >
            <Volume2 size={16} />
            整句朗读
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ===============================
// 主组件：B版重写
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
  const [view, setView] = useState('list');
  const [showSettings, setShowSettings] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [favorites, setFavorites] = useState([]);
  const [onlyFav, setOnlyFav] = useState(false);
  const [spellingItem, setSpellingItem] = useState(null);

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
    if (typeof window === 'undefined') return;

    const savedSettings = localStorage.getItem(settingsStorageKey);
    if (savedSettings) {
      const parsed = safeParseJSON(savedSettings, null);
      if (parsed) setSettings(parsed);
    }

    const savedFav = localStorage.getItem(favoriteStorageKey);
    if (savedFav) {
      const parsed = safeParseJSON(savedFav, []);
      if (Array.isArray(parsed)) setFavorites(parsed);
    }
  }, [favoriteStorageKey, settingsStorageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
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
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    AudioEngine.stop();
    setPlayingId(null);
    setIsPlayingAll(false);
  }, [title, onlyFav]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) {
      setVisibleCount(displayPhrases.length);
      return;
    }

    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 20, displayPhrases.length));
        }
      },
      { rootMargin: '180px' }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
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

    if (settings.secondaryEnabled && item.burmese) {
      await new Promise((r) => setTimeout(r, 260));
      if (playTokenRef.current !== token) return;

      if (item.audioSecondary) {
        await AudioEngine.play(item.audioSecondary);
      } else {
        await AudioEngine.playTTS(
          item.burmese,
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

      if (settings.secondaryEnabled && item.burmese) {
        await new Promise((r) => setTimeout(r, 260));
        if (playTokenRef.current !== token) break;

        if (item.audioSecondary) {
          await AudioEngine.play(item.audioSecondary);
        } else {
          await AudioEngine.playTTS(
            item.burmese,
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

    if (typeof window !== 'undefined') {
      localStorage.setItem(favoriteStorageKey, JSON.stringify(next));
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#F8F9FB] font-sans text-slate-900 relative shadow-2xl overflow-hidden">
      {/* ================= HOME HERO ================= */}
      {view === 'home' && (
        <div className="min-h-screen bg-white">
          <div className="relative h-64 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${hexToRgba(accent, 0.95)} 0%, ${hexToRgba(accent, 0.55)} 65%, ${hexToRgba(accent, 0.25)} 100%)`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-block rounded bg-white/18 px-2 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm mb-2">
                口语训练
              </div>
              <h1 className="mb-1 text-3xl font-black leading-tight text-slate-900">
                {title}
              </h1>
              <p className="text-xs font-medium leading-relaxed text-slate-600">
                {subtitle || `${categoryTitle} · 共 ${normalized.length} 条短句`}
              </p>
            </div>

            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-1.5 backdrop-blur-md">
              <span className="text-lg">{icon}</span>
              <span className="text-[10px] font-bold tracking-widest text-white uppercase">
                Oral Module
              </span>
            </div>
          </div>

          <div className="mb-8 px-6">
            <button
              type="button"
              onClick={() => setView('list')}
              className="w-full rounded-xl border border-blue-100 bg-gradient-to-r from-sky-50 to-indigo-50 py-4 text-sm font-bold text-slate-800 shadow-sm transition-transform active:scale-95"
            >
              <div className="flex items-center justify-center gap-2">
                <BookOpenCheck size={18} className="text-blue-600" />
                <span>开始短句训练</span>
              </div>
              <div className="mt-1 text-[10px] font-normal text-slate-500">
                进入模块浏览与朗读练习
              </div>
            </button>
          </div>

          <div className="px-4 pb-20">
            <div className="mb-3 px-2 text-sm font-black uppercase tracking-widest text-slate-400">
              Module Info
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="text-xs font-bold text-slate-400">所属分类</div>
                <div className="mt-1 text-sm font-black text-slate-800">{categoryTitle}</div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="text-xs font-bold text-slate-400">短句数量</div>
                <div className="mt-1 text-sm font-black text-slate-800">
                  共 {normalized.length} 条
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="text-xs font-bold text-slate-400">学习方式</div>
                <div className="mt-1 text-sm font-black text-slate-800">
                  朗读 / 收藏 / 拼读练习
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= LIST VIEW ================= */}
      {view === 'list' && (
        <div className="min-h-screen bg-[#F5F7FA] pb-32">
          <motion.div
            className="fixed left-0 right-0 top-0 z-[100] mx-auto flex h-14 max-w-md items-center justify-between border-b border-slate-100 bg-white/90 px-4 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => {
                AudioEngine.stop();
                setView('home');
              }}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="text-sm font-black text-slate-800">
                {onlyFav ? '我的收藏' : title}
              </span>
              <span className="text-[10px] text-slate-400">
                {onlyFav ? '收藏短句' : categoryTitle}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="p-2 text-slate-400 hover:text-blue-600"
              >
                <Settings2 size={20} />
              </button>
              <button
                type="button"
                onClick={() => setOnlyFav((v) => !v)}
                className={`p-2 ${onlyFav ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
              >
                <Heart size={18} fill={onlyFav ? 'currentColor' : 'none'} />
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {showSettings && (
              <>
                <div
                  className="fixed inset-0 z-[1999]"
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

          <div className="px-3 pt-20 space-y-4">
            {/* 顶部控制卡 */}
            <div className="mx-auto max-w-[360px] rounded-[1.6rem] border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Oral Phrases
                  </div>
                  <div className="mt-1 text-lg font-black text-slate-900">{title}</div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {subtitle || `共 ${displayPhrases.length} 条`}
                  </div>
                </div>

                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                  style={{ background: hexToRgba(accent, 0.12) }}
                >
                  {icon}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={playAll}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white active:scale-95"
                  style={{ background: accent }}
                >
                  {isPlayingAll ? <Square size={16} /> : <Play size={16} />}
                  {isPlayingAll ? '停止播放' : '播放全部'}
                </button>

                <button
                  type="button"
                  onClick={() => setOnlyFav((v) => !v)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition active:scale-95 ${
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
                  <Heart size={32} className="text-slate-300" />
                </div>
                <p className="text-sm font-bold">
                  {onlyFav ? '还没有收藏的短句' : '当前模块暂无内容'}
                </p>
                <p className="mt-1 text-xs">
                  {onlyFav ? '点击卡片上的星形即可收藏' : '请检查数据文件'}
                </p>
              </div>
            ) : (
              <>
                {displayPhrases.slice(0, visibleCount).map((item, index) => {
                  const active = playingId === item.id;
                  const isFav = favorites.includes(item.id);

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <div
                        className={`relative mx-auto mt-6 max-w-[360px] overflow-visible rounded-[1.5rem] border border-slate-100 bg-white px-4 pb-4 pt-10 text-center shadow-sm transition-all ${
                          active ? 'ring-2 ring-blue-500 bg-blue-50/10' : ''
                        }`}
                        onClick={() => playSingle(item)}
                      >
                        {/* 谐音顶部 badge */}
                        {(item.xieyin || item.note) && (
                          <div className="pointer-events-none absolute -top-3 left-1/2 z-10 flex w-full -translate-x-1/2 justify-center">
                            <div
                              className="flex items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-black shadow-sm"
                              style={{
                                background: hexToRgba(accent, 0.08),
                                color: accent,
                                borderColor: hexToRgba(accent, 0.18)
                              }}
                            >
                              <ZapIcon />
                              {item.xieyin || item.note}
                            </div>
                          </div>
                        )}

                        <div>
                          <div className="mb-1.5 text-[13px] text-slate-400 font-pinyin">
                            {item.pinyin}
                          </div>

                          <h3 className="mb-2 text-xl font-black leading-tight text-slate-800">
                            {item.chinese}
                          </h3>

                          {item.burmese ? (
                            <p className="mb-4 text-sm font-medium text-blue-600">
                              {item.burmese}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex w-full items-center justify-center gap-5 border-t border-slate-50 pt-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSpellingItem(item);
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500"
                          >
                            <Sparkles size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playSingle(item);
                            }}
                            className="flex h-12 w-12 -mt-4 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow-md"
                          >
                            {active ? <Square size={20} /> : <Volume2 size={20} />}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFav(item.id);
                            }}
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${
                              isFav
                                ? 'bg-yellow-50 text-yellow-500'
                                : 'bg-slate-50 text-slate-300'
                            }`}
                          >
                            <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                <div ref={loaderRef} className="py-10 text-center text-slate-400">
                  {visibleCount < displayPhrases.length ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold animate-pulse">
                      <Loader2 className="animate-spin" size={16} />
                      正在加载更多...
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <div className="h-1 w-12 rounded-full bg-slate-200" />
                      <span className="text-[10px]">
                        到底了 (Total: {displayPhrases.length})
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {spellingItem && (
          <SpellingModal
            item={spellingItem}
            settings={settings}
            onClose={() => setSpellingItem(null)}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .font-pinyin {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
        }
      `}</style>
    </div>
  );
}

// 顶部小 badge 图标
function ZapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
    </svg>
  );
}
