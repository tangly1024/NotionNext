'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ttsEngine } from './ttsEngine';
import { normalizeAssistantText, mergeTranscript, nowId } from './aiTextUtils';

const RECOGNITION_LANGS = [
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'my-MM', name: '缅语', flag: '🇲🇲' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' }
];

export function useInteractiveAITutor({
  open,
  settings,
  initialPayload = null
}) {
  const [history, setHistory] = useState([]);
  const historyRef = useRef([]);

  const [isThinking, setIsThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  const [textMode, setTextMode] = useState(true);
  const [inputText, setInputText] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [recordFinalText, setRecordFinalText] = useState('');
  const [liveInterim, setLiveInterim] = useState('');
  const [recLang] = useState('zh-CN');

  const [bootstrapped, setBootstrapped] = useState(false);

  const scrollRef = useRef(null);
  const abortControllerRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  const recordingFinalRef = useRef('');
  const interimRef = useRef('');

  const currentLangObj =
    RECOGNITION_LANGS.find((l) => l.code === recLang) || RECOGNITION_LANGS[0];

  const liveText = mergeTranscript(recordFinalText, liveInterim);

  const initialSystemPrompt = useMemo(() => {
    return (
      settings?.systemPrompt ||
      '你是一位互动题解析老师。请用简洁中文解释并引导学生。不要输出Markdown格式。'
    );
  }, [settings]);

  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 40);
  };

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const clearRecordingBuffer = () => {
    recordingFinalRef.current = '';
    interimRef.current = '';
    setRecordFinalText('');
    setLiveInterim('');
  };

  const stopRecordingOnly = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
    clearSilenceTimer();
    setIsRecording(false);
  };

  const stopEverything = () => {
    stopRecordingOnly();
    clearRecordingBuffer();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    ttsEngine.stopAndClear();
    setIsThinking(false);
    setIsAiSpeaking(false);
  };

  const buildBootstrapPrompt = (payload) => {
    if (!payload) return '';

    const {
      questionText = '',
      options = [],
      selectedIds = [],
      correctAnswers = [],
      isRight = false
    } = payload;

    const selectedTexts = options
      .filter((opt) => selectedIds.includes(String(opt.id)))
      .map((opt) => opt.text);

    const correctTexts = options
      .filter((opt) => correctAnswers.includes(String(opt.id)))
      .map((opt) => opt.text);

    return `
这是当前题目，请先主动给我讲解这道题：

题目：${questionText || '无'}
选项：${options.map((o) => `${o.id}. ${o.text}`).join('；')}
学生选择：${selectedTexts.length ? selectedTexts.join('、') : '未选择'}
正确答案：${correctTexts.length ? correctTexts.join('、') : '未知'}
结果：${isRight ? '学生答对了' : '学生答错了'}

请先完成三件事：
1. 解释这题考什么
2. 说明为什么正确答案是这个
3. 如果学生答错了，指出错误选项的关键误区

然后等待学生继续追问。
`.trim();
  };

  const runAIRequest = async ({ content, visibleUserMessage = true }) => {
    const text = String(content || '').trim();
    if (!text) return;

    stopEverything();

    const baseHistory = [...historyRef.current];
    let newHistory = baseHistory;

    if (visibleUserMessage) {
      newHistory = [...baseHistory, { id: nowId(), role: 'user', text }];
    }

    const aiMsgId = nowId();
    setHistory([...newHistory, { id: aiMsgId, role: 'ai', text: '', isStreaming: true }]);
    scrollToBottom();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const messages = [
      { role: 'system', content: initialSystemPrompt },
      ...newHistory.map((h) => ({
        role: h.role === 'ai' ? 'assistant' : 'user',
        content: h.text
      })),
      ...(visibleUserMessage ? [] : [{ role: 'user', content: text }])
    ];

    try {
      setIsThinking(true);

      const res = await fetch(`${settings?.apiUrl?.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings?.apiKey || ''}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: settings?.model,
          temperature: settings?.temperature,
          stream: false,
          messages
        })
      });

      if (!res.ok) {
        throw new Error(`AI Error: ${res.status}`);
      }

      const json = await res.json();

      const fullText =
        json?.choices?.[0]?.message?.content ||
        json?.reply ||
        json?.text ||
        '';

      if (!fullText) {
        throw new Error('AI 没有返回内容');
      }

      const visible = normalizeAssistantText(fullText);

      setHistory((prev) =>
        prev.map((m) =>
          m.id === aiMsgId ? { ...m, text: visible, isStreaming: false } : m
        )
      );

      setIsThinking(false);
      abortControllerRef.current = null;
      scrollToBottom();

      ttsEngine.push(visible);
    } catch (err) {
      if (err?.name === 'AbortError') return;

      setIsThinking(false);
      setHistory((prev) => [
        ...prev,
        { id: nowId(), role: 'error', text: err?.message || 'AI 请求失败' }
      ]);
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
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('当前浏览器不支持语音识别');
      return;
    }

    stopEverything();

    const rec = new SpeechRec();
    rec.lang = recLang;
    rec.interimResults = true;
    rec.continuous = true;
    rec.maxAlternatives = 1;

    setIsRecording(true);

    rec.onresult = (e) => {
      let interimText = '';

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = (e.results[i][0]?.transcript || '').trim();
        if (!t) continue;

        if (e.results[i].isFinal) {
          recordingFinalRef.current = mergeTranscript(recordingFinalRef.current, t);
        } else {
          interimText += `${t} `;
        }
      }

      interimRef.current = interimText.trim();
      setRecordFinalText(recording     rec.onerror = () => stopRecordingOnly();
    rec.onend = () => stopRecordingOnly();

    recognitionRef.current = rec;

    if (navigator.vibrate) navigator.vibrate(30);

    try {
      rec.start();
    } catch (_) {}
  };

  const manualSubmitRecording = () => {
    const finalText = mergeTranscript(recordingFinalRef.current, interimRef.current).trim();
    stopRecordingOnly();
    if (finalText) sendMessage(finalText);
  };

  const replayLastAnswer = () => {
    const lastAI = [...historyRef.current]
      .reverse()
      .find((item) => item.role === 'ai' && item.text);

    if (!lastAI) return;

    ttsEngine.stopAndClear();
    ttsEngine.push(lastAI.text);
  };

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    ttsEngine.setStateCallback(({ isPlaying }) => setIsAiSpeaking(isPlaying));
    return () => ttsEngine.setStateCallback(null);
  }, []);

  useEffect(() => {
    if (!open) {
      stopEverything();
      setHistory([]);
      setBootstrapped(false);
      return;
    }

    if (open && initialPayload && !bootstrapped) {
      const firstPrompt = buildBootstrapPrompt(initialPayload);
      if (firstPrompt) {
        setBootstrapped(true);
        sendHiddenMessage(firstPrompt);
      }
    }

    return () => stopEverything();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, bootstrapped, initialPayload]);

  return {
    history,
    isThinking,
    isAiSpeaking,
    textMode,
    setTextMode,
    inputText,
    setInputText,
    isRecording,
    recordFinalText,
    liveInterim,
    liveText,
    currentLangObj,
    scrollRef,
    sendMessage,
    startRecording,
    manualSubmitRecording,
    stopEverything,
    replayLastAnswer
  };
  }
