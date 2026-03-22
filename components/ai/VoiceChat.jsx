'use client';

import React, { useState } from 'react';
import { FaArrowLeft, FaPaperPlane, FaMicrophone, FaKeyboard, FaStop, FaClosedCaptioning, FaCommentSlash, FaSlidersH } from 'react-icons/fa';
import { AI_SCENES, buildOralBootstrapPrompt } from './aiAssistants';
import { mergeTranscript, normalizeAssistantText } from './aiTextUtils';
import { useAISettings } from './useAISettings';
import { useAISession } from './useAISession';
import AISettingsModal from './AISettingsModal';
import RecognitionLanguagePicker from './RecognitionLanguagePicker';

const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .app-container { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
    .selectable { -webkit-user-select: text; user-select: text; }
    @keyframes ping-slow { 75%, 100% { transform: scale(2); opacity: 0; } }
    .animate-ping-slow { animation: ping-slow 1.6s cubic-bezier(0,0,0.2,1) infinite; }
    @keyframes pulse-ring { 0% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(239, 68, 68, .65); } 70% { transform: scale(1); box-shadow: 0 0 0 22px rgba(239, 68, 68, 0); } 100% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
    .animate-pulse-ring { animation: pulse-ring 1.3s infinite; }
    @keyframes bars { 0%,100% { transform: scaleY(.35); opacity:.45; } 50% { transform: scaleY(1); opacity:1; } }
    .tts-bars span { display:inline-block; width:4px; height:20px; border-radius:4px; background: linear-gradient(180deg,#f9a8d4,#a78bfa); margin:0 2px; transform-origin: bottom; animation: bars 0.55s ease-in-out infinite; }
    .tts-bars span:nth-child(2){ animation-delay:.06s; } .tts-bars span:nth-child(3){ animation-delay:.12s; } .tts-bars span:nth-child(4){ animation-delay:.18s; } .tts-bars span:nth-child(5){ animation-delay:.24s; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  `}</style>
);

export default function VoiceChat({ isOpen, onClose, initialPayload }) {
  const [showSettings, setShowSettings] = useState(false);

  const {
    allSettings,
    resolvedSettings,
    updateSharedSettings,
    updateSceneSettings,
    selectProvider,
    selectAssistant,
    resetScenePrompt
  } = useAISettings(AI_SCENES.ORAL);

  const {
    history,
    isRecording,
    isAiSpeaking,
    isThinking,
    textMode,
    setTextMode,
    inputText,
    setInputText,
    liveInterim,
    recordFinalText,
    showLangPicker,
    setShowLangPicker,
    scrollRef,
    sendMessage,
    stopEverything,
    clearRecordingBuffer,
    handleMicPointerDown,
    handleMicPointerUp,
    handleMicPointerCancel,
    currentLangObj,
    showText,
    setShowText,
    recLang,
    setRecLang
  } = useAISession({
    open: isOpen,
    scene: AI_SCENES.ORAL,
    settings: resolvedSettings,
    initialPayload: initialPayload,
    bootstrapBuilder: buildOralBootstrapPrompt, // 触发上面写的开场白
    defaultTextMode: false
  });

  if (!isOpen) return null;

  const liveText = mergeTranscript(recordFinalText, liveInterim);

  return (
    <div className="app-container fixed inset-0 z-[200] flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-950 text-slate-100">
      <GlobalStyles />
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400')"
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/48 to-slate-950/82" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,.16),transparent_35%),radial-gradient(circle_at_80%_25%,rgba(99,102,241,.16),transparent_35%)]" />

      <div className="relative z-20 flex h-16 items-center justify-between border-b border-white/10 px-4 backdrop-blur-sm">
        <button
          onClick={() => {
            stopEverything();
            onClose?.();
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white active:scale-90"
        >
          <FaArrowLeft />
        </button>

        <div className="text-sm font-bold tracking-widest text-white">AI TUTOR</div>

        <button
          onClick={() => setShowSettings(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
        >
          <FaSlidersH />
        </button>
      </div>

      <div ref={scrollRef} className="selectable no-scrollbar relative z-10 flex flex-1 flex-col overflow-y-auto p-4 pb-36">
        {!showText && !textMode ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="pointer-events-none relative flex h-56 w-56 items-center justify-center">
              {isAiSpeaking && <div className="animate-ping-slow absolute inset-0 rounded-full bg-pink-400/30" />}
              {isAiSpeaking && (
                <div
                  className="animate-ping-slow absolute inset-6 rounded-full bg-violet-400/30"
                  style={{ animationDelay: '.4s' }}
                />
              )}
              <div
                className={`relative z-10 flex h-32 w-32 items-center justify-center rounded-full transition-all duration-300 ${
                  isAiSpeaking
                    ? 'scale-110 bg-pink-500 shadow-[0_0_30px_rgba(236,72,153,.6)]'
                    : 'bg-white/10'
                }`}
              >
                <FaMicrophone className={`text-5xl ${isAiSpeaking ? 'text-white' : 'text-slate-300'}`} />
              </div>
            </div>

            <div className="mt-8 flex h-10 items-center justify-center">
              {isAiSpeaking ? (
                <div className="tts-bars"><span /><span /><span /><span /><span /></div>
              ) : (
                <span className="text-sm font-medium tracking-widest text-slate-300">
                  {isRecording ? '正在倾听...' : isThinking ? '思考中...' : '请说话'}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-end">
            {history.map((msg) => {
              if (msg.role === 'error') {
                return (
                  <div key={msg.id} className="mb-4 pl-12 text-sm text-red-200/85">
                    {msg.text}
                  </div>
                );
              }

              if (msg.role === 'user') {
                return (
                  <div
                    key={msg.id}
                    className="mb-3 pl-12 text-[15px] leading-7 whitespace-pre-wrap text-slate-200/55 [text-shadow:0_1px_8px_rgba(0,0,0,.45)]"
                  >
                    {msg.text}
                  </div>
                );
              }

              const aiText = normalizeAssistantText(msg.text || '');
              return (
                <div key={msg.id} className="mb-4 flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-pink-200/35 bg-pink-400/25 text-lg shadow-[0_0_16px_rgba(236,72,153,.28)]">
                    👩
                  </div>
                  <div className="flex-1 pt-0.5 text-[15px] leading-7 whitespace-pre-wrap text-slate-100/92 [text-shadow:0_1px_8px_rgba(0,0,0,.45)]">
                    {aiText || (msg.isStreaming ? '思考中...' : '')}
                    {msg.isStreaming && aiText && (
                      <span className="ml-1 inline-block h-4 w-1.5 animate-pulse align-middle bg-pink-300" />
                    )}
                  </div>
                </div>
              );
            })}

            {isRecording && (
              <div className="mb-2 flex justify-start pl-12">
                <div className="animate-[fadeIn_.2s_ease-out] max-w-[92%] rounded-xl border border-cyan-300/25 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100/90">
                  <span className="mr-2 opacity-80">识别中：</span>
                  <span>{liveText || '...'}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-950 via-slate-950/92 to-transparent px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-12">
        <div className="relative mx-auto flex h-20 max-w-md items-center justify-center">
          <button
            onClick={() => setTextMode((value) => !value)}
            className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition-transform active:scale-95"
          >
            {textMode ? <FaMicrophone /> : <FaKeyboard />}
          </button>

          {!textMode ? (
            <div className="flex w-full flex-col items-center">
              <div className="flex items-center gap-4">
                {isRecording ? (
                  <button
                    onClick={clearRecordingBuffer}
                    className="h-11 w-14 rounded-full bg-white/15 text-xs font-bold text-white animate-[fadeIn_.2s_ease-out]"
                  >
                    清空
                  </button>
                ) : (
                  <div className="w-14" />
                )}

                <button
                  onPointerDown={handleMicPointerDown}
                  onPointerUp={handleMicPointerUp}
                  onPointerCancel={handleMicPointerCancel}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`touch-none flex h-20 w-20 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 ${
                    isRecording
                      ? 'animate-pulse-ring scale-95 bg-red-500'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isRecording ? <FaPaperPlane className="animate-pulse text-3xl" /> : <FaMicrophone className="text-3xl" />}
                </button>

                {isRecording ? (
                  <button
                    onClick={stopEverything}
                    className="h-11 w-14 rounded-full bg-white/15 text-xs font-bold text-white animate-[fadeIn_.2s_ease-out]"
                  >
                    取消
                  </button>
                ) : (
                  <div className="w-14" />
                )}
              </div>

              <div className="pointer-events-none absolute -bottom-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {isRecording ? (
                  <span className="text-red-400">点击发送 · 静默自动发送</span>
                ) : isThinking ? (
                  <span className="text-amber-300">思考中...</span>
                ) : isAiSpeaking ? (
                  <div className="tts-bars"><span /><span /><span /><span /><span /></div>
                ) : (
                  `长按切换语言 · ${currentLangObj.flag} ${currentLangObj.name}`
                )}
              </div>
            </div>
          ) : (
            <div className="relative ml-16 mr-16 flex flex-1 items-center rounded-full border border-white/20 bg-white/15 p-1 backdrop-blur-md">
              <input
                type="text"
                className="flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder-slate-300"
                placeholder="打字回复..."
                value={inputText}
                onFocus={stopEverything}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage(inputText);
                    setInputText('');
                  }
                }}
              />
              <button
                onClick={() => {
                  sendMessage(inputText);
                  setInputText('');
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white"
              >
                <FaPaperPlane />
              </button>
            </div>
          )}

          <div className="absolute right-0">
            {isAiSpeaking || isRecording || isThinking ? (
              <button
                onClick={stopEverything}
                className="h-12 w-12 rounded-full bg-white/15 text-white animate-[fadeIn_.2s_ease-out]"
              >
                <FaStop className="mx-auto" />
              </button>
            ) : (
              <button
                onClick={() => setShowText((value) => !value)}
                className={`h-12 w-12 rounded-full transition-colors ${
                  showText ? 'bg-pink-500/45 text-pink-100' : 'bg-white/15 text-white'
                }`}
              >
                {showText ? <FaClosedCaptioning className="mx-auto" /> : <FaCommentSlash className="mx-auto" />}
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
        theme="dark"
      />

      <AISettingsModal
        open={showSettings}
        scene={AI_SCENES.ORAL}
        allSettings={allSettings}
        updateSharedSettings={updateSharedSettings}
        updateSceneSettings={updateSceneSettings}
        selectProvider={selectProvider}
        selectAssistant={selectAssistant}
        resetScenePrompt={resetScenePrompt}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
