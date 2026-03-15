'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ttsEngine } from './ttsEngine';
import { normalizeAssistantText, mergeTranscript, nowId, splitSpeakable } from './aiTextUtils';
import { RECOGNITION_LANGS, AI_REC_LANG_KEY } from './aiConfig';

/**
 * 说明：
 * 1. 这份 hook 兼容你目前的选择题 / 排序题 initialPayload
 * 2. settings 兼容你现在题组件里传进来的 aiSettings 结构：
 *    {
 *      apiUrl,
 *      apiKey,
 *      model,
 *      temperature,
 *      systemPrompt,
 *      ttsApiUrl,
 *      zhVoice,
 *      myVoice,
 *      ttsSpeed,
 *      ttsPitch,
 *      showText,
 *      asrSilenceMs
 *    }
 * 3. 不强依赖 aiPrompts.js，避免你当前项目接入时还要先改别的文件
 */

const DEFAULT_INTERACTIVE_PROMPT = `
你是一位互动题解析老师，请像一个耐心、会引导学生思考的老师一样回答。
规则：
1. 不要输出 Markdown 格式（不要 **、#、列表符号这些）。
2. 回答优先简洁、自然、口语化。
3. 核心考点、正确表达、正确句子用中文示范。
4. 原理、误区、细节解释可用缅文辅助说明。
5. 如果学生答错了，先理解学生为什么会错，再指出关键误区。
6. 如果题目是排序题，要解释顺序逻辑。
7. 如果题目是选择题，要解释正确项为什么对、错误项为什么容易误选。
8. 每次回答尽量控制在短一些，方便语音朗读。
`.trim();

const toFinite = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

function guessPayloadType(payload) {
  if (!payload || typeof payload !== 'object') return 'interactive';

  if (
    payload?.extraContext?.rawType === 'sorting' ||
    payload?.grammarPoint?.includes?.('排序') ||
    payload?.grammarPoint?.includes?.('连词成句')
  ) {
    return 'sorting';
  }

  if (Array.isArray(payload?.options) && payload.options.length) {
    return 'choice';
  }

  return 'interactive';
}

function buildChoicePrompt(payload) {
  const {
    questionText = '',
    options = [],
    selectedIds = [],
    correctAnswers = [],
    isRight = false
  } = payload || {};

  const normalizedOptions = Array.isArray(options) ? options : [];

  const selectedTexts = normalizedOptions
    .filter((opt) => selectedIds.map(String).includes(String(opt.id)))
    .map((opt) => opt.text || '');

  const correctTexts = normalizedOptions
    .filter((opt) => correctAnswers.map(String).includes(String(opt.id)))
    .map((opt) => opt.text || '');

  return `
这是一个选择题，请先主动给我讲解这道题。

题目：${questionText || '无'}
选项：
${normalizedOptions.map((o) => `${o.id}. ${o.text || ''}`).join('\n') || '无'}

学生选择：${selectedTexts.length ? selectedTexts.join('、') : '未选择'}
正确答案：${correctTexts.length ? correctTexts.join('、') : '未知'}
结果：${isRight ? '学生答对了' : '学生答错了'}

请先完成这些事：
1. 先说这题在考什么
2. 解释为什么正确答案是这个
3. 如果学生答错了，站在学生角度分析为什么容易选错
4. 顺便指出错误选项的关键误区
5. 最后用一句自然中文总结正确理解方式

讲完后，等待学生继续追问。
`.trim();
}

function buildSortingPrompt(payload) {
  const {
    grammarPoint = '',
    questionText = '',
    options = [],
    selectedIds = [],
    correctAnswers = [],
    isRight = false,
    extraContext = {}
  } = payload || {};

  const allWords = extraContext?.allWords || '';
  const userSentence = extraContext?.userSentence || '';
  const correctSentence = extraContext?.correctSentence || '';

  const normalizedOptions = Array.isArray(options) ? options : [];

  const selectedTexts = normalizedOptions
    .filter((opt) => selectedIds.map(String).includes(String(opt.id)))
    .map((opt) => opt.text || '');

  const correctTexts = normalizedOptions
    .filter((opt) => correctAnswers.map(String).includes(String(opt.id)))
    .map((opt) => opt.text || '');

  return `
这是一个排序题 / 连词成句题，请先主动讲解这道题。

题型：${grammarPoint || '排序题'}
题目：${questionText || '请把词语排成正确顺序'}
可用词语：${allWords || normalizedOptions.map((o) => o.text || '').join(' / ') || '无'}
学生当前排序：${selectedTexts.length ? selectedTexts.join(' / ') : userSentence || '未作答'}
正确顺序：${correctTexts.length ? correctTexts.join(' / ') : correctSentence || '未知'}
学生拼成的句子：${userSentence || '无'}
正确句子：${correctSentence || '无'}
结果：${isRight ? '学生答对了' : '学生答错了'}

请先完成这些事：
1. 说明这题考什么
2. 解释正确顺序为什么是这样
3. 说明这个句子的语义逻辑 / 语法逻辑 / 语序逻辑
4. 如果学生答错了，分析最容易排错的位置
5. 用自然中文给出正确整句，并鼓励学生跟读

讲完后，等待学生继续追问或跟读。
`.trim();
}

