import React, {
Fragment,
memo,
useCallback,
useEffect,
useMemo,
useRef,
useState,
} from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';

import { loadCheatDict, matchCheatExact } from '@/lib/cheatDict';
import { getApiConfig, PROVIDERS, DEFAULT_PROVIDER } from '@/data/ai-models';
import {
saveToUserDict,
matchFromUserDict,
getAllUserDict,
deleteUserDictEntry,
clearUserDict,
} from '@/lib/userDict';

// -----------------------------
// Constants / Storage helpers
// -----------------------------
const SETTINGS_KEY = 'ai886_settings_v3';
const AI_CACHE_PREFIX = 'ai886_translate_cache_v3:';
const AI_CACHE_TTL = 72 * 60 * 60 * 1000;
const MAX_HISTORY = 100;
const MAX_TTS_CACHE = 50;
const MAX_IMAGE_WIDTH = 1280;

const NON_CACHEABLE_TRANSLATIONS = new Set([
'无有效译文',
'解析数据失败',
'翻译失败',
]);

const DEFAULT_SETTINGS = {
apiKeys: {},
provider: DEFAULT_PROVIDER,
customProviders: [],
customPrompt: '',
ttsSpeed: 1.0,
autoPlayTTS: false,
backgroundOverlay: 0.9,
chatBackgroundUrl: '',
filterThinking: true,
enableBackTranslation: false,
lastSourceLang: 'zh-CN',
lastTargetLang: 'my-MM',
voiceAutoSendDelay: 1800,
rememberApiKeys: true,

// 智能回复配置
enableSmartReply: true,
suggestionProvider: DEFAULT_PROVIDER,
suggestionCustomPrompt: '',
};

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

const GlobalStyles = () => (

<style>{`
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.slim-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.slim-scrollbar::-webkit-scrollbar-track { background: transparent; }
.slim-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.14); border-radius: 9999px; }
`}</style>


);

const storage = {
get(key, fallback = null) {
try {
if (typeof window === 'undefined') return fallback;
const raw = localStorage.getItem(key);
return raw ?? fallback;
} catch {
return fallback;
}
},
set(key, value) {
try {
if (typeof window !== 'undefined') localStorage.setItem(key, value);
} catch {}
},
remove(key) {
try {
if (typeof window !== 'undefined') localStorage.removeItem(key);
} catch {}
},
};

const nowId = () => ${Date.now()}-${Math.random().toString(36).slice(2, 9)};
const getLangName = (code) => SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code;
const getLangFlag = (code) => SUPPORTED_LANGUAGES.find((l) => l.code === code)?.flag || '';

const sanitizeSettingsForSave = (settings) => {
if (settings.rememberApiKeys) return settings;

return {
...settings,
apiKeys: {},
customProviders: (settings.customProviders || []).map((p) => ({
...p,
apiKey: '',
})),
};
};

const playBeep = () => {
try {
const AudioCtx = window.AudioContext || window.webkitAudioContext;
if (!AudioCtx) return;
const ctx = new AudioCtx();
const oscillator = ctx.createOscillator();
const gain = ctx.createGain();
oscillator.connect(gain);
gain.connect(ctx.destination);
oscillator.frequency.value = 600;
gain.gain.value = 0.08;
oscillator.start();
setTimeout(() => {
try {
oscillator.stop();
ctx.close();
} catch {}
}, 120);
} catch {}
};

const compressImage = (file) =>
new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onerror = reject;
reader.onload = (event) => {
const image = new Image();
image.onerror = reject;
image.onload = () => {
try {
const canvas = document.createElement('canvas');
let { width, height } = image;
if (width > MAX_IMAGE_WIDTH) {
height *= MAX_IMAGE_WIDTH / width;
width = MAX_IMAGE_WIDTH;
}
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('canvas context unavailable');
ctx.drawImage(image, 0, 0, width, height);
resolve(canvas.toDataURL('image/jpeg', 0.82));
} catch (error) {
reject(error);
}
};
image.src = event.target?.result;
};
reader.readAsDataURL(file);
});

