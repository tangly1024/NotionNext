import React, { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';

import { loadCheatDict, matchCheatExact } from '@/lib/cheatDict';
import { getApiConfig, PROVIDERS, DEFAULT_PROVIDER } from '@/data/ai-models';
import { saveToUserDict, matchFromUserDict, getAllUserDict, deleteUserDictEntry, clearUserDict } from '@/lib/userDict';

// -----------------------------
// Constants / Storage helpers
// -----------------------------
const SETTINGS_KEY = 'ai886_settings_v2';
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
  suggestionProvider: DEFAULT_PROVIDER,
  customProviders: [],
  customPrompt: '',
  ttsSpeed: 1.0,
  autoPlayTTS: false,
  backgroundOverlay: 0.9,
  chatBackgroundUrl: '',
  filterThinking: true,
  enableBackTranslation: false,
  enableSuggestions: true,
  suggestionTriggerLang: 'my-MM',
  lastSourceLang: 'zh-CN',
  lastTargetLang: 'my-MM',
  voiceAutoSendDelay: 1800,
  rememberApiKeys: true,
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

// -----------------------------
// Storage helpers
// -----------------------------
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

const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const getLangName = (code) => SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code;
const getLangFlag = (code) => SUPPORTED_LANGUAGES.find((l) => l.code === code)?.flag || '';

const sanitizeSettingsForSave = (settings) => {
  if (settings.rememberApiKeys) return settings;
  return {
    ...settings,
    apiKeys: {},
    customProviders: (settings.customProviders || []).map((p) => ({ ...p, apiKey: '' })),
  };
};

const playBeep = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 600;
    gain.gain.value = 0.08;
    osc.start();
    setTimeout(() => { try { osc.stop(); ctx.close(); } catch {} }, 120);
  } catch {}
};

// -----------------------------
// Image compression
// -----------------------------
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
          if (width > MAX_IMAGE_WIDTH) { height *= MAX_IMAGE_WIDTH / width; width = MAX_IMAGE_WIDTH; }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('canvas context unavailable');
          ctx.drawImage(image, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } catch (error) { reject(error); }
      };
      image.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  });