function buildGenericInteractivePrompt(payload) {
  const {
    questionText = '',
    options = [],
    selectedIds = [],
    correctAnswers = [],
    isRight = false,
    extraContext = {}
  } = payload || {};

  const normalizedOptions = Array.isArray(options) ? options : [];

  const selectedTexts = normalizedOptions
    .filter((opt) => selectedIds.map(String).includes(String(opt.id)))
    .map((opt) => opt.text || '');

  const correctTexts = normalizedOptions
    .filter((opt) => correctAnswers.map(String).includes(String(opt.id)))
    .map((opt) => opt.text || '');

  return `
这是当前互动题，请先主动给我讲解。

题目：${questionText || '无'}
选项：${normalizedOptions.length ? normalizedOptions.map((o) => `${o.id}. ${o.text || ''}`).join('；') : '无'}
学生选择：${selectedTexts.length ? selectedTexts.join('、') : '未选择'}
正确答案：${correctTexts.length ? correctTexts.join('、') : '未知'}
结果：${isRight ? '学生答对了' : '学生答错了'}
补充信息：${JSON.stringify(extraContext || {}, null, 2)}

请先完成这些事：
1. 解释这题考什么
2. 说明为什么正确答案是这个
3. 如果学生答错了，先分析为什么会这样想
4. 给出更自然的理解方式
5. 最后等学生继续追问

讲完后，等待学生继续追问或跟读。
`.trim();
}