// 高精度正则语言检测
const detectLanguageLib = (text) => {
if (!text || !text.trim() || text.length < 2) return null;
const myanmar = (text.match(/[\u1000-\u109F\uAA60-\uAA7F]/g) || []).length;
const korean = (text.match(/[\uAC00-\uD7AF]/g) || []).length;
const japanese = (text.match(/[\u3040-\u30FF\u31F0-\u31FF]/g) || []).length;
const thai = (text.match(/[\u0E00-\u0E7F]/g) || []).length;
const russian = (text.match(/[\u0400-\u04FF]/g) || []).length;
const chinese = (text.match(/[\u4E00-\u9FFF]/g) || []).length;
const vietnamese = (text.match(/[ăâđêôơưáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/gi) || []).length;

const counts = [
{ code: 'my-MM', count: myanmar },
{ code: 'ko-KR', count: korean },
{ code: 'ja-JP', count: japanese },
{ code: 'th-TH', count: thai },
{ code: 'ru-RU', count: russian },
{ code: 'zh-CN', count: chinese },
{ code: 'vi-VN', count: vietnamese },
].sort((a, b) => b.count - a.count);

if (counts[0].count > 0) return counts[0].code;

if (/[a-zA-Z]/.test(text) && !/[^\x00-\x7F]/.test(text)) return 'en-US';
return null;
};

const shouldInsertSpace = (left, right) => /[A-Za-z0-9]$/.test(left) && /^[A-Za-z0-9]/.test(right);

const mergeTranscript = (prev, next) => {
const a = String(prev || '').trim();
const b = String(next || '').trim();
if (!a) return b;
if (!b) return a;
if (b.startsWith(a)) return b;
if (a.endsWith(b)) return a;

const maxOverlap = Math.min(a.length, b.length);
for (let len = maxOverlap; len >= 2; len -= 1) {
if (a.slice(-len) === b.slice(0, len)) {
return a + b.slice(len);
}
}

return shouldInsertSpace(a, b) ? ${a} ${b} : ${a}${b};
};

const isCacheableTranslationResults = (results) => {
if (!Array.isArray(results) || results.length === 0) return false;

return results.every((item) => {
const text = String(item?.translation || '').trim();
if (!text) return false;
if (NON_CACHEABLE_TRANSLATIONS.has(text)) return false;
return true;
});
};

const normalizeTranslations = (raw, enableBackTranslation = false) => {
try {
let data = [];

code
Code
download
content_copy
expand_less
if (Array.isArray(raw)) {
  data = raw;
} else if (typeof raw === 'string') {
  const clean = raw.trim();
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  const jsonText = start >= 0 && end > start ? clean.slice(start, end + 1) : clean;
  const parsed = JSON.parse(jsonText);
  data = Array.isArray(parsed?.data) ? parsed.data : [];
} else {
  data = Array.isArray(raw?.data) ? raw.data : [];
}

const valid = data
  .filter((item) => item && item.translation)
  .map((item) => ({
    translation: String(item.translation).trim(),
    back_translation: enableBackTranslation ? String(item.back_translation || '').trim() : '',
  }));

return valid.length ? valid.slice(0, 4) : [{ translation: '无有效译文', back_translation: '' }];

} catch {
return [{ translation: '解析数据失败', back_translation: '' }];
}
};

const getLastSuccessModelKey = (provider) => ai886_last_model_${provider};
const saveLastSuccessModel = (provider, model) => storage.set(getLastSuccessModelKey(provider), model);
const clearLastSuccessModel = (provider, model) => {
const saved = storage.get(getLastSuccessModelKey(provider), '');
if (saved === model) storage.remove(getLastSuccessModelKey(provider));
};
const reorderModelsByLastSuccess = (provider, models = []) => {
const saved = storage.get(getLastSuccessModelKey(provider), '');
return saved && models.includes(saved) ? [saved, ...models.filter((m) => m !== saved)] : models;
};

const getAiCacheKey = ({
srcLang,
tgtLang,
text,
provider,
baseUrl,
modelHint,
enableBackTranslation,
customPrompt,
}) =>
${AI_CACHE_PREFIX}${[ srcLang || '', tgtLang || '', provider || '', baseUrl || '', modelHint || '', enableBackTranslation ? '1' : '0', (customPrompt || '').trim(), (text || '').trim(), ].join('|')};

const getCachedAiResult = (params) => {
const key = getAiCacheKey(params);
const raw = storage.get(key, null);
if (!raw) return null;

try {
const parsed = JSON.parse(raw);

code
Code
download
content_copy
expand_less
if (!parsed?.ts || parsed?.ok !== true || !Array.isArray(parsed?.results)) {
  storage.remove(key);
  return null;
}

if (Date.now() - parsed.ts > AI_CACHE_TTL) {
  storage.remove(key);
  return null;
}

if (!isCacheableTranslationResults(parsed.results)) {
  storage.remove(key);
  return null;
}

return parsed;

} catch {
storage.remove(key);
return null;
}
};

const setCachedAiResult = (params, payload) => {
const key = getAiCacheKey(params);
storage.set(
key,
JSON.stringify({
ts: Date.now(),
ok: true,
results: payload.results || [],
providerMeta: payload.providerMeta || null,
})
);
};

// 恢复完全原始的翻译提示词
const buildSystemInstruction = (enableBackTranslation, srcLangName, tgtLangName, customPrompt) => {
let baseRules = `You are a strict, highly accurate multilingual translation engine.

CRITICAL RULES:

Translate the user's input from ${srcLangName} into ${tgtLangName}.

Be faithful to the source text. Prefer direct and literal translation whenever possible.

Preserve the original meaning, tone, style, and important details. Do not add, omit, summarize, explain, answer, or rewrite.

The "translation" field must contain ONLY the final translated text in ${tgtLangName}.

Do NOT mix other languages in the translation. The output must be written purely in ${tgtLangName}, except for content that must remain unchanged, such as names, brands, product names, model numbers, codes, URLs, numbers, emojis, or other inherently non-translatable items.

Do NOT include the original text, pronunciation, transliteration, notes, explanations, brackets, or extra commentary in the translation.

If a fully literal translation would be unnatural or incorrect in ${tgtLangName}, make only the smallest necessary adjustment to keep the meaning accurate.

Output exactly one final translation.

Return ONLY valid JSON. Do not use markdown fences. Do not output any extra text before or after the JSON.`;

if (customPrompt?.trim()) {
baseRules += \n\nUSER CUSTOM RULES:\n${customPrompt.trim()};
}

if (!enableBackTranslation) {
return ${baseRules}\n\nOutput schema:\n{"data":[{"translation":"..."}]};
}

return `${baseRules}
10. Also provide "back_translation" by translating the final ${tgtLangName} result back into ${srcLangName} for verification only.
11. The "back_translation" must be a real back-translation, not a copy of the original input, unless the translated content is naturally identical.

Output schema:
{"data":[{"translation":"...","back_translation":"..."}]}`;
};

const buildUserMsgContent = (srcLang, tgtLang, text, hasImage) => {
const parts = [
Source language: ${getLangName(srcLang)},
Target language: ${getLangName(tgtLang)},
'Task: Translate the content faithfully into the target language.',
Important: The translation must be written only in ${getLangName(tgtLang)}. Do not mix other languages unless the content must remain unchanged, such as names, brands, codes, URLs, or numbers.,
];

if (text?.trim()) parts.push(Text to translate:\n${text});
if (hasImage) {
parts.push(
"If both text and image are provided, translate the user's text first, and also translate any clearly visible text in the image if relevant."
);
}
return parts.join('\n\n');
};

// -----------------------------
// Hooks
// -----------------------------
function usePersistentSettings() {
const [settings, setSettings] = useState(DEFAULT_SETTINGS);
const [loaded, setLoaded] = useState(false);

useEffect(() => {
const raw = storage.get(SETTINGS_KEY, null);
if (!raw) {
setLoaded(true);
return;
}

code
Code
download
content_copy
expand_less
try {
  const parsed = JSON.parse(raw);
  const normalized = {
    ...DEFAULT_SETTINGS,
    ...parsed,
    apiKeys: parsed?.apiKeys || {},
    customProviders: Array.isArray(parsed?.customProviders) ? parsed.customProviders : [],
  };
  setSettings(normalized);
} catch {
  setSettings(DEFAULT_SETTINGS);
} finally {
  setLoaded(true);
}

}, []);

useEffect(() => {
if (!loaded) return;
storage.set(SETTINGS_KEY, JSON.stringify(sanitizeSettingsForSave(settings)));
}, [loaded, settings]);

return { settings, setSettings, loaded };
}

function useTTS() {
const cacheRef = useRef(new Map());
const activeAudioRef = useRef(null);

const trimCache = useCallback(() => {
const cache = cacheRef.current;
while (cache.size > MAX_TTS_CACHE) {
const firstKey = cache.keys().next().value;
const firstItem = cache.get(firstKey);
if (firstItem?.url) {
try {
URL.revokeObjectURL(firstItem.url);
} catch {}
}
cache.delete(firstKey);
}
}, []);

const stop = useCallback(() => {
const audio = activeAudioRef.current;
if (!audio) return;
try {
audio.pause();
audio.currentTime = 0;
} catch {}
activeAudioRef.current = null;
}, []);

const play = useCallback(
async (text, lang, settings) => {
if (!text) return;

code
Code
download
content_copy
expand_less
const voiceMap = {
    'zh-CN': 'zh-CN-XiaoyouNeural',
    'en-US': 'en-US-JennyNeural',
    'my-MM': 'my-MM-NilarNeural',
  };

  const voice = voiceMap[lang] || 'zh-CN-XiaoxiaoMultilingualNeural';
  const speed = Number(settings?.ttsSpeed) || 1.0;
  const key = `${voice}_${speed}_${text}`;

  try {
    stop();

    let item = cacheRef.current.get(key);
    if (!item) {
      const res = await fetch(
        `https://t.leftsite.cn/tts?t=${encodeURIComponent(text)}&v=${encodeURIComponent(
          voice
        )}&r=${Math.floor((speed - 1) * 50)}`
      );
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      item = { audio, url };
      cacheRef.current.set(key, item);
      trimCache();
    }

    item.audio.currentTime = 0;
    item.audio.playbackRate = speed;
    activeAudioRef.current = item.audio;
    await item.audio.play();
  } catch {}
},
[stop, trimCache]

);

useEffect(() => {
return () => {
stop();
cacheRef.current.forEach((item) => {
if (item?.url) {
try {
URL.revokeObjectURL(item.url);
} catch {}
}
});
cacheRef.current.clear();
};
}, [stop]);

return { playTTS: play, stopTTS: stop };
}

function useSpeechInput({ sourceLang, delayMs, onSend }) {
const recognitionRef = useRef(null);
const autoSendTimerRef = useRef(null);
const finalTextRef = useRef('');
const displayTextRef = useRef('');
const hasAutoSentRef = useRef(false);

const [isRecording, setIsRecording] = useState(false);
const [displayValue, setDisplayValue] = useState('');

const clearAutoTimer = useCallback(() => {
if (autoSendTimerRef.current) {
clearTimeout(autoSendTimerRef.current);
autoSendTimerRef.current = null;
}
}, []);

const hardResetBuffers = useCallback(() => {
finalTextRef.current = '';
displayTextRef.current = '';
hasAutoSentRef.current = false;
setDisplayValue('');
}, []);

const stopRecognitionOnly = useCallback(() => {
try {
recognitionRef.current?.stop();
} catch {}
setIsRecording(false);
}, []);

const stopAndSend = useCallback(
(forcedText) => {
if (hasAutoSentRef.current) return;
hasAutoSentRef.current = true;
clearAutoTimer();
stopRecognitionOnly();

code
Code
download
content_copy
expand_less
const finalText = String(forcedText ?? displayTextRef.current).trim();
  displayTextRef.current = '';
  finalTextRef.current = '';
  setDisplayValue('');

  if (finalText) onSend(finalText);
},
[clearAutoTimer, onSend, stopRecognitionOnly]

);

const startRecording = useCallback(() => {
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SR) {
alert('当前浏览器不支持语音输入');
return;
}

code
Code
download
content_copy
expand_less
playBeep();
hardResetBuffers();

const recognition = new SR();
recognition.lang = sourceLang;
recognition.interimResults = true;
recognition.continuous = true;
recognitionRef.current = recognition;
setIsRecording(true);

recognition.onresult = (event) => {
  let interim = '';

  for (let i = event.resultIndex; i < event.results.length; i += 1) {
    const transcript = event.results[i][0]?.transcript || '';
    if (event.results[i].isFinal) {
      finalTextRef.current = mergeTranscript(finalTextRef.current, transcript);
    } else {
      interim = mergeTranscript(interim, transcript);
    }
  }

  const nextDisplay = mergeTranscript(finalTextRef.current, interim);
  displayTextRef.current = nextDisplay;
  setDisplayValue(nextDisplay);

  clearAutoTimer();
  autoSendTimerRef.current = setTimeout(() => {
    if (displayTextRef.current.trim() && !hasAutoSentRef.current) {
      stopAndSend(displayTextRef.current);
    }
  }, delayMs);
};

recognition.onerror = () => {
  clearAutoTimer();
  setIsRecording(false);
};

recognition.onend = () => {
  setIsRecording(false);
  clearAutoTimer();
  if (!hasAutoSentRef.current && displayTextRef.current.trim()) {
    stopAndSend(displayTextRef.current);
  }
};

recognition.start();

}, [clearAutoTimer, delayMs, hardResetBuffers, sourceLang, stopAndSend]);

const stopRecording = useCallback(() => {
stopAndSend(displayTextRef.current);
}, [stopAndSend]);

const setManualValue = useCallback((value) => {
finalTextRef.current = value;
displayTextRef.current = value;
setDisplayValue(value);
}, []);

useEffect(() => {
return () => {
clearAutoTimer();
try {
recognitionRef.current?.stop();
} catch {}
};
}, [clearAutoTimer]);

return {
isRecording,
displayValue,
setManualValue,
hardResetBuffers,
startRecording,
stopRecording,
};
}

