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

// 滑动窗口比对算法，容许漏字、跳字
function getPinyinComparison(targetText, userText) {
  const cleanTarget = targetText.replace(/[^\u4e00-\u9fa5]/g, '');
  const cleanUser = userText.replace(/[^\u4e00-\u9fa5]/g, '');

  const targetPy = pinyin(cleanTarget, { type: 'array', toneType: 'symbol' });
  const userPy = pinyin(cleanUser, { type: 'array', toneType: 'symbol' });

  const result = [];
  let correctCount = 0;
  let uIdx = 0; 

  for (let i = 0; i < targetPy.length; i++) {
    const tChar = cleanTarget[i];
    const tPy = targetPy[i];
    
    let matchIdx = -1;
    for (let j = uIdx; j < Math.min(uIdx + 3, userPy.length); j++) {
      if (cleanUser[j] === tChar || userPy[j] === tPy) {
        matchIdx = j;
        break;
      }
    }

    if (matchIdx !== -1) {
      correctCount++;
      result.push({ targetChar: tChar, targetPy: tPy, userPy: userPy[matchIdx], isMatch: true, isMissing: false });
      uIdx = matchIdx + 1; 
    } else {
      result.push({ targetChar: tChar, targetPy: tPy, userPy: '—', isMatch: false, isMissing: true });
    }
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
  chunks:[],
  stream: null,
  async start() {
    AudioEngine.stop();
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) return false;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.chunks =[];
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
    this.recognition.onerror = () => { if (onError) onError(); };
    this.recognition.onend = () => { if (onError) onError(); };
    try { this.recognition.start(); } catch (_) { if (onError) onError(); }
  },
  stop() { if (this.recognition) this.recognition.stop(); }
};

