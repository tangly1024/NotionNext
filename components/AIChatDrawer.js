import { Transition, Dialog, Menu } from '@headlessui/react';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Fragment,
  memo
} from 'react';
// 引用外部字典库逻辑
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
    
    .pt-safe-top { padding-top: env(safe-area-inset-top); }
    .pb-safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
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
    } catch (e) { console.error("Audio Error", e); }
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
  if (/[\u0600-\u06FF]+/.test(text)) return 'ar-SA';
  if (/[\u0900-\u097F]+/.test(text)) return 'hi-IN';
  if (/^[a-zA-Z0-9\s,.?!\-'"()@#$%^&*_+:;]+$/.test(text)) return 'en-US';
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

const BASE_SYSTEM_INSTRUCTION = `You are a professional, strictly literal translator.
Requirements:
1. FAITHFULNESS: Maintain the EXACT original meaning, structure, tone, punctuation, and line breaks. DO NOT add, omit, or explain anything.
2. FORMAT: Output ONLY strict JSON.
3. SCHEMA: {"data": [{"translation": "...", "back_translation": "..."}]}
4. BACK TRANSLATION: "back_translation" MUST translate your result back to the Source language to verify accuracy.`;

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
const MAX_TTS_CACHE = 30; 

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
      if (ttsCache.size >= MAX_TTS_CACHE) {
          const firstKey = ttsCache.keys().next().value;
          const oldAudio = ttsCache.get(firstKey);
          if (oldAudio?.src) URL.revokeObjectURL(oldAudio.src);
          ttsCache.delete(firstKey);
      }
      audio = new Audio(URL.createObjectURL(blob));
      ttsCache.set(key, audio);
    }
    audio.currentTime = 0;
    audio.playbackRate = speed;
    await audio.play();
  } catch (e) { console.error('TTS Error', e); }
};

// ----------------- Logic Helpers -----------------
const normalizeTranslations = (raw) => {
  let data = [];
  try {
    if (typeof raw === 'object' && raw !== null) {
        data = Array.isArray(raw.data) ? raw.data : (Array.isArray(raw) ? raw : []);
    } else {
        let cleanRaw = typeof raw === 'string' ? raw.trim() : '';
        const start = cleanRaw.indexOf('{');
        const end = cleanRaw.lastIndexOf('}');
        if (start >= 0 && end > start) {
          cleanRaw = cleanRaw.substring(start, end + 1);
        }
        const json = JSON.parse(cleanRaw);
        data = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
    }
  } catch (e) {
    return [{ translation: typeof raw === 'string' ? raw : '解析失败', back_translation: '' }];
  }
  const validData = data.filter(x => x && x.translation);
  return validData.length ? validData.slice(0, 4) : [{ translation: String(raw), back_translation: '' }];
};

const getLangName = (c) => SUPPORTED_LANGUAGES.find(l => l.code === c)?.name || c;
const getLangFlag = (c) => SUPPORTED_LANGUAGES.find(l => l.code === c)?.flag || '';

// ----------------- UI Components -----------------

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
      <button onClick={(e) => { e.stopPropagation(); onPlay(); }} className="absolute bottom-2 right-2 p-2 text-gray-300 hover:text-pink-500 opacity-50 hover:opacity-100">
        <i className="fas fa-volume-up" />
      </button>
    </div>
  );
});

