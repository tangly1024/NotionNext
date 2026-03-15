'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  FaVolumeUp,
  FaCheck,
  FaTimes,
  FaArrowRight,
  FaSpinner,
  FaRobot,
  FaCog,
  FaArrowLeft,
  FaMicrophone,
  FaKeyboard,
  FaPaperPlane,
  FaStop,
  FaClosedCaptioning,
  FaCommentSlash
} from 'react-icons/fa';
import { pinyin } from 'pinyin-pro';
import { ttsEngine } from '../../ai/ttsEngine'; // 确保路径正确
import { normalizeAssistantText, mergeTranscript, nowId, splitSpeakable } from '../../ai/aiTextUtils'; // 确保路径正确
import { RECOGNITION_LANGS, AI_REC_LANG_KEY } from '../../ai/aiConfig'; // 确保路径正确
import { PROMPT_REGISTRY, buildInteractiveBootstrapPrompt } from '../../ai/aiPrompts'; // 确保路径正确

// =================================================================================
// 1. IndexedDB 缓存引擎 (修复重复初始化消耗性能的问题)
// =================================================================================
const idb = {
  db: null,
  initPromise: null,
  async init() {
    if (typeof window === 'undefined') return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve) => {
      const request = indexedDB.open('LessonCacheDB', 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('tts_audio')) {
          db.createObjectStore('tts_audio');
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve();
      };
      request.onerror = () => resolve();
    });
    return this.initPromise;
  },
  async get(key) {
    await this.init();
    if (!this.db) return null;
    return new Promise((resolve) => {
      const tx = this.db.transaction('tts_audio', 'readonly');
      const req = tx.objectStore('tts_audio').get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  },
  async set(key, blob) {
    await this.init();
    if (!this.db) return;
    try {
      const tx = this.db.transaction('tts_audio', 'readwrite');
      tx.objectStore('tts_audio').put(blob, key);
    } catch (_) {}
  }
};

// =================================================================================
// 2. 音效与通用配置
// =================================================================================
function vibrate(pattern) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
}

function playBeep(type = 'tap') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);

    let frequency = 520, duration = 0.06, volume = 0.03;
    if (type === 'correct') { frequency = 760; duration = 0.1; volume = 0.045; }
    else if (type === 'wrong') { frequency = 220; duration = 0.12; volume = 0.05; }

    osc.type = 'sine'; osc.frequency.value = frequency; gain.gain.value = volume;
    osc.start(); osc.stop(ctx.currentTime + duration);
    osc.onended = () => { try { ctx.close(); } catch (_) {} };
  } catch (_) {}
}

const PREFS_STORAGE_KEY = 'quiz_choice_prefs_v5';
const AI_STORAGE_KEY = 'interactive_ai_settings_v5';
const RATE_MAP = { slow: -30, normal: 0, fast: 20 };

