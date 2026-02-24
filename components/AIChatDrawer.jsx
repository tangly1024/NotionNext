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
// 仅用于存储消息以便发送时的缓存，不用于展示历史列表
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

    .chip-scroll-container {
      display: flex; gap: 8px; overflow-x: auto; padding: 4px 10px;
      -webkit-overflow-scrolling: touch; cursor: grab;
    }

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
const BASE_SYSTEM_INSTRUCTION = `你是一位精通中缅双语的“高保真社交翻译 AI”。
唯一任务：实现【口语化的精准直译】，执行双向互译。

═══════════════════════════════
【核心翻译法则：语义锁定】
═══════════════════════════════
1. 含义第一：必须 100% 保留原文的事实、立场、情绪和强弱。
2. 句级对齐：输入有几句，data 数组就必须有几项。不得合并或拆分。
3. 冲突处理：当【口语自然度】与【原文含义】冲突时，永远以【原文含义】为最高优先级。宁可表达略显生硬，也绝不允许改意思。

═══════════════════════════════
【双向翻译逻辑：目标语言严控】
═══════════════════════════════
判定逻辑：识别输入语言，【绝对只能】翻译为另一种语言。

CASE A：输入中文 -> 【目标语：缅甸口语】
- 目标：用语法口语化 + 用词本地化，还原原文强度。
- 映射：画饼(ကတိချည်းပဲပေး), 没法不理(လျစ်လျူရှုလို့မရဘူး), 顺其自然(ဖြစ်သလိုပဲနေ), 抱抱(ဖက်ထားချင်)。
- 语气：语气词(နော်, လေ, ပါ)仅用于还原情绪，严禁乱加。

CASE B：输入缅文 -> 【目标语：地道中文】
- 目标：识别潜台词（撒娇/生气/冷淡等），用中国社交口语还原。
- 要求：严禁书面语，必须让中国人一眼看出原文的情绪张力。

═══════════════════════════════
【JSON 输出规格】
═══════════════════════════════
必须严格按此格式输出，严禁任何前言、后缀、Markdown 或解释：
单句：{"data":[{"translation":"..."}]}
多句：{"data":[{"translation":"第一句"},{"translation":"第二句"}]}

注意：严禁输出英文、日文、泰文或代码块标记。`;



const REPLY_SYSTEM_INSTRUCTION = `你是一个聊天助手。 用户刚刚把一句【源语言】翻译成了【目标语言】。 请用【目标语言】（Target Language）生成 3 到 8 个简短、自然的回复建议，帮助用户回答对方。 场景为日常聊天，回复要口语化。 只返回 JSON 数组字符串，格式：["回复1", "回复2", ...],不要 markdown。`;

