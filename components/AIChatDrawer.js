import { Transition, Dialog, Menu } from '@headlessui/react';
import React, { useState, useEffect, useRef, Fragment, memo } from 'react';

import { loadCheatDict, matchCheatExact } from '@/lib/cheatDict'; // 注意这里改用 Exact
import { getApiConfig, PROVIDERS, DEFAULT_PROVIDER } from '@/data/ai-models';
import {
  saveToUserDict,
  matchFromUserDict,
  getAllUserDict,
  deleteUserDictEntry,
  clearUserDict
} from '@/lib/userDict';

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
const safeLocalStorageRemove = (key) => {
  try { if (typeof window !== 'undefined') localStorage.removeItem(key); } 
  catch (e) {}
};

const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const playBeep = () => {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
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
        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('canvas context unavailable'));
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

// ----------------- AI 模型轮询记忆 -----------------
const getLastSuccessModelKey = (provider) => `ai886_last_model_${provider}`;
const reorderModelsByLastSuccess = (provider, models) => {
  const saved = safeLocalStorageGet(getLastSuccessModelKey(provider));
  return saved && models.includes(saved) ? [saved, ...models.filter((m) => m !== saved)] : models;
};
const saveLastSuccessModel = (provider, model) => safeLocalStorageSet(getLastSuccessModelKey(provider), model);
const clearLastSuccessModel = (provider, model) => {
  const saved = safeLocalStorageGet(getLastSuccessModelKey(provider));
  if (saved === model) safeLocalStorageSet(getLastSuccessModelKey(provider), '');
};

// ----------------- 24小时 AI 缓存 (核心节约成本逻辑) -----------------
const AI_CACHE_PREFIX = 'ai886_translate_cache_v1:';
const AI_CACHE_TTL = 24 * 60 * 60 * 1000;

const getAiCacheKey = ({ srcLang, tgtLang, text, provider, enableBackTranslation, customPrompt }) => {
  return `${AI_CACHE_PREFIX}${[srcLang||'', tgtLang||'', provider||'', enableBackTranslation?'1':'0', (customPrompt||'').trim(), (text||'').trim()].join('|')}`;
};

const getCachedAiResult = (params) => {
  const key = getAiCacheKey(params);
  const raw = safeLocalStorageGet(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.ts || !Array.isArray(parsed.results) || Date.now() - parsed.ts > AI_CACHE_TTL) {
      safeLocalStorageRemove(key);
      return null;
    }
    return parsed;
  } catch (e) {
    safeLocalStorageRemove(key);
    return null;
  }
};

const setCachedAiResult = (params, payload) => {
  const key = getAiCacheKey(params);
  safeLocalStorageSet(key, JSON.stringify({ ts: Date.now(), results: payload.results || [], providerMeta: payload.providerMeta || null }));
};

// ----------------- 语言配置 & Prompt -----------------
const SUPPORTED_LANGUAGES = [
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' }, { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'my-MM', name: 'မြန်မာ', flag: '🇲🇲' }, { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' }, { code: 'vi-VN', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th-TH', name: 'ไทย', flag: '🇹🇭' }, { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' }
];

const getLangName = (code) => SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code;
const getLangFlag = (code) => SUPPORTED_LANGUAGES.find((l) => l.code === code)?.flag || '';

// 纯净直译要求 Prompt
const buildSystemInstruction = (enableBackTranslation, srcLangName, tgtLangName, customPrompt) => {
  let baseRules = `You are a professional multilingual translation engine.

CRITICAL RULES:
1. Translate the user's input from ${srcLangName} into ${tgtLangName}.
2. Be faithful to the source text. Prefer direct and literal translation when possible.
3. Preserve the original meaning, tone, style, and important details. Do not add, omit, summarize, explain, answer, or rewrite.
4. Keep names, brands, product names, model numbers, codes, URLs, numbers, and special formatting unchanged when appropriate.
5. If a literal translation would be unnatural or incorrect in ${tgtLangName}, make only the smallest necessary adjustment to keep the meaning accurate.
6. Output exactly one final translation.
7. The "translation" field must contain only the final translated text in ${tgtLangName}.
8. Return only valid JSON. Do not use markdown fences or any extra text.`;

  if (customPrompt && customPrompt.trim()) {
    baseRules += `\n\nUSER CUSTOM RULES:\n${customPrompt.trim()}`;
  }

  if (!enableBackTranslation) {
    return `${baseRules}\n\nOutput schema:\n{"data":[{"translation":"..."}]}`;
  }

  return `${baseRules}
9. Also provide "back_translation" by translating the final result back into ${srcLangName} for verification only.

Output schema:
{"data":[{"translation":"...","back_translation":"..."}]}`;
};

