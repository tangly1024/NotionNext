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

    @keyframes pulse-red {
      0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
      100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .btn-recording { animation: pulse-red 1.5s infinite; }

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

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in { animation: fadeIn 0.3s ease-out; }
  `}</style>
);

const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const RECOGNITION_LANGS = [
  { code: 'zh-CN', name: '中文 (普通话)', flag: '🇨🇳' },
  { code: 'my-MM', name: 'မြန်မာ (缅语)', flag: '🇲🇲' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
];

const DEFAULT_SETTINGS = {
  apiUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o',
  temperature: 0.8,
  systemPrompt: `你是Pingo，一个毒舌、幽默、但专业负责的中文口语教练，服务缅甸母语者。规则：练习句用中文，解释和反馈用缅文；每次1-3句；有错绝不放水。`,
  ttsVoice: 'zh-CN-XiaoyouNeural',
  ttsSpeed: -10, // 接口 r 参数：-50 到 50 之间
  showText: true,
};

// =========================
// TTS Engine (原生 Audio 播放器)
// =========================
class NativeTTSQueue {
  constructor() {
    this.queue = [];
    this.isPlaying = false;
    this.currentAudio = null;
    this.playToken = 0;
    this.settingsRef = null;
    this.onStateChange = null;
  }

  setSettingsRef(ref) { this.settingsRef = ref; }
  setStateCallback(cb) { this.onStateChange = cb; }

  detectVoice(text, fallback) {
    if (/[\u1000-\u109F]/.test(text)) return 'my-MM-NilarNeural';
    if (/[a-zA-Z]/.test(text) && !/[\u4e00-\u9fa5]/.test(text)) return 'en-US-JennyNeural';
    return fallback || 'zh-CN-XiaoyouNeural';
  }

  push(text) {
    const t = (text || '').trim();
    if (!t) return;
    this.queue.push(t);
    this.playNext();
  }

  playNext() {
    if (this.isPlaying || this.queue.length === 0) {
      this.onStateChange?.(this.isPlaying);
      return;
    }

    this.isPlaying = true;
    this.onStateChange?.(true);

    const token = this.playToken;
    const text = this.queue.shift();
    const s = this.settingsRef;
    
    // 直接构造 URL，不使用 fetch 避免跨域
    const voice = this.detectVoice(text, s.ttsVoice);
    const url = `https://t.leftsite.cn/tts?t=${encodeURIComponent(text)}&v=${voice}&r=${s.ttsSpeed}`;

    const audio = new Audio(url);
    this.currentAudio = audio;

    audio.onended = () => {
      if (token !== this.playToken) return;
      this.isPlaying = false;
      this.playNext();
    };
    audio.onerror = () => {
      if (token !== this.playToken) return;
      this.isPlaying = false;
      this.playNext();
    };

    audio.play().catch(() => {
      this.isPlaying = false;
      this.playNext();
    });
  }

  stopAndClear() {
    this.playToken++;
    this.queue = [];
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    this.isPlaying = false;
    this.onStateChange?.(false);
  }
}