const ModelSelectorModal = ({ settings, onClose, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const activeModelObj = settings.models.find(m => m.id === localSettings.mainModelId);
  const [selectedProvId, setSelectedProvId] = useState(activeModelObj?.providerId || settings.providers[0]?.id);

  const currentModels = settings.models.filter(m => m.providerId === selectedProvId);

  return (
    <Dialog open={true} onClose={onClose} className="relative z-[10005]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden h-[500px] flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="font-bold text-gray-800">选择翻译模型</div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"><i className="fas fa-times"/></button>
          </div>
          <div className="flex flex-1 overflow-hidden">
             <div className="w-1/3 bg-gray-50 border-r border-gray-100 overflow-y-auto slim-scrollbar p-2">
               {settings.providers.map(p => (
                 <button key={p.id} onClick={() => setSelectedProvId(p.id)} className={`w-full text-left px-3 py-3 rounded-xl text-xs font-bold mb-1 relative transition-colors ${selectedProvId === p.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                   {p.id === activeModelObj?.providerId && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-pink-500 rounded-r-full"/>}
                   {p.name}
                 </button>
               ))}
             </div>
             <div className="flex-1 overflow-y-auto slim-scrollbar p-3">
               {currentModels.map(m => (
                 <button key={m.id} onClick={() => setLocalSettings({...localSettings, mainModelId: m.id})} className={`w-full text-left px-4 py-3 rounded-xl border mb-2 flex justify-between ${localSettings.mainModelId === m.id ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-100'}`}>
                   <div><div className="font-bold text-sm">{m.name}</div><div className="text-[10px] opacity-60 font-mono">{m.value}</div></div>
                   {localSettings.mainModelId === m.id && <i className="fas fa-check mt-1" />}
                 </button>
               ))}
             </div>
          </div>
          <div className="p-4 border-t border-gray-100">
             <button onClick={() => { onSave(localSettings); onClose(); }} className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-200">确认选择</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

const SettingsModal = ({ settings, onSave, onClose }) => {
  const [data, setData] = useState(settings);
  const [tab, setTab] = useState('common');
  const fileInputRef = useRef(null);

  const updateProvider = (idx, f, v) => { const arr=[...data.providers]; arr[idx]={...arr[idx],[f]:v}; setData({...data,providers:arr}); };
  const addProvider = () => setData(prev=>({...prev,providers:[...prev.providers,{id:nowId(),name:'新供应商',url:'',key:''}]}));
  const delProvider = (id) => setData(prev => {
    if (prev.providers.length <= 1) return prev;
    const nP = prev.providers.filter(p => p.id !== id);
    const nM = prev.models.filter(m => m.providerId !== id);
    return {...prev, providers: nP, models: nM, mainModelId: nM[0]?.id || ''};
  });

  const addModel = (pid) => setData(prev=>({...prev,models:[...prev.models,{id:nowId(),providerId:pid,name:'新模型',value:''}]}));
  const updateModel = (mid,f,v) => setData(prev=>({...prev,models:prev.models.map(m=>m.id===mid?{...m,[f]:v}:m)}));
  const delModel = (mid) => setData(prev => ({...prev, models: prev.models.filter(m => m.id !== mid)}));

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
            <div className="font-bold text-gray-800">设置中心</div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500"><i className="fas fa-times"/></button>
          </div>
          <div className="flex p-2 gap-1 border-b border-gray-100 bg-gray-50/30">
            {[{id:'common',label:'通用'}, {id:'provider',label:'模型引擎'}, {id:'voice',label:'语音人'}].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${tab===t.id ? 'bg-white shadow-sm text-pink-600':'text-gray-500 hover:bg-white/50'}`}>{t.label}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto slim-scrollbar p-5 bg-white">
            {tab === 'common' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <div className="text-sm font-bold text-gray-700">过滤思考过程</div>
                    <div className="text-xs text-gray-400">自动隐藏 &lt;think&gt; 标签内容</div>
                  </div>
                  <input type="checkbox" checked={data.filterThinking} onChange={e => setData({...data, filterThinking: e.target.checked})} className="w-5 h-5 accent-pink-500"/>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <div className="text-sm font-bold text-gray-700 mb-3">聊天背景图</div>
                  <div className="flex items-center gap-3 mb-4">
                     <button onClick={() => fileInputRef.current.click()} className="flex-1 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold shadow-sm">上传图片</button>
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleBgUpload} />
                     <button onClick={() => setData({...data, chatBackgroundUrl: ''})} className="px-4 py-2 bg-red-50 text-red-500 border border-red-100 rounded-xl text-xs font-bold">清除</button>
                  </div>
                  <div className="text-[11px] text-gray-400 mb-1 flex justify-between"><span>背景淡化程度</span><span>{Math.round(data.backgroundOverlay*100)}%</span></div>
                  <input type="range" min="0.5" max="1.0" step="0.05" value={data.backgroundOverlay} onChange={e=>setData({...data, backgroundOverlay: parseFloat(e.target.value)})} className="w-full accent-pink-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                </div>
              </div>
            )}
            {tab === 'provider' && (
              <div className="space-y-6">
                {data.providers.map((p, idx) => (
                  <div key={p.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                       <input className="font-bold text-gray-800 bg-transparent outline-none w-full" value={p.name} onChange={e=>updateProvider(idx,'name',e.target.value)} />
                       <button onClick={()=>delProvider(p.id)} className="text-red-400 text-xs hover:text-red-600">删除</button>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mb-4">
                      <input className="bg-white text-xs p-3 rounded-xl border border-gray-200 outline-pink-200" placeholder="接口 URL (Endpoint)" value={p.url} onChange={e=>updateProvider(idx,'url',e.target.value)} />
                      <input className="bg-white text-xs p-3 rounded-xl border border-gray-200 outline-pink-200" type="password" placeholder="API Key" value={p.key} onChange={e=>updateProvider(idx,'key',e.target.value)} />
                    </div>
                    <div className="bg-white/60 rounded-xl p-3 border border-gray-100">
                      <div className="flex justify-between mb-3 items-center"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">模型列表</span><button onClick={()=>addModel(p.id)} className="text-[10px] bg-pink-100 text-pink-600 px-3 py-1 rounded-full font-bold">+ 新增</button></div>
                      {data.models.filter(m=>m.providerId===p.id).map(m => (
                        <div key={m.id} className="flex gap-2 items-center mb-2">
                          <input className="flex-1 text-[11px] border border-gray-100 rounded-lg p-2 bg-white" placeholder="别名" value={m.name} onChange={e=>updateModel(m.id,'name',e.target.value)} />
                          <input className="flex-1 text-[11px] border border-gray-100 rounded-lg p-2 bg-white font-mono" placeholder="模型 ID" value={m.value} onChange={e=>updateModel(m.id,'value',e.target.value)} />
                          <button onClick={()=>delModel(m.id)} className="text-gray-300 hover:text-red-500 px-1"><i className="fas fa-times text-sm"/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={addProvider} className="w-full py-3 border border-dashed border-gray-300 rounded-2xl text-gray-400 text-sm font-bold hover:bg-gray-50 transition-colors">+ 添加新的 API 供应商</button>
              </div>
            )}
            {tab === 'voice' && (
              <div className="space-y-4">
                 <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                    <div>
                        <div className="text-sm font-bold text-gray-700">自动朗读译文</div>
                        <div className="text-xs text-gray-400">完成翻译后自动播放第一条结果</div>
                    </div>
                    <input type="checkbox" checked={data.autoPlayTTS} onChange={e => setData({...data, autoPlayTTS: e.target.checked})} className="w-5 h-5 accent-pink-500"/>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-2xl">
                    <div className="text-sm font-bold text-gray-700 flex justify-between"><span>全局语速</span><span>{data.ttsSpeed}x</span></div>
                    <input type="range" min="0.5" max="2.0" step="0.1" className="w-full accent-pink-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3" value={data.ttsSpeed} onChange={e=>setData({...data,ttsSpeed:parseFloat(e.target.value)})}/>
                 </div>
                 <div className="px-1 pt-2 font-bold text-gray-700 text-sm">各语言默认发音人</div>
                 <div className="bg-gray-50 rounded-2xl p-2 divide-y divide-gray-100">
                    {SUPPORTED_LANGUAGES.map(lang => AVAILABLE_VOICES[lang.code] && (
                        <div key={lang.code} className="flex items-center justify-between py-3 px-2">
                            <div className="flex items-center gap-2 text-sm"><span>{lang.flag}</span><span className="text-gray-600">{lang.name}</span></div>
                            <select className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 outline-none" value={(data.ttsConfig||{})[lang.code]||''} onChange={(e)=>{
                                const cfg={...(data.ttsConfig||{})}; cfg[lang.code]=e.target.value; setData({...data,ttsConfig:cfg});
                            }}>
                                <option value="">系统默认</option>
                                {AVAILABLE_VOICES[lang.code].map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                        </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50/30">
             <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-gray-100 text-sm font-bold text-gray-500">放弃</button>
             <button onClick={()=>{onSave(data);onClose();}} className="flex-1 py-3 rounded-xl bg-pink-500 text-sm font-bold text-white shadow-lg shadow-pink-200">保存设置</button>
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
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        if (parsed.lastSourceLang) setSourceLang(parsed.lastSourceLang);
        if (parsed.lastTargetLang) setTargetLang(parsed.lastTargetLang);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const toSave = { ...settings, lastSourceLang: sourceLang, lastTargetLang: targetLang };
    safeLocalStorageSet('ai886_settings', JSON.stringify(toSave));
  }, [settings, sourceLang, targetLang]);

  const scrollToResult = () => {
    if (!scrollRef.current) return;
    setTimeout(() => {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const fetchAi = async (messages, modelId, signal) => {
    const model = settings.models.find(m => m.id === modelId);
    if (!model) throw new Error(`未选择有效模型`);
    const provider = settings.providers.find(p => p.id === model.providerId);
    if (!provider?.key) throw new Error(`供应商 API Key 缺失`);

    const res = await fetch(`${provider.url.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${provider.key}` },
      body: JSON.stringify({ 
        model: model.value, 
        messages, 
        stream: false,
        response_format: { type: 'json_object' }
      }),
      signal
    });

    // 检查是否返回了 HTML (404/500)
    const contentType = res.headers.get("content-type");
    if (!res.ok || (contentType && contentType.includes("text/html"))) {
        const text = await res.text();
        if (text.includes('<!DOCTYPE')) throw new Error('API 地址填写错误，请检查 URL。');
        throw new Error(`API 错误: ${res.status}`);
    }

    const data = await res.json();
    let content = data.choices?.[0]?.message?.content || "";
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

    let cSrc = sourceLang, cTgt = targetLang;
    if (text) {
        const det = detectScript(text);
        if (det && det !== cSrc) {
            if (det === cTgt) { [cSrc, cTgt] = [cTgt, cSrc]; setSourceLang(cSrc); setTargetLang(cTgt); }
            else { setSourceLang(det); cSrc = det; }
        }
    }

    setIsLoading(true);
    setHistory([{ id: nowId(), role: 'user', text, images: inputImages, ts: Date.now() }]);
    setInputVal(''); setInputImages([]); scrollToResult();

    try {
      let aiMsg = { id: nowId(), role: 'ai', results: [], modelName: '', ts: Date.now(), tgtLang: cTgt };

      // 1. 本地字典优先
      let dictHit = null;
      if (inputImages.length === 0 && text) {
         try {
             // 这里必须适配你提到的 data/cheat-dict 路径逻辑
             const dict = await loadCheatDict(cSrc);
             // ✅ 重要修复：matchCheatLoose 是异步的，必须 await
             dictHit = await matchCheatLoose(dict, text, cTgt);
         } catch (e) { console.warn("Dict miss", e); }
      }
      
      if (dictHit && dictHit.length > 0 && dictHit[0].translation !== '（字典数据为空）') {
        aiMsg.results = normalizeTranslations(dictHit);
        aiMsg.modelName = '本地专业词库';
      } else {
        // 2. AI 接口备选
        const sysPrompt = BASE_SYSTEM_INSTRUCTION + (settings.useCustomPrompt ? `\nExtra: ${settings.customPromptText}` : '');
        const userPrompt = `Source: ${cSrc} (${getLangName(cSrc)}), Target: ${cTgt} (${getLangName(cTgt)})\nTranslate: ${text || '[Image]'}`;
        
        let contentArr = [{ type: "text", text: userPrompt }];
        inputImages.forEach(img => contentArr.push({ type: "image_url", image_url: { url: img } }));

        const res = await fetchAi([{ role: 'system', content: sysPrompt }, { role: 'user', content: inputImages.length ? contentArr : userPrompt }], settings.mainModelId, signal);
        aiMsg.results = normalizeTranslations(res.content);
        aiMsg.modelName = res.modelName;
      }

      if (currentRequestIdRef.current === requestId) {
          setHistory(prev => [...prev, aiMsg]);
          if (settings.autoPlayTTS && aiMsg.results?.[0]) playTTS(aiMsg.results[0].translation, cTgt, settings);
          scrollToResult();
      }
    } catch (e) {
      if (e.name !== 'AbortError' && currentRequestIdRef.current === requestId) {
         setHistory(prev => [...prev, { id: nowId(), role: 'error', text: e.message || '翻译遇到错误', ts: Date.now() }]);
      }
    } finally {
      if (currentRequestIdRef.current === requestId) setIsLoading(false);
    }
  };

  const startRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert('浏览器不支持语音');
    playBeep();
    const rec = new SR();
    rec.lang = sourceLang; rec.interimResults = true;
    recognitionRef.current = rec;
    setIsRecording(true);
    rec.onresult = (e) => {
        const t = Array.from(e.results).map(r => r[0].transcript).join('');
        setInputVal(t);
        if (e.results[0].isFinal) { rec.stop(); handleTranslate(t); }
    };
    rec.onend = () => setIsRecording(false);
    rec.start();
  };

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-[#FFF0F5] relative text-gray-800 overflow-hidden">
      <GlobalStyles />
      {settings.chatBackgroundUrl && (
        <div className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: `url('${settings.chatBackgroundUrl}')', opacity: 1 - settings.backgroundOverlay }} />
      )}

      {/* Header */}
      <div className="relative z-20 pt-safe-top bg-white/60 backdrop-blur-md shadow-sm border-b border-pink-100/50">
        <div className="flex items-center justify-between h-12 relative px-4">
          <div className="w-10"></div>
          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <i className="fas fa-link text-pink-500" />
            <span className="font-extrabold text-gray-800 text-lg tracking-tight">886.best</span>
          </div>
          <button onClick={() => setShowSettings(true)} className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-200 text-gray-600"><i className="fas fa-cog" /></button>
        </div>
      </div>

      {/* Recording Overlay */}
      <Transition show={isRecording} as={Fragment} enter="duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="fixed top-24 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="bg-pink-500/90 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-pulse pointer-events-auto backdrop-blur-sm font-bold">
            <i className="fas fa-microphone animate-bounce"/> 语音识别中...
          </div>
        </div>
      </Transition>

      {/* Chat Space */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-4 pt-4 pb-40">
        <div className="w-full max-w-[600px] mx-auto min-h-full flex flex-col justify-end">
           {history.length === 0 && !isLoading && (
             <div className="text-center text-gray-400 mb-20 opacity-60">
                <div className="text-4xl mb-2">👋</div><div className="text-sm font-bold">AI 智能翻译引擎</div>
             </div>
           )}
           {history.map((item) => (
             <div key={item.id} className={`mb-6 ${item.role === 'user' ? 'flex justify-end' : ''}`}>
               {item.role === 'user' ? (
                 <div className="flex flex-col items-end max-w-[85%]">
                    {item.images?.map((img, i) => <img key={i} src={img} className="w-32 h-32 object-cover rounded-xl border-2 border-white shadow-sm mb-1" alt="" />)}
                    {item.text && <div className="bg-white/80 backdrop-blur-md text-gray-700 px-4 py-2.5 rounded-2xl rounded-tr-sm text-[15px] shadow-sm border border-white">{item.text}</div>}
                 </div>
               ) : item.role === 'error' ? (
                 <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl border border-red-100 w-full text-center font-bold">{item.text}</div>
               ) : (
                 <div className="animate-in slide-in-from-bottom-4 duration-500">
                    {item.modelName && <div className="text-[10px] text-center text-gray-400 mb-1.5 font-mono uppercase tracking-widest">{item.modelName}</div>}
                    {item.results.map((res, i) => <TranslationCard key={i} data={res} onPlay={() => playTTS(res.translation, item.tgtLang, settings)} />)}
                 </div>
               )}
             </div>
           ))}
           {isLoading && (
              <div className="flex justify-center mb-8"><div className="bg-white/90 px-5 py-3 rounded-2xl shadow-sm flex items-center gap-3 text-pink-500 border border-pink-100 font-bold"><i className="fas fa-circle-notch fa-spin" /><span>思考并翻译中</span></div></div>
           )}
        </div>
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-safe-bottom">
        <div className="w-full max-w-[600px] mx-auto px-4">
          <div className="flex items-center justify-center mb-3 relative">
            <div className="flex items-center gap-1 bg-white/60 backdrop-blur-md rounded-full p-1 border border-white shadow-sm">
              <button onClick={() => setShowSrcPicker(true)} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-full transition-all">
                <span className="text-lg">{getLangFlag(sourceLang)}</span><span className="text-xs font-bold text-gray-700">{getLangName(sourceLang)}</span>
              </button>
              <button onClick={() => { setSourceLang(targetLang); setTargetLang(sourceLang); }} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-pink-500"><i className="fas fa-exchange-alt text-xs" /></button>
              <button onClick={() => setShowTgtPicker(true)} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-full transition-all">
                <span className="text-lg">{getLangFlag(targetLang)}</span><span className="text-xs font-bold text-gray-700">{getLangName(targetLang)}</span>
              </button>
            </div>
            <button onClick={() => setShowModelSelector(true)} className="absolute right-0 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-pink-50 text-pink-500 shadow-sm"><i className="fas fa-robot" /></button>
          </div>

          <div className="relative flex items-end gap-2 bg-white border border-pink-100 rounded-[28px] p-2 shadow-lg mb-2">
            <Menu as="div" className="relative">
                <Menu.Button className="w-10 h-10 flex items-center justify-center text-gray-400"><i className="fas fa-camera text-xl" /></Menu.Button>
                <Transition as={Fragment} enter="duration-100" enterFrom="scale-95 opacity-0" enterTo="scale-100 opacity-100" leave="duration-75">
                    <Menu.Items className="absolute bottom-full left-0 mb-3 w-32 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden p-1">
                        <Menu.Item>{({ active }) => <button onClick={() => cameraInputRef.current?.click()} className={`flex w-full items-center px-3 py-2 text-sm rounded-xl ${active?'bg-pink-50 text-pink-600':'text-gray-700'}`}><i className="fas fa-camera mr-2"/>拍照</button>}</Menu.Item>
                        <Menu.Item>{({ active }) => <button onClick={() => fileInputRef.current?.click()} className={`flex w-full items-center px-3 py-2 text-sm rounded-xl ${active?'bg-pink-50 text-pink-600':'text-gray-700'}`}><i className="fas fa-image mr-2"/>相册</button>}</Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
            
            <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" onChange={async (e)=>{
                const files = Array.from(e.target.files);
                const res = await Promise.all(files.map(f => compressImage(f)));
                setInputImages(prev => [...prev, ...res]); e.target.value='';
            }} />
            <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" className="hidden" onChange={async (e)=>{
                const file = e.target.files[0];
                if(file) setInputImages(prev => [...prev, compressImage(file)]); e.target.value='';
            }} />

            <div className="flex-1 flex flex-col py-1">
                {inputImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto mb-2 no-scrollbar">
                        {inputImages.map((img, idx) => (
                            <div key={idx} className="relative shrink-0">
                                <img src={img} className="h-12 w-12 object-cover rounded-lg border border-gray-100" alt="" />
                                <button onClick={() => setInputImages(p => p.filter((_, i) => i !== idx))} className="absolute -top-1 -right-1 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"><i className="fas fa-times"/></button>
                            </div>
                        ))}
                    </div>
                )}
                <textarea className="w-full bg-transparent border-none outline-none resize-none px-1 py-1 max-h-32 text-[16px] placeholder-gray-300" placeholder="想翻译什么？" rows={1} value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault(); handleTranslate();}}} />
            </div>
            
            <button onClick={() => isRecording ? recognitionRef.current?.stop() : (inputVal || inputImages.length ? handleTranslate() : startRecording())} 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${isRecording ? 'bg-red-500 text-white animate-pulse' : (inputVal || inputImages.length ? 'bg-pink-500 text-white active:scale-90' : 'bg-gray-100 text-gray-500')}`}>
               <i className={`fas ${isRecording ? 'fa-stop' : (inputVal || inputImages.length ? 'fa-arrow-up' : 'fa-microphone')}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Selectors */}
      <Dialog open={showSrcPicker} onClose={() => setShowSrcPicker(false)} className="relative z-[10003]"><div className="fixed inset-0 bg-black/20" /><div className="fixed inset-0 flex items-center justify-center p-4"><Dialog.Panel className="w-full max-w-xs bg-white rounded-3xl p-4 shadow-2xl max-h-[60vh] overflow-y-auto slim-scrollbar"><div className="grid grid-cols-2 gap-2">{SUPPORTED_LANGUAGES.map(l => <button key={l.code} onClick={() => { setSourceLang(l.code); setShowSrcPicker(false); }} className={`p-3 rounded-2xl border text-sm text-left ${sourceLang===l.code?'border-pink-500 bg-pink-50':'border-gray-50'}`}><span className="mr-2">{l.flag}</span>{l.name}</button>)}</div></Dialog.Panel></div></Dialog>
      <Dialog open={showTgtPicker} onClose={() => setShowTgtPicker(false)} className="relative z-[10003]"><div className="fixed inset-0 bg-black/20" /><div className="fixed inset-0 flex items-center justify-center p-4"><Dialog.Panel className="w-full max-w-xs bg-white rounded-3xl p-4 shadow-2xl max-h-[60vh] overflow-y-auto slim-scrollbar"><div className="grid grid-cols-2 gap-2">{SUPPORTED_LANGUAGES.map(l => <button key={l.code} onClick={() => { setTargetLang(l.code); setShowTgtPicker(false); }} className={`p-3 rounded-2xl border text-sm text-left ${targetLang===l.code?'border-pink-500 bg-pink-50':'border-gray-50'}`}><span className="mr-2">{l.flag}</span>{l.name}</button>)}</div></Dialog.Panel></div></Dialog>

      {showSettings && <SettingsModal settings={settings} onSave={setSettings} onClose={() => setShowSettings(false)} />}
      {showModelSelector && <ModelSelectorModal settings={settings} onClose={() => setShowModelSelector(false)} onSave={setSettings} />}
    </div>
  );
};

// ----------------- Export Drawer -----------------
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