const buildUserMsgContent = (srcLang, tgtLang, text, hasImage) => {
  const parts = [
    `Source language: ${srcLang}`,
    `Target language: ${tgtLang}`,
    `Task: Translate faithfully and directly without extra words.`,
    text ? `Text:\n${text}` : ''
  ];
  if (hasImage) parts.push('If the image contains text, translate the visible text faithfully into the target language.');
  return parts.filter(Boolean).join('\n\n');
};

const DEFAULT_SETTINGS = {
  apiKeys: {}, provider: DEFAULT_PROVIDER, customBaseUrl: '', customModels: '', customPrompt: '',
  ttsSpeed: 1.0, autoPlayTTS: false, backgroundOverlay: 0.9, chatBackgroundUrl: '', filterThinking: true,
  enableBackTranslation: false, lastSourceLang: 'zh-CN', lastTargetLang: 'my-MM', voiceAutoSendDelay: 1800
};

// ----------------- TTS 控制 -----------------
const ttsCache = new Map();
const trimTtsCache = () => {
  if (ttsCache.size <= 50) return;
  const firstKey = ttsCache.keys().next();
  if (!firstKey.done) ttsCache.delete(firstKey.value);
};

const playTTS = async (text, lang, settings) => {
  if (!text) return;
  const voiceMap = { 'zh-CN': 'zh-CN-XiaoyouNeural', 'en-US': 'en-US-JennyNeural', 'my-MM': 'my-MM-NilarNeural' };
  const voice = voiceMap[lang] || 'zh-CN-XiaoxiaoMultilingualNeural';
  const speed = settings.ttsSpeed || 1.0;
  const key = `${voice}_${speed}_${text}`;

  try {
    let audio = ttsCache.get(key);
    if (!audio) {
      const res = await fetch(`https://t.leftsite.cn/tts?t=${encodeURIComponent(text)}&v=${encodeURIComponent(voice)}&r=${Math.floor((speed - 1) * 50)}`);
      if (!res.ok) return;
      const blob = await res.blob();
      audio = new Audio(URL.createObjectURL(blob));
      ttsCache.set(key, audio);
      trimTtsCache();
    }
    audio.currentTime = 0; audio.playbackRate = speed; await audio.play();
  } catch (e) {}
};

// ----------------- JSON Normalization -----------------
const normalizeTranslations = (raw, enableBackTranslation = false) => {
  try {
    let data = [];
    if (Array.isArray(raw)) {
      data = raw;
    } else if (typeof raw === 'string') {
      let cleanRaw = raw.trim();
      const start = cleanRaw.indexOf('{');
      const end = cleanRaw.lastIndexOf('}');
      if (start >= 0 && end > start) cleanRaw = cleanRaw.substring(start, end + 1);
      const parsed = JSON.parse(cleanRaw);
      data = Array.isArray(parsed?.data) ? parsed.data : [];
    } else {
      data = Array.isArray(raw?.data) ? raw.data : [];
    }
    const valid = data.filter((i) => i && i.translation).map((i) => ({
      translation: String(i.translation).trim(),
      back_translation: enableBackTranslation ? String(i.back_translation || '').trim() : ''
    }));
    return valid.length ? valid.slice(0, 4) : [{ translation: '无有效译文', back_translation: '' }];
  } catch (e) {
    return [{ translation: '解析数据失败', back_translation: '' }];
  }
};

