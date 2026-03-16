'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FaArrowLeft,
  FaPaperPlane,
  FaMicrophone,
  FaStop,
  FaKeyboard,
  FaSlidersH,
  FaVolumeUp,
  FaClosedCaptioning,
  FaCommentSlash
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

    /* 底部大麦克风发光呼吸 */
    @keyframes mic-pulse {
      0% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.6); transform: scale(0.95); }
      70% { box-shadow: 0 0 0 25px rgba(236, 72, 153, 0); transform: scale(1.05); }
      100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); transform: scale(0.95); }
    }
    .animate-mic-pulse { animation: mic-pulse 1.5s infinite; }

    /* AI 说话时头像的水纹光环 */
    @keyframes avatar-ripple {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    .ripple-1 { animation: avatar-ripple 2s linear infinite; }
    .ripple-2 { animation: avatar-ripple 2s linear infinite 0.6s; }
    .ripple-3 { animation: avatar-ripple 2s linear infinite 1.2s; }
  `}</style>
);

const SHARED_KEYS = [
  'providerId', 'apiUrl', 'apiKey', 'model', 'ttsApiUrl', 
  'ttsVoice', 'zhVoice', 'myVoice', 'ttsSpeed', 'ttsPitch', 'soundFx', 'vibration'
];
const SCENE_KEYS = ['assistantId', 'systemPrompt', 'temperature', 'showText', 'asrSilenceMs'];

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
  const [localShowText, setLocalShowText] = useState(true);

  const { resolvedSettings, updateSharedSettings, updateSceneSettings } = useAISettings(AI_SCENES.EXERCISE);
  const effectiveSettings = settings || resolvedSettings;

  const fallbackUpdateSettings = useCallback((patch = {}) => {
    const sharedPatch = {};
    const scenePatch = {};
    Object.entries(patch).forEach(([key, value]) => {
      if (SHARED_KEYS.includes(key)) sharedPatch[key] = value;
      if (SCENE_KEYS.includes(key)) scenePatch[key] = value;
    });
    if (Object.keys(sharedPatch).length) updateSharedSettings(sharedPatch);
    if (Object.keys(scenePatch).length) updateSceneSettings(AI_SCENES.EXERCISE, scenePatch);
  }, [updateSharedSettings, updateSceneSettings]);

  const effectiveUpdateSettings = updateSettings || fallbackUpdateSettings;

  const isAIReady = useMemo(() => {
    return Boolean(effectiveSettings?.apiKey && effectiveSettings?.apiUrl && effectiveSettings?.model);
  }, [effectiveSettings]);

  const sessionOpen = open && isAIReady;

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
    replaySpecificAnswer,
    showText,
    setShowText
  } = useAISession({
    open: sessionOpen,
    scene: AI_SCENES.EXERCISE,
    settings: effectiveSettings,
    initialPayload,
    bootstrapBuilder: buildExerciseBootstrapPrompt,
    defaultTextMode: false
  });

  const actualShowText = showText ?? localShowText;
  const toggleShowText = () => {
    if (setShowText) setShowText(!actualShowText);
    else setLocalShowText(!actualShowText);
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open && !isAIReady) setShowSettings(true);
  }, [open, isAIReady]);

  // 阻止底层滚动
  useEffect(() => {
    if (!open) return undefined;
    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevBodyOverflow; };
  }, [open]);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, inputText, isRecording]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[2147483000] bg-black/80 backdrop-blur-xl" />
      {/* 极简高级科技背景 */}
      <div className="fixed inset-0 z-[2147483001] isolate flex h-[100dvh] w-full flex-col overflow-hidden bg-gradient-to-br from-[#0a0f1a] via-[#121629] to-[#0a0f1a] text-white font-sans tracking-wide">
        <GlobalStyles />

        {/* --- 顶部导航 --- */}
        <div className="relative z-20 flex h-16 items-center justify-between px-5 pt-2">
          <button
            type="button"
            onClick={() => { stopEverything(); onClose?.(); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 backdrop-blur-md transition-transform active:scale-90"
          >
            <FaArrowLeft />
          </button>
          <div className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
            {title}
          </div>
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 backdrop-blur-md transition-transform active:scale-90"
          >
            <FaSlidersH />
          </button>
        </div>

        {/* --- 内容滚动区 (头像在顶，文字在下，无气泡) --- */}
        <div 
          ref={scrollRef}
          className="relative z-10 flex-1 overflow-y-auto px-6 pb-48 no-scrollbar scroll-smooth"
        >
          {/* 1. 圆形美女头像及动态光环 */}
          <div className="flex flex-col items-center justify-center pt-8 pb-10">
            <div className="relative flex items-center justify-center">
              {/* TTS 动态光环 (AI说话时展现) */}
              {isAiSpeaking && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-pink-500/30 ripple-1" />
                  <div className="absolute inset-0 rounded-full border-2 border-pink-500/20 ripple-2" />
                  <div className="absolute inset-0 rounded-full border-2 border-pink-500/10 ripple-3" />
                </>
              )}
              {/* 真人美女头像 */}
              <div className={`relative z-10 h-28 w-28 rounded-full p-1 transition-all duration-500 ${isAiSpeaking ? 'bg-gradient-to-tr from-pink-500 to-violet-500 shadow-[0_0_40px_rgba(236,72,153,0.4)]' : 'bg-white/10'}`}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" // 高级质感女生头像
                  alt="AI Assistant"
                  className="h-full w-full rounded-full object-cover border-2 border-[#0a0f1a]"
                />
              </div>
            </div>
            
            {/* 头像下方简短状态 */}
            <div className="mt-6 text-[11px] font-bold tracking-[0.15em] text-white/30 uppercase">
              {isThinking ? (
                <span className="animate-pulse text-sky-400">Thinking...</span>
              ) : isAiSpeaking ? (
                <span className="text-pink-400">Speaking</span>
              ) : isRecording ? (
                <span className="text-red-400 animate-pulse">Listening...</span>
              ) : (
                'Active'
              )}
            </div>
          </div>

          {/* 2. 纯净流式文本区 (无气泡) */}
          {actualShowText && (
            <div className="mx-auto flex w-full max-w-2xl flex-col pb-10">
              {history.map((msg) => {
                // 报错信息
                if (msg.role === 'error') {
                  return <div key={msg.id} className="mb-6 text-center text-sm text-red-400">{msg.text}</div>;
                }

                // 用户提问：浅色、稍小、偏右对齐
                if (msg.role === 'user') {
                  return (
                    <div key={msg.id} className="mb-6 w-full flex justify-end">
                      <div className="max-w-[85%] text-[15px] font-normal leading-relaxed text-white/40">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                // AI 回答：主色、大字号、偏左对齐、纯文字
                const aiText = normalizeAssistantText(msg.text || '');
                return (
                  <div key={msg.id} className="mb-10 w-full flex flex-col items-start">
                    <div className="max-w-[95%] text-[17px] font-medium leading-loose text-white/95 drop-shadow-md tracking-wide">
                      {aiText || (msg.isStreaming ? '...' : '')}
                      {msg.isStreaming && <span className="ml-1 inline-block h-4 w-[2px] animate-pulse align-middle bg-pink-500" />}
                    </div>
                    {!msg.isStreaming && aiText && (
                      <button
                        type="button"
                        onClick={() => replaySpecificAnswer(msg.text)}
                        className="mt-2 text-white/20 hover:text-pink-400 transition-colors active:scale-90"
                      >
                        <FaVolumeUp size={14} />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* 用户正在语音输入时的占位预览 */}
              {isRecording && !textMode && inputText && (
                 <div className="mb-6 w-full flex justify-end">
                   <div className="max-w-[85%] text-[15px] font-normal leading-relaxed text-white/30 animate-pulse">
                     {inputText}
                   </div>
                 </div>
              )}
            </div>
          )}
        </div>

        {/* --- 底部控制台 (完美复刻图片) --- */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#05080f] via-[#05080f]/90 to-transparent pt-16 pb-[calc(env(safe-area-inset-bottom)+20px)] px-6 pointer-events-none">
          <div className="max-w-md mx-auto relative flex flex-col items-center pointer-events-auto">

            {!textMode ? (
              /* ========== 语音模式 (Image 1) ========== */
              <>
                <div className="w-full flex items-center justify-between px-2">
                  {/* 左：半透明小按键 (键盘) */}
                  <button
                    onClick={() => setTextMode(true)}
                    className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white/10 text-white/50 transition-all hover:bg-white/20 active:scale-90 backdrop-blur-md"
                  >
                    <FaKeyboard size={16} />
                  </button>

                  {/* 中：洋红色发光大按钮 (麦克风) */}
                  <div className="relative">
                    <button
                      onPointerDown={handleMicPointerDown}
                      onPointerUp={handleMicPointerUp}
                      onPointerCancel={handleMicPointerCancel}
                      onPointerLeave={handleMicPointerCancel}
                      onContextMenu={(e) => e.preventDefault()}
                      className={`touch-none flex h-20 w-20 items-center justify-center rounded-full text-white transition-all duration-300 z-10 ${
                        isRecording
                          ? 'bg-[#e91e63] animate-mic-pulse scale-95'
                          : isAiSpeaking || isThinking
                          ? 'bg-[#e91e63]/50'
                          : 'bg-[#e91e63] hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(233,30,99,0.4)]'
                      }`}
                    >
                      {isAiSpeaking || isThinking ? (
                         <FaStop className="text-2xl" onClick={(e)=>{ e.stopPropagation(); stopEverything(); }} />
                      ) : (
                         <FaMicrophone className="text-2xl" />
                      )}
                    </button>
                  </div>

                  {/* 右：CC 字幕键 (根据状态变色) */}
                  <button
                    onClick={toggleShowText}
                    className={`flex h-[42px] w-[42px] items-center justify-center rounded-full transition-all active:scale-90 backdrop-blur-md ${
                      actualShowText
                        ? 'bg-[#e91e63] text-white shadow-[0_0_15px_rgba(233,30,99,0.5)]'
                        : 'bg-white/10 text-white/50 hover:bg-white/20'
                    }`}
                  >
                    {actualShowText ? <FaClosedCaptioning size={16} /> : <FaCommentSlash size={16} />}
                  </button>
                </div>

                {/* 底部语言提示小字 */}
                <div className="absolute -bottom-6 flex items-center gap-1 text-[10px] text-white/40 tracking-wide pointer-events-none">
                  长按切换语言: <span>{currentLangObj.flag} {currentLangObj.name}</span>
                </div>
              </>
            ) : (
              /* ========== 文本模式 (Image 2) ========== */
              <div className="w-full flex items-center justify-between gap-3 px-2">
                {/* 左：半透明小按键 (麦克风) */}
                <button
                  onClick={() => setTextMode(false)}
                  className="flex shrink-0 h-[42px] w-[42px] items-center justify-center rounded-full bg-white/10 text-white/50 transition-all hover:bg-white/20 active:scale-90 backdrop-blur-md"
                >
                  <FaMicrophone size={16} />
                </button>

                {/* 中间：玻璃磨砂质感输入框 + 内置发送按钮 */}
                <div className="flex-1 flex items-center h-[52px] bg-white/10 backdrop-blur-xl rounded-full border border-white/5 pl-5 pr-1.5 shadow-inner">
                  <input
                    type="text"
                    className="flex-1 bg-transparent text-[15px] text-white outline-none placeholder-white/30"
                    placeholder="打字回复..."
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
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      inputText.trim() ? 'bg-[#e91e63] text-white shadow-[0_0_15px_rgba(233,30,99,0.5)] active:scale-90' : 'bg-white/10 text-white/30'
                    }`}
                  >
                    <FaPaperPlane size={14} className="-ml-0.5" />
                  </button>
                </div>

                {/* 右：CC 字幕键 */}
                <button
                  onClick={toggleShowText}
                  className={`flex shrink-0 h-[42px] w-[42px] items-center justify-center rounded-full transition-all active:scale-90 backdrop-blur-md ${
                    actualShowText
                      ? 'bg-[#e91e63] text-white shadow-[0_0_15px_rgba(233,30,99,0.5)]'
                      : 'bg-white/10 text-white/50 hover:bg-white/20'
                  }`}
                >
                  {actualShowText ? <FaClosedCaptioning size={16} /> : <FaCommentSlash size={16} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- 隐藏弹窗 --- */}
        <RecognitionLanguagePicker
          open={showLangPicker}
          recLang={recLang}
          setRecLang={setRecLang}
          onClose={() => setShowLangPicker(false)}
          theme="dark"
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