// -----------------------------
// Script detection
// -----------------------------
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
    if (a.slice(-len) === b.slice(0, len)) return a + b.slice(len);
  }
  return shouldInsertSpace(a, b) ? `${a} ${b}` : `${a}${b}`;
};
function usePersistentSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = storage.get(SETTINGS_KEY, null);
    if (!raw) { setLoaded(true); return; }
    try {
      const parsed = JSON.parse(raw);
      const normalized = {
        ...DEFAULT_SETTINGS,
        ...parsed,
        apiKeys: parsed?.apiKeys || {},
        customProviders: Array.isArray(parsed?.customProviders) ? parsed.customProviders : [],
      };
      if (!normalized.suggestionProvider) normalized.suggestionProvider = normalized.provider;
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
      if (firstItem?.url) try { URL.revokeObjectURL(firstItem.url); } catch {}
      cache.delete(firstKey);
    }
  }, []);

  const stop = useCallback(() => {
    const audio = activeAudioRef.current;
    if (!audio) return;
    try { audio.pause(); audio.currentTime = 0; } catch {}
    activeAudioRef.current = null;
  }, []);

  const play = useCallback(async (text, lang, settings) => {
    if (!text) return;
    const voiceMap = { 'zh-CN': 'zh-CN-XiaoyouNeural', 'en-US': 'en-US-JennyNeural', 'my-MM': 'my-MM-NilarNeural' };
    const voice = voiceMap[lang] || 'zh-CN-XiaoxiaoMultilingualNeural';
    const speed = Number(settings?.ttsSpeed) || 1.0;
    const key = `${voice}_${speed}_${text}`;
    try {
      stop();
      let item = cacheRef.current.get(key);
      if (!item) {
        const res = await fetch(`https://t.leftsite.cn/tts?t=${encodeURIComponent(text)}&v=${encodeURIComponent(voice)}&r=${Math.floor((speed-1)*50)}`);
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
  }, [stop, trimCache]);

  useEffect(() => () => {
    stop();
    cacheRef.current.forEach((item) => { if (item?.url) try { URL.revokeObjectURL(item.url); } catch {}; });
    cacheRef.current.clear();
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
    if (autoSendTimerRef.current) { clearTimeout(autoSendTimerRef.current); autoSendTimerRef.current = null; }
  }, []);

  const hardResetBuffers = useCallback(() => {
    finalTextRef.current = '';
    displayTextRef.current = '';
    hasAutoSentRef.current = false;
    setDisplayValue('');
  }, []);

  const stopRecognitionOnly = useCallback(() => { try { recognitionRef.current?.stop(); } catch {} setIsRecording(false); }, []);
  
  const stopAndSend = useCallback((forcedText) => {
    if (hasAutoSentRef.current) return;
    hasAutoSentRef.current = true;
    clearAutoTimer();
    stopRecognitionOnly();
    const finalText = String(forcedText ?? displayTextRef.current).trim();
    displayTextRef.current = '';
    finalTextRef.current = '';
    setDisplayValue('');
    if (finalText) onSend(finalText);
  }, [clearAutoTimer, onSend, stopRecognitionOnly]);

  const startRecording = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('当前浏览器不支持语音输入'); return; }
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
        if (event.results[i].isFinal) finalTextRef.current = mergeTranscript(finalTextRef.current, transcript);
        else interim = mergeTranscript(interim, transcript);
      }
      const nextDisplay = mergeTranscript(finalTextRef.current, interim);
      displayTextRef.current = nextDisplay;
      setDisplayValue(nextDisplay);
      clearAutoTimer();
      autoSendTimerRef.current = setTimeout(() => {
        if (displayTextRef.current.trim() && !hasAutoSentRef.current) stopAndSend(displayTextRef.current);
      }, delayMs);
    };
    recognition.onerror = () => { clearAutoTimer(); setIsRecording(false); };
    recognition.onend = () => { setIsRecording(false); clearAutoTimer(); if (!hasAutoSentRef.current && displayTextRef.current.trim()) stopAndSend(displayTextRef.current); };
    recognition.start();
  }, [clearAutoTimer, delayMs, hardResetBuffers, sourceLang, stopAndSend]);

  const stopRecording = useCallback(() => stopAndSend(displayTextRef.current), [stopAndSend]);
  const setManualValue = useCallback((value) => { finalTextRef.current = value; displayTextRef.current = value; setDisplayValue(value); }, []);

  useEffect(() => () => { clearAutoTimer(); try { recognitionRef.current?.stop(); } catch {}; }, [clearAutoTimer]);

  return { isRecording, displayValue, setManualValue, hardResetBuffers, startRecording, stopRecording };
        }
