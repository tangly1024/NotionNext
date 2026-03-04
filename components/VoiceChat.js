'use client';

import React, { useState, useEffect, useRef } from 'react';
// 必须安装 pinyin-pro 才能实现完美拼音包裹: npm install pinyin-pro
import { pinyin } from 'pinyin-pro';

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

    /* 拼音 Ruby 样式 */
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
1. 严禁生成拼音或注音（拼音由前端自动生成），只输出汉字和缅甸语。
2. 严禁中缅文混排，必须用句号严格隔开。
3. 提示词标签如 Target Sentence: 或 Meaning: 请使用英文。
4. 每轮回复包含：
   - 毒舌评价（缅文）
   - 纠错（如有）
   - Target Sentence: 目标句（中文）
   - Meaning: 解释（缅文）
5. 不要输出 Markdown 标题（#），直接纯文本。`;

const DEFAULT_SETTINGS = {
  apiUrl: 'https://api.mistral.ai/v1',
  apiKey: 'xLnM3QMeVS1XoIG9LcdJUmzYLExYLvAq', // 请替换为你的真实 Key
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
// 文本渲染组件 (智能拼音包裹 & 隐藏标签)
// =========================
const MessageContent = ({ text, isAi }) => {
  // 1. 彻底清洗不需要显示的标签和符号
  let cleanText = text
    .replace(/\*\*/g, '') // 移除加粗符号
    .replace(/#/g, '') // 移除标题符号
    .replace(/Target Sentence:|Meaning:|Correction:/gi, '') // 隐藏提示词
    .replace(/\[.*?\]/g, '') // 隐藏情绪标签
    .trim();

  // 2. 拼音处理：遍历每个字符，如果是汉字就包裹 <ruby>，否则原样显示
  const renderTextWithPinyin = (str) => {
    try {
      // pinyin-pro 返回包含每个字符信息的数组
      const pyArray = pinyin(str, { type: 'all' });
      return pyArray.map((item, idx) => {
        if (item.isZh) {
          return <ruby key={idx}>{item.origin}<rt>{item.pinyin}</rt></ruby>;
        }
        return <span key={idx}>{item.origin}</span>;
      });
    } catch (e) {
      // 降级处理：如果没有安装 pinyin-pro 或报错，直接显示汉字
      return str;
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
// TTS 引擎 (修复重叠 & 清洗提示词)
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

  // 预热音频上下文
  unlockAudio() {
    try {
      const a = new Audio('data:audio/mp3;base64,//MkxAAQAAAAgAAAAAAAAAAAAAAP//AwAAAAAAAAAAAAA=');
      a.play().catch(() => {});
    } catch {}
  }

  emitState() {
    this.onStateChange?.({ isPlaying: this.isPlaying });
  }

  // 核心：彻底清洗掉 TTS 不该读出的内容（不读英文标签、Markdown）
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
    if (/[\u1000-\u109F]/.test(text)) return 'my-MM-NilarNeural'; // 缅文
    if (/[a-zA-Z]/.test(text) && !/[\u4e00-\u9fa5]/.test(text)) return 'en-US-JennyNeural'; // 纯英文
    return s.ttsVoice; // 中文或混合默认
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

    // 根据标点符号或语言拆分，避免单次请求过长
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
    
    // 立即加锁，防止连续调用导致多个音频同时加载
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
      this.playNext(); // 递归播放下一个
    };

    audio.onended = handleEnd;
    audio.onerror = handleEnd;

    audio.play().catch((e) => {
      console.warn('Play blocked', e);
      handleEnd();
    });
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
  
  const [showSettings, setShowSettings] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);
  const silenceTimer = useRef(null);
  const abortCtrl = useRef(null);

  // 初始化
  useEffect(() => {
    const saved = localStorage.getItem('ai_tutor_v8');
    if (saved) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
    
    ttsEngine.setStateCallback(({ isPlaying }) => {
      setStatus(prev => {
        if (isPlaying) return 'speaking';
        // 只有当前是 speaking 时才切回 idle，防止覆盖 processing
        if (prev === 'speaking') return 'idle';
        return prev;
      });
    });

    return () => stopAll();
  }, []);

  useEffect(() => {
    localStorage.setItem('ai_tutor_v8', JSON.stringify(settings));
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
      recognitionRef.current.onend = null; // 防止触发额外逻辑
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
    rec.lang = recLang; // 严格传递所选语言
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

    rec.onerror = (e) => console.error(e);
    
    rec.onend = () => {
      // 只有在单纯因为静音断开时，才切回 idle。如果在 processing 就不管它
      setStatus(prev => prev === 'recording' ? 'idle' : prev);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const handleSubmit = async (text) => {
    const cleanText = text.trim();
    if (!cleanText) {
      setStatus('idle');
      return;
    }

    setStatus('processing'); // 显示思考中
    setInterimText('');
    
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

                // 遇到标点推给 TTS
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

      // 如果流结束了且 TTS 还没开始播放，重置为 idle
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
      
      {/* 沉浸式背景图 */}
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

      {/* 聊天内容区：无气泡、直接贴在背景上 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative z-10 p-5 flex flex-col gap-8 pb-40">
        {history.map((msg) => (
          <div key={msg.id} className="flex flex-col items-start fade-in w-full">
            {msg.role === 'user' && (
              <div className="text-[16px] pl-3 border-l-2 border-white/20 text-white/50 mb-2">
                {msg.text}
              </div>
            )}
            
            {msg.role === 'ai' && (
              <MessageContent text={msg.text} isAi={true} />
            )}

            {msg.role === 'error' && <div className="text-red-400 text-sm mt-2">{msg.text}</div>}
          </div>
        ))}
        
        {interimText && (
          <div className="text-xl text-emerald-400 font-light animate-pulse border-l-2 border-emerald-400 pl-3">
            {interimText}...
          </div>
        )}
      </div>

      {/* 底部控制区 */}
      <div className="absolute bottom-0 w-full z-20 pb-8 pt-12 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent flex flex-col items-center justify-end">
        
        <div className="mb-6 h-6 flex items-center justify-center">
          {status === 'recording' && <span className="text-red-400 font-bold tracking-widest text-xs uppercase animate-pulse">Recording...</span>}
          {status === 'processing' && <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase flex items-center gap-2"><i className="fas fa-circle-notch fa-spin"/> Thinking...</span>}
          {status === 'speaking' && (
            <div className="voice-wave h-4 flex items-center">
              <span className="h-2" /><span className="h-4" /><span className="h-3" /><span className="h-2" />
            </div>
          )}
          {status === 'idle' && <span className="text-white/40 text-xs font-medium tracking-widest uppercase">Tap to speak</span>}
        </div>

        <div className="flex items-center gap-8">
          {/* 语言切换 */}
          <button 
             onClick={() => setShowLangPicker(true)}
             className="w-12 h-12 rounded-full bg-white/5 flex flex-col items-center justify-center border border-white/10 active:bg-white/10"
          >
            <span className="text-lg">{currentLang.flag}</span>
            <span className="text-[9px] text-white/50 font-bold mt-[-2px]">{currentLang.code.split('-')[0]}</span>
          </button>

          {/* 麦克风 / AI 教师头像按钮 - 使用纯 onClick */}
          <button
            onClick={(e) => { 
              e.preventDefault(); 
              if(status === 'speaking' || status === 'processing') stopAll(); 
              else handleStartRecord(); 
            }}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl relative z-30 touch-manipulation ${
              status === 'recording' 
                ? 'bg-red-500 scale-110 shadow-red-500/50' 
                : status === 'speaking'
                  ? 'scale-100 shadow-pink-500/30'
                  : 'hover:scale-105 active:scale-95'
            }`}
          >
            {status === 'speaking' ? (
              <div className="w-full h-full rounded-full bg-amber-500 flex items-center justify-center border-2 border-white/20">
                 <i className="fas fa-stop text-2xl text-white" />
              </div>
            ) : (
              <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-white/20 relative bg-slate-800">
                 {/* 优美的 AI 女教师头像 */}
                 <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="AI Tutor" />
                 {status === 'recording' && <div className="absolute inset-0 bg-red-500/40 animate-pulse" />}
              </div>
            )}
            {status === 'recording' && <div className="absolute inset-0 rounded-full border-[3px] border-white opacity-50 animate-ping" />}
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
          <div className="bg-slate-900 border-t sm:border border-white/10 w-full max-w-md h-[80vh] sm:h-auto sm:rounded-2xl rounded-t-2xl flex flex-col animate-[fadeIn_0.3s_ease-out]" onClick={e=>e.stopPropagation()}>
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
                <div className="flex gap-4 items-center">
                   <input 
                     type="range" min="-50" max="50" 
                     className="flex-1 accent-pink-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                     value={settings.ttsSpeed}
                     onChange={e => setSettings({...settings, ttsSpeed: parseInt(e.target.value)})}
                   />
                   {/* 修复音调无法设置小数的问题 */}
                   <input 
                     type="number" step="0.01" min="0.1" max="2.0"
                     className="w-20 bg-black/30 border border-white/10 rounded p-2 text-center text-sm text-white"
                     value={settings.ttsPitch}
                     onChange={e => setSettings({...settings, ttsPitch: parseFloat(e.target.value)})}
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
