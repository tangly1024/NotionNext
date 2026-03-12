import { Transition, Dialog, Menu } from '@headlessui/react';
import React, { useState, useEffect, useRef, Fragment, memo } from 'react';

import { loadCheatDict, matchCheatLoose } from '@/lib/cheatDict';
import {
  getApiConfig,
  PROVIDERS,
  DEFAULT_PROVIDER,
} from '@/data/ai-models';

// ----------------- 全局样式 -----------------
const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .slim-scrollbar::-webkit-scrollbar { width: 4px; }
    .slim-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .slim-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.12); border-radius: 4px; }
  `}</style>
);

// ----------------- Helpers -----------------
const safeLocalStorageGet = (key) => {
  try { return typeof window !== 'undefined' ? localStorage.getItem(key) : null; } 
  catch (e) { return null; }
};

const safeLocalStorageSet = (key, value) => {
  try { if (typeof window !== 'undefined') localStorage.setItem(key, value); } 
  catch (e) {}
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
    gain.gain.value = 0.08;
    osc.start();
    setTimeout(() => { osc.stop(); ctx.close(); }, 120);
  } catch (e) {}
};

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1280;
        let { width, height } = img;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
    };
  });
};

const detectScript = (text) => {
  if (!text || !text.trim()) return null;
  if (/[\u1000-\u109F\uAA60-\uAA7F]/.test(text)) return 'my-MM';
  if (/[\uAC00-\uD7AF]/.test(text)) return 'ko-KR';
  if (/[\u3040-\u30FF\u31F0-\u31FF]/.test(text)) return 'ja-JP';
  if (/[\u0E00-\u0E7F]/.test(text)) return 'th-TH';
  if (/[\u0400-\u04FF]/.test(text)) return 'ru-RU';
  if (/[ăâđêôơưáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i.test(text)) return 'vi-VN';
  if (/[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/.test(text)) return 'zh-CN';
  if (/[A-Za-z]/.test(text) && !/[^\x00-\x7F]/.test(text)) return 'en-US';
  return null;
};

// --- 模型成功记忆相关逻辑 ---
const getLastSuccessModelStorageKey = (provider) => `ai886_last_success_model_${provider}`;

const reorderModelsByLastSuccess = (provider, models) => {
  const saved = safeLocalStorageGet(getLastSuccessModelStorageKey(provider));
  if (!saved || !models.includes(saved)) return models;
  return [saved, ...models.filter((m) => m !== saved)];
};

const saveLastSuccessModel = (provider, model) => {
  safeLocalStorageSet(getLastSuccessModelStorageKey(provider), model);
};

const clearLastSuccessModel = (provider, model) => {
  const saved = safeLocalStorageGet(getLastSuccessModelStorageKey(provider));
  if (saved === model) {
    safeLocalStorageSet(getLastSuccessModelStorageKey(provider), '');
  }
};

// ----------------- Data -----------------
const SUPPORTED_LANGUAGES = [
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'my-MM', name: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'vi-VN', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th-TH', name: 'ไทย', flag: '🇹🇭' },
  { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
];

const getLangName = (code) => SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code;
const getLangFlag = (code) => SUPPORTED_LANGUAGES.find((l) => l.code === code)?.flag || '';

// 核心增强：防夹杂中文提示词
const buildSystemInstruction = (enableBackTranslation, tgtLangName) => {
  const baseRules = `You are a strict, highly accurate multilingual translation engine.

CRITICAL RULES:
1. Translate the user's input into ${tgtLangName}.
2. PURE OUTPUT: The 'translation' field MUST contain ONLY the final translated text in ${tgtLangName}. DO NOT append original texts, phonetic transcriptions, or explanations (e.g., if target is Burmese, output ONLY Burmese script, NO Chinese characters or brackets).
3. Do not rewrite or answer questions. Just translate.
4. Return ONLY valid JSON.`;

  if (!enableBackTranslation) {
    return `${baseRules}\n\nOutput schema:\n{"data":[{"translation":"..."}]}`;
  }

  return `${baseRules}
