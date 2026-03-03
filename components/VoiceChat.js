'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

// =========================
// Global Styles & Animations
// =========================
const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes pulse-red {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .recording-active { animation: pulse-red 1.5s infinite; }

    @keyframes bars {
      0%,100% { transform: scaleY(.3); opacity:.5; }
      50% { transform: scaleY(1); opacity:1; }
    }
    .tts-bars span {
      display:inline-block; width:3px; height:20px; border-radius:3px;
      background: #f472b6; margin:0 2px; transform-origin: bottom;
      animation: bars 0.6s ease-in-out infinite;
    }
    .tts-bars span:nth-child(2){ animation-delay: 0.1s; }
    .tts-bars span:nth-child(3){ animation-delay: 0.2s; }
    .tts-bars span:nth-child(4){ animation-delay: 0.3s; }

    @keyframes bubble-in {
      from { opacity: 0; transform: translateY(10px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .bubble-animate { animation: bubble-in 0.25s ease-out forwards; }
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
  systemPrompt: `你是Pingo，一个毒舌、幽默、负责的中文口语教练。
针对缅甸母语者。练习句用中文，解释用缅文。
要求：回答简短（1-3句），拒绝机器味。发现发音或语法错误要犀利吐槽，纠正后强制要求重读。`,
  ttsVoice: 'zh-CN-XiaochenMultilingualNeural',
  ttsSpeed: -15, // 接口参数范围一般是 -100 到 100
  showText: true,
};

// =========================
// TTS Engine (原生 Audio 队列控制)
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

  setSettings(s) { this.settingsRef = s; }
  setStateCallback(cb) { this.onStateChange = cb; }

  detectVoice(text, fallback) {
    if (/[\u1000-\u109F]/.test(text)) return 'my-MM-NilarNeural';
    if (/[a-zA-Z]/.test(text) && !/[\u4e00-\u9fa5]/.test(text)) return 'en-US-JennyNeural';
    return fallback || 'zh-CN-XiaoxiaoNeural';
  }

  push(text) {
    if (!text.trim()) return;
    this.queue.push(text.trim());
    if (!this.isPlaying) this.playNext();
  }

  playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      this.onStateChange?.(false);
      return;
    }

    this.isPlaying = true;
    this.onStateChange?.(true);
    const token = this.playToken;
    const text = this.queue.shift();
    const s = this.settingsRef;

    const voice = this.detectVoice(text, s.ttsVoice);
    const url = `https://t.leftsite.cn/tts?t=${encodeURIComponent(text)}&v=${voice}&r=${s.ttsSpeed}`;

    const audio = new Audio(url);
    this.currentAudio = audio;

    audio.onended = () => {
      if (token === this.playToken) this.playNext();
    };
    audio.onerror = () => {
      console.error("TTS Play Error");
      if (token === this.playToken) this.playNext();
    };

    audio.play().catch(e => {
      console.warn("Audio play blocked/failed", e);
      this.playNext();
    });
  }

  stop() {
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

const ttsPlayer = new NativeTTSQueue();

export default function VoiceChat({ isOpen, onClose }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [recLang, setRecLang] = useState('my-MM');
  const [history, setHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [inputText, setInputText] = useState('');
  
  const [liveInterim, setLiveInterim] = useState('');
  const [recordFinalText, setRecordFinalText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const recognitionRef = useRef(null);
  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const silenceTimer = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('pingo_v5_config');
    if (saved) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
    ttsPlayer.setStateCallback(setIsAiSpeaking);
    return () => ttsPlayer.stop();
  }, []);

  useEffect(() => {
    ttsPlayer.setSettings(settings);
    localStorage.setItem('pingo_v5_config', JSON.stringify(settings));
  }, [settings]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  const stopAll = () => {
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch(e){} }
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    if (abortRef.current) abortRef.current.abort();
    ttsPlayer.stop();
    setIsRecording(false);
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    if (!settings.apiKey) return setShowSettings(true);

    stopAll();
    const userMsg = { id: nowId(), role: 'user', text: text.trim() };
    const aiMsgId = nowId();
    setHistory(prev => [...prev, userMsg, { id: aiMsgId, role: 'ai', text: '', isStreaming: true }]);
    setTimeout(scrollToBottom, 50);

    abortRef.current = new AbortController();
    try {
      const res = await fetch(`${settings.apiUrl.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.apiKey}` },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          model: settings.model,
          temperature: settings.temperature,
          stream: true,
          messages: [
            { role: 'system', content: settings.systemPrompt },
            ...history.slice(-6).map(h => ({ role: h.role === 'ai' ? 'assistant' : 'user', content: h.text })),
            { role: 'user', content: text.trim() }
          ],
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
            
            if (/[。！？.!?\n]/.test(sentenceBuf) && sentenceBuf.length > 2) {
              ttsPlayer.push(sentenceBuf);
              sentenceBuf = '';
            }
          } catch {}
        }
      }
      if (sentenceBuf.trim()) ttsPlayer.push(sentenceBuf);
      setHistory(prev => prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m));
      setTimeout(scrollToBottom, 100);
    } catch (e) {
      if (e.name !== 'AbortError') alert("API请求失败: " + e.message);
    }
  };

  const handleStartRecording = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return alert('当前浏览器环境不支持语音识别');

    stopAll();
    const rec = new SpeechRec();
    rec.lang = recLang;
    rec.interimResults = true;
    rec.continuous = true;

    rec.onstart = () => setIsRecording(true);
    rec.onresult = (e) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      if (final) setRecordFinalText(prev => prev + final);
      setLiveInterim(interim);
      
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => handleManualSubmit(), 2200);
    };
    rec.onerror = () => setIsRecording(false);
    rec.onend = () => setIsRecording(false);

    recognitionRef.current = rec;
    setRecordFinalText('');
    setLiveInterim('');
    rec.start();
  };

  const handleManualSubmit = () => {
    const text = (recordFinalText + liveInterim).trim();
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch(e){}
    setIsRecording(false);
    if (text) sendMessage(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col w-full h-[100dvh] bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <GlobalStyles />
      
      {/* 霓虹背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#1e1b4b_0%,#020617_100%)]" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px]" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-6 h-16 border-b border-white/5 backdrop-blur-xl">
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
          <i className="fas fa-chevron-left" />
        </button>
        <div className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Pingo Tutor</div>
        <button onClick={() => setShowSettings(true)} className="w-8 h-8 flex items-center justify-center opacity-70">
          <i className="fas fa-sliders-h" />
        </button>
      </div>

      {/* 聊天区域 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-4 pb-44 relative z-10 no-scrollbar">
        {history.map((msg) => (
          <div key={msg.id} className={`flex mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} bubble-animate`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-xl ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-tr-none' 
                : 'bg-white/10 backdrop-blur-md border border-white/10 rounded-tl-none'
            }`}>
              <div className="text-[15px] leading-relaxed break-words">{msg.text}</div>
              {msg.isStreaming && <span className="inline-block w-2 h-2 ml-1 bg-pink-400 animate-pulse rounded-full" />}
            </div>
          </div>
        ))}

        {isAiSpeaking && !settings.showText && (
          <div className="flex justify-center py-10">
            <div className="tts-bars"><span/><span/><span/><span/></div>
          </div>
        )}
      </div>

      {/* 实时语音预览 */}
      {isRecording && (
        <div className="absolute bottom-36 left-0 right-0 px-8 z-20">
          <div className="bg-indigo-500/20 backdrop-blur-2xl border border-indigo-400/30 p-4 rounded-2xl text-indigo-100 text-center shadow-2xl bubble-animate">
            <div className="text-[9px] uppercase tracking-widest opacity-40 mb-2">识别中...</div>
            <div className="text-sm font-medium">{recordFinalText + liveInterim || '请说话...'}</div>
          </div>
        </div>
      )}

      {/* 底部控制栏 */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-10 z-30 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
        <div className="max-w-md mx-auto flex items-center justify-between gap-6">
          
          <button onClick={() => setTextMode(!textMode)} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
            <i className={`fas ${textMode ? 'fa-microphone' : 'fa-keyboard'}`} />
          </button>

          {!textMode ? (
            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-center gap-6">
                {isRecording && (
                  <button onClick={() => { stopAll(); }} className="w-10 h-10 rounded-full bg-white/5 text-slate-400 flex items-center justify-center text-xs">取消</button>
                )}
                
                <button 
                  onClick={isRecording ? handleManualSubmit : handleStartRecording}
                  onContextMenu={(e) => { e.preventDefault(); setShowLangPicker(true); }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                    isRecording ? 'bg-red-500 recording-active' : 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500'
                  }`}
                >
                  <i className={`fas ${isRecording ? 'fa-paper-plane' : (isAiSpeaking ? 'fa-volume-up' : 'fa-microphone')} text-3xl text-white`} />
                </button>

                {isRecording && (
                  <button onClick={() => { setRecordFinalText(''); setLiveInterim(''); }} className="w-10 h-10 rounded-full bg-white/5 text-slate-400 flex items-center justify-center text-xs">重录</button>
                )}
              </div>
              
              <div 
                onClick={() => setShowLangPicker(true)}
                className="mt-4 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 tracking-wider flex items-center gap-2 active:scale-95 transition-transform"
              >
                {RECOGNITION_LANGS.find(l=>l.code===recLang)?.flag} {RECOGNITION_LANGS.find(l=>l.code===recLang)?.name}
                <i className="fas fa-chevron-up text-[8px] opacity-40" />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2 backdrop-blur-md">
              <input 
                autoFocus
                className="flex-1 bg-transparent outline-none text-sm h-10 text-white placeholder-slate-500"
                placeholder="在此输入..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (sendMessage(inputText), setInputText(''))}
              />
              <button onClick={() => {sendMessage(inputText); setInputText('');}} className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center ml-2">
                <i className="fas fa-arrow-up text-xs"/>
              </button>
            </div>
          )}

          <button 
            onClick={stopAll} 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isAiSpeaking || isRecording ? 'bg-white/10 text-rose-400' : 'bg-transparent text-transparent pointer-events-none'}`}
          >
            <i className="fas fa-stop" />
          </button>
        </div>
      </div>

      {/* 语言选择弹窗 */}
      {showLangPicker && (
        <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowLangPicker(false)} />
          <div className="relative bg-slate-900 w-full max-w-sm rounded-3xl p-6 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">选择识别语言</h3>
              <button onClick={() => setShowLangPicker(false)} className="opacity-50"><i className="fas fa-times"/></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {RECOGNITION_LANGS.map(lang => (
                <button key={lang.code} onClick={() => {setRecLang(lang.code); setShowLangPicker(false);}} className={`p-4 rounded-2xl border transition-all ${recLang === lang.code ? 'border-indigo-500 bg-indigo-500/20' : 'border-white/5 bg-white/5'}`}>
                  <div className="text-2xl mb-2">{lang.flag}</div>
                  <div className="text-xs font-bold">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 设置面板 */}
      {showSettings && (
        <div className="fixed inset-0 z-[400] bg-slate-950/98 p-6 overflow-y-auto no-scrollbar">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-black tracking-tighter uppercase">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><i className="fas fa-times"/></button>
            </div>
            
            <div className="space-y-8">
              <section className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">OpenAI API Key</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-pink-500 transition-colors" type="password" placeholder="sk-..." value={settings.apiKey} onChange={e => setSettings({...settings, apiKey: e.target.value})} />
              </section>

              <section className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex justify-between">
                  <span>TTS Speed</span>
                  <span className="text-pink-500">{settings.ttsSpeed}</span>
                </label>
                <input type="range" min="-60" max="60" className="w-full accent-pink-500" value={settings.ttsSpeed} onChange={e => setSettings({...settings, ttsSpeed: parseInt(e.target.value)})} />
              </section>

              <section className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Prompt</label>
                <textarea rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm leading-relaxed" value={settings.systemPrompt} onChange={e => setSettings({...settings, systemPrompt: e.target.value})} />
              </section>

              <button onClick={() => setShowSettings(false)} className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 py-4 rounded-2xl font-bold mt-6 shadow-lg active:scale-[0.98] transition-transform">保存配置</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
