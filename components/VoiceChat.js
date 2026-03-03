'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

// =========================
// Global Styles
// =========================
const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

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

// =========================
// 强化后的教学提示词（任务驱动，不聊闲天）
// =========================
const DEFAULT_PROMPT = `
你是“Pingo”，缅甸人学中文口语教练。风格：毒舌+幽默+高压训练，但不做人身攻击。
【绝对规则】
1) 不是闲聊机器人。每轮必须围绕口语训练，不评价用户闲聊内容本身。
2) 每轮最多3句，短句口语化。
3) 输出语言：学习句(目标句/纠正句)用中文；其他说明一律缅文。
4) 每轮必须包含：纠错结论 + 下一句目标句(Target Sentence)。
5) 若ASR有错：不通过，要求重读同一句；若正确：升级下一句（难度+一点点）。
6) 每轮至少1个情绪标签：[laughs] [sigh] [sneer] [angry] [surprised] [clapping]
7) 优先场景教学：问候、课堂、点餐、问路、购物、请假、打车。

【输出模板（严格）】
句1: [情绪] 缅文反馈（毒舌但不侮辱）
句2: 缅文纠错 + 错: "..." -> 对: "中文正确句"
句3: Target Sentence: "中文目标句" | Meaning(MY): "缅文释义" | 缅文动作指令
`;

const DEFAULT_SETTINGS = {
  apiUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o',
  temperature: 0.7,
  systemPrompt: DEFAULT_PROMPT,

  ttsApiUrl: 'https://t.leftsite.cn/tts',
  ttsVoice: 'zh-CN-XiaochenMultilingualNeural',
  ttsSpeed: -18, // 你这个接口的 r 参数
  showText: true,

  // 自动连续对话
  autoConversation: true,
  autoRestartAsr: true,
  asrSilenceMs: 1200, // 说话停顿多长时间提交
  antiEchoCooldownMs: 700, // TTS结束后等待多久再开ASR，防回声
};

// =========================
// TTS Queue (低间隔、连贯播放)
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
    this.onAllEnded = null;

    // 预取：减少句间空隙
    this.prefetching = false;
    this.prefetchAudio = null;
    this.prefetchToken = null;
  }

  setSettingsRef(ref) { this.settingsRef = ref; }
  setStateCallback(cb) { this.onStateChange = cb; }
  setAllEndedCallback(cb) { this.onAllEnded = cb; }

  unlockAudio() {
    if (this.audioUnlocked) return;
    try {
      const a = new Audio('data:audio/mp3;base64,//MkxAAQAAAAgAAAAAAAAAAAAAAP//AwAAAAAAAAAAAAA=');
      a.play().then(() => { this.audioUnlocked = true; }).catch(() => {});
    } catch {}
  }

  emitState() {
    this.onStateChange?.({
      isPlaying: this.isPlaying,
      queueLength: this.queue.length,
    });
  }

  detectVoice(text, fallback) {
    if (/[\u1000-\u109F]/.test(text)) return 'my-MM-NilarNeural';
    if (/[a-zA-Z]/.test(text) && !/[\u4e00-\u9fa5]/.test(text)) return 'en-US-JennyNeural';
    return fallback || 'zh-CN-XiaoxiaoNeural';
  }

  buildUrl(text) {
    const s = this.settingsRef || {};
    const voice = this.detectVoice(text, s.ttsVoice);
    const rate = s.ttsSpeed ?? 0;
    const baseUrl = s.ttsApiUrl || 'https://t.leftsite.cn/tts';
    return `${baseUrl}?t=${encodeURIComponent(text)}&v=${encodeURIComponent(voice)}&r=${encodeURIComponent(rate)}`;
  }

  push(text) {
    const t = (text || '').trim();
    if (!t) return;
    this.queue.push(t);
    this.emitState();
    this.playNext();
    this.prefetchNext();
  }

  prefetchNext() {
    if (this.prefetching || this.prefetchAudio || this.queue.length === 0) return;
    const nextText = this.queue[0];
    this.prefetching = true;
    const token = this.playToken;
    const audio = new Audio(this.buildUrl(nextText));
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    const done = () => {
      if (token !== this.playToken) return;
      this.prefetchAudio = audio;
      this.prefetchToken = token;
      this.prefetching = false;
    };
    audio.oncanplaythrough = done;
    audio.onerror = () => { this.prefetching = false; };
    audio.load();
  }

  playNext() {
    if (this.isPlaying) return;
    if (this.queue.length === 0) {
      this.emitState();
      this.onAllEnded?.();
      return;
    }

    this.isPlaying = true;
    this.emitState();
    const token = this.playToken;
    const text = this.queue.shift();

    let audio = null;
    const expectUrl = this.buildUrl(text);
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

    audio.onended = () => {
      if (token !== this.playToken) return;
      this.currentAudio = null;
      this.isPlaying = false;
      this.emitState();
      this.prefetchNext();
      this.playNext();
    };

    audio.onerror = () => {
      if (token !== this.playToken) return;
      this.currentAudio = null;
      this.isPlaying = false;
      this.emitState();
      this.prefetchNext();
      this.playNext();
    };

    audio.play().catch(() => {
      if (token !== this.playToken) return;
      this.currentAudio = null;
      this.isPlaying = false;
      this.emitState();
      this.playNext();
    });

    this.prefetchNext();
  }

  stopCurrent() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.removeAttribute('src');
      this.currentAudio.load();
      this.currentAudio = null;
    }
  }

  stopAndClear() {
    this.playToken++;
    this.queue = [];
    this.prefetchAudio = null;
    this.prefetchToken = null;
    this.prefetching = false;
    this.stopCurrent();
    this.isPlaying = false;
    this.emitState();
  }
}

