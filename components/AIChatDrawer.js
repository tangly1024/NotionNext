import { Transition, Dialog, Menu } from '@headlessui/react';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Fragment,
  memo
} from 'react';
// 假设这些库文件存在，如果没有请自行处理引用
// import { loadCheatDict, matchCheatLoose } from '@/lib/cheatDict';

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
      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };
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

    /* 光标闪烁动画 */
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
const safeLocalStorageGet = (key) => (typeof window !== 'undefined' ? localStorage.getItem(key) : null);
const safeLocalStorageSet = (key, value) => { if (typeof window !== 'undefined') localStorage.setItem(key, value); };
const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// 生成简单的提示音 (Beep)
const playBeep = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.value = 600; // 频率
        gain.gain.value = 0.1; // 音量
        
        osc.start();
        setTimeout(() => {
            osc.stop();
            ctx.close();
        }, 150); // 持续时间
    } catch (e) {
        console.error("Audio Context Error", e);
    }
};

// 图片压缩
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        // 压缩质量 0.6
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(dataUrl);
      };
    };
  });
};

// 脚本检测 (简单正则)
const detectScript = (text) => {
  if (!text) return null;
  if (/[\u1000-\u109F\uAA60-\uAA7F]+/.test(text)) return 'my-MM';
  if (/[\u4e00-\u9fa5]+/.test(text)) return 'zh-CN';
  if (/[\uac00-\ud7af]+/.test(text)) return 'ko-KR';
  if (/[\u3040-\u30ff\u31f0-\u31ff]+/.test(text)) return 'ja-JP';
  if (/[\u0E00-\u0E7F]+/.test(text)) return 'th-TH';
  if (/[\u0400-\u04FF]+/.test(text)) return 'ru-RU';
  if (/[\u0600-\u06FF]+/.test(text)) return 'ar-SA';
  if (/[\u0900-\u097F]+/.test(text)) return 'hi-IN';
  if (/^[a-zA-Z\s,.?!]+$/.test(text)) return 'en-US';
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
  { code: 'tl-PH', name: '菲律宾语', flag: '🇵🇭' },
  { code: 'hi-IN', name: '印度语', flag: '🇮🇳' },
  { code: 'ar-SA', name: '阿拉伯语', flag: '🇸🇦' },
  { code: 'lo-LA', name: '老挝语', flag: '🇱🇦' },
  { code: 'ru-RU', name: '俄语', flag: '🇷🇺' },
  { code: 'km-KH', name: '柬埔寨语', flag: '🇰🇭' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
];

const DEFAULT_PROVIDERS = [
  { id: 'p1', name: '默认接口', url: 'https://apis.iflow.cn/v1', key: '' }
];

const DEFAULT_MODELS = [
  { id: 'm1', providerId: 'p1', name: 'DeepSeek V3', value: 'deepseek-chat' },
  { id: 'm2', providerId: 'p1', name: 'Qwen Max', value: 'qwen-max' },
  { id: 'm3', providerId: 'p1', name: 'GPT-4o', value: 'gpt-4o' }
];

// 修正后的提示词：强调忠实原文
const BASE_SYSTEM_INSTRUCTION = `You are a professional translator. Translate user text into the target language.
Requirements:
1. Style: Natural and fluent. Maintain the original meaning and structure while following target language conventions.
2. NO back_translation.
3. Output ONLY strict JSON.
4. Format: {"data": [{"translation": "..."}]}
5. NO Markdown (e.g., \`\`\`json) or any extra explanation.`;


const DEFAULT_SETTINGS = {
  providers: DEFAULT_PROVIDERS,
  models: DEFAULT_MODELS,

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
const ttsCache = new Map();
const AVAILABLE_VOICES = {
  'zh-CN': [{ id: 'zh-CN-XiaoyouNeural', name: '小悠 (女)' }, { id: 'zh-CN-YunxiNeural', name: '云希 (男)' }],
  'en-US': [{ id: 'en-US-JennyNeural', name: 'Jenny (女)' }, { id: 'en-US-GuyNeural', name: 'Guy (男)' }],
  'my-MM': [{ id: 'my-MM-NilarNeural', name: 'Nilar (女)' }, { id: 'my-MM-ThihaNeural', name: 'Thiha (男)' }],
  'ja-JP': [{ id: 'ja-JP-NanamiNeural', name: 'Nanami' }, { id: 'ja-JP-KeitaNeural', name: 'Keita' }],
  'ko-KR': [{ id: 'ko-KR-SunHiNeural', name: 'SunHi' }, { id: 'ko-KR-InJoonNeural', name: 'InJoon' }],
  'vi-VN': [{ id: 'vi-VN-HoaiMyNeural', name: 'HoaiMy' }, { id: 'vi-VN-NamMinhNeural', name: 'NamMinh' }],
  'th-TH': [{ id: 'th-TH-PremwadeeNeural', name: 'Premwadee' }, { id: 'th-TH-NiwatNeural', name: 'Niwat' }],
  'ru-RU': [{ id: 'ru-RU-SvetlanaNeural', name: 'Svetlana' }, { id: 'ru-RU-DmitryNeural', name: 'Dmitry' }],
  'ms-MY': [{ id: 'ms-MY-YasminNeural', name: 'Yasmin (女)' }, { id: 'ms-MY-OsmanNeural', name: 'Osman (男)' }],
  'id-ID': [{ id: 'id-ID-GadisNeural', name: 'Gadis (女)' }, { id: 'id-ID-ArdiNeural', name: 'Ardi (男)' }],
  'tl-PH': [{ id: 'tl-PH-BlessicaNeural', name: 'Blessica (女)' }, { id: 'tl-PH-AngeloNeural', name: 'Angelo (男)' }],
  'hi-IN': [{ id: 'hi-IN-SwaraNeural', name: 'Swara (女)' }, { id: 'hi-IN-MadhurNeural', name: 'Madhur (男)' }],
  'ar-SA': [{ id: 'ar-SA-ZariyahNeural', name: 'Zariyah (女)' }, { id: 'ar-SA-HamedNeural', name: 'Hamed (男)' }],
};

const getVoiceForLang = (lang, config) => {
  if (config && config[lang]) return config[lang];
  if (AVAILABLE_VOICES[lang]) return AVAILABLE_VOICES[lang][0].id;
  if (lang === 'lo-LA') return 'lo-LA-KeomanyNeural';
  if (lang === 'km-KH') return 'km-KH-PisethNeural';
  return 'zh-CN-XiaoyouNeural';
};

const playTTS = async (text, lang, settings) => {
  if (!text) return;
  const voice = getVoiceForLang(lang, settings.ttsConfig);
  const speed = settings.ttsSpeed || 1.0;
  const key = `${voice}_${speed}_${text}`;

  try {
    let audio = ttsCache.get(key);
    if (!audio) {
      const rateVal = Math.floor((speed - 1) * 50);
      const url = `https://t.leftsite.cn/tts?t=${encodeURIComponent(text)}&v=${encodeURIComponent(voice)}&r=${rateVal}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const blob = await res.blob();
      audio = new Audio(URL.createObjectURL(blob));
      ttsCache.set(key, audio);
    }
    audio.currentTime = 0;
    audio.playbackRate = speed;
    await audio.play();
  } catch (e) {
    console.error('TTS Play Error:', e);
  }
};

// ----------------- Logic Helpers -----------------
const normalizeTranslations = (raw) => {
  let data = [];
  try {
    let cleanRaw = typeof raw === 'string' ? raw.trim() : '';
    if (cleanRaw.includes('```')) { cleanRaw = cleanRaw.replace(/json/g, '').replace(/```/g, '').trim(); }
    const start = cleanRaw.indexOf('{');
    const end = cleanRaw.lastIndexOf('}');
    if (start >= 0 && end > start) {
      cleanRaw = cleanRaw.slice(start, end + 1);
    }
    const json = cleanRaw ? JSON.parse(cleanRaw) : raw;
    data = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
  } catch (e) {
    return [{ style: '错误', translation: '解析数据失败', back_translation: '' }];
  }
  const validData = data.filter(x => x && x.translation);
  if (validData.length === 0) return [{ style: '默认', translation: typeof raw === 'string' ? raw : '无有效译文', back_translation: '' }];
  return validData.slice(0, 4);
};

const getLangName = (c) => SUPPORTED_LANGUAGES.find(l => l.code === c)?.name || c;
const getLangFlag = (c) => SUPPORTED_LANGUAGES.find(l => l.code === c)?.flag || '';

// ----------------- Components -----------------

// 翻译结果卡片
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

      <div className="text-[18px] leading-relaxed font-medium text-gray-800 break-words select-none whitespace-pre-wrap">{data.translation}</div>
      {!!data.back_translation && (
        <div className="mt-2.5 text-[13px] text-gray-400 break-words leading-snug whitespace-pre-wrap">{data.back_translation}</div>
      )}
      <button onClick={(e) => { e.stopPropagation(); onPlay(); }} className="absolute bottom-2 right-2 p-2 text-gray-300 hover:text-blue-500 opacity-50 hover:opacity-100">
        <i className="fas fa-volume-up" />
      </button>
    </div>
  );
});


