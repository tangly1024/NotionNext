'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaArrowLeft, FaPaperPlane, FaMicrophone, FaStop, FaKeyboard, FaClosedCaptioning, FaCommentSlash, FaVolumeUp, FaSlidersH } from 'react-icons/fa';
import { AI_SCENES, buildExerciseBootstrapPrompt } from '../ai/aiAssistants';
import { normalizeAssistantText } from '../ai/aiTextUtils';
import { useAISettings } from '../ai/useAISettings';
import { useAISession } from '../ai/useAISession';
import AISettingsModal from '../ai/AISettingsModal';
import RecognitionLanguagePicker from '../ai/RecognitionLanguagePicker';

const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes pulse-ring {
      0% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(239, 68, 68, .55); }
      70% { transform: scale(1); box-shadow: 0 0 0 18px rgba(239, 68, 68, 0); }
      100% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
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
      from { opacity: 0; transform: translateY(6px) scale(.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `}</style>
);

export default function InteractiveAIExplanationPanel({
  open,
  title = 'AI 讲题老师',
  initialPayload = null,
  onClose
}) {
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const {
    allSettings,
    resolvedSettings,
    updateSharedSettings,
    updateSceneSettings,
    selectProvider,
    selectAssistant,
    resetScenePrompt
  } = useAISettings(AI_SCENES.EXERCISE);

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
    settings: resolvedSettings,
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
    const prevBodyBg = document.body.style.background;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.background = '#ffffff';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.background = prevBodyBg;
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[2147483000] bg-white" />
      <div className="fixed inset-0 z-[2147483001] flex h-[100dvh] w-full flex-col overflow-hidden bg-white text-slate-800">
        <GlobalStyles />
        <div className="absolute inset-0 bg-white" />
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.06]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400')"
          }}
        />

        <div className="relative z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
          <button
            type="button"
            onClick={() => {
              stopEverything();
              onClose?.();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/70 text-slate-600 shadow-sm active:scale-90"
          >
            <FaArrowLeft />
          </button>

          <div className="text-sm font-bold tracking-widest text-slate-800">{title}</div>

          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/70 text-slate-600 shadow-sm active:scale-90"
          >
            <FaSlidersH />
          </button>
        </div>

        <div
          ref={scrollRef}
          className={`relative z-10 flex-1 overflow-y-auto bg-white p-4 pb-44 ${
            showLangPicker ? 'pointer-events-none select-none' : ''
          }`}
        >
          {!showText ? (
            <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-white">
              <div className="relative flex h-56 w-56 items-center justify-center">
                {isAiSpeaking && <div className="absolute inset-0 animate-ping rounded-full bg-pink-300/30" />}
                <img
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=Teacher&backgroundColor=fce4ec"
                  alt="Teacher"
                  className={`relative z-10 h-32 w-32 rounded-full border-[5px] border-white object-cover shadow-xl transition-all duration-300 ${
                    isAiSpeaking ? 'scale-110 shadow-[0_0_30px_rgba(236,72,153,.5)]' : 'bg-pink-50'
                  }`}
                />
              </div>

              <div className="mt-8 flex h-10 items-center justify-center">
                {isAiSpeaking ? (
                  <div className="tts-bars"><span /><span /><span /><span /><span /></div>
                ) : (
                  <span className="text-sm font-medium tracking-widest text-slate-400">
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
                    <div key={msg.id} className="mb-4 pl-12 text-sm font-medium text-red-500">
                      {msg.text}
                    </div>
                  );
                }

                if (msg.role === 'user') {
                  return (
                    <div key={msg.id} className="mb-3 flex justify-end pl-12">
                      <div className="max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-pink-100 px-4 py-2.5 text-[15px] font-medium text-pink-900 shadow-sm">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                const aiText = normalizeAssistantText(msg.text || '');

                return (
                  <div key={msg.id} className="mb-5 flex items-start gap-3">
                    <div className="mt-1 h-9 w-9 shrink-0 overflow-hidden rounded-full border border-pink-200 bg-pink-50 shadow-sm">
                      <img
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=Teacher&backgroundColor=fce4ec"
                        className="h-full w-full object-cover"
                        alt="AI"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="inline-block rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-4 py-3 shadow-sm">
                        <div className="inline whitespace-pre-wrap text-[15px] font-medium leading-7 text-slate-700">
                          {aiText || (msg.isStreaming ? '思考中...' : '')}
                          {msg.isStreaming && (
                            <span className="ml-1 inline-block h-4 w-1.5 animate-pulse align-middle bg-pink-400" />
                          )}
                        </div>

                        {!msg.isStreaming && aiText && (
                          <button
                            type="button"
                            onClick={() => replaySpecificAnswer(msg.text)}
                            className="ml-2 mt-1 inline-flex items-center align-middle text-pink-400 hover:text-pink-600 active:scale-90"
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
                <div className="mb-2 flex justify-start pl-12">
                  <div className="max-w-[92%] rounded-xl border border-cyan-200/60 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-800 shadow-sm">
                    <span className="mr-2 opacity-80">识别中：</span>
                    <span className="animate-pulse">{inputText || '...'}</span>
                  </div>
                </div>
              )}

              <div className="flex-1 bg-white" />
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-30 bg-white px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_24px_rgba(15,23,42,.06)]">
          <div className="relative mx-auto flex h-20 max-w-md items-center justify-center">
            <button
              type="button"
              onClick={() => setTextMode((value) => !value)}
              className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500 shadow-sm transition-transform active:scale-95"
            >
              {textMode ? <FaMicrophone /> : <FaKeyboard />}
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
                  className={`touch-none flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 ${
                    isRecording
                      ? 'animate-pulse-ring scale-95 bg-red-500'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isRecording ? <FaPaperPlane className="animate-pulse text-3xl" /> : <FaMicrophone className="text-3xl" />}
                </button>

                <div className="pointer-events-none absolute -bottom-6 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {isRecording ? (
                    <span className="text-red-400">点击发送 · 静默自动发送</span>
                  ) : isThinking ? (
                    <span className="text-amber-500">思考中...</span>
                  ) : isAiSpeaking ? (
                    <div className="tts-bars"><span /><span /><span /><span /><span /></div>
                  ) : (
                    `长按切换语言 · ${currentLangObj.flag} ${currentLangObj.name}`
                  )}
                </div>
              </div>
            ) : (
              <div className="relative ml-16 mr-16 flex flex-1 items-center rounded-full border border-slate-200 bg-white p-1 shadow-inner">
                <input
                  type="text"
                  className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-800 outline-none placeholder-slate-400"
                  placeholder={isRecording ? '听你说...' : '输入消息继续追问...'}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage(inputText);
                      setInputText('');
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (isRecording) stopEverything();
                    sendMessage(inputText);
                    setInputText('');
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white shadow-sm transition-transform active:scale-90"
                >
                  <FaPaperPlane size={14} />
                </button>
              </div>
            )}

            <div className="absolute right-0 flex items-center justify-center gap-2">
              {isAiSpeaking || isRecording || isThinking ? (
                <button
                  type="button"
                  onClick={stopEverything}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500 shadow-sm transition-transform active:scale-95"
                >
                  <FaStop />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowText((value) => !value)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-sm transition-colors active:scale-95 ${
                    showText
                      ? 'border-pink-200 bg-pink-100 text-pink-500'
                      : 'border-slate-200 bg-slate-100 text-slate-500'
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
          scene={AI_SCENES.EXERCISE}
          allSettings={allSettings}
          updateSharedSettings={updateSharedSettings}
          updateSceneSettings={updateSceneSettings}
          selectProvider={selectProvider}
          selectAssistant={selectAssistant}
          resetScenePrompt={resetScenePrompt}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </>,
    document.body
  );
}
