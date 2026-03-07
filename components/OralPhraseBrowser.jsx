'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mic,
  StopCircle,
  Sparkles,
  X,
  Volume2,
  Star,
  Play,
  Square,
  Zap,
  Settings2,
  ChevronLeft,
  Loader2,
  Heart
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
    locked: false,
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

  async start() {
    AudioEngine.stop();

    if (typeof navigator === 'undefined' || !navigator.mediaDevices) return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
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
        this.mediaTracks t resolve    {
 on ifundefined') return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
      alert('浏览器不支持语音识别');
      if (onError) onError();
      return;
    }

    this.recognition = new SR();
    this.recognition.lang = 'zh-CN';
    this.recognition.continuous = false;
    this.recognitionim false this.one on.results][cript thisognition ()     onError thisend => ()();
        ognition    {
 ()    },

() {
    if (this.recognition) this.recognition.stop();
  }
};

// ============================================================================
// 3. 子组件
// ============================================================================
const ToggleSwitch = ({ enabled, onClick, activeClass }) => (
  <div
    onClick={onClick}
    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
      enabled ? activeClass : 'bg-slate-200'
    }`}
  >
    <div
      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
        enabled ? 'left-[18px]' : 'left-[2px]'
      }`}
    />
  </div>
);

const SettingsPanel = ({ settings, setSettings, onClose }) => (
  <motion.div={{:0 y: -20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    className="fixed top-16 right-4 z-[2000] bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 w-80 overflow-hidden"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="bg-gradient-to-r from-slate-50 to-white px-4 py-3 flex justify-between items-center border-b border-slate-100">
      <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">播放设置</span>
      <button onClick={onClose}>
        <X size={16} className="text-slate-400 hover:text-red-500" />
      </button>
    </div>

    <div className="p-5 space-y-5">
      <div className="space-y-3 rounded-2xl bg-blue-50/50 border border-blue-100 p-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black text-slate-700">中文朗读</span          on,Class-blue-500"
          />
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
              className={`py-2 text-[10px] font-bold rounded-xl border transition-all truncate ${
                settings.zhVoice === opt.val
                  ? 'bg-white border-blue-300 text-blue-700 shadow-sm'
                  : 'bg-white/70 border-blue-100 text-slate-400'
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
 class-[ w-right-mono text-slate-500">{settings.zhRate}</span>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black text-slate-700">缅文朗读</span>
          <ToggleSwitch
            enabled={settings.myEnabled}
            onClick={() => setSettings((s) => ({ ...s, myEnabled: !s.myEnabled }))}
            activeClass="bg-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Thiha (男)', val: 'my-MM-ThihaNeural' },
            { label: 'Nilar (女)', val: 'my-MM-NilarNeural' }
          ].map((opt) => (
            <button
              key={opt.val}
              onClick={() => setSettings((s) => ({ ...s, myVoice: opt.val }))}
              className={`py-2 text-[10px] font-bold rounded-xl border transition-all truncate ${
                settings.myVoice === opt.val
                  ? 'bg-white border-emerald-300 text-emerald-700 shadow-sm'
                  : 'bg-white/70 border-emerald-100 text-slate-400'
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
            step10settings one =>, }late-none500span10 wlate-500">{settings.myRate}</span>
        </div>
PslClass    text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    slate: 'bg-slate-50 text-slate-600 border-slate-200'
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold ${
        toneClassMap[tone] || toneClassMap.slate
      }`}
    >
      {children}
    </div>
  );
};

const SpellingModal = ({ item, settings, onClose }) => {
  const [activeCharIndex,Char =(- record set =State');
 [ set] useState(null);
  const chars = iteminese Mounted(true use => is = Audio.stop const async {
 newrTimeout      Mounted return forlet  i.length i       Mounted breakActiveIndex        =(chars],:' await.play(pyVoice.zh        Promise)Timeout(r, 80));
      }

      if (isMounted.current) setActiveCharIndex(-1);
    };

    autoSpell();

    return () => {
      isMounted.current = false;
      AudioEngine.stop();
    };
  }, [item.chinese, settings.zhVoice, settings.zhRate]);

  const handleCharClick = async (index) => {
    setActiveCharIndex(index);
    const py = pinyin(chars[index], { toneType: 'symbol' });
    await AudioEngine.playTTS(py, settings.zhVoice, settings.zhRate);
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
      return;
    }

    AudioEngine.stop();
    const success = await RecorderEngine.start();
    if (success) setRecordState('recording');
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
          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">
            自动演示中
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10 px-2">
          {chars.map((char, i) => (
            <div
              key={`${char}-${i}`}
              onClick={() => handleCharClick(i)}
              className={`flex flex-col items-center min-w-[58px] p-3 rounded-2xl transition-all cursor-pointer select-none border ${
                activeCharIndex === i
                  ? 'bg-blue-50 border-blue-300 scale-110 shadow-lg'
                  : 'bg-white border-slate-100 hover:bg-slate-50'
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
            </ ))}
 <="-around items-center px-4 pb-4">
          <button
            onClick={playWhole}
            className="flex flex-col items-center gap-2 cursor-pointer text-slate-600 hover:text-blue-600"
          >
            <Volume2 size={24} />
            <span className="text-[10px] font-bold">整句</span>
          </button>

          <button
            onClick={toggleRecord}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 ${
              recordState === 'recording'
                ? 'bg-red-500 border text :late-white text-slate-700'
            }`}
          >
            {recordState === 'recording' ? <Square size={}Mic28 </ <            => &&(user            flex-center ${
Audio-s hoveremer'opacity-s'
`}
 <24 <="10">>
>
>
>
 ===========.,
  favoriteStorageKey = 'spoken_favs_default',
  settingsStorageKey = 'spoken_settings_default'
}) {
  const normalizedPhrases = useMemo(
    () => (phrases || []).map(normalizePhrase).filter((item) => item.chinese),
    [phrases]
  );

  const [favorites, setFavorites] = useState([]);
  const [isFavMode,Mode(falsevisibleVisibleCount] = useState(20);
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
    if (savedFavs) setFavorites(JSON.parse(savedFavs },Storage,Key ',   {
.filter   hrases, favorites, isFav use [ use observer)ing Math       Margin. );

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed,_#f8fafc_38%,_#eef2ff_100%)] text-slate-900 max-w-md mx-auto relative shadow-2xl overflow-x-hidden pb-32">
      <motion.div
        animate={{ y: isHeaderVisible ? 0 : -80 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-white/60 h-16 max-w-md mx-auto px-4 flex justify-between items-center"
      >
        <button onClick={handleBack} className="p-2 -ml-2 text-slate-500 hover:text-slate-900">
          <ChevronLeft size={24} />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-sm font-black text-slate-800">{isFavMode ? '我的收藏' : title}</span>
          <span className="text-[10px] text-slate-400">
            {isFavMode ? '已收藏内容' : categoryTitle}
          </span>
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
            <div className="fixed inset-0 z-[1999]" onClick={() => setShowSettings(false)} />
            <SettingsPanel
              settings={settings}
              setSettings={setSettings}
              onClose={() => setShowSettings(false)}
            />
          </>
        )}
      </AnimatePresence>

      <div className="pt-24 px-4 space-y-5">
        {displayPhrases.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-32 text-slate-400">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
              {isFavMode ? (
                <Heart size={32} className="text-slate-300"              (
Loader32="-s />
divptext-sm font-bold">{isFavMode ? '还没有收藏的句子' : '暂无数据'}</p>
          </div>
        )}

        {displayPhrases.slice(0, visibleCount).map((item) => {
          const isPlaying = playingId === item.id;
          const isRecording = recordingId === item.id;
          const isFav = favorites.includes(item.id);

          return (
            <motion.div
              key={item.id}
                    ? 'border-blue-300 bg-gradient-to-br from-blue-50 via-whiteyan :8090             divabsolute0 h-gradient-orange--s" classp                 =" justify3">
Name- <Name13-s font1-wide.p </h="26-black900                       inese3divbuttonClickFav                     -10 items border                                                bg-yellow-50 text-yellow-500 border-yellow-200'
                          : 'bg-white text-slate-300 border-slate-200 hover:text-yellow-500'
                      }`}
                    >
                      <Star size={16} fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.burmese && (
                      <InfoPill tone="emerald">
                        <span>缅语</span>
                        <span className="opacity-70">·</span>
                        <span>{item.burmese}</span>
                      </InfoPill>
                    )}

                    {(item.xieyin || item.note) && (
                      <InfoPill tone="amber">
                        <Zap size={12} className="fill-amber-500 text-amber-500" />
                        <span>谐音</span>
                        <span className="opacity-70">·</span>
                        <span>{item.xieyin || item.note}</span>
                      </InfoPill>
                    )}
="-">
                    <button
                      onClick={() => handleCardPlay(item)}
                      className={`h-12 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                        isPlaying
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      <Volume2 size={18} />
                      {isPlaying ? '播放中' : '跟读'}
                    </button>

                    <button
                      onClick={() => setSpellingItem(item)}
                      className="h-12 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm bg-sky-50 text-sky-700 border border-sky-100 hover:bg-sky-100 transition-all"
                    >
                      <Sparkles size={18} />
                      拼读
                    </button>

                    <button
                      onClick={() => handleSpeech(item)}
                      className={`h-12 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm border transition-all ${
                        isRecording
                          ? 'bg-red-50 text-red-600 :bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100'
                      }`}
                    >
                      {isRecording ? <StopCircle size={18} /> : <Mic size={18} />}
                      {isRecording ? '停止' : '评分'}
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {?.id === item.id && (
                  <                    0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/90 backdrop-blur-sm mx-auto rounded-[1.5rem] mt-3 p-4 shadow-sm border border-white/80"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-black text-slate-400 tracking-wide">
                        发音评分
                      </span>
                      <span
                        className={`text-sm font-black ${
                          speechResult.data.accuracy > 0.8 ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {Math.round(speechResult.data.accuracy * 100)}%
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {speechResult.data.comparison.map((r, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center px-2 py-1 rounded-xl bg-slate-50 min-w-[48px]"
                        >
                          <span
                            className={`text-xs font-pinyin font-bold ${
                              r.isMatch ? 'text-slate-800' : 'text-rose-500'
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
      `}</style>
    </div>
  );
}