// ----------------- UI 颗粒组件 -----------------
const TranslationCard = memo(({ data, onPlay, originalText, srcLang, tgtLang }) => {
  const [copied, setCopied] = useState(false);
  const handleEdit = async (e) => {
    e.stopPropagation();
    const newTrans = prompt('修改并保存到用户词典 (之后将优先应用该翻译):', data.translation);
    if (newTrans && newTrans.trim() !== data.translation) {
      await saveToUserDict(srcLang, tgtLang, originalText, newTrans.trim());
      alert('已保存至用户词典，下次将直接应用！');
    }
  };

  return (
    <div onClick={async () => { await navigator.clipboard.writeText(data.translation); setCopied(true); setTimeout(() => setCopied(false), 800); }}
         className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer relative group mb-3">
      {copied && <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-10"><span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">已复制</span></div>}
      <div className="text-[18px] leading-relaxed font-medium text-gray-800 break-words whitespace-pre-wrap">{data.translation}</div>
      {data.back_translation && <div className="mt-2 text-[13px] text-gray-400 break-words">{data.back_translation}</div>}
      <div className="absolute bottom-2 right-2 flex gap-2">
        <button onClick={handleEdit} className="p-2 text-gray-300 hover:text-blue-500 opacity-50 hover:opacity-100"><i className="fas fa-edit" /></button>
        <button onClick={(e) => { e.stopPropagation(); onPlay(); }} className="p-2 text-gray-300 hover:text-pink-500 opacity-50 hover:opacity-100"><i className="fas fa-volume-up" /></button>
      </div>
    </div>
  );
});

