import { Transition, Dialog, Menu } from '@headlessui/react';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Fragment,
  memo
} from 'react';
// 假设这些库文件存在
import { loadCheatDict, matchCheatLoose } from '@/lib/cheatDict';

// ----------------- 全局样式 -----------------
const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    .slim-scrollbar::-webkit-scrollbar { width: 4px; }
    .slim-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .slim-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 4px; }

    .blinking-cursor {
      display: inline-block;
      width: 2px;
      height: 1.2em;
      background-color: currentColor;
      margin-left: 2px;
      vertical-align: text-bottom;
      animation: blink 1s step-end infinite;
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `}</style>
);

// ----------------- Helpers -----------------
const safeLocalStorageGet = (key) => {
  try { return typeof window !== 'undefined' ? localStorage.getItem(key) : null; } 
  catch (e) { console.warn('localStorage get failed', e); return null; }
};
const safeLocalStorageSet = (key, value) => { 
  try { if (typeof window !== 'undefined') localStorage.setItem(key, value); } 
  catch (e) { console.warn('localStorage set failed', e); }
};
const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const playBeep = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 600;
        gain.gain.value = 0.1;
        osc.start();
        setTimeout(() => { osc.stop(); ctx.close(); }, 150);
    } catch (e) {}
};

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = (e) => reject(e);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onerror = (e) => reject(e);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1500; 
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
    };
  });
};

const detectScript = (text) => {
  if (!text) return null;
  if (/[\u1000-\u109F\uAA60-\uAA7F]+/.test(text)) return 'my-MM';
  if (/[\u4e00-\u9fa5]+/.test(text)) return 'zh-CN';
  if (/[\uac00-\ud7af]+/.test(text)) return 'ko-KR';
  if (/[\u3040-\u30ff\u31f0-\u31ff]+/.test(text)) return 'ja-JP';
  if (/[\u0E00-\u0E7F]+/.test(text)) return 'th-TH';
  if (/[\u0400-\u04FF]+/.test(text)) return 'ru-RU';
  return null;
};

// ----------------- Data & Config -----------------
const SUPPORTED_LANGUAGES = [
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'my-MM', name: '缅甸语', flag: '🇲🇲' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'vi-VN', name: '越南语', flag: '🇻🇳' },
  { code: 'th-TH', name: '泰语', flag: '🇹🇭' },
  { code: 'ms-MY', name: '马来语', flag: '🇲🇾' },
  { code: 'id-ID', name: '印尼语', flag: '🇮🇩' },
  { code: 'ru-RU', name: '俄语', flag: '🇷🇺' },
];

const BASE_SYSTEM_INSTRUCTION = `You are a professional, strictly literal translator. Output ONLY strict JSON. 
SCHEMA: {"data": [{"translation": "...", "back_translation": "..."}]}`;

const DEFAULT_SETTINGS = {
  providers: [{ id: 'p1', name: '默认接口', url: 'https://apis.iflow.cn/v1', key: '' }],
  models: [{ id: 'm1', providerId: 'p1', name: 'DeepSeek V3', value: 'deepseek-chat' }],
  mainModelId: 'm1',
  ttsConfig: {},
  ttsSpeed: 1.0,
  autoPlayTTS: false, 
  backgroundOverlay: 0.9,
  chatBackgroundUrl: '',
  useCustomPrompt: false,
  customPromptText: '',
  filterThinking: true,
  lastSourceLang: 'zh-CN',
  lastTargetLang: 'en-US'
};

// ----------------- TTS Engine -----------------
const AVAILABLE_VOICES = {
  'zh-CN': [{ id: 'zh-CN-XiaoyouNeural', name: '小悠 (女)' }],
  'en-US': [{ id: 'en-US-JennyNeural', name: 'Jenny (女)' }],
  'my-MM': [{ id: 'my-MM-NilarNeural', name: 'Nilar (女)' }],
};

const playTTS = async (text, lang, settings) => {
  if (!text) return;
  const voice = settings.ttsConfig?.[lang] || (AVAILABLE_VOICES[lang]?.[0]?.id) || 'zh-CN-XiaoyouNeural';
  const speed = settings.ttsSpeed || 1.0;
  try {
    const rateVal = Math.floor((speed - 1) * 50);
    const url = `https://t.leftsite.cn/tts?t=${encodeURIComponent(text)}&v=${encodeURIComponent(voice)}&r=${rateVal}`;
    const audio = new Audio(url);
    await audio.play();
  } catch (e) { console.error('TTS Error', e); }
};

// ----------------- Components -----------------

