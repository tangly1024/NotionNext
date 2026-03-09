'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mic, StopCircle, Sparkles, X, Volume2, Star, Play,
  Square, Settings2, ChevronLeft, Loader2, Heart
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { pinyin } from 'pinyin-pro';

// ============================================================================
// 1. 工具函数
// ============================================================================
function normalizePhrase(item, index) {
  const chinese = item?.chinese || item?.zh || item?.text || '';
  const burmese = item?.burmese || item?.translation || item?.en || item?.meaning || '';
  const xieyin = item?.xieyin || '';

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
    audioMy: item?.audioMy || item?.myAudio || '',
    note: item?.note || ''
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
      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">播放设置</span>
      <button onClick={onClose}>
        <X size={16} className="text-slate-400 hover:text-red-500" />
      </button>
    </div>

    <div className="p-5 space-y-5">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700">中文朗读</span>
          <div
            onClick={() => setSettings((s) => ({ ...s, zhEnabled: !s.zhEnabled }))}
            className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
              settings.zhEnabled ? 'bg-blue-500' : 'bg-slate-200'
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
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-white border-slate-100 text-slate-400'
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
            onChange={(e) => setSettings((s) => ({ ...s, zhRate: Number(e.target.value) }))}
            className="flex-1 h-1 bg-slate-100 rounded-lg appearance-none accent-blue-500"
          />
          <span className="text-[10px] w-6 text-right font-mono text-slate-400">{settings.zhRate}</span>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700">缅甸语朗读</span>
          <div
            onClick={() => setSettings((s) => ({ ...s, myEnabled: !s.myEnabled }))}
            className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
              settings.myEnabled ? 'bg-emerald-500' : 'bg-slate-200'
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
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  : 'bg-white border-slate-100 text-slate-400'
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
            value={settings.myRate}
            onChange={(e) => setSettings((s) => ({ ...s, myRate: Number(e.target.value) }))}
            className="flex-1 h-1 bg-slate-100 rounded-lg appearance-none accent-emerald-500"
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
  const chars = useMemo(() => item.chinese.split(''), [item.chinese]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    AudioEngine.stop();

    const autoSpell = async () => {
      await new Promise((r) => setTimeout(r, 220));
      if (!isMounted.current) return;

      for (let i = 0; i < chars.length; i++) {
        if (!isMounted.current) break;

        setActiveCharIndex(i);
        const py = pinyin(chars[i], { toneType: 'symbol' });
        const r2Url = `https://audio.886.best/chinese-vocab-audio/%E6%8B%BC%E8%AF%BB%E9%9F%B3%E9%A2%91/${encodeURIComponent(py)}.mp3`;

        await AudioEngine.play(r2Url);
        await new Promise((r) => setTimeout(r, 80));
      }

      if (isMounted.current) setActiveCharIndex(-1);
    };

    autoSpell();

    return () => {
      isMounted.current = false;
      AudioEngine.stop();
    };
  }, [chars]);

  const handleCharClick = async (index) => {
    setActiveCharIndex(index);
    const char = chars[index];
    const py = pinyin(char, { toneType: 'symbol' });
    const r2Url = `https://audio.886.best/chinese-vocab-audio/%E6%8B%BC%E8%AF%BB%E9%9F%B3%E9%A2%91/${encodeURIComponent(py)}.mp3`;
    await AudioEngine.play(r2Url);
    setActiveCharIndex(-1);
  };

  const playWhole = async () => {
    setActiveCharIndex(-1);
    await AudioEngine.playTTS(item.chinese, settings.zhVoice, settings.zhRate);
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
        exit={{ y: '100%' }}
        className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden" />

        <div className="flex items-center justify-between mb-8">
          <h3 className="text-slate-900 font-black text-lg">拼读练习</h3>
          <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-1 rounded font-bold">
            自动演示
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10 px-2">
          {chars.map((char, i) => (
            <div
              key={i}
              onClick={() => handleCharClick(i)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all cursor-pointer select-none min-w-[58px] ${
                activeCharIndex === i
                  ? 'bg-blue-50 ring-2 ring-blue-500 scale-110 shadow-lg'
                  : 'hover:bg-slate-50'
              }`}
            >
              <span
                className={`text-xs font-pinyin mb-1 ${
                  activeCharIndex === i ? 'text-blue-600 font-bold' : 'text-slate-400'
                }`}
              >
                {pinyin(char, { toneType: 'symbol' })}
              </span>
              <span
                className={`text-3xl font-black ${
                  activeCharIndex === i ? 'text-blue-800' : 'text-slate-800'
                }`}
              >
                {char}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-around items-center px-4 pb-4">
          <button
            onClick={playWhole}
            className="flex flex-col items-center gap-2 cursor-pointer text-slate-700"
          >
            <Volume2 size={24} />
            <span className="text-[10px]">整句</span>
          </button>

          <button
            onClick={toggleRecord}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 ${
              recordState === 'recording' ? 'bg-red-500 border-red-100' : 'bg-slate-100 border-white'
            }`}
          >
            {recordState === 'recording' ? (
              <Square size={24} className="text-white" />
            ) : (
              <Mic size={28} className="text-slate-700" />
            )}
          </button>

          <button
            onClick={() => userAudio && AudioEngine.play(userAudio)}
            className={`flex flex-col items-center gap-2 ${
              userAudio ? 'text-slate-700 hover:text-blue-500' : 'opacity-30 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Play size={24} />
            <span className="text-[10px]">回放</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// 4. 主组件
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
        await new Promise((r) => setTimeout(r, 350));
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fffaf5_0%,_#f7f8fc_45%,_#eef4ff_100%)] font-sans text-slate-900 max-w-md mx-auto relative shadow-2xl overflow-x-hidden pb-32">
      <motion.div
        animate={{ y: isHeaderVisible ? 0 : -80 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-white/85 backdrop-blur-md border-b border-slate-100 h-14 max-w-md mx-auto px-4 flex justify-between items-center"
      >
        <button onClick={handleBack} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 active:scale-95 transition-transform">
          <ChevronLeft size={24} />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-sm font-black text-slate-800">{isFavMode ? '我的收藏' : title}</span>
          <span className="text-[10px] text-slate-400">{isFavMode ? '已收藏的内容' : categoryTitle}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFavMode(!isFavMode)}
            className={`p-2 transition-colors active:scale-95 ${
              isFavMode ? 'text-rose-500' : 'text-slate-400'
            }`}
          >
            <Heart size={20} fill={isFavMode ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-slate-400 active:scale-95 transition-transform"
          >
            <Settings2 size={20} />
          </button>
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

      <div className="pt-20 px-4 space-y-4">
        {displayPhrases.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-32 text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              {isFavMode ? (
                <Heart size={32} className="text-slate-300" />
              ) : (
                <Loader2 size={32} className="animate-spin text-slate-300" />
              )}
            </div>
            <p className="text-sm font-bold">{isFavMode ? '还没有收藏的句子' : '暂无数据'}</p>
          </div>
        )}

        {displayPhrases.slice(0, visibleCount).map((item) => {
          const isPlaying = playingId === item.id;
          const isRecording = recordingId === item.id;
          const isFav = favorites.includes(item.id);
          const xieyinText = item.xieyin || item.note;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <div
                className={`relative pt-10 pb-4 px-4
                            bg-gradient-to-br from-white via-white to-rose-50/60
                            rounded-[28px]
                            border border-rose-100/80
                            shadow-[0_10px_28px_-10px_rgba(244,114,182,0.22)]
                            flex flex-col items-center text-center
                            transition-all duration-300 ease-out
                            max-w-[340px] mx-auto overflow-visible
                            ${isPlaying ? 'ring-2 ring-pink-400/40 bg-rose-50/70 scale-[1.01]' : ''}
                          `}
                onClick={() => handleCardPlay(item)}
              >
                {xieyinText && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                    <div className="relative">
                      <div className="absolute left-1/2 top-[22px] -translate-x-1/2 w-[78%] h-3 rounded-full bg-rose-200/40 blur-md" />
                      <div
                        className="relative flex items-center gap-1.5 max-w-[240px]
                                   px-4 py-1.5 rounded-full
                                   bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400
                                   text-white text-[11px] font-black tracking-[0.08em]
                                   border-2 border-white/95
                                   shadow-[0_10px_24px_-8px_rgba(244,114,182,0.55)]
                                   overflow-hidden"
                      >
                        <div className="absolute inset-x-3 top-[2px] h-[45%] rounded-full bg-white/18 blur-[1px]" />
                        <span className="relative z-10 text-[10px] shrink-0">✦</span>
                        <span className="relative z-10 truncate">{xieyinText}</span>
                        <span className="relative z-10 text-[10px] shrink-0">✦</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex gap-1">
                  <div className="w-1 h-1 bg-pink-300/40 rounded-full" />
                  <div className="w-1 h-1 bg-pink-400/50 rounded-full" />
                  <div className="w-1 h-1 bg-pink-300/40 rounded-full" />
                </div>

                <div className="relative z-10 w-full space-y-2 mt-1">
                  <div className="flex items-center justify-center gap-1 text-[12px] text-slate-400/90">
                    <Volume2 size={12} className={isPlaying ? 'text-pink-500 animate-pulse' : 'text-pink-300'} />
                    <span className="font-pinyin tracking-wide">
                      {item.pinyin}
                    </span>
                  </div>

                  <h3
                    className={`text-[22px] font-black leading-tight transition-colors duration-300 px-2 ${
                      isPlaying ? 'text-pink-600' : 'text-slate-800'
                    }`}
                  >
                    {item.chinese}
                  </h3>

                  {item.burmese && (
                    <p className="text-[14px] text-rose-500/80 font-medium leading-relaxed tracking-wide px-2 pb-1">
                      {item.burmese}
                    </p>
                  )}

                  <div className="flex justify-center items-center gap-5 pt-3 mt-1 border-t border-pink-100/60 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSpellingItem(item);
                      }}
                      className="w-9 h-9 rounded-xl bg-pink-50 text-pink-400 active:bg-pink-100 active:scale-95 transition-all duration-200 flex items-center justify-center border border-pink-200/50"
                    >
                      <Sparkles size={15} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeech(item);
                      }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md border-2 border-white transition-all duration-200 active:scale-95 z-10 -mt-2
                                 ${
                                   isRecording
                                     ? 'bg-rose-500 text-white shadow-rose-500/40 animate-pulse'
                                     : 'bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-pink-400/30'
                                 }`}
                    >
                      {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFav(item.id);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95
                                 ${
                                   isFav
                                     ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/40'
                                     : 'bg-pink-50 text-pink-300 border border-pink-100/50'
                                 }`}
                    >
                      <Star size={15} fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                <div className="absolute -bottom-2 left-6 right-6 h-4 bg-rose-200/30 blur-md rounded-full -z-10" />
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-rose-200/50 rounded-full" />
              </div>

              <AnimatePresence>
                {speechResult?.id === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/80 backdrop-blur-sm mx-auto max-w-[320px] rounded-2xl mt-3 p-3 shadow-sm border border-pink-50"
                  >
                    <div className="flex justify-between items-center mb-2 px-1">
                      <span className="text-[10px] font-bold text-slate-400">发音评分</span>
                      <span
                        className={`text-xs font-black ${
                          speechResult.data.accuracy > 0.8 ? 'text-green-500' : 'text-red-500'
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

        {displayPhrases.length > 0 && (
          <div ref={loaderRef} className="py-10 text-center text-slate-400">
            {visibleCount < displayPhrases.length ? (
              <div className="flex items-center justify-center gap-2 text-xs font-bold animate-pulse">
                <Loader2 className="animate-spin" size={16} /> 加载中...
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 opacity-50 pb-8">
                <div className="w-12 h-1 bg-slate-200 rounded-full" />
                <span className="text-[10px]">到底了 (共 {displayPhrases.length} 句)</span>
              </div>
            )}
          </div>
        )}
      </div>

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
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
      `}</style>
    </div>
  );
}