// ============================================================================
// 3. 子组件：设置面板
// ============================================================================
const SettingsPanel = ({ settings, setSettings, onClose }) => (
  // 提升 z-index 到 9999 解决遮挡问题
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    className="fixed top-16 right-4 z-[9999] bg-white rounded-2xl shadow-2xl border border-slate-100 w-72 overflow-hidden"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="bg-slate-50 px-4 py-3 flex justify-between items-center border-b border-slate-100">
      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">播放设置</span>
      <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
        <X size={16} className="text-slate-400 hover:text-red-500" />
      </button>
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
                settings.zhVoice === opt.val ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-100 text-slate-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] text-slate-400">语速</span>
          <input type="range" min="-50" max="50" step="10" value={settings.zhRate} onChange={(e) => setSettings((s) => ({ ...s, zhRate: Number(e.target.value) }))} className="flex-1 h-1 bg-slate-100 rounded-lg appearance-none accent-blue-500" />
          <span className="text-[10px] w-6 text-right font-mono text-slate-400">{settings.zhRate}</span>
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
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Thiha (男)', val: 'my-MM-ThihaNeural' },
            { label: 'Nilar (女)', val: 'my-MM-NilarNeural' }
          ].map((opt) => (
            <button
              key={opt.val}
              onClick={() => setSettings((s) => ({ ...s, myVoice: opt.val }))}
              className={`py-1.5 text-[10px] font-bold rounded border transition-all truncate ${
                settings.myVoice === opt.val ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-100 text-slate-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] text-slate-400">语速</span>
          <input type="range" min="-50" max="50" step="10" value={settings.myRate} onChange={(e) => setSettings((s) => ({ ...s, myRate: Number(e.target.value) }))} className="flex-1 h-1 bg-slate-100 rounded-lg appearance-none accent-emerald-500" />
          <span className="text-[10px] w-6 text-right font-mono text-slate-400">{settings.myRate}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// ============================================================================
// 4. 子组件：拼读弹窗
// ============================================================================
const SpellingModal = ({ item, settings, onClose }) => {
  const [activeCharIndex, setActiveCharIndex] = useState(-1);
  const [recordState, setRecordState] = useState('idle');
  const [userAudio, setUserAudio] = useState(null);
  const chars = useMemo(() => item.chinese.split(''), [item.chinese]);
  
  const isMounted = useRef(true);
  const spellSessionId = useRef(0);

  useEffect(() => {
    isMounted.current = true;
    spellSessionId.current += 1;
    const currentSession = spellSessionId.current;

    AudioEngine.stop();

    const autoSpell = async () => {
      await new Promise((r) => setTimeout(r, 300));
      if (!isMounted.current || currentSession !== spellSessionId.current) return;

      for (let i = 0; i < chars.length; i++) {
        if (!isMounted.current || currentSession !== spellSessionId.current) break;
        setActiveCharIndex(i);
        const py = pinyin(chars[i], { toneType: 'symbol' });
        const r2Url = `https://audio.886.best/chinese-vocab-audio/%E6%8B%BC%E8%AF%BB%E9%9F%B3%E9%A2%91/${encodeURIComponent(py)}.mp3`;
        await AudioEngine.play(r2Url);
        await new Promise((r) => setTimeout(r, 60));
      }
      if (isMounted.current && currentSession === spellSessionId.current) setActiveCharIndex(-1);
    };

    autoSpell();
    return () => {
      isMounted.current = false;
      spellSessionId.current += 1;
      AudioEngine.stop();
    };
  }, [chars]);

  const handleCharClick = async (index) => {
    spellSessionId.current += 1;
    AudioEngine.stop();
    setActiveCharIndex(index);
    const char = chars[index];
    const py = pinyin(char, { toneType: 'symbol' });
    const r2Url = `https://audio.886.best/chinese-vocab-audio/%E6%8B%BC%E8%AF%BB%E9%9F%B3%E9%A2%91/${encodeURIComponent(py)}.mp3`;
    await AudioEngine.play(r2Url);
    if (isMounted.current) setActiveCharIndex(-1);
  };

  const playWhole = async () => {
    spellSessionId.current += 1;
    AudioEngine.stop();
    setActiveCharIndex('all');
    await AudioEngine.playTTS(item.chinese, settings.zhVoice, settings.zhRate);
    if (isMounted.current) setActiveCharIndex(-1);
  };

  const toggleRecord = async () => {
    spellSessionId.current += 1;
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
    <div className="fixed inset-0 z-[9999] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center px-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="text-center mb-6 pt-2">
          <h3 className="text-slate-900 font-black text-xl mb-1">拼读练习</h3>
          <span className="text-[10px] text-slate-400 font-burmese">စာလုံးပေါင်းလေ့ကျင့်ခြင်း</span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10 px-2">
          {chars.map((char, i) => (
            <div
              key={i}
              onClick={() => handleCharClick(i)}
              className={`flex flex-col items-center justify-center w-16 h-20 rounded-2xl transition-all cursor-pointer select-none ${
                activeCharIndex === i || activeCharIndex === 'all'
                  ? 'bg-blue-50 ring-2 ring-blue-500 scale-105 shadow-md'
                  : 'hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <span className={`text-xs font-pinyin mb-1 ${activeCharIndex === i || activeCharIndex === 'all' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                {pinyin(char, { toneType: 'symbol' })}
              </span>
              <span className={`text-3xl font-black ${activeCharIndex === i || activeCharIndex === 'all' ? 'text-blue-800' : 'text-slate-800'}`}>
                {char}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-around items-center px-4 pb-2">
          <button onClick={playWhole} className="flex flex-col items-center gap-2 cursor-pointer text-slate-500 hover:text-blue-500 transition-colors">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center"><Volume2 size={20} /></div>
            <span className="text-[10px] font-bold">整句</span>
          </button>
          <button onClick={toggleRecord} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${recordState === 'recording' ? 'bg-red-50 text-red-500 border-red-200 animate-pulse' : 'bg-slate-50 text-slate-500 border-white hover:text-blue-500'}`}>
            {recordState === 'recording' ? <Square size={24} /> : <Mic size={24} />}
          </button>
          <button onClick={() => userAudio && AudioEngine.play(userAudio)} className={`flex flex-col items-center gap-2 transition-colors ${userAudio ? 'text-slate-500 hover:text-blue-500 cursor-pointer' : 'opacity-30 text-slate-400 cursor-not-allowed'}`}>
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center"><Play size={20} /></div>
            <span className="text-[10px] font-bold">回放</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// 5. 主组件
// ============================================================================
export default function OralPhraseBrowser({
  phrases =[],
  title = '模块学习',
  categoryTitle = '口语分类',
  onBack,
  favoriteStorageKey = 'spoken_favs_default',
  settingsStorageKey = 'spoken_settings_default'
}) {
  const normalizedPhrases = useMemo(
    () => (phrases ||[]).map(normalizePhrase).filter((item) => item.chinese),
    [phrases]
  );

  const [favorites, setFavorites] = useState([]);
  const [isFavMode, setIsFavMode] = useState(false);
  const[visibleCount, setVisibleCount] = useState(20);
  const loaderRef = useRef(null);

  const[showSettings, setShowSettings] = useState(false);
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
  const[recordingId, setRecordingId] = useState(null);
  const [speechResult, setSpeechResult] = useState(null);

  // 引入全局会话锁，彻底解决列表中狂点导致的声音重叠
  const playSessionRef = useRef(0);

  const { scrollY } = useScroll();

  useEffect(() => {
    const savedSet = localStorage.getItem(settingsStorageKey);
    if (savedSet) setSettings(JSON.parse(savedSet));

    const savedFavs = localStorage.getItem(favoriteStorageKey);
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, [favoriteStorageKey, settingsStorageKey]);

  useEffect(() => { localStorage.setItem(settingsStorageKey, JSON.stringify(settings)); }, [settings, settingsStorageKey]);
  useEffect(() => { localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites)); }, [favorites, favoriteStorageKey]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() || 0;
    setIsHeaderVisible(!(latest > previous && latest > 50));
  });

  const displayPhrases = useMemo(() => {
    if (isFavMode) return normalizedPhrases.filter((p) => favorites.includes(p.id));
    return normalizedPhrases;
  }, [normalizedPhrases, favorites, isFavMode]);

  useEffect(() => { setVisibleCount(20); }, [isFavMode, phrases]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 20, displayPhrases.length));
        }
    }, { root: null, rootMargin: '200px', threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => { if (loaderRef.current) observer.unobserve(loaderRef.current); };
  }, [displayPhrases.length]);

  const handleBack = () => {
    AudioEngine.stop();
    playSessionRef.current += 1;
    if (isFavMode) setIsFavMode(false);
    else if (onBack) onBack();
    else window.history.back();
  };

  const handleCardPlay = async (item) => {
    // 如果点击的是正在播放的，直接停止
    if (playingId === item.id) {
      AudioEngine.stop();
      setPlayingId(null);
      playSessionRef.current += 1; 
      return;
    }

    // 每次点击生成新的会话ID，拦截旧异步任务
    playSessionRef.current += 1;
    const currentSession = playSessionRef.current;

    AudioEngine.stop();
    setPlayingId(item.id);

    try {
      if (settings.zhEnabled) {
        if (item.audioZh) {
          await AudioEngine.play(item.audioZh);
        } else {
          await AudioEngine.playTTS(item.chinese, settings.zhVoice, settings.zhRate);
        }
      }

      // 如果在中文播放期间，用户点了别的，立即阻断
      if (currentSession !== playSessionRef.current) return;

      if (settings.myEnabled && item.burmese) {
        if (settings.zhEnabled) {
          await new Promise((r) => setTimeout(r, 350));
        }
        
        // 如果在停顿期间，用户点了别的，立即阻断
        if (currentSession !== playSessionRef.current) return;

        if (item.audioMy) {
          await AudioEngine.play(item.audioMy);
        } else {
          await AudioEngine.playTTS(item.burmese, settings.myVoice, settings.myRate);
        }
      }
    } finally {
      // 只有属于当前会话的播放结束，才清除高亮状态
      if (currentSession === playSessionRef.current) {
        setPlayingId(null);
      }
    }
  };

  const handleSpeech = (item) => {
    if (recordingId === item.id) {
      SpeechEngine.stop();
      setRecordingId(null);
      return;
    }

    // 启动录音时，打断卡片播放
    playSessionRef.current += 1;
    AudioEngine.stop();
    setPlayingId(null);

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
    setFavorites((prev) => prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-slate-900 max-w-md mx-auto relative overflow-x-hidden pb-32">
      <motion.div
        animate={{ y: isHeaderVisible ? 0 : -80 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-white/85 backdrop-blur-md border-b border-slate-100 h-14 max-w-md mx-auto px-4 flex justify-between items-center"
      >
        <button onClick={handleBack} className="p-2 -ml-2 text-slate-500 hover:text-slate-900">
          <ChevronLeft size={24} />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-sm font-black text-slate-800">{isFavMode ? '我的收藏' : title}</span>
          <span className="text-[10px] text-slate-400 font-burmese leading-tight">{isFavMode ? 'မှတ်ထားသော စကားပြော' : categoryTitle}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFavMode(!isFavMode)}
            className={`p-2 transition-colors ${
              isFavMode ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
            }`}
          >
            <Heart size={20} fill={isFavMode ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-slate-400 hover:text-blue-600"
          >
            <Settings2 size={20} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSettings && (
          <>
            {/* 为设置面板专门添加最顶层深色遮罩，点击遮罩关闭 */}
            <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]" onClick={() => setShowSettings(false)} />
            <SettingsPanel
              settings={settings}
              setSettings={setSettings}
              onClose={() => setShowSettings(false)}
            />
          </>
        )}
      </AnimatePresence>

      <div className="pt-24 px-4 space-y-8">
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
              className="mt-8"
            >
              <div
                className={`relative bg-white pt-10 pb-6 px-4 rounded-[2.5rem] 
                border-2 border-slate-50 border-b-[6px] border-b-slate-100/80
                shadow-[0_8px_20px_rgba(15,23,42,0.06)] flex flex-col items-center text-center transition-all max-w-[360px] mx-auto overflow-visible cursor-pointer ${
                  isPlaying ? 'ring-2 ring-blue-400 bg-blue-50/20' : ''
                }`}
                onClick={() => handleCardPlay(item)}
              >
                {/* 谐音胶囊：背景浅粉，字体蓝色 */}
                {xieyinText && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10 flex justify-center pointer-events-none">
                    <div className="bg-pink-50 text-blue-600 px-4 py-1.5 rounded-full text-[13px] font-black border border-pink-100 shadow-sm flex items-center gap-1.5 whitespace-nowrap overflow-visible">
                      <Zap size={14} className="shrink-0 fill-pink-400 text-pink-400" />
                      <span className="truncate pt-0.5 font-burmese">{xieyinText}</span>
                    </div>
                  </div>
                )}

                <div className="w-full mt-2">
                  {/* 拼音，加深颜色 */}
                  <div className="text-[15px] text-slate-500 font-medium font-pinyin mb-1 tracking-wide">
                    {item.pinyin}
                  </div>

                  <h3 className="text-[28px] font-black text-slate-800 mb-2 leading-tight px-2">
                    {item.chinese}
                  </h3>

                  {/* 缅甸语 */}
                  {item.burmese && (
                    <p className="text-[15px] text-blue-600 font-bold font-burmese mb-6 px-2">
                      {item.burmese}
                    </p>
                  )}

                  <div className="w-full flex justify-center items-center gap-8 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // 点击拼读时，立刻打断卡片原有的声音播放
                        playSessionRef.current += 1;
                        AudioEngine.stop();
                        setPlayingId(null);
                        setSpellingItem(item);
                      }}
                      className="text-slate-300 hover:text-blue-500 transition-all p-2"
                    >
                      <Sparkles size={22} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeech(item);
                      }}
                      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all ${
                        isRecording
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {isRecording ? <StopCircle size={24} /> : <Mic size={24} />}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFav(item.id);
                      }}
                      className={`transition-all p-2 ${
                        isFav
                          ? 'text-yellow-500'
                          : 'text-slate-300 hover:text-yellow-500'
                      }`}
                    >
                      <Star size={22} fill={isFav ? 'currentColor' : 'none'} />
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
                    className="bg-white mx-auto max-w-[360px] rounded-2xl mt-4 p-4 shadow-sm border border-slate-100"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-slate-400">发音评分</span>
                      <span
                        className={`text-sm font-black ${
                          speechResult.data.accuracy > 0.8 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {Math.round(speechResult.data.accuracy * 100)}%
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center">
                      {speechResult.data.comparison.map((r, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <span
                            className={`text-sm font-pinyin font-bold ${
                              r.isMatch ? 'text-slate-800' : 'text-red-500'
                            }`}
                          >
                            {r.userPy || '?'}
                          </span>
                          <span className="text-xs text-slate-400">{r.targetChar}</span>
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
              <div className="flex flex-col items-center gap-2 opacity-50">
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
        /* 针对缅文防截断优化：加大行高和底层内边距 */
        .font-burmese {
          font-family: 'Padauk', 'Myanmar Text', sans-serif;
          line-height: 2.2 !important;
          padding-bottom: 0.25em;
        }
      `}</style>
    </div>
  );
}
