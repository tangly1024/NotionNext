'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mic, StopCircle, Sparkles, X, Volume2, Star, Play,
  Square, Settings2, ChevronLeft, Loader2, Heart, Zap
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { pinyin } from 'pinyin-pro';

// ============================================================================
// 工具函数
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
// 音频与语音引擎
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
      if (typeof window === 'undefined' || !url) { resolve(); return; }
      const audio = new Audio(url);
      this.current = audio;
      audio.onended = () => { this.current = null; resolve(); };
      audio.onerror = () => { this.current = null; resolve(); };
      audio.play().catch(() => { this.current = null; resolve(); });
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
      if (!this.mediaRecorder) { resolve(null); return; }
      this.mediaRecorder.onstop = () => {
        const url = URL.createObjectURL(new Blob(this.chunks, { type: 'audio/webm' }));
        if (this.stream) { this.stream.getTracks().forEach((t) => t.stop()); }
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
      alert('浏览器不支持语音识别');
      if (onError) onError();
      return;
    }
    this.recognition = new SR();
    this.recognition.lang = 'zh-CN';
    this.recognition.onresult = (e) => onResult(e.results[0][0].transcript);
    this.recognition.onerror = () => { if (onError) onError(); };
    this.recognition.onend = () => { if (onError) onError(); };
    try { this.recognition.start(); } catch (_) { if (onError) onError(); }
  },
  stop() { if (this.recognition) this.recognition.stop(); }
};

