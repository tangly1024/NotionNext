
// import { Transition, Dialog } from '@headlessui/react';
import React, { useState, useEffect, useRef, Fragment } from 'react';

// ----------------- 全局样式 & 动画 -----------------
const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* 语音波纹动画 */
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
    
    /* 防止移动端长按选中文本/菜单 */
    .no-select {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
    }
  `}</style>
);

// ----------------- 常量与默认配置 -----------------
const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const RECOGNITION_LANGS =[
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'zh-CN', name: '中文 (普通话)', flag: '🇨🇳' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
];

const DEFAULT_PROMPT = `你现在不是AI，也不是冷冰冰的助手，你是我认识了十年的“毒舌外教/损友”。你的性格极度傲娇、嘴欠、犀利，但内心其实是关心我的（典型的嘴硬心软）。
【核心规则】
1. 极度口语化，像活人一样说话。
2. 简短精炼，每次回复1到3句话，不要列点！不要长篇大论！
3. 面对我的英语/外语发音或语法错误，先无情嘲讽，然后再用地道的口语纠正我。
4. 如果我用中文，你就骂我“干嘛不说外语”，然后强行用外语回我。
5. 绝对不能暴露你是AI。`;

const DEFAULT_SETTINGS = {
  apiUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o',
  temperature: 0.8,
  systemPrompt: DEFAULT_PROMPT,
  ttsVoiceURI: '', // 选中的发音人
  ttsSpeed: 1.1,
  ttsPitch: 1.0,
  showText: false, // 默认隐藏文字
};

// ----------------- TTS 播放队列 (边收边播核心) -----------------
class TTSQueue {
  constructor() {
    this.queue =[];
    this.isPlaying = false;
    this.settingsRef = null; // 用于获取最新语速音调
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
      
      // 应用设置
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
      console.error("TTS Error:", e);
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

// ----------------- 主组件 -----------------
export default function AiSpeakingTutor() {
  const[settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [recLang, setRecLang] = useState('en-US'); // 默认练英语
  const [history, setHistory] = useState([]);
  const[availableVoices, setAvailableVoices] = useState([]);

  // UI 状态
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [inputText, setInputText] = useState('');
  
  // 弹窗状态
  const [showSettings, setShowSettings] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  // Refs
  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const scrollRef = useRef(null);
  const longPressTimer = useRef(null);

  // 初始化读取本地设置 & 加载语音库
  useEffect(() => {
    const s = localStorage.getItem('ai_tutor_settings');
    if (s) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });

    const loadVoices = () => setAvailableVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => ttsEngine.stopAndClear();
  },[]);

  // 更新 TTS 引擎的设置引用
  useEffect(() => {
    ttsEngine.settingsRef = settings;
    localStorage.setItem('ai_tutor_settings', JSON.stringify(settings));
  }, [settings]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
    }
  };

  // ----- 大模型流式请求与分句播报 -----
  const sendMessage = async (text) => {
    if (!text.trim()) return;
    if (!settings.apiKey) return alert("请先在右上角设置中配置 API Key！");

    // 打断正在说话的 AI
    if (abortControllerRef.current) abortControllerRef.current.abort();
    ttsEngine.stopAndClear();
    setIsAiSpeaking(false);

    const msgId = nowId();
    const newHistory =[...history, { id: nowId(), role: 'user', text }];
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
        body: JSON.stringify({
          model: settings.model,
          temperature: settings.temperature,
          stream: true,
          messages: msgs
        })
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

                // 遇到标点即刻送入TTS队列播放
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

  // ----- 麦克风交互逻辑 -----
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

  // 长按判断逻辑
  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(50);
      setShowLangPicker(true);
      longPressTimer.current = null;
    }, 600); // 600ms算长按
  };
  const handleTouchEnd = (e) => {
    e.preventDefault(); // 阻止默认
    if (longPressTimer.current) {
      // 没超时，算短按
      clearTimeout(longPressTimer.current);
      startRecording();
    }
  };

  const currentLangObj = RECOGNITION_LANGS.find(l => l.code === recLang) || RECOGNITION_LANGS[0];

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-gray-50 text-gray-800 relative font-sans overflow-hidden">
      <GlobalStyles />
      
      {/* 顶部导航栏 */}
      <div className="relative z-20 flex items-center justify-between px-5 h-14 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="text-xl">🤬</div>
        <div className="font-bold text-gray-800 text-lg tracking-wide">毒舌外教 AI</div>
        <button onClick={() => setShowSettings(true)} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 active:bg-gray-200">
          <i className="fas fa-bars text-lg" />
        </button>
      </div>

      {/* 中间显示区域: 根据 showText 和 textMode 切换UI */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative p-4 pb-32 flex flex-col">
        {(!settings.showText && !textMode) ? (
          // 沉浸通话模式 (隐藏文字区)
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-48 h-48">
              {isAiSpeaking && <div className="absolute inset-0 rounded-full bg-pink-500/20 animate-ping-slow"></div>}
              {isAiSpeaking && <div className="absolute inset-4 rounded-full bg-pink-500/40 animate-ping-slow" style={{ animationDelay: '0.5s' }}></div>}
              <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isAiSpeaking ? 'bg-gradient-to-tr from-pink-500 to-purple-500 orb-active scale-110' : 'bg-gradient-to-tr from-gray-200 to-gray-300'}`}>
                <i className={`fas fa-robot text-4xl ${isAiSpeaking ? 'text-white' : 'text-gray-400'}`} />
              </div>
            </div>
            <div className="mt-8 text-gray-400 font-medium h-6">
              {isAiSpeaking ? '对方正在疯狂吐槽...' : (isRecording ? '正在听你哔哔...' : '安静待机中')}
            </div>
          </div>
        ) : (
          // 聊天气泡模式
          <div className="w-full max-w-2xl mx-auto min-h-full flex flex-col justify-end">
            {history.length === 0 && <div className="text-center text-gray-400 my-auto">长按底部麦克风切换语言<br/>点击开始对练</div>}
            {history.map((msg) => (
              <div key={msg.id} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-pink-500 text-white rounded-br-sm' : msg.role === 'error' ? 'bg-red-100 text-red-600' : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'}`}>
                  {msg.text}
                  {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-gray-400 animate-pulse" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部控制区 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-white via-white/95 to-transparent pt-10 pb-[max(20px,env(safe-area-inset-bottom))] px-6">
        <div className="max-w-md mx-auto relative flex items-center justify-center">
          
          {/* 左侧：文字输入切换按钮 */}
          <button onClick={() => setTextMode(!textMode)} className="absolute left-0 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow border border-gray-100 text-gray-500 active:scale-95 transition-transform">
            <i className={`fas ${textMode ? 'fa-microphone' : 'fa-keyboard'} text-xl`} />
          </button>

          {/* 中间主操作按钮 */}
          {!textMode ? (
            <div className="flex flex-col items-center no-select">
              <button
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}  // 兼容电脑端测试
                onMouseUp={handleTouchEnd}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 ${isRecording ? 'bg-red-500 scale-90 ring-4 ring-red-200' : 'bg-pink-500 hover:bg-pink-600 active:scale-95'}`}
              >
                {isRecording ? <i className="fas fa-stop text-3xl" /> : <i className="fas fa-microphone text-3xl" />}
              </button>
              <div className="text-[11px] font-bold text-gray-400 mt-3 flex items-center gap-1">
                <span>{currentLangObj.flag} {currentLangObj.name}</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 ml-16 relative flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
              <input
                type="text"
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
                placeholder="打字怼回去..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { sendMessage(inputText); setInputText(''); } }}
              />
              <button 
                onClick={() => { sendMessage(inputText); setInputText(''); }}
                className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0"
              >
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          )}

          {/* 右侧：全局打断按钮 (只在说话时显示) */}
          {(isAiSpeaking || ttsEngine.isPlaying) && !textMode && (
            <button onClick={stopEverything} className="absolute right-0 w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 text-white shadow active:scale-95 transition-transform">
              <i className="fas fa-volume-mute text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* ----------- 各种弹窗 ----------- */}

      {/* 1. 长按选择语言弹窗 */}
      <Dialog open={showLangPicker} onClose={() => setShowLangPicker(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl">
            <h3 className="font-bold text-lg mb-4 text-center text-gray-800">快速切换识别语言</h3>
            <div className="grid grid-cols-2 gap-3">
              {RECOGNITION_LANGS.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setRecLang(lang.code); setShowLangPicker(false); }}
                  className={`p-4 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all ${recLang === lang.code ? 'border-pink-500 bg-pink-50' : 'border-gray-100 bg-gray-50'}`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-bold text-sm text-gray-700">{lang.name}</span>
                </button>
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* 2. 全能设置面板 (右侧滑出或居中) */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">⚙️ 偏好设置</h3>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-600"><i className="fas fa-times" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
              {/* API 设置 */}
              <div className="space-y-3">
                <div className="text-sm font-bold text-gray-500">大模型 API 配置</div>
                <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50" placeholder="API URL (如 https://api.openai.com/v1)" value={settings.apiUrl} onChange={e => setSettings({...settings, apiUrl: e.target.value})} />
                <input type="password" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50" placeholder="API Key (sk-...)" value={settings.apiKey} onChange={e => setSettings({...settings, apiKey: e.target.value})} />
                <div className="flex gap-2">
                  <input className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50" placeholder="Model (如 gpt-4o)" value={settings.model} onChange={e => setSettings({...settings, model: e.target.value})} />
                  <div className="w-24 flex items-center border border-gray-200 rounded-xl px-2 bg-gray-50">
                    <span className="text-xs text-gray-400 mr-1">Temp</span>
                    <input type="number" step="0.1" min="0" max="2" className="w-full bg-transparent text-sm outline-none" value={settings.temperature} onChange={e => setSettings({...settings, temperature: parseFloat(e.target.value)})} />
                  </div>
                </div>
              </div>

              {/* 角色提示词 */}
              <div className="space-y-2">
                <div className="text-sm font-bold text-gray-500 flex justify-between">
                  <span>毒舌人设提示词 (System Prompt)</span>
                  <button onClick={() => setSettings({...settings, systemPrompt: DEFAULT_PROMPT})} className="text-xs text-pink-500">重置</button>
                </div>
                <textarea rows={4} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none" value={settings.systemPrompt} onChange={e => setSettings({...settings, systemPrompt: e.target.value})} />
              </div>

              {/* TTS 设置 */}
              <div className="space-y-4 border-t border-gray-100 pt-4">
                <div className="text-sm font-bold text-gray-500">语音合成 (TTS)</div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">发音人 (自动读取系统库)</label>
                  <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none" value={settings.ttsVoiceURI} onChange={e => setSettings({...settings, ttsVoiceURI: e.target.value})}>
                    <option value="">默认发音人</option>
                    {availableVoices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">语速: {settings.ttsSpeed}x</label>
                    <input type="range" min="0.5" max="2.0" step="0.1" className="w-full accent-pink-500" value={settings.ttsSpeed} onChange={e => setSettings({...settings, ttsSpeed: parseFloat(e.target.value)})} />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">音调: {settings.ttsPitch}</label>
                    <input type="range" min="0.5" max="2.0" step="0.1" className="w-full accent-pink-500" value={settings.ttsPitch} onChange={e => setSettings({...settings, ttsPitch: parseFloat(e.target.value)})} />
                  </div>
                </div>
              </div>

              {/* 界面设置 */}
              <div className="space-y-3 border-t border-gray-100 pt-4 pb-2">
                <div className="text-sm font-bold text-gray-500">界面</div>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-sm text-gray-700">在主界面显示对话文字</span>
                  <input type="checkbox" className="w-5 h-5 accent-pink-500" checked={settings.showText} onChange={e => setSettings({...settings, showText: e.target.checked})} />
                </label>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