const ttsEngine = new ExternalTTSQueue();

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
  const [showApiKey, setShowApiKey] = useState(false);

  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const scrollRef = useRef(null);
  const longPressTimer = useRef(null);
  const silenceTimerRef = useRef(null);
  const recordingFinalRef = useRef('');

  // auto conv 状态
  const autoLoopRef = useRef(true);
  const blockAsrUntilRef = useRef(0); // anti-echo 冷却截止时间
  const lastAiSpeakEndedAtRef = useRef(0);
  const isManualStoppingRef = useRef(false);

  useEffect(() => {
    const s = localStorage.getItem('ai_tutor_settings_v4');
    if (s) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });

    ttsEngine.setStateCallback(({ isPlaying }) => setIsAiSpeaking(isPlaying));
    ttsEngine.setAllEndedCallback(() => {
      lastAiSpeakEndedAtRef.current = Date.now();
      blockAsrUntilRef.current = Date.now() + (settings.antiEchoCooldownMs || 700);

      // autoConversation：AI播报结束后自动开始识别
      if (settings.autoConversation && !textMode) {
        safeAutoStartRecording();
      }
    });

    return () => {
      stopEverything(true);
      ttsEngine.setStateCallback(null);
      ttsEngine.setAllEndedCallback(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    ttsEngine.setSettingsRef(settings);
    localStorage.setItem('ai_tutor_settings_v4', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 30);
  };

  const stopEverything = (hard = false) => {
    isManualStoppingRef.current = true;
    autoLoopRef.current = !hard && settings.autoConversation;

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

    setTimeout(() => { isManualStoppingRef.current = false; }, 80);
  };

  const safeAutoStartRecording = () => {
    if (!settings.autoConversation) return;
    if (isAiSpeaking) return;
    if (recognitionRef.current) return;
    if (Date.now() < blockAsrUntilRef.current) {
      const wait = blockAsrUntilRef.current - Date.now() + 20;
      setTimeout(() => {
        if (settings.autoConversation && !recognitionRef.current && !isAiSpeaking) startRecording(true);
      }, wait);
      return;
    }
    startRecording(true);
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

    // 用户说话后：停止录音，打断上一个AI输出
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

            const { sentences, rest } = splitSpeakable(sentenceBuffer);
            if (sentences.length) {
              for (const s of sentences) ttsEngine.push(s);
              sentenceBuffer = rest;
            }
          } catch {}
        }
      }

      if (sentenceBuffer.trim()) ttsEngine.push(sentenceBuffer.trim());

      setHistory((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m)));
    } catch (e) {
      if (e.name !== 'AbortError') {
        setHistory((prev) => [...prev, { id: nowId(), role: 'error', text: e.message }]);
      }
    }
  };

  // ===== ASR =====
  const startRecording = (fromAuto = false) => {
    ttsEngine.unlockAudio();
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      if (!fromAuto) alert('当前浏览器不支持语音识别');
      return;
    }

    if (isAiSpeaking) return; // AI说话时禁用ASR
    if (Date.now() < blockAsrUntilRef.current) return; // anti-echo 冷却期
    if (recognitionRef.current) return;

    // 避免自动模式误触发后立刻被本地回放捕捉
    if (fromAuto && Date.now() - lastAiSpeakEndedAtRef.current < (settings.antiEchoCooldownMs || 700)) return;

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
      silenceTimerRef.current = setTimeout(() => manualSubmitRecording(), settings.asrSilenceMs || 1200);
    };

    rec.onerror = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    rec.onend = () => {
      setIsRecording(false);
      recognitionRef.current =（说禁 if settings       rAiSpeakingisRef        !.is      set =>Auto(),140      }
    };

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
    else if (settings.autoConversation && !textMode) safeAutoStartRecording();
  };

  const clearRecordingBuffer = () => {
    recordingFinalRef.current = '';
    setRecordFinalText('');
    setLiveInterim('');
  };

  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    longPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(45);
      setShowLangPicker(true);
      longPressTimer.current = null;
    }, 600);
  };

  const handlePointerUp = (e) => {
    e.preventDefault();
    if (!longPressTimer.current) return;
    clearTimeout(longPressTimer.current);
    longPressTimer.current = null;

    if (isRecording) manualSubmitRecording();
    else startRecording(false);
  };

  const pasteApiKey = async () => {
    try {
      const t = await navigator.clipboard.readText();
      if (t) setSettings((s) => ({ ...s, apiKey: t.trim() }));
    } catch {
      alert('剪贴板读取失败，请手动粘贴');
    }
  };

  if (!isOpen) return null;

  const currentLangObj = RECOGNITION_LANGS.find((l) => l.code === recLang) || RECOGNITION_LANGS[0];
  const liveText = useMemo(() => [recordFinalText, liveInterim].filter(Boolean).join(' '), [recordFinalText, liveInterim]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col w-full h-[100dvh] bg-slate-950 text-slate-100 overflow-hidden">
      <GlobalStyles />

      <div
        className="absolute inset-0 bg-cover bg-center opacity-68"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/48 to-slate-950/82" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,.16),transparent_35%),radial-gradient(circle_at_80%_25%,rgba(99,102,241,.16),transparent_35%)]" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4 h-16 border-b border-white/10 backdrop-blur-sm">
        <button
          onClick={() => { stopEverything(true); onClose?.(); }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-90"
        >
          <i className="fas fa-arrow-left" />
        </button>
        <div className="font-bold tracking-widest text-white text-sm">AI TUTOR</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSettings((s) => ({ ...s, showText: !s.showText }))}
            className={`w-10 h-10 flex items-center justify-center rounded-full ${settings.showText ? 'bg-pink-500/45' : 'bg-white/15'}`}
            title="字幕开关"
          >
            <i className={`fas ${settings.showText ? 'fa-closed-captioning' : 'fa-comment-slash'}`} />
          </button>
          <button
            onClick={() => setSettings((s) => ({ ...s, autoConversation: !s.autoConversation }))}
            className={`px-3 h-10 rounded-full text-xs font-bold ${settings.autoConversation ? 'bg-emerald-500/70' : 'bg-white/15'}`}
            title="自动连续对话"
          >
            AUTO
          </button>
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white">
            <i className="fas fa-sliders-h" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative p-4 pb-36 flex flex-col z-10">
        {(!settings.showText && !textMode) ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-56 h-56">
              {isAiSpeaking && <div className="absolute inset-0 rounded-full bg-pink-400/30 animate-ping-slow" />}
              {isAiSpeaking && <div className="absolute inset-6 rounded-full bg-violet-400/30 animate-ping-slow" style={{ animationDelay: '.4s' }} />}
              <div className={`relative z-10 flex items-center justify-center w-32 h-32 rounded-full transition-all ${isAiSpeaking ? 'scale-110 bg-pink-500 shadow-[0_0_30px_rgba(236,72,153,.6)]' : 'bg-white/10'}`}>
                <i className={`fas fa-microphone-alt text-5xl ${isAiSpeaking ? 'text-white' : 'text-slate-300'}`} />
              </div>
            </div>
            <div className="mt-8 h-10 flex items-center justify-center">
              {isAiSpeaking ? (
                <div className="tts-bars"><span /><span /><span /><span /><span /></div>
              ) : (
                <span className="text-sm tracking-widest text-slate-300">
                  {isRecording ? '正在倾听...' : settings.autoConversation ? '自动对话待命' : '安静待机中'}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto min-h-full flex flex-col justify-end">
            {history.map((msg) => (
              <div key={msg.id} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] p-3.5 text-[15px] leading-relaxed ${
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

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-[max(24px,env(safe-area-inset-bottom))] px-5 bg-gradient-to-t from-slate-950 via-slate-950/92 to-transparent pt-12">
        <div className="max-w-md mx-auto relative flex items-center justify-center">
          <button onClick={() => setTextMode((v) => !v)} className="absolute left-0 w-12 h-12 rounded-full bg-white/15 text-white">
            <i className={`fas ${textMode ? 'fa-microphone' : 'fa-keyboard'}`} />
          </button>

          {!textMode ? (
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-4">
                {isRecording && (
                  <button onClick={clearRecordingBuffer} className="h-11 w-14 rounded-full bg-white/15 text-white text-xs font-bold">
                    清空
                  </button>
                )}

                <button
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`select-none touch-manipulation w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all ${
                    isRecording ? 'bg-red-500 animate-pulse-ring scale-95' : 'bg-gradient-to-r from-pink-500 to-rose-500'
                  }`}
                >
                  <i className={`fas ${isRecording ? 'fa-paper-plane' : 'fa-microphone'} text-3xl`} />
                </button>

                {isRecording && (
                  <button onClick={stopRecordingOnly} className="h-11 w-14 rounded-full bg-white/15 text-white text-xs font-bold">
                    取消
                  </button>
                )}
              </div>

              <div className="text-[10px] font-bold text-slate-300 mt-4 tracking-widest uppercase">
                {isRecording
                  ? '点击发送 · 或静默自动发送'
                  : `长按切换语言 · ${currentLangObj.flag} ${currentLangObj.name}`}
              </div>
            </div>
          ) : (
            <div className="flex-1 ml-16 relative flex items-center bg-white/15 border border-white/20 rounded-full p-1 backdrop-blur-md">
              <input
                type="text"
                className="flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder-slate-300"
                placeholder="打字回复..."
                value={inputText}
                onFocus={() => stopEverything(false)}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage(inputText);
                    setInputText('');
                  }
                }}
              />
              <button onClick={() => { sendMessage(inputText); setInputText(''); }} className="w-10 h-10 rounded-full bg-pink-500 text-white">
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          )}

          {(isAiSpeaking || isRecording) && !textMode && (
            <button onClick={() => stopEverything(false)} className="absolute right-0 w-12 h-12 rounded-full bg-white/15 text-white" title="全部停止">
              <i className="fas fa-ban" />
            </button>
          )}
        </div>
      </div>

      {/* Lang picker */}
      {showLangPicker && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLangPicker(false)} />
          <div className="relative bg-slate-800 border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-lg mb-4 text-center text-white">选择识别语言</h3>
            <div className="grid grid-cols-2 gap-3">
              {RECOGNITION_LANGS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setRecLang(lang.code); setShowLangPicker(false); }}
                  className={`p-4 rounded-2xl border flex flex-col gap-2 ${recLang === lang.code ? 'border-pink-500 bg-pink-500/20' : 'border-white/10 bg-white/5'}`}
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
          <div className="relative bg-slate-800 border border-white/10 rounded-3xl w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl">
            <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-white">⚙️ AI 设置</h3>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full bg-white/10 text-slate-300">
                <i className="fas fa-times" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar text-slate-200 text-sm">
              <div className="space-y-3">
                <div className="font-bold text-slate-400 text-xs">API 配置</div>
                <input className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" placeholder="API URL" value={settings.apiUrl} onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })} />
                <div className="flex gap-2">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    autoComplete="off"
                    className="flex-1 border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none"
                    placeholder="API Key"
                    value={settings.apiKey}
                    onPaste={(e) => {
                      e.preventDefault();
                      const t = e.clipboardData?.getData('text') || '';
                      setSettings((s) => ({ ...s, apiKey: t.trim() }));
                    }}
                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  />
                  <button onClick={pasteApiKey} className="px-3 rounded-xl bg-white/10">粘贴</button>
                  <button onClick={() => setShowApiKey((v) => !v)} className="px-3 rounded-xl bg-white/10">{showApiKey ? '隐藏' : '显示'}</button>
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
                <input className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" placeholder="Voice" value={settings.ttsVoice} onChange={(e) => setSettings({ ...settings, ttsVoice: e.target.value })} />
                <div>
                  <label className="text-xs text-slate-400 block mb-1">语速: {settings.ttsSpeed}</label>
                  <input type="range" min="-50" max="50" step="1" className="w-full accent-pink-500" value={settings.ttsSpeed} onChange={(e) => setSettings({ ...settings, ttsSpeed: parseInt(e.target.value, 10) })} />
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-4">
                <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/10">
                  <span>显示字幕</span>
                  <input type="checkbox" className="w-5 h-5 accent-pink-500" checked={settings.showText} onChange={(e) => setSettings({ ...settings, showText: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/10">
                  <span>自动连续对话</span>
                  <input type="checkbox" className="w-5 h-5 accent-pink-500" checked={settings.autoConversation} onChange={(e) => setSettings({ ...settings, autoConversation: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/10">
                  <span>ASR 自动重启</span>
                  <input type="checkbox" className="w-5 h-5 accent-pink-500" checked={settings.autoRestartAsr} onChange={(e) => setSettings({ ...settings, autoRestartAsr: e.target.checked })} />
                </label>
                <div className="p-3 bg-slate-900/50 rounded-xl border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">静音提交阈值: {settings.asrSilenceMs}ms</div>
                  <input type="range" min="600" max="2500" step="100" className="w-full accent-pink-500" value={settings.asrSilenceMs} onChange={(e) => setSettings({ ...settings, asrSilenceMs: parseInt(e.target.value, 10) })} />
                </div>
                <div className="p-3 bg-slate-900/50 rounded-xl border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">防回声冷却: {settings.antiEchoCooldownMs}ms</div>
                  <input type="range" min="300" max="1500" step="50" className="w-full accent-pink-500" value={settings.antiEchoCooldownMs} onChange={(e) => setSettings({ ...settings, antiEchoCooldownMs: parseInt(e.target.value, 10) })} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
