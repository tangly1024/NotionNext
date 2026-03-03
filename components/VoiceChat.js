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
    .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }

    @keyframes pulse-ring {
      0% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(239, 68, 68, .7); }
      70% { transform: scale(1); box-shadow: 0 0 0 25px rgba(239, 68, 68, 0); }
      100% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .animate-pulse-ring { animation: pulse-ring 1.5s infinite; }

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

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
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
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
];

const DEFAULT_PROMPT = `你是Pingo，一个毒舌、幽默、但专业负责的中文口语教练，服务缅甸母语者。
规则：练习句用中文，解释和反馈用缅文；回答要简短，每次最多1-3句，要自然流畅的地道口语，就像母语者，不能有机器味；有错绝不放水，先纠错再要求重读。`;

const DEFAULT_SETTINGS = {
  apiUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o',
  temperature: 0.8,
  systemPrompt: DEFAULT_PROMPT,
  ttsApiUrl: 'https://t.leftsite.cn/tts',
  ttsVoice: 'zh-CN-XiaochenMultilingualNeural',
  ttsSpeed: -30, 
  showText: true,
};

// =========================
// TTS Engine (改用原生 HTML5 Audio，解决 Howler 的格式兼容和跨域拦截问题)
// =========================
class ExternalTTSQueue {
  constructor() {
    this.queue = [];
    this.isPlaying = false;
    this.currentAudio = null;
    this.playToken = 0;
    this.settingsRef = null;
    this.onStateChange = null;
    this.audioUnlocked = false; // 用于记录是否已经解锁浏览器音频播放
  }

  setSettingsRef(ref) { this.settingsRef = ref; }
  setStateCallback(cb) { this.onStateChange = cb; }

