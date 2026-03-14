'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaArrowLeft,
  FaPaperPlane,
  FaMicrophone,
  FaStop,
  FaRobot,
  FaVolumeUp,
  FaKeyboard
} from 'react-icons/fa';
import { streamChatCompletion } from './aiService';
import { ttsEngine } from './ttsEngine';
import { normalizeAssistantText, mergeTranscript, nowId } from './aiTextUtils';

const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes ping-slow { 75%, 100% { transform: scale(2); opacity: 0; } }
    .animate-ping-slow { animation: ping-slow 1.6s cubic-bezier(0,0,0.2,1) infinite; }
    @keyframes pulse-ring {
      0% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(236,72,153,.55); }
      70% { transform: scale(1); box-shadow: 0 0 0 18px rgba(236,72,153,0); }
      100% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(236,72,153,0); }
    }
    .animate-pulse-ring { animation: pulse-ring 1.3s infinite; }
    @keyframes bars {
      0%,100% { transform: scaleY(.35); opacity:.45; }
      50% { transform: scaleY(1); opacity:1; }
    }
    .tts-bars span {
      display:inline-block; width:4px; height:20px; border-radius:4px;
      background: linear-gradient(180deg,#f9a8d4,#a78bfa);
      margin:0 2px; transform-origin: bottom;
      animation: bars 0.55s ease-in-out infinite;
    }
    .tts-bars span:nth-child(2){ animation-delay:.06s; }
    .tts-bars span:nth-child(3){ animation-delay:.12s; }
    .tts-bars span:nth-child(4){ animation-delay:.18s; }
    .tts-bars span:nth-child(5){ animation-delay:.24s; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);

const RECOGNITION_LANGS = [
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'my-MM', name: '缅语', flag: '🇲🇲' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' }
];

export default function InteractiveAIExplanationPanel({
  open,
  onClose,
  settings,
  title = 'AI 讲题老师',
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

  const currentLangObj = RECOGNITION_LANGS.find((l) => l.code === recLang) || RECOGNITION_LANGS[0];
  const liveText = mergeTranscript(recordFinalText, liveInterim);

  const initialSystemPrompt = useMemo(() => {
    return settings?.systemPrompt || '你是一位互动题解析老师。请用简洁中文解释并引导学生。不要输出Markdown格式。';
  }, [settings]);

  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
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
      try { recognitionRef.current.stop(); } catch (_) {}
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
    const { questionText, options, selectedIds, correctAnswers, isRight } = payload;
    const selectedTexts = options.filter(opt => selectedIds.includes(String(opt.id))).map(opt => opt.text);
    const correctTexts = options.filter(opt => correctAnswers.includes(String(opt.id))).map(opt => opt.text);

    return `这是当前题目，请先主动给我讲解这道题：\n题目：${questionText || '无'}\n选项：${options.map(o => `${o.id}. ${o.text}`).join('；')}\n学生选择：${selectedTexts.length ? selectedTexts.join('、') : '未选择'}\n正确答案：${correctTexts.length ? correctTexts.join('、') : '未知'}\n结果：${isRight ? '学生答对了' : '学生答错了'}\n请先完成三件事：\n1. 解释考什么\n2. 说明正确答案原因\n3. 指出错误选项误区\n然后等待学生追问。`;
  };

  const sendMessage = async (text) => {
    const content = String(text || '').trim();
    if (!content) return;

    stopEverything();

    const aiMsgId = nowId();
    const newHistory = [...historyRef.current, { id: nowId(), role: 'user', text: content }];
    setHistory([...newHistory, { id: aiMsgId, role: 'ai', text: '', isStreaming: true }]);
    scrollToBottom();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const messages = [
      { role: 'system', content: initialSystemPrompt },
      ...newHistory.map((h) => ({ role: h.role === 'ai' ? 'assistant' : 'user', content: h.text }))
    ];

    await streamChatCompletion({
      settings: {
        apiUrl: settings?.apiUrl,
        apiKey: settings?.apiKey,
        model: settings?.model,
        temperature: settings?.temperature,
        ttsApiUrl: settings?.ttsApiUrl,
        ttsVoice: settings?.zhVoice || settings?.ttsVoice,
        ttsSpeed: settings?.ttsSpeed,
        ttsPitch: settings?.ttsPitch
      },
      messages,
      signal: controller.signal,
      onStart: () => setIsThinking(true),
      onUpdate: (fullText) => {
        setIsThinking(false);
        const visible = normalizeAssistantText(fullText);
        setHistory((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, text: visible } : m)));
        scrollToBottom();
      },
      onSentence: (sentence) => ttsEngine.push(sentence),
      onFinished: () => {
        setIsThinking(false);
        abortControllerRef.current = null;
        setHistory((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m)));
      },
      onError: (err) => {
        setIsThinking(false);
        setHistory((prev) => [...prev, { id: nowId(), role: 'error', text: err?.message || 'AI 请求失败' }]);
      }
    });
  };

  const startRecording = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return alert('当前浏览器不支持语音识别');

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
        if (e.results[i].isFinal) recordingFinalRef.current = mergeTranscript(recordingFinalRef.current, t);
        else interimText += `${t} `;
      }
      interimRef.current = interimText.trim();
      setRecordFinalText(recordingFinalRef.current);
      setLiveInterim(interimRef.current);

      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(() => manualSubmitRecording(), 1400);
    };

    rec.onerror = () => stopRecordingOnly();
    rec.onend = () => stopRecordingOnly();

    recognitionRef.current = rec;
    if (navigator.vibrate) navigator.vibrate(30);
    try { rec.start(); } catch (_) {}
  };

  const manualSubmitRecording = () => {
    const finalText = mergeTranscript(recordingFinalRef.current, interimRef.current).trim();
    stopRecordingOnly();
    if (finalText) sendMessage(finalText);
  };

  const replayLastAnswer = () => {
    const lastAI = [...history].reverse().find((item) => item.role === 'ai' && item.text);
    if (!lastAI) return;
    ttsEngine.stopAndClear();
    ttsEngine.push(lastAI.text);
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
      setBootstrapped(false);
      return;
    }
    if (open && initialPayload && !bootstrapped) {
      const firstPrompt = buildBootstrapPrompt(initialPayload);
      if (firstPrompt) {
        setBootstrapped(true);
        sendMessage(firstPrompt);
      }
    }
    return () => stopEverything();
  }, [open, bootstrapped, initialPayload]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex flex-col w-full h-[100dvh] bg-slate-950 text-slate-100 overflow-hidden">
      <GlobalStyles />
      <div className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-950/90 pointer-events-none" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4 h-16 border-b border-white/10 backdrop-blur-sm">
        <button onClick={() => { stopEverything(); onClose?.(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-90"><FaArrowLeft /></button>
        <div className="font-bold tracking-widest text-white text-sm">{title}</div>
        <button onClick={stopEverything} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white"><FaStop /></button>
      </div>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative p-4 pb-36 flex flex-col z-10">
        <div className="w-full max-w-2xl mx-auto min-h-full flex flex-col justify-end">
          {history.map((msg) => {
            if (msg.role === 'error') return <div key={msg.id} className="mb-4 pl-12 text-red-300 text-sm">{msg.text}</div>;
            if (msg.role === 'user') return <div key={msg.id} className="mb-3 pl-12 text-[15px] leading-7 text-slate-300 whitespace-pre-wrap">{msg.text}</div>;
            
            const aiText = normalizeAssistantText(msg.text || '');
            return (
              <div key={msg.id} className="mb-4 flex items-start gap-3">
                <div className="mt-0.5 w-9 h-9 rounded-full bg-pink-500/30 border border-pink-400/50 flex items-center justify-center text-pink-100 shrink-0"><FaRobot size={14} /></div>
                <div className="flex-1 pt-0.5 text-[15px] leading-7 text-slate-100 whitespace-pre-wrap">
                  {aiText || (msg.isStreaming ? '思考中...' : '')}
                  {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-pink-400 animate-pulse" />}
                </div>
              </div>
            );
          })}
          {isRecording && (
            <div className="flex justify-start pl-12 mb-2">
              <div className="max-w-[92%] text-cyan-100 rounded-xl px-3 py-2 text-sm bg-cyan-500/20 border border-cyan-400/40">
                <span className="opacity-80 mr-2">识别中：</span><span>{liveText || '...'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Control */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-[max(24px,env(safe-area-inset-bottom))] px-5 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-12">
        <div className="max-w-md mx-auto relative flex items-center justify-center h-20">
          <button onClick={() => setTextMode((v) => !v)} className="absolute left-0 w-12 h-12 rounded-full bg-white/15 text-white active:scale-95 transition-transform">
            {textMode ? <FaMicrophone /> : <FaKeyboard />}
          </button>

          {!textMode ? (
            <div className="flex flex-col items-center w-full">
              <button
                onClick={() => { isRecording ? manualSubmitRecording() : startRecording(); }}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${isRecording ? 'bg-red-500 animate-pulse-ring scale-95' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95'}`}
              >
                {isRecording ? <FaPaperPlane className="text-3xl animate-pulse" /> : <FaMicrophone className="text-3xl" />}
              </button>
              <div className="absolute -bottom-6 text-[10px] font-bold text-slate-400 tracking-widest uppercase pointer-events-none">
                {isRecording ? <span className="text-red-400">点击发送 · 静默自动发送</span> : isThinking ? <span className="text-amber-300">思考中...</span> : isAiSpeaking ? <div className="tts-bars"><span /><span /><span /><span /><span /></div> : `语音对话 · ${currentLangObj.flag}`}
              </div>
            </div>
          ) : (
            <div className="flex-1 ml-16 mr-16 relative flex items-center bg-white/10 border border-white/20 rounded-full p-1 backdrop-blur-md">
              <input type="text" className="flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none" placeholder="继续问老师..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { sendMessage(inputText); setInputText(''); } }} />
              <button onClick={() => { sendMessage(inputText); setInputText(''); }} className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0"><FaPaperPlane /></button>
            </div>
          )}

          <div className="absolute right-0">
            {(isAiSpeaking || isRecording || isThinking) ? (
              <button onClick={stopEverything} className="w-12 h-12 rounded-full bg-white/15 text-white"><FaStop /></button>
            ) : (
              <button onClick={replayLastAnswer} className="w-12 h-12 rounded-full bg-white/15 text-white"><FaVolumeUp /></button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
