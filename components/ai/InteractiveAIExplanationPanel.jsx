'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { pinyin } from 'pinyin-pro';
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
import { AI_SCENES, buildExerciseBootstrapPrompt, buildOralBootstrapPrompt } from './aiAssistants';
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

// 区分全局设置与场景设置的 Key，确保保存正确生效
const SHARED_KEYS = [
  'providerId',
  'apiUrl',
  'apiKey',
  'model',
  'ttsApiUrl',
  'ttsVoice',
  'zhVoice',
  'myVoice',
  'ttsSpeed',
  'ttsPitch',
  'soundFx',
  'vibration'
];

const SCENE_KEYS = [
  'assistantId',
  'systemPrompt',
  'temperature',
  'showText',
  'asrSilenceMs'
];

// 将文本转换为上方带拼音的 React 节点 (利用 ruby 标签)
function renderTextWithRubyPinyin(text = '') {
  const parts = String(text || '').split(/([\u4e00-\u9fff])/g);
  return (
    <div className="leading-[3.5rem] text-[16px]">
      {parts.map((char, index) => {
        if (/^[\u4e00-\u9fff]$/.test(char)) {
          const py = pinyin(char, { toneType: 'symbol' });
          return (
            <ruby key={index} className="mx-[1px]">
              {char}
              <rt className="text-[12px] font-normal text-pink-500 select-none -translate-y-1">{py}</rt>
            </ruby>
          );
        }
        return <span key={index}>{char}</span>;
      })}
    </div>
  );
}

