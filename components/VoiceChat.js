'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
// 如需实现真正的自动拼音，请安装: npm install pinyin-pro
// 然后取消下面这行的注释:
// import { pinyin } from 'pinyin-pro';

// =========================
// 全局样式
// =========================
const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* 核心交互修复 */
    .app-container {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    /* 允许文本选择 */
    .selectable {
      -webkit-user-select: text;
      user-select: text;
    }

    /* 拼音 Ruby 样式 */
    ruby { ruby-position: over; }
    rt { font-size: 0.6em; color: #f9a8d4; font-weight: normal; }

    /* 动画定义 */
    @keyframes pulse-ring {
      0% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(236, 72, 153, 0); }
      100% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
    }
    .animate-pulse-ring { animation: pulse-ring 1.5s infinite; }

    @keyframes wave {
      0%, 100% { height: 4px; opacity: 0.5; }
      50% { height: 16px; opacity: 1; }
    }
    .voice-wave span {
      display: inline-block; width: 3px; background: #fff; margin: 0 1px; border-radius: 2px;
      animation: wave 0.8s ease-in-out infinite;
    }
    .voice-wave span:nth-child(2) { animation-delay: 0.1s; }
    .voice-wave span:nth-child(3) { animation-delay: 0.2s; }
    .voice-wave span:nth-child(4) { animation-delay: 0.3s; }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in { animation: fadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
  `}</style>
);

const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const RECOGNITION_LANGS = [
  { code: 'my-MM', name: 'မြန်မာ (缅语)', flag: '🇲🇲' },
  { code: 'zh-CN', name: '中文 (普通话)', flag: '🇨🇳' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
];

const TTS_VOICES = [
  { id: 'zh-CN-XiaoxiaoMultilingualNeural', name: '晓晓多语言 (女-推荐)' },
  { id: 'zh-CN-XiaochenMultilingualNeural', name: '晓辰多语言 (男-推荐)' },
  { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓 (女-标准)' },
  { id: 'zh-CN-YunxiNeural', name: '云希 (男-阳光)' },
  { id: 'zh-CN-YunjianNeural', name: '云健 (男-影视)' },
];

// 优化提示词：禁止生成拼音，要求严格分句
const DEFAULT_PROMPT = `
你是Pingo，缅甸人的中文口语私教。风格：毒舌、幽默、高要求。
【绝对规则】
1. 严禁生成拼音或注音，只输出汉字。
2. 严禁在中文和缅文之间混排，必须用句号"。"严格隔开。
3. 提示词标签（如 Target Sentence）请使用英文，但我会在前端隐藏它们。
4. 每轮回复包含：
   - 毒舌评价（缅文）
   - 纠错（如有）
   - 目标句（中文） + 解释（缅文）
5. 不要输出 Markdown 标题（#），直接输出纯文本。
`;

const DEFAULT_SETTINGS = {
  apiUrl: 'https://api.mistral.ai/v1',
  apiKey: 'xLnM3QMeVS1XoIG9LcdJUmzYLExYLvAq',
  model: 'mistral-large-2512',
  temperature: 0.7,
  systemPrompt: DEFAULT_PROMPT,
  ttsApiUrl: 'https://t.leftsite.cn/tts',
  ttsVoice: 'zh-CN-XiaoxiaoMultilingualNeural',
  ttsSpeed: -15,
  ttsPitch: 1.0, // 支持小数
  showText: true,
  asrSilenceMs: 1500,
};

// =========================
// 文本渲染组件 (处理拼音和隐藏标签)
// =========================
const MessageContent = ({ text, isAi }) => {
  // 1. 隐藏不需要显示的标签
  let displayHtml = text
    .replace(/\*\*(.*?)\*\*/g, '$1') // 去除加粗标记
    .replace(/Target Sentence:|Meaning:|Correction:/gi, '') // 隐藏提示词
    .replace(/\[.*?\]/g, '') // 隐藏情绪标签
    .trim();

  // 2. 简单的拼音处理逻辑 (如果没有安装 pinyin-pro，则只显示汉字)
  // 如果你有 pinyin-pro，可以使用以下逻辑：
  // const htmlWithPinyin = pinyin(displayHtml, { toneType: 'none', type: 'array' }).map(...)
  // 这里为了演示演示单文件运行，我们只做简单的渲染，不带自动注音
  // 实际项目中请引入 pinyin 库来包裹 <ruby> 标签

  return (
    <div className={`text-[17px] leading-relaxed whitespace-pre-wrap font-medium ${isAi ? 'text-white/95 text-shadow-sm' : 'text-white/60'}`} style={{ textShadow: isAi ? '0 2px 4px rgba(0,0,0,0.5)' : 'none' }}>
      {displayHtml}
    </div>
  );
};

// =========================
// TTS 引擎 (增强版)
// =========================
class SmartTTSQueue {
  constructor() {
    this.queue = [];
    this.isPlaying = false;
    this.audioUnlocked = false;
    this.settingsRef = null;
    this.onStateChange = null;
    
    this.currentAudio = null;
    this.playToken = 0;
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

  // 核心：彻底清洗掉不应该读出来的东西
  sanitizeForTTS(text) {
    return text
      .replace(/Target Sentence:|Meaning:|Correction:/gi, '') // 英文标签不读
      .replace(/\[.*?\]/g, '') // 情绪标签 [laughs] 不读
      .replace(/\(.*?\)/g, '') // 括号内容不读
      .replace(/\*\*/g, '') // Markdown 符号不读
      .replace(/[a-zA-Z]+/g, (match) => {
        // 可选：如果不想读任何英文单词，可以在这里过滤，但保留 Target Sentence 后的中文
        // 这里我们保留英文单词，因为可能是英语教学，但前面的标签已经去掉了
        return match; 
      })
      .trim();
  }

  getVoiceForLang(text) {
    const s = this.settingsRef || {};
    // 简单的语言检测
    if (/[\u1000-\u109F]/.test(text)) return 'my-MM-NilarNeural'; // 缅文
    if (/[\u4e00-\u9fa5]/.test(text)) return s.ttsVoice; // 中文 (用户设置)
    if (/[a-zA-Z]/.test(text)) return 'en-US-JennyNeural'; // 英文
    return s.ttsVoice;
  }

  buildUrl(text, voice) {
    const s = this.settingsRef || {};
    const rate = s.ttsSpeed ?? 0;
    const pitch = s.ttsPitch ?? 1.0;
    const baseUrl = s.ttsApiUrl || 'https://t.leftsite.cn/tts';
    
    // 把 pitch 转换成 API 需要的格式 (假设 API 支持 p 参数)
    // 很多 TTS API pitch 是 Hz 或 relative string，这里透传 p
    return `${baseUrl}?t=${encodeURIComponent(text)}&v=${encodeURIComponent(voice)}&r=${encodeURIComponent(rate)}&p=${encodeURIComponent(pitch)}`;
  }

  push(text) {
    const cleanText = this.sanitizeForTTS(text);
    if (!cleanText) return;

    // 智能拆分中缅文 (按语言块拆分)
    const segments = this.smartSplit(cleanText);
    
    segments.forEach(seg => {
      if (seg.text.trim()) {
        this.queue.push({ 
          text: seg.text, 
          voice: this.getVoiceForLang(seg.text) 
        });
      }
    });

    this.emitState();
    this.playNext();
  }

  smartSplit(text) {
    const segments = [];
    let currLang = null;
    let buffer = '';

    for (const char of text) {
      let type = 'other';
      if (/[\u4e00-\u9fa5]/.test(char)) type = 'zh';
      else if (/[\u1000-\u109F]/.test(char)) type = 'my';
      else if (/[a-zA-Z]/.test(char)) type = 'en';
      
      // 标点符号跟随上一个语言
      if (type === 'other') {
        buffer += char;
        continue;
      }

      if (currLang && type !== currLang) {
        segments.push({ text: buffer, lang: currLang });
        buffer = char;
        currLang = type;
      } else {
        buffer += char;
        currLang = type;
      }
    }
    if (buffer) segments.push({ text: buffer, lang: currLang });
    return segments;
  }

  playNext() {
    if (this.isPlaying || this.queue.length === 0) return;
    
    this.isPlaying = true;
    this.emitState();
    
    const token = ++this.playToken;
    const item = this.queue.shift();
    
    const audio = new Audio(this.buildUrl(item.text, item.voice));
    this.currentAudio = audio;
    audio.crossOrigin = 'anonymous';

    const handleEnd = () => {
      if (token !== this.playToken) return;
      this.currentAudio = null;
      this.isPlaying = false;
      this.emitState();
      this.playNext();
    };

    audio.onended = handleEnd;
    audio.onerror = (e) => {
      console.error('TTS Error', e);
      handleEnd();
    };

    audio.play().catch(e => {
      console.warn('Play blocked', e);
      handleEnd();
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
    this.emitState();
  }
}

const ttsEngine = new SmartTTSQueue();

// =========================
// 主程序
// =========================
export default function VoiceChat({ isOpen, onClose }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [recLang, setRecLang] = useState('my-MM');
  const [history, setHistory] = useState([]); // {role, text}
  
  // 状态机
  const [status, setStatus] = useState('idle'); // idle | recording | processing | speaking
  const [interimText, setInterimText] = useState('');
  
  const [showSettings, setShowSettings] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);
  const silenceTimer = useRef(null);
  const abortCtrl = useRef(null);
  const buttonLock = useRef(false); // 防止按钮连击

  // 初始化
  useEffect(() => {
    const saved = localStorage.getItem('ai_tutor_v7');
    if (saved) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
    
    ttsEngine.setStateCallback(({ isPlaying }) => {
      if (isPlaying) setStatus('speaking');
      else setStatus(prev => prev === 'speaking' ? 'idle' : prev);
    });

    return () => stopAll();
  }, []);

  useEffect(() => {
    localStorage.setItem('ai_tutor_v7', JSON.stringify(settings));
    ttsEngine.setSettingsRef(settings);
  }, [settings]);

  // 滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [history, interimText, status]);

  const stopAll = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (abortCtrl.current) abortCtrl.current.abort();
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    
    ttsEngine.stop();
    setStatus('idle');
    setInterimText('');
  };

  const handleStartRecord = () => {
    if (buttonLock.current) return;
    
    ttsEngine.unlockAudio();
    stopAll(); // 先停止一切

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return alert('No Speech API');

    const rec = new SpeechRec();
    rec.lang = recLang;
    rec.interimResults = true;
    rec.continuous = true;

    rec.onstart = () => {
      setStatus('recording');
      if (navigator.vibrate) navigator.vibrate(50);
    };

    rec.onresult = (e) => {
      let final = '';
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      
      // 更新临时显示
      if (final) {
        handleSubmit(final + interim); // 有结果直接提交，不等待
        rec.stop();
        return;
      }
      setInterimText(interim);

      // 静音检测
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => {
        if (interim) {
          handleSubmit(interim);
          rec.stop();
        }
      }, settings.asrSilenceMs);
    };

    rec.onerror = (e) => {
      console.error(e);
      setStatus('idle');
    };
    
    rec.onend = () => {
      if (status === 'recording') setStatus('idle');
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const handleSubmit = async (text) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    setStatus('processing'); // 立即显示思考中
    setInterimText('');
    
    // 添加用户消息
    const userMsg = { id: nowId(), role: 'user', text: cleanText };
    setHistory(prev => [...prev, userMsg]);
    
    // 准备 AI 消息
    const aiMsgId = nowId();
    setHistory(prev => [...prev, { id: aiMsgId, role: 'ai', text: '...' }]);

    // 请求 LLM
    abortCtrl.current = new AbortController();
    try {
      const res = await fetch(`${settings.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`
        },
        body: JSON.stringify({
          model: settings.model,
          temperature: settings.temperature,
          stream: true,
          messages: [
            { role: 'system', content: settings.systemPrompt },
            ...history.slice(-6).map(m => ({ role: m.role === 'ai'?'assistant':'user', content: m.text })),
            { role: 'user', content: cleanText }
          ]
        }),
        signal: abortCtrl.current.signal
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              const content = data.choices[0]?.delta?.content || '';
              if (content) {
                fullText += content;
                buffer += content;
                
                // 更新 UI
                setHistory(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText } : m));

                // 简单的流式断句推给 TTS
                if (/[。！？\.\!\?]/.test(buffer)) {
                   ttsEngine.push(buffer);
                   buffer = '';
                }
              }
            } catch (e) {}
          }
        }
      }
      if (buffer) ttsEngine.push(buffer);

    } catch (e) {
      if (e.name !== 'AbortError') {
        setHistory(prev => [...prev, { id: nowId(), role: 'error', text: 'Error: ' + e.message }]);
        setStatus('idle');
      }
    }
  };

  // 渲染界面
  const currentLang = RECOGNITION_LANGS.find(l => l.code === recLang) || RECOGNITION_LANGS[0];

  return (
    <div className="app-container fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden">
      <GlobalStyles />
      
      {/* 背景图 */}
      <div className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none transition-opacity duration-1000" 
           style={{ backgroundImage: `url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800')` }} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40 pointer-events-none" />

      {/* 顶部栏 */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-md active:scale-95">
          <i className="fas fa-arrow-left" />
        </button>
        <button onClick={() => setShowSettings(true)} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-md active:scale-95">
          <i className="fas fa-sliders-h" />
        </button>
      </div>

      {/* 聊天内容区 (沉浸式字幕模式) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative z-10 p-5 flex flex-col gap-6 pb-40">
        {history.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-60">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4">
               <i className="fas fa-graduation-cap text-4xl" />
            </div>
            <p className="text-sm tracking-widest">AI TUTOR READY</p>
          </div>
        )}
        
        {history.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-start opacity-60' : 'items-start'} fade-in`}>
            {/* 用户文字在左侧，淡化 */}
            {msg.role === 'user' && (
              <div className="text-lg font-light pl-1 border-l-2 border-white/30 mb-1">
                {msg.text}
              </div>
            )}
            
            {/* AI 文字：高亮，无气泡，阴影 */}
            {msg.role === 'ai' && (
              <MessageContent text={msg.text} isAi={true} />
            )}

            {msg.role === 'error' && <div className="text-red-400 text-sm">{msg.text}</div>}
          </div>
        ))}
        
        {/* 实时识别文字 */}
        {interimText && (
          <div className="text-xl text-emerald-400 font-light animate-pulse">
            {interimText}...
          </div>
        )}
      </div>

      {/* 底部控制区 */}
      <div className="absolute bottom-0 w-full z-20 pb-8 pt-12 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent flex flex-col items-center justify-end">
        
        {/* 状态提示文案 */}
        <div className="mb-6 h-6 flex items-center justify-center">
          {status === 'recording' && <span className="text-red-400 font-bold tracking-widest text-xs uppercase animate-pulse">Recording...</span>}
          {status === 'processing' && <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase flex items-center gap-2"><i className="fas fa-circle-notch fa-spin"/> Thinking...</span>}
          {status === 'speaking' && (
            <div className="voice-wave h-4 flex items-center">
              <span className="h-2" /><span className="h-4" /><span className="h-3" /><span className="h-2" />
            </div>
          )}
          {status === 'idle' && <span className="text-white/30 text-xs font-medium tracking-widest uppercase">Tap to speak</span>}
        </div>

        {/* 核心操作按钮 */}
        <div className="flex items-center gap-8">
          
          {/* 语言切换 */}
          <button 
             onClick={() => setShowLangPicker(true)}
             className="w-12 h-12 rounded-full bg-white/5 flex flex-col items-center justify-center border border-white/10 active:bg-white/10"
          >
            <span className="text-lg">{currentLang.flag}</span>
            <span className="text-[9px] text-white/50 font-bold mt-[-2px]">{currentLang.code.split('-')[0]}</span>
          </button>

          {/* 麦克风 / 停止按钮 */}
          <button
            // 解决移动端点击不灵敏：使用 touchStart
            onTouchStart={(e) => { e.preventDefault(); if(status === 'speaking') stopAll(); else handleStartRecord(); }}
            onMouseDown={(e) => { e.preventDefault(); if(status === 'speaking') stopAll(); else handleStartRecord(); }}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xl relative z-30 ${
              status === 'recording' 
                ? 'bg-red-500 scale-110 shadow-red-500/50' 
                : status === 'speaking'
                  ? 'bg-amber-500 scale-100'
                  : 'bg-gradient-to-br from-pink-500 to-rose-600 hover:scale-105 active:scale-95'
            }`}
            style={{ touchAction: 'manipulation' }} // 关键：禁止双击缩放，提高响应
          >
            {/* 头像或图标 */}
            {status === 'speaking' ? (
              <i className="fas fa-stop text-2xl text-white" />
            ) : (
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/20 relative">
                 <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover opacity-90" alt="AI" />
                 {status === 'recording' && <div className="absolute inset-0 bg-red-500/30 animate-pulse" />}
              </div>
            )}
            
            {status === 'recording' && <div className="absolute inset-0 rounded-full border-2 border-white opacity-50 animate-ping" />}
          </button>

          {/* 清空历史 */}
          <button 
             onClick={() => { setHistory([]); stopAll(); }}
             className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 active:bg-white/10"
          >
            <i className="fas fa-trash-alt text-white/40 text-sm" />
          </button>
        </div>
      </div>

      {/* 语言选择弹窗 */}
      {showLangPicker && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowLangPicker(false)}>
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-xs overflow-hidden">
            {RECOGNITION_LANGS.map(l => (
              <button 
                key={l.code}
                onClick={() => { setRecLang(l.code); setShowLangPicker(false); }}
                className={`w-full p-4 flex items-center gap-4 border-b border-white/5 last:border-0 ${recLang === l.code ? 'bg-pink-500/20 text-pink-300' : 'text-white'}`}
              >
                <span className="text-2xl">{l.flag}</span>
                <span className="font-medium">{l.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 设置面板 */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={(e) => e.target === e.currentTarget && setShowSettings(false)}>
          <div className="bg-slate-900 border-t sm:border border-white/10 w-full max-w-md h-[80vh] sm:h-auto sm:rounded-2xl rounded-t-2xl flex flex-col animate-[fadeIn_0.3s_ease-out]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-white">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 bg-white/10 rounded-full text-sm">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Voice Persona</label>
                <div className="grid grid-cols-1 gap-2">
                  {TTS_VOICES.map(v => (
                    <button 
                      key={v.id}
                      onClick={() => setSettings({...settings, ttsVoice: v.id})}
                      className={`p-3 rounded-lg text-left text-sm border ${settings.ttsVoice === v.id ? 'border-pink-500 bg-pink-500/10 text-white' : 'border-white/10 text-slate-400'}`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Speed ({settings.ttsSpeed})</span>
                  <span>Pitch ({settings.ttsPitch})</span>
                </div>
                <div className="flex gap-4">
                   {/* 语速 */}
                   <input 
                     type="range" min="-50" max="50" 
                     className="flex-1 accent-pink-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                     value={settings.ttsSpeed}
                     onChange={e => setSettings({...settings, ttsSpeed: Number(e.target.value)})}
                   />
                   {/* 音调：支持小数 */}
                   <input 
                     type="number" step="0.01"
                     className="w-16 bg-white/5 border border-white/10 rounded px-2 text-center text-sm"
                     value={settings.ttsPitch}
                     onChange={e => setSettings({...settings, ttsPitch: Number(e.target.value)})}
                   />
                </div>
              </div>

              <div>
                 <label className="text-xs text-slate-400 mb-2 block">System Prompt</label>
                 <textarea 
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-xs leading-relaxed h-32 text-slate-300 focus:border-pink-500 outline-none resize-none"
                    value={settings.systemPrompt}
                    onChange={e => setSettings({...settings, systemPrompt: e.target.value})}
                 />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