function buildInteractiveBootstrapPrompt(payload) {
  if (!payload) return '';

  const type = guessPayloadType(payload);

  if (type === 'sorting') return buildSortingPrompt(payload);
  if (type === 'choice') return buildChoicePrompt(payload);
  return buildGenericInteractivePrompt(payload);
}

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

  const currentLangObj =
    RECOGNITION_LANGS.find((l) => l.code === recLang) || RECOGNITION_LANGS[0];

  const initialSystemPrompt = useMemo(() => {
    return String(settings?.systemPrompt || DEFAULT_INTERACTIVE_PROMPT).trim();
  }, [settings?.systemPrompt]);

  useEffect(() => {
    try {
      const lang = localStorage.getItem(AI_REC_LANG_KEY);
      if (lang && RECOGNITION_LANGS.some((l) => l.code === lang)) {
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
    initialPayloadRef.current = initialPayload;
  }, [initialPayload]);

  useEffect(() => {
    setShowText(settings?.showText ?? true);
  }, [settings?.showText]);

  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 40);
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

    setIsRecording(false);
    setIsThinking(false);
    setIsAiSpeaking(false);
    setShowLangPicker(false);
  };

  const stopAndSend = (textToForce) => {
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

    const finalStr = String(
      textToForce !== undefined ? textToForce : speechDisplayRef.current
    ).trim();

    speechDisplayRef.current = '';
    finalTextRef.current = '';
    setInputText('');

    if (finalStr) {
      sendMessage(finalStr);
    }
  };

  const runAIRequest = async ({ content, visibleUserMessage = true }) => {
    const text = String(content || '').trim();
    if (!text) return;

    if (!settings?.apiUrl || !settings?.apiKey || !settings?.model) {
      setHistory((prev) => [
        ...prev,
        {
          id: nowId(),
          role: 'error',
          text: '请先在 AI 设置里填写 API URL、API Key 和模型。'
        }
      ]);
      return;
    }

    if (sendLockRef.current) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      ttsEngine.stopAndClear();
    }
    sendLockRef.current = true;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);

    ttsEngine.unlockAudio();
    ttsEngine.stopAndClear();

    const currentRequestId = ++requestIdRef.current;
    setIsThinking(true);

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

    try {
      const cleanedHistory = newHistory.filter((h) => {
        if (
          h.role === 'error' ||
          (h.role === 'ai' && !String(h.text || '').trim()) ||
          (h.role === 'user' && !String(h.text || '').trim())
        ) {
          return false;
        }
        return true;
      });

      const messages = [
        { role: 'system', content: initialSystemPrompt },
        ...cleanedHistory.map((h) => ({
          role: h.role === 'ai' ? 'assistant' : 'user',
          content: String(h.text || '').trim()
        })),
        ...(visibleUserMessage ? [] : [{ role: 'user', content: text }])
      ];

      const res = await fetch(
        `${String(settings?.apiUrl || '').replace(/\/+$/, '')}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${settings?.apiKey || ''}`
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: settings?.model,
            temperature: toFinite(settings?.temperature, 0.3),
            stream: true,
            messages
          })
        }
      );

      if (!res.ok) {
        let extra = '';
        try {
          extra = await res.text();
        } catch {}
        throw new Error(`API Error: ${res.status}${extra ? ` - ${extra}` : ''}`);
      }

      if (!res.body) throw new Error('API 返回为空');

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let raw = '';
      let fullText = '';
      let sentenceBuffer = '';
      let gotFirstChunk = false;

      const pushChunk = (chunk) => {
        if (!chunk) return;

        if (!gotFirstChunk) {
          gotFirstChunk = true;
          if (currentRequestId === requestIdRef.current) {
            setIsThinking(false);
          }
        }

        fullText += chunk;
        sentenceBuffer += chunk;

        const visible = normalizeAssistantText(fullText);

        if (currentRequestId === requestIdRef.current) {
          setHistory((prev) =>
            prev.map((m) => (m.id === aiMsgId ? { ...m, text: visible } : m))
          );
          scrollToBottom();
        }

        const { sentences, rest } = splitSpeakable(sentenceBuffer);
        if (sentences.length) {
          for (const s of sentences) {
            if (!controller.signal.aborted && currentRequestId === requestIdRef.current) {
              ttsEngine.push(s);
            }
          }
          sentenceBuffer = rest;
        }
      };

      while (true) {
        if (controller.signal.aborted || currentRequestId !== requestIdRef.current) break;

        const { done, value } = await reader.read();
        if (done) break;

        raw += decoder.decode(value, { stream: true });
        const parts = raw.split(/\r?\n/);
        raw = parts.pop() || '';

        for (const line of parts) {
          if (controller.signal.aborted || currentRequestId !== requestIdRef.current) break;

          const ln = line.trim();
          if (!ln || !ln.startsWith('data:')) continue;

          const payload = ln.slice(5).trim();
          if (!payload || payload === '[DONE]') continue;

          try {
            const data = JSON.parse(payload);
            const chunk =
              data?.choices?.[0]?.delta?.content ||
              data?.choices?.[0]?.message?.content ||
              data?.choices?.[0]?.text ||
              data?.delta?.content ||
              data?.text ||
              '';

            pushChunk(chunk);
          } catch {
            // 忽略坏 chunk
          }
        }
      }

      const tail = raw.trim();
      if (tail.startsWith('data:')) {
        const payload = tail.slice(5).trim();
        if (payload && payload !== '[DONE]') {
          try {
            const data = JSON.parse(payload);
            const chunk =
              data?.choices?.[0]?.delta?.content ||
              data?.choices?.[0]?.message?.content ||
              data?.choices?.[0]?.text ||
              data?.delta?.content ||
              data?.text ||
              '';
            pushChunk(chunk);
          } catch {}
        }
      }

      if (
        sentenceBuffer.trim() &&
        !controller.signal.aborted &&
        currentRequestId === requestIdRef.current
      ) {
        ttsEngine.push(sentenceBuffer.trim());
      }
    } catch (err) {
      if (err?.name !== 'AbortError' && currentRequestId === requestIdRef.current) {
        setHistory((prev) => [
          ...prev.filter((m) => m.id !== aiMsgId),
          { id: nowId(), role: 'error', text: err?.message || 'AI 请求失败' }
        ]);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsThinking(false);
        abortControllerRef.current = null;

        setHistory((prev) =>
          prev
            .map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m))
            .filter((m) => !(m.id === aiMsgId && !String(m.text || '').trim()))
        );
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

    const rec = new SpeechRec();
    rec.lang = recLang;
    rec.interimResults = true;
    rec.continuous = true;
    rec.maxAlternatives = 1;

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

    rec.onerror = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    rec.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;

      if (!hasAutoSentRef.current && speechDisplayRef.current.trim()) {
        stopAndSend(speechDisplayRef.current);
      }
    };

    recognitionRef.current = rec;
    if (navigator.vibrate) navigator.vibrate(30);

    try {
      rec.start();
    } catch {}
  };

  const replaySpecificAnswer = (text) => {
    if (!text) return;
    ttsEngine.stopAndClear();
    ttsEngine.push(text);
  };

  const handleMicPointerDown = (e) => {
    e.preventDefault();
    if (showLangPicker) return;

    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTriggeredRef.current = false;

    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      if (navigator.vibrate) navigator.vibrate(45);
      longPressTimerRef.current = null;
    }, 550);
  };

  const handleMicPointerUp = (e) => {
    e.preventDefault();

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

    if (isRecording) stopAndSend(speechDisplayRef.current);
    else startRecording();
  };

  const handleMicPointerCancel = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressTriggeredRef.current = false;
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
      bootstrappedRef.current = false;
    } else if (!bootstrappedRef.current) {
      const payload = initialPayloadRef.current;
      const firstPrompt = buildInteractiveBootstrapPrompt(payload);

      if (firstPrompt) {
        bootstrappedRef.current = true;
        sendHiddenMessage(firstPrompt);
      }
    }
  }, [open]);

  useEffect(() => {
    return () => stopEverything();
  }, []);

  return {
    history,
    isThinking,
    isAiSpeaking,
    textMode,
    setTextMode,
    inputText,
    setInputText,
    isRecording,
    currentLangObj,
    scrollRef,
    sendMessage,
    startRecording,
    stopAndSend,
    stopEverything,
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