const ttsEngine = new NativeTTSQueue();

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
  const [liveInterim, setLiveInterim] = useState('');
  const [recordFinalText, setRecordFinalText] = useState('');

  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const scrollRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const recordingFinalRef = useRef('');

  useEffect(() => {
    const s = localStorage.getItem('pingo_settings_v4');
    if (s) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });
    ttsEngine.setStateCallback((playing) => setIsAiSpeaking(playing));
    return () => stopEverything();
  }, []);

  useEffect(() => {
    ttsEngine.setSettingsRef(settings);
    localStorage.setItem('pingo_settings_v4', JSON.stringify(settings));
  }, [settings]);

  const stopEverything = () => {
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch {}
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setIsRecording(false);
    ttsEngine.stopAndClear();
    if (abortControllerRef.current) abortControllerRef.current.abort();
  };

  const sendMessage = async (text) => {
    const content = text?.trim();
    if (!content) return;
    if (!settings.apiKey) return setShowSettings(true);

    ttsEngine.stopAndClear();
    if (abortControllerRef.current) abortControllerRef.current.abort();

    const aiMsgId = nowId();
    const newHistory = [...history, { id: nowId(), role: 'user', text: content }];
    setHistory([...newHistory, { id: aiMsgId, role: 'ai', text: '', isStreaming: true }]);
    
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch(`${settings.apiUrl.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.apiKey}` },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          model: settings.model,
          temperature: settings.temperature,
          stream: true,
          messages: [{ role: 'system', content: settings.systemPrompt }, ...newHistory.map(h => ({ role: h.role === 'ai' ? 'assistant' : 'user', content: h.text }))],
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '', sentenceBuf = '', raw = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
        const lines = raw.split('\n');
        raw = lines.pop() || '';
        for (const line of lines) {
          const payload = line.replace(/^data: /, '').trim();
          if (!payload || payload === '[DONE]') continue;
          try {
            const chunk = JSON.parse(payload).choices[0]?.delta?.content || '';
            fullText += chunk;
            sentenceBuf += chunk;
            setHistory(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText } : m));
            
            if (/[。！？.!?\n]/.test(sentenceBuf)) {
              ttsEngine.push(sentenceBuf.trim());
              sentenceBuf = '';
            }
          } catch {}
        }
      }
      if (sentenceBuf.trim()) ttsEngine.push(sentenceBuf.trim());
      setHistory(prev => prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m));
    } catch (e) {
      if (e.name !== 'AbortError') alert(e.message);
    }
  };

  const startRecording = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return alert('浏览器不支持语音识别');

    stopEverything();
    const rec = new SpeechRec();
    rec.lang = recLang;
    rec.interimResults = true;
    rec.continuous = true;

    recordingFinalRef.current = '';
    setIsRecording(true);

    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) recordingFinalRef.current += t;
        else interim += t;
      }
      setRecordFinalText(recordingFinalRef.current);
      setLiveInterim(interim);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => submitRecording(), 2000);
    };

    rec.onend = () => setIsRecording(false);
    recognitionRef.current = rec;
    rec.start();
  };

  const submitRecording = () => {
    const text = (recordingFinalRef.current + liveInterim).trim();
    stopEverything();
    if (text) sendMessage(text);
  };

  const handleMainBtn = () => {
    if (isRecording) submitRecording(); // 正在录音时，点击直接发送
    else startRecording(); // 没录音时，点击开始
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col w-full h-[100dvh] bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <GlobalStyles />
      
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b,0%,#020617_100%)]" />
      
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4 h-16 border-b border-white/5 backdrop-blur-md">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><i className="fas fa-times" /></button>
        <div className="text-xs font-black tracking-widest text-slate-400">PINGO AI TUTOR</div>
        <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><i className="fas fa-cog" /></button>
      </div>

      {/* 聊天内容区 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 pb-40 relative z-10 no-scrollbar">
        {history.length === 0 && !isRecording && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-3xl">🎙️</div>
            <p className="text-sm">点击下方麦克风开始练习</p>
          </div>
        )}

        {history.map((msg) => (
          <div key={msg.id} className={`flex mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-2xl ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-none' 
                : 'bg-white/10 backdrop-blur-xl border border-white/10 rounded-tl-none'
            }`}>
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}

        {isAiSpeaking && !settings.showText && (
          <div className="flex justify-center mt-10">
            <div className="tts-bars"><span/><span/><span/><span/></div>
          </div>
        )}
      </div>

      {/* 底部识别预览 */}
      {isRecording && (
        <div className="absolute bottom-32 left-0 right-0 px-6 z-20 pointer-events-none">
          <div className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 p-4 rounded-2xl text-blue-100 text-center shadow-2xl fade-in">
            <span className="opacity-50 text-[10px] block mb-1 uppercase tracking-widest">Listening...</span>
            {recordFinalText + liveInterim || '...'}
          </div>
        </div>
      )}

      {/* 操作栏 */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 z-30 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          
          <button onClick={() => setTextMode(!textMode)} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <i className={`fas ${textMode ? 'fa-microphone' : 'fa-keyboard'}`} />
          </button>

          {!textMode ? (
            <div className="flex-1 flex flex-col items-center">
              <button 
                onClick={handleMainBtn}
                onLongPress={() => setShowLangPicker(true)}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-2xl ${
                  isRecording ? 'bg-red-500 btn-recording' : 'bg-gradient-to-r from-pink-500 to-violet-500'
                }`}
              >
                <i className={`fas ${isRecording ? 'fa-paper-plane' : (isAiSpeaking ? 'fa-volume-up' : 'fa-microphone')} text-3xl`} />
              </button>
              <div className="mt-3 text-[10px] font-bold text-slate-500 tracking-tighter uppercase" onClick={() => setShowLangPicker(true)}>
                {isRecording ? '点击发送' : `${RECOGNITION_LANGS.find(l=>l.code===recLang).flag} ${RECOGNITION_LANGS.find(l=>l.code===recLang).name}`}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
              <input 
                autoFocus
                className="flex-1 bg-transparent outline-none text-sm h-10"
                placeholder="输入回复..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (sendMessage(inputText), setInputText(''))}
              />
              <button onClick={() => {sendMessage(inputText); setInputText('');}} className="text-indigo-400 p-2"><i className="fas fa-paper-plane"/></button>
            </div>
          )}

          <button onClick={stopEverything} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isAiSpeaking || isRecording ? 'bg-white/20' : 'bg-transparent text-transparent pointer-events-none'}`}>
            <i className="fas fa-stop" />
          </button>
        </div>
      </div>

      {/* 语言选择 */}
      {showLangPicker && (
        <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLangPicker(false)} />
          <div className="relative bg-slate-900 w-full max-w-sm rounded-3xl p-6 border border-white/10">
            <h3 className="text-center font-bold mb-6">识别语言选择</h3>
            <div className="grid grid-cols-2 gap-3">
              {RECOGNITION_LANGS.map(lang => (
                <button key={lang.code} onClick={() => {setRecLang(lang.code); setShowLangPicker(false);}} className={`p-4 rounded-2xl border ${recLang === lang.code ? 'border-indigo-500 bg-indigo-500/20' : 'border-white/5 bg-white/5'}`}>
                  <div className="text-2xl mb-1">{lang.flag}</div>
                  <div className="text-xs font-bold">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 设置面板 */}
      {showSettings && (
        <div className="fixed inset-0 z-[400] bg-slate-900/95 p-6 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">配置</h2>
            <button onClick={() => setShowSettings(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><i className="fas fa-times"/></button>
          </div>
          <div className="space-y-6 max-w-md mx-auto">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-bold uppercase">OpenAI Key</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500" type="password" value={settings.apiKey} onChange={e => setSettings({...settings, apiKey: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-bold uppercase">TTS 语速 ({settings.ttsSpeed})</label>
              <input type="range" min="-50" max="50" className="w-full accent-indigo-500" value={settings.ttsSpeed} onChange={e => setSettings({...settings, ttsSpeed: parseInt(e.target.value)})} />
            </div>
            <div className="pt-10">
              <button onClick={() => setShowSettings(false)} className="w-full bg-indigo-600 py-4 rounded-2xl font-bold shadow-xl">保存设置</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
                  }
