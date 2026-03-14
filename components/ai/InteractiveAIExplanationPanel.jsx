'use client';

import React from 'react';
import {
  FaArrowLeft,
  FaPaperPlane,
  FaMicrophone,
  FaStop,
  FaRobot,
  FaVolumeUp,
  FaKeyboard
} from 'react-icons/fa';
import { normalizeAssistantText } from './aiTextUtils';
import { useInteractiveAITutor } from './useInteractiveAITutor';

const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes ping-slow {
      75%, 100% { transform: scale(2); opacity: 0; }
    }
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

export default function InteractiveAIExplanationPanel({
  open,
  onClose,
  settings,
  title = 'AI 讲题老师',
  initialPayload = null
}) {
  const {
    history,
    isThinking,
    isAiSpeaking,
    textMode,
    setTextMode,
    inputText,
    setInputText,
    isRecording,
    liveText,
    currentLangObj,
    scrollRef,
    sendMessage,
    startRecording,
    manualSubmitRecording,
    stopEverything,
    replayLastAnswer
  } = useInteractiveAITutor({
    open,
    settings,
    initialPayload
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex flex-col w-full h-[100dvh] bg-slate-950 text-slate-100 overflow-hidden">
      <GlobalStyles />

      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-950/90 pointer-events-none" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4 h-16 border-b border-white/10 backdrop-blur-sm">
        <button
          onClick={() => {
            stopEverything();
            onClose?.();
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white active:scale-90"
        >
          <FaArrowLeft />
        </button>

        <div className="font-bold tracking-widest text-white text-sm">{title}</div>

        <button
          onClick={stopEverything}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white"
        >
          <FaStop />
        </button>
      </div>

      {/* Body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar relative p-4 pb-36 flex flex-col z-10"
      >
        <div className="w-full max-w-2xl mx-auto min-h-full flex flex-col justify-end">
          {history.map((msg) => {
            if (msg.role === 'error') {
              return (
                <div key={msg.id} className="mb-4 pl-12 text-red-300 text-sm">
                  {msg.text}
                </div>
              );
            }

            if (msg.role === 'user') {
              return (
                <div
                  key={msg.id}
                  className="mb-3 pl-12 text-[15px] leading-7 text-slate-300 whitespace-pre-wrap"
                >
                  {msg.text}
                </div>
              );
            }

            const aiText = normalizeAssistantText(msg.text || '');

            return (
              <div key={msg.id} className="mb-4 flex items-start gap-3">
                <div className="mt-0.5 w-9 h-9 rounded-full bg-pink-500/30 border border-pink-400/50 flex items-center justify-center text-pink-100 shrink-0">
                  <FaRobot size={14} />
                </div>
                <div className="flex-1 pt-0.5 text-[15px] leading-7 text-slate-100 whitespace-pre-wrap">
                  {aiText || (msg.isStreaming ? '思考中...' : '')}
                  {msg.isStreaming && (
                    <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-pink-400 animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}

          {isRecording && (
            <div className="flex justify-start pl-12 mb-2">
              <div className="max-w-[92%] text-cyan-100 rounded-xl px-3 py-2 text-sm bg-cyan-500/20 border border-cyan-400/40">
                <span className="opacity-80 mr-2">识别中：</span>
                <span>{liveText || '...'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Control */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-[max(24px,env(safe-area-inset-bottom))] px-5 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-12">
        <div className="max-w-md mx-auto relative flex items-center justify-center h-20">
          <button
            onClick={() => setTextMode((v) => !v)}
            className="absolute left-0 w-12 h-12 rounded-full bg-white/15 text-white active:scale-95 transition-transform"
          >
            {textMode ? <FaMicrophone /> : <FaKeyboard />}
          </button>

          {!textMode ? (
            <div className="flex flex-col items-center w-full">
              <button
                onClick={() => {
                  if (isRecording) manualSubmitRecording();
                  else startRecording();
                }}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
                  isRecording
                    ? 'bg-red-500 animate-pulse-ring scale-95'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95'
                }`}
              >
                {isRecording ? (
                  <FaPaperPlane className="text-3xl animate-pulse" />
                ) : (
                  <FaMicrophone className="text-3xl" />
                )}
              </button>

              <div className="absolute -bottom-6 text-[10px] font-bold text-slate-400 tracking-widest uppercase pointer-events-none">
                {isRecording ? (
                  <span className="text-red-400">点击发送 · 静默自动发送</span>
                ) : isThinking ? (
                  <span className="text-amber-300">思考中...</span>
                ) : isAiSpeaking ? (
                  <div className="tts-bars"><span /><span /><span /><span /><span /></div>
                ) : (
                  `语音对话 · ${currentLangObj.flag}`
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 ml-16 mr-16 relative flex items-center bg-white/10 border border-white/20 rounded-full p-1 backdrop-blur-md">
              <input
                type="text"
                className="flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none"
                placeholder="继续问老师..."
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
                onClick={() => {
                  sendMessage(inputText);
                  setInputText('');
                }}
                className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0"
              >
                <FaPaperPlane />
              </button>
            </div>
          )}

          <div className="absolute right-0">
            {(isAiSpeaking || isRecording || isThinking) ? (
              <button
                onClick={stopEverything}
                className="w-12 h-12 rounded-full bg-white/15 text-white"
              >
                <FaStop />
              </button>
            ) : (
              <button
                onClick={replayLastAnswer}
                className="w-12 h-12 rounded-full bg-white/15 text-white"
              >
                <FaVolumeUp />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
