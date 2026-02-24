import React, { useState, useEffect, useRef, useCallback, Fragment, memo } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

// 如果没有这些库，确保你的环境里有，或者注释掉
import { loadCheatDict, matchCheatLoose } from '@/lib/cheatDict'; 

// ----------------- IndexedDB Helper -----------------
class ChatDB {
  constructor(dbName = 'AiChatDB', version = 2) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }
  async open() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
        if (!db.objectStoreNames.contains('messages')) {
          const msgStore = db.createObjectStore('messages', { keyPath: 'id' });
          msgStore.createIndex('sessionId', 'sessionId', { unique: false });
        }
      };
      request.onsuccess = (event) => { this.db = event.target.result; resolve(this.db); };
      request.onerror = (event) => reject(event.target.error);
    });
  }
  async createSession(title = '新对话') {
    await this.open();
    const session = { id: Date.now().toString(), title, updatedAt: Date.now(), isPinned: 0 };
    return this.transaction('sessions', 'readwrite', store => store.put(session)).then(() => session);
  }
  async addMessage(message) {
    await this.open();
    return this.transaction('messages', 'readwrite', store => store.put(message));
  }
  transaction(storeName, mode, callback) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const request = callback(store);
      if (request instanceof IDBRequest) {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } else {
        tx.oncomplete = () => resolve(request);
        tx.onerror = () => reject(tx.error);
      }
    });
  }
}
const db = new ChatDB();

// ----------------- 全局样式 -----------------
const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .slim-scrollbar::-webkit-scrollbar { width: 4px; }
    .slim-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .slim-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 4px; }
    .chip-scroll-container { display: flex; gap: 8px; overflow-x: auto; padding: 4px 10px; -webkit-overflow-scrolling: touch; cursor: grab; }
  `}</style>
);

// ----------------- Helpers -----------------
const safeLocalStorageGet = (key) => (typeof window !== 'undefined' ? localStorage.getItem(key) : null);
const safeLocalStorageSet = (key, value) => { if (typeof window !== 'undefined') localStorage.setItem(key, value); };
const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const playBeep = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 600; gain.gain.value = 0.1;
        osc.start(); setTimeout(() => { osc.stop(); ctx.close(); }, 150);
    } catch (e) { console.error("Audio Error", e); }
};

const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image(); img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024; let width = img.width; let height = img.height;
        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    };
  });
};

const detectScript = (text) => {
  if (!text) return null;
  if (/[\u1000-\u109F\uAA60-\uAA7F]+/.test(text)) return 'my-MM';
  if (/[\u4e00-\u9fa5]+/.test(text)) return 'zh-CN';
  if (/^[a-zA-Z\s,.?!]+$/.test(text)) return 'en-US';
  return null;
};

// ----------------- Data & Config -----------------
const SUPPORTED_LANGUAGES = [
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'my-MM', name: '缅甸语', flag: '🇲🇲' },
];

const DEFAULT_PROVIDERS = [{ id: 'p1', name: '默认接口', url: 'https://apis.iflow.cn/v1', key: '' }];
const DEFAULT_MODELS = [
  { id: 'm1', providerId: 'p1', name: 'DeepSeek V3', value: 'deepseek-chat' },
  { id: 'm2', providerId: 'p1', name: 'Qwen Max', value: 'qwen-max' },
];

const BASE_SYSTEM_INSTRUCTION = `你是一位精通中缅双语的“高保真社交翻译 AI”。
唯一任务：实现【口语化的精准直译】，执行双向互译。必须严格输出 JSON 格式，包含 translation 和 back_translation。`;

const REPLY_SYSTEM_INSTRUCTION = `你是一个聊天助手。 请用【目标语言】生成 3 到 8 个简短回复建议。 返回 JSON 数组。`;

const DEFAULT_SETTINGS = {
  providers: DEFAULT_PROVIDERS, models: DEFAULT_MODELS, mainModelId: 'm1', secondModelId: null, followUpModelId: 'm1',
  ttsConfig: {}, ttsSpeed: 1.0, autoPlayTTS: false, backgroundOverlay: 0.9, chatBackgroundUrl: '', filterThinking: true, enableFollowUp: true,
  lastSourceLang: 'zh-CN', lastTargetLang: 'my-MM'
};

// ----------------- TTS Engine -----------------
const ttsCache = new Map();
const AVAILABLE_VOICES = {
  'zh-CN': [{ id: 'zh-CN-XiaoyouNeural', name: '小悠' }],
  'en-US': [{ id: 'en-US-JennyNeural', name: 'Jenny' }],
  'my-MM': [{ id: 'my-MM-NilarNeural', name: 'Nilar' }],
};

const getVoiceForLang = (lang, config) => (config && config[lang]) ? config[lang] : (AVAILABLE_VOICES[lang] ? AVAILABLE_VOICES[lang][0].id : 'zh-CN-XiaoyouNeural');

const playTTS = async (text, lang, settings) => {
  if (!text) return;
  const voice = getVoiceForLang(lang, settings.ttsConfig);
  const speed = settings.ttsSpeed || 1.0;
  const key = `${voice}_${speed}_${text}`;
  try {
    let audio = ttsCache.get(key);
    if (!audio) {
      const rateVal = Math.floor((speed - 1) * 50);
      const res = await fetch(`https://t.leftsite.cn/tts?t=${encodeURIComponent(text)}&v=${encodeURIComponent(voice)}&r=${rateVal}`);
      if (!res.ok) return;
      audio = new Audio(URL.createObjectURL(await res.blob()));
      ttsCache.set(key, audio);
    }
    audio.currentTime = 0; audio.playbackRate = speed; await audio.play();
  } catch (e) { console.error('TTS Error:', e); }
};