const ZH_VOICE_OPTIONS = [
  { id: 'zh-CN-XiaoxiaoMultilingualNeural', name: '晓晓多语言 (女)' },
  { id: 'zh-CN-XiaochenMultilingualNeural', name: '晓辰多语言 (男)' },
  { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓标准' },
  { id: 'zh-CN-YunxiNeural', name: '云希' }
];

const MY_VOICE_OPTIONS = [
  { id: 'my-MM-NilarNeural', name: 'Nilar (女)' },
  { id: 'my-MM-ThihaNeural', name: 'Thiha (男)' }
];

const DEFAULT_PREFS = { showQuestionPinyin: true, showOptionPinyin: true, autoPlay: true, rateMode: 'normal' };

// 修复默认配置不统一的问题
const DEFAULT_AI_SETTINGS = {
  apiUrl: 'https://api.mistral.ai/v1',
  apiKey: 'xLnM3QMeVS1XoIG9LcdJUmzYLExYLvAq',
  model: 'mistral-large-2512',
  temperature: 0.2,
  systemPrompt: '你是一位互动题解析老师。请根据题目、选项、学生答案和正确答案，用简洁中文解释为什么对或错。不要太长，不要输出 Markdown。',
  ttsApiUrl: 'https://t.leftsite.cn/tts',
  zhVoice: 'zh-CN-XiaoxiaoMultilingualNeural',
  myVoice: 'my-MM-NilarNeural',
  ttsSpeed: -20,
  ttsPitch: 0,
  soundFx: true,
  vibration: true,
  asrSilenceMs: 1500,
  showText: true
};

function getSavedPrefs() {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try { const raw = localStorage.getItem(PREFS_STORAGE_KEY); return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS; } catch { return DEFAULT_PREFS; }
}

function getSavedAISettings() {
  if (typeof window === 'undefined') return DEFAULT_AI_SETTINGS;
  try { const raw = localStorage.getItem(AI_STORAGE_KEY); return raw ? { ...DEFAULT_AI_SETTINGS, ...JSON.parse(raw) } : DEFAULT_AI_SETTINGS; } catch { return DEFAULT_AI_SETTINGS; }
}

const toFinite = (v, fallback = 0) => { const n = Number(v); return Number.isFinite(n) ? n : fallback; };

// =================================================================================
// 3. TTS 文本工具与播放引擎
// =================================================================================
const TTS_VOICES = { zh: 'zh-CN-XiaoxiaoMultilingualNeural', my: 'my-MM-NilarNeural', en: 'en-US-JennyNeural' };

function splitMixedText(text = '') {
  const segments = []; let currentText = ''; let currentLang = null;
  for (const ch of Array.from(text)) {
    let lang = null;
    if (/[\u4e00-\u9fff]/.test(ch)) lang = 'zh';
    else if (/[\u1000-\u109F]/.test(ch)) lang = 'my';
    else if (/[a-zA-Z0-9]/.test(ch)) lang = 'en';
    else { currentText += ch; continue; }

    if (!currentLang) { currentLang = lang; currentText += ch; continue; }
    if (lang === currentLang) currentText += ch;
    else {
      if (currentText.trim()) segments.push({ text: currentText.trim(), lang: currentLang });
      currentLang = lang; currentText = ch;
    }
  }
  if (currentText.trim()) segments.push({ text: currentText.trim(), lang: currentLang || 'zh' });
  return segments.length ? segments : [{ text: text.trim(), lang: 'zh' }];
}

async function getTTSBlob(text, voice, rate = 0, apiUrl) {
  const cacheKey = `${apiUrl}-${voice}-${rate}-${text}`;
  let blob = await idb.get(cacheKey);
  if (!blob) {
    const res = await fetch(`${apiUrl}?t=${encodeURIComponent(text)}&v=${voice}&r=${rate}`);
    if (!res.ok) throw new Error('TTS Failed');
    blob = await res.blob();
    await idb.set(cacheKey, blob);
  }
  return blob;
}

const audioController = {
  currentAudio: null, latestRequestId: 0, activeUrls: [],
  stop() {
    this.latestRequestId++;
    if (this.currentAudio) { try { this.currentAudio.pause(); this.currentAudio.currentTime = 0; } catch (_) {} this.currentAudio.onended = null; this.currentAudio.onerror = null; this.currentAudio = null; }
    this.activeUrls.forEach((url) => { try { URL.revokeObjectURL(url); } catch (_) {} });
    this.activeUrls = [];
  },
  async playMixed(text, { rate = 0, aiSettings = null } = {}, onStart, onEnd) {
    this.stop();
    const raw = String(text || '').trim();
    if (!raw) return onEnd?.();
    const reqId = this.latestRequestId;
    onStart?.();

    try {
      const segments = splitMixedText(raw);
      const audios = [];
      for (const seg of segments) {
        if (reqId !== this.latestRequestId) return;
        const voice = seg.lang === 'my' ? (aiSettings?.myVoice || TTS_VOICES.my) : seg.lang === 'en' ? TTS_VOICES.en : (aiSettings?.zhVoice || TTS_VOICES.zh);
        const blob = await getTTSBlob(seg.text, voice, rate, aiSettings?.ttsApiUrl || 'https://t.leftsite.cn/tts');
        if (reqId !== this.latestRequestId) return;
        const url = URL.createObjectURL(blob);
        this.activeUrls.push(url);
        audios.push(new Audio(url));
      }
      if (reqId !== this.latestRequestId) return;
      if (!audios.length) return onEnd?.();

      const playNext = (index) => {
        if (reqId !== this.latestRequestId) return;
        if (index >= audios.length) return onEnd?.();
        this.currentAudio = audios[index];
        this.currentAudio.onended = () => playNext(index + 1);
        this.currentAudio.onerror = () => playNext(index + 1);
        this.currentAudio.play().catch(() => playNext(index + 1));
      };
      playNext(0);
    } catch (e) { if (reqId === this.latestRequestId) onEnd?.(); }
  }
};

// =================================================================================
// 4. 局部组件 (AI 核心逻辑与全屏设置面板)
// =================================================================================

function useInteractiveAITutor({ open, settings, initialPayload = null, onClose }) {
  const [history, setHistory] = useState([]);
  const historyRef = useRef([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [textMode, setTextMode] = useState(true);
  const [inputText, setInputText] = useState('');
  
  const [isRecording, setIsRecording] = useState(false);
  const [recLang, setRecLang] = useState('zh-CN');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showText, setShowText] = useState(settings?.showText ?? true);

  const scrollRef = useRef(null);
  const abortControllerRef = useRef(null);
  const recognitionRef = useRef(null);

  const finalTextRef = useRef('');
  const speechDisplayRef = useRef('');
  const autoSendTimerRef = useRef(null);
  const hasAutoSentRef = useRef(false);

  const sendLockRef = useRef(false);
  const requestIdRef = useRef(0);
  const bootstrappedRef = useRef(false);
  const initialPayloadRef = useRef(initialPayload);

  const currentLangObj = RECOGNITION_LANGS.find((l) => l.code === recLang) || RECOGNITION_LANGS[0];

  const initialSystemPrompt = useMemo(() => settings?.systemPrompt || PROMPT_REGISTRY.interactive_tutor_default, [settings]);

  useEffect(() => { try { const lang = localStorage.getItem(AI_REC_LANG_KEY); if (lang && RECOGNITION_LANGS.some((l) => l.code === lang)) setRecLang(lang); } catch {} }, []);
  useEffect(() => { localStorage.setItem(AI_REC_LANG_KEY, recLang); }, [recLang]);
  useEffect(() => { initialPayloadRef.current = initialPayload; }, [initialPayload]);

  const scrollToBottom = () => { if (scrollRef.current) setTimeout(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, 40); };

  const stopEverything = () => {
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} recognitionRef.current = null; }
    if (autoSendTimerRef.current) { clearTimeout(autoSendTimerRef.current); autoSendTimerRef.current = null; }
    setIsRecording(false);
    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; }
    ttsEngine.stopAndClear(); setIsThinking(false); setIsAiSpeaking(false);
  };

  const stopAndSend = (textToForce) => {
    if (hasAutoSentRef.current) return;
    hasAutoSentRef.current = true;
    if (autoSendTimerRef.current) { clearTimeout(autoSendTimerRef.current); autoSendTimerRef.current = null; }
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} recognitionRef.current = null; }
    setIsRecording(false);

    const finalStr = String(textToForce !== undefined ? textToForce : speechDisplayRef.current).trim();
    speechDisplayRef.current = ''; finalTextRef.current = ''; setInputText('');
    if (finalStr) sendMessage(finalStr);
  };

  const runAIRequest = async ({ content, visibleUserMessage = true }) => {
    const text = String(content || '').trim();
    if (!text) return;
    if (sendLockRef.current) { if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; } ttsEngine.stopAndClear(); }
    sendLockRef.current = true;
    
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} recognitionRef.current = null; }
    setIsRecording(false);
    ttsEngine.unlockAudio(); ttsEngine.stopAndClear();

    const currentRequestId = ++requestIdRef.current;
    setIsThinking(true);
    let newHistory = [...historyRef.current];
    if (visibleUserMessage) newHistory.push({ id: nowId(), role: 'user', text });

    const aiMsgId = nowId();
    setHistory([...newHistory, { id: aiMsgId, role: 'ai', text: '', isStreaming: true }]);
    scrollToBottom();

    const controller = new AbortController(); abortControllerRef.current = controller;

    try {
      const cleanedHistory = newHistory.filter((h) => !(h.role === 'error' || !String(h.text || '').trim()));
      const messages = [
        { role: 'system', content: initialSystemPrompt },
        ...cleanedHistory.map((h) => ({ role: h.role === 'ai' ? 'assistant' : 'user', content: String(h.text || '').trim() })),
        ...(visibleUserMessage ? [] : [{ role: 'user', content: text }])
      ];

      const res = await fetch(`${String(settings?.apiUrl || '').replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings?.apiKey || ''}` },
        signal: controller.signal, body: JSON.stringify({ model: settings?.model, temperature: settings?.temperature, stream: true, messages })
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      if (!res.body) throw new Error('API 返回为空');

      const reader = res.body.getReader(); const decoder = new TextDecoder('utf-8');
      let raw = ''; let fullText = ''; let sentenceBuffer = ''; let gotFirstChunk = false;

      while (true) {
        if (controller.signal.aborted || currentRequestId !== requestIdRef.current) break;
        const { done, value } = await reader.read();
        if (done) break;

        raw += decoder.decode(value, { stream: true });
        const parts = raw.split('\n'); raw = parts.pop() || '';

        for (const line of parts) {
          if (controller.signal.aborted || currentRequestId !== requestIdRef.current) break;
          const ln = line.trim();
          if (!ln.startsWith('data:')) continue;
          const payload = ln.slice(5).trim();
          if (!payload || payload === '[DONE]') continue;

          try {
            const data = JSON.parse(payload);
            const chunk = data?.choices?.[0]?.delta?.content || data?.choices?.[0]?.message?.content || '';
            if (!chunk) continue;

            if (!gotFirstChunk) { if (currentRequestId === requestIdRef.current) setIsThinking(false); gotFirstChunk = true; }
            fullText += chunk; sentenceBuffer += chunk;
            const visible = normalizeAssistantText(fullText);

            if (currentRequestId === requestIdRef.current) {
              setHistory((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, text: visible } : m)));
              scrollToBottom();
            }

            const { sentences, rest } = splitSpeakable(sentenceBuffer);
            if (sentences.length) {
              for (const s of sentences) if (!controller.signal.aborted && currentRequestId === requestIdRef.current) ttsEngine.push(s);
              sentenceBuffer = rest;
            }
          } catch (_) {}
        }
      }
      if (sentenceBuffer.trim() && !controller.signal.aborted && currentRequestId === requestIdRef.current) ttsEngine.push(sentenceBuffer.trim());
    } catch (err) {
      if (err?.name !== 'AbortError' && currentRequestId === requestIdRef.current) {
        setHistory((prev) => [...prev.filter((m) => m.id !== aiMsgId), { id: nowId(), role: 'error', text: err?.message || 'AI 请求失败' }]);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsThinking(false); abortControllerRef.current = null;
        setHistory((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m)).filter((m) => !(m.id === aiMsgId && !String(m.text || '').trim())));
      }
      sendLockRef.current = false;
    }
  };

  const sendMessage = async (text) => { const content = String(text || '').trim(); if (!content) return; await runAIRequest({ content, visibleUserMessage: true }); };
  const sendHiddenMessage = async (text) => { const content = String(text || '').trim(); if (!content) return; await runAIRequest({ content, visibleUserMessage: false }); };

  const startRecording = () => {
    ttsEngine.unlockAudio();
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return alert('当前浏览器不支持语音识别');

    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; setIsThinking(false); }
    if (isAiSpeaking) ttsEngine.stopAndClear();
    if (recognitionRef.current) return;

    const rec = new SpeechRec();
    rec.lang = recLang; rec.interimResults = true; rec.continuous = true; rec.maxAlternatives = 1;

    setInputText(''); finalTextRef.current = ''; speechDisplayRef.current = ''; hasAutoSentRef.current = false; setIsRecording(true);

    rec.onresult = (e) => {
      let interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0]?.transcript || '';
        if (e.results[i].isFinal) finalTextRef.current = mergeTranscript(finalTextRef.current, transcript);
        else interimText += transcript;
      }
      const currentDisplay = mergeTranscript(finalTextRef.current, interimText);
      speechDisplayRef.current = currentDisplay; setInputText(currentDisplay);

      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = setTimeout(() => {
        if (speechDisplayRef.current.trim() && !hasAutoSentRef.current) stopAndSend(speechDisplayRef.current);
      }, toFinite(settings?.asrSilenceMs, 1500));
    };

    rec.onerror = () => { setIsRecording(false); recognitionRef.current = null; };
    rec.onend = () => { setIsRecording(false); recognitionRef.current = null; if (!hasAutoSentRef.current && speechDisplayRef.current.trim()) stopAndSend(speechDisplayRef.current); };
    recognitionRef.current = rec;
    if (navigator.vibrate) navigator.vibrate(30);
    try { rec.start(); } catch (_) {}
  };

  const replaySpecificAnswer = (text) => { if (!text) return; ttsEngine.stopAndClear(); ttsEngine.push(text); };

  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { ttsEngine.setStateCallback(({ isPlaying }) => setIsAiSpeaking(isPlaying)); return () => ttsEngine.setStateCallback(null); }, []);

  // 严格的历史记录拦截，由外部控制
  useEffect(() => {
    if (!open) { stopEverything(); setHistory([]); bootstrappedRef.current = false; }
    else if (!bootstrappedRef.current) {
      const firstPrompt = buildInteractiveBootstrapPrompt(initialPayloadRef.current);
      if (firstPrompt) { bootstrappedRef.current = true; sendHiddenMessage(firstPrompt); }
    }
  }, [open]);

  useEffect(() => { return () => stopEverything(); }, []);

  return {
    history, isThinking, isAiSpeaking, textMode, setTextMode, inputText, setInputText,
    isRecording, currentLangObj, scrollRef, sendMessage, startRecording, stopAndSend,
    stopEverything, replaySpecificAnswer, recLang, setRecLang, showLangPicker, setShowLangPicker
  };
}