export default function InteractiveAIExplanationPanel({
  open,
  title = 'AI 讲题老师',
  initialPayload = null,
  onClose,
  settings,
  updateSettings,
  scene = AI_SCENES.EXERCISE // 默认是做题场景，保证其他页面不报错
}) {
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [pinyinPreviewMap, setPinyinPreviewMap] = useState({});

  const { resolvedSettings, updateSharedSettings, updateSceneSettings } = useAISettings(
    scene
  );

  const effectiveSettings = settings || resolvedSettings;

  // 正确区分保存项，解决填了API保存后依旧提示未填写的问题
  const fallbackUpdateSettings = useCallback(
    (patch = {}) => {
      const sharedPatch = {};
      const scenePatch = {};

      Object.entries(patch).forEach(([key, value]) => {
        if (SHARED_KEYS.includes(key)) sharedPatch[key] = value;
        if (SCENE_KEYS.includes(key)) scenePatch[key] = value;
      });

      if (Object.keys(sharedPatch).length) {
        updateSharedSettings(sharedPatch);
      }

      if (Object.keys(scenePatch).length) {
        updateSceneSettings(scene, scenePatch);
      }
    },
    [updateSharedSettings, updateSceneSettings]
  );

  const effectiveUpdateSettings = updateSettings || fallbackUpdateSettings;

  const isAIReady = useMemo(() => {
    return Boolean(
      effectiveSettings?.apiKey &&
      effectiveSettings?.apiUrl &&
      effectiveSettings?.model
    );
  }, [effectiveSettings]);

  // 只有在配置完备的情况下，才真正开启会话，避免报错
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
    showText,
    setShowText,
    replaySpecificAnswer
  } = useAISession({
    open: sessionOpen,
    scene: scene,
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

  useEffect(() => {
    if (open && !isAIReady) {
      setShowSettings(true);
    }
  }, [open, isAIReady]);

  useEffect(() => {
    if (!open) {
      setPinyinPreviewMap({});
    }
  }, [open]);

  const togglePinyinPreview = (msgId) => {
    setPinyinPreviewMap((prev) => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[2147483000] bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 z-[2147483001] flex h-[100dvh] w-full flex-col overflow-hidden bg-white text-slate-800">
        <GlobalStyles />
        <div className="absolute inset-0 ai-chat-bg opacity-70" />

        <div className="relative z-20 flex h-16 items-center justify-between border-b border-white/50 bg-white/70 px-4 shadow-sm backdrop-blur-md">
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

          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 text-[15px] font-black tracking-widest text-slate-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              {title}
            </div>
            {effectiveSettings?.model && (
              <div className="mt-0.5 text-[11px] font-medium text-slate-400">
                模型: {effectiveSettings.model}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition-transform active:scale-90"
          >
            <FaSlidersH />
          </button>
        </div>

        <div
          ref={scrollRef}
          className={`relative z-10 flex-1 overflow-y-auto p-4 pb-44 ${
            showLangPicker ? 'pointer-events-none select-none' : ''
          }`}
        >
          {!isAIReady ? (
            <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
              <div className="text-lg font-black text-slate-700">尚未完成 AI 设置</div>
              <div className="mt-2 text-sm text-slate-500">
                请点击上方按钮或下方去设置填写 API。
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="mt-6 rounded-full bg-pink-500 px-6 py-2 text-white shadow-md active:scale-95"
              >
                去设置
              </button>
            </div>
          ) : !showText ? (
            <div className="flex min-h-full flex-1 flex-col items-center justify-center">
              <div className="relative flex h-56 w-56 items-center justify-center">
                {/* 朗读时的动态声波纹效果 */}
                {isAiSpeaking && (
                  <>
                    <div className="absolute inset-0 animate-pulse-ring rounded-full bg-pink-400/30" />
                    <div className="absolute inset-4 animate-pulse-ring rounded-full bg-pink-300/40" style={{ animationDelay: '0.4s' }} />
                  </>
                )}
                
                <img
                  src="https://audio.886.best/chinese-vocab-audio/%E5%9B%BE%E7%89%87/images.jpeg"
                  alt="Teacher"
                  className={`relative z-10 h-36 w-36 rounded-full border-[6px] border-white object-cover shadow-2xl transition-all duration-500 ${
                    isAiSpeaking
                      ? 'scale-110 shadow-[0_0_60px_rgba(236,72,153,0.6)]'
                      : 'bg-pink-50'
                  }`}
                />
              </div>

              <div className="mt-8 flex h-10 items-center justify-center rounded-full border border-slate-100 bg-white/80 px-6 py-2 shadow-sm backdrop-blur-sm">
                {isAiSpeaking ? (
                  <div className="tts-bars flex items-center gap-1">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                ) : (
                  <span className="text-sm font-bold tracking-widest text-slate-500">
                    {isRecording ? '正在倾听...' : isThinking ? '思考中...' : '期待你的提问~'}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col pt-4">
              {history.map((msg) => {
                if (msg.role === 'error') {
                  return (
                    <div
                      key={msg.id}
                      className="mx-8 mb-4 rounded-xl bg-red-50 py-2 text-center text-xs font-bold text-red-500"
                    >
                      {msg.text}
                    </div>
                  );
                }

                if (msg.role === 'user') {
                  return (
                    // 移除气泡和头像，颜色改浅
                    <div key={msg.id} className="mb-6 flex justify-end pl-12">
                      <div className="max-w-[90%] whitespace-pre-wrap px-2 py-1 text-[15px] font-medium text-slate-400 text-right">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                const aiText = normalizeAssistantText(msg.text || '');

                return (
                  // 移除 AI 头像和气泡背景
                  <div key={msg.id} className="mb-8 flex flex-col">
                    <div className="flex-1 px-2 py-1">
                      <div className="inline whitespace-pre-wrap text-[16px] font-medium text-slate-800">
                        {pinyinPreviewMap[msg.id] 
                          ? renderTextWithRubyPinyin(aiText || (msg.isStreaming ? '思考中...' : ''))
                          : (aiText || (msg.isStreaming ? '思考中...' : ''))
                        }
                        
                        {msg.isStreaming && (
                          <span className="ml-1 inline-block h-4 w-1.5 animate-pulse rounded-full bg-pink-400 align-middle" />
                        )}
                      </div>

                      {!msg.isStreaming && aiText && (
                        <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3">
                          <button
                            type="button"
                            onClick={() => replaySpecificAnswer(msg.text)}
                            className="inline-flex items-center text-slate-300 transition-colors hover:text-pink-500 active:scale-90"
                            title="重新朗读"
                          >
                            <FaVolumeUp size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => togglePinyinPreview(msg.id)}
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-colors active:scale-90 ${
                              pinyinPreviewMap[msg.id]
                                ? 'border-pink-200 bg-pink-50 text-pink-500'
                                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                            title="显示拼音"
                          >
                            {pinyinPreviewMap[msg.id] ? '隐藏拼音' : '显示拼音'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isRecording && textMode === false && (
                <div className="mb-6 flex justify-end pl-12">
                  <div className="max-w-[90%] px-2 py-1 text-[15px] font-medium text-slate-400 text-right opacity-80">
                    <span className="animate-pulse">{inputText || '正在聆听...'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/88 px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-[0_-10px_40px_rgba(0,0,0,.08)] backdrop-blur-xl">
          <div className="relative mx-auto flex h-20 max-w-md items-center justify-center">
            {isAIReady && (
              <button
                type="button"
                onClick={() => setTextMode((value) => !value)}
                className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-transform hover:bg-slate-50 active:scale-95"
              >
                {textMode ? <FaMicrophone size={18} /> : <FaKeyboard size={18} />}
              </button>
            )}

            {!isAIReady ? (
               <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-black text-white shadow-[0_10px_25px_rgba(236,72,153,.28)] active:scale-95"
                >
                  去配置参数
               </button>
            ) : !textMode ? (
              <div className="flex w-full flex-col items-center">
                <button
                  type="button"
                  onPointerDown={handleMicPointerDown}
                  onPointerUp={handleMicPointerUp}
                  onPointerCancel={handleMicPointerCancel}
                  onPointerLeave={handleMicPointerCancel}
                  onContextMenu={(e) => e.preventDefault()}
                  // 麦克风按钮改为白色背景、粉色图标增加对比度
                  className={`touch-none flex h-20 w-20 items-center justify-center rounded-full shadow-[0_10px_25px_rgba(236,72,153,.2)] transition-all duration-300 ${
                    isRecording
                      ? 'animate-pulse-ring scale-95 bg-pink-500 text-white'
                      : 'bg-white text-pink-500 border border-pink-100 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isRecording ? (
                    <FaPaperPlane className="animate-pulse text-3xl" />
                  ) : (
                    <FaMicrophone className="text-3xl" />
                  )}
                </button>

                <div className="pointer-events-none absolute -bottom-6 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {isRecording ? (
                    <span className="text-pink-500">松开发送 · 静默自动发送</span>
                  ) : isThinking ? (
                    <span className="text-violet-500">思考中...</span>
                  ) : isAiSpeaking ? (
                    <div className="tts-bars flex gap-1">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  ) : (
                    `长按说话 · ${currentLangObj.flag} ${currentLangObj.name}`
                  )}
                </div>
              </div>
            ) : (
              <div className="relative ml-16 mr-16 flex flex-1 items-center rounded-2xl border-2 border-pink-200 bg-white px-2 py-1 shadow-md transition focus-within:border-pink-300 focus-within:shadow-lg">
                <input
                  type="text"
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 outline-none placeholder-slate-400"
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
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg transition-transform active:scale-90"
                >
                  <FaPaperPlane size={15} className="-ml-0.5" />
                </button>
              </div>
            )}

            {isAIReady && (
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
            )}
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
          scene={scene}
        />
      </div>
    </>,
    document.body
  );
}
