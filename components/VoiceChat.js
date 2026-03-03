'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

// =================================================================================
// Global Styles
// =================================================================================
const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes ping-slow {
      75%, 100% { transform: scale(2); opacity: 0; }
    }
    .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* AI 说话时的五根音轨动画 */
    @keyframes bars {
      0%,100% { transform: scaleY(.35); opacity:.45; }
      50% { transform: scaleY(1); opacity:1; }
    }
    .tts-bars span {
      display:inline-block; width:4px; height:22px; border-radius:4px;
      background: linear-gradient(180deg,#f9a8d4,#a78bfa);
      margin:0 2px; transform-origin: bottom;
      animation: bars 0.8s ease-in-out infinite;
    }
    .tts-bars span:nth-child(2){ animation-delay:.08s; }
    .tts-bars span:nth-child(3){ animation-delay:.16s; }
    .tts-bars span:nth-child(4){ animation-delay:.24s; }
    .tts-bars span:nth-child(5){ animation-delay:.32s; }
  `}</style>
);

const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// 识别语言列表
const RECOGNITION_LANGS = [
  { code: 'zh-CN', name: '中文 (普通话)', flag: '🇨🇳' },
  { code: 'my-MM', name: 'မြန်မာ (缅语)', flag: '🇲🇲' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
];

// 极品毒舌私教 Prompt
const DEFAULT_PROMPT = `你是Pingo，一个极其毒舌、嘴碎但专业负责的中文口语私教。你的学生母语是缅甸语。
规则：
1. 绝对不要长篇大论解释语法，必须是短促的对话形式！每次回复不超过3句话。
2. 练习句用中文，嘲讽和反馈用缅文（以引起学生注意）。
3. 如果学生发音或语法有错，第一句话必须是无情的嘲讽（用缅文），然后再给出正确的读法并要求重读。
4. 必须输出为 JSON 格式，不要包含任何 markdown 标记（如 \`\`\`json ）。

返回格式必须严格为：
{
  "reply": "你直接对学生说的话（中文+缅文的组合）",
  "score": 0到100的整数评分（如果有发音语法错误就给低分，全对给90以上）,
  "tips": ["纠音提示1", "纠音提示2"] // 如果全对则数组为空
}`;

const DEFAULT_SETTINGS = {
  apiUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o',
  temperature: 0.7,
  systemPrompt: DEFAULT_PROMPT,
  ttsApiUrl: '/api/tts',
  ttsVoice: 'zh-CN-XiaoxiaoMultilingualNeural',
  ttsSpeed: 1.05,
  showText: true,
};

// =================================================================================
// IndexedDB 缓存 (基于你提供的代码)
// =================================================================================
const DB_NAME = 'LessonCacheDB';
const STORE_NAME = 'tts_audio';

const idb = {
  db: null,
  async init() {
    if (typeof window === 'undefined' || this.db) return;
    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve();
      };
      request.onerror = () => resolve();
    });
  },
  async get(key) {
    await this.init();
    if (!this.db) return null;
    return new Promise((resolve) => {
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  },
  async set(key, blob) {
    await this.init();
    if (!this.db) return;
    const tx = this.db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(blob, key);
  }
};

const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

// =================================================================================
// 音频控制器 (基于你提供的代码，加入事件回调支持 VoiceChat 状态更新)
// =================================================================================
const audioController = {
  currentAudio: null,
  latestRequestId: 0,
  activeUrls: [],
  onStateChange: null,

  setStateCallback(cb) {
    this.onStateChange = cb;
  },

  emit(isPlaying) {
    this.onStateChange?.(isPlaying);
  },

  stop() {
    this.latestRequestId++;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.activeUrls.forEach((url) => URL.revokeObjectURL(url));
    this.activeUrls = [];
    this.emit(false);
  },

  async playMixed(text, settings = {}, onStart, onEnd) {
    this.stop();
    if (!text?.trim()) return;

    const reqId = this.latestRequestId;
    onStart?.();
    this.emit(true);

    // 中英缅切分正则
    const regex = /([\u4e00-\u9fa5]+|[\u1000-\u109F\s]+|[a-zA-Z0-9\s]+|[^\s])/g;
    const segments = text.match(regex) || [text];

    try {
      const audios = [];
      for (const segRaw of segments) {
        const seg = (segRaw || '').trim();
        if (!seg) continue;
        if (reqId !== this.latestRequestId) return;

        const isMy = /[\u1000-\u109F]/.test(seg);
        const voice = isMy ? 'my-MM-ThihaNeural' : (settings.ttsVoice || 'zh-CN-XiaoxiaoMultilingualNeural');
        const rate = settings.ttsSpeed || 1.0;
        const api = settings.ttsApiUrl || '/api/tts';
        const cacheKey = `${voice}-${rate}-${seg}`;

        let blob = await idb.get(cacheKey);
        if (!blob) {
          const res = await fetchWithTimeout(`${api}?t=${encodeURIComponent(seg)}&v=${voice}&rate=${rate}`);
          if (!res.ok) throw new Error(`TTS HTTP ${res.status}`);
          blob = await res.blob();
          await idb.set(cacheKey, blob);
        }

        const url = URL.createObjectURL(blob);
        this.activeUrls.push(url);
        const audio = new Audio(url);
        audios.push(audio);
      }

      const playNext = (i) => {
        if (reqId !== this.latestRequestId) return;
        if (i >= audios.length) {
          this.emit(false);
          onEnd?.();
          return;
        }
        this.currentAudio = audios[i];
        this.currentAudio.onended = () => playNext(i + 1);
        this.currentAudio.onerror = () => playNext(i + 1);
        this.currentAudio.play().catch(() => playNext(i + 1));
      };

      playNext(0);
    } catch (e) {
      console.warn('[TTS] playMixed failed:', e);
      this.emit(false);
      onEnd?.();
    }
  }
};


// =================================================================================
// 主组件 VoiceChat
// =================================================================================
export default function VoiceChat({ isOpen, onClose }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [recLang, setRecLang] = useState('zh-CN');
  const [history, setHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [inputText, setInputText] = useState('');

  const [showSettings, setShowSettings] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const [liveInterim, setLiveInterim] = useState('');
  const [recordFinalText, setRecordFinalText] = useState('');
  const [scoreData, setScoreData] = useState(null); // { score: 85, tips: [] }

  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const scrollRef = useRef(null);
  const longPressTimer = useRef(null);
  const silenceTimerRef = useRef(null);
  const recordingFinalRef = useRef('');

  useEffect(() => {
    if (!isOpen) return;
    
    // 初始化本地设置
    const s = localStorage.getItem('ai_tutor_settings_v3');
    if (s) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });
      } catch (e) { console.error(e); }
    }

    // 绑定 TTS 状态回调
    audioController.setStateCallback((isPlaying) => {
      setIsAiSpeaking(isPlaying);
    });

    return () => {
      stopEverything();
      audioController.setStateCallback(null);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    localStorage.setItem('ai_tutor_settings_v3', JSON.stringify(settings));
  }, [settings, isOpen]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  const stopEverything = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    recordingFinalRef.current = '';
    setLiveInterim('');
    setRecordFinalText('');
    setIsRecording(false);
    audioController.stop();
    if (abortControllerRef.current) abortControllerRef.current.abort();
  };

  // 发送消息到 OpenAI
  const sendMessage = async (text) => {
    const content = (text || '').trim();
    if (!content) return;

    if (!settings.apiKey) {
      alert('⚠️ 请先点击右上角齿轮，配置您的 API Key。');
      setShowSettings(true);
      return;
    }

    stopEverything();
    setScoreData(null); // 清空上次打分

    const aiMsgId = nowId();
    // 过滤掉报错信息，避免污染上下文
    const cleanHistory = history.filter(h => h.role !== 'error');
    const newHistory = [...cleanHistory, { id: nowId(), role: 'user', text: content }];
    
    setHistory([...newHistory, { id: aiMsgId, role: 'ai', text: '', isStreaming: true }]);
    scrollToBottom();

    abortControllerRef.current = new AbortController();

    try {
      const messages = [
        { role: 'system', content: settings.systemPrompt },
        ...newHistory.map((h) => ({
          role: h.role === 'ai' ? 'assistant' : 'user',
          content: h.text,
        })),
      ];

      const res = await fetch(`${settings.apiUrl.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.apiKey}`,
        },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          model: settings.model,
          temperature: settings.temperature,
          messages,
          // 强制输出 JSON
          response_format: { type: "json_object" } 
        }),
      });

      if (!res.ok) throw new Error(`API 请求失败: ${res.status}`);

      const data = await res.json();
      const rawJsonString = data.choices[0].message.content || '{}';
      
      let parsed = {};
      try {
        parsed = JSON.parse(rawJsonString);
      } catch (err) {
        parsed = { reply: rawJsonString }; // 兼容解析失败
      }

      const replyText = parsed.reply || '...';
      const score = parsed.score;
      const tips = parsed.tips || [];

      // 更新历史记录和分数板
      setHistory((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, text: replyText, isStreaming: false } : m)));
      if (score !== undefined) {
        setScoreData({ score, tips });
      }
      scrollToBottom();

      // 播放语音
      audioController.playMixed(replyText, settings);

    } catch (e) {
      if (e.name !== 'AbortError') {
        setHistory((prev) => prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m));
        // Error 只展示，不进入历史记录数组
        setHistory((prev) => [...prev, { id: nowId(), role: 'error', text: `连接出错: ${e.message}` }]);
        scrollToBottom();
      }
    }
  };

  // ===== 语音识别逻辑 =====
  const startRecording = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('您的浏览器不支持语音识别，请使用文本输入或更换 Chrome 浏览器。');
      return;
    }

    stopEverything(); // 打断当前播放的语音

    const rec = new SpeechRec();
    rec.lang = recLang;
    rec.interimResults = true;
    rec.continuous = true;
    rec.maxAlternatives = 1;

    recordingFinalRef.current = '';
    setRecordFinalText('');
    setLiveInterim('');
    setIsRecording(true);

    // 震动反馈
    if (navigator.vibrate) navigator.vibrate(50);

    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0]?.transcript || '';
        if (e.results[i].isFinal) {
          recordingFinalRef.current += `${t} `;
        } else {
          interim += t;
        }
      }

      setRecordFinalText(recordingFinalRef.current.trim());
      setLiveInterim(interim.trim());

      // 停顿 2 秒自动提交
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => manualSubmitRecording(), 2000);
    };

    rec.onerror = () => { setIsRecording(false); recognitionRef.current = null; };
    rec.onend = () => { setIsRecording(false); recognitionRef.current = null; };

    recognitionRef.current = rec;
    rec.start();
  };

  const stopRecordingOnly = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setIsRecording(false);
  };

  const manualSubmitRecording = () => {
    const finalText = `${recordingFinalRef.current} ${liveInterim}`.trim();
    stopRecordingOnly();
    setLiveInterim('');
    setRecordFinalText('');
    recordingFinalRef.current = '';
    if (finalText) sendMessage(finalText);
  };

  const clearRecordingBuffer = () => {
    recordingFinalRef.current = '';
    setRecordFinalText('');
    setLiveInterim('');
    if (navigator.vibrate) navigator.vibrate(30);
  };

  // 长按语言切换
  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    longPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate([50, 50]); // 双震动提示
      setShowLangPicker(true);
      longPressTimer.current = null;
    }, 600);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      if (isRecording) stopRecordingOnly();
      else startRecording();
    }
  };

  if (!isOpen) return null;
  const currentLangObj = RECOGNITION_LANGS.find((l) => l.code === recLang) || RECOGNITION_LANGS[0];
  const liveText = useMemo(() => [recordFinalText, liveInterim].filter(Boolean).join(' '), [recordFinalText, liveInterim]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col w-full h-[100dvh] bg-slate-950 text-slate-100 overflow-hidden">
      <GlobalStyles />

      {/* 背景光影效果 */}
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-950/95" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,.1),transparent_40%),radial-gradient(circle_at_80%_25%,rgba(99,102,241,.1),transparent_40%)]" />

      {/* 顶部 Header */}
      <div className="relative z-20 flex items-center justify-between px-4 h-16 border-b border-white/10 backdrop-blur-sm">
        <button onClick={() => { stopEverything(); onClose?.(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-90">
          <i className="fas fa-arrow-left" />
        </button>
        <div className="font-black tracking-widest text-white text-sm bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
          PINGO TUTOR
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSettings((s) => ({ ...s, showText: !s.showText }))} className={`w-10 h-10 flex items-center justify-center rounded-full active:scale-90 ${settings.showText ? 'bg-pink-500 text-white' : 'bg-white/15 text-white'}`}>
            <i className={`fas ${settings.showText ? 'fa-closed-captioning' : 'fa-comment-slash'}`} />
          </button>
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-90">
            <i className="fas fa-cog" />
          </button>
        </div>
      </div>

      {/* 打分提示板 (当有分数时下拉展示) */}
      <div className={`relative z-30 mx-4 mt-2 transition-all duration-500 overflow-hidden rounded-2xl ${scoreData ? 'max-h-60 opacity-100 border border-white/20 shadow-lg' : 'max-h-0 opacity-0 border-none'}`}>
        {scoreData && (
          <div className="bg-white/10 backdrop-blur-md p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="font-bold text-slate-300 text-sm">发音与语法评分</span>
              <span className={`text-2xl font-black ${scoreData.score >= 90 ? 'text-green-400' : scoreData.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {scoreData.score} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </span>
            </div>
            {scoreData.tips?.length > 0 && (
              <ul className="text-sm text-pink-200 list-disc pl-4 space-y-1 mt-1">
                {scoreData.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* 聊天内容区 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative p-4 pb-40 flex flex-col z-10">
        {(!settings.showText && !textMode) ? (
          // 无字幕沉浸模式
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-60 h-60">
              {isAiSpeaking && <div className="absolute inset-0 rounded-full bg-pink-400/20 animate-ping-slow" />}
              {isAiSpeaking && <div className="absolute inset-6 rounded-full bg-indigo-400/20 animate-ping-slow" style={{ animationDelay: '0.45s' }} />}
              <div className={`relative z-10 flex items-center justify-center w-32 h-32 rounded-full transition-all duration-300 ${isAiSpeaking ? 'scale-110 bg-gradient-to-br from-pink-500 to-indigo-500 shadow-[0_0_30px_rgba(236,72,153,0.5)]' : 'bg-white/10 border border-white/5'}`}>
                <i className={`fas fa-robot text-5xl ${isAiSpeaking ? 'text-white' : 'text-slate-400'}`} />
              </div>
            </div>

            <div className="mt-10 h-10 flex items-center justify-center">
              {isAiSpeaking ? (
                <div className="tts-bars"><span /><span /><span /><span /><span /></div>
              ) : (
                <span className={`text-sm tracking-widest font-bold ${isRecording ? 'text-red-400 animate-pulse' : 'text-slate-500'}`}>
                  {isRecording ? '🔴 正在倾听您的发音...' : '安静待机中'}
                </span>
              )}
            </div>
          </div>
        ) : (
          // 气泡聊天模式
          <div className="w-full max-w-2xl mx-auto min-h-full flex flex-col justify-end">
            {history.map((msg) => (
              <div key={msg.id} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] p-3.5 text-[15px] leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl rounded-tr-sm'
                    : msg.role === 'error'
                    ? 'bg-red-500/20 text-red-200 border border-red-500/30 rounded-2xl text-sm'
                    : 'bg-white/10 backdrop-blur-md text-slate-100 rounded-2xl rounded-tl-sm border border-white/10'
                }`}>
                  {msg.text}
                  {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-pink-400 animate-pulse" />}
                </div>
              </div>
            ))}

            {isRecording && (
              <div className="flex justify-center mb-2 mt-4">
                <div className="max-w-[92%] bg-red-500/20 border border-red-500/30 text-red-100 rounded-xl px-4 py-3 text-sm animate-[fadeIn_.2s_ease-out] shadow-lg">
                  <div className="flex items-center gap-2 mb-1 opacity-80 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> 正在识别 ({currentLangObj.name})
                  </div>
                  <div className="text-[15px]">{liveText || '...'}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部输入与录音控制 */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-[max(24px,env(safe-area-inset-bottom))] px-5 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-12">
        <div className="max-w-md mx-auto relative flex items-center justify-center">
          
          <button onClick={() => setTextMode((v) => !v)} className="absolute left-0 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-95 transition-colors hover:bg-white/20">
            <i className={`fas ${textMode ? 'fa-microphone' : 'fa-keyboard'}`} />
          </button>

          {!textMode ? (
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-4">
                <button
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
                    isRecording ? 'bg-red-500 scale-95 ring-4 ring-red-500/40' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95'
                  }`}
                >
                  <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'} text-3xl`} />
                </button>

                {isRecording && (
                  <div className="flex flex-col gap-2">
                    <button onClick={manualSubmitRecording} className="h-9 px-4 rounded-xl bg-emerald-500 text-white font-bold text-sm active:scale-95 shadow-lg">提交发送</button>
                    <button onClick={clearRecordingBuffer} className="h-9 px-4 rounded-xl bg-white/20 text-white font-bold text-sm active:scale-95">清空重录</button>
                  </div>
                )}
              </div>
              <div className="text-[10px] font-bold text-slate-400 mt-4 tracking-widest uppercase">
                长按麦克风切换语言 · {currentLangObj.flag} {currentLangObj.name}
              </div>
            </div>
          ) : (
            <div className="flex-1 ml-16 relative flex items-center bg-white/10 border border-white/20 rounded-full p-1 backdrop-blur-md">
              <input
                type="text"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder-slate-400"
                placeholder="在此输入文本回复..."
                value={inputText}
                onFocus={stopEverything}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { sendMessage(inputText); setInputText(''); } }}
              />
              <button onClick={() => { sendMessage(inputText); setInputText(''); }} className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0 active:scale-90 transition-transform">
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          )}

          {(isAiSpeaking || isRecording) && !textMode && (
            <button onClick={stopEverything} className="absolute right-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 border border-red-500/30 active:scale-95" title="全部打断">
              <i className="fas fa-ban text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* 语言选择弹窗 */}
      {showLangPicker && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowLangPicker(false)} />
          <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-[fadeIn_.2s_ease-out]">
            <h3 className="font-bold text-lg mb-4 text-center text-white">选择您的母语</h3>
            <div className="grid grid-cols-1 gap-3">
              {RECOGNITION_LANGS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setRecLang(lang.code); setShowLangPicker(false); if(navigator.vibrate) navigator.vibrate(20); }}
                  className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${recLang === lang.code ? 'border-pink-500 bg-pink-500/20' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                >
                  <span className="text-3xl">{lang.flag}</span>
                  <span className="font-bold text-sm text-slate-200">{lang.name}</span>
                  {recLang === lang.code && <i className="fas fa-check text-pink-500 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 设置弹窗 */}
      {showSettings && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl text-sm animate-[fadeIn_.2s_ease-out]">
            <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-3xl">
              <h3 className="font-bold text-white text-base">⚙️ 教练参数配置</h3>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full bg-white/10 text-slate-300 hover:bg-white/20">
                <i className="fas fa-times" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar text-slate-200">
              <div className="space-y-3">
                <div className="font-bold text-slate-400 text-xs uppercase tracking-wider">大模型 API 设定</div>
                <input className="w-full border border-white/10 rounded-xl px-3 py-2.5 bg-black/30 outline-none focus:border-pink-500 transition-colors" placeholder="API URL" value={settings.apiUrl} onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })} />
                <div className="flex gap-2">
                  <input type={showApiKey ? 'text' : 'password'} className="flex-1 border border-white/10 rounded-xl px-3 py-2.5 bg-black/30 outline-none focus:border-pink-500 transition-colors" placeholder="长按此框粘贴 API Key" value={settings.apiKey} onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })} 
                    onPaste={async () => { try { const t = await navigator.clipboard.readText(); if (t) setSettings((s) => ({ ...s, apiKey: t.trim() })); } catch {} }} 
                  />
                  <button onClick={() => setShowApiKey((v) => !v)} className="w-12 rounded-xl bg-white/10 text-white"><i className={`fas fa-${showApiKey ? 'eye-slash' : 'eye'}`} /></button>
                </div>
                <div className="text-[10px] text-pink-400 opacity-80 mt-1">⚠️ 秘钥仅保存在您的浏览器本地。为防 XSS 攻击，请勿在陌生网吧使用。</div>
                <div className="flex gap-2">
                  <input className="flex-1 border border-white/10 rounded-xl px-3 py-2.5 bg-black/30 outline-none" placeholder="Model (如 gpt-4o)" value={settings.model} onChange={(e) => setSettings({ ...settings, model: e.target.value })} />
                  <div className="w-24 flex items-center border border-white/10 rounded-xl px-3 bg-black/30">
                    <span className="text-xs text-slate-500 mr-2">T</span>
                    <input type="number" step="0.1" className="w-full bg-transparent outline-none" value={settings.temperature} onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value || '0.7') })} />
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-white/10 pt-5">
                <div className="font-bold text-slate-400 text-xs uppercase tracking-wider">语音朗读 (TTS) 设定</div>
                <input className="w-full border border-white/10 rounded-xl px-3 py-2.5 bg-black/30 outline-none" placeholder="TTS 接口路径 (如 /api/tts)" value={settings.ttsApiUrl} onChange={(e) => setSettings({ ...settings, ttsApiUrl: e.target.value })} />
                
                <div className="relative">
                  <select className="w-full border border-white/10 rounded-xl px-3 py-2.5 bg-black/30 outline-none text-white appearance-none cursor-pointer" value={settings.ttsVoice} onChange={(e) => setSettings({ ...settings, ttsVoice: e.target.value })}>
                    <option value="zh-CN-XiaoxiaoMultilingualNeural">晓晓 多语言 (高情商温柔女声)</option>
                    <option value="zh-CN-XiaochenMultilingualNeural">晓辰 多语言 (阳光磁性男声)</option>
                    <option value="zh-CN-YunxiNeural">云希 (活泼播音男声)</option>
                    <option value="zh-CN-XiaoxiaoNeural">晓晓 (标准央视女声)</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-4 top-3.5 text-slate-500 pointer-events-none" />
                </div>

                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <label className="flex justify-between text-xs text-slate-300 font-bold mb-3">
                    <span>语速倍率</span>
                    <span className="text-pink-400">{settings.ttsSpeed}x</span>
                  </label>
                  <input type="range" min="0.7" max="1.5" step="0.05" className="w-full accent-pink-500" value={settings.ttsSpeed} onChange={(e) => setSettings({ ...settings, ttsSpeed: parseFloat(e.target.value) })} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
