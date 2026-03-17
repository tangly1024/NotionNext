'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FaArrowLeft,
  FaPaperPlane,
  FaMicrophone,
  FaStop,
  FaKeyboard,
  FaVolumeUp,
  FaSlidersH,
  FaClosedCaptioning,
  FaCommentSlash
} from 'react-icons/fa';
import { pinyin } from 'pinyin-pro';
import { AI_SCENES, buildExerciseBootstrapPrompt } from './aiAssistants';
import { normalizeAssistantText } from './aiTextUtils';
import { useAISettings } from './useAISettings';
import { useAISession } from './useAISession';
import AISettingsModal from './AISettingsModal';
import RecognitionLanguagePicker from './RecognitionLanguagePicker';

const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    .no-select { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
    .can-select { -webkit-user-select: text; user-select: text; }

    @keyframes recording-wave {
      0% { height: 8px; }
      50% { height: 32px; }
      100% { height: 8px; }
    }
    .wave-bar {
      width: 4px; border-radius: 4px; background: #ec4899;
      animation: recording-wave 0.6s ease-in-out infinite;
    }

    @keyframes pulse-bg {
      0% { background-color: rgba(236, 72, 153, 0); }
      50% { background-color: rgba(236, 72, 153, 0.05); }
      100% { background-color: rgba(236, 72, 153, 0); }
    }
    .animate-recording-bg { animation: pulse-bg 2s infinite; }

    @keyframes avatar-ripple {
      0% { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    .ripple { border: 1px solid #ec4899; position: absolute; inset: 0; border-radius: 9999px; animation: avatar-ripple 2s linear infinite; }
  `}</style>
);

const SHARED_KEYS = ['providerId', 'apiUrl', 'apiKey', 'model', 'ttsApiUrl', 'ttsVoice', 'zhVoice', 'myVoice', 'ttsSpeed', 'ttsPitch', 'soundFx', 'vibration'];

const PinyinText = React.memo(({ text = '', showPinyin = false, isStreaming = false }) => {
  const tokens = useMemo(() => {
    if (!text) return [];
    const pyArray = pinyin(text, { type: 'array', toneType: 'symbol', nonZh: 'removed' });
    let pyIndex = 0;
    const result = [];
    const chars = Array.from(text);
    for (let char of chars) {
      const isZh = /[\u4e00-\u9fa5]/.test(char);
      if (isZh) {
        result.push({ text: char, isZh: true, py: pyArray[pyIndex++] || '' });
      } else {
        result.push({ text: char, isZh: false });
      }
    }
    return result;
  }, [text]);

  return (
    <div className="flex flex-wrap items-end text-[18px] text-slate-800 font-medium leading-[2] tracking-wide gap-y-4">
      {tokens.map((t, idx) => (
        <div key={idx} className="flex flex-col items-center justify-end mx-[1px]">
          {showPinyin && t.isZh && (
            <span className="text-[10px] leading-none text-blue-500/80 mb-[2px] font-normal scale-90 origin-bottom">
              {t.py}
            </span>
          )}
          <span className="leading-none">{t.text}</span>
        </div>
      ))}
      {isStreaming && <span className="ml-1 w-[3px] h-[20px] bg-pink-500 animate-pulse rounded-full" />}
    </div>
  );
});

export default function InteractiveAIExplanationPanel({ open, title = 'AI 讲题老师', initialPayload = null, onClose, settings, updateSettings }) {
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const pressTimer = useRef(null);

  const { resolvedSettings, updateSharedSettings, updateSceneSettings } = useAISettings(AI_SCENES.EXERCISE);
  const effectiveSettings = settings || resolvedSettings;
  const isAIReady = useMemo(() => Boolean(effectiveSettings?.apiKey && effectiveSettings?.apiUrl && effectiveSettings?.model), [effectiveSettings]);

  const { history = [], isThinking, isAiSpeaking, textMode, setTextMode, inputText = '', setInputText, isRecording, scrollRef, sendMessage, stopEverything, handleMicPointerDown, handleMicPointerUp, handleMicPointerCancel, replaySpecificAnswer, showText, setShowText, showLangPicker, setShowLangPicker, recLang, setRecLang, currentLangObj } = useAISession({
    open: open && isAIReady,
    scene: AI_SCENES.EXERCISE,
    settings: effectiveSettings,
    initialPayload,
    bootstrapBuilder: buildExerciseBootstrapPrompt,
    defaultTextMode: false 
  });

  // 增强版：处理录音按钮的长按与短按
  const onMicPointerDown = (e) => {
    pressTimer.current = setTimeout(() => {
      setShowLangPicker(true);
      handleMicPointerCancel(e); // 取消录音触发
    }, 600);
    handleMicPointerDown(e);
  };

  const onMicPointerUp = (e) => {
    clearTimeout(pressTimer.current);
    if (!showLangPicker) handleMicPointerUp(e);
  };

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (open && !isAIReady) setShowSettings(true); }, [open, isAIReady]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [history, inputText, isRecording]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <GlobalStyles />
      <div className="no-select fixed inset-0 z-[2147483001] flex flex-col bg-[#fcfcfc] text-slate-800 font-sans h-[100dvh]">
        
        {/* Header */}
        <div className="flex-none flex h-16 items-center justify-between px-4 border-b border-slate-100 bg-white">
          <button onClick={() => { stopEverything(); onClose?.(); }} className="p-2 text-slate-500 active:scale-90"><FaArrowLeft size={20} /></button>
          <div className="text-sm font-black tracking-widest text-slate-700">{title}</div>
          <button onClick={() => setShowSettings(true)} className="p-2 text-slate-400 active:scale-90"><FaSlidersH size={20} /></button>
        </div>

        {/* Content Area */}
        <div className={`flex-1 relative overflow-hidden flex flex-col ${isRecording ? 'animate-recording-bg' : ''}`}>
          {showText ? (
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
              <div className="flex flex-col gap-y-2 max-w-2xl mx-auto">
                {history.map((msg, i) => (
                  msg.role === 'user' ? (
                    <div key={i} className="mb-6 text-slate-400 text-sm italic">{msg.text}</div>
                  ) : (
                    <div key={i} className="mb-12">
                      <PinyinText text={normalizeAssistantText(msg.text)} showPinyin={true} isStreaming={msg.isStreaming} />
                      {!msg.isStreaming && <button onClick={() => replaySpecificAnswer(msg.text)} className="mt-4 text-slate-300 hover:text-pink-500"><FaVolumeUp size={22} /></button>}
                    </div>
                  )
                ))}
                {isRecording && !textMode && <div className="text-pink-400 font-bold animate-pulse">{inputText || '正在听...'}</div>}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative h-24 w-24">
                {isAiSpeaking && <><div className="ripple" style={{animationDelay:'0s'}}/><div className="ripple" style={{animationDelay:'0.8s'}}/></>}
                <img src="https://audio.886.best/chinese-vocab-audio/%E5%9B%BE%E7%89%87/images.jpeg" className="h-full w-full object-cover rounded-full border border-slate-200 z-10 relative" alt="AI" />
              </div>
              <div className="mt-10 px-6 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-xs font-bold text-slate-400 tracking-widest">
                {isRecording ? 'LISTEN...' : isThinking ? 'THINKING...' : isAiSpeaking ? 'EXPLAINING...' : 'AI TUTOR READY'}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Panel */}
        <div className="flex-none bg-white px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+16px)] border-t border-slate-50">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            
            {/* 巨大键盘切换按钮 */}
            <button onClick={() => setTextMode(!textMode)} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 active:scale-90 transition-all">
              {textMode ? <FaMicrophone size={24} /> : <FaKeyboard size={24} />}
            </button>

            {textMode ? (
              /* 矩形大输入框模式 */
              <div className="flex-1 flex items-center bg-slate-100 rounded-2xl h-[66px] px-4">
                <input
                  type="text" className="can-select flex-1 bg-transparent text-lg font-medium outline-none placeholder-slate-300"
                  placeholder="打字提问..." value={inputText} onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && inputText.trim() && (sendMessage(inputText), setInputText(''))}
                />
                <button onClick={() => inputText.trim() && (sendMessage(inputText), setInputText(''))} className="ml-2 h-12 w-12 flex items-center justify-center bg-pink-500 text-white rounded-xl shadow-lg active:scale-90">
                  <FaPaperPlane size={18} />
                </button>
              </div>
            ) : (
              /* 语音交互核心 */
              <div className="flex-1 flex flex-col items-center">
                <button
                  onPointerDown={onMicPointerDown} onPointerUp={onMicPointerUp}
                  onPointerCancel={(e) => { clearTimeout(pressTimer.current); handleMicPointerCancel(e); }}
                  className={`flex h-20 w-20 items-center justify-center rounded-full text-white transition-all shadow-xl ${isRecording ? 'bg-pink-600 scale-110' : 'bg-pink-500 active:scale-95'}`}
                >
                  {isAiSpeaking || isThinking ? <FaStop size={32} onClick={(e) => { e.stopPropagation(); stopEverything(); }} /> : <FaMicrophone size={36} />}
                </button>
                <div className="mt-2 text-[10px] font-black text-slate-300 uppercase tracking-tighter">长按: {currentLangObj.name}</div>
              </div>
            )}

            {/* 巨大字幕切换按钮 */}
            <button onClick={() => setShowText(!showText)} className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all active:scale-90 ${showText ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {showText ? <FaClosedCaptioning size={24} /> : <FaCommentSlash size={24} />}
            </button>
          </div>

          {/* 录音动态音轨反馈 */}
          {isRecording && (
            <div className="flex justify-center items-end gap-1 h-8 mt-4">
              {[0.2, 0.4, 0.6, 0.3, 0.8, 0.5, 0.7, 0.4].map((d, i) => (
                <div key={i} className="wave-bar" style={{ animationDelay: `${d}s` }} />
              ))}
            </div>
          )}
        </div>

        <RecognitionLanguagePicker open={showLangPicker} recLang={recLang} setRecLang={setRecLang} onClose={() => setShowLangPicker(false)} theme="light" />
        <AISettingsModal open={showSettings} settings={effectiveSettings} updateSettings={updateSettings || ((p)=>{updateSharedSettings(p); updateSceneSettings(AI_SCENES.EXERCISE,p);})} onClose={() => setShowSettings(false)} scene="exercise" />
      </div>
    </>,
    document.body
  );
          }
