'use client';

import React, { useState, useEffect, useRef } from 'react';
// 必须安装 pinyin-pro: npm install pinyin-pro
import { pinyin } from 'pinyin-pro';

// =========================
// 全局样式
// =========================
const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    .app-container {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    /* 拼音 Ruby 样式：在正上方 */
    ruby { ruby-position: over; ruby-align: center; }
    rt { font-size: 0.55em; color: #f9a8d4; font-weight: 400; font-family: sans-serif; letter-spacing: 0; user-select: none; }

    /* 动画定义 */
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
      from { opacity: 0; transform: translateY(5px); }
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
];

const DEFAULT_PROMPT = `你是Pingo，缅甸人的中文口语私教。风格：毒舌、幽默、高要求。
【绝对规则】
1. 严禁生成拼音或罗马音，只输出汉字和缅甸语（前端会自动加拼音）。
2. 严禁中缅文混排，必须用句号严格隔开。
3. 提示词标签如 Target Sentence: 或 Meaning: 请严格使用英文。
4. 每轮回复包含：
   - 毒舌评价（缅文）
   - 纠错（如有）
   - Target Sentence: 目标句（中文）
   - Meaning: 解释（缅文）
5. 不要输出 Markdown 标题（#），直接纯文本。`;

const DEFAULT_SETTINGS = {
  apiUrl: 'https://api.mistral.ai/v1',
  apiKey: 'xLnM3QMeVS1XoIG9LcdJUmzYLExYLvAq',
  model: 'mistral-large-2512',
  temperature: 0.7,
  systemPrompt: DEFAULT_PROMPT,
  ttsApiUrl: 'https://t.leftsite.cn/tts',
  ttsVoice: 'zh-CN-XiaoxiaoMultilingualNeural',
  ttsSpeed: -10,
  ttsPitch: 1.0, 
  asrSilenceMs: 1500,
};

// =========================
// 文本渲染组件 (智能拼音包裹 & 彻底隐藏标签/Markdown)
// =========================
const MessageContent = ({ text, isAi }) => {
  // 1. 彻底清洗不需要显示的标签和符号
  let cleanText = text
    .replace(/\*\*/g, '') 
    .replace(/#/g, '') 
    .replace(/Target Sentence:|Meaning:|Correction:/gi, '') 
    .replace(/\[.*?\]/g, '') 
    .trim();

  // 2. 拼音处理：只给汉字加拼音
  const renderTextWithPinyin = (str) => {
    try {
      const pyArray = pinyin(str, { type: 'all' });
      return pyArray.map((item, idx) => {
        if (item.isZh) {
          return <ruby key={idx}>{item.origin}<rt>{item.pinyin}</rt></ruby>;
        }
        return <span key={idx}>{item.origin}</span>;
      });
    } catch (e) {
      return str; // 降级处理
    }
  };

  return (
    <div 
      className={`text-[18px] leading-[2.2] whitespace-pre-wrap font-medium tracking-wide ${isAi ? 'text-white' : 'text-white/50'}`} 
      style={{ textShadow: isAi ? '0px 2px 6px rgba(0,0,0,0.8), 0px 1px 2px rgba(0,0,0,0.6)' : 'none' }}
    >
      {isAi ? renderTextWithPinyin(cleanText) : cleanText}
    </div>
  );
};

// =========================
// TTS 引擎 (修复重叠 & 清洗提示词，不读标签)
// =========================
class SmartTTSQueue {
  constructor() {
    this.queue = [];
    this.isPlaying = false;
    this.settingsRef = null;
    this.onStateChange = null;
    this.currentAudio = null;
    this.playToken = 0;
  }

  setSettingsRef(ref) { this.settingsRef = ref; }
  setStateCallback(cb) { this.onStateChange = cb; }

  unlockAudio() {
    try {
      const a = new Audio('data:audio/mp3;base64,//MkxAAQAAAAgAAAAAAAAAAAAAAP//AwAAAAAAAAAAAAA=');
      a.play().catch(() => {});
    } catch {}
  }

  emitState() {
    this.onStateChange?.({ isPlaying: this.isPlaying });
  }

  // 核心：彻底清洗掉 TTS 不该读出的内容
  sanitizeForTTS(text) {
    return text
      .replace(/\*\*/g, '') 
      .replace(/#/g, '')
      .replace(/Target Sentence:|Meaning:|Correction:/gi, '') 
      .replace(/\[.*?\]/g, '') 
      .replace(/\(.*?\)/g, '') 
      .trim();
  }

  getVoiceForLang(text) {
    const s = this.settingsRef || {};
    if (/[\u1000-\u109F]/.test(text)) return 'my-MM-NilarNeural'; 
    if (/[a-zA-Z]/.test(text) && !/[\u4e00-\u9fa5]/.test(text)) return 'en-US-JennyNeural'; 
    return s.ttsVoice; 
  }

  buildUrl(text, voice) {
    const s = this.settingsRef || {};
    const rate = s.ttsSpeed ?? 0;
    const pitch = s.ttsPitch ?? 1.0;
    const baseUrl = s.ttsApiUrl || 'https://t.leftsite.cn/tts';
    return `${baseUrl}?t=${encodeURIComponent(text)}&v=${encodeURIComponent(voice)}&r=${encodeURIComponent(rate)}&p=${encodeURIComponent(pitch)}`;
  }

  push(text) {
    const cleanText = this.sanitizeForTTS(text);
    if (!cleanText) return;

    // 按标点分句送入队列
    const segments = cleanText.match(/[^。！？.!?]+[。！？.!?]?/g) || [cleanText];
    
    segments.forEach(seg => {
      if (seg.trim()) {
        this.queue.push({ 
          text: seg.trim(), 
          voice: this.getVoiceForLang(seg) 
        });
      }
    });

    if (!this.isPlaying) this.playNext();
  }

  playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      this.emitState();
      return;
    }
    
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
      this.playNext(); 
    };

    audio.onended = handleEnd;
    audio.onerror = handleEnd;

    audio.play().catch(() => handleEnd());
  }

  stop() {
    this.playToken++;
    this.queue = [];
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.src = '';
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
  const [history, setHistory] = useState([]); 
  
  const [status, setStatus] = useState('idle'); // idle | recording | processing | speaking
  const [interimText, setInterimText] = useState('');
  
  // 文字模式与弹窗状态
  const [textMode, setTextMode] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);
  const silenceTimer = useRef(null);
  const abortCtrl = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('ai_tutor_final');
    if (saved) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
    
    ttsEngine.setStateCallback(({ isPlaying }) => {
      setStatus(prev => {
        if (isPlaying) return 'speaking';
        if (prev === 'speaking') return 'idle';
        return prev;
      });
    });

    return () => stopAll();
  }, []);

  useEffect(() => {
    localStorage.setItem('ai_tutor_final', JSON.stringify(settings));
    ttsEngine.setSettingsRef(settings);
  }, [settings]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [history, interimText, status]);

  const stopAll = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null; 
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
    ttsEngine.unlockAudio();
    stopAll(); 

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return alert('当前浏览器不支持语音识别，请使用 Chrome。');

    const rec = new SpeechRec();
    rec.lang = recLang; 
    rec.interimResults = true;
    rec.continuous = true;

    rec.onstart = () => setStatus('recording');

    rec.onresult = (e) => {
      let final = '';
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      
      if (final) {
        handleSubmit(final + interim);
        rec.stop();
        return;
      }
      
      setInterimText(interim);

      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => {
        if (interim) {
          handleSubmit(interim);
          rec.stop();
        }
      }, settings.asrSilenceMs);
    };

    rec.onerror = () => setStatus('idle');
    rec.onend = () => setStatus(prev => prev === 'recording' ? 'idle' : prev);

    recognitionRef.current = rec;
    rec.start();
  };

  const handleSubmit = async (text) => {
    const cleanText = text.trim();
    if (!cleanText) {
      setStatus('idle');
      return;
    }

    // 立即停止所有上一次的动作并显示思考中
    stopAll();
    setStatus('processing'); 
    
    const userMsg = { id: nowId(), role: 'user', text: cleanText };
    setHistory(prev => [...prev, userMsg]);
    
    const aiMsgId = nowId();
    setHistory(prev => [...prev, { id: aiMsgId, role: 'ai', text: '...' }]);

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
                
                setHistory(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText } : m));

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

      setTimeout(() => {
        if (!ttsEngine.isPlaying) setStatus('idle');
      }, 500);

    } catch (e) {
      if (e.name !== 'AbortError') {
        setHistory(prev => [...prev, { id: nowId(), role: 'error', text: 'Error: ' + e.message }]);
        setStatus('idle');
      }
    }
  };

  const currentLang = RECOGNITION_LANGS.find(l => l.code === recLang) || RECOGNITION_LANGS[0];

  return (
    <div className="app-container fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden">
      <GlobalStyles />
      
      {/* 绝对沉浸式背景图 */}
      <div className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none" 
           style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop')` }} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40 pointer-events-none" />

      {/* 顶部栏 */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-md active:scale-95">
          <i className="fas fa-arrow-left" />
        </button>
        <button onClick={() => setShowSettings(true)} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-md active:scale-95">
          <i className="fas fa-sliders-h" />
        </button>
      </div>

      {/* 聊天内容区：无气泡、文字直接显示在背景图上、用户在左 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative z-10 p-5 flex flex-col gap-6 pb-48">
        {history.length === 0 && (
          <div className="mt-20 flex flex-col items-center justify-center opacity-40">
            <i className="fas fa-comment-dots text-4xl mb-4"></i>
            <p className="text-sm tracking-widest">请直接对我说话，或输入文字</p>
          </div>
        )}
        
        {history.map((msg) => (
          <div key={msg.id} className="flex flex-col items-start fade-in w-full">
            {/* 用户的文本：左边，淡色，加点左边框修饰 */}
            {msg.role === 'user' && (
              <div className="text-[16px] pl-3 border-l-2 border-white/20 text-white/50 mb-1">
                {msg.text}
              </div>
            )}
            
            {/* AI的文本：高亮，自动加拼音，带阴影 */}
            {msg.role === 'ai' && (
              <MessageContent text={msg.text} isAi={true} />
            )}

            {msg.role === 'error' && <div className="text-red-400 text-sm mt-2">{msg.text}</div>}
          </div>
        ))}
        
        {/* 识别中的临时文字显示 */}
        {interimText && (
          <div className="text-lg text-emerald-400 font-light animate-pulse border-l-2 border-emerald-400 pl-3">
            {interimText}...
          </div>
        )}
      </div>

      {/* 底部控制区 */}
      <div className="absolute bottom-0 w-full z-20 pb-8 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent flex flex-col items-center justify-end">
        
        {/* 状态文案提示区 */}
        <div className="h-8 mb-4 flex items-center justify-center">
          {status === 'recording' && <span className="text-red-400 font-bold tracking-widest text-xs uppercase animate-pulse">正在倾听...</span>}
          {status === 'processing' && <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase flex items-center gap-2"><i className="fas fa-circle-notch fa-spin"/> 思考中...</span>}
          {status === 'speaking' && (
            <div className="voice-wave h-4 flex items-center">
              <span className="h-2" /><span className="h-4" /><span className="h-3" /><span className="h-2" />
            </div>
          )}
          {status === 'idle' && !textMode && <span className="text-white/30 text-xs font-medium tracking-widest uppercase">点击头像说话</span>}
        </div>

        {/* 控制面板：语音按钮 OR 键盘输入框 */}
        <div className="w-full px-6">
          {!textMode ? (
            <div className="flex items-center justify-between max-w-sm mx-auto">
              
              {/* 语言切换 */}
              <button 
                onClick={() => setShowLangPicker(true)}
                className="w-12 h-12 rounded-full bg-white/5 flex flex-col items-center justify-center border border-white/10 active:bg-white/10"
              >
                <span className="text-lg">{currentLang.flag}</span>
              </button>

              {/* AI 头像麦克风按钮 (女教师图片) */}
              <button
                onClick={(e) => { 
                  e.preventDefault(); 
                  if(status === 'speaking' || status === 'processing' || status === 'recording') stopAll(); 
                  else handleStartRecord(); 
                }}
                className={`w-[85px] h-[85px] rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl relative z-30 touch-manipulation ${
                  status === 'recording' 
                    ? 'scale-110 shadow-red-500/50' 
                    : status === 'speaking'
                      ? 'scale-100 shadow-pink-500/30'
                      : 'hover:scale-105 active:scale-95'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-white/20 relative bg-slate-800">
                    {/* 美观的女教师 AI 头像 */}
                    <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="AI Tutor" />
                    
                    {/* 录音时的红框呼吸效果 */}
                    {status === 'recording' && <div className="absolute inset-0 bg-red-500/30 animate-pulse" />}
                    
                    {/* 说话或思考中时，显示停止按钮覆盖 */}
                    {(status === 'speaking' || status === 'processing' || status === 'recording') && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                         <i className="fas fa-stop text-2xl text-white" />
                      </div>
                    )}
                </div>
                {status === 'recording' && <div className="absolute inset-0 rounded-full border-[3px] border-red-500 opacity-60 animate-ping" />}
              </button>

              {/* 切换到文字模式 */}
              <button 
                onClick={() => setTextMode(true)}
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 active:bg-white/10"
              >
                <i className="fas fa-keyboard text-white/60 text-lg" />
              </button>

            </div>
          ) : (
            /* 文字聊天输入框 */
            <div className="flex items-center gap-2 bg-slate-900/80 border border-white/20 p-2 rounded-full backdrop-blur-md fade-in">
              <button onClick={() => setTextMode(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <i className="fas fa-microphone text-white/60" />
              </button>
              <input
                type="text"
                className="flex-1 bg-transparent px-2 py-2 text-[15px] text-white outline-none placeholder-white/30"
                placeholder="输入你想说的..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(inputText);
                    setInputText('');
                  }
                }}
              />
              <button 
                onClick={() => { handleSubmit(inputText); setInputText(''); }} 
                className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 active:scale-95"
              >
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 语言选择弹窗 */}
      {showLangPicker && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowLangPicker(false)}>
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-xs overflow-hidden" onClick={e=>e.stopPropagation()}>
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
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowSettings(false)}>
          <div className="bg-slate-900 border-t sm:border border-white/10 w-full max-w-md h-[80vh] sm:h-auto sm:rounded-2xl rounded-t-2xl flex flex-col fade-in" onClick={e=>e.stopPropagation()}>
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-white">⚙️ 设置</h3>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 bg-white/10 rounded-full text-sm">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div>
                <label className="text-xs text-slate-400 mb-2 block">发音人</label>
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
                  <span>语速 ({settings.ttsSpeed})</span>
                  <span>音调 ({settings.ttsPitch})</span>
                </div>
                <div className="flex gap-4 items-center">
                   <input 
                     type="range" min="-50" max="50" 
                     className="flex-1 accent-pink-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                     value={settings.ttsSpeed}
                     onChange={e => setSettings({...settings, ttsSpeed: parseInt(e.target.value)})}
                   />
                   {/* 音调：完美支持 0.89 这种小数 */}
                   <input 
                     type="number" step="0.01" min="0.1" max="2.0"
                     className="w-20 bg-black/30 border border-white/10 rounded p-2 text-center text-sm text-white"
                     value={settings.ttsPitch}
                     onChange={e => setSettings({...settings, ttsPitch: parseFloat(e.target.value)})}
                   />
                </div>
              </div>

              <div>
                 <label className="text-xs text-slate-400 mb-2 block">Prompt 系统指令</label>
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