const DEFAULT_SETTINGS = {
  providers: DEFAULT_PROVIDERS,
  models: DEFAULT_MODELS,

  mainModelId: 'm1',
  secondModelId: null,
  followUpModelId: 'm1',

  ttsConfig: {},
  ttsSpeed: 1.0,
  autoPlayTTS: false, // 自动朗读开关

  backgroundOverlay: 0.9,
  chatBackgroundUrl: '',

  useCustomPrompt: false,
  customPromptText: '',

  filterThinking: true,
  enableFollowUp: true,

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

// 1. 结果卡片容器
const TranslationResultContainer = memo(({ item, targetLang, onPlay }) => {
  const hasDual = !!(item.modelResults && item.modelResults.length > 1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStart = useRef(null);

  const effectiveIndex = hasDual ? currentIndex : 0;
  const currentData = hasDual ? item.modelResults[effectiveIndex].data : item.results;
  const currentModelName = hasDual ? item.modelResults[effectiveIndex].modelName : null;

  const onTouchStart = (e) => { if (!hasDual) return; touchStart.current = e.targetTouches[0].clientX; };
  const onTouchEnd = (e) => {
    if (!hasDual || touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (diff > 50) setCurrentIndex(prev => (prev + 1) % item.modelResults.length);
    if (diff < -50) setCurrentIndex(prev => (prev - 1 + item.modelResults.length) % item.modelResults.length);
    touchStart.current = null;
  };

  return (
    <div className="relative group" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {hasDual && (
        <div className="flex justify-center mb-1 gap-1">
          {item.modelResults.map((_, idx) => (
            <div key={idx} className={`h-1 rounded-full transition-all ${idx === effectiveIndex ? 'w-4 bg-pink-400' : 'w-1.5 bg-gray-200'}`} />
          ))}
        </div>
      )}
      {currentModelName && <div className="text-[10px] text-center text-gray-400 mb-1 font-mono">{currentModelName}</div>}
      
      {/* 增加 Key 以触发切换动画 */}
      <div key={effectiveIndex} className="animate-in fade-in slide-in-from-right-4 duration-300">
        {currentData.map((res, i) => (
            <TranslationCard key={i} data={res} onPlay={() => onPlay(res.translation)} />
        ))}
      </div>
    </div>
  );
});

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
      
      {/* 移除了风格标签显示 */}

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

// 2. 追问气泡
const ReplyChips = ({ suggestions, onClick }) => {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-[10px] text-gray-400 text-center mb-2">快捷回复 (译文语言)</div>
      <div className="chip-scroll-container no-scrollbar">
        {suggestions.map((text, i) => (
          <button key={i} onClick={() => onClick(text)} className="shrink-0 bg-white border border-pink-100 text-gray-600 px-3 py-1.5 rounded-full text-sm shadow-sm hover:bg-pink-50 active:scale-95 transition-transform">
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};

// 3. 模型选择器
const ModelSelectorModal = ({ settings, onClose, onSave }) => {
  const [mode, setMode] = useState('main');
  const [localSettings, setLocalSettings] = useState(settings);

  let currentActiveModelId = null;
  if (mode === 'main') currentActiveModelId = localSettings.mainModelId;
  else if (mode === 'second') currentActiveModelId = localSettings.secondModelId;
  else currentActiveModelId = localSettings.followUpModelId;

  const activeModelObj = settings.models.find(m => m.id === currentActiveModelId);
  const activeProviderId = activeModelObj ? activeModelObj.providerId : null;
  const [selectedProvId, setSelectedProvId] = useState(activeProviderId || settings.providers[0]?.id);

  useEffect(() => {
    let mid = null;
    if (mode === 'main') mid = localSettings.mainModelId;
    else if (mode === 'second') mid = localSettings.secondModelId;
    else mid = localSettings.followUpModelId;

    const m = settings.models.find(x => x.id === mid);
    if (m) setSelectedProvId(m.providerId);
  }, [mode, localSettings]);

  const handleSelect = (modelId) => {
    if (mode === 'main') setLocalSettings(s => ({ ...s, mainModelId: modelId }));
    else if (mode === 'second') setLocalSettings(s => ({ ...s, secondModelId: (s.secondModelId === modelId ? null : modelId) }));
    else setLocalSettings(s => ({ ...s, followUpModelId: modelId }));
  };

  const currentModels = settings.models.filter(m => m.providerId === selectedProvId);

  return (
    <Dialog open={true} onClose={onClose} className="relative z-[10005]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden h-[550px] flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="font-bold text-gray-800">模型选择</div>
            <button onClick={onClose}><i className="fas fa-times text-gray-400"/></button>
          </div>

          <div className="flex p-2 gap-2 border-b border-gray-100 bg-gray-50">
            <button onClick={() => setMode('main')} className={`flex-1 py-2 text-xs font-bold rounded-lg relative flex items-center justify-center gap-1 ${mode==='main'?'bg-white shadow text-pink-600':'text-gray-500'}`}>
                主翻译
                {localSettings.mainModelId && <span className="w-1.5 h-1.5 bg-green-500 rounded-full"/>}
            </button>
            <button onClick={() => setMode('second')} className={`flex-1 py-2 text-xs font-bold rounded-lg relative flex items-center justify-center gap-1 ${mode==='second'?'bg-white shadow text-purple-600':'text-gray-500'}`}>
                对比模型
                {localSettings.secondModelId && <span className="w-1.5 h-1.5 bg-green-500 rounded-full"/>}
            </button>
            <button onClick={() => setMode('followup')} className={`flex-1 py-2 text-xs font-bold rounded-lg relative flex items-center justify-center gap-1 ${mode==='followup'?'bg-white shadow text-blue-600':'text-gray-500'}`}>
                追问建议
                {localSettings.followUpModelId && <span className="w-1.5 h-1.5 bg-green-500 rounded-full"/>}
            </button>
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
                 const isSelected = (m.id === currentActiveModelId);
                 let activeClass = isSelected 
                    ? (mode === 'main' ? 'border-pink-500 bg-pink-50 text-pink-700' : (mode === 'second' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-blue-500 bg-blue-50 text-blue-700'))
                    : 'border-gray-100';

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

// 4. 设置弹窗
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
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-sm font-bold text-gray-700">启用追问建议</div>
                  </div>
                  <input type="checkbox" checked={data.enableFollowUp} onChange={e => setData({...data, enableFollowUp: e.target.checked})} className="w-5 h-5 accent-pink-500"/>
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
                        <div className="text-xs text-gray-400">翻译完成后自动播放第一条结果</div>
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

  // 语言状态
  const [sourceLang, setSourceLang] = useState('zh-CN');
  const [targetLang, setTargetLang] = useState('my-MM');

  const [inputVal, setInputVal] = useState('');
  const [inputImages, setInputImages] = useState([]); // 多图支持
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 录音相关状态与 Ref
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const [suggestions, setSuggestions] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const scrollRef = useRef(null);

  const [showSettings, setShowSettings] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showSrcPicker, setShowSrcPicker] = useState(false);
  const [showTgtPicker, setShowTgtPicker] = useState(false);

  // 初始化加载
  useEffect(() => {
    const s = safeLocalStorageGet('ai886_settings');
    if (s) {
      const parsed = JSON.parse(s);
      setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      // 恢复上次语言选择
      if (parsed.lastSourceLang) setSourceLang(parsed.lastSourceLang);
      if (parsed.lastTargetLang) setTargetLang(parsed.lastTargetLang);
    }
    // 每次进入都清空历史，只显示欢迎界面
    setHistory([]);
  }, []);

  // 持久化保存
  useEffect(() => {
    const toSave = { ...settings, lastSourceLang: sourceLang, lastTargetLang: targetLang };
    safeLocalStorageSet('ai886_settings', JSON.stringify(toSave));
  }, [settings, sourceLang, targetLang]);

  // Cleanup
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

  // 普通请求
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

    // 过滤思考过程
    if (settings.filterThinking) {
        content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    }

    return { content, modelName: pm.model.name };
  };

  const handleTranslate = async (textOverride = null) => {
    let text = (textOverride || inputVal).trim();
    if (!text && inputImages.length === 0) return;

    // 1. 自动语言检测与交换
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
    setSuggestions([]);
    
    // 生成临时会话ID
    const currentSessionId = nowId();

    // 构造用户消息
    const userMsg = { 
        id: nowId(), 
        sessionId: currentSessionId, 
        role: 'user', 
        text, 
        images: inputImages, 
        ts: Date.now(), 
        results: [] 
    };

    // 关键改变：每次都重置为新的对话列表，不保存历史
    setHistory([userMsg]);
    setInputVal('');
    setInputImages([]);
    scrollToResult();

    // ----------------- 普通模式逻辑 -----------------
    let sysPrompt = BASE_SYSTEM_INSTRUCTION;
    if (settings.useCustomPrompt && settings.customPromptText) {
      sysPrompt += `\n额外要求: ${settings.customPromptText}`;
    }
    sysPrompt += `\nback_translation 必须翻译回: ${getLangName(currentSource)}`;

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
      
      let aiMsg = { id: nowId(), sessionId: currentSessionId, role: 'ai', results: [], modelResults: [], from: 'ai', ts: Date.now() };

      if (dictHit) {
        aiMsg.results = normalizeTranslations(dictHit);
        aiMsg.from = 'dict';
      } else {
        const tasks = [];
        tasks.push(fetchAi(messages, settings.mainModelId, true).then(r => ({ ...r, isMain: true })).catch(e => ({ error: e.message, isMain: true })));
        if (settings.secondModelId && settings.secondModelId !== settings.mainModelId) {
           tasks.push(fetchAi(messages, settings.secondModelId, true).then(r => ({ ...r, isMain: false })).catch(e => ({ error: e.message, isMain: false })));
        }

        const responses = await Promise.all(tasks);
        
        const modelResults = responses.map(res => {
            if (res.error) return { modelName: 'Error', data: [{ style: '错误', translation: res.error, back_translation: '' }] };
            return { modelName: res.modelName, data: normalizeTranslations(res.content) };
        });

        aiMsg.modelResults = modelResults;
        aiMsg.results = modelResults[0].data;
      }

      setHistory(prev => [...prev, aiMsg]);
      // 不再持久化保存 aiMsg，保持“不保存历史对话”
      scrollToResult();
      
      // 自动播放第一个结果
      if (settings.autoPlayTTS && aiMsg.results && aiMsg.results.length > 0) {
        playTTS(aiMsg.results[0].translation, currentTarget, settings);
      }
      
      if (settings.enableFollowUp && text) {
          fetchSuggestions(text, currentSource, currentTarget);
      }

    } catch (e) {
      const errorMsg = { id: nowId(), sessionId: currentSessionId, role: 'error', text: e.message || '未知错误', ts: Date.now(), results: [] };
      setHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async (originalText, src, tgt) => {
    setIsSuggesting(true);
    try {
      const prompt = `原文(${getLangName(src)}): ${originalText}\n已翻译为: ${getLangName(tgt)}`;
      const { content } = await fetchAi([
        { role: 'system', content: REPLY_SYSTEM_INSTRUCTION },
        { role: 'user', content: prompt }
      ], settings.followUpModelId, true);
      const list = JSON.parse(content);
      if (Array.isArray(list)) setSuggestions(list);
    } catch (e) {
      console.log('Suggestion failed:', e);
    } finally {
      setIsSuggesting(false);
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

  // -----------------------------
  // Voice Recognition
  // -----------------------------

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

    // 播放提示音
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
    <div className="flex flex-col w-full h-[100dvh] bg-[#FFF0F5] relative text-gray-800">
      <GlobalStyles />
      {settings.chatBackgroundUrl && (
        <div className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: `url('${settings.chatBackgroundUrl}')`, opacity: 1 - settings.backgroundOverlay }} />
      )}

      {/* Header (移除了历史按钮) */}
      <div className="relative z-20 pt-safe-top bg-white/60 backdrop-blur-md shadow-sm border-b border-pink-100/50">
        <div className="flex items-center justify-between h-12 relative px-4">
          <div className="w-10"></div>
          
          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <i className="fas fa-link text-pink-500" />
            <span className="font-extrabold text-gray-800 text-lg tracking-tight">886.best</span>
          </div>

          <div className="flex items-center gap-3 w-10 justify-end">
            <button onClick={() => setShowSettings(true)} className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-200 transition-colors text-gray-600">
              <i className="fas fa-cog" />
            </button>
          </div>
        </div>
      </div>

      {/* 录音状态 */}
      <Transition show={isRecording} as={Fragment} enter="transition-opacity duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="fixed top-24 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="bg-pink-500/90 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-pulse pointer-events-auto backdrop-blur-sm">
            <i className="fas fa-microphone text-xl animate-bounce"/>
            <span className="font-bold">正在识别 ({getLangName(sourceLang)})...</span>
          </div>
        </div>
      </Transition>

      {/* 聊天区域 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-4 pt-4 pb-32 scroll-smooth">
        <div className="w-full max-w-[600px] mx-auto min-h-full flex flex-col justify-end">
           {history.length === 0 && !isLoading && (
             <div className="text-center text-gray-400 mb-20 opacity-60">
                <div className="text-4xl mb-2">👋</div>
                <div className="text-sm">自动识别语言 & 四重风格翻译</div>
             </div>
           )}

           {history.map((item, idx) => {
             if (item.role === 'user') {
               return (
                 <div key={item.id} className="flex justify-end mb-6 opacity-80 origin-right">
                   <div className="flex flex-col items-end max-w-[85%]">
                       {item.images && item.images.length > 0 && (
                           <div className="flex gap-1 mb-2 flex-wrap justify-end">
                               {item.images.map((img, i) => (
                                   <img key={i} src={img} className="w-24 h-24 object-cover rounded-lg border border-gray-200" alt="input" />
                               ))}
                           </div>
                       )}
                       {item.image && !item.images && <img src={item.image} className="w-32 h-auto rounded-lg mb-2 border border-gray-200" alt="input" />}
                       {item.text && <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-2xl rounded-tr-sm text-sm break-words shadow-inner">{item.text}</div>}
                   </div>
                 </div>
               );
             }
             if (item.role === 'error') {
               return <div key={item.id} className="bg-red-50 text-red-500 text-xs p-3 rounded-xl text-center mb-6">{item.text}</div>;
             }
             
             // 普通模式：卡片渲染
             return (
               <div key={item.id} className="mb-6 animate-in slide-in-from-bottom-4 duration-500">
                  <TranslationResultContainer item={item} targetLang={targetLang} onPlay={(text) => playTTS(text, targetLang, settings)} />
                  {item.modelResults && item.modelResults.length > 1 && (
                      <div className="text-center text-[9px] text-gray-300 mt-1">双模对比</div>
                  )}
                  {idx === history.length - 1 && (
                    isSuggesting ? (
                      <div className="h-8 flex items-center justify-center gap-1"><span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce"/><span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce delay-100"/><span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce delay-200"/></div>
                    ) : (
                      <ReplyChips suggestions={suggestions} onClick={(reply) => { setInputVal(reply); handleTranslate(reply); }} />
                    )
                  )}
               </div>
             );
           })}
           {isLoading && (
              <div className="flex justify-center mb-8">
                <div className="bg-white/90 px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3 text-pink-500 animate-pulse border border-pink-100">
                  <i className="fas fa-circle-notch fa-spin text-2xl" />
                  <span className="font-bold text-lg">深度思考中...</span>
                </div>
              </div>
           )}
        </div>
      </div>

      {/* 底部输入区 */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white via-white/95 to-white/0 pt-6 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-[600px] mx-auto px-4">
          
          <div className="flex items-center justify-center mb-2 px-1 relative">
            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full p-1 border border-white/50 shadow-sm mx-auto">
              <button onClick={() => setShowSrcPicker(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent hover:bg-white/50 rounded-full transition-all">
                <span className="text-lg">{getLangFlag(sourceLang)}</span>
                <span className="text-xs font-bold text-gray-700">{getLangName(sourceLang)}</span>
              </button>
              <button onClick={swapLangs} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-pink-500"><i className="fas fa-exchange-alt text-xs" /></button>
              <button onClick={() => setShowTgtPicker(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent hover:bg-white/50 rounded-full transition-all">
                <span className="text-lg">{getLangFlag(targetLang)}</span>
                <span className="text-xs font-bold text-gray-700">{getLangName(targetLang)}</span>
              </button>
            </div>
            <button 
               onClick={() => setShowModelSelector(true)}
               className={`absolute right-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${settings.secondModelId ? 'text-purple-500 bg-purple-50' : 'text-pink-400 hover:text-pink-600'}`}
            >
              <i className="fas fa-robot" />
              {settings.secondModelId && <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"/>}
            </button>
          </div>

          <div className={`relative flex items-end gap-2 bg-white border rounded-[28px] p-1.5 shadow-sm transition-all duration-200 ${isRecording ? 'border-pink-300 ring-2 ring-pink-100' : 'border-pink-100'}`}>
            <Menu as="div" className="relative">
                <Menu.Button className="w-10 h-11 flex items-center justify-center text-gray-400 hover:text-pink-500">
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
                    <Menu.Items className="absolute bottom-full left-0 mb-2 w-32 origin-bottom-left rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
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
                    <div className="flex gap-2 overflow-x-auto mb-1 ml-2 py-1 no-scrollbar">
                        {inputImages.map((img, idx) => (
                            <div key={idx} className="relative shrink-0">
                                <img src={img} alt="preview" className="h-12 w-12 object-cover rounded border border-gray-200" />
                                <button onClick={() => setInputImages(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-1 -right-1 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"><i className="fas fa-times"/></button>
                            </div>
                        ))}
                    </div>
                )}
                <textarea
                  className="w-full bg-transparent border-none outline-none resize-none px-2 py-2 max-h-32 text-[16px] leading-6 no-scrollbar placeholder-gray-400 text-gray-800"
                  placeholder={isRecording ? "" : "输入内容..."}
                  rows={1}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTranslate(); } }}
                />
            </div>
            
            <div className="w-11 h-11 flex items-center justify-center shrink-0 mb-0.5">
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
                   <i className="fas fa-microphone text-lg" />
                 </button>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pickers */}
      <Dialog open={showSrcPicker} onClose={() => setShowSrcPicker(false)} className="relative z-[10003]">
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl max-h-[70vh] overflow-y-auto slim-scrollbar">
            <div className="grid grid-cols-2 gap-2">{SUPPORTED_LANGUAGES.map(l => <button key={l.code} onClick={() => { setSourceLang(l.code); setShowSrcPicker(false); }} className={`p-3 rounded-xl border text-left ${sourceLang===l.code?'border-pink-500 bg-pink-50':'border-gray-100'}`}><span className="mr-2">{l.flag}</span>{l.name}</button>)}</div>
          </Dialog.Panel>
        </div>
      </Dialog>
      
      <Dialog open={showTgtPicker} onClose={() => setShowTgtPicker(false)} className="relative z-[10003]">
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl max-h-[70vh] overflow-y-auto slim-scrollbar">
            <div className="grid grid-cols-2 gap-2">{SUPPORTED_LANGUAGES.map(l => <button key={l.code} onClick={() => { setTargetLang(l.code); setShowTgtPicker(false); }} className={`p-3 rounded-xl border text-left ${targetLang===l.code?'border-pink-500 bg-pink-50':'border-gray-100'}`}><span className="mr-2">{l.flag}</span>{l.name}</button>)}</div>
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
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/30 backdrop-blur-sm" /></Transition.Child>
        <div className="fixed inset-0 overflow-hidden"><div className="absolute inset-0 overflow-hidden"><Transition.Child as={Fragment} enter="transform transition ease-in-out duration-300" enterFrom="translate-y-full" enterTo="translate-y-0" leave="transform transition ease-in-out duration-300" leaveFrom="translate-y-0" leaveTo="translate-y-full"><Dialog.Panel className="pointer-events-auto w-screen h-full"><AiChatContent onClose={onClose} /></Dialog.Panel></Transition.Child></div></div>
      </Dialog>
    </Transition>
  );
};

export default AIChatDrawer;
