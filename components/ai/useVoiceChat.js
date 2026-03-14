// components/ai/useVoiceChat.js
import { useEffect, useRef, useState } from 'react';
import { resolveAIConfig, saveGlobalSettings, saveSceneSettings, RECOGNITION_LANGS, AI_REC_LANG_KEY, toFinite } from './aiConfig';
import { nowId, normalizeAssistantText, mergeTranscript } from './aiTextUtils';
import { ttsEngine } from './ttsEngine';
import { streamChatCompletion } from './aiService';

export function useVoiceChat({ scene = 'free_talk' } = {}) {
  // 1. 使用核心合并器初始化配置
  const [settings, setSettings] = useState(() => resolveAIConfig(scene));
  const [recLang, setRecLang] = useState('zh-CN');
  
  const [history, setHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [inputText, setInputText] = useState('');
  const [liveInterim, setLiveInterim] = useState('');
  const [recordFinalText, setRecordFinalText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const historyRef = useRef([]);
  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const scrollRef = useRef(null);
  const longPressTimerRef = useRef(null);
  const longPressTriggeredRef = useRef(false);
  const micActionLockRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const recordingFinalRef = useRef('');
  const interimRef = useRef('');

  // 初始化加载语言
  useEffect(() => {
    try {
      const lang = localStorage.getItem(AI_REC_LANG_KEY);
      if (lang && RECOGNITION_LANGS.some((l) => l.code === lang)) setRecLang(lang);
    } catch {}
    ttsEngine.setStateCallback(({ isPlaying }) => setIsAiSpeaking(isPlaying));
    return () => { stopEverything(); ttsEngine.setStateCallback(null); };
  }, [scene]);

  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { localStorage.setItem(AI_REC_LANG_KEY, recLang); }, [recLang]);

  // 更新配置的专门方法 (区分保存全局还是场景)
  const updateSettings = (patch, isGlobal = true) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      if (isGlobal) {
        // 保存 API Key, Speed 等全局配置
        const globalPatch = {
          apiUrl: next.apiUrl, apiKey: next.apiKey, defaultModel: next.model,
          ttsApiUrl: next.ttsApiUrl, defaultTtsVoice: next.ttsVoice, 
          defaultTtsSpeed: next.ttsSpeed, defaultTtsPitch: next.ttsPitch,
          showText: next.showText, asrSilenceMs: next.asrSilenceMs
        };
        saveGlobalSettings({ ...prev._global, ...globalPatch });
      } else {
        // 保存老师风格、温度等场景专属配置
        saveSceneSettings(scene, { promptId: next.promptId, temperature: next.temperature });
        // 重新解析以获取最新的 systemPrompt 文本
        return resolveAIConfig(scene, { promptId: next.promptId, temperature: next.temperature });
      }
      ttsEngine.setSettingsRef(next);
      return next;
    });
  };

  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    setTimeout(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, 40);
  };

  const clearSilenceTimer = () => { if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; } };
  const clearRecordingBuffer = () => { recordingFinalRef.current = ''; interimRef.current = ''; setRecordFinalText(''); setLiveInterim(''); };

  const stopEverything = () => {
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} recognitionRef.current = null; }
    clearSilenceTimer(); setIsRecording(false); clearRecordingBuffer();
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null; longPressTriggeredRef.current = false;
    ttsEngine.stopAndClear();
    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; }
    setIsAiSpeaking(false); setIsThinking(false);
  };

  const sendMessage = async (text) => {
    const content = (text || '').trim();
    if (!content) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    ttsEngine.stopAndClear();
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} recognitionRef.current = null; }
    clearSilenceTimer(); setIsRecording(false); clearRecordingBuffer();
    ttsEngine.unlockAudio();

    const aiMsgId = nowId();
    const newHistory = [...historyRef.current, { id: nowId(), role: 'user', text: content }];
    setHistory([...newHistory, { id: aiMsgId, role: 'ai', text: '', isStreaming: true }]);
    scrollToBottom();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const messages = [
      { role: 'system', content: settings.systemPrompt },
      ...newHistory.map((h) => ({ role: h.role === 'ai' ? 'assistant' : 'user', content: h.text })),
    ];

    await streamChatCompletion({
      settings, messages, signal: controller.signal,
      onStart: () => setIsThinking(true),
      onUpdate: (fullText) => {
        setIsThinking(false);
        const visible = normalizeAssistantText(fullText);
        setHistory((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, text: visible } : m)));
        scrollToBottom();
      },
      onSentence: (s) => ttsEngine.push(s),
      onFinished: () => {
        setIsThinking(false); abortControllerRef.current = null;
        setHistory((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m)));
      },
      onError: (err) => {
        setIsThinking(false); setHistory((prev) => [...prev, { id: nowId(), role: 'error', text: err.message }]);
      }
    });
  };

  const startRecording = () => {
    ttsEngine.unlockAudio();
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return alert('当前浏览器不支持语音识别');

    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; setIsThinking(false); }
    if (isAiSpeaking) ttsEngine.stopAndClear();
    if (recognitionRef.current) return;

    const rec = new SpeechRec();
    rec.lang = recLang; rec.interimResults = true; rec.continuous = true; rec.maxAlternatives = 1;

    clearRecordingBuffer(); setIsRecording(true);

    rec.onresult = (e) => {
      let interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = (e.results[i][0]?.transcript || '').trim();
        if (!t) continue;
        if (e.results[i].isFinal) recordingFinalRef.current = mergeTranscript(recordingFinalRef.current, t);
        else interimText += `${t} `;
      }
      interimRef.current = interimText.trim();
      setRecordFinalText(recordingFinalRef.current); setLiveInterim(interimRef.current);

      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(() => manualSubmitRecording(), toFinite(settings.asrSilenceMs, 1500));
    };

    rec.onerror = () => { setIsRecording(false); recognitionRef.current = null; clearSilenceTimer(); };
    rec.onend = () => { setIsRecording(false); recognitionRef.current = null; clearSilenceTimer(); };

    recognitionRef.current = rec;
    if (navigator.vibrate) navigator.vibrate(30);
    try { rec.start(); } catch {}
  };

  const manualSubmitRecording = () => {
    const finalText = mergeTranscript(recordingFinalRef.current, interimRef.current).trim();
    if (!finalText) {
       if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} recognitionRef.current = null; }
       setIsRecording(false); clearRecordingBuffer(); return;
    }
    sendMessage(finalText);
  };

  const handleMicPointerDown = (e) => {
    e.preventDefault();
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTriggeredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      if (navigator.vibrate) navigator.vibrate(45);
      setShowLangPicker(true); longPressTimerRef.current = null;
    }, 550);
  };

  const handleMicPointerUp = (e) => {
    e.preventDefault();
    if (longPressTimerRef.current) { clearTimeout(longPressTimerRef.current); longPressTimerRef.current = null; }
    if (longPressTriggeredRef.current) { longPressTriggeredRef.current = false; return; }
    if (micActionLockRef.current) return;
    micActionLockRef.current = true;
    setTimeout(() => { micActionLockRef.current = false; }, 220);

    if (isRecording) manualSubmitRecording(); else startRecording();
  };

  const handleMicPointerCancel = () => {
    if (longPressTimerRef.current) { clearTimeout(longPressTimerRef.current); longPressTimerRef.current = null; }
    longPressTriggeredRef.current = false;
  };

  return {
    settings, updateSettings, recLang, setRecLang, history,
    isRecording, isAiSpeaking, isThinking, textMode, setTextMode,
    inputText, setInputText, liveInterim, recordFinalText,
    showSettings, setShowSettings, showLangPicker, setShowLangPicker,
    scrollRef, sendMessage, startRecording, manualSubmitRecording,
    stopEverything, clearRecordingBuffer, handleMicPointerDown, handleMicPointerUp, handleMicPointerCancel
  };
                                 }
