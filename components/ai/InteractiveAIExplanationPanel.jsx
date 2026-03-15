'use client';

import React, { useEffect, useState } from 'react';
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
  FaSlidersH
} from 'react-icons/fa';
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

    @keyframes pulse-ring {
      0% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(236, 72, 153, .6); }
      70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(236, 72, 153, 0); }
      100% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
    }
    .animate-pulse-ring { animation: pulse-ring 1.3s infinite; }

    @keyframes bars {
      0%,100% { transform: scaleY(.35); opacity:.45; }
      50% { transform: scaleY(1); opacity:1; }
    }
    .tts-bars span {
      display:inline-block; width:4px; height:20px; border-radius:4px;
      background: linear-gradient(180deg,#f472b6,#a855f7);
      margin:0 2px; transform-origin: bottom;
      animation: bars 0.55s ease-in-out infinite;
    }
    .tts-bars span:nth-child(2){ animation-delay:.06s; }
    .tts-bars span:nth-child(3){ animation-delay:.12s; }
    .tts-bars span:nth-child(4){ animation-delay:.18s; }
    .tts-bars span:nth-child(5){ animation-delay:.24s; }

    .ai-chat-bg {
      background-color: #fdfafb;
      background-image: radial-gradient(#fce7f3 1px, transparent 1px);
      background-size: 24px 24px;
    }
  `}</style>
);

export default function InteractiveAIExplanationPanel({
  open,
  title = 'AI 讲题老师',
  initialPayload = null,
  onClose,
  settings,
  updateSettings
}) {
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const {
    resolvedSettings,
    updateSharedSettings,
    updateSceneSettings
  } = useAISettings(AI_SCENES.EXERCISE);

  const effectiveSettings = settings || resolvedSettings;
  const effectiveUpdateSettings =
    updateSettings ||
    ((patch) => {
      updateSceneSettings?.(patch);
      updateSharedSettings?.(patch);
    });

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
  } = useAISession({
    open,
    scene: AI_SCENES.EXERCISE,
    settings: effectiveSettings,
    initialPayload,
    bootstrapBuilder: buildExerciseBootstrapPrompt,
    defaultTextMode: true
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[2147483000] bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 z-[2147483001] flex h-[100dvh] w-full flex-col overflow-hidden bg-white text-slate-800">
        <GlobalStyles />
        
        {/* 背景层美化 */}
        <div className="absolute inset-0 ai-chat-bg opacity-70" />

        {/* 顶部导航美化（毛玻璃效果） */}
        <div className="relative z-20 flex h-16 items-center justify-between border-b border-white/50 bg-white/70 backdrop-blur-md px-4 shadow-sm">
          <button
            type="button"
            onClick={() => {
              stopEverything();
              onClose?.();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition-transform active:scale-90"
          >
            <FaArrowLeft />
          </button>

          <div className="text-[15px] font-black tracking-widest text-slate-800 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            {title}
          </div>

          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition-transform active:scale-90"
          >
            <FaSlidersH />
          </button>
        </div>

        {/* 聊天内容区 */}
        <div
          ref={scrollRef}
          className={`relative z-10 flex-1 overflow-y-auto p-4 pb-44 ${
            showLangPicker ? 'pointer-events-none select-none' : ''
          }`}
        >
          {!showText ? (
            <div className="flex min-h-full flex-1 flex-col items-center justify-center">
              <div className="relative flex h-56 w-56 items-center justify-center">
                {isAiSpeaking && <div className="absolute inset-0 animate-ping rounded-full bg-pink-300/40" />}
                <img
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=Teacher&backgroundColor=fce4ec"
                  alt="Teacher"
                  className={`relative z-10 h-32 w-32 rounded-full border-[6px] border-white object-cover shadow-2xl transition-all duration-300 ${
                    isAiSpeaking ? 'scale-110 shadow-[0_0_40px_rgba(236,72,153,.5)] ring-4 ring-pink-100' : 'bg-pink-50'
                  }`}
                />
              </div>

              <div className="mt-8 flex h-10 items-center justify-center bg-white/80 px-6 py-2 rounded-full shadow-sm border border-slate-100 backdrop-blur-sm">
                {isAiSpeaking ? (
                  <div className="tts-bars flex items-center gap-1"><span /><span /><span /><span /><span /></div>
                ) : (
                  <span className="text-sm font-bold tracking-widest text-slate-500">
                    {isRecording ? '正在倾听...' : isThinking ? '思考中...' : '期待你的提问~'}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col">
              {history.map((msg) => {
                if (msg.role === 'error') {
                  return (
                    <div key={msg.id} className="mb-4 text-center text-xs font-bold text-red-500 bg-red-50 py-2 rounded-xl mx-8">
                      {msg.text}
                    </div>
                  );
                }

                if (msg.role === 'user') {
                  return (
                    <div key={msg.id} className="mb-4 flex justify-end pl-12">
                      <div className="max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-gradient-to-br from-violet-500 to-fuchsia-500 px-5 py-3 text-[15px] font-medium text-white shadow-md">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                const aiText = normalizeAssistantText(msg.text || '');

                return (
                  <div key={msg.id} className="mb-6 flex items-start gap-3">
                    <div className="mt-1 h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white bg-pink-50 shadow-md">
                      <img
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=Teacher&backgroundColor=fce4ec"
                        className="h-full w-full object-cover"
                        alt="AI"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="inline-block rounded-2xl rounded-tl-sm border border-slate-100 bg-white/90 px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-md">
                        <div className="inline whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-slate-700">
                          {aiText || (msg.isStreaming ? '思考中...' : '')}
                          {msg.isStreaming && (
                            <span className="ml-1 inline-block h-4 w-1.5 animate-pulse align-middle bg-pink-400 rounded-full" />
                          )}
                        </div>

                        {!msg.isStreaming && aiText && (
                          <button
                            type="button"
                            onClick={() => replaySpecificAnswer(msg.text)}
                            className="ml-3 mt-1 inline-flex items-center align-middle text-slate-300 hover:text-pink-500 active:scale-90 transition-colors"
                            title="重新朗读"
                          >
                            <FaVolumeUp size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isRecording && textMode === false && (
                <div className="mb-4 flex justify-end pl-12">
                  <div className="max-w-[90%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-violet-400 to-fuchsia-400 px-5 py-3 text-[15px] font-medium text-white shadow-md opacity-80">
                    <span className="animate-pulse">{inputText || '正在聆听...'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部输入控制区美化 */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-xl px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-[0_-10px_40px_rgba(0,0,0,.08)]">
          <div className="relative mx-auto flex h-20 max-w-md items-center justify-center">
            <button
              type="button"
              onClick={() => setTextMode((value) => !value)}
              className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-transform hover:bg-slate-50 active:scale-95"
            >
              {textMode ? <FaMicrophone size={18} /> : <FaKeyboard size={18} />}
            </button>

            {!textMode ? (
              <div className="flex w-full flex-col items-center">
                <button
                  type="button"
                  onPointerDown={handleMicPointerDown}
                  onPointerUp={handleMicPointerUp}
                  onPointerCancel={handleMicPointerCancel}
                  onPointerLeave={handleMicPointerCancel}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`touch-none flex h-20 w-20 items-center justify-center rounded-full text-white shadow-[0_10px_25px_rgba(236,72,153,.3)] transition-all duration-300 ${
                    isRecording
                      ? 'animate-pulse-ring scale-95 bg-pink-500'
                      : 'bg-gradient-to-br from-pink-400 to-rose-500 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isRecording ? <FaPaperPlane className="animate-pulse text-3xl" /> : <FaMicrophone className="text-3xl" />}
                </button>

                <div className="pointer-events-none absolute -bottom-6 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {isRecording ? (
                    <span className="text-pink-500">点击发送 · 静默自动发送</span>
                  ) : isThinking ? (
                    <span className="text-violet-500">思考中...</span>
                  ) : isAiSpeaking ? (
                    <div className="tts-bars flex gap-1"><span /><span /><span /><span /><span /></div>
                  ) : (
                    `长按切换语言 · ${currentLangObj.flag} ${currentLangObj.name}`
                  )}
                </div>
              </div>
            ) : (
              <div className="relative ml-16 mr-16 flex flex-1 items-center rounded-full border-2 border-slate-100 bg-white p-1.5 shadow-sm transition focus-within:border-pink-200 focus-within:shadow-md">
                <input
                  type="text"
                  className="flex-1 bg-transparent px-4 py-2 text-sm font-medium text-slate-800 outline-none placeholder-slate-400"
                  placeholder={isRecording ? '听你说...' : '输入消息继续追问...'}
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
                  type="button"
                  onClick={() => {
                    if (isRecording) stopEverything();
                    if (inputText.trim()) {
                      sendMessage(inputText);
                      setInputText('');
                    }
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-md transition-transform active:scale-90"
                >
                  <FaPaperPlane size={14} className="-ml-0.5" />
                </button>
              </div>
            )}

            <div className="absolute right-0 flex items-center justify-center gap-2">
              {isAiSpeaking || isRecording || isThinking ? (
                <button
                  type="button"
                  onClick={stopEverything}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-transform active:scale-95"
                >
                  <FaStop size={18} className="text-red-400" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowText((value) => !value)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-sm transition-colors active:scale-95 ${
                    showText
                      ? 'border-pink-200 bg-pink-50 text-pink-500'
                      : 'border-slate-200 bg-white text-slate-500'
                  }`}
                >
                  {showText ? <FaClosedCaptioning size={18} /> : <FaCommentSlash size={18} />}
                </button>
              )}
            </div>
          </div>
        </div>

        <RecognitionLanguagePicker
          open={showLangPicker}
          recLang={recLang}
          setRecLang={setRecLang}
          onClose={() => setShowLangPicker(false)}
          theme="light"
        />

        <AISettingsModal
          open={showSettings}
          settings={effectiveSettings}
          updateSettings={effectiveUpdateSettings}
          onClose={() => setShowSettings(false)}
          scene="exercise"
        />
      </div>
    </>,
    document.body
  );
}
