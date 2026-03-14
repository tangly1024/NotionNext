// components/ai/InteractiveAIExplanationPanel.jsx
'use client';

import React from 'react';
import {
  FaArrowLeft,
  FaPaperPlane,
  FaMicrophone,
  FaStop,
  FaRobot,
  FaKeyboard,
  FaClosedCaptioning,
  FaCommentSlash
} from 'react-icons/fa';
import { normalizeAssistantText } from './aiTextUtils';
import { useInteractiveAITutor } from './useInteractiveAITutor';
import { RECOGNITION_LANGS } from './aiConfig';

const GlobalStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes ping-slow {
      75%, 100% { transform: scale(2); opacity: 0; }
    }
    .animate-ping-slow { animation: ping-slow 1.6s cubic-bezier(0,0,0.2,1) infinite; }

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
    stopEverything,
    recLang,
    setRecLang,
    showLangPicker,
    setShowLangPicker,
    handleMicPointerDown,
    handleMicPointerUp,
    handleMicPointerCancel,
    showText,
    setShowText
  } = useInteractiveAITutor({
    open,
    settings,
    initialPayload
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex flex-col w-full h-[100dvh] bg-slate-50 text-slate-800 overflow-hidden">
      <GlobalStyles />

      {/* 亮色毛玻璃背景 */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400')" }}
      />
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4 h-16 border-b border-slate-200/50 backdrop-blur-sm">
        <button
          onClick={() => {
            stopEverything();
            onClose?.();
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/60 text-slate-600 active:scale-90 shadow-sm"
        >
          <FaArrowLeft />
        </button>

        <div className="font-bold tracking-widest text-slate-800 text-sm">{title}</div>

        <div className="w-10 h-10" /> {/* 去除右上角的停止，保留占位让文字居中 */}
      </div>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative p-4 pb-36 flex flex-col z-10">
        {!showText && !textMode ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-56 h-56 pointer-events-none">
              {isAiSpeaking && <div className="absolute inset-0 rounded-full bg-pink-400/20 animate-ping-slow" />}
              {isAiSpeaking && <div className="absolute inset-6 rounded-full bg-violet-400/20 animate-ping-slow" style={{ animationDelay: '.4s' }} />}
              <div className={`relative z-10 flex items-center justify-center w-32 h-32 rounded-full transition-all duration-300 ${isAiSpeaking ? 'scale-110 bg-pink-500 shadow-[0_0_30px_rgba(236,72,153,.4)]' : 'bg-white shadow-sm border border-slate-100'}`}>
                <FaMicrophone className={`text-5xl ${isAiSpeaking ? 'text-white' : 'text-slate-300'}`} />
              </div>
            </div>
            <div className="mt-8 h-10 flex items-center justify-center">
              {isAiSpeaking ? <div className="tts-bars"><span /><span /><span /><span /><span /></div> : <span className="text-sm tracking-widest text-slate-400 font-medium">{isRecording ? '正在倾听...' : isThinking ? '思考中...' : '请说话'}</span>}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto min-h-full flex flex-col justify-end">
            {history.map((msg) => {
              if (msg.role === 'error') {
                return (
                  <div key={msg.id} className="mb-4 pl-12 text-red-500 text-sm font-medium">
                    {msg.text}
                  </div>
                );
              }

              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="mb-3 pl-12 text-[15px] leading-7 text-slate-500 whitespace-pre-wrap font-medium">
                    {msg.text}
                  </div>
                );
              }

              const aiText = normalizeAssistantText(msg.text || '');

              return (
                <div key={msg.id} className="mb-4 flex items-start gap-3">
                  <div className="mt-0.5 w-9 h-9 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-500 shrink-0 shadow-sm">
                    <FaRobot size={14} />
                  </div>
                  <div className="flex-1 pt-0.5 text-[15px] leading-7 text-slate-700 whitespace-pre-wrap font-medium">
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
                <div className="max-w-[92%] text-cyan-800 rounded-xl px-3 py-2 text-sm bg-cyan-50 border border-cyan-200/60 shadow-sm font-medium">
                  <span className="opacity-80 mr-2">识别中：</span>
                  <span>{liveText || '...'}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Control */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-[max(24px,env(safe-area-inset-bottom))] px-5 bg-gradient-to-t from-white via-white/95 to-transparent pt-12">
        <div className="max-w-md mx-auto relative flex items-center justify-center h-20">
          
          <button
            onClick={() => setTextMode((v) => !v)}
            className="absolute left-0 w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-500 active:scale-95 transition-transform shadow-sm flex items-center justify-center"
          >
            {textMode ? <FaMicrophone /> : <FaKeyboard />}
          </button>

          {!textMode ? (
            <div className="flex flex-col items-center w-full">
              <button
                onPointerDown={handleMicPointerDown}
                onPointerUp={handleMicPointerUp}
                onPointerCancel={handleMicPointerCancel}
                onContextMenu={(e) => e.preventDefault()}
                className={`touch-none w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 ${
                  isRecording
                    ? 'bg-red-500 animate-pulse-ring scale-95'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95'
                }`}
              >
                {isRecording ? <FaPaperPlane className="text-3xl animate-pulse" /> : <FaMicrophone className="text-3xl" />}
              </button>

              <div className="absolute -bottom-6 text-[10px] font-bold text-slate-400 tracking-widest uppercase pointer-events-none whitespace-nowrap">
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
            <div className="flex-1 ml-16 mr-16 relative flex items-center bg-slate-100 border border-slate-200 rounded-full p-1 shadow-inner">
              <input
                type="text"
                className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-800 outline-none placeholder-slate-400"
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
                className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-sm"
              >
                <FaPaperPlane size={14} />
              </button>
            </div>
          )}

          {/* 右侧修改：不再是喇叭，而是字幕的开关或者停止按钮 */}
          <div className="absolute right-0 flex items-center justify-center gap-2">
            {(isAiSpeaking || isRecording || isThinking) ? (
              <button
                onClick={stopEverything}
                className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-500 shadow-sm flex items-center justify-center active:scale-95 transition-transform"
              >
                <FaStop />
              </button>
            ) : (
              <button
                onClick={() => setShowText((v) => !v)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors shadow-sm active:scale-95 ${
                  showText 
                    ? 'bg-pink-100 border-pink-200 text-pink-500' 
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
              >
                {showText ? <FaClosedCaptioning size={18} /> : <FaCommentSlash size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 语言选择面板弹窗 (亮色版) */}
      {showLangPicker && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowLangPicker(false)} />
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-[fadeIn_.2s_ease-out]">
            <h3 className="font-bold text-lg mb-4 text-center text-slate-800">选择识别语言</h3>
            <div className="grid grid-cols-2 gap-3">
              {RECOGNITION_LANGS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setRecLang(lang.code);
                    setShowLangPicker(false);
                  }}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-colors ${
                    recLang === lang.code
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-slate-200 bg-slate-50 active:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-bold text-xs text-slate-600">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