  // 骗过浏览器 Autoplay 限制的神器
  unlockAudio() {
    if (this.audioUnlocked) return;
    try {
      const silentAudio = new Audio('data:audio/mp3;base64,//MkxAAQAAAAgAAAAAAAAAAAAAAP//AwAAAAAAAAAAAAA=');
      silentAudio.play().then(() => {
        this.audioUnlocked = true;
      }).catch(() => {});
    } catch (e) {}
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

  push(text) {
    const t = (text || '').trim();
    if (!t) return;
    this.queue.push(t);
    this.emitState();
    this.playNext();
  }

  playNext() {
    if (this.isPlaying || this.queue.length === 0) return;
    this.isPlaying = true;
    this.emitState();

    const token = this.playToken;
    const text = this.queue.shift();
    const s = this.settingsRef || {};

    const voice = this.detectVoice(text, s.ttsVoice);
    const rate = s.ttsSpeed ?? 0;
    const baseUrl = s.ttsApiUrl || 'https://t.leftsite.cn/tts';
    
    const ttsUrl = `${baseUrl}?t=${encodeURIComponent(text)}&v=${voice}&r=${rate}`;

    this.currentAudio = new Audio(ttsUrl);
    this.currentAudio.crossOrigin = 'anonymous'; // 解决潜在的跨域资源限制
    
    this.currentAudio.onplay = () => {
      if (token !== this.playToken) this.stopCurrent();
    };
    
    this.currentAudio.onended = () => {
      if (token !== this.playToken) return;
      this.currentAudio = null;
      this.isPlaying = false;
      this.emitState();
      this.playNext();
    };

    this.currentAudio.onerror = (e) => {
      console.error("TTS Audio Error:", e);
      if (token !== this.playToken) return;
      this.currentAudio = null;
      this.isPlaying = false;
      this.emitState();
      this.playNext();
    };

    // 播放并捕获因为 Autoplay 限制导致的报错
    this.currentAudio.play().catch((err) => {
      console.warn("Audio Playback Blocked by Browser:", err);
      if (token !== this.playToken) return;
      this.currentAudio = null;
      this.isPlaying = false;
      this.emitState();
      this.playNext();
    });
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
    // 增加对连续标点符号的兼容，避免截出空字符串
    if (/[。！？.!?\n]/.test(buf[i])) {
      out.push(buf.slice(last, i + 1));
      last = i + 1;
    }
  }
  return { sentences: out.filter(s => s.trim().length > 0), rest: buf.slice(last) };
};

export default function VoiceChat({ isOpen, onClose }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [recLang, setRecLang] = useState('my-MM');
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

  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const scrollRef = useRef(null);
  const longPressTimer = useRef(null);
  const silenceTimerRef = useRef(null);
  const recordingFinalRef = useRef('');

  // 初始化设置与事件监听
  useEffect(() => {
    const s = localStorage.getItem('ai_tutor_settings_v3');
    if (s) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });

    ttsEngine.setStateCallback(({ isPlaying }) => setIsAiSpeaking(isPlaying));

    return () => {
      stopEverything();
      ttsEngine.setStateCallback(null);
    };
  }, []);

  useEffect(() => {
    ttsEngine.setSettingsRef(settings);
    localStorage.setItem('ai_tutor_settings_v3', JSON.stringify(settings));
  }, [settings]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 60);
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
    ttsEngine.stopAndClear();
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsAiSpeaking(false);
  };

  const sendMessage = async (text) => {
    const content = (text || '').trim();
    if (!content) return;

    ttsEngine.unlockAudio(); // 解锁音频播放

    if (!settings.apiKey) {
      alert('请先配置 API Key');
      setShowSettings(true);
      return;
    }

    ttsEngine.stopAndClear();
    if (abortControllerRef.current) abortControllerRef.current.abort();

    const aiMsgId = nowId();
    const newHistory = [...history, { id: nowId(), role: 'user', text: content }];
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
          stream: true,
          messages,
        }),
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';
      let sentenceBuffer = '';
      let raw = '';

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
              sentences.forEach((s) => ttsEngine.push(s));
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

  const startRecording = () => {
    ttsEngine.unlockAudio(); // 解锁音频播放

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return alert('当前浏览器不支持语音识别');

    ttsEngine.stopAndClear();
    if (abortControllerRef.current) abortControllerRef.current.abort();

    if (recognitionRef.current && isRecording) return;

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
        if (e.results[i].isFinal) {
          recordingFinalRef.current += `${t} `;
        } else {
          interim += t;
        }
      }

      const finalTxt = recordingFinalRef.current.trim();
      setRecordFinalText(finalTxt);
      setLiveInterim(interim.trim());

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      // 停顿2.5秒自动发送
      silenceTimerRef.current = setTimeout(() => manualSubmitRecording(), 2500);
    };

    rec.onerror = () => { setIsRecording(false); recognitionRef.current = null; };
    rec.onend = () => { setIsRecording(false); recognitionRef.current = null; };

    recognitionRef.current = rec;
    if (navigator.vibrate) navigator.vibrate(35);
    try { rec.start(); } catch {}
  };

  const stopRecordingOnly = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setIsRecording(false);
    clearRecordingBuffer();
  };

  const manualSubmitRecording = () => {
    const finalText = `${recordingFinalRef.current} ${liveInterim}`.trim();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setIsRecording(false);
    
    setLiveInterim('');
    setRecordFinalText('');
    recordingFinalRef.current = '';
    
    if (finalText) sendMessage(finalText);
  };

  const clearRecordingBuffer = () => {
    recordingFinalRef.current = '';
    setRecordFinalText('');
    setLiveInterim('');
  };

  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    longPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(50);
      setShowLangPicker(true);
      longPressTimer.current = null;
    }, 600);
  };

  const handlePointerUp = (e) => {
    e.preventDefault(); // 阻止手机长按出菜单
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      
      if (isRecording) {
        if (navigator.vibrate) navigator.vibrate(35);
        manualSubmitRecording();
      } else {
        startRecording();
      }
    }
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

      <div className="absolute inset-0 bg-cover bg-center opacity-65" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/35 via-slate-900/50 to-slate-950/85" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,.18),transparent_35%),radial-gradient(circle_at_80%_25%,rgba(99,102,241,.18),transparent_35%)]" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4 h-16 border-b border-white/10 backdrop-blur-sm">
        <button onClick={() => { stopEverything(); onClose?.(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-90 transition-transform">
          <i className="fas fa-arrow-left" />
        </button>
        <div className="font-bold tracking-widest text-white text-sm">AI TUTOR</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSettings((s) => ({ ...s, showText: !s.showText }))} className={`w-10 h-10 flex items-center justify-center rounded-full active:scale-90 transition-transform ${settings.showText ? 'bg-pink-500/45 text-white' : 'bg-white/15 text-white'}`} title="字幕开关">
            <i className={`fas ${settings.showText ? 'fa-closed-captioning' : 'fa-comment-slash'}`} />
          </button>
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-90 transition-transform">
            <i className="fas fa-sliders-h" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative p-4 pb-36 flex flex-col z-10">
        {(!settings.showText && !textMode) ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-60 h-60">
              {isAiSpeaking && <div className="absolute inset-0 rounded-full bg-pink-400/30 animate-ping-slow" />}
              {isAiSpeaking && <div className="absolute inset-6 rounded-full bg-violet-400/30 animate-ping-slow" style={{ animationDelay: '0.45s' }} />}
              <div className={`relative z-10 flex items-center justify-center w-32 h-32 rounded-full transition-all duration-300 ${isAiSpeaking ? 'scale-110 bg-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.6)]' : 'bg-white/10'}`}>
                <i className={`fas fa-microphone-alt text-5xl ${isAiSpeaking ? 'text-white' : 'text-slate-300'}`} />
              </div>
            </div>

            <div className="mt-10 h-10 flex items-center justify-center">
              {isAiSpeaking ? (
                <div className="tts-bars" aria-label="AI正在说话">
                  <span /><span /><span /><span /><span />
                </div>
              ) : (
                <span className="text-sm tracking-widest text-slate-400 font-medium">
                  {isRecording ? '正在倾听...' : '安静待机中'}
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

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-[max(24px,env(safe-area-inset-bottom))] px-5 bg-gradient-to-t from-slate-950 via-slate-950/92 to-transparent pt-12">
        <div className="max-w-md mx-auto relative flex items-center justify-center">
          <button onClick={() => setTextMode((v) => !v)} className="absolute left-0 w-12 h-12 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-95 transition-transform">
            <i className={`fas ${textMode ? 'fa-microphone' : 'fa-keyboard'}`} />
          </button>

          {!textMode ? (
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-4">
                
                {isRecording && (
                  <button onClick={clearRecordingBuffer} className="h-12 w-14 rounded-full bg-white/15 text-white active:scale-95 text-xs font-bold animate-[fadeIn_.2s_ease-out]">
                    清空
                  </button>
                )}

                <button
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`select-none touch-manipulation w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
                    isRecording 
                      ? 'bg-red-500 animate-pulse-ring scale-95' 
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95'
                  }`}
                >
                  <i className={`fas ${isRecording ? 'fa-paper-plane' : 'fa-microphone'} text-3xl ${isRecording ? 'animate-pulse' : ''}`} />
                </button>

                {isRecording && (
                  <button onClick={stopRecordingOnly} className="h-12 w-14 rounded-full bg-white/15 text-white active:scale-95 text-xs font-bold animate-[fadeIn_.2s_ease-out]">
                    取消
                  </button>
                )}

              </div>
              
              <div className="text-[10px] font-bold text-slate-300 mt-4 tracking-widest uppercase transition-all">
                {isRecording ? (
                  <span className="text-red-400">点击发送 · 或静默自动发送</span>
                ) : (
                  <span>长按切换语言 · {currentLangObj.flag} {currentLangObj.name}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 ml-16 relative flex items-center bg-white/15 border border-white/20 rounded-full p-1 backdrop-blur-md">
              <input
                type="text"
                className="flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder-slate-300"
                placeholder="打字回复..."
                value={inputText}
                onFocus={stopEverything}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { sendMessage(inputText); setInputText(''); } }}
              />
              <button onClick={() => { sendMessage(inputText); setInputText(''); }} className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0">
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          )}

          {(isAiSpeaking) && !textMode && !isRecording && (
            <button onClick={stopEverything} className="absolute right-0 w-12 h-12 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-95 transition-transform" title="全部停止">
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
                  className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all ${recLang === lang.code ? 'border-pink-500 bg-pink-500/20' : 'border-white/10 bg-white/5'}`}
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
                <input className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none focus:border-pink-500" placeholder="API URL" value={settings.apiUrl} onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })} />
                <div className="flex gap-2">
                  <input type={showApiKey ? 'text' : 'password'} autoComplete="off" spellCheck={false} className="flex-1 border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none focus:border-pink-500" placeholder="API Key" value={settings.apiKey} onPaste={(e) => { e.preventDefault(); const t = e.clipboardData?.getData('text') || ''; setSettings((s) => ({ ...s, apiKey: t.trim() })); }} onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })} />
                  <button onClick={pasteApiKey} className="px-3 rounded-xl bg-white/10">粘贴</button>
                  <button onClick={() => setShowApiKey((v) => !v)} className="px-3 rounded-xl bg-white/10">{showApiKey ? '隐藏' : '显示'}</button>
                </div>
                <div className="flex gap-2">
                  <input className="flex-1 border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" placeholder="Model" value={settings.model} onChange={(e) => setSettings({ ...settings, model: e.target.value })} />
                  <div className="w-28 flex items-center border border-white/10 rounded-xl px-2 bg-slate-900/50">
                    <span className="text-xs text-slate-400 mr-1">Temp</span>
                    <input type="number" step="0.1" className="w-full bg-transparent outline-none" value={settings.temperature} onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value || '0.8') })} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-400 text-xs flex justify-between"><span>系统提示词</span><button onClick={() => setSettings({ ...settings, systemPrompt: DEFAULT_PROMPT })} className="text-pink-400">重置</button></div>
                <textarea rows={5} className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" value={settings.systemPrompt} onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })} />
              </div>

              <div className="space-y-4 border-t border-white/10 pt-4">
                <div className="font-bold text-slate-400 text-xs">TTS 发音配置</div>
                <input className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" placeholder="TTS API URL" value={settings.ttsApiUrl} onChange={(e) => setSettings({ ...settings, ttsApiUrl: e.target.value })} />
                <input className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" placeholder="Voice" value={settings.ttsVoice} onChange={(e) => setSettings({ ...settings, ttsVoice: e.target.value })} />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 block mb-1">语速调整: {settings.ttsSpeed}</label>
                    <input type="range" min="-50" max="50" step="1" className="w-full accent-pink-500" value={settings.ttsSpeed} onChange={(e) => setSettings({ ...settings, ttsSpeed: parseInt(e.target.value) })} />
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-4 pb-2">
                <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/10">
                  <span>显示字幕</span>
                  <input type="checkbox" className="w-5 h-5 accent-pink-500" checked={settings.showText} onChange={(e) => setSettings({ ...settings, showText: e.target.checked })} />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