// ============================================================================
// 子组件：设置
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
      <button onClick={onClose}><X size={16} className="text-slate-400 hover:text-red-500" /></button>
    </div>
    <div className="p-5 space-y-5">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700">中文朗读</span>
          <div
            onClick={() => setSettings((s) => ({ ...s, zhEnabled: !s.zhEnabled }))}
            className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${settings.zhEnabled ? 'bg-blue-500' : 'bg-slate-200'}`}
          >
            <div className="absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform" style={{ left: settings.zhEnabled ? '18px' : '2px' }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[{ label: '小晓', val: 'zh-CN-XiaoxiaoMultilingualNeural' }, { label: '小辰', val: 'zh-CN-XiaochenMultilingualNeural' }].map((opt) => (
            <button key={opt.val} onClick={() => setSettings((s) => ({ ...s, zhVoice: opt.val }))} className={`py-1.5 text-[10px] font-bold rounded border transition-all ${settings.zhVoice === opt.val ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-100 text-slate-400'}`}>{opt.label}</button>
          ))}
        </div>
      </div>
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700">缅甸语朗读</span>
          <div
            onClick={() => setSettings((s) => ({ ...s, myEnabled: !s.myEnabled }))}
            className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${settings.myEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
          >
            <div className="absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform" style={{ left: settings.myEnabled ? '18px' : '2px' }} />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// ============================================================================
// 子组件：拼读模态框
// ============================================================================
const SpellingModal = ({ item, settings, onClose }) => {
  const [activeCharIndex, setActiveCharIndex] = useState(-1);
  const chars = useMemo(() => item.chinese.split(''), [item.chinese]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const autoSpell = async () => {
      await new Promise((r) => setTimeout(r, 200));
      for (let i = 0; i < chars.length; i++) {
        if (!isMounted.current) break;
        setActiveCharIndex(i);
        const py = pinyin(chars[i], { toneType: 'symbol' });
        await AudioEngine.play(`https://audio.886.best/chinese-vocab-audio/%E6%8B%BC%E8%AF%BB%E9%9F%B3%E9%A2%91/${encodeURIComponent(py)}.mp3`);
      }
      if (isMounted.current) setActiveCharIndex(-1);
    };
    autoSpell();
    return () => { isMounted.current = false; AudioEngine.stop(); };
  }, [chars]);

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-end justify-center" onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="bg-white w-full max-w-md rounded-t-[2.5rem] p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {chars.map((char, i) => (
            <div key={i} className={`flex flex-col items-center p-3 rounded-2xl transition-all ${activeCharIndex === i ? 'bg-blue-50 scale-110' : ''}`}>
              <span className="text-xs text-slate-400 mb-1">{pinyin(char, { toneType: 'symbol' })}</span>
              <span className="text-4xl font-black text-slate-800">{char}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-4 bg-slate-100 rounded-2xl font-bold text-slate-500">关闭</button>
      </motion.div>
    </div>
  );
};

// ============================================================================
// 主组件
// ============================================================================
export default function OralPhraseBrowser({
  phrases = [],
  title = '模块学习',
  categoryTitle = '口语分类',
  onBack,
  favoriteStorageKey = 'spoken_favs_v2',
  settingsStorageKey = 'spoken_settings_v2'
}) {
  const normalizedPhrases = useMemo(() => (phrases || []).map(normalizePhrase).filter(i => i.chinese), [phrases]);
  const [favorites, setFavorites] = useState([]);
  const [isFavMode, setIsFavMode] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [showSettings, setShowSettings] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [settings, setSettings] = useState({ zhVoice: 'zh-CN-XiaoxiaoMultilingualNeural', zhRate: 0, zhEnabled: true, myVoice: 'my-MM-ThihaNeural', myRate: 0, myEnabled: true });
  const [playingId, setPlayingId] = useState(null);
  const [spellingItem, setSpellingItem] = useState(null);
  const [recordingId, setRecordingId] = useState(null);
  const [speechResult, setSpeechResult] = useState(null);

  const loaderRef = useRef(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const f = localStorage.getItem(favoriteStorageKey);
    if (f) setFavorites(JSON.parse(f));
    const s = localStorage.getItem(settingsStorageKey);
    if (s) setSettings(JSON.parse(s));
  }, []);

  useEffect(() => { localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem(settingsStorageKey, JSON.stringify(settings)); }, [settings]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() || 0;
    setIsHeaderVisible(!(latest > prev && latest > 50));
  });

  const displayPhrases = useMemo(() => isFavMode ? normalizedPhrases.filter(p => favorites.includes(p.id)) : normalizedPhrases, [normalizedPhrases, favorites, isFavMode]);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setVisibleCount(v => Math.min(v + 20, displayPhrases.length));
    }, { rootMargin: '200px' });
    if (loaderRef.current) obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [displayPhrases]);

  const handleCardPlay = async (item) => {
    if (playingId === item.id) { AudioEngine.stop(); setPlayingId(null); return; }
    setPlayingId(item.id);
    if (settings.zhEnabled) await AudioEngine.playTTS(item.chinese, settings.zhVoice, settings.zhRate);
    if (settings.myEnabled && item.burmese) {
      await new Promise(r => setTimeout(r, 400));
      await AudioEngine.playTTS(item.burmese, settings.myVoice, settings.myRate);
    }
    setPlayingId(null);
  };

  const handleSpeech = (item) => {
    if (recordingId === item.id) { SpeechEngine.stop(); setRecordingId(null); return; }
    AudioEngine.stop(); setRecordingId(item.id); setSpeechResult(null);
    SpeechEngine.start(
      (transcript) => {
        setSpeechResult({ id: item.id, data: getPinyinComparison(item.chinese, transcript) });
        setRecordingId(null);
      },
      () => setRecordingId(null)
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] font-sans text-slate-900 max-w-md mx-auto relative shadow-2xl pb-32">
      {/* 顶部导航 */}
      <motion.div
        animate={{ y: isHeaderVisible ? 0 : -80 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100 h-14 max-w-md mx-auto px-4 flex justify-between items-center"
      >
        <button onClick={onBack} className="p-2 text-slate-500"><ChevronLeft size={24} /></button>
        <div className="flex flex-col items-center">
          <span className="text-sm font-black">{isFavMode ? '我的收藏' : title}</span>
          <span className="text-[10px] text-slate-400">{categoryTitle}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setIsFavMode(!isFavMode)} className={`p-2 ${isFavMode ? 'text-rose-500' : 'text-slate-300'}`}><Heart size={20} fill={isFavMode ? 'currentColor' : 'none'} /></button>
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 text-slate-300"><Settings2 size={20} /></button>
        </div>
      </motion.div>

      <AnimatePresence>{showSettings && <SettingsPanel settings={settings} setSettings={setSettings} onClose={() => setShowSettings(false)} />}</AnimatePresence>

      <div className="pt-20 px-4 space-y-10">
        {displayPhrases.slice(0, visibleCount).map((item) => {
          const isPlaying = playingId === item.id;
          const isRecording = recordingId === item.id;
          const isFav = favorites.includes(item.id);

          return (
            <div key={item.id} className="relative">
              {/* 卡片主体：大圆角 */}
              <div
                onClick={() => handleCardPlay(item)}
                className={`relative bg-white pt-12 pb-6 px-6 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all ${isPlaying ? 'ring-2 ring-blue-500/20' : ''}`}
              >
                {/* 谐音标签：悬浮在边框中线 */}
                {item.xieyin && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-[11px] font-bold border border-orange-100 shadow-sm">
                      <Zap size={10} className="fill-orange-500" />
                      {item.xieyin}
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className="text-xs text-slate-300 font-medium mb-1">{item.pinyin}</div>
                  <div className="text-2xl font-black text-slate-800 mb-2">{item.chinese}</div>
                  <div className="text-sm text-blue-500 font-bold mb-8">{item.burmese}</div>

                  {/* 底部按钮组：去除了识别按钮的双边框 */}
                  <div className="flex items-center gap-8">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSpellingItem(item); }}
                      className="text-slate-300 hover:text-blue-500 transition-colors"
                    >
                      <Sparkles size={20} />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleSpeech(item); }}
                      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-50 text-slate-400 active:scale-90'}`}
                    >
                      {isRecording ? <StopCircle size={24} /> : <Mic size={24} />}
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); setFavorites(prev => isFav ? prev.filter(id => id !== item.id) : [...prev, item.id]); }}
                      className={`transition-colors ${isFav ? 'text-yellow-400' : 'text-slate-300'}`}
                    >
                      <Star size={20} fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 评分结果 */}
              <AnimatePresence>
                {speechResult?.id === item.id && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
                    <div className="flex justify-between text-[10px] font-bold text-blue-400 mb-2">
                      <span>发音评分</span>
                      <span>{Math.round(speechResult.data.accuracy * 100)}%</span>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {speechResult.data.comparison.map((r, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <span className={`text-[10px] font-bold ${r.isMatch ? 'text-blue-600' : 'text-red-400'}`}>{r.userPy || '?'}</span>
                          <span className="text-[10px] text-slate-400">{r.targetChar}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        <div ref={loaderRef} className="h-20 flex items-center justify-center text-slate-300 text-xs">
          {visibleCount < displayPhrases.length ? <Loader2 className="animate-spin" /> : '没有更多了'}
        </div>
      </div>

      <AnimatePresence>{spellingItem && <SpellingModal item={spellingItem} settings={settings} onClose={() => setSpellingItem(null)} />}</AnimatePresence>

      <style jsx global>{`
        .font-pinyin { font-family: -apple-system, sans-serif; }
      `}</style>
    </div>
  );
                      }
