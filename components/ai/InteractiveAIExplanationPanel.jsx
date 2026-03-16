'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FaArrowLeft,
  FaPaperPlane,
  FaMicrophone,
  FaStop,
  FaKeyboard,
  FaClosedCaptioning,
  FaCommentSlash,
  FaVolumeUp,
  FaSlidersH // 恢复设置图标
} from 'react-icons/fa';
import { normalizeAssistantText } from './aiTextUtils';
import { useInteractiveAITutor } from './useInteractiveAITutor';
import { RECOGNITION_LANGS } from './aiConfig';
import AISettingsModal from './AISettingsModal'; // 引入设置弹窗组件

const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* 语音大按钮的发光涟漪 */
    @keyframes pulse-ring {
      0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(236, 72, 153, 0); }
      100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
    }
    .animate-pulse-ring { animation: pulse-ring 1.5s infinite; }

    /* 头像说话时的光晕呼吸 */
    @keyframes avatar-glow {
      0% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
      50% { box-shadow: 0 0 50px rgba(255, 255, 255, 0.4); }
      100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
    }
    .animate-avatar-glow { animation: avatar-glow 2s ease-in-out infinite; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px) scale(.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `}</style>
);

function LanguagePickerPortal({ open, recLang, setRecLang, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open || !mounted) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyTouchAction = document.body.style.touchAction;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.touchAction = prevBodyTouchAction;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [open, mounted]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/20 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl animate-[fadeIn_.18s_ease-out]">
        <h3 className="mb-4 text-center text-lg font-bold text-white">选择识别语言</h3>
        <div className="grid grid-cols-2 gap-3">
          {RECOGNITION_LANGS.map((lang) => {
            const active = recLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => { setRecLang(lang.code); onClose(); }}
                className={`rounded-2xl border p-4 transition-all active:scale-95 ${
                  active ? 'border-pink-500 bg-pink-500/20 shadow-inner' : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-xs font-bold text-white/80">{lang.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function InteractiveAIExplanationPanel({
  open,
  settings,
  title = 'AI 讲题老师',
  initialPayload = null,
  onClose,
  updateSettings // 接收用于更新设置的函数
}) {
  const [showSettings, setShowSettings] = useState(false);

  const {
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
    stopEverything,
    recLang,
    setRecLang,
    showLangPicker,
    setShowLangPicker,
    handleMicPointerDown,
    handleMicPointerUp,
    handleMicPointerCancel,
    showText,
    setShowText,
    replaySpecificAnswer
  } = useInteractiveAITutor({
    open,
    settings,
    initialPayload
  });

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, inputText, isRecording]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2147483000] flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-950 font-sans">
      <GlobalStyles />

      {/* 1. 背景层 (深色暗调以凸显磨砂玻璃) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] -z-20" />

      {/* 2. 居中美图头像层 */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none opacity-80">
        <div className="relative">
          {/* 头像发光背景 */}
          <div className={`absolute -inset-4 rounded-full transition-all duration-700 ${isAiSpeaking ? 'bg-pink-500/20 blur-2xl animate-avatar-glow' : 'bg-transparent'}`} />
          {/* 美图头像 (可自行更换高清图 URL) */}
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
            alt="AI Teacher"
            className="relative z-10 h-64 w-64 md:h-80 md:w-80 rounded-full object-cover border-4 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          />
        </div>
        {/* 状态文字悬浮在头像下方 */}
        <div className="mt-8 text-sm font-medium tracking-widest text-white/50 transition-opacity">
          {isRecording ? '正在倾听...' : isThinking ? '思考中...' : isAiSpeaking ? '正在讲解...' : '随时可以提问'}
        </div>
      </div>

      {/* 3. 顶部导航层 */}
      <div className="relative z-20 flex h-16 items-center justify-between px-4 bg-gradient-to-b from-black/60 to-transparent">
        <button
          onClick={() => { stopEverything(); onClose?.(); }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white/80 transition-transform active:scale-90"
        >
          <FaArrowLeft />
        </button>

        <div className="text-sm font-bold tracking-widest text-white/90 drop-shadow-md">{title}</div>
        
        {/* 右上角：设置按钮恢复 */}
        <button
          onClick={() => setShowSettings(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white/80 transition-transform active:scale-90"
        >
          <FaSlidersH />
        </button>
      </div>

      {/* 4. 滚动字幕层 (磨砂玻璃效果，文本覆盖在头像上) */}
      <div
        ref={scrollRef}
        className={`relative z-10 flex-1 overflow-y-auto px-4 pt-4 pb-48 no-scrollbar overscroll-contain ${
          !showText || showLangPicker ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-300'
        }`}
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col justify-end min-h-full">
          {history.map((msg) => {
            if (msg.role === 'error') {
              return (
                <div key={msg.id} className="mb-4 text-center text-sm font-medium text-red-400 bg-red-500/10 py-2 rounded-xl backdrop-blur-md">
                  {msg.text}
                </div>
              );
            }

            // 用户消息：浅色文本，偏右对齐
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="mb-4 flex justify-end">
                  <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-white/20 backdrop-blur-xl border border-white/20 px-4 py-3 text-[15px] font-medium text-white shadow-lg">
                    {msg.text}
                  </div>
                </div>
              );
            }

            // AI 消息：磨砂玻璃面板，偏左对齐
            const aiText = normalizeAssistantText(msg.text || '');
            return (
              <div key={msg.id} className="mb-6 flex items-start gap-3">
                <div className="flex-1">
                  <div className="inline-block max-w-[95%] rounded-2xl rounded-tl-sm bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-4 shadow-xl">
                    <div className="inline whitespace-pre-wrap text-[16px] font-medium leading-relaxed text-white/90 tracking-wide">
                      {aiText || (msg.isStreaming ? '...' : '')}
                      {msg.isStreaming && <span className="ml-1 inline-block h-4 w-1.5 animate-pulse align-middle bg-pink-400" />}
                    </div>

                    {!msg.isStreaming && aiText && (
                      <button
                        type="button"
                        onClick={() => replaySpecificAnswer(msg.text)}
                        className="ml-3 mt-1 inline-flex items-center align-middle text-white/40 hover:text-white transition-colors active:scale-90"
                      >
                        <FaVolumeUp size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* 正在识别的用户实时输入预览 */}
          {isRecording && textMode === false && inputText && (
            <div className="mb-4 flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-pink-500/30 backdrop-blur-xl border border-pink-500/30 px-4 py-3 text-[15px] font-medium text-white shadow-lg animate-pulse">
                {inputText}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. 底部控制台 (全新布局：左切换、中输入/语音、右开关) */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-20 pointer-events-none">
        <div className="relative mx-auto flex h-20 max-w-lg items-center justify-between gap-4 pointer-events-auto">
          
          {/* 左侧：切换文本/语音模式 */}
          <button
            onClick={() => setTextMode((v) => !v)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 transition-transform active:scale-90 hover:bg-white/20"
          >
            {textMode ? <FaMicrophone size={18} /> : <FaKeyboard size={18} />}
          </button>

          {/* 中间：自适应区域 */}
          <div className="flex-1 flex justify-center items-center">
            {textMode ? (
              // 文本模式：输入框
              <div className="flex w-full items-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 p-1.5 shadow-inner">
                <input
                  type="text"
                  className="flex-1 bg-transparent px-4 py-2 text-[15px] text-white outline-none placeholder-white/40"
                  placeholder="输入消息..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputText.trim()) {
                      sendMessage(inputText);
                      setInputText('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (inputText.trim()) {
                      sendMessage(inputText);
                      setInputText('');
                    }
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white shadow-md transition-transform active:scale-90"
                >
                  <FaPaperPlane size={14} className="-ml-0.5" />
                </button>
              </div>
            ) : (
              // 语音模式：大按钮 (居中)
              <div className="relative flex flex-col items-center">
                <button
                  onPointerDown={handleMicPointerDown}
                  onPointerUp={handleMicPointerUp}
                  onPointerCancel={handleMicPointerCancel}
                  onPointerLeave={handleMicPointerCancel}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`touch-none flex h-20 w-20 items-center justify-center rounded-full text-white shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300 z-10 ${
                    isRecording
                      ? 'bg-pink-500 scale-95 animate-pulse-ring'
                      : 'bg-gradient-to-br from-pink-400 to-rose-600 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isAiSpeaking || isThinking ? (
                    <FaStop className="text-3xl drop-shadow-md" onClick={(e) => { e.stopPropagation(); stopEverything(); }} />
                  ) : (
                    <FaMicrophone className="text-3xl drop-shadow-md" />
                  )}
                </button>
                {/* 语言提示语 */}
                <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-white/40 pointer-events-none">
                  {currentLangObj.flag} {currentLangObj.name}
                </div>
              </div>
            )}
          </div>

          {/* 右侧：字幕开关 */}
          <button
            onClick={() => setShowText((v) => !v)}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full backdrop-blur-md border transition-colors active:scale-90 ${
              showText
                ? 'bg-pink-500/20 border-pink-500/50 text-pink-400'
                : 'bg-white/10 border-white/20 text-white/50 hover:bg-white/20'
            }`}
          >
            {showText ? <FaClosedCaptioning size={18} /> : <FaCommentSlash size={18} />}
          </button>

        </div>
      </div>

      {/* 弹窗组件 */}
      <LanguagePickerPortal
        open={showLangPicker}
        recLang={recLang}
        setRecLang={setRecLang}
        onClose={() => setShowLangPicker(false)}
      />

      <AISettingsModal
        open={showSettings}
        settings={settings}
        updateSettings={updateSettings}
        onClose={() => setShowSettings(false)}
        scene="exercise"
      />
    </div>
  );
}