function useTranslator({ settings, sourceLang, targetLang, setSourceLang, setTargetLang, playTTS }) {
const abortControllerRef = useRef(null);
const currentRequestIdRef = useRef(null);
const [history, setHistory] = useState([]);
const [isLoading, setIsLoading] = useState(false);

const updateHistoryItem = useCallback((id, partial) => {
setHistory((prev) => prev.map((item) => (item.id === id ? { ...item, ...partial } : item)));
}, []);

const resolveProviderConfig = useCallback((providerId) => {
const isCustom = String(providerId || '').startsWith('custom_');
if (isCustom) {
const customProvider = (settings.customProviders || []).find((p) => p.id === providerId);
if (!customProvider) throw new Error('自定义节点不存在');
return {
provider: customProvider.id,
name: customProvider.name,
icon: customProvider.icon || 'fa-robot',
baseUrl: customProvider.baseUrl,
models: String(customProvider.models || '')
.split(',')
.map((m) => m.trim())
.filter(Boolean),
apiKey: customProvider.apiKey,
preferJsonMode: false,
};
}

code
Code
download
content_copy
expand_less
const builtIn = getApiConfig({ apiKeys: settings.apiKeys, provider: providerId });
return {
  ...builtIn,
  preferJsonMode: true,
};

}, [settings]);

// 新增：独立的智能双语回复建议生成
const fetchSmartSuggestions = useCallback(
async (msgId, originalText, translatedText, srcLangCode, tgtLangCode) => {
// 只有在开启功能，且原文不是目标语言时（替对方回复的场景）才触发
if (!settings.enableSmartReply || srcLangCode === tgtLangCode) return;

code
Code
download
content_copy
expand_less
updateHistoryItem(msgId, { loadingSuggestions: true });
  try {
    const providerId = settings.suggestionProvider || settings.provider;
    const config = resolveProviderConfig(providerId);
    const endpoint = config.baseUrl.endsWith('/chat/completions')
      ? config.baseUrl
      : `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;
    const model = config.models[0];

    const srcName = getLangName(srcLangCode);
    const tgtName = getLangName(tgtLangCode);

    const prompt = `你现在是用户的“聊天嘴替”，正在和好友微信/聊天软件上聊天。请针对对方的消息，生成3条不同的回复建议，每条都要有鲜明的风格。

【可选风格池】

幽默调侃：轻松搞笑，带点玩笑

高情商回应：体贴、暖心、高情商，让对方感觉被理解

温柔共情：顺着对方说，表达理解和支持

直接反问：自然带出新话题

俏皮撒娇：可爱的语气，适合亲密关系

【要求】

从以上风格中任选3种，确保3条风格各不相同。

根据对方消息内容，选择最合适的风格组合。

回复必须口语化、自然，有情绪，像真人微信聊天，避免书面语，客套话，AI腔。

回复要简短有力，每条控制在 10字以内，符合日常聊天习惯。

【重要】必须提供双语版本：一个是用户看的语言（
𝑡
𝑔
𝑡
𝑁
𝑎
𝑚
𝑒
），一个是发给对方的语言（
tgtName），一个是发给对方的语言（
{srcName}）。

输出严格的 JSON 格式，必须包含 data 数组：
{"data": [{"display": "用户看的语言内容", "copy": "发给对方的语言内容"}]}

【示例】
对方消息："今天加班好累啊"
输出：
{"data": [
{"display": "抱抱，辛苦啦", "copy": "ဖက်ထားမယ် ပင်ပန်းနေပြီလား"},
{"display": "下班了没？一起干饭去", "copy": "ရုံးဆင်းပြီလား။ အတူတူ သွားစားရအောင်"},
{"display": "累成狗了，我也是", "copy": "အရမ်းပင်ပန်းနေပြီ၊ ငါလည်းဒီလိုပဲ"}
]}

{settings.suggestionCustomPrompt}` : ''}

【当前任务】
对方发来的
𝑠
𝑟
𝑐
𝑁
𝑎
𝑚
𝑒
原文：
"
srcName原文："
{originalText}"
翻译成
𝑡
𝑔
𝑡
𝑁
𝑎
𝑚
𝑒
的意思：
"
tgtName的意思："
{translatedText}"
请直接输出 JSON，不要任何多余文字。`;

code
Code
download
content_copy
expand_less
const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        // 如果节点支持，尝试强制 JSON 输出
        response_format: config.preferJsonMode ? { type: 'json_object' } : undefined,
      }),
    });

    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    let content = data?.choices?.[0]?.message?.content || '';

    // 提取 JSON
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}');
    if (start >= 0 && end > start) {
      content = content.slice(start, end + 1);
    }

    const parsed = JSON.parse(content);
    const suggestions = Array.isArray(parsed?.data) ? parsed.data : [];

    if (suggestions.length > 0) {
      updateHistoryItem(msgId, { suggestions: suggestions.slice(0, 3), loadingSuggestions: false });
    } else {
      updateHistoryItem(msgId, { loadingSuggestions: false });
    }
  } catch (e) {
    updateHistoryItem(msgId, { loadingSuggestions: false });
  }
},
[resolveProviderConfig, settings, updateHistoryItem]

);