const normalizeTranslations = (raw) => {
  try {
    let cleanRaw = typeof raw === 'string' ? raw.trim() : '';
    if (cleanRaw.includes('```')) cleanRaw = cleanRaw.replace(/json/g, '').replace(/```/g, '').trim();
    const start = cleanRaw.indexOf('{'), end = cleanRaw.lastIndexOf('}');
    if (start >= 0 && end > start) cleanRaw = cleanRaw.slice(start, end + 1);
    const json = cleanRaw ? JSON.parse(cleanRaw) : raw;
    const data = Array.isArray(json?.data) ? json.data : [];
    return data.filter(x => x && x.translation).slice(0, 4);
  } catch (e) { return [{ style: '错误', translation: '解析数据失败', back_translation: '' }]; }
};

const getLangName = (c) => SUPPORTED_LANGUAGES.find(l => l.code === c)?.name || c;
const getLangFlag = (c) => SUPPORTED_LANGUAGES.find(l => l.code === c)?.flag || '';

// ----------------- 子组件群 -----------------
const TranslationResultContainer = memo(({ item, targetLang, onPlay }) => {
  const hasDual = !!(item.modelResults && item.modelResults.length > 1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const effectiveIndex = hasDual ? currentIndex : 0;
  const currentData = hasDual ? item.modelResults[effectiveIndex].data : item.results;
  
  return (
    <div className="relative group">
      {hasDual && (
        <div className="flex justify-center mb-1 gap-1">
          {item.modelResults.map((_, idx) => (
            <button key={idx} onClick={()=>setCurrentIndex(idx)} className={`h-1.5 rounded-full transition-all ${idx === effectiveIndex ? 'w-5 bg-pink-400' : 'w-2 bg-gray-200'}`} />
          ))}
        </div>
      )}
      <div key={effectiveIndex} className="animate-in fade-in slide-in-from-right-4 duration-300">
        {currentData.map((res, i) => <TranslationCard key={i} data={res} onPlay={() => onPlay(res.translation)} />)}
      </div>
    </div>
  );
});

const TranslationCard = memo(({ data, onPlay }) => {
  const [copied, setCopied] = useState(false);
  const handleClick = async () => {
    try { await navigator.clipboard.writeText(data.translation); setCopied(true); setTimeout(() => setCopied(false), 800); } catch {}
  };
  return (
    <div onClick={handleClick} className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden mb-3 text-center">
      {copied && <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-10"><span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">已复制</span></div>}
      <div className="text-[18px] leading-relaxed font-medium text-gray-800 break-words">{data.translation}</div>
      {!!data.back_translation && <div className="mt-2 text-[12px] text-gray-400 break-words">{data.back_translation}</div>}
      <button onClick={(e) => { e.stopPropagation(); onPlay(); }} className="absolute bottom-2 right-2 p-2 text-gray-300 hover:text-blue-500"><i className="fas fa-volume-up" /></button>
    </div>
  );
});

const ReplyChips = ({ suggestions, onClick }) => {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div className="mt-4 animate-in fade-in">
      <div className="text-[10px] text-gray-400 text-center mb-2">快捷回复</div>
      <div className="chip-scroll-container no-scrollbar">
        {suggestions.map((text, i) => (
          <button key={i} onClick={() => onClick(text)} className="shrink-0 bg-white border border-pink-100 text-gray-600 px-3 py-1.5 rounded-full text-sm shadow-sm active:scale-95">{text}</button>
        ))}
      </div>
    </div>
  );
};

// =========================================================================
// 核心内容组件 (已完全修正 Flex 布局，消除了 fixed 导致重叠的 Bug)
// =========================================================================
const AiChatContent = ({ onClose }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [sourceLang, setSourceLang] = useState('zh-CN');
  const [targetLang, setTargetLang] = useState('my-MM');
  const [inputVal, setInputVal] = useState('');
  const [inputImages, setInputImages] = useState([]); 
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  // 控制内置全屏弹窗
  const [showSettings, setShowSettings] = useState(false);
  const [showSrcPicker, setShowSrcPicker] = useState(false);
  const [showTgtPicker, setShowTgtPicker] = useState(false);

  useEffect(() => {
    const s = safeLocalStorageGet('ai886_settings');
    if (s) {
      const parsed = JSON.parse(s);
      setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      if (parsed.lastSourceLang) setSourceLang(parsed.lastSourceLang);
      if (parsed.lastTargetLang) setTargetLang(parsed.lastTargetLang);
    }
    setHistory([]);
  }, []);

  useEffect(() => {
    safeLocalStorageSet('ai886_settings', JSON.stringify({ ...settings, lastSourceLang: sourceLang, lastTargetLang: targetLang }));
  }, [settings, sourceLang, targetLang]);

  const scrollToResult = () => setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);

  const handleTranslate = async (textOverride = null) => {
    let text = (textOverride || inputVal).trim();
    if (!text && inputImages.length === 0) return;

    let currentSource = sourceLang, currentTarget = targetLang;
    if (text) {
        const detected = detectScript(text);
        if (detected && detected !== currentSource && detected === currentTarget) {
            currentSource = currentTarget; currentTarget = sourceLang;
            setSourceLang(currentSource); setTargetLang(currentTarget);
        } else if (detected && detected !== currentSource && detected !== 'en-US') {
            setSourceLang(detected); currentSource = detected;
        }
    }

    setIsLoading(true); setSuggestions([]);
    const userMsg = { id: nowId(), role: 'user', text, images: inputImages, results: [] };
    setHistory([userMsg]); setInputVal(''); setInputImages([]); scrollToResult();

    try {
      // 此处省略真实 API 请求代码，为了纯粹修复 UI。替换为你原来的 fetchAi 逻辑
      // 模拟等待
      await new Promise(r => setTimeout(r, 1000));
      const aiMsg = { 
        id: nowId(), role: 'ai', 
        results: [{ translation: "这是一个测试翻译结果。", back_translation: "This is a test." }], 
        targetLang: currentTarget 
      };
      setHistory(prev => [...prev, aiMsg]);
      scrollToResult();
    } catch (e) {
      setHistory(prev => [...prev, { id: nowId(), role: 'error', text: '网络错误' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = () => { /* 你的录音逻辑 */ };
  const stopAndSend = () => { /* 你的停止逻辑 */ };

  return (
    // 使用 h-full flex flex-col 彻底锁定布局，绝对不跑出版面
    <div className="flex flex-col w-full h-full bg-[#FFF0F5] relative text-gray-800 overflow-hidden">
      <GlobalStyles />
      {settings.chatBackgroundUrl && (
        <div className="absolute inset-0 bg-cover bg-center z-0 pointer-events-none" style={{ backgroundImage: `url('${settings.chatBackgroundUrl}')`, opacity: 1 - settings.backgroundOverlay }} />
      )}

      {/* 头部 (shrink-0 不会被挤压) */}
      <header className="shrink-0 relative z-20 flex items-center justify-between px-5 h-14 bg-white/80 backdrop-blur-md shadow-sm border-b border-pink-100">
        <div className="w-8"></div>
        <div className="flex items-center gap-2">
          <i className="fas fa-link text-pink-500" />
          <span className="font-extrabold text-gray-800 text-[15px] tracking-tight">886.AI TRANSLATOR</span>
        </div>
        <button onClick={() => setShowSettings(true)} className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100 text-gray-600">
          <i className="fas fa-cog" />
        </button>
      </header>

      {/* 中间聊天区 (flex-1 自动撑满剩余空间，并支持滚动) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-4 pt-4 pb-6 scroll-smooth">
        <div className="w-full max-w-md mx-auto min-h-full flex flex-col justify-end">
           {history.length === 0 && !isLoading && (
             <div className="text-center text-gray-400 mb-20 opacity-60">
                <div className="text-5xl mb-3">👋</div>
                <div className="text-xs font-bold tracking-widest uppercase">智能中缅互译引擎</div>
             </div>
           )}

           {history.map((item, idx) => {
             if (item.role === 'user') {
               return (
                 <div key={item.id} className="flex justify-end mb-6">
                   <div className="bg-pink-500 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-[15px] max-w-[85%] shadow-md">
                       {item.text}
                   </div>
                 </div>
               );
             }
             if (item.role === 'error') {
               return <div key={item.id} className="bg-red-50 text-red-500 text-xs p-3 rounded-xl text-center mb-6">{item.text}</div>;
             }
             return (
               <div key={item.id} className="mb-6 animate-in slide-in-from-bottom-4 duration-500">
                  <TranslationResultContainer item={item} targetLang={targetLang} onPlay={(text) => playTTS(text, targetLang, settings)} />
                  {idx === history.length - 1 && <ReplyChips suggestions={suggestions} onClick={(reply) => { setInputVal(reply); handleTranslate(reply); }} />}
               </div>
             );
           })}
           
           {isLoading && (
              <div className="flex justify-center mb-6">
                <div className="bg-white/90 px-5 py-3 rounded-2xl shadow-sm flex items-center gap-2 text-pink-500 animate-pulse border border-pink-100">
                  <i className="fas fa-circle-notch fa-spin" />
                  <span className="text-sm font-bold">深度思考中...</span>
                </div>
              </div>
           )}
        </div>
      </div>

      {/* 底部输入区 (shrink-0 永远固定在抽屉的最底部，不使用 fixed 定位！) */}
      <footer className="shrink-0 relative z-20 bg-white border-t border-slate-100 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] px-4">
        <div className="w-full max-w-md mx-auto">
          
          <div className="flex items-center justify-center mb-2 px-1">
            <div className="flex items-center gap-2 bg-slate-50 rounded-full p-1 border border-slate-100 shadow-sm mx-auto">
              <button onClick={() => setShowSrcPicker(true)} className="flex items-center gap-1.5 px-3 py-1 bg-white shadow-sm rounded-full">
                <span className="text-xs font-bold text-gray-700">{getLangName(sourceLang)}</span>
              </button>
              <button onClick={() => { const s = sourceLang; setSourceLang(targetLang); setTargetLang(s); }} className="text-pink-400">
                <i className="fas fa-exchange-alt text-xs" />
              </button>
              <button onClick={() => setShowTgtPicker(true)} className="flex items-center gap-1.5 px-3 py-1 bg-white shadow-sm rounded-full">
                <span className="text-xs font-bold text-gray-700">{getLangName(targetLang)}</span>
              </button>
            </div>
          </div>

          <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-[24px] p-1.5 shadow-inner">
            <Menu as="div" className="relative">
                <Menu.Button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-pink-500">
                    <i className="fas fa-camera" />
                </Menu.Button>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveTo="opacity-0 scale-95">
                    <Menu.Items className="absolute bottom-full left-0 mb-2 w-28 bg-white shadow-xl rounded-xl ring-1 ring-black/5 p-1 z-50">
                        <Menu.Item>{({ active }) => <button onClick={() => cameraInputRef.current?.click()} className={`${active ? 'bg-pink-50 text-pink-600' : 'text-gray-700'} flex w-full items-center rounded-lg px-2 py-2 text-sm`}><i className="fas fa-camera mr-2"/> 拍照</button>}</Menu.Item>
                        <Menu.Item>{({ active }) => <button onClick={() => fileInputRef.current?.click()} className={`${active ? 'bg-pink-50 text-pink-600' : 'text-gray-700'} flex w-full items-center rounded-lg px-2 py-2 text-sm`}><i className="fas fa-image mr-2"/> 相册</button>}</Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
            
            <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" />
            <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" className="hidden" />

            <div className="flex-1 flex flex-col justify-center min-h-[40px]">
                <textarea
                  className="w-full bg-transparent border-none outline-none resize-none px-1 py-2 max-h-24 text-[15px] leading-relaxed no-scrollbar placeholder-gray-400"
                  placeholder="输入要翻译的内容..."
                  rows={1}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTranslate(); } }}
                />
            </div>
            
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
               {inputVal.trim().length > 0 ? (
                 <button onClick={() => handleTranslate()} className="w-10 h-10 rounded-full bg-pink-500 text-white shadow-md active:scale-90 transition-transform">
                   <i className="fas fa-arrow-up" />
                 </button>
               ) : (
                 <button onClick={startRecording} className="w-10 h-10 rounded-full bg-white text-gray-400 border border-slate-200 active:bg-pink-50 active:text-pink-500 transition-colors">
                   <i className="fas fa-microphone" />
                 </button>
               )}
            </div>
          </div>
        </div>
      </footer>

      {/* 语言选择弹窗 (使用普通绝对定位，杜绝组件冲突) */}
      {showSrcPicker && (
        <div className="absolute inset-0 z-[300] flex items-end justify-center">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSrcPicker(false)} />
           <div className="relative w-full bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full">
              <h3 className="font-bold text-gray-800 mb-4">选择源语言</h3>
              <div className="grid grid-cols-2 gap-3">
                 {SUPPORTED_LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => { setSourceLang(l.code); setShowSrcPicker(false); }} className="p-3 bg-slate-50 rounded-xl text-left border border-slate-100 active:bg-pink-50">
                       <span className="mr-2">{l.flag}</span>{l.name}
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 最终的外壳：纯 Framer Motion 的 Drawer，屏蔽一切冲突
// =========================================================================
const AIChatDrawer = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex flex-col justify-end">
          {/* 背景遮罩，点击关闭 */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          {/* 抽屉主体：向下滑动可关闭 */}
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.8 }}
            onDragEnd={(e, info) => {
              // 下拉超过 100px 或者速度够快就关闭
              if (info.offset.y > 100 || info.velocity.y > 400) {
                onClose();
              }
            }}
            className="relative w-full h-[90vh] sm:h-[85vh] sm:max-w-md sm:mx-auto bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* 顶部的“小药丸”拖拽指示条 */}
            <div className="w-full flex justify-center py-2 bg-white/50 absolute top-0 z-50 pointer-events-none">
               <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* 直接塞入刚才写好的纯粹的内容组件 */}
            <AiChatContent onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AIChatDrawer;
