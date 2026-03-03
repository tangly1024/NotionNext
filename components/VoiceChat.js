'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

// =========================
// 全局样式 (防长按选中和防菜单弹出)
// =========================
const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    .app-container {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
    .selectable {
      -webkit-user-select: text;
      user-select: text;
    }

    @keyframes ping-slow {
      75%, 100% { transform: scale(2); opacity: 0; }
    }
    .animate-ping-slow { animation: ping-slow 1.6s cubic-bezier(0,0,0.2,1) infinite; }

    @keyframes pulse-ring {
      0% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(239, 68, 68, .65); }
      70% { transform: scale(1); box-shadow: 0 0 0 22px rgba(239, 68, 68, 0); }
      100% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .animate-pulse-ring { animation: pulse-ring 1.3s infinite; }

    @keyframes bars {
      0%,100% { transform: scaleY(.35); opacity:.45; }
      50% { transform: scaleY(1); opacity:1; }
    }
    .tts-bars span {
      display:inline-block; width:4px; height:20px; border-radius:4px;
      background: linear-gradient(180deg,#f9a8d4,#a78bfa);
      margin:0 2px; transform-origin: bottom;
      animation: bars 0.55s ease-in-out infinite;
    }
    .tts-bars span:nth-child(2){ animation-delay:.06s; }
    .tts-bars span:nth-child(3){ animation-delay:.12s; }
    .tts-bars span:nth-child(4){ animation-delay:.18s; }
    .tts-bars span:nth-child(5){ animation-delay:.24s; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);

const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const RECOGNITION_LANGS = [
  { code: 'zh-CN', name: '中文 (普通话)', flag: '🇨🇳' },
  { code: 'my-MM', name: 'မြန်မာ (缅语)', flag: '🇲🇲' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
];

const TTS_VOICES = [
  { id: 'zh-CN-XiaoxiaoMultilingualNeural', name: '晓晓多语言 (女-推荐)' },
  { id: 'zh-CN-XiaochenMultilingualNeural', name: '晓辰多语言 (男-推荐)' },
  { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓 (女-标准)' },
  { id: 'zh-CN-YunxiNeural', name: '云希 (男-阳光)' },
  { id: 'zh-CN-YunjianNeural', name: '云健 (男-影视)' },
  { id: 'zh-CN-XiaoyiNeural', name: '晓伊 (女-亲切)' },
];

const DEFAULT_PROMPT = `
你是“Pingo”，缅甸人学中文口语教练。风格：毒舌+幽默+高压训练，但不做人身攻击。
【绝对规则】
1) 不是闲聊机器人。每轮必须围绕口语训练，不评价用户闲聊内容本身。
2) 每轮最多3句，短句口语化。
3) 输出语言：学习句(目标句/纠正句)用中文；其他说明一律缅文。
4) 若ASR有错：要求重读同一句；若正确：升级下一句。
5) 优先场景教学：问候、课堂、点餐、问路、购物、请假、打车。

【输出模板（严格）】
[情绪标签]。缅文毒舌反馈。
缅文纠错说明。错："..." -> 对："中文正确句"。
Target Sentence: "中文目标句"。Meaning(MY): "缅文释义"。
`;

const DEFAULT_SETTINGS = {
  apiUrl: 'https://api.mistral.ai/v1',
  apiKey: 'xLnM3QMeVS1XoIG9LcdJUmzYLExYLvAq',
  model: 'mistral-large-2512',
  temperature: 0.7,
  systemPrompt: DEFAULT_PROMPT,
  ttsApiUrl: 'https://t.leftsite.cn/tts',
  ttsVoice: 'zh-CN-XiaoxiaoMultilingualNeural',
  ttsSpeed: -18,
  ttsPitch: 0,
  showText: true,
  asrSilenceMs: 1500,
};

// =========================
// 智能语言分离算法 (Smart Splitter)
// =========================
// 解决标点符号被误判为"other"导致音频碎裂的问题。
// 数字和标点会自动依附于当前的语言区间。
const splitMixedLanguage = (text) => {
  const segments = [];
  let currentLang = null;
  let currentBuffer = '';

  for (let char of text) {
    let type = 'neutral';
    if (/[\u4e00-\u9fa5]/.test(char)) type = 'zh';
    else if (/[\u1000-\u109F]/.test(char)) type = 'my';
    else if (/[a-zA-Z]/.test(char)) type = 'en';

    if (type !== 'neutral') {
      if (currentLang !== type && currentLang !== null) {
        // 语种发生切换，将旧的缓冲推入数组
        segments.push({ text: currentBuffer, lang: currentLang });
        currentBuffer = char;
        currentLang = type;
      } else {
        currentLang = type;
        currentBuffer += char;
      }
    } else {
      // 遇到标点、数字、空格等中性字符，直接依附在当前语言区内
      currentBuffer += char;
    }
  }
  
  if (currentBuffer.trim()) {
    segments.push({ text: currentBuffer, lang: currentLang || 'zh' }); // 默认给 zh
  }
  return segments;
};

// =========================
// 强大的预加载 TTS 引擎
// =========================
class ExternalTTSQueue {
  constructor() {
    this.queue = [];
    this.isPlaying = false;
    this.currentAudio = null;
    this.playToken = 0;
    this.settingsRef = null;
    this.onStateChange = null;
    this.audioUnlocked = false;
    
    // 预加载相关
    this.prefetching = false;
    this.prefetchAudio = null;
    this.prefetchToken = null;
  }

  setSettingsRef(ref) { this.settingsRef = ref; }
  setStateCallback(cb) { this.onStateChange = cb; }

  unlockAudio() {
    if (this.audioUnlocked) return;
    try {
      const a = new Audio('data:audio/mp3;base64,//MkxAAQAAAAgAAAAAAAAAAAAAAP//AwAAAAAAAAAAAAA=');
      a.play().then(() => { this.audioUnlocked = true; }).catch(() => {});
    } catch {}
  }

  emitState() {
    this.onStateChange?.({ isPlaying: this.isPlaying });
  }

  // 去除情绪标签和Emoji，防止读出来
  sanitizeText(text) {
    return text
      .replace(/\[.*?\]/g, '') 
      .replace(/\(.*?\)/g, '') 
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '') 
      .trim();
  }

  // 严格根据片段的语言匹配对应的专属发音人
  getVoiceForLang(lang) {
    const s = this.settingsRef || {};
    if (lang === 'my') return 'my-MM-NilarNeural'; // 缅文专属发音人
    if (lang === 'en') return 'en-US-JennyNeural'; // 英文专属发音人
    return s.ttsVoice || 'zh-CN-XiaoxiaoMultilingualNeural'; // 用户设置的中文发音人
  }

  buildUrl(text, voice) {
    const s = this.settingsRef || {};
    const rate = s.ttsSpeed ?? 0;
    const pitch = s.ttsPitch ?? 0;
    const baseUrl = s.ttsApiUrl || 'https://t.leftsite.cn/tts';
    return `${baseUrl}?t=${encodeURIComponent(text)}&v=${encodeURIComponent(voice)}&r=${encodeURIComponent(rate)}&p=${encodeURIComponent(pitch)}`;
  }

  // 接收文本，先按语言分割，再推入队列
  push(text) {
    const cleanRawText = this.sanitizeText(text || '');
    if (!cleanRawText) return;

    // 智能分割中缅英文
    const segments = splitMixedLanguage(cleanRawText);
    
    for (const seg of segments) {
      const cleanSegText = seg.text.trim();
      if (!cleanSegText) continue;
      
      const voice = this.getVoiceForLang(seg.lang);
      this.queue.push({ text: cleanSegText, voice: voice });
    }

    this.emitState();
    this.playNext();
    this.prefetchNext();
  }

  prefetchNext() {
    if (this.prefetching || this.prefetchAudio || this.queue.length === 0) return;
    
    const nextItem = this.queue[0];
    this.prefetching = true;
    const token = this.playToken;
    const audio = new Audio(this.buildUrl(nextItem.text, nextItem.voice));
    
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    audio.oncanplaythrough = () => {
      if (token !== this.playToken) return;
      this.prefetchAudio = audio;
      this.prefetchToken = token;
      this.prefetching = false;
    };
    audio.onerror = () => { this.prefetching = false; };
    audio.load();
  }

  playNext() {
    if (this.isPlaying) return;
    if (this.queue.length === 0) {
      this.emitState();
      return;
    }

    this.isPlaying = true;
    this.emitState();
    const token = this.playToken;
    const item = this.queue.shift();

    let audio = null;
    const expectUrl = this.buildUrl(item.text, item.voice);
    
    // 如果预加载命中了，直接用
    if (this.prefetchAudio && this.prefetchToken === token && this.prefetchAudio.src === expectUrl) {
      audio = this.prefetchAudio;
      this.prefetchAudio = null;
      this.prefetchToken = null;
    } else {
      audio = new Audio(expectUrl);
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
    }

    this.currentAudio = audio;

    const onEndOrError = () => {
      if (token !== this.playToken) return;
      this.currentAudio = null;
      this.isPlaying = false;
      this.emitState();
      this.prefetchNext(); // 立刻预取下一个
      this.playNext();    // 播放下一个
    };

    audio.onended = onEndOrError;
    audio.onerror = onEndOrError;
    audio.play().catch(onEndOrError);

    this.prefetchNext();
  }

  stopAndClear() {
    this.playToken++;
    this.queue = [];
    
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.removeAttribute('src');
      this.currentAudio.load();
      this.currentAudio = null;
    }
    
    if (this.prefetchAudio) {
      this.prefetchAudio.pause();
      this.prefetchAudio.removeAttribute('src');
      this.prefetchAudio.load();
      this.prefetchAudio = null;
    }

    this.prefetching = false;
    this.prefetchToken = null;
    this.isPlaying = false;
    this.emitState();
  }
}

const ttsEngine = new ExternalTTSQueue();

// 简单的句号断句，用于把 LLM 的流式输出截断成完整句子
const splitSpeakable = (buf) => {
  const out = [];
  let last = 0;
  for (let i = 0; i < buf.length; i++) {
    if (/[。！？.!?\n]/.test(buf[i])) {
      const s = buf.slice(last, i + 1).trim();
      if (s) out.push(s);
      last = i + 1;
    }
  }
  return { sentences: out, rest: buf.slice(last) };
};

// =========================
// 主组件
// =========================
export default function VoiceChat({ isOpen, onClose }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [recLang, setRecLang] = useState('my-MM');
  const [history, setHistory] = useState([]);
  const historyRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [inputText, setInputText] = useState('');
  const [liveInterim, setLiveInterim] = useState('');
  const [recordFinalText, setRecordFinalText] = useState('');

  const [showSettings, setShowSettings] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const scrollRef = useRef(null);
  const pressTimerRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const recordingFinalRef = useRef('');

  useEffect(() => {
    const s = localStorage.getItem('ai_tutor_settings_v6');
    if (s) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });

    ttsEngine.setStateCallback(({ isPlaying }) => setIsAiSpeaking(isPlaying));

    return () => {
      stopEverything();
      ttsEngine.setStateCallback(null);
    };
  }, []);

  useEffect(() => {
    ttsEngine.setSettingsRef(settings);
    localStorage.setItem('ai_tutor_settings_v6', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 40);
  };

  const stopEverything = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.onend = null; recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    recordingFinalRef.current = '';
    setLiveInterim('');
    setRecordFinalText('');
    setIsRecording(false);

    ttsEngine.stopAndClear();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsAiSpeaking(false);
  };

  const sendMessage = async (text) => {
    const content = (text || '').trim();
    if (!content) return;

    ttsEngine.unlockAudio();

    if (!settings.apiKey) {
      alert('请先配置 API Key');
      setShowSettings(true);
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
      setIsRecording(false);
    }

    ttsEngine.stopAndClear();
    if (abortControllerRef.current) abortControllerRef.current.abort();

    const aiMsgId = nowId();
    const newHistory = [...historyRef.current, { id: nowId(), role: 'user', text: content }];
    setHistory([...newHistory, { id: aiMsgId, role: 'ai', text: '', isStreaming: true }]);
    scrollToBottom();

    abortControllerRef.current = new AbortController();

    try {
      const messages = [
        { role: 'system', content: settings.systemPrompt },
        ...newHistory.map((h) => ({ role: h.role === 'ai' ? 'assistant' : 'user', content: h.text })),
      ];

      const res = await fetch(`${settings.apiUrl.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.apiKey}` },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          model: settings.model,
          temperature: settings.temperature,
          stream: true,
          messages,
        }),
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let raw = '';
      let fullText = '';
      let sentenceBuffer = '';

      while (true) {
        if (abortControllerRef.current?.signal.aborted) break; 

        const { done, value } = await reader.read();
        if (done) break;

        raw += decoder.decode(value, { stream: true });
        const parts = raw.split('\n');
        raw = parts.pop() || '';

        for (const line of parts) {
          const ln = line.trim();
          if (!ln.startsWith('data:')) continue;
          const payload = ln.slice(5).trim();
          if (payload === '[DONE]') continue;

          try {
            const data = JSON.parse(payload);
            const chunk = data.choices?.[0]?.delta?.content || '';
            if (!chunk) continue;

            fullText += chunk;
            sentenceBuffer += chunk;

            setHistory((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, text: fullText } : m)));
            scrollToBottom();

            // 流式断句推给 TTS，TTS内部会自动做多语言分割
            const { sentences, rest } = splitSpeakable(sentenceBuffer);
            if (sentences.length) {
              for (const s of sentences) {
                if (!abortControllerRef.current?.signal.aborted) ttsEngine.push(s);
              }
              sentenceBuffer = rest;
            }
          } catch {}
        }
      }

      // 最后残留的短句
      if (sentenceBuffer.trim() && !abortControllerRef.current?.signal.aborted) {
        ttsEngine.push(sentenceBuffer.trim());
      }

      setHistory((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m)));
    } catch (e) {
      if (e.name !== 'AbortError') {
        setHistory((prev) => [...prev, { id: nowId(), role: 'error', text: e.message }]);
      }
    }
  };

  // ===== ASR 语音识别 =====
  const startRecording = () => {
    ttsEngine.unlockAudio();
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return alert('当前浏览器不支持语音识别');

    if (isAiSpeaking) {
      ttsEngine.stopAndClear(); 
    }
    if (recognitionRef.current) return;

    const rec = new SpeechRec();
    rec.lang = recLang;
    rec.interimResults = true;
    rec.continuous = true;
    rec.maxAlternatives = 1;

    recordingFinalRef.current = '';
    setRecordFinalText('');
    setLiveInterim('');
    setIsRecording(true);

    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0]?.transcript || '';
        if (e.results[i].isFinal) recordingFinalRef.current += `${t} `;
        else interim += t;
      }
      setRecordFinalText(recordingFinalRef.current.trim());
      setLiveInterim(interim.trim());

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => manualSubmitRecording(), settings.asrSilenceMs || 1500);
    };

    rec.onerror = () => { setIsRecording(false); recognitionRef.current = null; };
    rec.onend = () => { setIsRecording(false); recognitionRef.current = null; };

    recognitionRef.current = rec;
    if (navigator.vibrate) navigator.vibrate(30);
    try { rec.start(); } catch {}
  };

  const stopRecordingOnly = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setIsRecording(false);
  };

  const manualSubmitRecording = () => {
    const finalText = `${recordingFinalRef.current} ${liveInterim}`.trim();
    stopRecordingOnly();
    recordingFinalRef.current = '';
    setLiveInterim('');
    setRecordFinalText('');
    
    if (finalText) sendMessage(finalText);
  };

  const clearRecordingBuffer = () => {
    recordingFinalRef.current = '';
    setRecordFinalText('');
    setLiveInterim('');
  };

  // 纯净 Touch 事件：防误触、防系统菜单
  const handleTouchStart = () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    pressTimerRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(45);
      setShowLangPicker(true);
      pressTimerRef.current = null;
    }, 550);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
      if (isRecording) manualSubmitRecording();
      else startRecording();
    }
  };

  if (!isOpen) return null;

  const currentLangObj = RECOGNITION_LANGS.find((l) => l.code === recLang) || RECOGNITION_LANGS[0];
  const liveText = useMemo(() => [recordFinalText, liveInterim].filter(Boolean).join(' '), [recordFinalText, liveInterim]);

  return (
    <div className="app-container fixed inset-0 z-[200] flex flex-col w-full h-[100dvh] bg-slate-950 text-slate-100 overflow-hidden">
      <GlobalStyles />

      <div
        className="absolute inset-0 bg-cover bg-center opacity-68 pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/48 to-slate-950/82 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,.16),transparent_35%),radial-gradient(circle_at_80%_25%,rgba(99,102,241,.16),transparent_35%)]" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4 h-16 border-b border-white/10 backdrop-blur-sm">
        <button
          onClick={() => { stopEverything(); onClose?.(); }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-90"
        >
          <i className="fas fa-arrow-left" />
        </button>
        <div className="font-bold tracking-widest text-white text-sm">AI TUTOR</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white">
            <i className="fas fa-sliders-h" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div ref={scrollRef} className="selectable flex-1 overflow-y-auto no-scrollbar relative p-4 pb-36 flex flex-col z-10">
        {(!settings.showText && !textMode) ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-56 h-56 pointer-events-none">
              {isAiSpeaking && <div className="absolute inset-0 rounded-full bg-pink-400/30 animate-ping-slow" />}
              {isAiSpeaking && <div className="absolute inset-6 rounded-full bg-violet-400/30 animate-ping-slow" style={{ animationDelay: '.4s' }} />}
              <div className={`relative z-10 flex items-center justify-center w-32 h-32 rounded-full transition-all duration-300 ${isAiSpeaking ? 'scale-110 bg-pink-500 shadow-[0_0_30px_rgba(236,72,153,.6)]' : 'bg-white/10'}`}>
                <i className={`fas fa-microphone-alt text-5xl ${isAiSpeaking ? 'text-white' : 'text-slate-300'}`} />
              </div>
            </div>
            <div className="mt-8 h-10 flex items-center justify-center">
              {isAiSpeaking ? (
                <div className="tts-bars"><span /><span /><span /><span /><span /></div>
              ) : (
                <span className="text-sm tracking-widest text-slate-300 font-medium">
                  {isRecording ? '正在倾听...' : '请说话'}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto min-h-full flex flex-col justify-end">
            {history.map((msg) => (
              <div key={msg.id} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] p-3.5 text-[15px] leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl rounded-tr-sm'
                    : msg.role === 'error'
                    ? 'bg-red-500/20 text-red-100 border border-red-500/50 rounded-2xl'
                    : 'bg-white/15 backdrop-blur-md text-slate-100 rounded-2xl rounded-tl-sm border border-white/15'
                }`}>
                  {msg.text}
                  {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-pink-300 animate-pulse" />}
                </div>
              </div>
            ))}

            {isRecording && (
              <div className="flex justify-center mb-2">
                <div className="max-w-[92%] bg-cyan-500/20 border border-cyan-300/30 text-cyan-100 rounded-xl px-3 py-2 text-sm animate-[fadeIn_.2s_ease-out]">
                  <span className="opacity-80 mr-2">识别中：</span>
                  <span>{liveText || '...'}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Control */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-[max(24px,env(safe-area-inset-bottom))] px-5 bg-gradient-to-t from-slate-950 via-slate-950/92 to-transparent pt-12">
        <div className="max-w-md mx-auto relative flex items-center justify-center h-20">
          
          <button onClick={() => setTextMode((v) => !v)} className="absolute left-0 w-12 h-12 rounded-full bg-white/15 text-white active:scale-95 transition-transform">
            <i className={`fas ${textMode ? 'fa-microphone' : 'fa-keyboard'}`} />
          </button>

          {!textMode ? (
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-4">
                {isRecording ? (
                  <button onClick={clearRecordingBuffer} className="h-11 w-14 rounded-full bg-white/15 text-white text-xs font-bold animate-[fadeIn_.2s_ease-out]">
                    清空
                  </button>
                ) : <div className="w-14" />}

                <button
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={(e) => { e.preventDefault(); handleTouchStart(); }}
                  onMouseUp={(e) => { e.preventDefault(); handleTouchEnd(e); }}
                  className={`touch-none w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
                    isRecording ? 'bg-red-500 animate-pulse-ring scale-95' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95'
                  }`}
                >
                  <i className={`fas ${isRecording ? 'fa-paper-plane' : 'fa-microphone'} text-3xl ${isRecording ? 'animate-pulse' : ''}`} />
                </button>

                {isRecording ? (
                  <button onClick={stopRecordingOnly} className="h-11 w-14 rounded-full bg-white/15 text-white text-xs font-bold animate-[fadeIn_.2s_ease-out]">
                    取消
                  </button>
                ) : <div className="w-14" />}
              </div>

              <div className="absolute -bottom-6 text-[10px] font-bold text-slate-400 tracking-widest uppercase pointer-events-none">
                {isRecording
                  ? <span className="text-red-400">点击发送 · 静默自动发送</span>
                  : `长按切换语言 · ${currentLangObj.flag} ${currentLangObj.name}`}
              </div>
            </div>
          ) : (
            <div className="flex-1 ml-16 mr-16 relative flex items-center bg-white/15 border border-white/20 rounded-full p-1 backdrop-blur-md">
              <input
                type="text"
                className="flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder-slate-300"
                placeholder="打字回复..."
                value={inputText}
                onFocus={stopEverything}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage(inputText);
                    setInputText('');
                  }
                }}
              />
              <button onClick={() => { sendMessage(inputText); setInputText(''); }} className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0">
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          )}

          <div className="absolute right-0">
            {(isAiSpeaking || isRecording) ? (
              <button onClick={stopEverything} className="w-12 h-12 rounded-full bg-white/15 text-white animate-[fadeIn_.2s_ease-out]" title="全部停止">
                <i className="fas fa-stop" />
              </button>
            ) : (
              <button
                onClick={() => setSettings((s) => ({ ...s, showText: !s.showText }))}
                className={`w-12 h-12 rounded-full transition-colors ${settings.showText ? 'bg-pink-500/45 text-pink-100' : 'bg-white/15 text-white'}`}
                title="字幕开关"
              >
                <i className={`fas ${settings.showText ? 'fa-closed-captioning' : 'fa-comment-slash'}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lang picker */}
      {showLangPicker && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLangPicker(false)} />
          <div className="relative bg-slate-800 border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-[fadeIn_.2s_ease-out]">
            <h3 className="font-bold text-lg mb-4 text-center text-white">选择识别语言</h3>
            <div className="grid grid-cols-2 gap-3">
              {RECOGNITION_LANGS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setRecLang(lang.code); setShowLangPicker(false); }}
                  className={`p-4 rounded-2xl border flex flex-col gap-2 transition-colors ${recLang === lang.code ? 'border-pink-500 bg-pink-500/20' : 'border-white/10 bg-white/5 active:bg-white/10'}`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-bold text-xs text-slate-300">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      {showSettings && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative bg-slate-800 border border-white/10 rounded-3xl w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl animate-[fadeIn_.2s_ease-out]">
            <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-white">⚙️ AI 设置</h3>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full bg-white/10 text-slate-300">
                <i className="fas fa-times" />
              </button>
            </div>

            <div className="selectable flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar text-slate-200 text-sm">
              <div className="space-y-3">
                <div className="font-bold text-slate-400 text-xs">API 配置</div>
                <input className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" placeholder="API URL" value={settings.apiUrl} onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })} />
                <div className="flex gap-2">
                  <input
                    type="password"
                    autoComplete="off"
                    className="flex-1 border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none text-slate-400"
                    placeholder="API Key"
                    value={settings.apiKey}
                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <input className="flex-1 border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" placeholder="Model" value={settings.model} onChange={(e) => setSettings({ ...settings, model: e.target.value })} />
                  <div className="w-28 flex items-center border border-white/10 rounded-xl px-2 bg-slate-900/50">
                    <span className="text-xs text-slate-400 mr-1">Temp</span>
                    <input type="number" step="0.1" className="w-full bg-transparent outline-none" value={settings.temperature} onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value || '0.7') })} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-400 text-xs flex justify-between">
                  <span>系统提示词</span>
                  <button onClick={() => setSettings({ ...settings, systemPrompt: DEFAULT_PROMPT })} className="text-pink-400">重置</button>
                </div>
                <textarea rows={8} className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" value={settings.systemPrompt} onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })} />
              </div>

              <div className="space-y-4 border-t border-white/10 pt-4">
                <div className="font-bold text-slate-400 text-xs">TTS 发音配置</div>
                <input className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" placeholder="TTS API URL" value={settings.ttsApiUrl} onChange={(e) => setSettings({ ...settings, ttsApiUrl: e.target.value })} />
                
                <select 
                  className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none appearance-none"
                  value={settings.ttsVoice} 
                  onChange={(e) => setSettings({ ...settings, ttsVoice: e.target.value })}
                >
                  {TTS_VOICES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-slate-400 w-10">语速</label>
                    <input type="range" min="-50" max="50" step="1" className="flex-1 accent-pink-500" value={settings.ttsSpeed} onChange={(e) => setSettings({ ...settings, ttsSpeed: parseInt(e.target.value, 10) || 0 })} />
                    <input type="number" className="w-14 bg-slate-900/50 border border-white/10 rounded-md px-1 py-1 text-center text-xs outline-none" value={settings.ttsSpeed} onChange={(e) => setSettings({ ...settings, ttsSpeed: parseInt(e.target.value, 10) || 0 })} />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-slate-400 w-10">音调</label>
                    <input type="range" min="-50" max="50" step="1" className="flex-1 accent-pink-500" value={settings.ttsPitch} onChange={(e) => setSettings({ ...settings, ttsPitch: parseInt(e.target.value, 10) || 0 })} />
                    <input type="number" className="w-14 bg-slate-900/50 border border-white/10 rounded-md px-1 py-1 text-center text-xs outline-none" value={settings.ttsPitch} onChange={(e) => setSettings({ ...settings, ttsPitch: parseInt(e.target.value, 10) || 0 })} />
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-4 pb-4">
                <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/10">
                  <span>显示字幕</span>
                  <input type="checkbox" className="w-5 h-5 accent-pink-500" checked={settings.showText} onChange={(e) => setSettings({ ...settings, showText: e.target.checked })} />
                </label>
                
                <div className="p-3 bg-slate-900/50 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">麦克风静默提交时间</span>
                    <span className="text-xs text-slate-400">{settings.asrSilenceMs}ms</span>
                  </div>
                  <input type="range" min="600" max="3000" step="100" className="w-full accent-pink-500" value={settings.asrSilenceMs} onChange={(e) => setSettings({ ...settings, asrSilenceMs: parseInt(e.target.value, 10) })} />
                  <p className="text-[10px] text-slate-500 mt-1">控制你不说话多久后自动发送消息</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