const fetchAi = useCallback(
async ({ messages, signal }) => {
const config = resolveProviderConfig(settings.provider);
if (!config?.baseUrl || !config.models?.length) {
throw new Error('未正确配置 API 节点信息，请检查设置');
}

code
Code
download
content_copy
expand_less
const endpoint = config.baseUrl.endsWith('/chat/completions')
    ? config.baseUrl
    : `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;

  const orderedModels = reorderModelsByLastSuccess(config.provider, config.models);
  let lastError = '未知错误';

  for (const model of orderedModels) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (config.apiKey) headers.Authorization = `Bearer ${config.apiKey}`;

      const body = {
        model,
        messages,
        temperature: 0,
      };

      if (config.preferJsonMode) {
        body.response_format = { type: 'json_object' };
      }

      let response = await fetch(endpoint, {
        method: 'POST',
        headers,
        signal,
        body: JSON.stringify(body),
      });

      if (!response.ok && config.preferJsonMode) {
        const clonedError = await response.clone().text().catch(() => '');
        if (/response_format|json_object|unsupported|invalid/i.test(clonedError)) {
          delete body.response_format;
          response = await fetch(endpoint, {
            method: 'POST',
            headers,
            signal,
            body: JSON.stringify(body),
          });
        }
      }

      if ((response.headers.get('content-type') || '').includes('text/html')) {
        throw new Error('节点地址错误或返回了 HTML 页面');
      }

      if (!response.ok) {
        let message = `Status: ${response.status}`;
        try {
          const err = await response.json();
          message = err?.error?.message || err?.message || message;
        } catch {
          try {
            message = (await response.text()) || message;
          } catch {}
        }
        throw new Error(message);
      }

      const data = await response.json();
      let content = data?.choices?.[0]?.message?.content || '';
      if (settings.filterThinking) {
        content = String(content).replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      }

      saveLastSuccessModel(config.provider, model);
      return {
        content,
        model,
        providerMeta: {
          name: config.name,
          icon: config.icon,
        },
        baseUrl: config.baseUrl,
      };
    } catch (error) {
      lastError = error?.message || '未知错误';
      clearLastSuccessModel(config.provider, model);
      if (error?.name === 'AbortError') throw error;
    }
  }

  throw new Error(`节点请求全部失败：${lastError}`);
},
[resolveProviderConfig, settings.provider, settings.filterThinking]

);

const translate = useCallback(
async ({ text, images = [], resetComposer }) => {
const safeText = String(text || '').trim();
if (!safeText && images.length === 0) return;

code
Code
download
content_copy
expand_less
abortControllerRef.current?.abort();
  const controller = new AbortController();
  abortControllerRef.current = controller;
  const reqId = nowId();
  currentRequestIdRef.current = reqId;

  let currentSource = sourceLang;
  let currentTarget = targetLang;
  
  // 使用更精准的正则检测自动切换
  const detected = detectLanguageLib(safeText);
  if (detected && detected !== currentSource) {
    if (detected === currentTarget) {
      currentSource = currentTarget;
      currentTarget = sourceLang;
    } else {
      currentSource = detected;
    }
    setSourceLang(currentSource);
    setTargetLang(currentTarget);
  }

  setIsLoading(true);
  setHistory((prev) => [
    ...prev,
    {
      id: `${reqId}_u`,
      role: 'user',
      text: safeText,
      images,
      ts: Date.now(),
    },
  ].slice(-MAX_HISTORY));

  resetComposer?.();

  const systemInstruction = buildSystemInstruction(
    settings.enableBackTranslation,
    getLangName(currentSource),
    getLangName(currentTarget),
    settings.customPrompt
  );

  const userContent = buildUserMsgContent(currentSource, currentTarget, safeText, images.length > 0);
  const messages = [
    { role: 'system', content: systemInstruction },
    {
      role: 'user',
      content:
        images.length > 0
          ? [
              { type: 'text', text: userContent },
              ...images.map((url) => ({ type: 'image_url', image_url: { url } })),
            ]
          : userContent,
    },
  ];

  try {
    const aiMessage = {
      id: `${reqId}_a`,
      role: 'ai',
      results: [],
      ts: Date.now(),
      tgtLang: currentTarget,
      srcLang: currentSource,
      originalText: safeText,
    };

    let dictHit = null;
    let providerMeta = null;

    if (!images.length && safeText) {
      try {
        const cheatDict = await loadCheatDict(currentSource);
        if (cheatDict) {
          dictHit = await matchCheatExact(cheatDict, safeText, currentTarget);
          if (dictHit) providerMeta = { name: '★ 离线专业词库', icon: 'fa-book' };
        }
      } catch {}
    }

    if (!dictHit && !images.length && safeText) {
      dictHit = await matchFromUserDict(currentSource, currentTarget, safeText);
      if (dictHit) providerMeta = { name: '✓ 我的词典', icon: 'fa-user-edit' };
    }

    if (dictHit?.length) {
      aiMessage.results = normalizeTranslations(dictHit, settings.enableBackTranslation);
      aiMessage.providerMeta = providerMeta;
    } else {
      const providerConfig = resolveProviderConfig(settings.provider);
      const cacheParams = {
        srcLang: currentSource,
        tgtLang: currentTarget,
        text: safeText,
        provider: settings.provider,
        baseUrl: providerConfig.baseUrl,
        modelHint: reorderModelsByLastSuccess(providerConfig.provider, providerConfig.models)[0] || '',
        enableBackTranslation: settings.enableBackTranslation,
        customPrompt: settings.customPrompt,
      };

      const cached = !images.length ? getCachedAiResult(cacheParams) : null;
      if (cached) {
        aiMessage.results = normalizeTranslations(cached.results, settings.enableBackTranslation);
        aiMessage.providerMeta = { name: '⚡ 缓存秒回', icon: 'fa-bolt' };
      } else {
        const result = await fetchAi({ messages, signal: controller.signal });
        aiMessage.results = normalizeTranslations(result.content, settings.enableBackTranslation);
        aiMessage.providerMeta = result.providerMeta;

        if (safeText && !images.length && isCacheableTranslationResults(aiMessage.results)) {
          setCachedAiResult(
            {
              ...cacheParams,
              baseUrl: result.baseUrl,
              modelHint: result.model,
            },
            {
              results: aiMessage.results,
              providerMeta: result.providerMeta,
            }
          );
        }
      }
    }

    if (currentRequestIdRef.current === reqId) {
      setHistory((prev) => [...prev, aiMessage].slice(-MAX_HISTORY));

      if (settings.autoPlayTTS && isCacheableTranslationResults(aiMessage.results)) {
        playTTS(aiMessage.results[0].translation, currentTarget, settings);
      }

      // 触发异步回复建议
      if (!images.length && aiMessage.results[0]?.translation) {
        fetchSmartSuggestions(aiMessage.id, safeText, aiMessage.results[0].translation, currentSource, currentTarget);
      }
    }
  } catch (error) {
    if (error?.name !== 'AbortError' && currentRequestIdRef.current === reqId) {
      setHistory((prev) => [
        ...prev,
        {
          id: `${reqId}_e`,
          role: 'error',
          text: error?.message || '翻译失败',
          ts: Date.now(),
        },
      ]);
    }
  } finally {
    if (currentRequestIdRef.current === reqId) {
      setIsLoading(false);
    }
  }
},
[
  fetchAi,
  fetchSmartSuggestions,
  playTTS,
  resolveProviderConfig,
  setSourceLang,
  setTargetLang,
  settings,
  sourceLang,
  targetLang,
]

);

useEffect(() => {
return () => {
abortControllerRef.current?.abort();
};
}, []);

return {
history,
isLoading,
translate,
clearHistory: () => setHistory([]),
};
}

// -----------------------------
// UI Components
// -----------------------------
const TranslationCard = memo(function TranslationCard({
data,
onPlay,
originalText,
srcLang,
tgtLang,
providerMeta,
}) {
const [copied, setCopied] = useState(false);

const handleCopy = async () => {
try {
await navigator.clipboard.writeText(data.translation);
setCopied(true);
setTimeout(() => setCopied(false), 800);
} catch {}
};

const handleEdit = async (event) => {
event.stopPropagation();
const nextTranslation = prompt('修改并保存到用户词典（之后将优先应用该翻译）：', data.translation);
if (!nextTranslation?.trim() || nextTranslation.trim() === data.translation) return;
await saveToUserDict(srcLang, tgtLang, originalText, nextTranslation.trim());
alert('已保存到用户词典');
};

return (
<div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm transition-all group mb-3 flex flex-col overflow-hidden">
<div onClick={handleCopy} className="p-4 active:bg-gray-50 cursor-pointer relative">
{copied && (
<div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-10">
<span className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg">已复制</span>
</div>
)}
<div className="text-[18px] leading-relaxed font-medium text-gray-800 break-words whitespace-pre-wrap">
{data.translation}
</div>

code
Code
download
content_copy
expand_less
{data.back_translation && (
      <div className="mt-3 p-2 bg-gray-50 rounded-xl text-[13px] text-gray-500 break-words whitespace-pre-wrap border border-gray-100/60">
        <i className="fas fa-reply fa-rotate-180 mr-1.5 text-gray-300" />
        {data.back_translation}
      </div>
    )}
  </div>

  <div className="flex justify-between items-center px-4 py-2 bg-gray-50/50 border-t border-gray-100">
    <div className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 truncate">
      {providerMeta ? (
        <>
          <i className={`fas ${providerMeta.icon} text-pink-400`} />
          {providerMeta.name}
        </>
      ) : (
        'AI 翻译'
      )}
    </div>

    <div className="flex gap-2">
      <button
        onClick={handleEdit}
        className="w-8 h-8 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 flex items-center justify-center transition-colors"
        title="修正词典"
      >
        <i className="fas fa-book-medical" />
      </button>
      <button
        onClick={onPlay}
        className="w-8 h-8 rounded-full text-gray-400 hover:text-pink-500 hover:bg-pink-50 flex items-center justify-center transition-colors shadow-sm bg-white border border-gray-100"
        title="朗读"
      >
        <i className="fas fa-volume-up text-sm" />
      </button>
    </div>
  </div>
</div>

);
});

// 新增：回复建议气囊组件（包含点击复制和状态反馈，高度自适应）
const SuggestionBubble = memo(function SuggestionBubble({ item }) {
const [copied, setCopied] = useState(false);

const handleCopy = () => {
try {
navigator.clipboard.writeText(item.copy);
setCopied(true);
setTimeout(() => setCopied(false), 2000);
} catch {}
};

return (
<button
onClick={handleCopy}
className="relative snap-center shrink-0 bg-white border border-pink-200 text-pink-600 rounded-2xl px-4 py-2.5 text-[14px] shadow-sm active:scale-95 transition-transform hover:bg-pink-50 min-w-[140px] max-w-[280px] whitespace-normal text-left"
>
{item.display}
{copied && (
<div className="absolute inset-0 bg-black/80 text-white flex items-center justify-center rounded-2xl text-xs font-bold z-10">
<i className="fas fa-check-circle mr-1" /> 已复制原文
</div>
)}
</button>
);
});

function LanguagePicker({ title, open, onClose, value, onChange }) {
return (
<Dialog open={open} onClose={onClose} className="relative z-[10003]">
<div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
<div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4 pb-0">
<Dialog.Panel className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[70vh] flex flex-col">
<div className="font-bold text-center mb-4">{title}</div>
<div className="grid grid-cols-2 gap-3 overflow-y-auto slim-scrollbar pb-safe-bottom">
{SUPPORTED_LANGUAGES.map((lang) => (
<button
key={lang.code}
onClick={() => {
onChange(lang.code);
onClose();
}}
className={p-4 rounded-2xl font-medium text-sm flex items-center ${ value === lang.code ? 'bg-pink-50 text-pink-600 border-pink-200 border' : 'bg-gray-50 border border-transparent' }}
>
<span className="text-xl mr-3">{lang.flag}</span>
{lang.name}
</button>
))}
</div>
</Dialog.Panel>
</div>
</Dialog>
);
}

function SettingsModal({ settings, onSave, onClose }) {
const [data, setData] = useState({ ...DEFAULT_SETTINGS, ...settings });
const [tab, setTab] = useState('api');
const [dictList, setDictList] = useState([]);

const loadDict = useCallback(async () => {
const list = await getAllUserDict();
setDictList(list);
}, []);

useEffect(() => {
if (tab === 'dict') loadDict();
}, [tab, loadDict]);

const handleImportJSON = async (event) => {
const file = event.target.files?.[0];
if (!file) return;

code
Code
download
content_copy
expand_less
const reader = new FileReader();
reader.onload = async (loadEvent) => {
  try {
    const list = JSON.parse(loadEvent.target?.result || '[]');
    for (const item of list) {
      await saveToUserDict(item.srcLang, item.tgtLang, item.source, item.translation);
    }
    await loadDict();
    alert('导入成功');
  } catch {
    alert('JSON 格式错误');
  }
};
reader.readAsText(file);

};

const handleExportJSON = () => {
const blob = new Blob([JSON.stringify(dictList, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'user_dict.json';
link.click();
setTimeout(() => URL.revokeObjectURL(url), 2000);
};

return (
<Dialog open onClose={onClose} className="relative z-[10002]">
<div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
<div className="fixed inset-0 flex items-center justify-center p-4">
<Dialog.Panel className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
<div className="flex bg-gray-50/50 rounded-t-3xl border-b overflow-x-auto no-scrollbar">
{[
{ key: 'api', label: '节点配置' },
{ key: 'reply', label: '智能回复' },
{ key: 'dict', label: '用户词典' },
{ key: 'common', label: '通用' },
].map((item) => (
<button
key={item.key}
onClick={() => setTab(item.key)}
className={flex-1 py-4 px-3 text-sm font-bold whitespace-nowrap ${ tab === item.key ? 'text-pink-600 bg-white shadow-sm' : 'text-gray-500' }}
>
{item.label}
</button>
))}
</div>

code
Code
download
content_copy
expand_less
<div className="p-6 overflow-y-auto slim-scrollbar flex-1">
        {tab === 'api' && (
          <div className="space-y-5">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-sm font-bold text-gray-700 mb-2 block">翻译默认节点</label>
                <select
                  className="w-full bg-gray-50 border rounded-xl p-3 text-sm"
                  value={data.provider}
                  onChange={(e) => setData((prev) => ({ ...prev, provider: e.target.value }))}
                >
                  <optgroup label="内置节点">
                    {Object.values(PROVIDERS).map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </optgroup>
                  {!!data.customProviders?.length && (
                    <optgroup label="自定义节点">
                      {data.customProviders.map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
              <button
                onClick={() => {
                  const newId = `custom_${Date.now()}`;
                  setData((prev) => ({
                    ...prev,
                    provider: newId,
                    customProviders: [
                      ...(prev.customProviders || []),
                      {
                        id: newId,
                        name: '新自定义节点',
                        icon: 'fa-robot',
                        baseUrl: '',
                        models: '',
                        apiKey: '',
                      },
                    ],
                  }));
                }}
                className="bg-pink-50 text-pink-600 px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap"
              >
                + 新增
              </button>
            </div>

            {String(data.provider).startsWith('custom_') ? (
              (() => {
                const index = (data.customProviders || []).findIndex((p) => p.id === data.provider);
                const provider = data.customProviders[index] || {};
                const updateProvider = (key, value) => {
                  const list = [...(data.customProviders || [])];
                  list[index] = { ...provider, [key]: value };
                  setData((prev) => ({ ...prev, customProviders: list }));
                };

                return (
                  <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100 space-y-3 relative">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => {
                          if (!window.confirm('确认删除该节点？')) return;
                          const nextList = (data.customProviders || []).filter(
                            (p) => p.id !== data.provider
                          );
                          setData((prev) => ({
                            ...prev,
                            customProviders: nextList,
                            provider: DEFAULT_PROVIDER,
                          }));
                        }}
                        className="w-8 h-8 rounded-full bg-red-50 text-red-400 hover:text-red-600"
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">节点名称</label>
                        <input
                          type="text"
                          className="w-full border rounded-xl p-2.5 text-sm"
                          placeholder="例如：个人专线"
                          value={provider.name || ''}
                          onChange={(e) => updateProvider('name', e.target.value)}
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">图标类名</label>
                        <input
                          type="text"
                          className="w-full border rounded-xl p-2.5 text-sm"
                          placeholder="fa-bolt"
                          value={provider.icon || ''}
                          onChange={(e) => updateProvider('icon', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">
                        接口地址 (Base URL)
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded-xl p-2.5 text-sm"
                        placeholder="https://api.openai.com/v1"
                        value={provider.baseUrl || ''}
                        onChange={(e) => updateProvider('baseUrl', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">
                        模型名称 (多个用逗号分隔)
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded-xl p-2.5 text-sm"
                        placeholder="gpt-4o-mini, gpt-4.1-mini"
                        value={provider.models || ''}
                        onChange={(e) => updateProvider('models', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">
                        API Key / 令牌
                      </label>
                      <input
                        type="password"
                        className="w-full border rounded-xl p-2.5 text-sm"
                        placeholder="sk-..."
                        value={provider.apiKey || ''}
                        onChange={(e) => updateProvider('apiKey', e.target.value)}
                      />
                    </div>
                  </div>
                );
              })()
            ) : (
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">通行密钥 (API Key)</label>
                <input
                  type="password"
                  className="w-full bg-gray-50 border rounded-xl p-3 text-sm"
                  placeholder="该供应商的 API Key"
                  value={data.apiKeys?.[data.provider] || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      apiKeys: { ...prev.apiKeys, [data.provider]: e.target.value },
                    }))
                  }
                />
              </div>
            )}

            <div className="flex justify-between items-center bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <div>
                <div className="text-sm font-bold text-amber-800">保存 API Key 到浏览器</div>
                <div className="text-xs text-amber-700 mt-1">关闭后仅保存节点配置，不保存密钥</div>
              </div>
              <input
                type="checkbox"
                checked={data.rememberApiKeys}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, rememberApiKeys: e.target.checked }))
                }
                className="w-5 h-5 accent-pink-500"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">翻译附加提示词（可选）</label>
              <textarea
                className="w-full bg-gray-50 border rounded-xl p-3 text-sm h-20"
                placeholder="例如：请使用敬语翻译..."
                value={data.customPrompt || ''}
                onChange={(e) => setData((prev) => ({ ...prev, customPrompt: e.target.value }))}
              />
            </div>
          </div>
        )}

        {tab === 'reply' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center bg-pink-50 p-4 rounded-xl border border-pink-100">
              <span className="font-bold text-pink-700">启用气囊回复建议</span>
              <input
                type="checkbox"
                checked={data.enableSmartReply}
                onChange={(e) => setData((prev) => ({ ...prev, enableSmartReply: e.target.checked }))}
                className="w-5 h-5 accent-pink-500"
              />
            </div>
            
            <div className={`space-y-4 ${!data.enableSmartReply ? 'opacity-50 pointer-events-none' : ''}`}>
              <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border">
                <i className="fas fa-info-circle mr-1" />
                提示：为了避免误触发，系统仅在“源语言”与“目标语言”不同时（即替你回复外语消息的场景）才会自动生成回复建议。
              </p>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">独立回复生成节点</label>
                <select
                  className="w-full bg-gray-50 border rounded-xl p-3 text-sm"
                  value={data.suggestionProvider}
                  onChange={(e) => setData((prev) => ({ ...prev, suggestionProvider: e.target.value }))}
                >
                  <optgroup label="内置节点">
                    {Object.values(PROVIDERS).map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </optgroup>
                  {!!data.customProviders?.length && (
                    <optgroup label="自定义节点">
                      {data.customProviders.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <p className="text-xs text-gray-400 mt-2">推荐为回复使用响应更快、发散性强的模型。</p>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">回复风格提示词覆盖 (可选)</label>
                <textarea
                  className="w-full bg-gray-50 border rounded-xl p-3 text-sm h-28 placeholder-gray-400"
                  placeholder="默认已包含：幽默、高情商、温柔、反问、撒娇。若填写此项，将附加给AI。例如：'要求充满00后网络流行语风格'"
                  value={data.suggestionCustomPrompt || ''}
                  onChange={(e) => setData((prev) => ({ ...prev, suggestionCustomPrompt: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        {tab === 'dict' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <label className="flex-1 bg-pink-50 text-pink-600 text-center py-2 rounded-xl text-sm font-bold cursor-pointer hover:bg-pink-100 transition-colors">
                导入 JSON
                <input type="file" accept=".json" hidden onChange={handleImportJSON} />
              </label>
              <button
                onClick={handleExportJSON}
                className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
              >
                导出 JSON
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-2 min-h-[200px] max-h-[300px] overflow-y-auto">
              {!dictList.length ? (
                <p className="text-center text-gray-400 mt-10 text-sm">暂无自定义词条</p>
              ) : (
                dictList.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-white p-2 rounded-lg mb-2 shadow-sm border"
                  >
                    <div className="text-xs overflow-hidden">
                      <div className="font-bold text-gray-700 truncate">{item.source}</div>
                      <div className="text-pink-500 truncate">{item.translation}</div>
                    </div>
                    <button
                      onClick={async () => {
                        await deleteUserDictEntry(item.id);
                        await loadDict();
                      }}
                      className="text-red-400 p-2"
                    >
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={async () => {
                if (!window.confirm('确认清空全部用户词典？')) return;
                await clearUserDict();
                await loadDict();
              }}
              className="w-full text-red-500 text-sm py-2 border border-red-100 rounded-xl font-bold hover:bg-red-50"
            >
              清空所有词典
            </button>
          </div>
        )}

        {tab === 'common' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold">开启回译</span>
              <input
                type="checkbox"
                checked={data.enableBackTranslation}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, enableBackTranslation: e.target.checked }))
                }
                className="w-5 h-5 accent-pink-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-bold">自动朗读</span>
              <input
                type="checkbox"
                checked={data.autoPlayTTS}
                onChange={(e) => setData((prev) => ({ ...prev, autoPlayTTS: e.target.checked }))}
                className="w-5 h-5 accent-pink-500"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-4">
              <div>
                <div className="text-sm font-bold flex justify-between mb-2">
                  <span>静默发送延迟</span>
                  <span className="text-pink-500">{Number(data.voiceAutoSendDelay) / 1000}s</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="3000"
                  step="100"
                  value={data.voiceAutoSendDelay}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      voiceAutoSendDelay: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-pink-500"
                />
              </div>

              <div className="border-t pt-4">
                <div className="text-sm font-bold flex justify-between mb-2">
                  <span>TTS 朗读语速</span>
                  <span className="text-pink-500">{Number(data.ttsSpeed || 1).toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={data.ttsSpeed || 1}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, ttsSpeed: Number(e.target.value) }))
                  }
                  className="w-full accent-pink-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 border-t">
        <button
          onClick={() => {
            onSave(data);
            onClose();
          }}
          className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          保存配置
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>

);
}

// 复合的双重模型选择下拉菜单
function ProviderSwitch({ settings, setSettings }) {
return (
<Menu as="div" className="relative">
<Menu.Button className="w-10 h-10 flex items-center justify-center text-pink-500 rounded-full hover:bg-pink-50 transition-colors shadow-sm bg-white/50">
<i className="fas fa-layer-group text-lg" />
</Menu.Button>
<Transition
as={Fragment}
enter="duration-150 ease-out"
enterFrom="opacity-0 scale-95"
enterTo="opacity-100 scale-100"
leave="duration-100 ease-in"
leaveFrom="opacity-100 scale-100"
leaveTo="opacity-0 scale-95"
>
<Menu.Items className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-2xl shadow-xl border overflow-hidden p-3 outline-none z-50">
<div className="text-[13px] text-gray-800 font-bold mb-3 border-b pb-2">快捷切换服务节点</div>

code
Code
download
content_copy
expand_less
<div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold text-gray-500 block mb-1">
            <i className="fas fa-language text-pink-400 mr-1" /> 主翻译引擎
          </label>
          <select
            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2 text-xs text-gray-700 outline-none"
            value={settings.provider}
            onChange={(e) => setSettings((prev) => ({ ...prev, provider: e.target.value }))}
          >
            <optgroup label="内置节点">
              {Object.values(PROVIDERS).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </optgroup>
            {!!settings.customProviders?.length && (
              <optgroup label="自定义节点">
                {settings.customProviders.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </optgroup>
            )}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-500 block mb-1">
            <i className="fas fa-lightbulb text-amber-400 mr-1" /> 回复建议嘴替
          </label>
          <select
            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2 text-xs text-gray-700 outline-none"
            value={settings.suggestionProvider}
            onChange={(e) => setSettings((prev) => ({ ...prev, suggestionProvider: e.target.value }))}
            disabled={!settings.enableSmartReply}
          >
            <optgroup label="内置节点">
              {Object.values(PROVIDERS).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </optgroup>
            {!!settings.customProviders?.length && (
              <optgroup label="自定义节点">
                {settings.customProviders.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </optgroup>
            )}
          </select>
          {!settings.enableSmartReply && (
            <div className="text-[10px] text-red-400 mt-1">请先在设置中启用气囊回复功能</div>
          )}
        </div>
      </div>
    </Menu.Items>
  </Transition>
</Menu>

);
}

// -----------------------------
// Main content
// -----------------------------
function AiChatContent() {
const { settings, setSettings, loaded } = usePersistentSettings();
const [sourceLang, setSourceLang] = useState(DEFAULT_SETTINGS.lastSourceLang);
const [targetLang, setTargetLang] = useState(DEFAULT_SETTINGS.lastTargetLang);
const [inputImages, setInputImages] = useState([]);
const [showSettings, setShowSettings] = useState(false);
const [showSrcPicker, setShowSrcPicker] = useState(false);
const [showTgtPicker, setShowTgtPicker] = useState(false);
const [inputValue, setInputValue] = useState('');

const fileInputRef = useRef(null);
const cameraInputRef = useRef(null);
const scrollRef = useRef(null);

const { playTTS } = useTTS();

useEffect(() => {
if (!loaded) return;
setSourceLang(settings.lastSourceLang || DEFAULT_SETTINGS.lastSourceLang);
setTargetLang(settings.lastTargetLang || DEFAULT_SETTINGS.lastTargetLang);
}, [loaded, settings.lastSourceLang, settings.lastTargetLang]);

const persistLangs = useCallback(
(src, tgt) => {
setSettings((prev) => ({
...prev,
lastSourceLang: src,
lastTargetLang: tgt,
}));
},
[setSettings]
);

const setSourceWithPersist = useCallback(
(value) => {
setSourceLang(value);
persistLangs(value, targetLang);
},
[persistLangs, targetLang]
);

const setTargetWithPersist = useCallback(
(value) => {
setTargetLang(value);
persistLangs(sourceLang, value);
},
[persistLangs, sourceLang]
);

const swapLanguages = useCallback(() => {
setSourceLang(targetLang);
setTargetLang(sourceLang);
persistLangs(targetLang, sourceLang);
}, [persistLangs, sourceLang, targetLang]);

const { history, isLoading, translate } = useTranslator({
settings,
sourceLang,
targetLang,
setSourceLang: setSourceWithPersist,
setTargetLang: setTargetWithPersist,
playTTS,
});

const {
isRecording,
displayValue: speechVal,
setManualValue: setSpeechVal,
hardResetBuffers,
startRecording,
stopRecording,
} = useSpeechInput({
sourceLang,
delayMs: settings.voiceAutoSendDelay,
onSend: (text) => {
translate({
text,
images: inputImages,
resetComposer: () => {
hardResetBuffers();
setInputValue('');
setInputImages([]);
},
});
},
});

const activeInputVal = isRecording ? speechVal : inputValue;

// 监听输入自动切换语言
useEffect(() => {
if (!activeInputVal.trim()) return;
const timer = setTimeout(() => {
const detected = detectLanguageLib(activeInputVal);
if (detected && detected !== sourceLang && detected === targetLang) {
swapLanguages();
}
}, 600);
return () => clearTimeout(timer);
}, [activeInputVal, sourceLang, targetLang, swapLanguages]);

const scrollToBottom = useCallback(() => {
setTimeout(() => {
if (!scrollRef.current) return;
scrollRef.current.scrollTo({
top: scrollRef.current.scrollHeight,
behavior: 'smooth',
});
}, 80);
}, []);

useEffect(() => {
scrollToBottom();
}, [history, isLoading, scrollToBottom]);

const handleTranslate = useCallback(
(textOverride = null) => {
const finalText = String(textOverride ?? activeInputVal).trim();
if (!finalText && inputImages.length === 0) return;

code
Code
download
content_copy
expand_less
translate({
    text: finalText,
    images: inputImages,
    resetComposer: () => {
      hardResetBuffers();
      setInputValue('');
      setInputImages([]);
    },
  });
},
[activeInputVal, hardResetBuffers, inputImages, translate]

);

const handleImageInput = useCallback(async (event) => {
const files = Array.from(event.target.files || []);
if (!files.length) return;

code
Code
download
content_copy
expand_less
try {
  const compressed = await Promise.all(files.map((file) => compressImage(file)));
  setInputImages((prev) => [...prev, ...compressed]);
} finally {
  event.target.value = '';
}

}, []);

if (!loaded) return null;

return (
<div className="flex flex-col w-full h-[100dvh] bg-gray-50 relative text-gray-800">
<GlobalStyles />

code
Code
download
content_copy
expand_less
{settings.chatBackgroundUrl && (
    <div
      className="absolute inset-0 bg-cover bg-center z-0 pointer-events-none"
      style={{
        backgroundImage: `url('${settings.chatBackgroundUrl}')`,
        opacity: 1 - settings.backgroundOverlay,
      }}
    />
  )}

  <div className="relative z-20 pt-[env(safe-area-inset-top)] bg-white/70 backdrop-blur-xl border-b border-gray-100/80 shadow-sm">
    <div className="flex justify-between h-16 px-4 items-center">
      <div className="w-9" />

      <div className="flex flex-col items-center justify-center select-none">
        <h1 className="font-bold text-gray-800 text-lg leading-tight tracking-wide">中缅语伴网</h1>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs font-semibold text-blue-600/90 tracking-wider">886.best</span>
        </div>
      </div>

      <button
        onClick={() => setShowSettings(true)}
        className="w-9 h-9 rounded-full bg-gray-50/80 text-gray-500 hover:bg-gray-200 hover:text-gray-700 active:scale-95 transition-all duration-200 flex items-center justify-center border border-gray-200/50 backdrop-blur-sm"
        aria-label="设置"
      >
        <i className="fas fa-cog" />
      </button>
    </div>
  </div>

  <div
    ref={scrollRef}
    className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-4 pt-4 pb-[220px] scroll-smooth"
  >
    <div className="w-full max-w-[600px] mx-auto min-h-full flex flex-col justify-end">
      {!history.length && !isLoading && (
        <div className="text-center text-gray-400 mb-20 opacity-80 mt-20">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            🌍
          </div>
          <div className="font-bold">886.best 中缅语伴网</div>
          <div className="text-xs mt-2 font-normal">打字自动识别语言切换 / 语音长按发送</div>
        </div>
      )}

      {history.map((item) => (
        <div key={item.id} className={`mb-6 ${item.role === 'user' ? 'flex justify-end' : ''}`}>
          {item.role === 'user' ? (
            <div className="flex flex-col items-end max-w-[85%]">
              {!!item.images?.length && (
                <div className="flex gap-2 mb-2 justify-end flex-wrap">
                  {item.images.map((img, index) => (
                    <img
                      loading="lazy"
                      key={`${item.id}_${index}`}
                      src={img}
                      className="w-24 h-24 object-cover rounded-xl border-2 shadow-sm"
                      alt=""
                    />
                  ))}
                </div>
              )}
              {!!item.text && (
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm text-[15px] shadow-md whitespace-pre-wrap break-words">
                  {item.text}
                </div>
              )}
            </div>
          ) : item.role === 'error' ? (
            <div className="bg-red-50 text-red-500 text-sm p-4 rounded-2xl text-center shadow-sm border border-red-100">
              <i className="fas fa-exclamation-circle mr-2" />
              {item.text}
            </div>
          ) : (
            <div className="w-full max-w-[95%]">
              {item.results.map((result, index) => (
                <TranslationCard
                  key={`${item.id}_${index}`}
                  data={result}
                  originalText={item.originalText}
                  srcLang={item.srcLang}
                  tgtLang={item.tgtLang}
                  providerMeta={index === 0 ? item.providerMeta : null}
                  onPlay={() => playTTS(result.translation, item.tgtLang, settings)}
                />
              ))}

              {/* 智能气囊回复 */}
              {item.loadingSuggestions ? (
                <div className="flex gap-2 mt-1 px-1 overflow-x-hidden">
                  <div className="h-9 w-24 bg-pink-50/70 rounded-2xl animate-pulse border border-pink-100/50" />
                  <div className="h-9 w-32 bg-pink-50/70 rounded-2xl animate-pulse border border-pink-100/50" />
                </div>
              ) : !!item.suggestions?.length && (
                <div className="flex gap-2 mt-1 px-1 overflow-x-auto no-scrollbar snap-x pb-2 items-center">
                  <div className="text-[10px] text-pink-400 font-bold shrink-0 flex items-center pr-1 pl-1">
                    <i className="fas fa-lightbulb mr-1" /> 回复<br/>建议
                  </div>
                  {item.suggestions.map((s, i) => (
                    <SuggestionBubble key={i} item={s} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start mb-6">
          <div className="bg-white/90 px-5 py-3 rounded-2xl shadow-sm text-pink-500 font-bold text-sm">
            <i className="fas fa-circle-notch fa-spin mr-2" />
            翻译中...
          </div>
        </div>
      )}
    </div>
  </div>

  <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white via-white/95 to-transparent pt-12 pb-[max(16px,env(safe-area-inset-bottom))]">
    <div className="w-full max-w-[600px] mx-auto px-4">
      <div className="flex justify-center mb-3">
        <div className="flex items-center bg-white/90 backdrop-blur-xl rounded-full p-1.5 border shadow-sm gap-1">
          <button
            onClick={() => setShowSrcPicker(true)}
            className="flex items-center gap-2 px-3 py-1 hover:bg-gray-50 rounded-full"
          >
            <span className="text-lg">{getLangFlag(sourceLang)}</span>
            <span className="text-[13px] font-bold">{getLangName(sourceLang)}</span>
          </button>

          <button onClick={swapLanguages} className="w-8 h-8 text-gray-400 hover:text-pink-500 bg-gray-50 rounded-full">
            <i className="fas fa-exchange-alt text-xs" />
          </button>

          <button
            onClick={() => setShowTgtPicker(true)}
            className="flex items-center gap-2 px-3 py-1 hover:bg-gray-50 rounded-full"
          >
            <span className="text-[13px] font-bold">{getLangName(targetLang)}</span>
            <span className="text-lg">{getLangFlag(targetLang)}</span>
          </button>

          <div className="w-px h-5 bg-gray-200 mx-1" />
          <ProviderSwitch settings={settings} setSettings={setSettings} />
        </div>
      </div>

      <div
        className={`relative flex items-end gap-2 bg-white border ${
          isRecording ? 'border-pink-400 ring-2 ring-pink-100' : 'shadow-lg border-gray-100'
        } rounded-[32px] p-2`}
      >
        <Menu as="div" className="relative">
          <Menu.Button className="w-11 h-11 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-full active:scale-95">
            <i className="fas fa-plus text-lg" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="duration-150"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="duration-100"
            leaveTo="opacity-0"
          >
            <Menu.Items className="absolute bottom-full left-0 mb-3 w-32 bg-white rounded-2xl shadow-xl border p-1.5 outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className={`flex w-full items-center px-4 py-3 text-sm font-bold rounded-xl ${
                      active ? 'bg-pink-50 text-pink-600' : ''
                    }`}
                  >
                    <i className="fas fa-camera w-6" /> 拍照
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex w-full items-center px-4 py-3 text-sm font-bold rounded-xl ${
                      active ? 'bg-pink-50 text-pink-600' : ''
                    }`}
                  >
                    <i className="fas fa-image w-6" /> 相册
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>

        <input type="file" ref={fileInputRef} accept="image/*" multiple hidden onChange={handleImageInput} />
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          hidden
          onChange={handleImageInput}
        />

        <div className="flex-1 flex flex-col justify-center min-h-[44px] py-1">
          {!!inputImages.length && (
            <div className="flex gap-2 overflow-x-auto mb-2 pl-1 slim-scrollbar">
              {inputImages.map((img, index) => (
                <div key={`${img.slice(0, 24)}_${index}`} className="relative shrink-0">
                  <img src={img} className="h-12 w-12 object-cover rounded-xl border shadow-sm" alt="" />
                  <button
                    onClick={() => setInputImages((prev) => prev.filter((_, i) => i !== index))}
                    className="absolute -top-1.5 -right-1.5 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            className="w-full bg-transparent border-none outline-none resize-none px-2 py-1.5 max-h-[120px] text-[16px] leading-relaxed no-scrollbar placeholder-gray-400"
            placeholder={isRecording ? '听你说，随时点击停止...' : '输入自动识别，可点击气囊复制'}
            rows={1}
            value={activeInputVal}
            onChange={(e) => {
              if (isRecording) setSpeechVal(e.target.value);
              else setInputValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTranslate();
              }
            }}
          />
        </div>

        <button
          onClick={() => {
            if (isRecording) {
              stopRecording();
              return;
            }
            if (activeInputVal.trim() || inputImages.length) {
              handleTranslate();
              return;
            }
            startRecording();
          }}
          className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-200'
              : activeInputVal.trim() || inputImages.length
              ? 'bg-pink-500 text-white active:scale-95 shadow-md shadow-pink-200'
              : 'bg-pink-50 text-pink-500 hover:bg-pink-100'
          }`}
        >
          <i
            className={`fas text-lg ${
              isRecording ? 'fa-stop' : activeInputVal.trim() || inputImages.length ? 'fa-arrow-up' : 'fa-microphone'
            }`}
          />
        </button>
      </div>
    </div>
  </div>

  <LanguagePicker
    title="源语言"
    open={showSrcPicker}
    onClose={() => setShowSrcPicker(false)}
    value={sourceLang}
    onChange={setSourceWithPersist}
  />
  <LanguagePicker
    title="目标语言"
    open={showTgtPicker}
    onClose={() => setShowTgtPicker(false)}
    value={targetLang}
    onChange={setTargetWithPersist}
  />
  {showSettings && <SettingsModal settings={settings} onSave={setSettings} onClose={() => setShowSettings(false)} />}
</div>

);
}

export default function AIChatWrapper(props) {
return (
<Transition show={props.isOpen} as={Fragment}>
<Dialog as="div" className="relative z-[9999]" onClose={props.onClose}>
<Transition.Child
as={Fragment}
enter="ease-out duration-300"
enterFrom="opacity-0"
enterTo="opacity-100"
leave="ease-in duration-200"
leaveFrom="opacity-100"
leaveTo="opacity-0"
>
<div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
</Transition.Child>

code
Code
download
content_copy
expand_less
<div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
        >
          <Dialog.Panel className="pointer-events-auto w-screen h-full">
            <AiChatContent />
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
  </Dialog>
</Transition>

);
}
