'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
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

// ============================
// 拼音逐字组件
// ============================
function PinyinText({ text, showPinyin, isStreaming }) {
  const tokens = useMemo(() => {
    if (!text) return [];
    const pyArray = pinyin(text, { type: 'array', toneType: 'symbol', nonZh: 'removed' });
    let pyIndex = 0;
    const result = [];
    let currentNonZh = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const isZh = /[\u4e00-\u9fff]/.test(char);
      if (isZh) {
        if (currentNonZh) {
          result.push({ text: currentNonZh, isZh: false });
          currentNonZh = '';
        }
        result.push({ text: char, isZh: true, py: pyArray[pyIndex++] || '' });
      } else {
        currentNonZh += char;
      }
    }
    if (currentNonZh) result.push({ text: currentNonZh, isZh: false });
    return result;
  }, [text]);

  return (
    <div className="flex flex-wrap items-end text-[16px] text-slate-800 font-medium leading-[1.6]">
      {tokens.map((t, idx) => (
        <div key={idx} className={`flex flex-col items-center justify-end ${t.isZh ? 'mx-[2px]' : ''}`}>
          {showPinyin && t.isZh && (
            <span className="text-[10px] leading-none text-slate-500 mb-1 font-sans tracking-tighter">
              {t.py}
            </span>
          )}
          <span className="leading-none whitespace-pre-wrap">{t.text}</span>
        </div>
      ))}
      {isStreaming && <span className="ml-1 inline-block h-[18px] w-[3px] animate-pulse bg-pink-500 rounded-full" />}
    </div>
  );
}

// ============================
// 顶部导航
// ============================
function HeaderBar({ title, onBack, onOpenSettings }) {
  return (
    <div className="relative z-20 flex h-[60px] items-center justify-between px-4 bg-[#f4f6f8]/90 backdrop-blur-md border-b border-slate-200/60">
      <button onClick={onBack} className="flex h-10 w-10 items-center justify-center text-slate-500 hover:text-slate-800 transition-transform active:scale-90">
        <FaArrowLeft size={18} />
      </button>
      <div className="text-[13px] font-black tracking-[0.15em] text-slate-800 uppercase">{title}</div>
      <button onClick={onOpenSettings} className="flex h-10 w-10 items-center justify-center text-slate-400 hover:text-slate-800 transition-transform active:scale-90">
        <FaSlidersH size={18} />
      </button>
    </div>
  );
}