function InteractiveAIExplanationPanel({ open, settings, title = 'AI 讲题老师', initialPayload = null, onClose }) {
  const {
    history, isThinking, isAiSpeaking, textMode, setTextMode, inputText, setInputText,
    isRecording, currentLangObj, scrollRef, sendMessage, startRecording, stopAndSend,
    stopEverything, replaySpecificAnswer, recLang, setRecLang, showLangPicker, setShowLangPicker
  } = useInteractiveAITutor({ open, settings, initialPayload, onClose });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9990] flex flex-col w-full h-[100dvh] bg-slate-50 text-slate-800 overflow-hidden">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4 h-16 border-b border-slate-200/50 backdrop-blur-sm">
        <button onClick={() => { stopEverything(); onClose?.(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/60 text-slate-600 active:scale-90 shadow-sm"><FaArrowLeft /></button>
        <div className="font-bold tracking-widest text-slate-800 text-sm">{title}</div>
        <div className="w-10 h-10" />
      </div>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative p-4 pb-40 flex flex-col z-10 overscroll-contain">
        {!showText && !textMode ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-full">
            <div className="relative flex items-center justify-center w-56 h-56 pointer-events-none">
              {isAiSpeaking && <div className="absolute inset-0 rounded-full bg-pink-300/30 animate-ping" />}
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Teacher&backgroundColor=fce4ec" alt="Teacher" className={`relative z-10 w-32 h-32 rounded-full border-[5px] border-white shadow-xl transition-all duration-300 object-cover ${isAiSpeaking ? 'scale-110 shadow-[0_0_30px_rgba(236,72,153,.5)]' : 'bg-pink-50'}`} />
            </div>
            <div className="mt-8 h-10 flex items-center justify-center">
              {isAiSpeaking ? <div className="tts-bars"><span /><span /><span /><span /><span /></div> : <span className="text-sm tracking-widest text-slate-400 font-medium">{isRecording ? '正在倾听...' : isThinking ? '思考中...' : '期待你的提问~'}</span>}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto flex flex-col justify-end mt-auto">
            {history.map((msg) => {
              if (msg.role === 'error') return <div key={msg.id} className="mb-4 pl-12 text-red-500 text-sm font-medium">{msg.text}</div>;
              if (msg.role === 'user') return <div key={msg.id} className="mb-3 pl-12 flex justify-end"><div className="bg-pink-100 text-pink-900 px-4 py-2.5 rounded-2xl rounded-tr-sm text-[15px] font-medium shadow-sm max-w-[90%] whitespace-pre-wrap">{msg.text}</div></div>;
              const aiText = normalizeAssistantText(msg.text || '');
              return (
                <div key={msg.id} className="mb-5 flex items-start gap-3">
                  <div className="mt-1 w-9 h-9 rounded-full overflow-hidden border border-pink-200 shadow-sm shrink-0 bg-pink-50"><img src="https://api.dicebear.com/7.x/bottts/svg?seed=Teacher&backgroundColor=fce4ec" className="w-full h-full object-cover" alt="AI"/></div>
                  <div className="flex-1">
                    <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm inline-block">
                      <div className="text-[15px] leading-7 text-slate-700 whitespace-pre-wrap font-medium inline">{aiText || (msg.isStreaming ? '思考中...' : '')}{msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-pink-400 animate-pulse" />}</div>
                      {!msg.isStreaming && aiText && <button onClick={() => replaySpecificAnswer(msg.text)} className="ml-2 mt-1 text-pink-400 hover:text-pink-600 active:scale-90 inline-flex items-center align-middle" title="重新朗读"><FaVolumeUp size={16} /></button>}
                    </div>
                  </div>
                </div>
              );
            })}
            {isRecording && textMode === false && (
              <div className="flex justify-start pl-12 mb-2"><div className="max-w-[92%] text-cyan-800 rounded-xl px-4 py-2 text-sm bg-cyan-50 border border-cyan-200/60 shadow-sm font-medium"><span className="opacity-80 mr-2">识别中：</span><span className="animate-pulse">{inputText || '...'}</span></div></div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Control */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-[max(24px,env(safe-area-inset-bottom))] px-5 bg-gradient-to-t from-white via-white/95 to-transparent pt-12 pointer-events-auto">
        <div className="max-w-md mx-auto relative flex items-center justify-center h-20">
          <button onClick={() => setTextMode((v) => !v)} className="absolute left-0 w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-500 active:scale-95 transition-transform shadow-sm flex items-center justify-center">{textMode ? <FaMicrophone /> : <FaKeyboard />}</button>
          {!textMode ? (
            <div className="flex flex-col items-center w-full">
              <button 
                onClick={() => { if (isRecording) stopAndSend(speechDisplayRef.current); else startRecording(); }}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 ${isRecording ? 'bg-red-500 animate-pulse-ring scale-95' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95'}`}
              >
                {isRecording ? <FaPaperPlane className="text-3xl animate-pulse" /> : <FaMicrophone className="text-3xl" />}
              </button>
              <div className="absolute -bottom-6 text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                {isRecording ? <span className="text-red-400">点击发送 · 静默自动发送</span> : isThinking ? <span className="text-amber-500">思考中...</span> : isAiSpeaking ? <div className="tts-bars"><span /><span /><span /><span /><span /></div> : <button onClick={() => setShowLangPicker(true)} className="text-slate-500 underline decoration-dashed underline-offset-4 active:text-pink-500 transition-colors">切换语言 · {currentLangObj.flag} {currentLangObj.name}</button>}
              </div>
            </div>
          ) : (
            <div className="flex-1 ml-16 mr-16 relative flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-inner">
              <input type="text" className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-800 outline-none placeholder-slate-400" placeholder={isRecording ? "听你说..." : "输入消息继续追问..."} value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { sendMessage(inputText); setInputText(''); } }} />
              <button onClick={() => { if (isRecording) stopEverything(); sendMessage(inputText); setInputText(''); }} className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-90"><FaPaperPlane size={14} /></button>
            </div>
          )}
          <div className="absolute right-0 flex items-center justify-center gap-2">
            {(isAiSpeaking || isRecording || isThinking) ? (
              <button onClick={stopEverything} className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-500 shadow-sm flex items-center justify-center active:scale-95 transition-transform"><FaStop /></button>
            ) : (
              <button onClick={() => setShowText((v) => !v)} className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors shadow-sm active:scale-95 ${showText ? 'bg-pink-100 border-pink-200 text-pink-500' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>{showText ? <FaClosedCaptioning size={18} /> : <FaCommentSlash size={18} />}</button>
            )}
          </div>
        </div>
      </div>

      {/* 语言选择面板 - 修复极高层级和点击冒泡 */}
      {showLangPicker && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setShowLangPicker(false); }} />
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-[fadeIn_.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4 text-center text-slate-800">选择识别语言</h3>
            <div className="grid grid-cols-2 gap-3">
              {RECOGNITION_LANGS.map((lang) => (
                <button key={lang.code} onClick={(e) => { e.stopPropagation(); setRecLang(lang.code); setShowLangPicker(false); }} className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-colors active:scale-95 ${recLang === lang.code ? 'border-pink-500 bg-pink-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                  <span className="text-2xl pointer-events-none">{lang.flag}</span>
                  <span className="font-bold text-xs text-slate-600 pointer-events-none">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =================================================================================
// 5. 全屏设置面板组件
// =================================================================================
function SettingsPanel({ prefs, setPrefs, aiSettings, updateAISettings, onClose }) {
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <div className="fixed inset-0 z-[110] bg-slate-50 flex flex-col w-full h-[100dvh]">
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200 shrink-0">
        <h2 className="text-xl font-black text-slate-800">系统设置</h2>
        <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"><FaTimes size={18} className="text-slate-600" /></button>
      </div>

      <div className="flex p-4 pb-0 shrink-0 bg-slate-50">
        <div className="flex w-full gap-2 bg-slate-200/50 p-1.5 rounded-xl">
          <button className={`flex-1 py-2.5 text-[14px] font-black rounded-lg transition-colors ${activeTab === 'basic' ? 'bg-white shadow-sm text-pink-500' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('basic')}>答题偏好</button>
          <button className={`flex-1 py-2.5 text-[14px] font-black rounded-lg transition-colors ${activeTab === 'ai' ? 'bg-white shadow-sm text-pink-500' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('ai')}>AI 专属配置</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {activeTab === 'basic' && (
          <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between py-2">
              <span className="font-bold text-slate-700">题干拼音显示</span>
              <div className="relative w-12 h-6 rounded-full cursor-pointer transition-colors" style={{ background: prefs.showQuestionPinyin ? '#58cc02' : '#cbd5e1' }} onClick={() => setPrefs((s) => ({ ...s, showQuestionPinyin: !s.showQuestionPinyin }))}>
                <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all" style={{ left: prefs.showQuestionPinyin ? '28px' : '4px' }} />
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="font-bold text-slate-700">选项拼音显示</span>
              <div className="relative w-12 h-6 rounded-full cursor-pointer transition-colors" style={{ background: prefs.showOptionPinyin ? '#58cc02' : '#cbd5e1' }} onClick={() => setPrefs((s) => ({ ...s, showOptionPinyin: !s.showOptionPinyin }))}>
                <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all" style={{ left: prefs.showOptionPinyin ? '28px' : '4px' }} />
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 pb-4">
              <span className="font-bold text-slate-700">题目自动朗读</span>
              <div className="relative w-12 h-6 rounded-full cursor-pointer transition-colors" style={{ background: prefs.autoPlay ? '#58cc02' : '#cbd5e1' }} onClick={() => setPrefs((s) => ({ ...s, autoPlay: !s.autoPlay }))}>
                <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all" style={{ left: prefs.autoPlay ? '28px' : '4px' }} />
              </div>
            </div>

            <div className="pt-2">
              <div className="font-bold text-slate-700 mb-3">题目朗读语速</div>
              <div className="grid grid-cols-3 gap-2">
                {[{ key: 'slow', label: '慢速' }, { key: 'normal', label: '正常' }, { key: 'fast', label: '快速' }].map((item) => (
                  <button key={item.key} className={`py-2.5 rounded-xl font-bold text-sm border-2 transition-colors ${prefs.rateMode === item.key ? 'border-pink-400 bg-pink-50 text-pink-600' : 'border-slate-200 bg-white text-slate-500'}`} onClick={() => setPrefs((s) => ({ ...s, rateMode: item.key }))}>{item.label}</button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 mt-4 pt-4 space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="font-bold text-slate-700">答题震动反馈</span>
                <div className="relative w-12 h-6 rounded-full cursor-pointer transition-colors" style={{ background: aiSettings.vibration ? '#7c3aed' : '#cbd5e1' }} onClick={() => updateAISettings({ vibration: !aiSettings.vibration })}>
                  <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all" style={{ left: aiSettings.vibration ? '28px' : '4px' }} />
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-bold text-slate-700">答题音效反馈</span>
                <div className="relative w-12 h-6 rounded-full cursor-pointer transition-colors" style={{ background: aiSettings.soundFx ? '#7c3aed' : '#cbd5e1' }} onClick={() => updateAISettings({ soundFx: !aiSettings.soundFx })}>
                  <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all" style={{ left: aiSettings.soundFx ? '28px' : '4px' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">API 基础配置</h3>
              <input className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-700 outline-none focus:border-pink-400" placeholder="API URL (例如: https://api.openai.com/v1)" value={aiSettings.apiUrl} onChange={(e) => updateAISettings({ apiUrl: e.target.value })} />
              <input className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-700 outline-none focus:border-pink-400" placeholder="API Key (sk-...)" type="password" value={aiSettings.apiKey} onChange={(e) => updateAISettings({ apiKey: e.target.value })} />
              <div className="flex gap-3">
                <input className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-700 outline-none focus:border-pink-400" placeholder="大模型名称 (如 mistral-large)" value={aiSettings.model} onChange={(e) => updateAISettings({ model: e.target.value })} />
                <input className="w-24 border-2 border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-700 outline-none focus:border-pink-400 text-center" placeholder="Temp" type="number" step="0.1" value={aiSettings.temperature} onChange={(e) => updateAISettings({ temperature: Number(e.target.value) })} />
              </div>
              <textarea className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-700 outline-none focus:border-pink-400 resize-y" rows={4} placeholder="老师预设提示词" value={aiSettings.systemPrompt} onChange={(e) => updateAISettings({ systemPrompt: e.target.value })} />
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">TTS 发音人配置</h3>
              <div className="mb-4">
                <div className="font-bold text-slate-700 mb-2">中文发音人</div>
                <div className="grid grid-cols-2 gap-2">
                  {ZH_VOICE_OPTIONS.map((item) => (
                    <button key={item.id} className={`py-2 px-2 rounded-xl font-bold text-[13px] border-2 transition-colors ${aiSettings.zhVoice === item.id ? 'border-pink-400 bg-pink-50 text-pink-600' : 'border-slate-200 bg-white text-slate-500'}`} onClick={() => updateAISettings({ zhVoice: item.id })}>{item.name}</button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <div className="font-bold text-slate-700 mb-2">缅语发音人</div>
                <div className="grid grid-cols-2 gap-2">
                  {MY_VOICE_OPTIONS.map((item) => (
                    <button key={item.id} className={`py-2 px-2 rounded-xl font-bold text-[13px] border-2 transition-colors ${aiSettings.myVoice === item.id ? 'border-pink-400 bg-pink-50 text-pink-600' : 'border-slate-200 bg-white text-slate-500'}`} onClick={() => updateAISettings({ myVoice: item.id })}>{item.name}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-700 mb-3 flex justify-between"><span>AI 朗读语速</span><span className="text-pink-500">{aiSettings.ttsSpeed}</span></div>
                <input type="range" min="-50" max="50" step="1" className="w-full accent-pink-500" value={aiSettings.ttsSpeed} onChange={(e) => updateAISettings({ ttsSpeed: Number(e.target.value) })} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =================================================================================
// 6. 主选择题界面及样式
// =================================================================================
const cssStyles = `
.xzt-container { font-family:"Padauk","Noto Sans SC",sans-serif; display:flex; flex-direction:column; background:transparent; width:100%; height:100%; position:relative; }
.xzt-header { flex-shrink:0; padding:16px 16px 2px; display:flex; flex-direction:column; }
.top-bar-row { width:100%; display:flex; justify-content:flex-end; margin-bottom:12px; }
.settings-btn { display:flex; align-items:center; justify-content:center; color:#94a3b8; cursor:pointer; font-size:22px; padding:6px; background:#f1f5f9; border-radius:50%; transition:all 0.2s; }
.settings-btn:active { background:#e2e8f0; color:#475569; transform:scale(0.95); }

.scene-wrapper { width:100%; display:flex; align-items:flex-start; gap:12px; margin-top:-4px; }
.teacher-img { height:138px; object-fit:contain; flex-shrink:0; margin-top:6px; }
.question-zone { flex:1; display:flex; flex-direction:column; gap:14px; }

.bubble-container { flex:1; background:linear-gradient(180deg,#ffffff 0%,#f7fbff 100%); border-radius:30px; padding:20px 16px; border:3px solid #bfdbfe; position:relative; display:flex; align-items:center; justify-content:space-between; gap:14px; box-shadow:0 12px 28px rgba(37,99,235,0.10), 0 3px 0 rgba(59,130,246,0.08); min-height:96px; }
.bubble-tail { position:absolute; bottom:24px; left:-12px; width:0; height:0; border-top:10px solid transparent; border-bottom:10px solid transparent; border-right:12px solid #bfdbfe; }
.bubble-tail::after { content:''; position:absolute; top:-8px; left:3px; border-top:8px solid transparent; border-bottom:8px solid transparent; border-right:10px solid #ffffff; }

.zh-seg { display:inline-flex; flex-direction:column; align-items:center; margin:0 1px; }
.zh-py { font-size:.7rem; color:#94a3b8; line-height:1; font-weight:700; margin-bottom:3px; }
.zh-char { font-size:1.52rem; font-weight:900; color:#1e293b; line-height:1.16; }
.my-seg { font-size:1.08rem; font-weight:700; color:#334155; white-space:pre-wrap; }
.bubble-play-btn { flex-shrink:0; width:52px; height:52px; border-radius:9999px; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:inset 0 -2px 0 rgba(0,0,0,0.06), 0 6px 12px rgba(37,99,235,0.14); }
.question-image { width:100%; max-width:310px; align-self:center; border-radius:22px; border:3px solid #f1f5f9; background:#fff; box-shadow:0 8px 20px rgba(15,23,42,0.06); object-fit:cover; }

.xzt-scroll-area { flex:1; overflow-y:auto; padding:10px 16px 132px; display:flex; flex-direction:column; align-items:center; -webkit-overflow-scrolling:touch; }
.options-grid { width:100%; display:grid; gap:12px; grid-template-columns:1fr; }
.options-grid.has-images { grid-template-columns:1fr 1fr; }

.option-card { background:#fff; border-radius:20px; padding:14px; border:2px solid #e5e7eb; border-bottom-width:5px; cursor:pointer; transition:all .12s ease; display:flex; align-items:center; justify-content:center; min-height:68px; position:relative; user-select:none; -webkit-tap-highlight-color:transparent; box-shadow:0 2px 0 rgba(0,0,0,0.02); }
.option-card:active { transform:translateY(2px); border-bottom-width:3px; }
.option-card.selected { border-color:#84cc16; background:#f7fee7; color:#4d7c0f; }
.option-card.playing { border-color:#60a5fa; background:#eff6ff; color:#1d4ed8; }
.option-card.correct { border-color:#84cc16; background:#dcfce7; color:#365314; }
.option-card.wrong { border-color:#fca5a5; background:#fff5f5; color:#c2410c; }
.option-card.locked { cursor:default; transform:none; }
.option-card.has-image-layout { flex-direction:column; align-items:stretch; justify-content:flex-start; padding:12px; }
.option-text-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; }
.option-py { font-size:.68rem; color:#94a3b8; line-height:1; font-weight:700; margin-bottom:4px; text-align:center; }
.option-text { font-size:1.15rem; font-weight:700; text-align:center; }

.submit-bar { position:absolute; bottom:0; left:0; right:0; padding:16px 16px calc(16px + env(safe-area-inset-bottom)); background:linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 20%); display:flex; justify-content:center; }
.submit-btn { width:100%; max-width:400px; padding:16px; border-radius:18px; font-size:1.15rem; font-weight:900; background:#58cc02; color:#fff; border:none; border-bottom:4px solid #46a302; cursor:pointer; transition:all .1s; box-shadow:0 4px 12px rgba(88,204,2,0.25); }
.submit-btn:active { transform:translateY(4px); border-bottom-width:1px; box-shadow:0 2px 0 #46a302; }
.submit-btn:disabled { background:#e5e5e5; color:#9ca3af; border-bottom-color:#d1d5db; box-shadow:none; cursor:not-allowed; }

.result-sheet { position:absolute; bottom:0; left:0; right:0; padding:20px 16px calc(20px + env(safe-area-inset-bottom)); border-top-left-radius:24px; border-top-right-radius:24px; display:flex; flex-direction:column; gap:12px; transform:translateY(100%); transition:transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow:0 -10px 30px rgba(0,0,0,0.08); z-index:100; }
.result-sheet.show { transform:translateY(0); }
.result-sheet.correct { background:#d7ffb8; border-top:3px solid #a3e635; }
.result-sheet.wrong { background:#ffdfe0; border-top:3px solid #fca5a5; }

.sheet-header { display:flex; align-items:center; gap:8px; font-size:1.35rem; font-weight:900; }
.result-sheet.correct .sheet-header { color:#58cc02; }
.result-sheet.wrong .sheet-header { color:#ef4444; }
.sheet-sub { font-size:0.95rem; font-weight:700; color:#64748b; margin-bottom:8px; }

.ai-btn { background:#fff; padding:12px; border-radius:14px; font-weight:900; color:#8b5cf6; border:2px solid #ddd6fe; display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; box-shadow:0 4px 0 #ddd6fe; margin-bottom:8px; }
.ai-btn:active { transform:translateY(4px); box-shadow:none; }
.ai-btn.ghost { background:transparent; border-color:#c4b5fd; color:#7c3aed; box-shadow:none; margin-bottom:0; }

.next-btn { width:100%; padding:16px; border-radius:18px; font-size:1.15rem; font-weight:900; color:#fff; border:none; border-bottom:4px solid; cursor:pointer; display:flex; justify-content:center; align-items:center; gap:8px; transition:all .1s; }
.btn-correct { background:#58cc02; border-bottom-color:#46a302; box-shadow:0 4px 12px rgba(88,204,2,0.25); }
.btn-wrong { background:#ef4444; border-bottom-color:#dc2626; box-shadow:0 4px 12px rgba(239,68,68,0.25); }
.next-btn:active { transform:translateY(4px); border-bottom-width:1px; box-shadow:none; }

.bounce-in { animation: xzt-bounce .28s ease-out; }
@keyframes xzt-bounce { 0% { transform: scale(0.97); } 60% { transform: scale(1.02); } 100% { transform: scale(1); } }
`;

function getPinyinArraySafe(text = '') {
  const cleaned = String(text).replace(/[^\u4e00-\u9fff]/g, '');
  if (!cleaned) return [];
  try { return pinyin(cleaned, { type: 'array', toneType: 'symbol' }); } catch (_) { return []; }
}

function renderTextWithOptionalPinyin(text, showPinyin, textClass = 'zh-char', pyClass = 'zh-py') {
  if (!text) return null;
  const parts = String(text).match(/([\u4e00-\u9fff]+|[^\u4e00-\u9fff]+)/g) || [];
  return parts.map((part, i) => {
    if (/[\u4e00-\u9fff]/.test(part)) {
      const py = getPinyinArraySafe(part);
      return part.split('').map((char, j) => (
        <div key={`${i}-${j}`} className="zh-seg">
          {showPinyin ? <span className={pyClass}>{py[j] || ''}</span> : null}
          {/* 核心 Bug 修复 1：将硬编码的“示例助手”还原为 {char} */}
          <span className={textClass}>{char}</span>
        </div>
      ));
    }
    return <span key={i} className="my-seg">{part}</span>;
  });
}

export default function XuanZeTi({ data: rawData, onCorrect, onWrong, onNext }) {
  const data = rawData?.content || rawData || {};
  const question = data.question || {};
  const questionText = typeof question === 'string' ? question : question.text || '';
  const questionImg = data.imageUrl || '';
  const options = data.options || [];

  const correctAnswers = useMemo(() => {
    const raw = data.correctAnswer || [];
    return (Array.isArray(raw) ? raw : [raw]).map(String);
  }, [data.correctAnswer]);

  const hasOptionImages = useMemo(() => options.some((opt) => opt.img || opt.imageUrl), [options]);

  // 核心 Bug 修复 2：正确依赖 data?.id，防止每次渲染乱跳
  const shuffledOptions = useMemo(() => {
    const opts = [...options];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }, [data?.id]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [isQuestionPlaying, setIsQuestionPlaying] = useState(false);
  const [speakingOptionId, setSpeakingOptionId] = useState(null);
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cardPopId, setCardPopId] = useState(null);
  const [questionImgVisible, setQuestionImgVisible] = useState(Boolean(questionImg));
  
  // PopState 虚拟路由状态
  const [activeOverlay, setActiveOverlay] = useState(null);

  const [prefs, setPrefs] = useState(() => getSavedPrefs());
  const [aiSettings, setAISettings] = useState(() => getSavedAISettings());

  const mountedRef = useRef(true);
  const timersRef = useRef([]);
  const playOptionDebounced = useRef(null);

  // 核心 Bug 修复 3 & 请求手势拦截：完美绑定侧滑退出
  const openOverlay = useCallback((overlayType) => {
    setActiveOverlay((prev) => {
      if (prev === overlayType) return prev;
      if (typeof window !== 'undefined') {
        window.history.pushState({ interactiveModalOpen: true, type: overlayType }, '');
      }
      return overlayType;
    });
  }, []);

  const closeOverlay = useCallback(() => {
    setActiveOverlay(null);
    if (typeof window !== 'undefined' && window.history.state?.interactiveModalOpen) {
      window.history.back(); // 安全消耗掉这一层，不会退到关卡外
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = () => setActiveOverlay(null);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // 核心 Bug 修复 6：彻底清理已执行的定时器防泄露
  const addTimer = (fn, ms) => {
    const t = setTimeout(() => {
      fn();
      timersRef.current = timersRef.current.filter((id) => id !== t);
    }, ms);
    timersRef.current.push(t);
  };

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs)); }, [prefs]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(aiSettings)); }, [aiSettings]);
  useEffect(() => { setQuestionImgVisible(Boolean(questionImg)); }, [questionImg]);

  const currentRate = RATE_MAP[prefs.rateMode] ?? 0;

  // 核心 Bug 修复 4：加上了对 aiSettings 的依赖
  useEffect(() => {
    clearTimers();
    audioController.stop();

    setSelectedIds([]); setIsSubmitted(false); setIsRight(false); setShowResultSheet(false);
    setIsQuestionPlaying(false); setSpeakingOptionId(null); setShowSettings(false);
    setCardPopId(null); setActiveOverlay(null);

    if (questionText && prefs.autoPlay) {
      addTimer(() => {
        audioController.playMixed(
          questionText,
          { rate: currentRate, aiSettings },
          () => mountedRef.current && setIsQuestionPlaying(true),
          () => mountedRef.current && setIsQuestionPlaying(false)
        );
      }, 260);
    }
    return () => { clearTimers(); audioController.stop(); };
  }, [data?.id, questionText, prefs.autoPlay, currentRate, aiSettings]);

  const updateAISettings = (patch) => { setAISettings((prev) => ({ ...prev, ...patch })); };
  const feedbackTap = () => { if (aiSettings.vibration) vibrate(15); if (aiSettings.soundFx) playBeep('tap'); };
  const feedbackCorrect = () => { if (aiSettings.vibration) vibrate([30, 40, 30]); if (aiSettings.soundFx) playBeep('correct'); };
  const feedbackWrong = () => { if (aiSettings.vibration) vibrate([40, 40, 40]); if (aiSettings.soundFx) playBeep('wrong'); };

  const playQuestion = () => {
    if (!questionText) return;
    setSpeakingOptionId(null);
    audioController.playMixed(
      questionText, { rate: currentRate, aiSettings },
      () => mountedRef.current && setIsQuestionPlaying(true),
      () => mountedRef.current && setIsQuestionPlaying(false)
    );
  };

  const toggleOption = (id) => {
    if (isSubmitted) return;
    feedbackTap();
    const sid = String(id);
    if (correctAnswers.length === 1) setSelectedIds([sid]);
    else setSelectedIds((prev) => prev.includes(sid) ? prev.filter((i) => i !== sid) : [...prev, sid]);

    setCardPopId(sid);
    setTimeout(() => { if (mountedRef.current) setCardPopId((prev) => (prev === sid ? null : prev)); }, 180);

    const opt = options.find((o) => String(o.id) === sid);
    if (opt?.text) {
      setIsQuestionPlaying(false);
      // 核心 Bug 修复 9：加上防抖避免连续点击爆炸
      if (playOptionDebounced.current) clearTimeout(playOptionDebounced.current);
      playOptionDebounced.current = setTimeout(() => {
        audioController.playMixed(
          opt.text, { rate: currentRate, aiSettings },
          () => mountedRef.current && setSpeakingOptionId(sid),
          () => mountedRef.current && setSpeakingOptionId(null)
        );
      }, 100);
    }
  };

  const handleSubmit = async () => {
    if (!selectedIds.length || isSubmitted) return;
    const correct = selectedIds.length === correctAnswers.length && selectedIds.every((id) => correctAnswers.includes(id));
    setIsRight(correct); setIsSubmitted(true); audioController.stop(); setIsQuestionPlaying(false); setSpeakingOptionId(null);
    if (correct) { feedbackCorrect(); onCorrect?.(); } else { feedbackWrong(); onWrong?.(); }
    setShowResultSheet(true);
  };

  // 核心 Bug 修复 5：避免 alert 阻塞渲染线程，替换为轻量化判断
  const handleAI = () => {
    if (!aiSettings.apiUrl || !aiSettings.apiKey) {
      setShowSettings(true);
      setTimeout(() => alert('请先配置大模型 API Key（在"AI专属配置"里填写）'), 150);
      return;
    }
    openOverlay('ai-explanation');
  };

  return (
    <div className="xzt-container">
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

      <div className="xzt-header">
        <div className="w-full relative">
          
          {/* 用户需求重写：移除假进度条，仅保留干净的右上角设置按钮 */}
          <div className="top-bar-row">
            <button className="settings-btn" onClick={() => setShowSettings((v) => !v)}>
              <FaCog />
            </button>
          </div>

          <div className="top-left-text mb-2 font-black text-slate-800 text-lg">请选择正确答案</div>

          {showSettings && (
            <SettingsPanel
              prefs={prefs} setPrefs={setPrefs}
              aiSettings={aiSettings} updateAISettings={updateAISettings}
              onClose={() => setShowSettings(false)}
            />
          )}

          <div className="scene-wrapper">
            <img src="https://audio.886.best/chinese-vocab-audio/%E5%9B%BE%E7%89%87/1765952194374.png" className="teacher-img" alt="Teacher" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <div className="question-zone">
              <div className="bubble-container">
                <div className="bubble-tail" />
                <div className="flex-1 flex flex-wrap items-end gap-1">
                  {renderTextWithOptionalPinyin(questionText, prefs.showQuestionPinyin, 'zh-char', 'zh-py')}
                </div>
                {questionText && (
                  <div className="bubble-play-btn" style={{ background: isQuestionPlaying ? '#2563eb' : '#eff6ff', color: isQuestionPlaying ? '#fff' : '#2563eb' }} onClick={playQuestion}>
                    {isQuestionPlaying ? <FaSpinner className="animate-spin" size={20} /> : <FaVolumeUp size={20} />}
                  </div>
                )}
              </div>
              {questionImg && questionImgVisible ? <img src={questionImg} alt="question" className="question-image" onError={() => setQuestionImgVisible(false)} /> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="xzt-scroll-area">
        <div className={`options-grid ${hasOptionImages ? 'has-images' : ''}`}>
          {shuffledOptions.map((opt) => {
            const sid = String(opt.id); const isSel = selectedIds.includes(sid); const isCorrectAns = correctAnswers.includes(sid);
            let cls = 'option-card';
            if (opt.img || opt.imageUrl) cls += ' has-image-layout';
            if (cardPopId === sid) cls += ' bounce-in';
            if (isSubmitted) { cls += ' locked'; if (isCorrectAns) cls += ' correct'; else if (isSel) cls += ' wrong'; } 
            else { if (speakingOptionId === sid) cls += ' playing'; else if (isSel) cls += ' selected'; }
            const showPy = prefs.showOptionPinyin && containsChinese(opt.text);

            return (
              <div key={sid} className={cls} onClick={() => toggleOption(sid)}>
                {speakingOptionId === sid && <FaSpinner className="absolute top-3 right-3 text-blue-500 animate-spin" />}
                {(opt.img || opt.imageUrl) && <img src={opt.img || opt.imageUrl} alt="opt" className="h-24 w-full object-cover rounded-xl mb-2" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                <div className="option-text-wrap">
                  {showPy ? <div className="option-py">{pinyin(String(opt.text).replace(/[^\u4e00-\u9fff]/g, ''), { toneType: 'symbol' })}</div> : null}
                  <span className="option-text">{opt.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isSubmitted && (
        <div className="submit-bar">
          <button className="submit-btn" disabled={!selectedIds.length} onClick={handleSubmit}>检查答案</button>
        </div>
      )}

      <div className={`result-sheet ${showResultSheet ? 'show' : ''} ${isRight ? 'correct' : 'wrong'}`}>
        <div className="sheet-header">
          {isRight ? <FaCheck /> : <FaTimes />}
          <span>{isRight ? '答对了！' : '再试试看'}</span>
        </div>

        <div className="sheet-sub">
          {isRight ? '太棒了，继续前进。' : '你已经很接近正确答案了。'}
        </div>

        {!isRight ? (
          <button className="ai-btn" onClick={handleAI}>
            <FaRobot /> AI 语音讲题老师
          </button>
        ) : (
           // 核心体验修复 8：答对了也提供一个轻量化的 AI 入口
          <button className="ai-btn ghost text-sm" onClick={handleAI}>
            <FaRobot size={14}/> 还有疑问？问AI
          </button>
        )}

        <button className={`next-btn ${isRight ? 'btn-correct' : 'btn-wrong'}`} onClick={() => { audioController.stop(); onNext?.(); }}>
          继续 <FaArrowRight />
        </button>
      </div>

      <InteractiveAIExplanationPanel
        open={activeOverlay === 'ai-explanation'}
        onClose={closeOverlay}
        settings={aiSettings}
        title="AI 讲题老师"
        initialPayload={{ questionText, options: shuffledOptions, selectedIds, correctAnswers, isRight }}
      />
    </div>
  );
}
