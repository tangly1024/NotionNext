import React, { useState, useEffect, useRef } from 'react';

// --- 全局动画 ---
const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes ping-slow {
      75%, 100% { transform: scale(2); opacity: 0; }
    }
    .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
    @keyframes pulse-ring {
      0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(236, 72, 153, 0); }
      100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
    }
    .orb-active { animation: pulse-ring 1.5s infinite; }
  `}</style>
);

const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const RECOGNITION_LANGS =[
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'zh-CN', name: '中文 (普通话)', flag: '🇨🇳' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
];

const DEFAULT_PROMPT = `你现在不是AI，也不是冷冰冰的助手，你是我认识了十年的“毒舌外教/损友”。你的性格极度傲娇、嘴欠、犀利，但内心其实是关心我的（典型的嘴硬心软）。
【核心规则】
1. 极度口语化，像活人一样说话。
2. 简短精炼，每次回复1到3句话，不要列点！不要长篇大论！
3. 面对我的发音或语法错误，先无情嘲讽，然后再纠正我。
4. 绝对不能暴露你是AI。`;

const DEFAULT_SETTINGS = {
  apiUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o',
  temperature: 0.8,
  systemPrompt: DEFAULT_PROMPT,
  ttsVoiceURI: '',
  ttsSpeed: 1.1,
  ttsPitch: 1.0,
  showText: false,
};

// --- TTS 边收边播引擎 ---
class TTSQueue {
  constructor() {
    this.queue =[];
    this.isPlaying = false;
    this.settingsRef = null;
  }
  push(text) {
    if (!text.trim()) return;
    this.queue.push(text);
    this.playNext();
  }
  playNext() {
    if (this.isPlaying || this.queue.length === 0) return;
    this.isPlaying = true;
    const text = this.queue.shift();
    try {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.settingsRef) {
        utterance.rate = this.settingsRef.ttsSpeed;
        utterance.pitch = this.settingsRef.ttsPitch;
        if (this.settingsRef.ttsVoiceURI) {
          const voices = synth.getVoices();
          const selectedVoice = voices.find(v => v.voiceURI === this.settingsRef.ttsVoiceURI);
          if (selectedVoice) utterance.voice = selectedVoice;
        }
      }
      utterance.onend = () => { this.isPlaying = false; this.playNext(); };
      utterance.onerror = () => { this.isPlaying = false; this.playNext(); };
      synth.speak(utterance);
    } catch (e) {
      console.error(e);
      this.isPlaying = false;
      this.playNext();
    }
  }
  stopAndClear() {
    this.queue =[];
    window.speechSynthesis.cancel();
    this.isPlaying = false;
  }
}
const ttsEngine = new TTSQueue();

export default function VoiceChat({ isOpen, onClose }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [recLang, setRecLang] = useState('en-US');
  const [history, setHistory] = useState([]);
  const [availableVoices, setAvailableVoices] = useState([]);

  const [isRecording, setIsRecording] = useState(false);
  const[isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [inputText, setInputText] = useState('');
  
  const[showSettings, setShowSettings] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const scrollRef = useRef(null);
  const longPressTimer = useRef(null);

  useEffect(() => {
    const s = localStorage.getItem('ai_tutor_settings');
    if (s) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });
    const loadVoices = () => setAvailableVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => ttsEngine.stopAndClear();
  },[]);

  useEffect(() => {
    ttsEngine.settingsRef = settings;
    localStorage.setItem('ai_tutor_settings', JSON.stringify(settings));
  }, [settings]);

  const scrollToBottom = () => {
    if (scrollRef.current) setTimeout(() => scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    if (!settings.apiKey) {
      alert("请先在右上角设置中配置 API Key！");
      setShowSettings(true);
      return;
    }

    if (abortControllerRef.current) abortControllerRef.current.abort();
    ttsEngine.stopAndClear();
    setIsAiSpeaking(false);

    const msgId = nowId();
    const newHistory = [...history, { id: nowId(), role: 'user', text }];
    setHistory([...newHistory, { id: msgId, role: 'ai', text: '', isStreaming: true }]);
    scrollToBottom();

    abortControllerRef.current = new AbortController();
    setIsAiSpeaking(true);

    try {
      const msgs =[
        { role: 'system', content: settings.systemPrompt },
        ...newHistory.map(h => ({ role: h.role === 'ai' ? 'assistant' : 'user', content: h.text }))
      ];

      const res = await fetch(`${settings.apiUrl.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${settings.apiKey}` },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({ model: settings.model, temperature: settings.temperature, stream: true, messages: msgs })
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';
      let sentenceBuffer = ''; 

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
            if (sentenceBuffer.trim()) ttsEngine.push(sentenceBuffer.trim());
            break;
        }
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(l => l.trim() !== '');
        
        for (const line of lines) {
          if (line === 'data: [DONE]') break;
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const char = data.choices[0]?.delta?.content || '';
              if (char) {
                fullText += char;
                sentenceBuffer += char;
                setHistory(prev => prev.map(m => m.id === msgId ? { ...m, text: fullText } : m));
                scrollToBottom();
                if (/[。！？.!?\n]/.test(char)) {
                  ttsEngine.push(sentenceBuffer.trim());
                  sentenceBuffer = '';
                }
              }
            } catch (e) {}
          }
        }
      }
      setHistory(prev => prev.map(m => m.id === msgId ? { ...m, isStreaming: false } : m));
    } catch (e) {
      if (e.name !== 'AbortError') setHistory(prev =>[...prev, { id: nowId(), role: 'error', text: e.message }]);
    } finally {
      setIsAiSpeaking(false);
    }
  };

  const startRecording = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return alert('当前浏览器不支持语音识别');

    ttsEngine.stopAndClear();
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsAiSpeaking(false);

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRec();
    recognition.lang = recLang;
    recognition.interimResults = false;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    if (navigator.vibrate) navigator.vibrate(50);
    setIsRecording(true);

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      if (text) sendMessage(text);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const stopEverything = () => {
    if (isRecording && recognitionRef.current) recognitionRef.current.stop();
    ttsEngine.stopAndClear();
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsRecording(false);
    setIsAiSpeaking(false);
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
      startRecording();
    }
  };

  if (!isOpen) return null;

  const currentLangObj = RECOGNITION_LANGS.find(l => l.code === recLang) || RECOGNITION_LANGS[0];

  return (
    <div className="fixed inset-0 z-[200] flex flex-col w-full h-[100dvh] bg-slate-900 text-slate-100 overflow-hidden">
      <GlobalStyles />
      {/* 动态唯美背景 */}
      <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200')" }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900"></div>
      
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-5 h-16 border-b border-white/10">
        <button onClick={() => { stopEverything(); onClose(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-90">
           <i className="fas fa-arrow-left"></i>
        </button>
        <div className="font-bold tracking-widest text-white text-sm">AI TUTOR</div>
        <button onClick={() => setShowSettings(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-90">
          <i className="fas fa-sliders-h" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative p-4 pb-32 flex flex-col z-10">
        {(!settings.showText && !textMode) ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-56 h-56">
              {isAiSpeaking && <div className="absolute inset-0 rounded-full bg-pink-500/30 animate-ping-slow"></div>}
              {isAiSpeaking && <div className="absolute inset-4 rounded-full bg-pink-500/50 animate-ping-slow" style={{ animationDelay: '0.5s' }}></div>}
              <div className={`w-36 h-36 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 border-4 border-white/10 backdrop-blur-md ${isAiSpeaking ? 'bg-gradient-to-tr from-pink-500 to-purple-500 orb-active scale-110' : 'bg-white/5'}`}>
                <i className={`fas fa-microphone-alt text-5xl ${isAiSpeaking ? 'text-white' : 'text-slate-500'}`} />
              </div>
            </div>
            <div className="mt-12 text-pink-300 font-medium tracking-wide">
              {isAiSpeaking ? 'AI 正在说话...' : (isRecording ? '正在倾听...' : '安静待机中')}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto min-h-full flex flex-col justify-end">
            {history.map((msg) => (
              <div key={msg.id} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-[15px] leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-pink-600 text-white rounded-br-sm' : msg.role === 'error' ? 'bg-red-500/20 text-red-200 border border-red-500/50' : 'bg-white/10 backdrop-blur-md text-slate-100 rounded-bl-sm border border-white/10'}`}>
                  {msg.text}
                  {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-pink-400 animate-pulse" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 pb-[max(24px,env(safe-area-inset-bottom))] px-6 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent pt-12">
        <div className="max-w-md mx-auto relative flex items-center justify-center">
          <button onClick={() => setTextMode(!textMode)} className="absolute left-0 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-95">
            <i className={`fas ${textMode ? 'fa-microphone' : 'fa-keyboard'}`} />
          </button>

          {!textMode ? (
            <div className="flex flex-col items-center">
              <button
                onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onMouseDown={handleTouchStart} onMouseUp={handleTouchEnd}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${isRecording ? 'bg-red-500 scale-90 ring-4 ring-red-500/30' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95'}`}
              >
                <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'} text-3xl`} />
              </button>
              <div className="text-[10px] font-bold text-slate-400 mt-3 tracking-widest uppercase">长按切换语言 · {currentLangObj.flag}</div>
            </div>
          ) : (
            <div className="flex-1 ml-16 relative flex items-center bg-white/10 border border-white/20 rounded-full p-1 backdrop-blur-md">
              <input type="text" className="flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder-slate-400" placeholder="打字回复..." value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { sendMessage(inputText); setInputText(''); } }} />
              <button onClick={() => { sendMessage(inputText); setInputText(''); }} className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0">
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          )}

          {(isAiSpeaking || ttsEngine.isPlaying) && !textMode && (
            <button onClick={stopEverything} className="absolute right-0 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-95">
              <i className="fas fa-volume-mute" />
            </button>
          )}
        </div>
      </div>

      {/* 原生纯 React 弹窗（替代 HeadlessUI） */}
      {showLangPicker && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLangPicker(false)}></div>
          <div className="relative bg-slate-800 border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <h3 className="font-bold text-lg mb-4 text-center text-white">选择语言</h3>
            <div className="grid grid-cols-2 gap-3">
              {RECOGNITION_LANGS.map(lang => (
                <button key={lang.code} onClick={() => { setRecLang(lang.code); setShowLangPicker(false); }} className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all ${recLang === lang.code ? 'border-pink-500 bg-pink-500/20' : 'border-white/10 bg-white/5'}`}>
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-bold text-xs text-slate-300">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}></div>
          <div className="relative bg-slate-800 border border-white/10 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-white">⚙️ AI 设置</h3>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full bg-white/10 text-slate-300"><i className="fas fa-times" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar text-slate-200 text-sm">
              <div className="space-y-3">
                <div className="font-bold text-slate-400 text-xs">API 配置</div>
                <input className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none focus:border-pink-500" placeholder="API URL" value={settings.apiUrl} onChange={e => setSettings({...settings, apiUrl: e.target.value})} />
                <input type="password" className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none focus:border-pink-500" placeholder="API Key (sk-...)" value={settings.apiKey} onChange={e => setSettings({...settings, apiKey: e.target.value})} />
                <div className="flex gap-2">
                  <input className="flex-1 border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" placeholder="Model" value={settings.model} onChange={e => setSettings({...settings, model: e.target.value})} />
                  <div className="w-24 flex items-center border border-white/10 rounded-xl px-2 bg-slate-900/50">
                    <span className="text-xs text-slate-500 mr-1">Temp</span>
                    <input type="number" step="0.1" className="w-full bg-transparent outline-none" value={settings.temperature} onChange={e => setSettings({...settings, temperature: parseFloat(e.target.value)})} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-bold text-slate-400 text-xs flex justify-between">
                  <span>系统提示词 (System Prompt)</span>
                  <button onClick={() => setSettings({...settings, systemPrompt: DEFAULT_PROMPT})} className="text-pink-400">重置</button>
                </div>
                <textarea rows={4} className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" value={settings.systemPrompt} onChange={e => setSettings({...settings, systemPrompt: e.target.value})} />
              </div>
              <div className="space-y-4 border-t border-white/10 pt-4">
                <div className="font-bold text-slate-400 text-xs">语音合成 (TTS)</div>
                <select className="w-full border border-white/10 rounded-xl px-3 py-2 bg-slate-900/50 outline-none" value={settings.ttsVoiceURI} onChange={e => setSettings({...settings, ttsVoiceURI: e.target.value})}>
                  <option value="">默认系统发音人</option>
                  {availableVoices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
                </select>
                <div className="flex gap-4">
                  <div className="flex-1"><label className="text-xs text-slate-400 block mb-1">语速: {settings.ttsSpeed}x</label><input type="range" min="0.5" max="2.0" step="0.1" className="w-full accent-pink-500" value={settings.ttsSpeed} onChange={e => setSettings({...settings, ttsSpeed: parseFloat(e.target.value)})} /></div>
                  <div className="flex-1"><label className="text-xs text-slate-400 block mb-1">音调: {settings.ttsPitch}</label><input type="range" min="0.5" max="2.0" step="0.1" className="w-full accent-pink-500" value={settings.ttsPitch} onChange={e => setSettings({...settings, ttsPitch: parseFloat(e.target.value)})} /></div>
                </div>
              </div>
              <div className="space-y-3 border-t border-white/10 pt-4 pb-2">
                <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/10">
                  <span>显示对话文字</span>
                  <input type="checkbox" className="w-5 h-5 accent-pink-500" checked={settings.showText} onChange={e => setSettings({...settings, showText: e.target.checked})} />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