// 设置面板
const SettingsModal = ({ settings, onSave, onClose }) => {
  const [data, setData] = useState(settings);
  const [tab, setTab] = useState('api');
  const [dictList, setDictList] = useState([]);

  const loadDict = async () => setDictList(await getAllUserDict());
  useEffect(() => { if (tab === 'dict') loadDict(); }, [tab]);

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arr = JSON.parse(event.target.result);
        for (let item of arr) await saveToUserDict(item.srcLang, item.tgtLang, item.source, item.translation);
        loadDict(); alert('导入成功');
      } catch (err) { alert('JSON格式错误'); }
    };
    reader.readAsText(file);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(dictList, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'user_dict.json'; a.click();
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-[10002]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
          <div className="flex bg-gray-50/50 rounded-t-3xl border-b">
            {['api', 'dict', 'common'].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-4 text-sm font-bold ${tab === t ? 'text-pink-600 bg-white shadow-sm' : 'text-gray-500'}`}>
                {t === 'api' ? '接口配置' : t === 'dict' ? '用户词典' : '通用设置'}
              </button>
            ))}
          </div>

          <div className="p-6 overflow-y-auto slim-scrollbar flex-1">
            {tab === 'api' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">默认供应商</label>
                  <select className="w-full bg-gray-50 border rounded-xl p-3 text-sm" value={data.provider} onChange={(e) => setData({ ...data, provider: e.target.value })}>
                    {Object.values(PROVIDERS).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2">通行密钥</label>
                  <input type="password" placeholder="该供应商的API Key" className="w-full bg-gray-50 border rounded-xl p-3 text-sm" value={data.apiKeys?.[data.provider] || ''} onChange={(e) => setData({ ...data, apiKeys: { ...data.apiKeys, [data.provider]: e.target.value } })} />
                </div>
                {data.provider === 'custom' && (
                  <>
                    <input type="text" placeholder="自定义BaseURL" className="w-full bg-gray-50 border rounded-xl p-3 text-sm" value={data.customBaseUrl || ''} onChange={(e) => setData({ ...data, customBaseUrl: e.target.value })} />
                    <input type="text" placeholder="自定义模型(逗号分隔)" className="w-full bg-gray-50 border rounded-xl p-3 text-sm" value={data.customModels || ''} onChange={(e) => setData({ ...data, customModels: e.target.value })} />
                  </>
                )}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2">自定义提示词 (可选)</label>
                  <textarea placeholder="例如：请使用敬语翻译..." className="w-full bg-gray-50 border rounded-xl p-3 text-sm h-24" value={data.customPrompt || ''} onChange={(e) => setData({ ...data, customPrompt: e.target.value })} />
                </div>
              </div>
            )}

            {tab === 'dict' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <label className="flex-1 bg-pink-50 text-pink-600 text-center py-2 rounded-xl text-sm font-bold cursor-pointer">
                    导入 JSON <input type="file" accept=".json" hidden onChange={handleImportJSON} />
                  </label>
                  <button onClick={handleExportJSON} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-sm font-bold">导出 JSON</button>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 min-h-[200px] max-h-[300px] overflow-y-auto">
                  {dictList.length === 0 ? <p className="text-center text-gray-400 mt-10 text-sm">暂无自定义词条</p> : dictList.map((d) => (
                    <div key={d.id} className="flex justify-between items-center bg-white p-2 rounded-lg mb-2 shadow-sm border">
                      <div className="text-xs overflow-hidden">
                        <div className="font-bold text-gray-700 truncate">{d.source}</div>
                        <div className="text-pink-500 truncate">{d.translation}</div>
                      </div>
                      <button onClick={async () => { await deleteUserDictEntry(d.id); loadDict(); }} className="text-red-400 p-2"><i className="fas fa-trash" /></button>
                    </div>
                  ))}
                </div>
                <button onClick={async () => { if (window.confirm('确认清空？')) { await clearUserDict(); loadDict(); } }} className="w-full text-red-500 text-sm py-2 border border-red-100 rounded-xl font-bold">清空所有词典</button>
              </div>
            )}

            {tab === 'common' && (
              <div className="space-y-5">
                <div className="flex justify-between items-center"><span className="text-sm font-bold">开启回译</span><input type="checkbox" checked={data.enableBackTranslation} onChange={(e) => setData({ ...data, enableBackTranslation: e.target.checked })} className="w-5 h-5 accent-pink-500" /></div>
                <div className="flex justify-between items-center"><span className="text-sm font-bold">自动朗读</span><input type="checkbox" checked={data.autoPlayTTS} onChange={(e) => setData({ ...data, autoPlayTTS: e.target.checked })} className="w-5 h-5 accent-pink-500" /></div>
                <div><span className="text-sm font-bold flex justify-between"><span>语音静默发送</span><span>{Number(data.voiceAutoSendDelay) / 1000}s</span></span><input type="range" min="1000" max="3000" step="100" value={data.voiceAutoSendDelay} onChange={(e) => setData({ ...data, voiceAutoSendDelay: Number(e.target.value) })} className="w-full accent-pink-500 mt-2" /></div>
              </div>
            )}
          </div>

          <div className="p-5 border-t"><button onClick={() => { onSave(data); onClose(); }} className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold shadow-lg">保存配置</button></div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

// ----------------- 主应用逻辑 -----------------
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
  const hasAutoSentRef = useRef(false);

  useEffect(() => {
    const s = safeLocalStorageGet('ai886_settings');
    if (s) {
      try {
        const parsed = JSON.parse(s);
        if (parsed.apiKey && !parsed.apiKeys) {
          parsed.apiKeys = { [parsed.provider || DEFAULT_PROVIDER]: parsed.apiKey };
          delete parsed.apiKey;
        }
        setSettings({ ...DEFAULT_SETTINGS, ...parsed, apiKeys: parsed.apiKeys || {} });
        if (parsed.lastSourceLang) setSourceLang(parsed.lastSourceLang);
        if (parsed.lastTargetLang) setTargetLang(parsed.lastTargetLang);
      } catch {}
    }
  }, []);

  useEffect(() => {
    safeLocalStorageSet('ai886_settings', JSON.stringify({ ...settings, lastSourceLang: sourceLang, lastTargetLang: targetLang }));
  }, [settings, sourceLang, targetLang]);

  const appendHistory = (item) => setHistory((p) => [...p, item].slice(-100)); // 限制100条长度

  const scrollToResult = () => setTimeout(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, 100);

  const fetchAi = async ({ messages, signal }) => {
    const config = getApiConfig({ apiKeys: settings.apiKeys, provider: settings.provider, customBaseUrl: settings.customBaseUrl, customModels: settings.customModels });
    if (!config?.baseUrl || !config.models?.length) throw new Error('未配置API节点，请检查设置');
    const endpoint = config.baseUrl.endsWith('/chat/completions') ? config.baseUrl : `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;
    const orderedModels = reorderModelsByLastSuccess(config.provider, config.models);
    let lastErr = '';

    for (let currentModel of orderedModels) {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;
        const res = await fetch(endpoint, {
          method: 'POST', headers, signal,
          body: JSON.stringify({ model: currentModel, messages, temperature: 0, response_format: { type: 'json_object' } })
        });
        if ((res.headers.get('content-type') || '').includes('text/html')) throw new Error('节点地址错误(404)');
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error?.message || `Status: ${res.status}`);
        
        let content = (await res.json())?.choices?.[0]?.message?.content || '';
        if (settings.filterThinking) content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        saveLastSuccessModel(config.provider, currentModel);
        return { content, providerMeta: { name: config.name, icon: config.icon } };
      } catch (e) {
        lastErr = e.message;
        clearLastSuccessModel(config.provider, currentModel);
        if (e.name === 'AbortError') throw e;
      }
    }
    throw new Error(`节点请求全军覆没：${lastErr}`);
  };

  const handleTranslate = async (textOverride = null) => {
    if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); }

    let text = (textOverride !== null ? textOverride : inputVal).trim();
    if (!text && inputImages.length === 0) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    const reqId = nowId(); currentRequestIdRef.current = reqId;

    let cSrc = sourceLang, cTgt = targetLang;
    const det = detectScript(text);
    if (det && det !== cSrc) {
      if (det === cTgt) { cSrc = cTgt; cTgt = sourceLang; setSourceLang(cSrc); setTargetLang(cTgt); }
      else { cSrc = det; setSourceLang(cSrc); }
    }

    setIsLoading(true);
    appendHistory({ id: reqId + '_u', role: 'user', text, images: inputImages, ts: Date.now() });
    setInputVal(''); finalTextRef.current = ''; setInputImages([]); scrollToResult();

    const sysMsg = buildSystemInstruction(settings.enableBackTranslation, getLangName(cSrc), getLangName(cTgt), settings.customPrompt);
    const userContent = buildUserMsgContent(cSrc, cTgt, text, inputImages.length > 0);
    const msgs = [{ role: 'system', content: sysMsg }, { role: 'user', content: inputImages.length ? [{ type: "text", text: userContent }, ...inputImages.map(url => ({ type: "image_url", image_url: { url } }))] : userContent }];

    try {
      let aiMsg = { id: reqId + '_a', role: 'ai', results: [], ts: Date.now(), tgtLang: cTgt, originalText: text, srcLang: cSrc };
      let dictHit = null; let providerInfo = null;

      // 1. 预设专业词库 (仅要求精确匹配)
      if (inputImages.length === 0 && text) {
        try {
          const dict = await loadCheatDict(cSrc);
          if (dict) {
            dictHit = await matchCheatExact(dict, text, cTgt); // EXACT MATCH
            if (dictHit) providerInfo = { name: '★ 离线专业词库', icon: 'fa-book' };
          }
        } catch (e) {}
      }

      // 2. 用户自定义词典
      if (!dictHit && inputImages.length === 0 && text) {
        dictHit = await matchFromUserDict(cSrc, cTgt, text);
        if (dictHit) providerInfo = { name: '✓ 我的词典', icon: 'fa-user-edit' };
      }

      if (dictHit && dictHit.length > 0) {
        aiMsg.results = normalizeTranslations(dictHit, settings.enableBackTranslation);
        aiMsg.providerMeta = providerInfo;
      } else {
        // 3. AI 24小时缓存
        const cacheParams = { srcLang: cSrc, tgtLang: cTgt, text, provider: settings.provider, enableBackTranslation: settings.enableBackTranslation, customPrompt: settings.customPrompt };
        const cachedResult = getCachedAiResult(cacheParams);

        if (cachedResult && inputImages.length === 0) {
  aiMsg.results = normalizeTranslations(cachedResult.results, settings.enableBackTranslation);
  aiMsg.providerMeta = { name: '⚡ 缓存秒回', icon: 'fa-bolt' };
        } else {
          // 4. 真实请求 AI
          const res = await fetchAi({ messages: msgs, signal });
          aiMsg.results = normalizeTranslations(res.content, settings.enableBackTranslation);
          aiMsg.providerMeta = res.providerMeta;

          // 缓存 24 小时 (仅限纯文本)，不写入永久用户词库
          if (text && inputImages.length === 0 && aiMsg.results[0]?.translation) {
            setCachedAiResult(cacheParams, {
  results: aiMsg.results,
  providerMeta: res.providerMeta
});
          }
        }
      }

      if (currentRequestIdRef.current === reqId) {
        appendHistory(aiMsg); scrollToResult();
        if (settings.autoPlayTTS && aiMsg.results[0]) playTTS(aiMsg.results[0].translation, cTgt, settings);
      }
    } catch (e) {
      if (e.name !== 'AbortError' && currentRequestIdRef.current === reqId) appendHistory({ id: reqId + '_e', role: 'error', text: e.message });
    } finally {
      if (currentRequestIdRef.current === reqId) setIsLoading(false);
    }
  };

  const startRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert('当前浏览器不支持语音输入');
    if (isRecording) {
  hasAutoSentRef.current = true;
  recognitionRef.current?.stop();
  if ((finalTextRef.current || inputVal).trim()) {
    handleTranslate(finalTextRef.current || inputVal);
  }
  return;
    }
    
    playBeep();
    const rec = new SR(); rec.lang = sourceLang; rec.interimResults = true; rec.continuous = true;
    recognitionRef.current = rec; setInputVal(''); finalTextRef.current = ''; setIsRecording(true);
    hasAutoSentRef.current = false; // 重置发送锁

    rec.onresult = (e) => {
      let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setInputVal(t); finalTextRef.current = t;
      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
      
      autoSendTimerRef.current = setTimeout(() => {
        if (finalTextRef.current.trim() && !hasAutoSentRef.current) {
          hasAutoSentRef.current = true; // 加锁防重复
          rec.stop();
          handleTranslate(finalTextRef.current);
        }
      }, settings.voiceAutoSendDelay);
    };

    rec.onend = () => {
      setIsRecording(false);
      if (!hasAutoSentRef.current && finalTextRef.current.trim()) {
        hasAutoSentRef.current = true;
        handleTranslate(finalTextRef.current);
      }
    };
    rec.onerror = () => setIsRecording(false);
    rec.start();
  };

  const handleImage = async (e) => {
    if (!e.target.files.length) return;
    const res = await Promise.all(Array.from(e.target.files).map((f) => compressImage(f)));
    setInputImages((p) => [...p, ...res]); e.target.value = '';
  };

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-gray-50 relative text-gray-800">
      <GlobalStyles />
      {settings.chatBackgroundUrl && <div className="absolute inset-0 bg-cover bg-center z-0 pointer-events-none opacity-50" style={{ backgroundImage: `url('${settings.chatBackgroundUrl}')`, opacity: 1 - settings.backgroundOverlay }} />}

      <div className="relative z-20 pt-[env(safe-area-inset-top)] bg-white/80 backdrop-blur-xl border-b shadow-sm">
        <div className="flex justify-between h-14 px-4 items-center">
          <div className="w-10" />
          <div className="font-extrabold text-lg flex items-center gap-2"><i className="fas fa-language text-pink-500" />886.best</div>
          <button onClick={() => setShowSettings(true)} className="w-9 h-9 rounded-full bg-gray-100 text-gray-600"><i className="fas fa-cog" /></button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-4 pt-4 pb-[180px] scroll-smooth">
        <div className="w-full max-w-[600px] mx-auto min-h-full flex flex-col justify-end">
          {history.length === 0 && !isLoading && (
            <div className="text-center text-gray-400 mb-20 opacity-80 mt-20"><div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🌍</div><div className="font-bold"886.best中缅交友社区</div></div>
          )}
          {history.map((item) => (
            <div key={item.id} className={`mb-6 ${item.role === 'user' ? 'flex justify-end' : ''}`}>
              {item.role === 'user' ? (
                <div className="flex flex-col items-end max-w-[85%]">
                  {item.images?.length > 0 && <div className="flex gap-2 mb-2 justify-end">{item.images.map((img, i) => <img loading="lazy" key={i} src={img} className="w-24 h-24 object-cover rounded-xl border-2" alt="" />)}</div>}
                  {item.text && <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm text-[15px] shadow-md">{item.text}</div>}
                </div>
              ) : item.role === 'error' ? (
                <div className="bg-red-50 text-red-500 text-sm p-4 rounded-2xl text-center shadow-sm border border-red-100"><i className="fas fa-exclamation-circle mr-2" />{item.text}</div>
              ) : (
                <div className="w-full">
                  {item.providerMeta && <div className="text-[10px] text-gray-400 mb-2 ml-2 font-bold flex items-center gap-1.5"><i className={`fas ${item.providerMeta.icon} text-pink-400`} />{item.providerMeta.name}</div>}
                  {item.results.map((res, i) => <TranslationCard key={i} data={res} onPlay={() => playTTS(res.translation, item.tgtLang, settings)} originalText={item.originalText} srcLang={item.srcLang} tgtLang={item.tgtLang} />)}
                </div>
              )}
            </div>
          ))}
          {isLoading && <div className="flex justify-start mb-6"><div className="bg-white/90 px-5 py-3 rounded-2xl shadow-sm text-pink-500 font-bold text-sm"><i className="fas fa-circle-notch fa-spin mr-2" />翻译中...</div></div>}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white via-white/95 to-transparent pt-12 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-[600px] mx-auto px-4">
          <div className="flex justify-center mb-3">
            <div className="flex items-center bg-white/80 backdrop-blur-xl rounded-full p-1 border shadow-sm">
              <button onClick={() => setShowSrcPicker(true)} className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-50 rounded-full"><span className="text-lg">{getLangFlag(sourceLang)}</span><span className="text-xs font-bold">{getLangName(sourceLang)}</span></button>
              <button onClick={() => { setSourceLang(targetLang); setTargetLang(sourceLang); }} className="w-8 h-8 text-gray-400 hover:text-pink-500"><i className="fas fa-exchange-alt text-xs" /></button>
              <button onClick={() => setShowTgtPicker(true)} className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-50 rounded-full"><span className="text-lg">{getLangFlag(targetLang)}</span><span className="text-xs font-bold">{getLangName(targetLang)}</span></button>
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              <Menu as="div" className="relative">
                <Menu.Button className="w-10 h-10 flex items-center justify-center text-pink-500 rounded-full hover:bg-pink-50 transition-colors"><i className={`fas ${(PROVIDERS[settings.provider] || {}).icon || 'fa-robot'} text-lg`} /></Menu.Button>
                <Transition as={Fragment} enter="duration-150 ease-out" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="duration-100 ease-in" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                  <Menu.Items className="absolute bottom-full right-0 mb-2 w-40 bg-white rounded-2xl shadow-xl border overflow-hidden p-1.5 outline-none">
                    {Object.values(PROVIDERS).map((p) => (
                      <Menu.Item key={p.id}>
                        {({ active }) => <button onClick={() => setSettings({ ...settings, provider: p.id })} className={`flex w-full items-center px-4 py-3 text-xs font-bold rounded-xl ${settings.provider === p.id ? 'bg-pink-50 text-pink-600' : active ? 'bg-gray-50' : ''}`}><i className={`fas ${p.icon} w-5`} /> {p.name}</button>}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          <div className={`relative flex items-end gap-2 bg-white border ${isRecording ? 'border-pink-400 ring-2 ring-pink-100' : 'shadow-md'} rounded-[32px] p-2`}>
            <Menu as="div" className="relative">
              <Menu.Button className="w-11 h-11 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-full"><i className="fas fa-plus text-lg" /></Menu.Button>
              <Transition as={Fragment} enter="duration-150" enterFrom="opacity-0 translate-y-2" enterTo="opacity-100 translate-y-0" leave="duration-100" leaveTo="opacity-0">
                <Menu.Items className="absolute bottom-full left-0 mb-3 w-32 bg-white rounded-2xl shadow-xl border p-1.5 outline-none">
                  <Menu.Item>{({ active }) => <button onClick={() => cameraInputRef.current?.click()} className={`flex w-full items-center px-4 py-3 text-sm font-bold rounded-xl ${active ? 'bg-pink-50 text-pink-600' : ''}`}><i className="fas fa-camera w-6" /> 拍照</button>}</Menu.Item>
                  <Menu.Item>{({ active }) => <button onClick={() => fileInputRef.current?.click()} className={`flex w-full items-center px-4 py-3 text-sm font-bold rounded-xl ${active ? 'bg-pink-50 text-pink-600' : ''}`}><i className="fas fa-image w-6" /> 相册</button>}</Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
            <input type="file" ref={fileInputRef} accept="image/*" multiple hidden onChange={handleImage} />
            <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" hidden onChange={handleImage} />

            <div className="flex-1 flex flex-col justify-center min-h-[44px] py-1">
              {inputImages.length > 0 && <div className="flex gap-2 overflow-x-auto mb-2 pl-1">{inputImages.map((img, idx) => <div key={idx} className="relative shrink-0"><img src={img} className="h-12 w-12 object-cover rounded-xl border shadow-sm" alt="" /><button onClick={() => setInputImages((p) => p.filter((_, i) => i !== idx))} className="absolute -top-1.5 -right-1.5 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"><i className="fas fa-times" /></button></div>)}</div>}
              <textarea className="w-full bg-transparent border-none outline-none resize-none px-2 py-1.5 max-h-[120px] text-[16px] leading-relaxed no-scrollbar placeholder-gray-400" placeholder={isRecording ? "听你说，随时点击停止..." : "输入翻译内容..."} rows={1} value={inputVal} onChange={(e) => { setInputVal(e.target.value); finalTextRef.current = e.target.value; }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTranslate(); } }} />
            </div>

            <button onClick={() => isRecording ? startRecording() : (inputVal.trim() || inputImages.length ? handleTranslate() : startRecording())} className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : (inputVal.trim() || inputImages.length ? 'bg-pink-500 text-white active:scale-95' : 'bg-pink-50 text-pink-500 hover:bg-pink-100')}`}>
              <i className={`fas text-lg ${isRecording ? 'fa-stop' : (inputVal.trim() || inputImages.length ? 'fa-arrow-up' : 'fa-microphone')}`} />
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showSrcPicker} onClose={() => setShowSrcPicker(false)} className="relative z-[10003]"><div className="fixed inset-0 bg-black/30 backdrop-blur-sm" /><div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4 pb-0"><Dialog.Panel className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[70vh] flex flex-col"><div className="font-bold text-center mb-4">源语言</div><div className="grid grid-cols-2 gap-3 overflow-y-auto slim-scrollbar pb-safe-bottom">{SUPPORTED_LANGUAGES.map((l) => <button key={l.code} onClick={() => { setSourceLang(l.code); setShowSrcPicker(false); }} className={`p-4 rounded-2xl font-medium text-sm flex items-center ${sourceLang === l.code ? 'bg-pink-50 text-pink-600 border-pink-200 border' : 'bg-gray-50 border border-transparent'}`}><span className="text-xl mr-3">{l.flag}</span>{l.name}</button>)}</div></Dialog.Panel></div></Dialog>
      <Dialog open={showTgtPicker} onClose={() => setShowTgtPicker(false)} className="relative z-[10003]"><div className="fixed inset-0 bg-black/30 backdrop-blur-sm" /><div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4 pb-0"><Dialog.Panel className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[70vh] flex flex-col"><div className="font-bold text-center mb-4">目标语言</div><div className="grid grid-cols-2 gap-3 overflow-y-auto slim-scrollbar pb-safe-bottom">{SUPPORTED_LANGUAGES.map((l) => <button key={l.code} onClick={() => { setTargetLang(l.code); setShowTgtPicker(false); }} className={`p-4 rounded-2xl font-medium text-sm flex items-center ${targetLang === l.code ? 'bg-pink-50 text-pink-600 border-pink-200 border' : 'bg-gray-50 border border-transparent'}`}><span className="text-xl mr-3">{l.flag}</span>{l.name}</button>)}</div></Dialog.Panel></div></Dialog>

      {showSettings && <SettingsModal settings={settings} onSave={setSettings} onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default function AIChatWrapper(props) {
  return <Transition show={props.isOpen} as={Fragment}><Dialog as="div" className="relative z-[9999]" onClose={props.onClose}><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black/40 backdrop-blur-sm" /></Transition.Child><div className="fixed inset-0 overflow-hidden"><div className="absolute inset-0 overflow-hidden"><Transition.Child as={Fragment} enter="transform transition ease-in-out duration-300" enterFrom="translate-y-full" enterTo="translate-y-0" leave="transform transition ease-in-out duration-300" leaveFrom="translate-y-0" leaveTo="translate-y-full"><Dialog.Panel className="pointer-events-auto w-screen h-full"><AiChatContent onClose={props.onClose} /></Dialog.Panel></Transition.Child></div></div></Dialog></Transition>;
}
