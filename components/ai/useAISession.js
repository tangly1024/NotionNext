'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ttsEngine } from './ttsEngine';
import {
  mergeTranscript,
  normalizeAssistantText,
  nowId,
  splitSpeakable
} from './aiTextUtils';
import { AI_REC_LANG_KEY, RECOGNITION_LANGS, toFinite } from './aiConfig';
import { buildExerciseBootstrapPrompt } from './aiAssistants';
import { streamChatCompletion } from './aiService';

function compactHistory(history) {
  return history.filter((item) => {
    if (item.role === 'error') return false;
    return Boolean(String(item.text || '').trim());
  });
}

export function useAISession({
  open,
  scene,
  settings,
  initialPayload = null,
  bootstrapBuilder = null,
  defaultTextMode = false
}) {
  const [history, setHistory] = useState([]);
  const historyRef = useRef([]);

  const [isThinking, setIsThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  const [textMode, setTextMode] = useState(defaultTextMode);
  const [inputText, setInputText] = useState('');

  const [liveInterim, setLiveInterim] = useState('');
  const [recordFinalText, setRecordFinalText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showText, setShowText] = useState(settings?.showText ?? true);
  const [recLang, setRecLang] = useState('zh-CN');

  const scrollRef = useRef(null);
  const abortControllerRef = useRef(null);
  const recognitionRef = useRef(null);
  const longPressTimerRef = useRef(null);
  const autoSendTimerRef = useRef(null);

  const finalTextRef = useRef('');
  const speechDisplayRef = useRef('');
  const bootstrappedRef = useRef(false);
  const hasAutoSentRef = useRef(false);
  const micActionLockRef = useRef(false);
  const longPressTriggeredRef = useRef(false);

  const currentLangObj = useMemo(
    () => RECOGNITION_LANGS.find((item) => item.code === recLang) || RECOGNITION_LANGS[0],
    [recLang]
  );

  useEffect(() => {
    ttsEngine.setSettingsRef(settings);
  }, [settings]);

  useEffect(() => {
    setShowText(settings?.showText ?? true);
  }, [settings?.showText]);

  useEffect(() => {
    try {
      const lang = localStorage.getItem(AI_REC_LANG_KEY);
      if (lang && RECOGNITION_LANGS.some((item) => item.code === lang)) {
        setRecLang(lang);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(AI_REC_LANG_KEY, recLang);
    } catch {}
  }, [recLang]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    ttsEngine.setStateCallback(({ isPlaying }) => setIsAiSpeaking(isPlaying));
    return () => ttsEngine.setStateCallback(null);
  }, []);

  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 40);
  };

  const clearRecordingBuffer = () => {
    finalTextRef.current = '';
    speechDisplayRef.current = '';
    setLiveInterim('');
    setRecordFinalText('');
    setInputText('');
  };

  const stopEverything = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (autoSendTimerRef.current) {
      clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    longPressTriggeredRef.current = false;
    hasAutoSentRef.current = false;

    ttsEngine.stopAndClear();
    clearRecordingBuffer();

    setIsRecording(false);
    setIsThinking(false);
    setIsAiSpeaking(false);
    setShowLangPicker(false);
  };

  const finishRecordingAndSend = (forcedText) => {
    if (hasAutoSentRef.current) return;
    hasAutoSentRef.current = true;

    if (autoSendTimerRef.current) {
      clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    setIsRecording(false);

    const finalText = String(
      forcedText !== undefined ? forcedText : speechDisplayRef.current
    ).trim();

    clearRecordingBuffer();
    if (finalText) void sendMessage(finalText);
  };

  const runAIRequest = async ({ content, visibleUserMessage = true }) => {
    const text = String(content || '').trim();
    if (!text) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
      setIsRecording(false);
    }

    ttsEngine.unlockAudio();
    ttsEngine.stopAndClear();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const baseHistory = compactHistory(historyRef.current);
    const nextHistory = visibleUserMessage
      ? [...baseHistory, { id: nowId(), role: 'user', text }]
      : [...baseHistory];

    historyRef.current = nextHistory;

    const aiId = nowId();
    setHistory([...nextHistory, { id: aiId, role: 'ai', text: '', isStreaming: true }]);
    setIsThinking(true);
    scrollToBottom();

    let speechBuffer = '';
    let lastHandledLength = 0;
    let receivedFirstChunk = false;

    const messages = [
      {
        role: 'system',
        content: String(settings?.systemPrompt || '').trim()
      },
      ...nextHistory.map((item) => ({
        role: item.role === 'ai' ? 'assistant' : 'user',
        content: String(item.text || '').trim()
      })),
      ...(visibleUserMessage ? [] : [{ role: 'user', content: text }])
    ];

    await streamChatCompletion({
      settings,
      messages,
      signal: controller.signal,
      onUpdate: (fullText) => {
        if (!receivedFirstChunk) {
          receivedFirstChunk = true;
          setIsThinking(false);
        }

        const visible = normalizeAssistantText(fullText);
        setHistory((prev) => prev.map((item) => (item.id === aiId ? { ...item, text: visible } : item)));

        const delta = String(fullText || '').slice(lastHandledLength);
        lastHandledLength = String(fullText || '').length;
        speechBuffer += delta;

        const { sentences, rest } = splitSpeakable(speechBuffer);
        if (sentences.length) {
          speechBuffer = rest;
          for (const sentence of sentences) {
            if (!controller.signal.aborted) ttsEngine.push(sentence);
          }
        }

        scrollToBottom();
      },
      onFinished: (fullText) => {
        const visible = normalizeAssistantText(fullText || '');
        if (speechBuffer.trim() && !controller.signal.aborted) {
          ttsEngine.push(speechBuffer.trim());
        }

        setHistory((prev) =>
          prev
            .map((item) => (item.id === aiId ? { ...item, text: visible, isStreaming: false } : item))
            .filter((item) => !(item.id === aiId && !String(item.text || '').trim()))
        );

        setIsThinking(false);
        abortControllerRef.current = null;
        scrollToBottom();
      },
      onError: (error) => {
        setIsThinking(false);
        abortControllerRef.current = null;

        setHistory((prev) => [
          ...prev.filter((item) => item.id !== aiId),
          {
            id: nowId(),
            role: 'error',
            text: error?.message || 'AI 请求失败'
          }
        ]);
      }
    });
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
    if (!SpeechRec) {
      alert('当前浏览器不支持语音识别');
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsThinking(false);
    }

    if (isAiSpeaking) ttsEngine.stopAndClear();
    if (recognitionRef.current || showLangPicker) return;

    const recognition = new SpeechRec();
    recognition.lang = recLang;
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    clearRecordingBuffer();
    hasAutoSentRef.current = false;
    setIsRecording(true);

    recognition.onresult = (event) => {
      let interimText = '';
      let mergedFinal = finalTextRef.current;

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) {
          mergedFinal = mergeTranscript(mergedFinal, transcript);
        } else {
          interimText += transcript;
        }
      }

      finalTextRef.current = mergedFinal;
      speechDisplayRef.current = mergeTranscript(mergedFinal, interimText);

      setRecordFinalText(mergedFinal);
      setLiveInterim(interimText);
      setInputText(speechDisplayRef.current);

      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = setTimeout(() => {
        if (speechDisplayRef.current.trim() && !hasAutoSentRef.current) {
          finishRecordingAndSend(speechDisplayRef.current);
        }
      }, toFinite(settings?.asrSilenceMs, 1500));
    };

    recognition.onerror = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
      if (!hasAutoSentRef.current && speechDisplayRef.current.trim()) {
        finishRecordingAndSend(speechDisplayRef.current);
      }
    };

    recognitionRef.current = recognition;
    if (navigator.vibrate) navigator.vibrate(30);

    try {
      recognition.start();
    } catch {}
  };

  const replaySpecificAnswer = (text) => {
    if (!text) return;
    ttsEngine.stopAndClear();
    ttsEngine.push(text);
  };

  const handleMicPointerDown = (event) => {
    event.preventDefault();
    if (showLangPicker) return;

    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTriggeredRef.current = false;

    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      if (navigator.vibrate) navigator.vibrate(45);
      longPressTimerRef.current = null;
    }, 550);
  };

  const handleMicPointerUp = (event) => {
    event.preventDefault();

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      setShowLangPicker(true);
      return;
    }

    if (micActionLockRef.current || showLangPicker) return;
    micActionLockRef.current = true;
    setTimeout(() => {
      micActionLockRef.current = false;
    }, 220);

    if (isRecording) finishRecordingAndSend(speechDisplayRef.current);
    else startRecording();
  };

  const handleMicPointerCancel = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressTriggeredRef.current = false;
  };

  useEffect(() => () => stopEverything(), []);

  useEffect(() => {
    if (!open) {
      stopEverything();
      setHistory([]);
      historyRef.current = [];
      bootstrappedRef.current = false;
      setTextMode(defaultTextMode);
      return;
    }

    const builder = bootstrapBuilder || (scene === 'exercise_explainer' ? buildExerciseBootstrapPrompt : null);
    if (!bootstrappedRef.current && builder) {
      const bootstrapText = builder(initialPayload);
      if (bootstrapText) {
        bootstrappedRef.current = true;
        void sendHiddenMessage(bootstrapText);
      }
    }
  }, [open, defaultTextMode, scene, initialPayload, bootstrapBuilder]);

  return {
    history,
    isThinking,
    isAiSpeaking,
    textMode,
    setTextMode,
    inputText,
    setInputText,
    liveInterim,
    recordFinalText,
    isRecording,
    currentLangObj,
    scrollRef,
    sendMessage,
    stopEverything,
    clearRecordingBuffer,
    startRecording,
    replaySpecificAnswer,
    recLang,
    setRecLang,
    showLangPicker,
    setShowLangPicker,
    handleMicPointerDown,
    handleMicPointerUp,
    handleMicPointerCancel,
    showText,
    setShowText
  };
}