// ============================
// 聊天区
// ============================
function ChatList({ history, isRecording, textMode, inputText, replaySpecificAnswer }) {
  const [pinyinMap, setPinyinMap] = useState({});

  const togglePinyin = (id) => setPinyinMap((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col pt-6 pb-4">
      {history.map((msg) => {
        if (msg.role === 'error') {
          return <div key={msg.id} className="mb-6 text-left text-sm font-bold text-red-500 bg-red-50 p-3 rounded-xl">⚠️ {msg.text}</div>;
        }

        if (msg.role === 'user') {
          return (
            <div key={msg.id} className="mb-5 w-full text-left pl-2">
              <div className="text-[14px] font-medium leading-relaxed text-slate-300 tracking-wide">{msg.text}</div>
            </div>
          );
        }

        const aiText = normalizeAssistantText(msg.text || '');
        const showPinyin = pinyinMap[msg.id];

        return (
          <div key={msg.id} className="mb-10 w-full flex flex-col items-start">
            <PinyinText text={aiText} showPinyin={showPinyin} isStreaming={msg.isStreaming} />

            {!msg.isStreaming && aiText && (
              <div className="flex items-center gap-3 mt-2 pl-1">
                <button onClick={() => replaySpecificAnswer(msg.text)} className="flex items-center justify-center text-slate-300 hover:text-pink-500 transition-colors active:scale-90 p-1" title="朗读">
                  <FaVolumeUp size={16} />
                </button>
                <button onClick={() => togglePinyin(msg.id)} className={`flex items-center justify-center text-[11px] font-black px-2 py-0.5 rounded-md transition-colors active:scale-90 ${showPinyin ? 'bg-slate-200 text-slate-700' : 'bg-white border border-slate-200 text-slate-400 shadow-sm hover:text-slate-600'}`} title="注音">
                  拼
                </button>
              </div>
            )}
          </div>
        );
      })}

      {isRecording && textMode === false && inputText && (
        <div className="mb-5 w-full text-left pl-2">
          <div className="text-[14px] font-medium leading-relaxed text-pink-300 animate-pulse tracking-wide">{inputText}</div>
        </div>
      )}
    </div>
  );
}

// ============================
// 底部控制台 (版本1样式，往上移)
// ============================
function BottomControlBar({
  textMode, setTextMode, isRecording, isThinking, isAiSpeaking, inputText, setInputText,
  sendMessage, stopEverything, handleMicPointerDown, handleMicPointerUp, handleMicPointerCancel,
  showText, setShowText
}) {
  return (
    <div className="absolute bottom-4 left-0 right-0 z-30 px-5 pointer-events-none">
      <div className="mx-auto w-full max-w-md pointer-events-auto flex items-center justify-between">
        <button onClick={() => setTextMode(!textMode)} className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-transform active:scale-95">
          {textMode ? <FaMicrophone size={18} /> : <FaKeyboard size={18} />}
        </button>

        <button
          onPointerDown={handleMicPointerDown}
          onPointerUp={handleMicPointerUp}
          onPointerCancel={handleMicPointerCancel}
          onPointerLeave={handleMicPointerCancel}
          onContextMenu={(e) => e.preventDefault()}
          className={`touch-none flex h-20 w-20 items-center justify-center rounded-full text-white transition-all duration-300 ${isRecording ? 'bg-pink-500 animate-pulse-ring scale-95' : 'bg-pink-500 shadow-[0_10px_25px_rgba(236,72,153,.35)] hover:scale-105 active:scale-95'}`}
        >
          {isAiSpeaking || isThinking ? <FaStop className="text-3xl" onClick={(e) => { e.stopPropagation(); stopEverything(); }} /> : <FaMicrophone className="text-3xl" />}
        </button>

        <button onClick={() => setShowText(!showText)} className={`flex h-12 w-12 items-center justify-center rounded-full transition-all active:scale-90 ${showText ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-200/70 text-slate-500'}`}>
          {showText ? <FaClosedCaptioning size={18} /> : <FaCommentSlash size={18} />}
        </button>
      </div>
    </div>
  );
}

// ============================
// 主入口
// ============================
export default function InteractiveAIExplanationPanel({ open, title = 'AI 讲题老师', initialPayload = null, onClose, settings, updateSettings }) {
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [localShowText, setLocalShowText] = useState(true);

  const { resolvedSettings, updateSharedSettings, updateSceneSettings } = useAISettings(AI_SCENES.EXERCISE);
  const effectiveSettings = settings || resolvedSettings;

  const fallbackUpdateSettings = useCallback((patch = {}) => {
    if (!updateSharedSettings || !updateSceneSettings) return;
    updateSharedSettings(patch);
    updateSceneSettings(AI_SCENES.EXERCISE, patch);
  }, [updateSharedSettings, updateSceneSettings]);

  const effectiveUpdateSettings = updateSettings || fallbackUpdateSettings;

  const isAIReady = useMemo(() => Boolean(effectiveSettings?.apiKey && effectiveSettings?.apiUrl && effectiveSettings?.model), [effectiveSettings]);

  const sessionOpen = open && isAIReady;

  const {
    history, isThinking, isAiSpeaking, textMode, setTextMode, inputText, setInputText,
    isRecording, currentLangObj, scrollRef, sendMessage, stopEverything,
    recLang, setRecLang, showLangPicker, setShowLangPicker,
    handleMicPointerDown, handleMicPointerUp, handleMicPointerCancel,
    replaySpecificAnswer, showText, setShowText
  } = useAISession({
    open: sessionOpen,
    scene: AI_SCENES.EXERCISE,
    settings: effectiveSettings,
    initialPayload,
    bootstrapBuilder: buildExerciseBootstrapPrompt,
    defaultTextMode: true
  });

  const actualShowText = showText ?? localShowText;
  const toggleShowText = (val) => { if (setShowText) setShowText(val); else setLocalShowText(val); };

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (open && !isAIReady) setShowSettings(true); }, [open, isAIReady]);
  useEffect(() => {
    if (!open) return undefined;
    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevBodyOverflow; };
  }, [open]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [history, inputText, isRecording]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[2147483000] bg-slate-900/40 backdrop-blur-sm" />

      <div className="fixed inset-0 z-[2147483001] isolate flex h-[100dvh] w-full flex-col overflow-hidden bg-[#f4f6f8] text-slate-800 font-sans">
        <HeaderBar title={title} onBack={() => { stopEverything(); onClose?.(); }} onOpenSettings={() => setShowSettings(true)} />

        <div ref={scrollRef} className={`relative z-10 flex-1 overflow-y-auto px-6 pt-4 pb-[240px] no-scrollbar scroll-smooth ${showLangPicker ? 'pointer-events-none' : ''}`}>
          {!isAIReady ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-400 pb-20">
              <span className="text-4xl mb-4">⚙️</span>
              <p className="text-sm font-bold">请点击右上角配置 AI 模型</p>
            </div>
          ) : !actualShowText ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-300 pb-20">
              <FaCommentSlash size={36} className="mb-3 opacity-50" />
              <p className="text-xs tracking-widest uppercase font-bold">字幕已隐藏</p>
            </div>
          ) : (
            <ChatList history={history} isRecording={isRecording} textMode={textMode} inputText={inputText} replaySpecificAnswer={replaySpecificAnswer} />
          )}
        </div>

        {isAIReady && <BottomControlBar
          textMode={textMode} setTextMode={setTextMode}
          isRecording={isRecording} isThinking={isThinking} isAiSpeaking={isAiSpeaking}
          inputText={inputText} setInputText={setInputText} sendMessage={sendMessage} stopEverything={stopEverything}
          handleMicPointerDown={handleMicPointerDown} handleMicPointerUp={handleMicPointerUp} handleMicPointerCancel={handleMicPointerCancel}
          showText={actualShowText} setShowText={toggleShowText}
        />}

        <RecognitionLanguagePicker open={showLangPicker} recLang={recLang} setRecLang={setRecLang} onClose={() => setShowLangPicker(false)} theme="light" />
        <AISettingsModal open={showSettings} settings={effectiveSettings} updateSettings={effectiveUpdateSettings} onClose={() => setShowSettings(false)} scene="exercise" />
      </div>
    </>,
    document.body
  );
}