5. Provide a 'back_translation' by translating the result back to the ORIGINAL language to verify accuracy.

Output schema:
{"data":[{"translation":"...","back_translation":"..."}]}`;
};

const buildUserMsgContent = (cSrc, cTgt, text, hasImages) => {
  return [
    `Source: ${getLangName(cSrc)}`,
    `Target: ${getLangName(cTgt)}`,
    `Content to translate:`,
    text || '[Image]'
  ].join('\n');
};

const DEFAULT_SETTINGS = {
  apiKeys: {}, // { openai: 'sk-xxx', deepseek: 'sk-yyy' }
  provider: DEFAULT_PROVIDER,
  customBaseUrl: '',
  customModels: '',
  ttsSpeed: 1.0,
  autoPlayTTS: false,
  backgroundOverlay: 0.9,
  chatBackgroundUrl: '',
  filterThinking: true,
  enableBackTranslation: false,
  lastSourceLang: 'zh-CN',
  lastTargetLang: 'my-MM',
  voiceAutoSendDelay: 1800,
};

// ----------------- TTS -----------------
const ttsCache = new Map();
const AVAILABLE_VOICES = {
  'zh-CN': 'zh-CN-XiaoyouNeural',
  'en-US': 'en-US-JennyNeural',
  'my-MM': 'my-MM-NilarNeural',
  'ja-JP': 'ja-JP-NanamiNeural',
  'ko-KR': 'ko-KR-SunHiNeural',
  'th-TH': 'th-TH-PremwadeeNeural',
  'vi-VN': 'vi-VN-HoaiMyNeural',
  'ru-RU': 'ru-RU-SvetlanaNeural',
};

const playTTS = async (text, lang, settings) => {
  if (!text) return;
  const voice = AVAILABLE_VOICES[lang] || 'zh-CN-XiaoxiaoMultilingualNeural';
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
      const objectUrl = URL.createObjectURL(blob);
      audio = new Audio(objectUrl);
      audio.dataset.objectUrl = objectUrl;

      if (ttsCache.size > 50) {
        const firstKey = ttsCache.keys().next().value;
        const firstAudio = ttsCache.get(firstKey);
        if (firstAudio?.dataset?.objectUrl) URL.revokeObjectURL(firstAudio.dataset.objectUrl);
        ttsCache.delete(firstKey);
      }
      ttsCache.set(key, audio);
    }
    audio.currentTime = 0;
    audio.playbackRate = speed;
    await audio.play();
  } catch (e) { console.error('TTS Error:', e); }
};

// ----------------- JSON 规范化 -----------------
const normalizeTranslations = (raw, enableBackTranslation = false) => {
  try {
    let parsed = raw;
    if (typeof raw === 'string') {
      let cleanRaw = raw.trim();
      try { parsed = JSON.parse(cleanRaw); } catch {
        const start = cleanRaw.indexOf('{');
        const end = cleanRaw.lastIndexOf('}');
        if (start >= 0 && end > start) {
          cleanRaw = cleanRaw.substring(start, end + 1);
          parsed = JSON.parse(cleanRaw);
        } else throw new Error('Invalid JSON');
      }
    }
    const data = Array.isArray(parsed?.data) ? parsed.data : [];
    const valid = data
      .filter((item) => item && typeof item.translation === 'string')
      .map((item) => ({
        translation: String(item.translation || '').trim(),
        back_translation: enableBackTranslation ? String(item.back_translation || '').trim() : '',
      }))
      .filter((item) => item.translation);

    return valid.length ? valid.slice(0, 4) : [{ translation: '无有效译文', back_translation: '' }];
  } catch (e) {
    return [{ translation: '解析数据失败', back_translation: '' }];
  }
};

// ----------------- UI 子组件 -----------------
const TranslationCard = memo(({ data, onPlay }) => {
  const [copied, setCopied] = useState(false);
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(data.translation);
      if (navigator.vibrate) navigator.vibrate(50);
      setCopied(true); setTimeout(() => setCopied(false), 800);
    } catch {}
  };

  return (
    <div onClick={handleClick} className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group mb-3 text-center">
      {copied && <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-10"><span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">已复制</span></div>}
      <div className="text-[18px] leading-relaxed font-medium text-gray-800 break-words whitespace-pre-wrap">{data.translation}</div>
      {!!data.back_translation && <div className="mt-2.5 text-[13px] text-gray-400 break-words leading-snug whitespace-pre-wrap">{data.back_translation}</div>}
      <button onClick={(e) => { e.stopPropagation(); onPlay(); }} className="absolute bottom-2 right-2 p-2 text-gray-300 hover:text-pink-500 opacity-50"><i className="fas fa-volume-up" /></button>
    </div>
  );
});

const SettingsModal = ({ settings, onSave, onClose }) => {
  const [data, setData] = useState(settings);
  const fileInputRef = useRef(null);
  const providerList = Object.values(PROVIDERS);

  const handleBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await compressImage(file);
      setData({ ...data, chatBackgroundUrl: base64 });
    }
  };

  const handleKeyChange = (val) => {
    setData(prev => ({
      ...prev,
      apiKeys: { ...prev.apiKeys, [prev.provider]: val }
    }));
  };

  const clearCurrentKey = () => {
    const newKeys = { ...data.apiKeys };
    delete newKeys[data.provider];
    setData({ ...data, apiKeys: newKeys });
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-[10002]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div><div className="font-bold text-gray-800 text-lg">系统设置</div><div className="text-xs text-gray-400">စနစ် ဆက်တင်</div></div>
            <button onClick={onClose} className="w-8 h-8 bg-gray-200 rounded-full text-gray-500"><i className="fas fa-times" /></button>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto slim-scrollbar">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                 <i className={`fas ${(PROVIDERS[data.provider]||{}).icon || 'fa-server'} text-pink-500`}/>
                 供应商 / ပံ့ပိုးသူ
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                value={data.provider}
                onChange={(e) => setData({ ...data, provider: e.target.value })}
              >
                {providerList.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">通行密钥 / API သော့</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-10 text-sm focus:outline-none focus:border-pink-500"
                  placeholder="请输入当前供应商密钥..."
                  value={data.apiKeys?.[data.provider] || ''}
                  onChange={(e) => handleKeyChange(e.target.value)}
                />
                {data.apiKeys?.[data.provider] && (
                  <button onClick={clearCurrentKey} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors">
                    <i className="fas fa-times-circle text-lg" />
                  </button>
                )}
              </div>
            </div>

            {data.provider === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">自定义接口 / စိတ်ကြိုက် API လိပ်စာ</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" placeholder="https://your-api.com/v1" value={data.customBaseUrl || ''} onChange={(e) => setData({ ...data, customBaseUrl: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">自定义模型 / စိတ်ကြိုက် မော်ဒယ်</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" placeholder="gpt-4o-mini,deepseek-chat" value={data.customModels || ''} onChange={(e) => setData({ ...data, customModels: e.target.value })} />
                </div>
              </>
            )}

            <hr className="border-gray-100" />

            <div className="flex items-center justify-between">
              <div><div className="text-sm font-bold text-gray-700">开启回译</div><div className="text-xs text-gray-400 mt-1">မူရင်းဘာသာသို့ ပြန်ဆို</div></div>
              <input type="checkbox" checked={data.enableBackTranslation} onChange={(e) => setData({ ...data, enableBackTranslation: e.target.checked })} className="w-5 h-5 accent-pink-500" />
            </div>

            <div className="flex items-center justify-between">
              <div><div className="text-sm font-bold text-gray-700">自动朗读</div><div className="text-xs text-gray-400 mt-1">အလိုအလျောက် အသံဖတ်</div></div>
              <input type="checkbox" checked={data.autoPlayTTS} onChange={(e) => setData({ ...data, autoPlayTTS: e.target.checked })} className="w-5 h-5 accent-pink-500" />
            </div>

            <div>
              <div className="text-sm font-bold text-gray-700 mb-2 flex justify-between"><span>语音静默自动发送</span><span className="text-pink-500">{(data.voiceAutoSendDelay / 1000).toFixed(1)}s</span></div>
              <input type="range" min="1200" max="3000" step="100" value={data.voiceAutoSendDelay} onChange={(e) => setData({ ...data, voiceAutoSendDelay: parseInt(e.target.value, 10) })} className="w-full accent-pink-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>

            <hr className="border-gray-100" />

            <div>
              <div className="text-sm font-bold text-gray-700 mb-3">聊天背景图 / နောက်ခံပုံ</div>
              <div className="flex items-center gap-3">
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-xs font-bold hover:bg-pink-100 transition-colors">更换背景</button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleBgUpload} />
                {data.chatBackgroundUrl && <button onClick={() => setData({ ...data, chatBackgroundUrl: '' })} className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">清除</button>}
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-gray-100">
            <button onClick={() => { onSave(data); onClose(); }} className="w-full py-3 rounded-xl bg-pink-500 text-sm font-bold text-white shadow-lg shadow-pink-200 active:scale-95 transition-transform">保存并关闭</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

// ----------------- 主内容 -----------------
const AiChatContent = ({ onClose }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [sourceLang, setSourceLang] = useState('zh-CN');
  const [targetLang, setTargetLang] = useState('my-MM');
  const [inputVal, setInputVal] = useState('');
  const [inputImages, setInputImages] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [showSrcPicker, setShowSrcPicker] = useState(false);
  const [showTgtPicker, setShowTgtPicker] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const currentRequestIdRef = useRef(null);
  
  const finalTextRef = useRef('');
  const autoSendTimerRef = useRef(null);

  useEffect(() => {
    const s = safeLocalStorageGet('ai886_settings');
    if (s) {
      try {
        const parsed = JSON.parse(s);
        // 数据迁移：兼容老版本的 apiKey 结构
        if (parsed.apiKey && typeof parsed.apiKeys !== 'object') {
           parsed.apiKeys = { [parsed.provider || DEFAULT_PROVIDER]: parsed.apiKey };
           delete parsed.apiKey;
        }
        const merged = { ...DEFAULT_SETTINGS, ...parsed };
        if (!merged.apiKeys) merged.apiKeys = {};
        setSettings(merged);
        if (merged.lastSourceLang) setSourceLang(merged.lastSourceLang);
        if (merged.lastTargetLang) setTargetLang(merged.lastTargetLang);
      } catch {}
    }
  }, []);

  useEffect(() => {
    safeLocalStorageSet('ai886_settings', JSON.stringify({
      ...settings, lastSourceLang: sourceLang, lastTargetLang: targetLang,
    }));
  }, [settings, sourceLang, targetLang]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
    };
  }, []);

  const scrollToResult = () => {
    if (!scrollRef.current) return;
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
  };

  const fetchAi = async ({ messages, signal }) => {
    const config = getApiConfig({
      apiKeys: settings.apiKeys,
      provider: settings.provider,
      customBaseUrl: settings.customBaseUrl,
      customModels: settings.customModels,
    });

    if (!config?.baseUrl || !Array.isArray(config.models) || !config.models.length) {
      throw new Error('未配置可用 API 节点，请检查设置');
    }

    const endpoint = config.baseUrl.endsWith('/chat/completions')
      ? config.baseUrl
      : `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;

    const orderedModels = reorderModelsByLastSuccess(config.provider, config.models);
    let lastErrorMsg = '';

    for (let i = 0; i < orderedModels.length; i++) {
      const currentModel = orderedModels[i];
      try {
        const body = {
          model: currentModel,
          messages,
          temperature: 0.0, // 强制为0，提升翻译严谨性
          response_format: { type: 'json_object' }
        };

        const headers = { 'Content-Type': 'application/json' };
        if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;

        const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body), signal });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('text/html')) throw new Error(`接口地址错误(HTML拦截)，请检查: ${config.baseUrl}`);

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `状态码: ${res.status}`);
        }

        const data = await res.json();
        let content = data?.choices?.[0]?.message?.content || '';

        if (settings.filterThinking) content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        saveLastSuccessModel(config.provider, currentModel);

        // 核心改动：不再暴露底层模型名，只暴露高级节点名称
        return { content, providerMeta: { name: config.name, icon: config.icon } };
        
      } catch (error) {
        lastErrorMsg = error.message;
        clearLastSuccessModel(config.provider, currentModel);
        if (error.name === 'AbortError') throw error;
      }
    }
    throw new Error(`所有节点尝试失败。最后错误：${lastErrorMsg}`);
  };

  const handleTranslate = async (textOverride = null) => {
    if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
    if (isRecording && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
    }

    let text = (textOverride !== null ? textOverride : inputVal).trim();
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
    setHistory(prev => [...prev, { id: nowId(), role: 'user', text, images: inputImages, ts: Date.now() }]);
    setInputVal(''); finalTextRef.current = ''; setInputImages([]); scrollToResult();

    const sysPrompt = buildSystemInstruction(settings.enableBackTranslation, getLangName(cTgt));
    const userMsgContent = buildUserMsgContent(cSrc, cTgt, text, inputImages.length > 0);

    let finalUserMessage = inputImages.length > 0
      ? { role: 'user', content: [{ type: "text", text: userMsgContent }, ...inputImages.map(img => ({ type: "image_url", image_url: { url: img } }))] }
      : { role: 'user', content: userMsgContent };

    const messages = [{ role: 'system', content: sysPrompt }, finalUserMessage];

    try {
      let dictHit = null;
      let aiMsg = { id: nowId(), role: 'ai', results: [], providerMeta: null, ts: Date.now(), tgtLang: cTgt };

      if (inputImages.length === 0 && text) {
        try {
          const dict = await loadCheatDict(cSrc);
          if (dict) dictHit = await matchCheatLoose(dict, text, cTgt);
        } catch (e) { console.warn("本地字典降级"); }
      }

      if (dictHit && dictHit.length > 0 && dictHit[0].translation !== '（字典数据为空）') {
        aiMsg.results = normalizeTranslations(dictHit, settings.enableBackTranslation);
        aiMsg.providerMeta = { name: '★ 内部优选词库', icon: 'fa-book' };
      } else {
        const res = await fetchAi({ messages, signal });
        aiMsg.results = normalizeTranslations(res.content, settings.enableBackTranslation);
        aiMsg.providerMeta = res.providerMeta;
      }

      if (currentRequestIdRef.current === requestId) {
        setHistory(prev => [...prev, aiMsg]);
        scrollToResult();
        if (settings.autoPlayTTS && aiMsg.results?.[0]) playTTS(aiMsg.results[0].translation, cTgt, settings);
      }
    } catch (e) {
      if (e.name !== 'AbortError' && currentRequestIdRef.current === requestId) {
        setHistory(prev => [...prev, { id: nowId(), role: 'error', text: e.message || '翻译失败', ts: Date.now() }]);
      }
    } finally {
      if (currentRequestIdRef.current === requestId) setIsLoading(false);
    }
  };

  const startRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('当前浏览器不支持语音输入，请使用输入框或拍照功能。'); return; }
    if (isRecording) {
      recognitionRef.current?.stop();
      if (finalTextRef.current.trim() || inputVal.trim()) handleTranslate(finalTextRef.current || inputVal);
      return;
    }
    playBeep();
    const rec = new SR();
    rec.lang = sourceLang; rec.interimResults = true; rec.continuous = true;
    recognitionRef.current = rec; setInputVal(''); finalTextRef.current = ''; setIsRecording(true);

    rec.onresult = (e) => {
      let currentTranscript = '';
      for (let i = 0; i < e.results.length; ++i) currentTranscript += e.results[i][0].transcript;
      setInputVal(currentTranscript); finalTextRef.current = currentTranscript;
      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = setTimeout(() => {
        if (finalTextRef.current.trim()) { rec.stop(); handleTranslate(finalTextRef.current); }
      }, settings.voiceAutoSendDelay);
    };

    rec.onend = () => {
      setIsRecording(false);
      if (autoSendTimerRef.current) {
          clearTimeout(autoSendTimerRef.current);
          if (finalTextRef.current.trim()) handleTranslate(finalTextRef.current);
      }
    };
    rec.onerror = () => setIsRecording(false);
    rec.start();
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    try {
      const compressed = await Promise.all(files.map(f => compressImage(f)));
      setInputImages(p => [...p, ...compressed]);
    } catch (err) {}
    e.target.value = '';
  };

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-gray-50 relative text-gray-800">
      <GlobalStyles />
      {settings.chatBackgroundUrl && (
        <div className="absolute inset-0 bg-cover bg-center z-0 pointer-events-none transition-opacity" style={{ backgroundImage: `url('${settings.chatBackgroundUrl}')`, opacity: 1 - settings.backgroundOverlay }} />
      )}

      {/* Header */}
      <div className="relative z-20 pt-[env(safe-area-inset-top)] bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="w-10"></div>
          <div className="font-extrabold text-gray-800 text-lg tracking-tight flex items-center gap-2"><i className="fas fa-language text-pink-500"/>886.best AI</div>
          <button onClick={() => setShowSettings(true)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100/80 hover:bg-gray-200 text-gray-600 transition-colors"><i className="fas fa-cog" /></button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-4 pt-4 pb-[180px] scroll-smooth">
        <div className="w-full max-w-[600px] mx-auto min-h-full flex flex-col justify-end">
           {history.length === 0 && !isLoading && (
             <div className="text-center text-gray-400 mb-20 opacity-80 mt-20">
                <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner border border-pink-100">🌍</div>
                <div className="font-bold text-gray-600">专业翻译引擎已就绪</div>
                <div className="text-xs mt-2">支持 文本 / 拍照 / 连续语音输入</div>
             </div>
           )}

           {history.map((item) => (
             <div key={item.id} className={`mb-6 ${item.role === 'user' ? 'flex justify-end origin-bottom-right' : 'origin-bottom-left'} animate-in fade-in duration-300`}>
               {item.role === 'user' ? (
                 <div className="flex flex-col items-end max-w-[85%]">
                     {item.images?.length > 0 && <div className="flex gap-2 mb-2 flex-wrap justify-end">{item.images.map((img, i) => <img key={i} src={img} className="w-24 h-24 object-cover rounded-xl border-2 border-white shadow-sm" alt="img" />)}</div>}
                     {item.text && <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm text-[15px] break-words shadow-md font-medium leading-relaxed">{item.text}</div>}
                 </div>
               ) : item.role === 'error' ? (
                 <div className="bg-red-50 text-red-500 text-sm p-4 rounded-2xl text-center mb-2 font-bold shadow-sm border border-red-100"><i className="fas fa-exclamation-circle mr-2"/>{item.text}</div>
               ) : (
                 <div className="w-full">
                    {/* 只显示供应商名称和图标，隐藏复杂模型名 */}
                    {item.providerMeta && (
                        <div className="text-[10px] text-gray-400 mb-2 ml-2 font-bold flex items-center gap-1.5">
                            <i className={`fas ${item.providerMeta.icon} text-pink-400`}/>{item.providerMeta.name}
                        </div>
                    )}
                    {item.results.map((res, i) => <TranslationCard key={i} data={res} onPlay={() => playTTS(res.translation, item.tgtLang, settings)} />)}
                 </div>
               )}
             </div>
           ))}
           {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="bg-white/90 px-5 py-3 rounded-2xl shadow-sm flex items-center gap-3 text-pink-500 border border-pink-100 font-bold text-sm">
                  <i className="fas fa-circle-notch fa-spin text-lg" /><span>引擎解码中...</span>
                </div>
              </div>
           )}
        </div>
      </div>

      {/* Input Box Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white via-white/95 to-transparent pt-12 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-[600px] mx-auto px-4">
          
          {/* 快捷提供商切换条 */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 px-1 items-center">
            <span className="text-[10px] text-gray-400 font-bold shrink-0 mr-1"><i className="fas fa-server mr-1"/>节点:</span>
            {Object.values(PROVIDERS).map(p => (
              <button
                key={p.id}
                onClick={() => setSettings({...settings, provider: p.id})}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 flex items-center gap-1.5 transition-all ${settings.provider === p.id ? 'bg-pink-100 text-pink-600 shadow-sm border border-pink-200' : 'bg-white/80 text-gray-500 border border-gray-100 shadow-sm'}`}
              >
                <i className={`fas ${p.icon}`} /> {p.name}
              </button>
            ))}
          </div>

          <div className="flex justify-center mb-3">
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xl rounded-full p-1 border border-gray-100 shadow-sm">
              <button onClick={() => setShowSrcPicker(true)} className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-50 rounded-full transition-all">
                <span className="text-lg">{getLangFlag(sourceLang)}</span><span className="text-xs font-bold text-gray-700">{getLangName(sourceLang)}</span>
              </button>
              <button onClick={() => { setSourceLang(targetLang); setTargetLang(sourceLang); }} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors"><i className="fas fa-exchange-alt text-xs" /></button>
              <button onClick={() => setShowTgtPicker(true)} className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-50 rounded-full transition-all">
                <span className="text-lg">{getLangFlag(targetLang)}</span><span className="text-xs font-bold text-gray-700">{getLangName(targetLang)}</span>
              </button>
            </div>
          </div>

          <div className={`relative flex items-end gap-2 bg-white border ${isRecording ? 'border-pink-400 ring-2 ring-pink-100' : 'border-gray-200 shadow-md'} rounded-[32px] p-2 transition-all duration-300`}>
            <Menu as="div" className="relative">
                <Menu.Button className="w-11 h-11 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-full transition-colors"><i className="fas fa-plus text-lg" /></Menu.Button>
                <Transition as={Fragment} enter="duration-150 ease-out" enterFrom="opacity-0 scale-95 translate-y-2" enterTo="opacity-100 scale-100 translate-y-0" leave="duration-100 ease-in" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-2">
                    <Menu.Items className="absolute bottom-full left-0 mb-3 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-1.5 focus:outline-none">
                        <Menu.Item>{({ active }) => <button onClick={() => cameraInputRef.current?.click()} className={`flex w-full items-center px-4 py-3 text-sm font-bold rounded-xl transition-colors ${active?'bg-pink-50 text-pink-600':'text-gray-700'}`}><i className="fas fa-camera w-6"/> 拍照</button>}</Menu.Item>
                        <Menu.Item>{({ active }) => <button onClick={() => fileInputRef.current?.click()} className={`flex w-full items-center px-4 py-3 text-sm font-bold rounded-xl transition-colors ${active?'bg-pink-50 text-pink-600':'text-gray-700'}`}><i className="fas fa-image w-6"/> 相册</button>}</Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
            
            <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
            <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" className="hidden" onChange={handleImageSelect} />

            <div className="flex-1 flex flex-col justify-center min-h-[44px] py-1">
                {inputImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto mb-2 no-scrollbar pl-1">
                        {inputImages.map((img, idx) => (
                            <div key={idx} className="relative shrink-0 group">
                                <img src={img} className="h-12 w-12 object-cover rounded-xl border border-gray-200 shadow-sm" alt="preview" />
                                <button onClick={() => setInputImages(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-1.5 -right-1.5 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-sm"><i className="fas fa-times"/></button>
                            </div>
                        ))}
                    </div>
                )}
                <textarea
                  className="w-full bg-transparent border-none outline-none resize-none px-2 py-1.5 max-h-[120px] text-[16px] leading-relaxed no-scrollbar placeholder-gray-400 text-gray-800"
                  placeholder={isRecording ? "正在听你说，随时可点击停止..." : "输入翻译内容..."}
                  rows={1} value={inputVal} onChange={e => {
                    setInputVal(e.target.value);
                    finalTextRef.current = e.target.value;
                  }}
                  onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTranslate(); } }}
                />
            </div>
            
            <button onClick={() => isRecording ? startRecording() : (inputVal.trim() || inputImages.length ? handleTranslate() : startRecording())} 
                    className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-all duration-200 ${isRecording ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse' : (inputVal.trim() || inputImages.length ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 active:scale-95' : 'bg-pink-50 text-pink-500 hover:bg-pink-100')}`}>
               <i className={`fas text-lg ${isRecording ? 'fa-stop' : (inputVal.trim() || inputImages.length ? 'fa-arrow-up' : 'fa-microphone')}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Pickers */}
      <Dialog open={showSrcPicker} onClose={() => setShowSrcPicker(false)} className="relative z-[10003]"><div className="fixed inset-0 bg-black/30 backdrop-blur-sm" /><div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4 pb-0"><Dialog.Panel className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[70vh] flex flex-col"><div className="font-bold text-center mb-4 text-gray-800">源语言</div><div className="grid grid-cols-2 gap-3 overflow-y-auto slim-scrollbar pb-safe-bottom">{SUPPORTED_LANGUAGES.map(l => <button key={l.code} onClick={() => { setSourceLang(l.code); setShowSrcPicker(false); }} className={`p-4 rounded-2xl font-medium text-sm flex items-center ${sourceLang===l.code?'bg-pink-50 text-pink-600 border border-pink-200':'bg-gray-50 text-gray-700 border border-transparent hover:bg-gray-100'}`}><span className="text-xl mr-3">{l.flag}</span>{l.name}</button>)}</div></Dialog.Panel></div></Dialog>
      <Dialog open={showTgtPicker} onClose={() => setShowTgtPicker(false)} className="relative z-[10003]"><div className="fixed inset-0 bg-black/30 backdrop-blur-sm" /><div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4 pb-0"><Dialog.Panel className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[70vh] flex flex-col"><div className="font-bold text-center mb-4 text-gray-800">目标语言</div><div className="grid grid-cols-2 gap-3 overflow-y-auto slim-scrollbar pb-safe-bottom">{SUPPORTED_LANGUAGES.map(l => <button key={l.code} onClick={() => { setTargetLang(l.code); setShowTgtPicker(false); }} className={`p-4 rounded-2xl font-medium text-sm flex items-center ${targetLang===l.code?'bg-pink-50 text-pink-600 border border-pink-200':'bg-gray-50 text-gray-700 border border-transparent hover:bg-gray-100'}`}><span className="text-xl mr-3">{l.flag}</span>{l.name}</button>)}</div></Dialog.Panel></div></Dialog>

      {showSettings && <SettingsModal settings={settings} onSave={setSettings} onClose={() => setShowSettings(false)} />}
    </div>
  );
};

const AIChatDrawer = ({ isOpen, onClose }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/40 backdrop-blur-sm" /></Transition.Child>
        <div className="fixed inset-0 overflow-hidden"><div className="absolute inset-0 overflow-hidden"><Transition.Child as={Fragment} enter="transform transition ease-in-out duration-300" enterFrom="translate-y-full" enterTo="translate-y-0" leave="transform transition ease-in-out duration-300" leaveFrom="translate-y-0" leaveTo="translate-y-full"><Dialog.Panel className="pointer-events-auto w-screen h-full"><AiChatContent onClose={onClose} /></Dialog.Panel></Transition.Child></div></div>
      </Dialog>
    </Transition>
  );
};

export default AIChatDrawer;
