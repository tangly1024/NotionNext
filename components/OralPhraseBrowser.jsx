'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  Settings2,
  X,
  Loader2,
  Sparkles,
  Volume2,
  Star,
  Mic,
  StopCircle,
  Menu,
  ChevronDown,
  ChevronUp,
  Play,
  Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pinyin } from 'pinyin-pro';

// ============================
// 工具
// ============================
function normalizePhrase(item, index) {
  const chinese = item?.chinese || item?.zh || item?.text || '';
  const burmese = item?.burmese || item?.translation || item?.en || '';
  return {
    id: item?.id || `${index}`,
    chinese,
    burmese,
    xieyin: item?.xieyin || '',
    note: item?.note || '',
    category: item?.category || '当前模块',
    sub: item?.sub || '短句列表',
    pinyin:
      item?.pinyin ||
      pinyin(String(chinese).replace(/[，。！？；：、,.!?;:]/g, ''), {
        toneType: 'symbol'
      }),
    audioZh: item?.audioZh || '',
    audioMy: item?.audioMy || ''
  };
}

function safeParseJSON(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getPinyinComparison(targetText, userText) {
  const cleanTarget = targetText.replace(/[^\u4e00-\u9fa5]/g, '');
  const cleanUser = userText.replace(/[^\u4e00-\u9fa5]/g, '');

  const targetPy = pinyin(cleanTarget, { type: 'array', toneType: 'symbol' });
  const userPy = pinyin(cleanUser, { type: 'array', toneType: 'symbol' });

  const result = [];
  const len = Math.max(targetPy.length, userPy.length);
  let correctCount = 0;

  for (let i = 0; i < len; i++) {
    const t = targetPy[i] || '';
    const u = userPy[i] || '';
    const isMatch = t === u;
    if (isMatch) correctCount++;
    result.push({
      targetChar: cleanTarget[i] || '',
      targetPy: t,
      userPy: u,
      isMatch
    });
  }

  return {
    accuracy: targetPy.length ? correctCount / targetPy.length : 0,
    comparison: result
  };
}

// ============================
// 音频
// ============================
const AudioEngine = {
  current: null,

  stop() {
    if (this.current) {
      this.current.pause();
      this.current.currentTime = 0;
      this.current = null;
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
    const r = parseInt(rate, 10) || 0;
    const url = `/api/tts?t=${encodeURIComponent(text)}&v=${voice}&r=${r}`;
    return this.play(url);
  }
};

// ============================
// 语音识别
// ============================
const SpeechEngine = {
  recognition: null,

  start(onResult, onError) {
    AudioEngine.stop();
    if (typeof window === 'undefined') return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('浏览器不支持语音识别');
      onError?.();
      return;
    }

    this.recognition = new SR();
    this.recognition.lang = 'zh-CN';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onresult = (e) => {
      onResult?.(e.results[0][0].transcript);
    };

    this.recognition.onerror = () => {
      onError?.();
    };

    this.recognition.onend = () => {
      onError?.();
    };

    try {
      this.recognition.start();
    } catch (e) {
      onError?.();
    }
  },

  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
};

// ============================
// 设置面板
// ============================
function SettingsPanel({ settings, setSettings, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed top-16 right-4 z-[2000] w-72 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
        <span className="text-xs font-black uppercase tracking-widest text-slate-500">
          播放设置
        </span>
        <button type="button" onClick={onClose}>
          <X size={16} className="text-slate-400" />
        </button>
      </div>

      <div className="space-y-5 p-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">中文朗读</span>
            <div
              onClick={() => setSettings((s) => ({ ...s, zhEnabled: !s.zhEnabled }))}
              className={`w-8 h-4 rounded-full relative cursor-pointer ${
                settings.zhEnabled ? 'bg-blue-500' : 'bg-slate-200'
              }`}
            >
              <div
                className="absolute top-0.5 w-3 h-3 rounded-full bg-white"
                style={{ left: settings.zhEnabled ? '18px' : '2px' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '小晓', val: 'zh-CN-XiaoxiaoMultilingualNeural' },
              { label: '小辰', val: 'zh-CN-XiaochenMultilingualNeural' },
              { label: '小颜', val: 'zh-CN-XiaoyanNeural' },
              { label: '云夏', val: 'zh-CN-YunxiaNeural' }
            ].map((opt) => (
              <button
                type="button"
                key={opt.val}
                onClick={() => setSettings((s) => ({ ...s, zhVoice: opt.val }))}
                className={`rounded border py-1.5 text-[10px] font-bold ${
                  settings.zhVoice === opt.val
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'border-slate-100 bg-white text-slate-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
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
              className="flex-1 h-1 rounded-lg bg-slate-100 accent-blue-500"
            />
            <span className="w-6 text-right text-[10px] text-slate-400">
              {settings.zhRate}
            </span>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">缅文朗读</span>
            <div
              onClick={() => setSettings((s) => ({ ...s, myEnabled: !s.myEnabled }))}
              className={`w-8 h-4 rounded-full relative cursor-pointer ${
                settings.myEnabled ? 'bg-green-500' : 'bg-slate-200'
              }`}
            >
              <div
                className="absolute top-0.5 w-3 h-3 rounded-full bg-white"
                style={{ left: settings.myEnabled ? '18px' : '2px' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Thiha', val: 'my-MM-ThihaNeural' },
              { label: 'Nilar', val: 'my-MM-NilarNeural' }
            ].map((opt) => (
              <button
                type="button"
                key={opt.val}
                onClick={() => setSettings((s) => ({ ...s, myVoice: opt.val }))}
                className={`rounded border py-1.5 text-[10px] font-bold ${
                  settings.myVoice === opt.val
                    ? 'border-green-200 bg-green-50 text-green-600'
                    : 'border-slate-100 bg-white text-slate-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">语速</span>
            <input
              type="range"
              min="-50"
              max="50"
              step="10"
              value={settings.myRate}
              onChange={(e) =>
                setSettings((s) => ({ ...s, myRate: Number(e.target.value) }))
              }
              className="flex-1 h-1 rounded-lg bg-slate-100 accent-green-500"
            />
            <span className="w-6 text-right text-[10px] text-slate-400">
              {settings.myRate}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================
// 拼读弹窗
// ============================
function SpellingModal({ item, settings, onClose }) {
  const chars = item.chinese.split('');
  const [activeCharIndex, setActiveCharIndex] = useState(-1);

  const playChar = async (char, index) => {
    setActiveCharIndex(index);
    const py = pinyin(char, { toneType: 'symbol' });
    await AudioEngine.playTTS(py, settings.zhVoice, settings.zhRate);
    setActiveCharIndex(-1);
  };

  const playWhole = () => {
    AudioEngine.playTTS(item.chinese, settings.zhVoice, settings.zhRate);
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
            <X size={18} className="text-slate-400" />
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
              <span className="mb-1 text-xs text-slate-400">
                {pinyin(char, { toneType: 'symbol' })}
              </span>
              <span className="text-3xl font-black text-slate-800">{char}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={playWhole}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white"
          >
            <Volume2 size={16} />
            整句朗读
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================
// 主组件
// ============================
export default function SpokenModulePro({
  phrases = [],
  title = '口语短句',
  subtitle = '',
  categoryTitle = '',
  onBack,
  favoriteStorageKey = 'spoken_favs',
  settingsStorageKey = 'spoken_settings'
}) {
  const normalizedPhrases = useMemo(
    () => (phrases || []).map(normalizePhrase).filter((item) => item.chinese),
    [phrases]
  );

  const [view, setView] = useState('home');
  const [favorites, setFavorites] = useState([]);
  const [isFavMode, setIsFavMode] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [showCatalog, setShowCatalog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [expandedCats, setExpandedCats] = useState({});
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const [spellingItem, setSpellingItem] = useState(null);
  const [recordingId, setRecordingId] = useState(null);
  const [speechResult, setSpeechResult] = useState(null);

  const [settings, setSettings] = useState({
    zhVoice: 'zh-CN-XiaoxiaoMultilingualNeural',
    zhRate: -20,
    zhEnabled: true,
    myVoice: 'my-MM-ThihaNeural',
    myRate: 0,
    myEnabled: true
  });

  const loaderRef = useRef(null);
  const itemRefs = useRef({});
  const headerRef = useRef({ lastY: 0 });

  useEffect(() => {
    const savedSet = localStorage.getItem(settingsStorageKey);
    if (savedSet) setSettings(JSON.parse(savedSet));

    const savedFavs = localStorage.getItem(favoriteStorageKey);
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('filter') === 'favorites') {
        setView('list');
        setIsFavMode(true);
      }
    }
  }, [favoriteStorageKey, settingsStorageKey]);

  useEffect(() => {
    localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
  }, [settings, settingsStorageKey]);

  useEffect(() => {
    const onPopState = () => {
      if (view === 'list') {
        AudioEngine.stop();
        setView('home');
        setIsFavMode(false);
      } else if (onBack) {
        onBack();
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [view, onBack]);

  useEffect(() => {
    const onScroll = () => {
      const latest = window.scrollY;
      const previous = headerRef.current.lastY || 0;
      setIsHeaderVisible(!(latest > previous && latest > 50));
      headerRef.current.lastY = latest;
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const displayPhrases = useMemo(() => {
    if (isFavMode) return normalizedPhrases.filter((p) => favorites.includes(p.id));
    return normalizedPhrases;
  }, [normalizedPhrases, favorites, isFavMode]);

  useEffect(() => {
    if (view !== 'list') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 20, displayPhrases.length));
        }
      },
      { rootMargin: '200px' }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [view, displayPhrases.length]);

  const catalogTree = useMemo(() => {
    const map = new Map();
    normalizedPhrases.forEach((p) => {
      if (!map.has(p.category)) map.set(p.category, new Set());
      map.get(p.category).add(p.sub);
    });

    return Array.from(map.entries()).map(([cat, subs]) => ({
      name: cat,
      subs: Array.from(subs)
    }));
  }, [normalizedPhrases]);

  const enterList = (targetSub = null) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({ page: 'list' }, '', window.location.href);
    }

    let targetCount = 20;
    setIsFavMode(false);

    if (targetSub) {
      const idx = normalizedPhrases.findIndex((p) => p.sub === targetSub);
      if (idx !== -1) targetCount = idx + 20;
    }

    setVisibleCount(targetCount);
    setView('list');

    setTimeout(() => {
      if (targetSub) {
        const el = itemRefs.current[targetSub];
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 100);
  };

  const goHome = () => {
    AudioEngine.stop();
    window.history.back();
  };

  const handleCatalogJump = (sub) => {
    setShowCatalog(false);
    const idx = displayPhrases.findIndex((p) => p.sub === sub);
    if (idx !== -1 && idx >= visibleCount) setVisibleCount(idx + 20);

    setTimeout(() => {
      const el = itemRefs.current[sub];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCardPlay = async (item) => {
    if (playingId === item.id) {
      AudioEngine.stop();
      setPlayingId(null);
      return;
    }

    setPlayingId(item.id);

    if (settings.zhEnabled) {
      if (item.audioZh) {
        await AudioEngine.play(item.audioZh);
      } else {
        await AudioEngine.playTTS(item.chinese, settings.zhVoice, settings.zhRate);
      }
    }

    if (AudioEngine.current === null) {
      setPlayingId(null);
      return;
    }

    if (settings.myEnabled && item.burmese) {
      if (settings.zhEnabled) await new Promise((r) => setTimeout(r, 400));
      if (AudioEngine.current === null && settings.zhEnabled) {
        setPlayingId(null);
        return;
      }

      if (item.audioMy) {
        await AudioEngine.play(item.audioMy);
      } else {
        await AudioEngine.playTTS(item.burmese, settings.myVoice, settings.myRate);
      }
    }

    setPlayingId(null);
  };

  const handleSpeech = (item) => {
    if (recordingId === item.id) {
      SpeechEngine.stop();
      setRecordingId(null);
      return;
    }

    AudioEngine.stop();
    setRecordingId(item.id);
    setSpeechResult(null);

    SpeechEngine.start(
      (transcript) => {
        const scoreData = getPinyinComparison(item.chinese, transcript);
        setSpeechResult({ id: item.id, data: scoreData });
        setRecordingId(null);
      },
      () => setRecordingId(null)
    );
  };

  const toggleFav = (id) => {
    const newFavs = favorites.includes(id)
      ? favorites.filter((i) => i !== id)
      : [...favorites, id];

    setFavorites(newFavs);
    localStorage.setItem(favoriteStorageKey, JSON.stringify(newFavs));
  };

  const toggleCat = (catName) => {
    setExpandedCats((prev) => ({ ...prev, [catName]: !prev[catName] }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-slate-900 max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {view === 'home' && (
        <div className="min-h-screen bg-white">
          <div className="relative h-64 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1000&q=80"
              alt={title}
              className="w-full h-full object-cover brightness-[0.78]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-block px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded mb-2 shadow-sm">
                口语特训
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-1 leading-tight">
                {title}
              </h1>
              <p className="text-slate-600 text-xs font-medium leading-relaxed">
                {subtitle || `${categoryTitle} · 共 ${normalizedPhrases.length} 条`}
              </p>
            </div>
          </div>

          <div className="px-6 mb-8">
            <button
              type="button"
              onClick={() => enterList(null)}
              className="w-full py-4 bg-gradient-to-r from-sky-50 to-indigo-50 border border-blue-100 text-slate-800 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform flex flex-col items-center justify-center gap-1"
            >
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-blue-600" />
                <span>开始短句训练</span>
              </div>
              <span className="text-[10px] text-slate-500 font-normal">
                浏览 / 朗读 / 收藏 / 跟读评分
              </span>
            </button>
          </div>

          <div className="px-4 pb-20 space-y-4">
            <h2 className="px-2 text-sm font-black text-slate-400 uppercase tracking-widest">
              Directory
            </h2>

            {catalogTree.map((cat, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm"
              >
                <div
                  onClick={() => toggleCat(cat.name)}
                  className="flex items-center justify-between p-4 cursor-pointer active:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </div>
                    <span className="font-bold text-slate-800 text-sm">{cat.name}</span>
                  </div>

                  {expandedCats[cat.name] ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </div>

                <AnimatePresence>
                  {expandedCats[cat.name] && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden bg-slate-50/50"
                    >
                      <div className="px-4 pb-4 pt-1 grid grid-cols-2 gap-2">
                        {cat.subs.map((sub, j) => (
                          <button
                            type="button"
                            key={j}
                            onClick={() => enterList(sub)}
                            className="text-left px-3 py-2 bg-white border border-slate-100 rounded-lg text-xs font-medium text-slate-600 active:scale-95 transition-transform h-auto break-words leading-tight"
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="min-h-screen pb-32 bg-[#F5F7FA]">
          <motion.div
            animate={{ y: isHeaderVisible ? 0 : -80 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100 h-14 max-w-md mx-auto px-4 flex justify-between items-center"
          >
            <button
              type="button"
              onClick={goHome}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="text-sm font-black text-slate-800">
                {isFavMode ? '我的收藏' : title}
              </span>
              <span className="text-[10px] text-slate-400">
                {isFavMode ? '收藏短句' : categoryTitle}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-slate-400 hover:text-blue-600"
              >
                <Settings2 size={20} />
              </button>

              {!isFavMode && (
                <button
                  type="button"
                  onClick={() => setShowCatalog(true)}
                  className="p-2 text-slate-600 hover:text-blue-600"
                >
                  <Menu size={20} />
                </button>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {showSettings && (
              <>
                <div className="fixed inset-0 z-[1999]" onClick={() => setShowSettings(false)} />
                <SettingsPanel
                  settings={settings}
                  setSettings={setSettings}
                  onClose={() => setShowSettings(false)}
                />
              </>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showCatalog && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-sm"
                  onClick={() => setShowCatalog(false)}
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  className="fixed inset-y-0 right-0 z-[160] w-[80%] max-w-[280px] bg-white shadow-2xl overflow-y-auto"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex flex-col">
                        <h2 className="text-lg font-black text-slate-800">快速跳转</h2>
                        <span className="text-xs text-slate-400">Quick Jump</span>
                      </div>
                      <button type="button" onClick={() => setShowCatalog(false)}>
                        <X size={20} className="text-slate-400" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {catalogTree.map((cat, i) => (
                        <div key={i} className="border-b border-slate-50 pb-2">
                          <div
                            onClick={() => toggleCat(cat.name)}
                            className="flex items-center justify-between py-2 cursor-pointer"
                          >
                            <h3 className="text-sm font-bold text-slate-700">{cat.name}</h3>
                            {expandedCats[cat.name] ? (
                              <ChevronUp size={14} className="text-slate-400" />
                            ) : (
                              <ChevronDown size={14} className="text-slate-400" />
                            )}
                          </div>

                          <AnimatePresence>
                            {expandedCats[cat.name] && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-3 flex flex-col gap-1 pb-2">
                                  {cat.subs.map((sub, j) => (
                                    <button
                                      type="button"
                                      key={j}
                                      onClick={() => handleCatalogJump(sub)}
                                      className="text-left py-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 truncate"
                                    >
                                      {sub}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="pt-20 px-3 space-y-4">
            {isFavMode && displayPhrases.length === 0 && (
              <div className="flex flex-col items-center justify-center pt-32 text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Heart size={32} className="text-slate-300" />
                </div>
                <p className="text-sm font-bold">还没有收藏的句子</p>
                <p className="text-xs mt-1">点击右下角星标收藏短句</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsFavMode(false);
                    setView('home');
                  }}
                  className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold active:scale-95 transition-transform"
                >
                  去浏览课程
                </button>
              </div>
            )}

            {displayPhrases.slice(0, visibleCount).map((item, index) => {
              const isNewSub =
                !isFavMode &&
                (index === 0 || displayPhrases[index - 1].sub !== item.sub);

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    if (isNewSub && !isFavMode) itemRefs.current[item.sub] = el;
                  }}
                >
                  {isNewSub && (
                    <div className="mt-8 mb-3 pl-2 border-l-4 border-blue-500 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800">{item.sub}</h3>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div
                      className={`relative bg-white pt-10 pb-4 px-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all max-w-[360px] mx-auto overflow-visible mt-6 ${
                        playingId === item.id ? 'ring-2 ring-blue-500 bg-blue-50/10' : ''
                      } active:scale-[0.98] cursor-pointer`}
                      onClick={() => handleCardPlay(item)}
                    >
                      {(item.xieyin || item.note) && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center pointer-events-none">
                          <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black border border-amber-100 shadow-sm flex items-center gap-1 whitespace-nowrap">
                            <Sparkles size={10} className="fill-amber-500 text-amber-500" />
                            {item.xieyin || item.note}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="text-[13px] text-slate-400 font-pinyin mb-1.5">
                          {item.pinyin}
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">
                          {item.chinese}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium mb-4">
                          {item.burmese}
                        </p>

                        <div className="w-full flex justify-center items-center gap-5 pt-3 border-t border-slate-50">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSpellingItem(item);
                            }}
                            className="w-9 h-9 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-500"
                          >
                            <Sparkles size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeech(item);
                            }}
                            className={`w-12 h-12 -mt-4 rounded-full flex items-center justify-center shadow-md border-4 border-white ${
                              recordingId === item.id
                                ? 'bg-slate-100 text-slate-500 animate-pulse'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {recordingId === item.id ? (
                              <StopCircle size={20} />
                            ) : (
                              <Mic size={20} />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFav(item.id);
                            }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center ${
                              favorites.includes(item.id)
                                ? 'bg-yellow-50 text-yellow-500'
                                : 'bg-slate-50 text-slate-300'
                            }`}
                          >
                            <Star
                              size={16}
                              fill={favorites.includes(item.id) ? 'currentColor' : 'none'}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {speechResult?.id === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-white mx-auto max-w-[360px] rounded-xl mt-2 p-3 shadow-sm border border-slate-100"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-slate-400">评分</span>
                            <span
                              className={`text-xs font-black ${
                                speechResult.data.accuracy > 0.8
                                  ? 'text-green-500'
                                  : 'text-red-500'
                              }`}
                            >
                              {Math.round(speechResult.data.accuracy * 100)}%
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 justify-center">
                            {speechResult.data.comparison.map((r, idx) => (
                              <div key={idx} className="flex flex-col items-center">
                                <span
                                  className={`text-xs font-pinyin font-bold ${
                                    r.isMatch ? 'text-slate-800' : 'text-red-500'
                                  }`}
                                >
                                  {r.userPy || '?'}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {r.targetChar}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              );
            })}

            {displayPhrases.length > 0 && (
              <div ref={loaderRef} className="py-10 text-center text-slate-400">
                {visibleCount < displayPhrases.length ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold animate-pulse">
                    <Loader2 className="animate-spin" size={16} />
                    正在加载更多...
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <div className="w-12 h-1 bg-slate-200 rounded-full" />
                    <span className="text-[10px]">到底了 (Total: {displayPhrases.length})</span>
                  </div>
                )}
              </div>
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
