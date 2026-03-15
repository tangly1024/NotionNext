'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ttsEngine } from './ttsEngine';
import { normalizeAssistantText, mergeTranscript, nowId, splitSpeakable } from './aiTextUtils';
import { RECOGNITION_LANGS, AI_REC_LANG_KEY } from './aiConfig';
import { PROMPT_REGISTRY, buildInteractiveBootstrapPrompt } from './aiPrompts';

const toFinite = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export function useInteractiveAITutor({ open, settings, initialPayload = null }) {
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
  const longPressTimerRef = useRef(null);

  const finalTextRef = useRef('');
  const speechDisplayRef = useRef('');
  const autoSendTimerRef = useRef(null);
  const hasAutoSentRef = useRef(false);

  const longPressTriggeredRef = useRef(false);
  const micActionLockRef = useRef(false);
  const sendLockRef = useRef(false);
  const requestIdRef = useRef(0);
  const bootstrappedRef = useRef(false);
  const initialPayloadRef = useRef(initialPayload);

  const currentLangObj = RECOGNITION_LANGS.find((l) => l.code === recLang) || RECOGNITION_LANGS[0];

  const initialSystemPrompt = useMemo(() => {
    return settings?.systemPrompt || PROMPT_REGISTRY.interactive_tutor_default;
  }, [settings]);

  useEffect(() => {
    try {
      const lang = localStorage.getItem(AI_REC_LANG_KEY);
      if (lang && RECOGNITION_LANGS.some((l) => l.code === lang)) setRecLang(lang);
    } catch {}
  }, []);

  useEffect(() => { localStorage.setItem(AI_REC_LANG_KEY, recLang); }, [recLang]);
  useEffect(() => { initialPayloadRef.current = initialPayload; }, [initialPayload]);

  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 40);
  };

  const stopEverything = () => {
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} recognitionRef.current = null; }
    if (autoSendTimerRef.current) { clearTimeout(autoSendTimerRef.current); autoSendTimerRef.current = null; }
    setIsRecording(false);
    
    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; }
    if (longPressTimerRef.current) { clearTimeout(longPressTimerRef.current); longPressTimerRef.current = null; }
    longPressTriggeredRef.current = false;
    ttsEngine.stopAndClear(); setIsThinking(false); setIsAiSpeaking(false);
  };

  const stopAndSend = (textToForce) => {
    if (hasAutoSentRef.current) return;
    hasAutoSentRef.current = true;

    if (autoSendTimerRef.current) { clearTimeout(autoSendTimerRef.current); autoSendTimerRef.current = null; }
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} recognitionRef.current = null; }
    setIsRecording(false);

    const finalStr = String(textToForce !== undefined ? textToForce : speechDisplayRef.current).trim();
    speechDisplayRef.current = '';
    finalTextRef.current = '';
    setInputText('');

    if (finalStr) sendMessage(finalStr);
  };

  const runAIRequest = async ({ content, visibleUserMessage = true }) => {
    const text = String(content || '').trim();
    if (!text) return;
    
    if (sendLockRef.current) {
      if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; }
      ttsEngine.stopAndClear();
    }
    sendLockRef.current = true;
    
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} recognitionRef.current = null; }
    setIsRecording(false);
    
    ttsEngine.unlockAudio(); ttsEngine.stopAndClear();

    const currentRequestId = ++requestIdRef.current;
    setIsThinking(true);
    const baseHistory = [...historyRef.current];
    let newHistory = baseHistory;
    if (visibleUserMessage) newHistory = [...baseHistory, { id: nowId(), role: 'user', text }];

    const aiMsgId = nowId();
    setHistory([...newHistory, { id: aiMsgId, role: 'ai', text: '', isStreaming: true }]);
    scrollToBottom();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const cleanedHistory = newHistory.filter((h) => {
        if (h.role === 'error' || (h.role === 'ai' && !String(h.text || '').trim()) || (h.role === 'user' && !String(h.text || '').trim())) return false;
        return true;
      });

      const messages = [
        { role: 'system', content: initialSystemPrompt },
        ...cleanedHistory.map((h) => ({ role: h.role === 'ai' ? 'assistant' : 'user', content: String(h.text || '').trim() })),
        ...(visibleUserMessage ? [] : [{ role: 'user', content: text }])
      ];

      const res = await fetch(`${String(settings?.apiUrl || '').replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings?.apiKey || ''}` },
        signal: controller.signal,
        body: JSON.stringify({ model: settings?.model, temperature: settings?.temperature, stream: true, messages })
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      if (!res.body) throw new Error('API 返回为空');

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
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

            if (!gotFirstChunk) {
              if (currentRequestId === requestIdRef.current) setIsThinking(false);
              gotFirstChunk = true;
            }

            fullText += chunk; sentenceBuffer += chunk;
            const visible = normalizeAssistantText(fullText);

            if (currentRequestId === requestIdRef.current) {
              setHistory((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, text: visible } : m)));
              scrollToBottom();
            }

            const { sentences, rest } = splitSpeakable(sentenceBuffer);
            if (sentences.length) {
              for (const s of sentences) {
                if (!controller.signal.aborted && currentRequestId === requestIdRef.current) ttsEngine.push(s);
              }
              sentenceBuffer = rest;
            }
          } catch (_) {}
        }
      }
      if (sentenceBuffer.trim() && !controller.signal.aborted && currentRequestId === requestIdRef.current) {
        ttsEngine.push(sentenceBuffer.trim());
      }
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

  const sendMessage = async (text) => {
    const content = String(text || '').trim();
    if (!content) return;
    await runAIRequest({ content, visibleUserMessage: true });
  };

  const sendHiddenMessage = async (text) => {
    const content = String(text || '').trim();
    if (!content) return;
    await runAIRequest({ content, visibleUserMessage: false });
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

    setInputText('');
    finalTextRef.current = '';
    speechDisplayRef.current = '';
    hasAutoSentRef.current = false;
    setIsRecording(true);

    rec.onresult = (e) => {
      let interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0]?.transcript || '';
        if (e.results[i].isFinal) {
          finalTextRef.current = mergeTranscript(finalTextRef.current, transcript);
        } else {
          interimText += transcript;
        }
      }
      
      const currentDisplay = mergeTranscript(finalTextRef.current, interimText);
      speechDisplayRef.current = currentDisplay;
      setInputText(currentDisplay);

      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = setTimeout(() => {
        if (speechDisplayRef.current.trim() && !hasAutoSentRef.current) {
          stopAndSend(speechDisplayRef.current);
        }
      }, toFinite(settings?.asrSilenceMs, 1500));
    };

    rec.onerror = () => { setIsRecording(false); recognitionRef.current = null; };
    rec.onend = () => {
      setIsRecording(false); recognitionRef.current = null;
      if (!hasAutoSentRef.current && speechDisplayRef.current.trim()) {
        stopAndSend(speechDisplayRef.current);
      }
    };

    recognitionRef.current = rec;
    if (navigator.vibrate) navigator.vibrate(30);
    try { rec.start(); } catch (_) {}
  };

  const replaySpecificAnswer = (text) => {
    if (!text) return;
    ttsEngine.stopAndClear();
    ttsEngine.push(text);
  };

  const handleMicPointerDown = (e) => {
    e.preventDefault();
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTriggeredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      if (navigator.vibrate) navigator.vibrate(45);
      setShowLangPicker(true);
      longPressTimerRef.current = null;
    }, 550);
  };

  const handleMicPointerUp = (e) => {
    e.preventDefault();
    if (longPressTimerRef.current) { clearTimeout(longPressTimerRef.current); longPressTimerRef.current = null; }
    if (longPressTriggeredRef.current) { longPressTriggeredRef.current = false; return; }
    if (micActionLockRef.current) return;
    micActionLockRef.current = true;
    setTimeout(() => { micActionLockRef.current = false; }, 220);
    
    if (isRecording) stopAndSend(speechDisplayRef.current);
    else startRecording();
  };

  const handleMicPointerCancel = () => {
    if (longPressTimerRef.current) { clearTimeout(longPressTimerRef.current); longPressTimerRef.current = null; }
    longPressTriggeredRef.current = false;
  };

  useEffect(() => { historyRef.current = history; }, [history]);
  
  useEffect(() => {
    ttsEngine.setStateCallback(({ isPlaying }) => setIsAiSpeaking(isPlaying));
    return () => ttsEngine.setStateCallback(null);
  }, []);

  useEffect(() => {
    if (!open) {
      stopEverything();
      setHistory([]);
      bootstrappedRef.current = false;
    } else if (!bootstrappedRef.current) {
      const payload = initialPayloadRef.current;
      const firstPrompt = buildInteractiveBootstrapPrompt(payload);
      if (firstPrompt) { bootstrappedRef.current = true; sendHiddenMessage(firstPrompt); }
    }
  }, [open]);

  useEffect(() => { return () => stopEverything(); }, []);

  return {
    history, isThinking, isAiSpeaking, textMode, setTextMode, inputText, setInputText,
    isRecording, currentLangObj, scrollRef, sendMessage, startRecording, stopAndSend,
    stopEverything, replaySpecificAnswer, recLang, setRecLang, showLangPicker, setShowLangPicker, 
    handleMicPointerDown, handleMicPointerUp, handleMicPointerCancel, showText, setShowText
  };
}