// 模型选择器 (已精简)
const ModelSelectorModal = ({ settings, onClose, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const activeModelObj = settings.models.find(m => m.id === localSettings.mainModelId);
  const activeProviderId = activeModelObj ? activeModelObj.providerId : null;
  const [selectedProvId, setSelectedProvId] = useState(activeProviderId || settings.providers[0]?.id);

  const handleSelect = (modelId) => {
    setLocalSettings(s => ({ ...s, mainModelId: modelId }));
  };

  const currentModels = settings.models.filter(m => m.providerId === selectedProvId);

  return (
    <Dialog open={true} onClose={onClose} className="relative z-[10005]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden h-[450px] flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div className="font-bold text-gray-800">选择翻译模型</div>
            <button onClick={onClose}><i className="fas fa-times text-gray-400"/></button>
          </div>

          <div className="flex flex-1 overflow-hidden">
             <div className="w-1/3 bg-gray-50 border-r border-gray-100 overflow-y-auto slim-scrollbar p-2">
               {settings.providers.map(p => {
                 const isActiveProvider = (p.id === selectedProvId);
                 const containsActiveModel = (p.id === activeProviderId);
                 return (
                   <button key={p.id} onClick={() => setSelectedProvId(p.id)} className={`w-full text-left px-3 py-3 rounded-xl text-xs font-bold mb-1 relative transition-colors ${isActiveProvider ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                     {containsActiveModel && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-pink-500 rounded-r-full"/>}
                     {p.name}
                   </button>
                 );
               })}
             </div>
             
             <div className="flex-1 overflow-y-auto slim-scrollbar p-3">
               {currentModels.map(m => {
                 const isSelected = (m.id === localSettings.mainModelId);
                 let activeClass = isSelected ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-100';

                 return (
                   <button key={m.id} onClick={() => handleSelect(m.id)} className={`w-full text-left px-4 py-3 rounded-xl border mb-2 flex justify-between ${activeClass}`}>
                     <div><div className="font-bold text-sm">{m.name}</div><div className="text-[10px] opacity-60 font-mono">{m.value}</div></div>
                     {isSelected && <i className="fas fa-check" />}
                   </button>
                 );
               })}
             </div>
          </div>
          <div className="p-4 border-t border-gray-100 flex justify-end">
             <button onClick={() => { onSave(localSettings); onClose(); }} className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-200">完成设置</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

// 设置弹窗 (已精简)
const SettingsModal = ({ settings, onSave, onClose }) => {
  const [data, setData] = useState(settings);
  const [tab, setTab] = useState('common');
  const fileInputRef = useRef(null);

  const updateProvider = (idx, f, v) => { const arr=[...data.providers]; arr[idx]={...arr[idx],[f]:v}; setData({...data,providers:arr}); };
  const addProvider = () => setData(prev=>({...prev,providers:[...prev.providers,{id:nowId(),name:'新供应商',url:'',key:''}]}));
  const delProvider = (id) => { if(data.providers.length>1) setData(prev=>({...prev,providers:prev.providers.filter(p=>p.id!==id)})); };
  const getModelsByProv = (pid) => data.models.filter(m=>m.providerId===pid);
  const addModel = (pid) => setData(prev=>({...prev,models:[...prev.models,{id:nowId(),providerId:pid,name:'新模型',value:''}]}));
  const updateModel = (mid,f,v) => setData(prev=>({...prev,models:prev.models.map(m=>m.id===mid?{...m,[f]:v}:m)}));
  const delModel = (mid) => setData(prev=>({...prev,models:prev.models.filter(m=>m.id!==mid)}));

  const handleBgUpload = async (e) => {
    const file = e.target.files[0];
    if(file) {
      const base64 = await compressImage(file);
      setData({...data, chatBackgroundUrl: base64});
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-[10002]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="font-bold text-gray-800">设置</div>
            <button onClick={onClose} className="w-8 h-8 bg-gray-200 rounded-full text-gray-500"><i className="fas fa-times"/></button>
          </div>
          <div className="flex p-2 gap-1 border-b border-gray-100">
            {[{id:'common',label:'通用'}, {id:'provider',label:'供应商与模型'}, {id:'voice',label:'发音人'}].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-2 text-xs font-bold rounded-lg ${tab===t.id ? 'bg-pink-50 text-pink-600':'text-gray-500 hover:bg-gray-50'}`}>{t.label}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto slim-scrollbar p-5 bg-white">
            {tab === 'common' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-sm font-bold text-gray-700">过滤模型思考过程</div>
                    <div className="text-xs text-gray-400">关闭 DeepSeek 等模型的 &lt;think&gt; 输出</div>
                  </div>
                  <input type="checkbox" checked={data.filterThinking} onChange={e => setData({...data, filterThinking: e.target.checked})} className="w-5 h-5 accent-pink-500"/>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-sm font-bold text-gray-700 mb-2">背景设置</div>
                  <div className="flex items-center gap-3 mb-2">
                     <button onClick={() => fileInputRef.current.click()} className="px-3 py-1.5 bg-white border rounded-lg text-xs shadow-sm">上传图片</button>
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleBgUpload} />
                     <button onClick={() => setData({...data, chatBackgroundUrl: ''})} className="px-3 py-1.5 bg-red-50 text-red-500 border border-red-100 rounded-lg text-xs">清除</button>
                  </div>
                  <input type="range" min="0.5" max="1.0" step="0.05" value={data.backgroundOverlay} onChange={e=>setData({...data, backgroundOverlay: parseFloat(e.target.value)})} className="w-full accent-pink-500"/>
                </div>
              </div>
            )}
            {tab === 'provider' && (
              <div className="space-y-6">
                {data.providers.map((p, idx) => (
                  <div key={p.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                       <input className="font-bold text-gray-800 bg-transparent outline-none" value={p.name} onChange={e=>updateProvider(idx,'name',e.target.value)} />
                       <button onClick={()=>delProvider(p.id)} className="text-red-500 text-xs">删除</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <input className="bg-white text-xs p-2 rounded border" placeholder="URL" value={p.url} onChange={e=>updateProvider(idx,'url',e.target.value)} />
                      <input className="bg-white text-xs p-2 rounded border" type="password" placeholder="Key" value={p.key} onChange={e=>updateProvider(idx,'key',e.target.value)} />
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-gray-100">
                      <div className="flex justify-between mb-2"><span className="text-[10px] font-bold text-gray-400">模型列表</span><button onClick={()=>addModel(p.id)} className="text-[10px] bg-blue-50 text-blue-600 px-2 rounded">+ 添加</button></div>
                      {getModelsByProv(p.id).map(m => (
                        <div key={m.id} className="flex gap-2 items-center mb-1">
                          <input className="flex-1 text-[11px] border rounded p-1" placeholder="名称" value={m.name} onChange={e=>updateModel(m.id,'name',e.target.value)} />
                          <input className="flex-1 text-[11px] border rounded p-1 font-mono" placeholder="Value" value={m.value} onChange={e=>updateModel(m.id,'value',e.target.value)} />
                          <button onClick={()=>delModel(m.id)} className="text-gray-300 hover:text-red-500"><i className="fas fa-times"/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={addProvider} className="w-full py-2 border border-dashed rounded-xl text-gray-500 text-sm hover:bg-gray-50">+ 添加供应商</button>
              </div>
            )}
            {tab === 'voice' && (
              <div className="space-y-4">
                 <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                    <div>
                        <div className="text-sm font-bold text-gray-700">自动朗读</div>
                        <div className="text-xs text-gray-400">翻译完成后自动播放结果</div>
                    </div>
                    <input type="checkbox" checked={data.autoPlayTTS} onChange={e => setData({...data, autoPlayTTS: e.target.checked})} className="w-5 h-5 accent-pink-500"/>
                 </div>

                 <div className="text-sm font-bold text-gray-700 px-1 mt-4">特定语言发音人设置</div>
                 {SUPPORTED_LANGUAGES.map(lang => (
                   AVAILABLE_VOICES[lang.code] && (
                     <div key={lang.code} className="flex items-center justify-between border-b border-gray-50 py-2">
                       <div className="flex items-center gap-2 text-sm"><span>{lang.flag}</span><span>{lang.name}</span></div>
                       <select className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 max-w-[140px]" value={(data.ttsConfig||{})[lang.code]||''} onChange={(e)=>{
                         const cfg={...(data.ttsConfig||{})}; cfg[lang.code]=e.target.value; setData({...data,ttsConfig:cfg});
                       }}>
                         <option value="">默认</option>
                         {AVAILABLE_VOICES[lang.code].map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
                       </select>
                     </div>
                   )
                 ))}
                 <div className="p-3 bg-gray-50 rounded-xl mt-4">
                    <div className="text-sm font-bold text-gray-700">全局语速: {data.ttsSpeed}x</div>
                    <input type="range" min="0.5" max="2.0" step="0.1" className="w-full accent-pink-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2" value={data.ttsSpeed} onChange={e=>setData({...data,ttsSpeed:parseFloat(e.target.value)})}/>
                 </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
             <button onClick={onClose} className="px-5 py-2 rounded-xl bg-gray-100 text-sm font-bold text-gray-600">取消</button>
             <button onClick={()=>{onSave(data);onClose();}} className="px-5 py-2 rounded-xl bg-pink-500 text-sm font-bold text-white shadow-lg shadow-pink-200">保存</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

// ----------------- Main Chat Logic -----------------
const AiChatContent = ({ onClose }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [sourceLang, setSourceLang] = useState('zh-CN');
  const [targetLang, setTargetLang] = useState('my-MM');

  const [inputVal, setInputVal] = useState('');
  const [inputImages, setInputImages] = useState([]);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const scrollRef = useRef(null);

  const [showSettings, setShowSettings] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
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
    const toSave = { ...settings, lastSourceLang: sourceLang, lastTargetLang: targetLang };
    safeLocalStorageSet('ai886_settings', JSON.stringify(toSave));
  }, [settings, sourceLang, targetLang]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const scrollToResult = () => {
    if (!scrollRef.current) return;
    setTimeout(() => {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const getProviderAndModel = (modelId) => {
    const model = settings.models.find(m => m.id === modelId);
    if (!model) return null;
    const provider = settings.providers.find(p => p.id === model.providerId);
    return { provider, model };
  };

  const fetchAi = async (messages, modelId, jsonMode = true) => {
    const pm = getProviderAndModel(modelId);
    if (!pm) throw new Error(`未配置模型 ${modelId}`);
    if (!pm.provider.key) throw new Error(`${pm.provider.name} 缺少 Key`);

    const body = { model: pm.model.value, messages, stream: false };
    if (jsonMode) body.response_format = { type: 'json_object' };

    const res = await fetch(`${pm.provider.url}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${pm.provider.key}` },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `API Error: ${res.status}`);
    }
    const data = await res.json();
    if (!data.choices?.length) throw new Error('API返回数据异常');

    let content = data.choices[0].message.content;

    if (settings.filterThinking) {
        content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    }

    return { content, modelName: pm.model.name };
  };

  const handleTranslate = async (textOverride = null) => {
    let text = (textOverride || inputVal).trim();
    if (!text && inputImages.length === 0) return;

    let currentSource = sourceLang;
    let currentTarget = targetLang;

    if (text) {
        const detected = detectScript(text);
        if (detected && detected !== currentSource && detected === currentTarget) {
            const temp = currentSource;
            currentSource = currentTarget;
            currentTarget = temp;
            setSourceLang(currentSource);
            setTargetLang(currentTarget);
        } else if (detected && detected !== currentSource && detected !== 'en-US') {
            setSourceLang(detected);
            currentSource = detected;
        }
    }

    setIsLoading(true);
    
    const currentSessionId = nowId();

    const userMsg = { 
        id: nowId(), 
        sessionId: currentSessionId, 
        role: 'user', 
        text, 
        images: inputImages, 
        ts: Date.now(), 
        results: [] 
    };

    setHistory([userMsg]);
    setInputVal('');
    setInputImages([]);
    scrollToResult();

    let sysPrompt = BASE_SYSTEM_INSTRUCTION;
    if (settings.useCustomPrompt && settings.customPromptText) {
      sysPrompt += `\n额外要求: ${settings.customPromptText}`;
    }

    const userPromptText = `Source: ${getLangName(currentSource)}\nTarget: ${getLangName(currentTarget)}\nContent:\n${text || '[Image Content]'}`;

    let finalUserMessage;
    if (inputImages.length > 0) {
        const content = [{ type: "text", text: userPromptText }];
        inputImages.forEach(img => {
            content.push({ type: "image_url", image_url: { url: img } });
        });
        finalUserMessage = { role: 'user', content };
    } else {
        finalUserMessage = { role: 'user', content: userPromptText };
    }

    const messages = [
      { role: 'system', content: sysPrompt },
      finalUserMessage
    ];

    try {
      let dictHit = null;
      if (inputImages.length === 0 && text) {
         const dict = await loadCheatDict(currentSource);
         dictHit = matchCheatLoose(dict, text, currentTarget);
      }
      
      let aiMsg = { id: nowId(), sessionId: currentSessionId, role: 'ai', results: [], from: 'ai', ts: Date.now(), modelName: '' };

      if (dictHit) {
        aiMsg.results = normalizeTranslations(dictHit);
        aiMsg.from = 'dict';
      } else {
        const res = await fetchAi(messages, settings.mainModelId, true);
        aiMsg.results = normalizeTranslations(res.content);
        aiMsg.modelName = res.modelName;
      }

      setHistory(prev => [...prev, aiMsg]);
      scrollToResult();
      
      if (settings.autoPlayTTS && aiMsg.results && aiMsg.results.length > 0) {
        playTTS(aiMsg.results[0].translation, currentTarget, settings);
      }
      
    } catch (e) {
      const errorMsg = { id: nowId(), sessionId: currentSessionId, role: 'error', text: e.message || '未知错误', ts: Date.now(), results: [] };
      setHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = [];
    for (const file of files) {
        try {
            const base64 = await compressImage(file);
            newImages.push(base64);
        } catch (err) { console.error(err); }
    }
    setInputImages(prev => [...prev, ...newImages]);
    e.target.value = '';
  };

  const stopAndSend = (isManual = false) => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch(e) { console.error(e); }
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('当前浏览器不支持语音识别');
      return;
    }

    if (isRecording) {
      stopAndSend(true);
      return;
    }

    playBeep();

    const recognition = new SpeechRecognition();
    recognition.lang = sourceLang;
    recognition.interimResults = true;
    recognition.continuous = false; 

    recognitionRef.current = recognition;
    setInputVal('');
    setIsRecording(true);
    if (navigator.vibrate) navigator.vibrate(50);

    recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const transcript = results
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setInputVal(transcript); 

      const isFinal = results.some(r => r.isFinal);
      if (isFinal && transcript.trim()) {
        try { recognition.stop(); } catch {}
        setIsRecording(false);
        handleTranslate(transcript); 
        setInputVal(''); 
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.start();
  };

  const swapLangs = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  return (
    // 修复点 1：完全使用 flex-col 填充高度，不使用任何 fixed 定位，防止重叠
    <div className="flex flex-col w-full h-[100dvh] bg-[#FFF0F5] relative text-gray-800 overflow-hidden">
      <GlobalStyles />
      {settings.chatBackgroundUrl && (
        <div className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: `url('${settings.chatBackgroundUrl}')`, opacity: 1 - settings.backgroundOverlay }} />
      )}

      {/* 头部：使用 shrink-0 防止挤压 */}
      <div className="shrink-0 relative z-20 bg-white/60 backdrop-blur-md shadow-sm border-b border-pink-100/50">
        <div className="flex items-center justify-between h-14 relative px-4">
          <div className="w-12">
            <button onClick={onClose} className="p-2 -ml-2 text-gray-600 active:scale-95"><i className="fas fa-chevron-down" /></button>
          </div>
          
          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <i className="fas fa-link text-pink-500" />
            <span className="font-extrabold text-gray-800 text-base tracking-tight">886.best</span>
          </div>

          <div className="flex items-center gap-3 w-12 justify-end">
            <button onClick={() => setShowSettings(true)} className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-200 transition-colors text-gray-600">
              <i className="fas fa-cog" />
            </button>
          </div>
        </div>
      </div>

      {/* 录音状态栏 - 改为 absolute 定位，杜绝 fixed 的脱离文档流问题 */}
      <Transition show={isRecording} as={Fragment} enter="transition-opacity duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="absolute top-20 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="bg-pink-500/90 text-white px-6 py-2.5 rounded-full shadow-xl flex items-center gap-3 animate-pulse pointer-events-auto backdrop-blur-sm">
            <i className="fas fa-microphone text-lg animate-bounce"/>
            <span className="font-bold text-sm">正在识别 ({getLangName(sourceLang)})...</span>
          </div>
        </div>
      </Transition>

      {/* 中间聊天区：flex-1 自动占据所有剩余空间 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-4 pt-4 pb-6 scroll-smooth">
        <div className="w-full max-w-[600px] mx-auto min-h-full flex flex-col justify-end">
           {history.length === 0 && !isLoading && (
             <div className="text-center text-gray-400 mb-20 opacity-60">
                <div className="text-4xl mb-2">👋</div>
                <div className="text-sm">自动识别语言 & 精准翻译</div>
             </div>
           )}

           {history.map((item) => {
             if (item.role === 'user') {
               return (
                 <div key={item.id} className="flex justify-end mb-6 opacity-80 origin-right">
                   <div className="flex flex-col items-end max-w-[85%]">
                       {item.images && item.images.length > 0 && (
                           <div className="flex gap-1 mb-2 flex-wrap justify-end">
                               {item.images.map((img, i) => (
                                   <img key={i} src={img} className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm" alt="input" />
                               ))}
                           </div>
                       )}
                       {item.text && <div className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-2xl rounded-tr-sm text-[15px] break-words shadow-inner">{item.text}</div>}
                   </div>
                 </div>
               );
             }
             if (item.role === 'error') {
               return <div key={item.id} className="bg-red-50 text-red-500 text-xs p-3 rounded-xl text-center mb-6 shadow-sm">{item.text}</div>;
             }
             
             return (
               <div key={item.id} className="mb-6 animate-in slide-in-from-bottom-4 duration-500">
                  {item.modelName && <div className="text-center text-[10px] text-gray-400 mb-1 font-mono">{item.modelName}</div>}
                  {item.results.map((res, i) => (
                    <TranslationCard key={i} data={res} onPlay={() => playTTS(res.translation, targetLang, settings)} />
                  ))}
               </div>
             );
           })}
           {isLoading && (
              <div className="flex justify-center mb-8">
                <div className="bg-white/90 px-6 py-3.5 rounded-2xl shadow-lg flex items-center gap-3 text-pink-500 animate-pulse border border-pink-100">
                  <i className="fas fa-circle-notch fa-spin text-xl" />
                  <span className="font-bold text-sm">深度思考中...</span>
                </div>
              </div>
           )}
        </div>
      </div>

      {/* 底部输入区：修复点 2：使用 shrink-0，去掉 fixed，随 Flexbox 布局老实呆在界面底部最内侧 */}
      <div className="shrink-0 relative z-20 bg-white border-t border-pink-100/50 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-[600px] mx-auto px-4">
          
          <div className="flex items-center justify-center mb-2 px-1 relative">
            <div className="flex items-center gap-2 bg-slate-50/80 backdrop-blur-sm rounded-full p-1 border border-slate-100 shadow-sm mx-auto">
              <button onClick={() => setShowSrcPicker(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white shadow-sm rounded-full transition-all active:scale-95">
                <span className="text-sm">{getLangFlag(sourceLang)}</span>
                <span className="text-xs font-bold text-gray-700">{getLangName(sourceLang)}</span>
              </button>
              <button onClick={swapLangs} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-pink-500 active:scale-90 transition-transform"><i className="fas fa-exchange-alt text-xs" /></button>
              <button onClick={() => setShowTgtPicker(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white shadow-sm rounded-full transition-all active:scale-95">
                <span className="text-sm">{getLangFlag(targetLang)}</span>
                <span className="text-xs font-bold text-gray-700">{getLangName(targetLang)}</span>
              </button>
            </div>
            <button 
               onClick={() => setShowModelSelector(true)}
               className="absolute right-0 w-8 h-8 flex items-center justify-center rounded-full text-pink-400 hover:text-pink-600 active:bg-pink-50 transition-colors"
            >
              <i className="fas fa-robot" />
            </button>
          </div>

          <div className={`relative flex items-end gap-2 bg-white border rounded-[24px] p-1.5 shadow-sm transition-all duration-200 ${isRecording ? 'border-pink-300 ring-2 ring-pink-100' : 'border-slate-200'}`}>
            <Menu as="div" className="relative">
                <Menu.Button className="w-10 h-11 flex items-center justify-center text-gray-400 hover:text-pink-500 active:bg-pink-50 rounded-full">
                    <i className="fas fa-camera" />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute bottom-full left-0 mb-2 w-28 origin-bottom-left rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50">
                        <div className="p-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button onClick={() => cameraInputRef.current?.click()} className={`${active ? 'bg-pink-50 text-pink-600' : 'text-gray-700'} group flex w-full items-center rounded-lg px-2 py-2 text-sm`}>
                                        <i className="fas fa-camera mr-2"/> 拍照
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button onClick={() => fileInputRef.current?.click()} className={`${active ? 'bg-pink-50 text-pink-600' : 'text-gray-700'} group flex w-full items-center rounded-lg px-2 py-2 text-sm`}>
                                        <i className="fas fa-image mr-2"/> 相册
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
            
            <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
            <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" className="hidden" onChange={handleImageSelect} />

            <div className="flex-1 flex flex-col justify-center min-h-[44px]">
                {inputImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto mb-1 ml-1 py-1 no-scrollbar">
                        {inputImages.map((img, idx) => (
                            <div key={idx} className="relative shrink-0">
                                <img src={img} alt="preview" className="h-12 w-12 object-cover rounded-lg border border-gray-200" />
                                <button onClick={() => setInputImages(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-1 -right-1 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] active:scale-90"><i className="fas fa-times"/></button>
                            </div>
                        ))}
                    </div>
                )}
                <textarea
                  className="w-full bg-transparent border-none outline-none resize-none px-1 py-2.5 max-h-28 text-[15px] leading-relaxed no-scrollbar placeholder-gray-400 text-gray-800"
                  placeholder={isRecording ? "" : "输入内容..."}
                  rows={1}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTranslate(); } }}
                />
            </div>
            
            <div className="w-11 h-11 flex items-center justify-center shrink-0 mb-0.5 pr-0.5">
               {isRecording ? (
                 <button onClick={() => stopAndSend(true)} className="w-10 h-10 rounded-full bg-red-500 text-white shadow-md flex items-center justify-center animate-pulse">
                   <i className="fas fa-stop" />
                 </button>
               ) : ((inputVal.trim().length > 0 || inputImages.length > 0) ? (
                 <button onClick={() => handleTranslate()} className="w-10 h-10 rounded-full bg-pink-500 text-white shadow-md flex items-center justify-center active:scale-90 transition-transform">
                   <i className="fas fa-arrow-up" />
                 </button>
               ) : (
                 <button onClick={startRecording} className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 hover:bg-pink-50 hover:text-pink-500 transition-colors flex items-center justify-center">
                   <i className="fas fa-microphone" />
                 </button>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pickers (使用绝对定位不干扰 Flexbox) */}
      <Dialog open={showSrcPicker} onClose={() => setShowSrcPicker(false)} className="relative z-[10003]">
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4">
          <Dialog.Panel className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-2xl max-h-[70vh] overflow-y-auto slim-scrollbar animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in">
            <h3 className="font-bold text-gray-800 mb-4 ml-1">选择源语言</h3>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map(l => (
                <button key={l.code} onClick={() => { setSourceLang(l.code); setShowSrcPicker(false); }} className={`p-3 rounded-xl border text-left active:scale-95 transition-transform ${sourceLang===l.code?'border-pink-500 bg-pink-50':'border-gray-100 bg-slate-50'}`}>
                  <span className="mr-2">{l.flag}</span>{l.name}
                </button>
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      
      <Dialog open={showTgtPicker} onClose={() => setShowTgtPicker(false)} className="relative z-[10003]">
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4">
          <Dialog.Panel className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-2xl max-h-[70vh] overflow-y-auto slim-scrollbar animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in">
            <h3 className="font-bold text-gray-800 mb-4 ml-1">选择目标语言</h3>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map(l => (
                <button key={l.code} onClick={() => { setTargetLang(l.code); setShowTgtPicker(false); }} className={`p-3 rounded-xl border text-left active:scale-95 transition-transform ${targetLang===l.code?'border-pink-500 bg-pink-50':'border-gray-100 bg-slate-50'}`}>
                  <span className="mr-2">{l.flag}</span>{l.name}
                </button>
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {showSettings && <SettingsModal settings={settings} onSave={setSettings} onClose={() => setShowSettings(false)} />}
      
      {showModelSelector && (
        <ModelSelectorModal 
          settings={settings} 
          onClose={() => setShowModelSelector(false)} 
          onSave={setSettings}
        />
      )}
    </div>
  );
};

// ----------------- Drawer Wrapper -----------------
const AIChatDrawer = ({ isOpen, onClose }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      {/* 修改点 3：调整外层 Dialog.Panel，彻底切断所有可能会跑偏的样式 */}
      <Dialog as="div" className="relative z-[99999]" onClose={onClose}>
        <Transition.Child 
          as={Fragment} 
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" 
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>
        
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child 
              as={Fragment} 
              enter="transform transition ease-in-out duration-300" 
              enterFrom="translate-y-full" enterTo="translate-y-0" 
              leave="transform transition ease-in-out duration-300" 
              leaveFrom="translate-y-0" leaveTo="translate-y-full"
            >
              {/* 核心修正：外壳使用 flex 和 100dvh，绝不使用 fixed bottom */}
              <Dialog.Panel className="pointer-events-auto flex h-[100dvh] w-screen flex-col bg-[#FFF0F5]">
                <AiChatContent onClose={onClose} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AIChatDrawer;
