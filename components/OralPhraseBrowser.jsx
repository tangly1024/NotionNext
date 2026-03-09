'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mic, StopCircle, Sparkles, X, Volume2, Star, Play,
  Square, Settings2, ChevronLeft, Loader2, Heart, Zap
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { pinyin } from 'pinyin-pro';

// ============================================================================
// 1. 工具函数
// ============================================================================
function normalizePhrase(item, index) {
  const chinese = item?.chinese || item?.zh || item?.text || '';
  const burmese = item?.burmese || item?.translation || item?.en || item?.meaning || '';
  const xieyin = item?.xieyin || item?.note || '';

  return {
    id: item?.id || `${index}`,
    chinese,
    burmese,
    xieyin,
    pinyin:
      item?.pinyin ||
      pinyin(String(chinese).replace(/[，。！？；：、,.!?;:]/g, ''), {
        toneType: 'symbol'
      }),
    audioZh: item?.audioZh || item?.zhAudio || '',
    audioMy: item?.audioMy || item?.myAudio || ''
  };
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
      isMatch,
      isMissing: !u
    });
  }

  const accuracy = targetPy.length > 0 ? correctCount / targetPy.length : 0;
  return { accuracy, comparison: result, userText };
}

// ============================================================================
// 2. 音频与语音引擎
// ============================================================================
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
    const safeRate = parseInt(rate, 10) || 0;
    const url = `https://t.leftsite.cn/tts?t=${encodeURIComponent(text)}&v=${voice}&r=${safeRate}`;
    return this.play(url);
  }
};

const RecorderEngine = {
  mediaRecorder: null,
  chunks: [],
  stream: null,

  async start() {
    AudioEngine.stop();
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) return false;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.chunks = [];
      this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);
      this.mediaRecorder.start();
      return true;
    } catch (_) {
      alert('请开启麦克风权限');
      return false;
    }
  },

  stop() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const url = URL.createObjectURL(new Blob(this.chunks, { type: 'audio/webm' }));
        if (this.stream) {
          this.stream.getTracks().forEach((t) => t.stop());
        }
        this.mediaRecorder = null;
        resolve(url);
      };

      this.mediaRecorder.stop();
    });
  }
};

const SpeechEngine = {
  recognition: null,

  start(onResult, onError) {
    AudioEngine.stop();

    if (typeof window === 'undefined') return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('您的浏览器不支持语音识别，请使用 Chrome、Edge 或 Safari (需开启设置)。');
      if (onError) onError();
      return;
    }

    this.recognition = new SR();
    this.recognition.lang = 'zh-CN';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    this.recognition.onerror = () => {
      if (onError) onError();
    };

    this.recognition.onend = () => {
      if (onError) onError();
    };

    try {
      this.recognition.start();
    } catch (_) {
      if (onError) onError();
    }
  },

  stop() {
    if (this.recognition) this.recognition.stop();
  }
};

