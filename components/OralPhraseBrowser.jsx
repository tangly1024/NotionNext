'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mic, StopCircle, Sparkles, X, Volume2, Star, Play, Square,
  Zap, Lock, Settings2, ChevronLeft, CheckCircle2, Loader2, Heart, Crown
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
    pinyin: item?.pinyin || pinyin(String(chinese).replace(/[，。！？；：、,.!?;:]/g, ''), { toneType: 'symbol' }),
    audioZh: item?.audioZh || item?.zhAudio || '',
    audioMy: item?.audioMy || item?.myAudio || '',
    locked: !!item?.locked,
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
    result.push({ targetChar: cleanTarget[i] || '', targetPy: t, userPy: u, isMatch, isMissing: !u });
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
    const r = parseInt(rate, 10) || 0;
    const url = `/api/tts?t=${encodeURIComponent(text)}&v=${voice}&r=${r}`;
    return this.play(url);
  }
};

const RecorderEngine = {
  mediaRecorder: null, chunks: [],
  async start() {
    AudioEngine.stop();
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) return false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.chunks = [];
      this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
      this.mediaRecorder.start();
      return true;
    } catch (e) { 
      alert("请开启麦克风权限"); 
      return false; 
    }
  },
  stop() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) return resolve(null);
      this.mediaRecorder.onstop = () => {
        const url = URL.createObjectURL(new Blob(this.chunks, { type: 'audio/webm' }));
        this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
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
      alert("浏览器不支持语音识别"); 
      if(onError) onError(); 
      return; 
    }
    this.recognition = new SR();
    this.recognition.lang = 'zh-CN';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.onresult = (e) => onResult(e.results[0][0].transcript);
    this.recognition.onerror = () => { if(onError) onError(); };
    this.recognition.onend = () => { if(onError) onError(); };
    try { this.recognition.start(); } catch(e) { if(onError) onError(); }
  },
  stop() { if(this.recognition) this.recognition.stop(); }
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
      <button onClick={onClose}><X size={16} className="text-slate-400 hover:text-red-500"/></button>
    </div>
    <div className="p-5 space-y-5">
      {/* 中文设置 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700">中文朗读</span>
          <div onClick={() => setSettings(s => ({...s, zhEnabled: !s.zhEnabled}))} className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${settings.zhEnabled ? 'bg-blue-500' : 'bg-slate-200'}`}>
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${settings.zhEnabled ? 'left-[18px]' : 'left-[2px]'}`} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: '小晓 (女)', val: 'zh-CN-XiaoxiaoMultilingualNeural' },
            { label: '小辰 (男)', val: 'zh-CN-XiaochenMultilingualNeural' },
            { label: '云夏 (男童)', val: 'zh-CN-YunxiaNeural' },
            { label: '小颜 (通用)', val: 'zh-CN-XiaoyanNeural' }
          ].map(opt => (
            <button key={opt.val} onClick={() => setSettings(s => ({...s, zhVoice: opt.val}))} className={`py-1.5 text-[10px] font-bold rounded border transition-all truncate ${settings.zhVoice === opt.val ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-100 text-slate-400'}`}>
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] text-slate-400">语速</span>
          <input type="range" min="-50" max="50" step="10" value={settings.zhRate} onChange={e => setSettings(s => ({...s, zhRate: Number(e.target.value)}))} className="flex-1 h-1 bg-slate-100 rounded-lg appearance-none accent-blue-500"/>
          <span className="text-[10px] w-6 text-right font-mono text-slate-400">{settings.zhRate}</span>
        </div>
      </div>
      <div className="h-[1px] bg-slate-50"/>
      {/* 缅文设置 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700">缅文朗读</span>
          <div onClick={() => setSettings(s => ({...s, myEnabled: !s.myEnabled}))} className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${settings.myEnabled ? 'bg-green-500' : 'bg-slate-200'}`}>
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${settings.myEnabled ? 'left-[18px]' : 'left-[2px]'}`} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Thiha (男)', val: 'my-MM-ThihaNeural' },
            { label: 'Nilar (女)', val: 'my-MM-NilarNeural' }
          ].map(opt => (
            <button key={opt.val} onClick={() => setSettings(s => ({...s, myVoice: opt.val}))} className={`py-1.5 text-[10px] font-bold rounded border transition-all truncate ${settings.myVoice === opt.val ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-slate-100 text-slate-400'}`}>
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] text-slate-400">语速</span>
          <input type="range" min="-50" max="50" step="10" value={settings.myRate} onChange={e => setSettings(s => ({...s, myRate: Number(e.target.value)}))} className="flex-1 h-1 bg-slate-100 rounded-lg appearance-none accent-green-500"/>
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
      await new Promise(r => setTimeout(r, 200)); 
      if (!isMounted.current) return;
      for (let i = 0; i < chars.length; i++) {
        if (!isMounted.current) break;
        setActiveCharIndex(i);
        const py = pinyin(chars[i], { toneType: 'symbol' });
        await AudioEngine.playTTS(py, settings.zhVoice, settings.zhRate);
        await new Promise(r => setTimeout(r, 60)); 
      }
      if (isMounted.current) setActiveCharIndex(-1);
    };
    autoSpell();
    return () => { isMounted.current = false; AudioEngine.stop(); };
  }, [chars, settings]);

  const handleCharClick = async (index) => {
    setActiveCharIndex(index);
    const py = pinyin(chars[index], { toneType: 'symbol' });
    await AudioEngine.playTTS(py, settings.zhVoice, settings.zhRate);
    setActiveCharIndex(-1);
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
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center" onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden" />
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-slate-900 font-black text-lg">拼读练习</h3>
          <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-1 rounded font-bold animate-pulse">自动演示中...</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-10 px-2">
          {chars.map((char, i) => (
            <div key={i} onClick={() => handleCharClick(i)} className={`flex flex-col items-center p-2 rounded-xl transition-all cursor-pointer select-none ${activeCharIndex === i ? 'bg-blue-50 ring-2 ring-blue-500 scale-110 shadow-lg' : 'hover:bg-slate-50'}`}>
              <span className={`text-xs font-pinyin mb-1 ${activeCharIndex === i ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>{pinyin(char, {toneType:'symbol'})}</span>
              <span className={`text-3xl font-black ${activeCharIndex === i ? 'text-blue-800' : 'text-slate-800'}`}>{char}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-around items-center px-4 pb-4">
          <div onClick={playWhole} className="flex flex-col items-center gap-2 cursor-pointer"><Volume2 size={24}/> <span className="text-[10px]">整句</span></div>
          <div onClick={toggleRecord} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 ${recordState === 'recording' ? 'bg-red-500 border-red-100' : 'bg-slate-100'}`}>
             {recordState === 'recording' ? <Square size={24} className="text-white"/> : <Mic size={28}/>}
          </div>
          <div onClick={() => userAudio && AudioEngine.play(userAudio)} className={`flex flex-col items-center gap-2 ${userAudio ? '' : 'opacity-30'}`}><Play size={24}/> <span className="text-[10px]">回放</span></div>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// 4. 主组件 (支持 Props 传入)
// ============================================================================
export default function SpokenModulePro({
  phrases = [],
  title = '模块学习',
  categoryTitle = '口语分类',
  onBack,
  favoriteStorageKey = 'spoken_favs_default',
  settingsStorageKey = 'spoken_settings_default'
}) {
  const normalizedPhrases = useMemo(() => (phrases || []).map(normalizePhrase).filter((item) => item.chinese), [phrases]);

  const [favorites, setFavorites] = useState([]);
  const [isFavMode, setIsFavMode] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20); 
  const loaderRef = useRef(null); 
  
  const [showSettings, setShowSettings] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); 

  const [settings, setSettings] = useState({ 
    zhVoice: 'zh-CN-XiaoxiaoMultilingualNeural', zhRate: -20, zhEnabled: true, 
    myVoice: 'my-MM-ThihaNeural', myRate: 0, myEnabled: true 
  });

  const [playingId, setPlayingId] = useState(null);
  const [spellingItem, setSpellingItem] = useState(null);
  const [recordingId, setRecordingId] = useState(null); 
  const [speechResult, setSpeechResult] = useState(null); 
  const [showVip, setShowVip] = useState(false);
  
  const { scrollY } = useScroll();

  // 初始化读取本地缓存
  useEffect(() => {
    const savedSet = localStorage.getItem(settingsStorageKey);
    if (savedSet) setSettings(JSON.parse(savedSet));
    const savedFavs = localStorage.getItem(favoriteStorageKey);
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, [favoriteStorageKey, settingsStorageKey]);

  // 保存设置和收藏
  useEffect(() => { localStorage.setItem(settingsStorageKey, JSON.stringify(settings)); }, [settings, settingsStorageKey]);
  useEffect(() => { localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites)); }, [favorites, favoriteStorageKey]);

  // 滚动头部显隐
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    setIsHeaderVisible(!(latest > previous && latest > 50));
  });

  // 过滤收藏数据
  const displayPhrases = useMemo(() => {
    if (isFavMode) return normalizedPhrases.filter(p => favorites.includes(p.id));
    return normalizedPhrases;
  }, [normalizedPhrases, favorites, isFavMode]);

  // 触底加载更多
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
    if (isFavMode) {
      setIsFavMode(false);
    } else if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleCardPlay = async (item) => {
    if (playingId === item.id) { AudioEngine.stop(); setPlayingId(null); return; }
    setPlayingId(item.id);
    if (settings.zhEnabled) {
      if (item.audioZh) await AudioEngine.play(item.audioZh);
      else await AudioEngine.playTTS(item.chinese, settings.zhVoice, settings.zhRate);
    }
    if (AudioEngine.current === null && settings.zhEnabled) { setPlayingId(null); return; }
    
    if (settings.myEnabled && item.burmese) {
      if (settings.zhEnabled) await new Promise(r => setTimeout(r, 400));
      if (item.audioMy) await AudioEngine.play(item.audioMy);
      else await AudioEngine.playTTS(item.burmese, settings.myVoice, settings.myRate);
    }
    setPlayingId(null);
  };

  const handleSpeech = (item) => {
    if (recordingId === item.id) { SpeechEngine.stop(); setRecordingId(null); } else {
      AudioEngine.stop(); setRecordingId(item.id); setSpeechResult(null);
      SpeechEngine.start((transcript) => {
        const scoreData = getPinyinComparison(item.chinese, transcript);
        setSpeechResult({ id: item.id, data: scoreData });
        setRecordingId(null);
      }, () => setRecordingId(null));
    }
  };

  const toggleFav = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-slate-900 max-w-md mx-auto relative shadow-2xl overflow-x-hidden pb-32">
      
      {/* 顶部导航栏 */}
      <motion.div 
        animate={{ y: isHeaderVisible ? 0 : -80 }} 
        className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100 h-14 max-w-md mx-auto px-4 flex justify-between items-center"
      >
        <button onClick={handleBack} className="p-2 -ml-2 text-slate-500 hover:text-slate-900">
          <ChevronLeft size={24} />
        </button>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-sm font-black text-slate-800">{isFavMode ? '我的收藏' : title}</span>
          <span className="text-[10px] text-slate-400">{isFavMode ? '已收藏的内容' : categoryTitle}</span>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setIsFavMode(!isFavMode)} className={`p-2 transition-colors ${isFavMode ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`}>
            <Heart size={20} fill={isFavMode ? "currentColor" : "none"} />
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 text-slate-400 hover:text-blue-600">
            <Settings2 size={20} />
          </button>
        </div>
      </motion.div>

      {/* 设置弹窗 */}
      <AnimatePresence>
        {showSettings && (
          <>
            <div className="fixed inset-0 z-[1999]" onClick={() => setShowSettings(false)} />
            <SettingsPanel settings={settings} setSettings={setSettings} onClose={() => setShowSettings(false)} />
          </>
        )}
      </AnimatePresence>

      {/* 列表区域 */}
      <div className="pt-20 px-3 space-y-4">
        {/* 空状态 */}
        {displayPhrases.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-32 text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              {isFavMode ? <Heart size={32} className="text-slate-300" /> : <Loader2 size={32} className="animate-spin text-slate-300" />}
            </div>
            <p className="text-sm font-bold">{isFavMode ? '还没有收藏的句子' : '暂无数据'}</p>
          </div>
        )}

        {/* 卡片渲染 */}
        {displayPhrases.slice(0, visibleCount).map((item) => {
          const isLocked = item.locked;

          return (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div 
                className={`relative bg-white pt-10 pb-4 px-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all max-w-[360px] mx-auto overflow-visible mt-6
                ${playingId === item.id ? 'ring-2 ring-blue-500 bg-blue-50/10' : ''}
                ${isLocked ? 'cursor-pointer' : 'active:scale-[0.98] cursor-pointer'}`}
                onClick={() => isLocked ? setShowVip(true) : handleCardPlay(item)}
              >
                {/* 锁定蒙层 */}
                {isLocked && (
                  <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] rounded-[1.5rem] flex flex-col items-center justify-center">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg mb-2"><Lock size={18}/></div>
                    <span className="text-[10px] font-bold text-slate-900 px-2 py-0.5 border border-slate-900 rounded-full">VIP 点击解锁</span>
                  </div>
                )}
                
                {/* 谐音徽章 */}
                {(item.xieyin || item.note) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center pointer-events-none">
                    <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black border border-amber-100 shadow-sm flex items-center gap-1 whitespace-nowrap">
                      <Zap size={10} className="fill-amber-500 text-amber-500"/> {item.xieyin || item.note}
                    </div>
                  </div>
                )}

                <div className={isLocked ? 'opacity-30 blur-sm pointer-events-none w-full' : 'w-full'}>
                  <div className="text-[13px] text-slate-400 font-pinyin mb-1.5">{item.pinyin}</div>
                  <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">{item.chinese}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-4">{item.burmese}</p>

                  <div className="w-full flex justify-center items-center gap-5 pt-3 border-t border-slate-50">
                    <button onClick={(e) => { e.stopPropagation(); setSpellingItem(item); }} className="w-9 h-9 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-500"><Sparkles size={16}/></button>
                    <button onClick={(e) => { e.stopPropagation(); handleSpeech(item); }} className={`w-12 h-12 -mt-4 rounded-full flex items-center justify-center shadow-md border-4 border-white ${recordingId === item.id ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                      {recordingId === item.id ? <StopCircle size={20}/> : <Mic size={20}/>}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toggleFav(item.id); }} className={`w-9 h-9 rounded-full flex items-center justify-center ${favorites.includes(item.id) ? 'bg-yellow-50 text-yellow-500' : 'bg-slate-50 text-slate-300'}`}><Star size={16} fill={favorites.includes(item.id) ? "currentColor" : "none"}/></button>
                  </div>
                </div>
              </div>
              
              {/* 评分结果 */}
              <AnimatePresence>
                {speechResult?.id === item.id && !isLocked && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="bg-white mx-auto max-w-[360px] rounded-xl mt-2 p-3 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-slate-400">发音评分</span>
                      <span className={`text-xs font-black ${speechResult.data.accuracy > 0.8 ? 'text-green-500' : 'text-red-500'}`}>{Math.round(speechResult.data.accuracy * 100)}%</span>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {speechResult.data.comparison.map((r, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <span className={`text-xs font-pinyin font-bold ${r.isMatch ? 'text-slate-800' : 'text-red-500'}`}>{r.userPy || '?'}</span>
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
        
        {/* 底部加载指示器 */}
        {displayPhrases.length > 0 && (
          <div ref={loaderRef} className="py-10 text-center text-slate-400">
            {visibleCount < displayPhrases.length ? (
              <div className="flex items-center justify-center gap-2 text-xs font-bold animate-pulse">
                <Loader2 className="animate-spin" size={16}/> 加载中...
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 opacity-50">
                <div className="w-12 h-1 bg-slate-200 rounded-full"/>
                <span className="text-[10px]">到底了 (共 {displayPhrases.length} 句)</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 弹窗区域 */}
      <AnimatePresence>
        {spellingItem && <SpellingModal item={spellingItem} settings={settings} onClose={() => setSpellingItem(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showVip && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
            <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="relative bg-white rounded-[2rem] p-8 w-full max-w-xs text-center shadow-2xl">
              <button onClick={() => setShowVip(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"><X size={20}/></button>
              <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 text-white shadow-lg"><Crown size={32}/></div>
              <h3 className="text-xl font-black text-slate-900 mb-2">解锁完整课程</h3>
              <p className="text-xs text-slate-500 mb-6">升级后可使用全部功能</p>
              <a href="https://m.me/61575187883357" target="_blank" rel="noreferrer" className="block w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                联系老师激活
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .font-pinyin { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
      `}</style>
    </div>
  );
}