const TranslationCard = memo(({ data, onPlay }) => {
  const [copied, setCopied] = useState(false);
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(data.translation);
      if (navigator.vibrate) navigator.vibrate(50);
      setCopied(true);
      setTimeout(() => setCopied(false), 800);
    } catch {}
  };
  
  return (
    <div onClick={handleClick} className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group mb-3 text-center">
      {copied && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-10">
          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">已复制</span>
        </div>
      )}
      <div className="text-[18px] leading-relaxed font-medium text-gray-800 break-words whitespace-pre-wrap">{data.translation}</div>
      {!!data.back_translation && (
        <div className="mt-2.5 text-[13px] text-gray-400 break-words leading-snug whitespace-pre-wrap">{data.back_translation}</div>
      )}
      <button onClick={(e) => { e.stopPropagation(); onPlay(); }} className="absolute bottom-2 right-2 p-2 text-gray-300 hover:text-pink-500 opacity-50">
        <i className="fas fa-volume-up" />
      </button>
    </div>
  );
});

// ----------------- Main Chat Logic -----------------
const AiChatContent = ({ onClose }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [sourceLang, setSourceLang] = useState('zh-CN');
  const [targetLang, setTargetLang] = useState('en-US');
  const [inputVal, setInputVal] = useState('');
  const [inputImages, setInputImages] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const currentRequestIdRef = useRef(null);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [showSettings, setShowSettings] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showSrcPicker, setShowSrcPicker] = useState(false);
  const [showTgtPicker, setShowTgtPicker] = useState(false);

  useEffect(() => {
    const s = safeLocalStorageGet('ai886_settings');
    if (s) {
      try {
        const parsed = JSON.parse(s);
        setSettings(prev => ({ ...prev, ...parsed }));
        if (parsed.lastSourceLang) setSourceLang(parsed.lastSourceLang);
        if (parsed.lastTargetLang) setTargetLang(parsed.lastTargetLang);
      } catch (e) {}
    }
  }, []);

  const scrollToResult = () => {
    if (!scrollRef.current) return;
    setTimeout(() => {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const fetchAi = async (messages, modelId, signal) => {
    const model = settings.models.find(m => m.id === modelId);
    if (!model) throw new Error(`未选择模型`);
    const provider = settings.providers.find(p => p.id === model.providerId);
    if (!provider || !provider.key) throw new Error(`API配置无效`);

    const res = await fetch(`${provider.url.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${provider.key}` },
      body: JSON.stringify({ 
        model: model.value, 
        messages, 
        response_format: { type: 'json_object' }
      }),
      signal
    });

    // 容错处理：检查是否返回了 HTML
    const contentType = res.headers.get("content-type");
    if (!res.ok || (contentType && contentType.includes("text/html"))) {
        throw new Error(`接口请求失败(${res.status})，请检查 API Key 或地址是否正确`);
    }

    const data = await res.json();
    let content = data.choices[0].message.content;
    if (settings.filterThinking) content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    return { content, modelName: model.name };
  };

  const handleTranslate = async (textOverride = null) => {
    let text = (textOverride || inputVal).trim();
    if (!text && inputImages.length === 0) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    const requestId = nowId();
    currentRequestIdRef.current = requestId;

    // 自动检测并切换语言
    let currentSource = sourceLang;
    let currentTarget = targetLang;
    if (text) {
        const detected = detectScript(text);
        if (detected && detected !== currentSource) {
            if (detected === currentTarget) {
                currentSource = currentTarget;
                currentTarget = sourceLang;
                setSourceLang(currentSource);
                setTargetLang(currentTarget);
            } else {
                setSourceLang(detected);
                currentSource = detected;
            }
        }
    }

    setIsLoading(true);
    setHistory([{ id: nowId(), role: 'user', text, images: inputImages, ts: Date.now() }]);
    setInputVal(''); setInputImages([]); scrollToResult();

    try {
      let aiMsg = { id: nowId(), role: 'ai', results: [], modelName: '', ts: Date.now(), tgtLang: currentTarget };

      // 1. 先尝试从本地字典加载
      let dictHit = null;
      if (inputImages.length === 0 && text) {
         try {
             // ✅ 注意：修正字典加载路径，并增加 await
             const dict = await loadCheatDict(currentSource); 
             if (dict) {
                // ✅ 这里必须 await，否则 dictHit 是 Promise
                dictHit = await matchCheatLoose(dict, text, currentTarget);
             }
         } catch (e) { console.warn("Dict load error", e); }
      }
      
      if (dictHit && dictHit.length > 0 && dictHit[0].translation !== '（字典数据为空）') {
        aiMsg.results = dictHit;
        aiMsg.modelName = '本地词库';
      } else {
        // 2. 字典未命中，请求 AI
        const sysPrompt = BASE_SYSTEM_INSTRUCTION + (settings.useCustomPrompt ? `\n${settings.customPromptText}` : '');
        const userPrompt = `Source: ${currentSource}, Target: ${currentTarget}\nContent: ${text || '[Image]'}`;
        
        const content = [{ type: "text", text: userPrompt }];
        inputImages.forEach(img => content.push({ type: "image_url", image_url: { url: img } }));

        const res = await fetchAi([{ role: 'system', content: sysPrompt }, { role: 'user', content }], settings.mainModelId, signal);
        
        // 解析 AI 返回的 JSON
        try {
            const json = JSON.parse(res.content);
            aiMsg.results = Array.isArray(json.data) ? json.data : [];
        } catch {
            aiMsg.results = [{ translation: res.content, back_translation: '' }];
        }
        aiMsg.modelName = res.modelName;
      }

      if (currentRequestIdRef.current === requestId) {
          setHistory(prev => [...prev, aiMsg]);
          if (settings.autoPlayTTS && aiMsg.results?.[0]) {
            playTTS(aiMsg.results[0].translation, currentTarget, settings);
          }
          scrollToResult();
      }
    } catch (e) {
      if (e.name !== 'AbortError' && currentRequestIdRef.current === requestId) {
         setHistory(prev => [...prev, { id: nowId(), role: 'error', text: e.message || '翻译失败', ts: Date.now() }]);
      }
    } finally {
      if (currentRequestIdRef.current === requestId) setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-[#FFF0F5] relative text-gray-800">
      <GlobalStyles />
      {/* Background Overlay */}
      {settings.chatBackgroundUrl && (
        <div className="absolute inset-0 bg-cover bg-center z-0 pointer-events-none" 
             style={{ backgroundImage: `url('${settings.chatBackgroundUrl}')`, opacity: 1 - settings.backgroundOverlay }} />
      )}

      {/* Header */}
      <div className="relative z-20 pt-safe-top bg-white/60 backdrop-blur-md shadow-sm border-b border-pink-100/50">
        <div className="flex items-center justify-between h-12 px-4">
          <div className="w-10" />
          <div className="font-extrabold text-pink-500 text-lg">886.best</div>
          <button onClick={() => setShowSettings(true)} className="w-8 h-8 text-gray-600"><i className="fas fa-cog" /></button>
        </div>
      </div>

      {/* Chat History */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-4 pt-4 pb-36">
        <div className="w-full max-w-[600px] mx-auto flex flex-col justify-end min-h-full">
           {history.map((item) => (
             <div key={item.id} className={`mb-6 ${item.role === 'user' ? 'flex justify-end' : ''}`}>
               {item.role === 'user' ? (
                 <div className="max-w-[85%] bg-gray-200 text-gray-700 px-4 py-2 rounded-2xl rounded-tr-sm text-sm">
                   {item.text}
                   {item.images?.map((img, i) => <img key={i} src={img} className="w-32 rounded mt-2" alt="" />)}
                 </div>
               ) : item.role === 'error' ? (
                 <div className="w-full bg-red-50 text-red-500 text-xs p-3 rounded-xl text-center">{item.text}</div>
               ) : (
                 <div className="animate-in slide-in-from-bottom-2">
                    {item.modelName && <div className="text-[10px] text-center text-gray-400 mb-1">{item.modelName}</div>}
                    {item.results.map((res, i) => <TranslationCard key={i} data={res} onPlay={() => playTTS(res.translation, item.tgtLang, settings)} />)}
                 </div>
               )}
             </div>
           ))}
           {isLoading && <div className="text-center p-4 text-pink-500 animate-pulse">正在翻译...</div>}
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-md border-t border-pink-100 pb-safe-bottom">
        <div className="max-w-[600px] mx-auto p-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setShowSrcPicker(true)} className="text-xs font-bold px-3 py-1 bg-gray-100 rounded-full">{SUPPORTED_LANGUAGES.find(l => l.code === sourceLang)?.name}</button>
            <button onClick={() => { setSourceLang(targetLang); setTargetLang(sourceLang); }} className="text-gray-400"><i className="fas fa-exchange-alt" /></button>
            <button onClick={() => setShowTgtPicker(true)} className="text-xs font-bold px-3 py-1 bg-gray-100 rounded-full">{SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name}</button>
          </div>

          <div className="flex items-end gap-2 bg-white border border-pink-200 rounded-[24px] p-2">
            <button onClick={() => fileInputRef.current.click()} className="w-10 h-10 text-gray-400"><i className="fas fa-image" /></button>
            <textarea 
              className="flex-1 bg-transparent border-none outline-none py-2 resize-none max-h-32" 
              rows={1}
              placeholder="输入内容..."
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTranslate(); } }}
            />
            <button onClick={() => handleTranslate()} className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center">
              <i className="fas fa-arrow-up" />
            </button>
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} hidden multiple accept="image/*" onChange={async (e) => {
          const files = Array.from(e.target.files);
          const compressed = await Promise.all(files.map(f => compressImage(f)));
          setInputImages(compressed);
          e.target.value = '';
      }} />

      {/* Pickers & Modals (省略部分UI渲染逻辑，同你原代码) */}
    </div>
  );
};

// ----------------- Export -----------------
const AIChatDrawer = ({ isOpen, onClose }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/30 backdrop-blur-sm" /></Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-300" enterFrom="translate-y-full" enterTo="translate-y-0" leave="transform transition ease-in-out duration-300" leaveFrom="translate-y-0" leaveTo="translate-y-full">
            <Dialog.Panel className="w-screen h-full"><AiChatContent onClose={onClose} /></Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AIChatDrawer;
