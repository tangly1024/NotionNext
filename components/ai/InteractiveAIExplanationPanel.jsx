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
  FaTimes,
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
    /* 隐藏滚动条但保留滚动功能 */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* 录音波纹扩散动画 */
    @keyframes pulse-record {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
      70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(236, 72, 153, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
    }
    .animate-pulse-record { animation: pulse-record 1.5s infinite; }

    /* 头像说话时的光晕呼吸 */
    @keyframes avatar-glow {
      0% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.1); }
      50% { box-shadow: 0 0 60px rgba(236, 72, 153, 0.5); }
      100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.1); }
    }
    .animate-avatar-glow { animation: avatar-glow 2s ease-in-out infinite; }

    /* 语音识别时的动态音轨 */
    @keyframes siri-wave {
      0%, 100% { height: 8px; }
      50% { height: 24px; }
    }
    .siri-bars span {
      display: inline-block; 
      width: 4px; 
      border-radius: 4px;
      background-color: #f472b6;
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
  const [localShowText, setLocalShowText] = useState(true); // 本地 fallback 控制字幕开关

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

  // 兼容底层 Hook 可能没有返回 showText 的情况
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
      <div className="fixed inset-0 z-[2147483000] bg-black/60 backdrop-blur-md" />
      {/* 主界面：深邃背景 */}
      <div className="fixed inset-0 z-[2147483001] isolate flex h-[100dvh] w-full flex-col overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white">
        <GlobalStyles />

        {/* 1. 居中美图头像层 (放到底层，不遮挡操作) */}
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none opacity-85">
          <div className="relative mt-[-10vh]">
            {/* 头像发光背景 */}
            <div className={`absolute -inset-2 rounded-full transition-all duration-700 ${isAiSpeaking ? 'bg-pink-500/40 blur-2xl animate-avatar-glow' : 'bg-transparent'}`} />
            {/* 绝美 AI 老师头像 */}
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
              alt="AI Teacher"
              className="relative z-10 h-64 w-64 md:h-80 md:w-80 rounded-full object-cover border-[3px] border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>

        {/* 2. 顶部导航栏 (恢复设置按钮在右上角) */}
        <div className="relative z-20 flex h-16 items-center justify-between px-4 pt-2 bg-gradient-to-b from-black/70 to-transparent">
          <button
            type="button"
            onClick={() => { stopEverything(); onClose?.(); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white/80 transition-transform active:scale-90 hover:bg-white/20"
          >
            <FaArrowLeft />
          </button>
          
          <div className="text-sm font-bold tracking-widest text-white/90 drop-shadow-md">
            {title}
          </div>
          
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white/80 transition-transform active:scale-90 hover:bg-white/20"
          >
            <FaSlidersH />
          </button>
        </div>

        {/* 3. 核心区域：磨砂玻璃字幕覆盖区 (高度防遮挡) */}
        <div 
          ref={scrollRef}
          className={`relative z-10 flex-1 overflow-y-auto px-5 pb-56 no-scrollbar flex flex-col transition-opacity duration-300 ${
            !actualShowText || showLangPicker ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {!isAIReady ? (
            <div className="m-auto flex flex-col items-center justify-center rounded-3xl bg-black/40 backdrop-blur-xl p-8 border border-white/10">
              <div className="text-lg font-black text-white">先完成 AI 设置</div>
              <div className="mt-2 text-sm text-white/60 mb-6 text-center">需要填写 API Key 和模型<br/>才能开始智能讲题</div>
              <button
                onClick={() => setShowSettings(true)}
                className="rounded-full bg-pink-500 px-8 py-3 text-sm font-bold text-white shadow-lg active:scale-95"
              >
                去设置
              </button>
            </div>
          ) : (
            <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col justify-end min-h-[min-content] pt-10">
              {history.map((msg) => {
                if (msg.role === 'error') {
                  return (
                    <div key={msg.id} className="mb-4 text-center text-sm text-red-300 bg-red-500/20 py-2 rounded-xl backdrop-blur-md">
                      {msg.text}
                    </div>
                  );
                }

                // 用户文本：浅色且清晰，居右靠拢
                if (msg.role === 'user') {
                  return (
                    <div key={msg.id} className="mb-5 self-end text-right">
                      <div className="inline-block text-[15px] font-medium text-slate-800 leading-relaxed px-5 py-3 bg-white/90 backdrop-blur-xl rounded-2xl rounded-tr-sm shadow-xl">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                // AI 回答：磨砂玻璃效果，文本覆盖在头像上
                const aiText = normalizeAssistantText(msg.text || '');
                return (
                  <div key={msg.id} className="mb-8 w-full">
                    <div className="inline-block max-w-[95%] rounded-3xl rounded-tl-sm bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-5 shadow-2xl">
                      <p className="text-[16px] md:text-[17px] font-medium leading-relaxed text-white/95 tracking-wide">
                        {aiText || (msg.isStreaming ? '...' : '')}
                        {msg.isStreaming && <span className="ml-1 inline-block w-2 h-4 bg-pink-400 animate-pulse align-middle" />}
                      </p>
                      
                      {!msg.isStreaming && aiText && (
                        <button
                          type="button"
                          onClick={() => replaySpecificAnswer(msg.text)}
                          className="mt-3 text-white/40 hover:text-pink-400 transition-colors active:scale-90"
                        >
                          <FaVolumeUp size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* 录音时的输入预览 */}
              {isRecording && textMode === false && inputText && (
                 <div className="mb-5 self-end text-right">
                   <p className="inline-block text-[15px] font-medium text-white leading-relaxed px-5 py-3 bg-pink-500/40 border border-pink-500/30 backdrop-blur-md rounded-2xl rounded-tr-sm animate-pulse">
                     {inputText}
                   </p>
                 </div>
              )}
            </div>
          )}
        </div>

        {/* 4. 底部控制台：左键盘，中录音/输入框，右字幕开关 */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-20 pb-[max(24px,env(safe-area-inset-bottom))] px-6 pointer-events-none">
          <div className="max-w-md mx-auto relative flex flex-col items-center pointer-events-auto">
            
            {/* 状态提示 / 音轨动画 (浮在按钮上方) */}
            <div className="absolute -top-14 flex flex-col items-center justify-center w-full">
              {isRecording ? (
                <>
                  <div className="siri-bars flex items-center h-6 mb-1">
                    <span/><span/><span/><span/><span/>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-pink-400">正在听...</span>
                </>
              ) : isThinking ? (
                <span className="text-sm font-bold tracking-widest text-sky-400 animate-pulse">思考中...</span>
              ) : isAiSpeaking ? (
                <span className="text-xs font-bold tracking-widest text-white/50">正在讲解</span>
              ) : (
                <span className="text-xs font-bold tracking-widest text-white/30 drop-shadow-md">
                  {!textMode ? '长按或点击麦克风' : '输入你想问的问题'}
                </span>
              )}
            </div>

            {/* 按钮交互区 */}
            {textMode ? (
              // 文本模式 (输入框)
              <div className="w-full flex items-center gap-3 bg-white/10 p-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl">
                {/* 切换回语音 */}
                <button 
                  onClick={() => setTextMode(false)}
                  className="w-10 h-10 flex shrink-0 justify-center items-center text-white/60 hover:text-white bg-white/5 rounded-full active:scale-90 transition-all"
                >
                  <FaMicrophone size={16}/>
                </button>
                <input
                  type="text"
                  className="flex-1 bg-transparent px-2 text-[15px] text-white outline-none placeholder-white/40"
                  placeholder="文字提问..."
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
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white shadow-md transition-transform active:scale-90"
                >
                  <FaPaperPlane size={14} className="-ml-0.5" />
                </button>
              </div>
            ) : (
              // 语音模式 (左右小按钮，中间大按钮)
              <div className="w-full flex items-center justify-between px-2">
                
                {/* 左侧：切换键盘 */}
                <button
                  type="button"
                  onClick={() => setTextMode(true)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/80 transition-all hover:bg-white/20 active:scale-90"
                >
                  <FaKeyboard size={20} />
                </button>

                {/* 中间：主麦克风大按钮 */}
                <button
                  type="button"
                  onPointerDown={handleMicPointerDown}
                  onPointerUp={handleMicPointerUp}
                  onPointerCancel={handleMicPointerCancel}
                  onPointerLeave={handleMicPointerCancel}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`touch-none flex h-20 w-20 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-200 z-10 ${
                    isRecording
                      ? 'bg-pink-500 scale-95 animate-pulse-record'
                      : isAiSpeaking || isThinking
                      ? 'bg-pink-400/50 hover:bg-pink-400/70'
                      : 'bg-gradient-to-br from-pink-400 to-rose-500 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isAiSpeaking || isThinking ? (
                     <FaStop className="text-3xl drop-shadow-md" onClick={(e)=>{ e.stopPropagation(); stopEverything(); }} />
                  ) : (
                     <FaMicrophone className="text-3xl drop-shadow-md" />
                  )}
                </button>

                {/* 右侧：字幕开关 */}
                <button
                  type="button"
                  onClick={toggleShowText}
                  className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md border transition-all active:scale-90 ${
                    actualShowText
                      ? 'bg-pink-500/20 border-pink-500/50 text-pink-400'
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {actualShowText ? <FaClosedCaptioning size={20} /> : <FaCommentSlash size={20} />}
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