function useTranslator({ settings, sourceLang, targetLang, setSourceLang, setTargetLang, playTTS }) {
  const abortControllerRef = useRef(null);
  const suggestionAbortControllerRef = useRef(null);
  const currentRequestIdRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const appendHistory = useCallback((item) => {
    setHistory((prev) => [...prev, item].slice(-MAX_HISTORY));
  }, []);

  const updateHistoryItem = useCallback((id, updates) => {
    setHistory((prev) => prev.map((item) => item.id === id ? { ...item, ...updates } : item));
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
        models: String(customProvider.models || '').split(',').map(m => m.trim()).filter(Boolean),
        apiKey: customProvider.apiKey,
        preferJsonMode: false,
      };
    }
    const builtIn = getApiConfig({ apiKeys: settings.apiKeys, provider: providerId });
    return { ...builtIn, preferJsonMode: true };
  }, [settings]);

  const fetchAi = useCallback(async ({ messages, providerId, signal, preferJson = true }) => {
    const config = resolveProviderConfig(providerId);
    if (!config?.baseUrl || !config.models?.length) throw new Error('未正确配置 API 节点信息，请检查设置');

    const endpoint = config.baseUrl.endsWith('/chat/completions')
      ? config.baseUrl
      : `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;

    const orderedModels = reorderModelsByLastSuccess(config.provider, config.models);
    let lastError = '未知错误';

    for (const model of orderedModels) {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (config.apiKey) headers.Authorization = `Bearer ${config.apiKey}`;
        const body = { model, messages, temperature: 0 };
        if (config.preferJsonMode && preferJson) body.response_format = { type: 'json_object' };

        let response = await fetch(endpoint, { method: 'POST', headers, signal, body: JSON.stringify(body) });

        if (!response.ok && config.preferJsonMode && preferJson) {
          const clonedError = await response.clone().text().catch(() => '');
          if (/response_format|json_object|unsupported|invalid/i.test(clonedError)) {
            delete body.response_format;
            response = await fetch(endpoint, { method: 'POST', headers, signal, body: JSON.stringify(body) });
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
            try { message = (await response.text()) || message; } catch {}
          }
          throw new Error(message);
        }

        const data = await response.json();
        let content = data?.choices?.[0]?.message?.content || '';
        if (settings.filterThinking) content = String(content).replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        saveLastSuccessModel(config.provider, model);
        return { content, model, providerMeta: { name: config.name, icon: config.icon }, baseUrl: config.baseUrl };
      } catch (error) {
        lastError = error?.message || '未知错误';
        clearLastSuccessModel(config.provider, model);
        if (error?.name === 'AbortError') throw error;
      }
    }
    throw new Error(`节点请求全部失败：${lastError}`);
  }, [resolveProviderConfig, settings.filterThinking]);

  const fetchSuggestions = useCallback(async (translatedText, srcLang, tgtLang, reqId, currentHistory) => {
    if (!translatedText) return;
    suggestionAbortControllerRef.current?.abort();
    const controller = new AbortController();
    suggestionAbortControllerRef.current = controller;
    updateHistoryItem(`${reqId}_a`, { isSuggesting: true });

    try {
      const contextHistory = currentHistory.slice(-20).filter(h => h.role === 'ai' && h.originalText);
      let userContent = "";
      if (contextHistory.length > 0) {
        userContent += "【近期聊天上下文】\n";
        contextHistory.forEach(h => {
          const isOpponent = h.srcLang === settings.suggestionTriggerLang;
          const speaker = isOpponent ? "对方" : "我";
          const trans = h.results?.[0]?.translation || '';
          userContent += `${speaker}: ${h.originalText} (译: ${trans})\n`;
        });
        userContent += "\n";
      }
      userContent += `【对方最新消息】\n${translatedText}\n\n请根据以上语境给出回复建议。`;

      const messages = [
        { role: 'system', content: buildSuggestionInstruction(getLangName(srcLang), getLangName(tgtLang)) },
        { role: 'user', content: userContent },
      ];

      const result = await fetchAi({ messages, providerId: settings.suggestionProvider, signal: controller.signal, preferJson: false });
      let suggestions = [];
      try {
        const clean = result.content.replace(/```json/gi, '').replace(/```/g, '').trim();
        const start = clean.indexOf('[');
        const end = clean.lastIndexOf(']');
        if (start >= 0 && end > start) {
          const parsed = JSON.parse(clean.substring(start, end + 1));
          suggestions = parsed.map(item => typeof item === 'string' ? { display: item, copy: item } : item);
        }
      } catch {}

      if (Array.isArray(suggestions) && suggestions.length > 0) {
        updateHistoryItem(`${reqId}_a`, { suggestions: suggestions.slice(0, 3), isSuggesting: false });
      } else updateHistoryItem(`${reqId}_a`, { isSuggesting: false });
    } catch (error) {
      if (error?.name !== 'AbortError') updateHistoryItem(`${reqId}_a`, { isSuggesting: false });
    }
  }, [fetchAi, settings.suggestionProvider, settings.suggestionTriggerLang, updateHistoryItem]);

  const translate = useCallback(async ({ text, images = [], resetComposer }) => {
    const safeText = String(text || '').trim();
    if (!safeText && images.length === 0) return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const reqId = nowId();
    currentRequestIdRef.current = reqId;

    let currentSource = sourceLang;
    let currentTarget = targetLang;
    const detected = detectScript(safeText);
    if (detected && detected !== currentSource) {
      if (detected === currentTarget) { currentSource = currentTarget; currentTarget = sourceLang; }
      else currentSource = detected;
      setSourceLang(currentSource); setTargetLang(currentTarget);
    }

    const snapshotHistory = history;
    setIsLoading(true);
    appendHistory({ id: `${reqId}_u`, role: 'user', text: safeText, images, ts: Date.now() });
    resetComposer?.();

    const systemInstruction = buildSystemInstruction(settings.enableBackTranslation, getLangName(currentSource), getLangName(currentTarget), settings.customPrompt);
    const userContent = buildUserMsgContent(currentSource, currentTarget, safeText, images.length > 0);
    const messages = [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: images.length > 0 ? [{ type: 'text', text: userContent }, ...images.map(url => ({ type: 'image_url', image_url: { url } }))] : userContent },
    ];

    try {
      const aiMessage = { id: `${reqId}_a`, role: 'ai', results: [], ts: Date.now(), tgtLang: currentTarget, srcLang: currentSource, originalText: safeText, suggestions: [], isSuggesting: false };
      let dictHit = null, providerMeta = null;

      if (!images.length && safeText) {
        try { const cheatDict = await loadCheatDict(currentSource); if (cheatDict) { dictHit = await matchCheatExact(cheatDict, safeText, currentTarget); if (dictHit) providerMeta = { name: '★ 离线专业词库', icon: 'fa-book' }; } } catch {}
        if (!dictHit) { dictHit = await matchFromUserDict(currentSource, currentTarget, safeText); if (dictHit) providerMeta = { name: '✓ 我的词典', icon: 'fa-user-edit' }; }
      }

      if (dictHit?.length) aiMessage.results = normalizeTranslations(dictHit, settings.enableBackTranslation); else {
        const providerConfig = resolveProviderConfig(settings.provider);
        const cacheParams = { srcLang: currentSource, tgtLang: currentTarget, text: safeText, provider: settings.provider, baseUrl: providerConfig.baseUrl, modelHint: reorderModelsByLastSuccess(providerConfig.provider, providerConfig.models)[0] || '', enableBackTranslation: settings.enableBackTranslation, customPrompt: settings.customPrompt };
        const cached = !images.length ? getCachedAiResult(cacheParams) : null;
        if (cached) aiMessage.results = normalizeTranslations(cached.results, settings.enableBackTranslation), aiMessage.providerMeta = { name: '⚡ 缓存秒回', icon: 'fa-bolt' };
        else {
          const result = await fetchAi({ messages, providerId: settings.provider, signal: controller.signal });
          aiMessage.results = normalizeTranslations(result.content, settings.enableBackTranslation);
          aiMessage.providerMeta = result.providerMeta;
          if (safeText && !images.length && isCacheableTranslationResults(aiMessage.results)) setCachedAiResult({ ...cacheParams, baseUrl: result.baseUrl, modelHint: result.model }, { results: aiMessage.results, providerMeta: result.providerMeta });
        }
      }

      if (currentRequestIdRef.current === reqId) {
        appendHistory(aiMessage);
        if (settings.autoPlayTTS && isCacheableTranslationResults(aiMessage.results)) playTTS(aiMessage.results[0].translation, currentTarget, settings);
        if (settings.enableSuggestions && currentSource === settings.suggestionTriggerLang && isCacheableTranslationResults(aiMessage.results)) {
          fetchSuggestions(aiMessage.results[0].translation, currentSource, currentTarget, reqId, snapshotHistory);
        }
      }
    } catch (error) {
      if (error?.name !== 'AbortError' && currentRequestIdRef.current === reqId) {
        appendHistory({ id: `${reqId}_e`, role: 'error', text: error?.message || '翻译失败', ts: Date.now() });
      }
    } finally { if (currentRequestIdRef.current === reqId) setIsLoading(false); }
  }, [appendHistory, fetchAi, fetchSuggestions, history, playTTS, resolveProviderConfig, setSourceLang, setTargetLang, settings, sourceLang, targetLang]);

  useEffect(() => { return () => { abortControllerRef.current?.abort(); suggestionAbortControllerRef.current?.abort(); }; }, []);

  return { history, isLoading, translate, clearHistory: () => setHistory([]) };
       }
const SuggestionBubble = memo(function SuggestionBubble({ suggestion }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(suggestion.copy || suggestion.display); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch {}
  };
  return (
    <button onClick={handleCopy} className="relative bg-white/90 text-amber-600 border border-amber-100/80 px-3.5 py-2 rounded-2xl text-[14px] shadow-sm h-auto min-h-[36px] whitespace-pre-wrap break-words text-left active:scale-95 transition-all w-fit">
      {copied ? <span className="flex items-center gap-1.5 text-green-600 font-bold"><i className="fas fa-check" /> 已复制原文</span> : <span className="leading-tight">{suggestion.display}</span>}
    </button>
  );
});

const TranslationCard = memo(function TranslationCard({ data, onPlay, originalText, srcLang, tgtLang }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => { try { await navigator.clipboard.writeText(data.translation); setCopied(true); setTimeout(() => setCopied(false), 800); } catch {} };
  const handleEdit = async (event) => {
    event.stopPropagation();
    const nextTranslation = prompt('修改并保存到用户词典（之后将优先应用该翻译）：', data.translation);
    if (!nextTranslation?.trim() || nextTranslation.trim() === data.translation) return;
    await saveToUserDict(srcLang, tgtLang, originalText, nextTranslation.trim());
    alert('已保存到用户词典');
  };
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-sm transition-all relative group mb-3">
      {copied && <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-10 rounded-2xl pointer-events-none"><span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">已复制</span></div>}
      <div onClick={handleCopy} className="cursor-pointer active:scale-[0.99] transition-transform">
        <div className="text-[18px] leading-relaxed font-medium text-gray-800 break-words whitespace-pre-wrap">{data.translation}</div>
        {data.back_translation && <div className="mt-2 text-[13px] text-gray-400 break-words whitespace-pre-wrap">{data.back_translation}</div>}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100/60 flex justify-end gap-4">
        <button onClick={handleEdit} className="flex items-center text-[13px] text-gray-400 hover:text-blue-500 transition-colors" title="编辑并保存到用户词典"><i className="fas fa-edit mr-1.5" /> 加入词典</button>
        <button onClick={onPlay} className="flex items-center text-[13px] text-gray-400 hover:text-pink-500 transition-colors" title="朗读"><i className="fas fa-volume-up mr-1.5" /> 朗读</button>
      </div>
    </div>
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
              <button key={lang.code} onClick={() => { onChange(lang.code); onClose(); }} className={`p-4 rounded-2xl font-medium text-sm flex items-center ${value === lang.code ? 'bg-pink-50 text-pink-600 border-pink-200 border' : 'bg-gray-50 border border-transparent'}`}>
                <span className="text-xl mr-3">{lang.flag}</span>{lang.name}
              </button>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function ProviderSwitch({ settings, value, onChange, defaultIcon, buttonClass, activeClass }) {
  const currentIcon = useMemo(() => {
    if (String(value).startsWith('custom_')) {
      const currentCustom = (settings.customProviders || []).find((p) => p.id === value);
      return currentCustom?.icon || defaultIcon;
    }
    return PROVIDERS[value]?.icon || defaultIcon;
  }, [value, settings.customProviders, defaultIcon]);

  return (
    <Menu as="div" className="relative">
      <Menu.Button className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${buttonClass}`}><i className={`fas ${currentIcon} text-lg`} /></Menu.Button>
      <Transition as={Fragment} enter="duration-150 ease-out" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="duration-100 ease-in" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
        <Menu.Items className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-2xl shadow-xl border overflow-hidden p-1.5 outline-none max-h-64 overflow-y-auto slim-scrollbar">
          <div className="text-xs text-gray-400 font-bold px-3 py-1 mt-1">内置节点</div>
          {Object.values(PROVIDERS).map((provider) => (
            <Menu.Item key={provider.id}>{({ active }) => (
              <button onClick={() => onChange(provider.id)} className={`flex w-full items-center px-3 py-2.5 text-xs font-bold rounded-xl ${value === provider.id ? activeClass : active ? 'bg-gray-50' : ''}`}>
                <i className={`fas ${provider.icon} w-5 text-center`} /> {provider.name}
              </button>
            )}</Menu.Item>
          ))}
          {!!settings.customProviders?.length && <>
            <div className="text-xs text-gray-400 font-bold px-3 py-1 mt-2 border-t pt-2">自定义节点</div>
            {settings.customProviders.map((provider) => (
              <Menu.Item key={provider.id}>{({ active }) => (
                <button onClick={() => onChange(provider.id)} className={`flex w-full items-center px-3 py-2.5 text-xs font-bold rounded-xl ${value === provider.id ? activeClass : active ? 'bg-gray-50' : ''}`}>
                  <i className={`fas ${provider.icon || 'fa-robot'} w-5 text-center`} /> {provider.name}
                </button>
              )}</Menu.Item>
            ))}
          </>}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
function AiChatContent() {
  const { settings, setSettings, loaded } = usePersistentSettings();
  const [sourceLang, setSourceLang] = useState(DEFAULT_SETTINGS.lastSourceLang);
  const [targetLang, setTargetLang] = useState(DEFAULT_SETTINGS.lastTargetLang);
  const [inputImages, setInputImages] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showSrcPicker, setShowSrcPicker] = useState(false);
  const [showTgtPicker, setShowTgtPicker] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const scrollRef = useRef(null);
  const { playTTS } = useTTS();

  useEffect(() => {
    if (!loaded) return;
    setSourceLang(settings.lastSourceLang || DEFAULT_SETTINGS.lastSourceLang);
    setTargetLang(settings.lastTargetLang || DEFAULT_SETTINGS.lastTargetLang);
  }, [loaded, settings.lastSourceLang, settings.lastTargetLang]);

  const persistLangs = useCallback((src, tgt) => {
    setSettings(prev => ({ ...prev, lastSourceLang: src, lastTargetLang: tgt }));
  }, [setSettings]);

  const setSourceWithPersist = useCallback((value) => { setSourceLang(value); persistLangs(value, targetLang); }, [persistLangs, targetLang]);
  const setTargetWithPersist = useCallback((value) => { setTargetLang(value); persistLangs(sourceLang, value); }, [persistLangs, sourceLang]);

  const { history, isLoading, translate } = useTranslator({ settings, sourceLang, targetLang, setSourceLang: setSourceWithPersist, setTargetLang: setTargetWithPersist, playTTS });

  const { isRecording, displayValue: inputVal, setManualValue, hardResetBuffers, startRecording, stopRecording } = useSpeechInput({
    sourceLang,
    delayMs: settings.voiceAutoSendDelay,
    onSend: (text) => {
      translate({ text, images: inputImages, resetComposer: () => { hardResetBuffers(); setInputImages([]); } });
    }
  });

  const scrollToBottom = useCallback(() => {
    setTimeout(() => { if (!scrollRef.current) return; scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, 80);
  }, []);

  useEffect(() => { scrollToBottom(); }, [history, isLoading, scrollToBottom]);

  const handleTranslate = useCallback((textOverride = null) => {
    const finalText = String(textOverride ?? inputVal).trim();
    if (!finalText && inputImages.length === 0) return;
    translate({ text: finalText, images: inputImages, resetComposer: () => { hardResetBuffers(); setInputImages([]); } });
  }, [hardResetBuffers, inputImages, inputVal, translate]);

  const handleImageInput = useCallback(async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    try { const compressed = await Promise.all(files.map(file => compressImage(file))); setInputImages(prev => [...prev, ...compressed]); } finally { event.target.value = ''; }
  }, []);

  const swapLanguages = useCallback(() => { setSourceLang(targetLang); setTargetLang(sourceLang); persistLangs(targetLang, sourceLang); }, [persistLangs, sourceLang, targetLang]);

  if (!loaded) return null;

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-gray-50 relative text-gray-800">
      <GlobalStyles />
      {settings.chatBackgroundUrl && <div className="absolute inset-0 bg-cover bg-center z-0 pointer-events-none" style={{ backgroundImage: `url('${settings.chatBackgroundUrl}')`, opacity: 1 - settings.backgroundOverlay }} />}
      <div className="relative z-20 pt-[env(safe-area-inset-top)] bg-white/70 backdrop-blur-xl border-b border-gray-100/80 shadow-sm">
        <div className="flex justify-between h-16 px-4 items-center">
          <div className="w-9" />
          <div className="flex flex-col items-center justify-center select-none">
            <h1 className="font-bold text-gray-800 text-lg leading-tight tracking-wide">中缅语伴网</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <svg className="w-4 h-4 text-blue-500 drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21a9.05 9.05 0 1 0 0-18 9.05 9.05 0 0 0 0 18zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className="text-xs font-semibold text-blue-600/90 tracking-wider">886.best</span>
            </div>
          </div>
          <button onClick={() => setShowSettings(true)} className="w-9 h-9 rounded-full bg-gray-50/80 text-gray-500 hover:bg-gray-200 hover:text-gray-700 active:scale-95 transition-all flex items-center justify-center border border-gray-200/50 backdrop-blur-sm" aria-label="设置">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-4 pt-4 pb-[180px] scroll-smooth">
        <div className="w-full max-w-[600px] mx-auto min-h-full flex flex-col justify-end">
          {!history.length && !isLoading && (
            <div className="text-center text-gray-400 mb-20 opacity-80 mt-20">
              <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🌍</div>
              <div className="font-bold">886.best 中缅语伴网</div>
            </div>
          )}

          {history.map((item) => (
            <div key={item.id} className={`mb-6 ${item.role === 'user' ? 'flex justify-end' : ''}`}>
              {item.role === 'user' ? (
                <div className="flex flex-col items-end max-w-[85%]">
                  {!!item.images?.length && <div className="flex gap-2 mb-2 justify-end flex-wrap">{item.images.map((img, index) => (<img loading="lazy" key={`${item.id}_${index}`} src={img} className="w-24 h-24 object-cover rounded-xl border-2 shadow-sm" alt="" />))}</div>}
                  {!!item.text && <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm text-[15px] shadow-md whitespace-pre-wrap break-words">{item.text}</div>}
                </div>
              ) : item.role === 'error' ? (
                <div className="bg-red-50 text-red-500 text-sm p-4 rounded-2xl text-center shadow-sm border border-red-100"><i className="fas fa-exclamation-circle mr-2" />{item.text}</div>
              ) : (
                <div className="w-full">
                  {item.providerMeta && <div className="text-[10px] text-gray-400 mb-2 ml-2 font-bold flex items-center gap-1.5"><i className={`fas ${item.providerMeta.icon} text-pink-400`} />{item.providerMeta.name}</div>}
                  {item.results.map((result, index) => (<TranslationCard key={`${item.id}_${index}`} data={result} originalText={item.originalText} srcLang={item.srcLang} tgtLang={item.tgtLang} onPlay={() => playTTS(result.translation, item.tgtLang, settings)} />))}
                  {(item.isSuggesting || (item.suggestions && item.suggestions.length > 0)) && <div className="ml-2 mt-2">{item.isSuggesting ? <div className="text-xs text-amber-500 flex items-center gap-2 font-bold"><i className="fas fa-circle-notch fa-spin" /> 正在生成回复建议...</div> : <div className="flex flex-wrap gap-2">{item.suggestions.map((sug, idx) => <SuggestionBubble key={idx} suggestion={sug} />)}</div>}</div>}
                </div>
              )}
            </div>
          ))}

          {isLoading && <div className="flex justify-start mb-6"><div className="bg-white/90 px-5 py-3 rounded-2xl shadow-sm text-pink-500 font-bold text-sm"><i className="fas fa-circle-notch fa-spin mr-2" />翻译中...</div></div>}
        </div>
      </div>

      {/* 底部输入框 + 图片 + 语言 + 模型 */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white via-white/95 to-transparent pt-12 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-[600px] mx-auto px-4">
          <div className="flex justify-center mb-3">
            <div className="flex items-center bg-white/80 backdrop-blur-xl rounded-full p-1 border shadow-sm">
              <button onClick={() => setShowSrcPicker(true)} className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-50 rounded-full"><span className="text-lg">{getLangFlag(sourceLang)}</span><span className="text-xs font-bold">{getLangName(sourceLang)}</span></button>
              <button onClick={swapLanguages} className="w-8 h-8 text-gray-400 hover:text-pink-500"><i className="fas fa-exchange-alt text-xs" /></button>
              <button onClick={() => setShowTgtPicker(true)} className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-50 rounded-full"><span className="text-lg">{getLangFlag(targetLang)}</span><span className="text-xs font-bold">{getLangName(targetLang)}</span></button>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <ProviderSwitch settings={settings} value={settings.provider} onChange={val => setSettings(prev => ({ ...prev, provider: val }))} defaultIcon="fa-robot" buttonClass="text-pink-500 hover:bg-pink-50" activeClass="bg-pink-50 text-pink-600" />
              {settings.enableSuggestions && <ProviderSwitch settings={settings} value={settings.suggestionProvider} onChange={val => setSettings(prev => ({ ...prev, suggestionProvider: val }))} defaultIcon="fa-lightbulb" buttonClass="text-amber-500 hover:bg-amber-50 ml-0.5" activeClass="bg-amber-50 text-amber-600" />}
            </div>
          </div>

          <div className={`relative flex items-end gap-2 bg-white border ${isRecording ? 'border-pink-400 ring-2 ring-pink-100' : 'shadow-md'} rounded-[32px] p-2`}>
            <Menu as="div" className="relative">
              <Menu.Button className="w-11 h-11 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-full active:scale-95"><i className="fas fa-plus text-lg" /></Menu.Button>
              <Transition as={Fragment} enter="duration-150" enterFrom="opacity-0 translate-y-2" enterTo="opacity-100 translate-y-0" leave="duration-100" leaveTo="opacity-0">
                <Menu.Items className="absolute bottom-full left-0 mb-3 w-32 bg-white rounded-2xl shadow-xl border p-1.5 outline-none">
                  <Menu.Item>{({ active }) => (<button onClick={() => cameraInputRef.current?.click()} className={`flex w-full items-center px-4 py-3 text-sm font-bold rounded-xl ${active ? 'bg-pink-50 text-pink-600' : ''}`}><i className="fas fa-camera w-6" /> 拍照</button>)}</Menu.Item>
                  <Menu.Item>{({ active }) => (<button onClick={() => fileInputRef.current?.click()} className={`flex w-full items-center px-4 py-3 text-sm font-bold rounded-xl ${active ? 'bg-pink-50 text-pink-600' : ''}`}><i className="fas fa-image w-6" /> 相册</button>)}</Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>

            <input type="file" ref={fileInputRef} accept="image/*" multiple hidden onChange={handleImageInput} />
            <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" hidden onChange={handleImageInput} />

            <div className="flex-1 flex flex-col justify-center min-h-[44px] py-1">
              {!!inputImages.length && <div className="flex gap-2 overflow-x-auto mb-2 pl-1 slim-scrollbar">{inputImages.map((img, index) => (<div key={`${img.slice(0,24)}_${index}`} className="relative shrink-0"><img src={img} className="h-12 w-12 object-cover rounded-xl border shadow-sm" alt="" /><button onClick={() => setInputImages(prev => prev.filter((_, i) => i !== index))} className="absolute -top-1.5 -right-1.5 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"><i className="fas fa-times" /></button></div>))}</div>}
              <textarea className="w-full bg-transparent border-none outline-none resize-none px-2 py-1.5 max-h-[120px] text-[16px] leading-relaxed no-scrollbar placeholder-gray-400" placeholder={isRecording ? '听你说，随时点击停止...' : '输入翻译内容...'} rows={1} value={inputVal} onChange={e => setManualValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTranslate(); } }} />
            </div>

            <button onClick={() => { if (isRecording) { stopRecording(); return; } if (inputVal.trim() || inputImages.length) { handleTranslate(); return; } startRecording(); }} className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : inputVal.trim() || inputImages.length ? 'bg-pink-500 text-white active:scale-95' : 'bg-pink-50 text-pink-500 hover:bg-pink-100'}`}><i className={`fas text-lg ${isRecording ? 'fa-stop' : inputVal.trim() || inputImages.length ? 'fa-arrow-up' : 'fa-microphone'}`} /></button>
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
{showSettings && (
  <SettingsModal
    settings={settings}
    onSave={setSettings}
    onClose={() => setShowSettings(false)}
  />
)}
</div>
);
}

export default function AIChatWrapper(props) {
  return (
    <Transition show={props.isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[9999]"
        onClose={props.onClose}
      >
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
