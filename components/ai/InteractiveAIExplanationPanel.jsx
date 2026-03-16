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
  FaTimes
} from 'react-icons/fa';
import { AI_SCENES, buildExerciseBootstrapPrompt } from './aiAssistants';
import { normalizeAssistantText } from './aiTextUtils';
import { useAISettings } from './useAISettings';
import { useAISession } from './useAISession';
import AISettingsModal from './AISettingsModal';
import RecognitionLanguagePicker from './RecognitionLanguagePicker';

const GlobalStyles = () => (
  <style>{`
    /* 隐藏滚动条但保留滚动功能 */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* 科技感光环呼吸动画 */
    @keyframes glow-ring {
      0% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 20px rgba(56, 189, 248, 0.4); }
      50% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 40px rgba(56, 189, 248, 0.8); }
      100% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 20px rgba(56, 189, 248, 0.4); }
    }
    .animate-glow-ring { animation: glow-ring 2s ease-in-out infinite; }

    /* 录音波纹扩散动画 */
    @keyframes pulse-record {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .animate-pulse-record { animation: pulse-record 1.5s infinite; }

    /* 语音识别时的动态音轨 */
    @keyframes siri-wave {
      0%, 100% { height: 8px; }
      50% { height: 24px; }
    }
    .siri-bars span {
      display: inline-block; 
      width: 4px; 
      border-radius: 4px;
      background-color: #fff;
      margin: 0 3px;
      animation: siri-wave 0.6s ease-in-out infinite;
    }
    .siri-bars span:nth-child(1){ animation-delay: 0.0s; }
    .siri-bars span:nth-child(2){ animation-delay: 0.15s; }
    .siri-bars span:nth-child(3){ animation-delay: 0.3s; }
    .siri-bars span:nth-child(4){ animation-delay: 0.15s; }
    .siri-bars span:nth-child(5){ animation-delay: 0.0s; }
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

  const {
    resolvedSettings,
    updateSharedSettings,
    updateSceneSettings
  } = useAISettings(AI_SCENES.EXERCISE);

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
    replaySpecificAnswer
  } = useAISession({
    open: sessionOpen,
    scene: AI_SCENES.EXERCISE,
    settings: effectiveSettings,
    initialPayload,
    bootstrapBuilder: buildExerciseBootstrapPrompt,
    defaultTextMode: false // 默认语音模式
  });

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
      <div className="fixed inset-0 z-[2147483000] bg-black/60 backdrop-blur-md" />
      {/* 主界面：深邃青蓝色渐变背景 */}
      <div className="fixed inset-0 z-[2147483001] isolate flex h-[100dvh] w-full flex-col overflow-hidden bg-gradient-to-b from-slate-900 via-[#0a192f] to-[#020c1b] text-white">
        <GlobalStyles />

        {/* 顶部导航 */}
        <div className="relative z-20 flex h-14 items-center justify-between px-4 pt-2">
          <button
            type="button"
            onClick={() => { stopEverything(); onClose?.(); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-transform active:scale-90"
          >
            <FaArrowLeft />
          </button>
          <div className="text-sm font-medium tracking-widest text-white/90 opacity-60">
            {title}
          </div>
          <div className="w-10"></div> {/* 占位以居中标题 */}
        </div>

        {/* 核心区域：头像 + 滚动字幕 */}
        <div 
          ref={scrollRef}
          className="relative z-10 flex-1 overflow-y-auto px-6 pb-40 no-scrollbar flex flex-col"
        >
          {/* AI 居中全息头像 */}
          <div className="relative flex justify-center items-center mt-6 mb-10 shrink-0">
            {/* 外层光环 */}
            <div className={`absolute w-36 h-36 rounded-full border border-sky-400/30 transition-all duration-500 ${isAiSpeaking ? 'animate-glow-ring' : 'scale-95 opacity-50'}`}></div>
            {/* 内层光环 */}
            <div className={`absolute w-28 h-28 rounded-full border-2 border-sky-300/50 transition-all duration-300 ${isAiSpeaking ? 'animate-glow-ring' : 'scale-90 opacity-40'}`}></div>
            {/* 头像本体 */}
            <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 p-1 shadow-[0_0_30px_rgba(56,189,248,0.3)]">
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=Teacher&backgroundColor=transparent"
                alt="AI"
                className="w-full h-full object-cover rounded-full bg-[#0a192f]"
              />
            </div>
          </div>

          {/* 滚动字幕区域 (类似截图2) */}
          <div className="flex-1 w-full max-w-xl mx-auto flex flex-col justify-end min-h-[min-content]">
            {history.map((msg) => {
              if (msg.role === 'error') {
                return (
                  <div key={msg.id} className="mb-4 text-center text-sm text-red-400 bg-red-500/10 py-2 rounded-lg">
                    {msg.text}
                  </div>
                );
              }

              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="mb-6 self-end text-right">
                    <p className="inline-block text-[15px] font-medium text-sky-200/80 leading-relaxed px-4 py-2 bg-white/5 rounded-2xl rounded-tr-sm">
                      {msg.text}
                    </p>
                  </div>
                );
              }

              const aiText = normalizeAssistantText(msg.text || '');

              return (
                <div key={msg.id} className="mb-8 w-full">
                  <p className="text-[16px] md:text-[18px] font-medium leading-loose text-white tracking-wide">
                    {aiText || (msg.isStreaming ? '...' : '')}
                    {msg.isStreaming && <span className="ml-1 inline-block w-2 h-4 bg-sky-400 animate-pulse align-middle" />}
                  </p>
                  
                  {!msg.isStreaming && aiText && (
                    <button
                      type="button"
                      onClick={() => replaySpecificAnswer(msg.text)}
                      className="mt-2 text-white/30 hover:text-sky-400 transition-colors active:scale-90"
                    >
                      <FaVolumeUp size={16} />
                    </button>
                  )}
                </div>
              );
            })}

            {/* 正在录音时，用户的实时输入预览 */}
            {isRecording && textMode === false && inputText && (
               <div className="mb-6 self-end text-right">
                 <p className="inline-block text-[15px] font-medium text-white leading-relaxed px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-2xl rounded-tr-sm animate-pulse">
                   {inputText}
                 </p>
               </div>
            )}
          </div>
        </div>

        {/* 底部悬浮控制台 (完美修复按钮不可见问题) */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#020c1b] via-[#020c1b]/90 to-transparent pt-12 pb-[max(24px,env(safe-area-inset-bottom))] px-6">
          <div className="max-w-md mx-auto relative flex flex-col items-center">
            
            {/* 状态提示 / 音轨动画 */}
            <div className="absolute -top-14 flex flex-col items-center justify-center w-full">
              {isRecording ? (
                <>
                  <div className="siri-bars flex items-center h-6 mb-1">
                    <span/><span/><span/><span/><span/>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-red-400">正在听...</span>
                </>
              ) : isThinking ? (
                <span className="text-sm font-medium tracking-widest text-sky-400 animate-pulse">思考中...</span>
              ) : isAiSpeaking ? (
                <span className="text-sm font-medium tracking-widest text-white/50">AI 发音中...</span>
              ) : (
                <span className="text-xs font-medium tracking-widest text-white/30">点击大按钮说话</span>
              )}
            </div>

            {/* 按钮交互区 */}
            {textMode ? (
              // 文本输入模式
              <div className="w-full flex items-center gap-3 bg-white/10 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
                <button 
                  onClick={() => setTextMode(false)}
                  className="w-10 h-10 flex shrink-0 justify-center items-center text-white/60 hover:text-white bg-white/5 rounded-full"
                >
                  <FaTimes size={16}/>
                </button>
                <input
                  type="text"
                  className="flex-1 bg-transparent px-2 text-[15px] text-white outline-none placeholder-white/30"
                  placeholder="输入问题..."
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
                    if (inputText.trim()) {
                      sendMessage(inputText);
                      setInputText('');
                    }
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white shadow-md transition-transform active:scale-90"
                >
                  <FaPaperPlane size={14} className="-ml-0.5" />
                </button>
              </div>
            ) : (
              // 语音模式（三个按钮）
              <div className="w-full flex items-center justify-between px-4">
                {/* 左侧：切换键盘 */}
                <button
                  type="button"
                  onClick={() => setTextMode(true)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 transition-all hover:bg-white/10 active:scale-90"
                >
                  <FaKeyboard size={20} />
                </button>

                {/* 中间：主麦克风大按钮 (带红色样式) */}
                <button
                  type="button"
                  onPointerDown={handleMicPointerDown}
                  onPointerUp={handleMicPointerUp}
                  onPointerCancel={handleMicPointerCancel}
                  onPointerLeave={handleMicPointerCancel}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`touch-none flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-all duration-200 z-10 ${
                    isRecording
                      ? 'bg-red-500 scale-95 animate-pulse-record'
                      : isAiSpeaking || isThinking
                      ? 'bg-red-400/50 hover:bg-red-400/70'
                      : 'bg-red-500 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isAiSpeaking || isThinking ? (
                     <FaStop className="text-3xl" onClick={(e)=>{ e.stopPropagation(); stopEverything(); }} />
                  ) : (
                     <FaMicrophone className="text-3xl" />
                  )}
                </button>

                {/* 右侧：设置 */}
                <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 transition-all hover:bg-white/10 active:scale-90"
                >
                  <FaSlidersH size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 隐藏的组件，供底层调用 */}
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