// ============================================================================
// 3. 子组件
// ============================================================================
const SettingsPanel = ({ settings, setSettings, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    className="fixed top-16 right-4 z-[2000] bg-white rounded-2xl shadow-2xl border border-slate-100 w-72 overflow-hidden"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="bg-slate-50 px-4 py-3 flex justify-between items-center border-b border-slate-100">
      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">播放设置 | Play Settings</span>
      <button onClick={onClose}>
        <X size={16} className="text-slate-400 hover:text-red-500" />
      </button>
    </div>

    <div className="p-5 space-y-5">
      {/* 中文设置 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700">中文朗读 | တရုတ်အသံ</span>
          <div
            onClick={() => setSettings((s) => ({ ...s, zhEnabled: !s.zhEnabled }))}
            className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
              settings.zhEnabled ? 'bg-pink-500' : 'bg-slate-200'
            }`}
          >
            <div
              className="absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform"
              style={{ left: settings.zhEnabled ? '18px' : '2px' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: '小晓 (女)', val: 'zh-CN-XiaoxiaoMultilingualNeural' },
            { label: '小辰 (男)', val: 'zh-CN-XiaochenMultilingualNeural' },
            { label: '云夏 (男童)', val: 'zh-CN-YunxiaNeural' },
            { label: '小颜 (通用)', val: 'zh-CN-XiaoyanNeural' }
          ].map((opt) => (
            <button
              key={opt.val}
              onClick={() => setSettings((s) => ({ ...s, zhVoice: opt.val }))}
              className={`py-1.5 text-[10px] font-bold rounded border transition-all truncate ${
                settings.zhVoice === opt.val
                  ? 'bg-pink-50 border-pink-200 text-pink-600'
                  : 'bg-white border-slate-100 text-slate-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] text-slate-400">语速 | Speed</span>
          <input
            type="range"
            min="-50"
            max="50"
            step="10"
            value={settings.zhRate}
            onChange={(e) => setSettings((s) => ({ ...s, zhRate: Number(e.target.value) }))}
            className="flex-1 h-1 bg-slate-100 rounded-lg appearance-none accent-pink-500"
          />
          <span className="text-[10px] w-6 text-right font-mono text-slate-400">{settings.zhRate}</span>
        </div>
      </div>

      <div className="h-[1px] bg-slate-50"/>

      {/* 缅文设置 */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700">缅文朗读 | မြန်မာအသံ</span>
          <div
            onClick={() => setSettings((s) => ({ ...s, myEnabled: !s.myEnabled }))}
            className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
              settings.myEnabled ? 'bg-rose-500' : 'bg-slate-200'
            }`}
          >
            <div
              className="absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform"
              style={{ left: settings.myEnabled ? '18px' : '2px' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Thiha (男)', val: 'my-MM-ThihaNeural' },
            { label: 'Nilar (女)', val: 'my-MM-NilarNeural' }
          ].map((opt) => (
            <button
              key={opt.val}
              onClick={() => setSettings((s) => ({ ...s, myVoice: opt.val }))}
              className={`py-1.5 text-[10px] font-bold rounded border transition-all truncate ${
                settings.myVoice === opt.val
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-100 text-slate-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] text-slate-400">语速 | Speed</span>
          <input
            type="range"
            min="-50"
            max="50"
            step="10"
            value={settings.myRate}
            onChange={(e) => setSettings((s) => ({ ...s, myRate: Number(e.target.value) }))}
            className="flex-1 h-1 bg-slate-100 rounded-lg appearance-none accent-rose-500"
          />
          <span className="text-[10px] w-6 text-right font-mono text-slate-400">{settings.myRate}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const SpellingModal = ({ item, settings, onClose }) => {
  const [activeCharIndex, setActiveCharIndex] = useState(-1);
  const [recordState, setRecordState] = useState('idle');
  const [userAudio, setUserAudio] = useState(null);
  const chars = item.chinese.split('');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    AudioEngine.stop();

    const autoSpell = async () => {
      await new Promise((r) => setTimeout(r, 200));
      if (!isMounted.current) return;

      for (let i = 0; i < chars.length; i++) {
        if (!isMounted.current) break;
        setActiveCharIndex(i);
        const py = pinyin(chars[i], { toneType: 'symbol' });
        const r2Url = `https://audio.886.best/chinese-vocab-audio/%E6%8B%BC%E8%AF%BB%E9%9F%B3%E9%A2%91/${encodeURIComponent(py)}.mp3`;
        await AudioEngine.play(r2Url);
        await new Promise((r) => setTimeout(r, 50));
      }

      if (isMounted.current) setActiveCharIndex(-1);
    };

    autoSpell();

    return () => {
      isMounted.current = false;
      AudioEngine.stop();
    };
  }, [item.chinese, chars]);

  const handleCharClick = (index) => {
    setActiveCharIndex(index);
    const char = chars[index];
    const py = pinyin(char, { toneType: 'symbol' });
    const r2Url = `https://audio.886.best/chinese-vocab-audio/%E6%8B%BC%E8%AF%BB%E9%9F%B3%E9%A2%91/${encodeURIComponent(py)}.mp3`;
    AudioEngine.play(r2Url);
  };

  const playWhole = () => {
    setActiveCharIndex('all');
    AudioEngine.playTTS(item.chinese, settings.zhVoice, settings.zhRate).then(() => setActiveCharIndex(-1));
  };

  const toggleRecord = async () => {
    if (recordState === 'recording') {
      const url = await RecorderEngine.stop();
      setUserAudio(url);
      setRecordState('review');
    } else {
      AudioEngine.stop();
      const success = await RecorderEngine.start();
      if (success) setRecordState('recording');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-pink-200 rounded-full mx-auto mb-6 sm:hidden" />

        <div className="flex items-center justify-between mb-8">
          <h3 className="text-slate-900 font-black text-lg">拼读练习 | စာလုံးပေါင်း</h3>
          <span className="text-[10px] bg-pink-50 text-pink-500 px-2 py-1 rounded font-bold animate-pulse">
            ✨ 自动演示中...
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10 px-2">
          {chars.map((char, i) => (
            <div
              key={i}
              onClick={() => handleCharClick(i)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all cursor-pointer select-none ${
                activeCharIndex === i
                  ? 'bg-pink-50 ring-2 ring-pink-500 scale-110 shadow-lg'
                  : 'hover:bg-pink-50/50'
              }`}
            >
              <span
                className={`text-xs font-pinyin mb-1 ${
                  activeCharIndex === i ? 'text-pink-600 font-bold' : 'text-slate-400'
                }`}
              >
                {pinyin(char, { toneType: 'symbol' })}
              </span>
              <span
                className={`text-3xl font-black ${
                  activeCharIndex === i ? 'text-pink-800' : 'text-slate-800'
                }`}
              >
                {char}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-around items-center px-4 pb-4">
          <div
            onClick={playWhole}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-400 flex items-center justify-center group-hover:bg-pink-100 group-hover:scale-110 transition-all">
              <Volume2 size={20} />
            </div>
            <span className="text-[10px] text-slate-500">整句</span>
          </div>

          <div
            onClick={toggleRecord}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white ${
              recordState === 'recording' 
                ? 'bg-rose-500 shadow-rose-500/30 animate-pulse' 
                : 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-pink-500/30'
            }`}
          >
            {recordState === 'recording' ? (
              <Square size={24} className="text-white" />
            ) : (
              <Mic size={28} />
            )}
          </div>

          <div
            onClick={() => userAudio && AudioEngine.play(userAudio)}
            className={`flex flex-col items-center gap-2 group ${
              userAudio ? 'cursor-pointer' : 'opacity-30'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-400 flex items-center justify-center group-hover:bg-pink-100 group-hover:scale-110 transition-all">
              <Play size={20} />
            </div>
            <span className="text-[10px] text-slate-500">回放</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// 4. 主组件 - 小红书风格
// ============================================================================
export default function OralPhraseBrowser({
  phrases = [],
  title = '模块学习',
  categoryTitle = '口语分类',
  onBack,
  favoriteStorageKey = 'spoken_favs_default',
  settingsStorageKey = 'spoken_settings_default'
}) {
  const normalizedPhrases = useMemo(
    () => (phrases || []).map(normalizePhrase).filter((item) => item.chinese),
    [phrases]
  );

  const [favorites, setFavorites] = useState([]);
  const [isFavMode, setIsFavMode] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const loaderRef = useRef(null);

  const [showSettings, setShowSettings] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const [settings, setSettings] = useState({
    zhVoice: 'zh-CN-XiaoxiaoMultilingualNeural',
    zhRate: -20,
    zhEnabled: true,
    myVoice: 'my-MM-ThihaNeural',
    myRate: 0,
    myEnabled: true
  });

  const [playingId, setPlayingId] = useState(null);
  const [spellingItem, setSpellingItem] = useState(null);
  const [recordingId, setRecordingId] = useState(null);
  const [speechResult, setSpeechResult] = useState(null);

  const { scrollY } = useScroll();

  useEffect(() => {
    const savedSet = localStorage.getItem(settingsStorageKey);
    if (savedSet) setSettings(JSON.parse(savedSet));

    const savedFavs = localStorage.getItem(favoriteStorageKey);
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, [favoriteStorageKey, settingsStorageKey]);

  useEffect(() => {
    localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
  }, [settings, settingsStorageKey]);

  useEffect(() => {
    localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites));
  }, [favorites, favoriteStorageKey]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() || 0;
    setIsHeaderVisible(!(latest > previous && latest > 50));
  });

  const displayPhrases = useMemo(() => {
    if (isFavMode) return normalizedPhrases.filter((p) => favorites.includes(p.id));
    return normalizedPhrases;
  }, [normalizedPhrases, favorites, isFavMode]);

  useEffect(() => {
    setVisibleCount(20);
  }, [isFavMode, phrases]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 20, displayPhrases.length));
        }
      },
      { root: null, rootMargin: '200px', threshold: 0.1 }
    );

    const el = loaderRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [displayPhrases.length]);

  const handleBack = () => {
    AudioEngine.stop();

    if (isFavMode) {
      setIsFavMode(false);
    } else if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
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

    if (settings.myEnabled && item.burmese) {
      if (settings.zhEnabled) {
        await new Promise((r) => setTimeout(r, 400));
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
      () => {
        setRecordingId(null);
      }
    );
  };

  const toggleFav = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen pb-32 bg-gradient-to-b from-pink-50/30 to-white font-sans text-slate-900 max-w-md mx-auto relative shadow-2xl overflow-x-hidden">
      
      {/* 头部 - 小红书风格 */}
      <motion.div
        animate={{ y: isHeaderVisible ? 0 : -80 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-pink-100 h-14 max-w-md mx-auto px-4 flex justify-between items-center"
      >
        <button onClick={handleBack} className="p-2 -ml-2 text-pink-400 hover:text-pink-600">
          <ChevronLeft size={24} />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-sm font-black text-pink-600">{isFavMode ? '我的收藏' : title}</span>
          <span className="text-[10px] text-pink-400 font-burmese">{isFavMode ? 'မှတ်ထားသော စကားပြော' : categoryTitle}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFavMode(!isFavMode)}
            className={`p-2 transition-colors ${
              isFavMode ? 'text-rose-500' : 'text-pink-300 hover:text-rose-500'
            }`}
          >
            <Heart size={20} fill={isFavMode ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-pink-300 hover:text-pink-600"
          >
            <Settings2 size={20} />
          </button>
        </div>
      </motion.div>

      {/* 设置面板 */}
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

      {/* 卡片列表 */}
      <div className="pt-20 px-3 space-y-6">
        {displayPhrases.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-32 text-pink-300">
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
              <Heart size={32} className="text-pink-300" />
            </div>
            <p className="text-sm font-bold text-pink-400">{isFavMode ? '还没有收藏的句子' : '暂无数据'}</p>
            {isFavMode && <p className="text-xs text-pink-300 font-burmese mt-1">မှတ်ထားသော စာကြောင်း မရှိသေးပါ</p>}
          </div>
        )}

        {displayPhrases.slice(0, visibleCount).map((item) => {
          return (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              {/* ========== 小红书风格卡片 ========== */}
              <div 
                className={`relative pt-12 pb-5 px-5 
                            bg-gradient-to-br from-white to-pink-50/30
                            rounded-[2.5rem]
                            border border-pink-100
                            shadow-[0_10px_25px_-5px_rgba(236,72,153,0.1)]
                            flex flex-col items-center text-center 
                            transition-all duration-300 ease-out
                            max-w-[360px] mx-auto overflow-visible
                            group
                            ${playingId === item.id 
                              ? 'ring-2 ring-pink-400/50 bg-pink-50/40 shadow-pink-200' 
                              : 'hover:shadow-[0_20px_35px_-8px_rgba(236,72,153,0.2)] hover:-translate-y-0.5'
                            }`}
                  onClick={() => handleCardPlay(item)}
                >
                  {/* 背景装饰光晕 */}
                  <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
                    <div className="absolute top-10 right-5 w-28 h-28 
                                    bg-pink-200/30 rounded-full blur-3xl 
                                    group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute bottom-5 left-5 w-24 h-24 
                                    bg-yellow-200/30 rounded-full blur-3xl 
                                    group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    w-32 h-32 bg-blue-100/20 rounded-full blur-3xl" />
                  </div>

                  {/* 谐音标签 - 小红书跳动风格 */}
                  {item.xieyin && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20
                                    animate-bounce-slow">
                      <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                        className="bg-gradient-to-r from-pink-400 to-rose-400
                                    text-white px-5 py-2.5 rounded-full
                                    text-xs font-bold tracking-wider
                                    shadow-lg shadow-pink-400/40
                                    border-2 border-white
                                    flex items-center gap-1.5
                                    group-hover:shadow-xl group-hover:scale-105
                                    transition-all duration-300
                                    whitespace-nowrap">
                        <span className="text-base leading-none">✨</span>
                        {item.xieyin}
                        <span className="text-base leading-none">✨</span>
                      </motion.div>
                    </div>
                  )}

                  {/* 顶部装饰圆点 */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
                    <div className="w-1 h-1 bg-pink-300/50 rounded-full" />
                    <div className="w-1 h-1 bg-pink-400/50 rounded-full" />
                    <div className="w-1 h-1 bg-pink-300/50 rounded-full" />
                  </div>

                  <div className="relative z-10 w-full space-y-3">
                    
                    {/* 拼音 - 带小喇叭图标 */}
                    <div className="flex items-center justify-center gap-1.5 
                                    text-xs text-pink-300">
                      <Volume2 size={12} className="text-pink-300 group-hover:scale-110 transition-transform"/>
                      <span className="font-mono tracking-wider">
                        {pinyin(item.chinese, {toneType:'symbol'})}
                      </span>
                    </div>
                    
                    {/* 中文 - 渐变大字 */}
                    <h3 className="text-2xl font-black leading-tight
                                   bg-gradient-to-r from-pink-600 to-rose-600
                                   bg-clip-text text-transparent
                                   group-hover:from-pink-700 group-hover:to-rose-700
                                   transition-all duration-300">
                      {item.chinese}
                    </h3>
                    
                    {/* 缅文 - 柔和粉色 */}
                    {item.burmese && (
                      <p className="text-sm text-rose-500/80 font-burmese 
                                    leading-relaxed tracking-wide
                                    group-hover:text-rose-600 transition-colors">
                        {item.burmese}
                      </p>
                    )}

                    {/* 操作按钮 - 小红书可爱风格 */}
                    <div className="flex justify-center items-center gap-4 
                                    pt-4 mt-2 border-t border-pink-100">
                      
                      {/* 拼读按钮 */}
                      <motion.button 
                        whileHover={{ scale: 1.1, rotate: 8 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); setSpellingItem(item); }} 
                        className="w-10 h-10 rounded-2xl 
                                   bg-pink-50 text-pink-400 
                                   hover:bg-pink-100 hover:text-pink-500
                                   hover:shadow-md hover:shadow-pink-200
                                   transition-all duration-300
                                   flex items-center justify-center
                                   border border-pink-200/50">
                        <Sparkles size={16}/>
                      </motion.button>
                      
                      {/* 录音按钮 - 突出C位 */}
                      <motion.button 
                        whileHover={{ scale: 1.15, rotate: 2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); handleSpeech(item); }} 
                        className={`w-14 h-14 -mt-5 rounded-2xl 
                                   flex items-center justify-center
                                   shadow-lg
                                   transition-all duration-300
                                   border-2 border-white
                                   ${recordingId === item.id 
                                     ? 'bg-rose-500 text-white shadow-rose-500/40 animate-pulse' 
                                     : 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-pink-500/40 hover:shadow-xl hover:shadow-pink-500/50 hover:-translate-y-0.5'
                                   }`}>
                        {recordingId === item.id 
                          ? <StopCircle size={22}/> 
                          : <Mic size={22}/>
                        }
                      </motion.button>
                      
                      {/* 收藏按钮 */}
                      <motion.button 
                        whileHover={{ scale: 1.1, rotate: -8 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); toggleFav(item.id); }} 
                        className={`w-10 h-10 rounded-2xl 
                                   flex items-center justify-center
                                   transition-all duration-300
                                   ${favorites.includes(item.id) 
                                     ? 'bg-pink-500 text-white shadow-md shadow-pink-500/40' 
                                     : 'bg-pink-50 text-pink-300 hover:bg-pink-100 hover:text-pink-400'
                                   }`}>
                        <Star size={16} fill={favorites.includes(item.id) ? "currentColor" : "none"}/>
                      </motion.button>
                    </div>
                  </div>

                  {/* 底部装饰条 */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2
                                  w-12 h-1 bg-pink-200/50 rounded-full
                                  group-hover:w-16 group-hover:bg-pink-300
                                  transition-all duration-300" />
                </div>
              
              {/* 语音评分结果 */}
              <AnimatePresence>
                {speechResult?.id === item.id && (
                  <motion.div 
                    initial={{opacity:0, height:0}} 
                    animate={{opacity:1, height:'auto'}} 
                    exit={{opacity:0, height:0}} 
                    className="bg-white mx-auto max-w-[360px] rounded-2xl mt-2 p-4 shadow-sm border border-pink-100"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-pink-400">评分 | ရမှတ်</span>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        speechResult.data.accuracy > 0.8 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-rose-100 text-rose-600'
                      }`}>
                        {Math.round(speechResult.data.accuracy * 100)}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {speechResult.data.comparison.map((r, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <span className={`text-xs font-pinyin font-bold ${
                            r.isMatch ? 'text-pink-600' : 'text-rose-500'
                          }`}>
                            {r.userPy || '?'}
                          </span>
                          <span className="text-[10px] text-slate-400">{r.targetChar}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* 加载更多指示器 */}
        {displayPhrases.length > 0 && (
          <div ref={loaderRef} className="py-10 text-center">
            {visibleCount < displayPhrases.length ? (
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-pink-400">
                <Loader2 className="animate-spin" size={16} /> 
                <span>✨ 加载更多 ✨</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 opacity-50">
                <div className="w-12 h-1 bg-pink-200 rounded-full" />
                <span className="text-[10px] text-pink-300">
                  ✨ 共 {displayPhrases.length} 句 ✨
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 拼读弹窗 */}
      <AnimatePresence>
        {spellingItem && (
          <SpellingModal
            item={spellingItem}
            settings={settings}
            onClose={() => setSpellingItem(null)}
          />
        )}
      </AnimatePresence>

      {/* 全局样式 */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .font-pinyin {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        
        .font-burmese {
          font-family: 'Padauk', 'Myanmar3', 'Noto Sans Myanmar', sans-serif;
        }
      `}</style>
    </div>
  );
}
