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
      0% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(236, 72, 153, .65); }
      70% { transform: scale(1); box-shadow: 0 0 0 28px rgba(236, 72, 153, 0); }
      100% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
    }
    .orb-active { animation: pulse-ring 1.35s infinite; }

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
      from { opacity: 0; transform: translateY(4px); }
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
规则：练习句用中文，解释和反馈用缅文；每次1-3句；有错绝不放水，先纠错再要求重读。`;

const DEFAULT_SETTINGS = {
  apiUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o',
  temperature: 0.8,
  systemPrompt: DEFAULT_PROMPT,

  // 你的 TTS 接口（微软音色由后端控制）
  ttsApiUrl: '/api/tts', // e.g. /api/tts?t=xxx&v=zh-CN-XiaoxiaoNeural&rate=1.0&pitch=1.0
  ttsVoice: 'zh-CN-XiaoxiaoNeural',
  ttsSpeed: 1.05,
  ttsPitch: 1.0,

  showText: true,
};

// =========================
// TTS Engine (第三方接口，分句即时播，可打断)
// =========================
class ExternalTTSQueue {
  constructor() {
    this.queue = [];
    this.isPlaying = false;
    this.currentAudio = null;
    this.fetchAbort = null;
    this.playToken = 0;
    this.settingsRef = null;
    this.cache = new Map();
    this.onStateChange = null;
  }

  setSettingsRef(ref) {
    this.settingsRef = ref;
  }

  setStateCallback(cb) {
    this.onStateChange = cb;
  }

  emitState() {
    this.onStateChange?.({
      isPlaying: this.isPlaying,
      queueLength: this.queue.length,
    });
  }

  detectVoice(text, fallback) {
    if (/[\u1000-\u109F]/.test(text)) return 'my-MM-NilarNeural';
    if (/[a-zA-Z]/.test(text)) return 'en-US-JennyNeural';
    return fallback || 'zh-CN-XiaoxiaoNeural';
  }

  async fetchBlob(text) {
    const s = this.settingsRef || {};
    const voice = this.detectVoice(text, s.ttsVoice);
    const rate = s.ttsSpeed ?? 1.0;
    const pitch = s.ttsPitch ?? 1.0;
    const api = s.ttsApiUrl || '/api/tts';
    const cacheKey = `${api}|${voice}|${rate}|${pitch}|${text}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    this.fetchAbort = new AbortController();
    const url = `${api}?t=${encodeURIComponent(text)}&v=${encodeURIComponent(voice)}&rate=${encodeURIComponent(rate)}&pitch=${encodeURIComponent(pitch)}`;
    const res = await fetch(url, { signal: this.fetchAbort.signal });
    if (!res.ok) throw new Error(`TTS HTTP ${res.status}`);
    const blob = await res.blob();
    this.cache.set(cacheKey, blob);
    return blob;
  }

  push(text) {
    const t = (text || '').trim();
    if (!t) return;
    this.queue.push(t);
    this.emitState();
    this.playNext();
  }

  async playNext() {
    if (this.isPlaying || this.queue.length === 0) return;
    this.isPlaying = true;
    this.emitState();

    const token = this.playToken;
    const text = this.queue.shift();

    try {
      const blob = await this.fetchBlob(text);
      if (token !== this.playToken) return;

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      this.currentAudio = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        if (token !== this.playToken) return;
        this.currentAudio = null;
        this.isPlaying = false;
        this.emitState();
        this.playNext();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        if (token !== this.playToken) return;
        this.currentAudio = null;
        this.isPlaying = false;
        this.emitState();
        this.playNext();
      };

      await audio.play();
    } catch {
      this.currentAudio = null;
      this.isPlaying = false;
      this.emitState();
      this.playNext();
    }
  }

  stopAndClear() {
    this.playToken++;
    this.queue = [];
    if (this.fetchAbort) this.fetchAbort.abort();
    this.fetchAbort = null;

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

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
      out.push(buf.slice(last, i + 1));
      last = i + 1;
    }
  }
  return { sentences: out, rest: buf.slice(last) };
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

  useEffect(() => {
    const s = localStorage.getItem('ai_tutor_settings_v2');
    if (s) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });

    ttsEngine.setStateCallback(({ isPlaying }) => {
      setIsAiSpeaking(isPlaying);
    });

    return () => {
      stopEverything();
      ttsEngine.setStateCallback(null);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    ttsEngine.setSettingsRef(settings);
    localStorage.setItem('ai_tutor_settings_v2', JSON.stringify(settings));
  }, [settings]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth',
        });
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

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsAiSpeaking(false);
  };

  const sendMessage = async (text) => {
    const content = (text || '').trim();
    if (!content) return;

    if (!settings.apiKey) {
      alert('请先配置 API Key');
      setShowSettings(true);
      return;
    }

    // 打断：用户新输入直接打断 AI 语音与旧流
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

            setHistory((prev) =>
              prev.map((m) => (m.id === aiMsgId ? { ...m, text: fullText } : m))
            );
            scrollToBottom();

            const { sentences, rest } = splitSpeakable(sentenceBuffer);
            if (sentences.length) {
              sentences.forEach((s) => ttsEngine.push(s.trim()));
              sentenceBuffer = rest;
            }
          } catch {}
        }
      }

      if (sentenceBuffer.trim()) ttsEngine.push(sentenceBuffer.trim());

      setHistory((prev) =>
        prev.map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m))
      );
    } catch (e) {
      if (e.name !== 'AbortError') {
        setHistory((prev) => [...prev, { id: nowId(), role: 'error', text: e.message }]);
      }
    }
  };

  // ===== 长语音识别 + 手动提交 =====
  const startRecording = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return alert('当前浏览器不支持语音识别');

    // 录音开始时打断AI
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
      silenceTimerRef.current = setTimeout(() => {
        // 自动收尾，避免一直挂着
        manualSubmitRecording();
      }, 2200);
    };

    rec.onerror = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    rec.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = rec;
    if (navigator.vibrate) navigator.vibrate(35);
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
  };

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(50);
      setShowLangPicker(true);
      longPressTimer.current = null;
    }, 600);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      if (isRecording) stopRecordingOnly();
      else startRecording();
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

      {/* 更亮一点的背景 */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-65"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/35 via-slate-900/50 to-slate-950/85" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,.18),transparent_35%),radial-gradient(circle_at_80%_25%,rgba(99,102,241,.18),transparent_35%)]" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4 h-16 border-b border-white/10 backdrop-blur-sm">
        <button
          onClick={() => {
            stopEverything();
            onClose?.();
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-90"
        >
          <i className="fas fa-arrow-left" />
        </button>

        <div className="font-bold tracking-widest text-white text-sm">AI TUTOR</div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSettings((s) => ({ ...s, showText: !s.showText }))}
            className={`w-10 h-10 flex items-center justify-center rounded-full active:scale-90 ${
              settings.showText ? 'bg-pink-500/45 text-white' : 'bg-white/15 text-white'
            }`}
            title="字幕开关"
          >
            <i className={`fas ${settings.showText ? 'fa-closed-captioning' : 'fa-comment-slash'}`} />
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-90"
          >
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
              <div className rounded-all scale-110' : 'bg-white/10'}`}>
                <i className={`fas fa-microphone-alt text-5xl ${isAiSpeaking ? 'text-white' : 'text-slate-300'}`} />
              </div>
            </div>

            {/* AI TTS 动态条 */}
            {isAiSpeaking && (
              <div className="tts-bars mt-6" aria-label=" '说 : (isRecording ? '正在倾听...' : '安静待机中')}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto min-h-full flex flex-col justify-end">
            {history.map((msg) => (
              <div key={msg.id} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] p-3.5 rounded-sm'
                    : msg.role === 'error'
                    ? 'bg-red-500/20 text-red-100 border border-red-500/50'
                    : 'bg-white/15 backdrop-blur-md text-slate-100 rounded-bl-sm border border-white/15'
                }`}>
                  {msg.text}
                  {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-pink-300 animate-pulse" />}
                </div>
              </div>
            ))}

            {/* 识别中的实时字幕 */}
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
          <button
            onClick={() => setTextMode((v) => !v)}
            className="absolute left-0 w-12 h-12 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-95"
          >
            <i className={`fas ${textMode ? 'fa-microphone' : 'fa-keyboard'}`} />
          </button>

          {!textMode ? (
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-3">
                {/* 主录音按钮：点按开始/停止；长按切语言 */}
                <button
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleTouchStart}
                  onMouseUp={handleTouchEnd}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
                    isRecording
                      ? 'bg-red-500 scale-95 ring-4 ring-red-400/40'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95'
                  }`}
                >
                  <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'} text-3xl`} />
                </button>

                {/* 手动提交按钮（录音时可见） */}
                {isRecording && (
                  <button
                    onClick={manualSubmitRecording}
                    className="h-12 px-4 rounded-xl bg-emerald-500 text-white font-semibold active:scale-95"
                  >
                    提交
                  </button>
                )}

                {/* 清空识别缓存 */}
                {isRecording && (
                  <button
                    onClick={clearRecordingBuffer}
                    className="h-12 px-3 rounded-xl bg-white/15 text-white active:scale-95"
                  >
                    清空
                  </button>
                )}
              </div>

              <div className="text-[10px] font-bold text-slate-300 mt-3 tracking-widest uppercase">
                长按切换语言 · {currentLangObj.flag} {currentLangObj.name}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage(inputText);
                    setInputText('');
                  }
                }}
              />
              <button
                onClick={() => {
                  sendMessage(inputText);
                  setInputText('');
                }}
                className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0"
              >
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          )}

          {(isAiSpeaking || isRecording) && !textMode && (
            <button
              onClick={stopEverything}
              className="absolute right-0 w-12 h-12 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-95"
              title="全部停止"
            >
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
                  onClick={() => {
                    setRecLang(lang.code);
                    setShowLangPicker(false);
                  }}
                  className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all ${
                    recLang === lang.code ? 'border-pink-500 bg-pink-500/20' : 'border-white/10 bg-white/5'
                  }`}
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
                <input
                  className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none focus:border-pink-500"
                  placeholder="API URL"
                  value={settings.apiUrl}
                  onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })}
                />

                <div className="flex gap-2">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    autoComplete="off"
                    spellCheck={false}
                    className="flex-1 border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none focus:border-pink-500"
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
                  <button onClick={() => setShowApiKey((v) => !v)} className="px-3 rounded-xl bg-white/10">
                    {showApiKey ? '隐藏' : '显示'}
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    className="flex-1 border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none"
                    placeholder="Model"
                    value={settings.model}
                    onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                  />
                  <div className="w-28 flex items-center border border-white/10 rounded-xl px-2 bg-slate-900/50">
                    <span className="text-xs text-slate-400 mr-1">Temp</span>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full bg-transparent outline-none"
                      value={settings.temperature}
                      onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value || '0.8') })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-400 text-xs flex justify-between">
                  <span>系统提示词</span>
                  <button onClick={() => setSettings({ ...settings, systemPrompt: DEFAULT_PROMPT })} className="text-pink-400">重置</button>
                </div>
                <textarea
                  rows={5}
                  className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none"
                  value={settings.systemPrompt}
                  onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                />
              </div>

              <div className="space-y-4 border-t border-white/10 pt-4">
                <div className="font-bold text-slate-400 text-xs">第三方 TTS（你的接口）</div>

                <input
                  className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none"
                  placeholder="TTS API URL，例如 /api/tts"
                  value={settings.ttsApiUrl}
                  onChange={(e) => setSettings({ ...settings, ttsApiUrl: e.target.value })}
                />

                <input
                  className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none"
                  placeholder="Voice, 例如 zh-CN-XiaoxiaoNeural"
                  value={settings.ttsVoice}
                  onChange={(e) => setSettings({ ...settings, ttsVoice: e.target.value })}
                />

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 block mb-1">语速: {settings.ttsSpeed}x</label>
                    <input
                      type="range"
                      min="0.6"
                      max="1.6"
                      step="0.05"
                      className="w-full accent-pink-500"
                      value={settings.ttsSpeed}
                      onChange={(e) => setSettings({ ...settings, ttsSpeed: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 block mb-1">音调: {settings.ttsPitch}</label>
                    <input
                      type="range"
                      min="0.7"
                      max="1.4"
                      step="0.05"
                      className="w-full accent-pink-500"
                      value={settings.ttsPitch}
                      onChange={(e) => setSettings({ ...settings, ttsPitch: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-4 pb-2">
                <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/10">
                  <span>显示字幕</span>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-pink-500"
                    checked={settings.showText}
                    onChange={(e) => setSettings({ ...settings, showText: e.target.checked })}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
