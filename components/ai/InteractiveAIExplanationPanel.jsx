'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
      0% {
        transform: scale(0.9);
        box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.45);
      }
      70% {
        transform: scale(1.02);
        box-shadow: 0 0 0 24px rgba(236, 72, 153, 0);
      }
      100% {
        transform: scale(0.9);
        box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
      }
    }
    .animate-pulse-ring { animation: pulse-ring 1.35s infinite; }

    @keyframes bars {
      0%,100% { transform: scaleY(.35); opacity:.45; }
      50% { transform: scaleY(1); opacity:1; }
    }
    .tts-bars span {
      display:inline-block;
      width:4px;
      height:20px;
      border-radius:999px;
      background: linear-gradient(180deg,#fb7185,#f472b6);
      margin:0 2px;
      transform-origin: bottom;
      animation: bars 0.55s ease-in-out infinite;
    }
    .tts-bars span:nth-child(2){ animation-delay:.06s; }
    .tts-bars span:nth-child(3){ animation-delay:.12s; }
    .tts-bars span:nth-child(4){ animation-delay:.18s; }
    .tts-bars span:nth-child(5){ animation-delay:.24s; }

    .ai-dark-bg {
      background:
        radial-gradient(circle at top left, rgba(244,114,182,0.12), transparent 28%),
        radial-gradient(circle at top right, rgba(168,85,247,0.14), transparent 32%),
        radial-gradient(circle at bottom center, rgba(244,114,182,0.08), transparent 30%),
        linear-gradient(180deg, #0f0a16 0%, #15101f 45%, #120d1a 100%);
    }

    .glass-panel {
      background: rgba(24, 18, 34, 0.68);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(255,255,255,0.07);
      box-shadow: 0 10px 35px rgba(0,0,0,.22);
    }

    .soft-panel {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }

    .assistant-bubble {
      background:
        linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06));
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 8px 30px rgba(0,0,0,0.16);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .user-bubble {
      background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
      box-shadow: 0 10px 28px rgba(236,72,153,0.28);
    }

    .subtle-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .subtle-scroll::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.10);
      border-radius: 999px;
    }
    .subtle-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
  `}</style>
);

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

function CircleIconButton({
  onClick,
  children,
  active = false,
  danger = false,
  className = '',
  title
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all active:scale-95 ${
        danger
          ? 'border-red-400/20 bg-red-400/10 text-red-300 hover:bg-red-400/15'
          : active
          ? 'border-pink-400/30 bg-pink-400/15 text-pink-200 hover:bg-pink-400/20'
          : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
      } ${className}`}
    >
      {children}
    </button>
  );
}

function HeaderBar({ title, onBack, onOpenSettings, modelName }) {
  return (
    <div className="relative z-20 flex h-16 items-center justify-between px-4">
      <CircleIconButton onClick={onBack} title="返回">
        <FaArrowLeft />
      </CircleIconButton>

      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-2 text-[15px] font-black tracking-[0.18em] text-white">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
          {title}
        </div>
        <div className="mt-0.5 text-[11px] font-medium text-slate-400">
          语音讲题模式{modelName ? ` · ${modelName}` : ''}
        </div>
      </div>

      <CircleIconButton onClick={onOpenSettings} title="设置">
        <FaSlidersH />
      </CircleIconButton>
    </div>
  );
}

function SetupEmptyState({ onOpenSettings }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 text-5xl">🤖</div>
      <div className="text-lg font-black text-white">先完成 AI 设置</div>
      <div className="mt-2 max-w-sm text-sm font-medium leading-6 text-slate-400">
        需要先填写 API Key、接口地址和模型，才能开始自动讲题。
      </div>

      <button
        type="button"
        onClick={onOpenSettings}
        className="mt-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-3 text-sm font-black text-white shadow-[0_10px_25px_rgba(236,72,153,.28)] transition-transform active:scale-95"
      >
        去设置
      </button>
    </div>
  );
}

function VoiceCenterState({ isAiSpeaking, isRecording, isThinking }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center">
      <div className="relative flex h-56 w-56 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-pink-400/10 blur-3xl" />
        {isAiSpeaking && <div className="absolute inset-4 animate-ping rounded-full bg-pink-400/20" />}

        <div
          className={`relative z-10 flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 shadow-[0_20px_60px_rgba(236,72,153,.18)] transition-all duration-300 ${
            isAiSpeaking ? 'scale-110 ring-4 ring-pink-300/10' : ''
          }`}
        >
          <img
            src="https://api.dicebear.com/7.x/bottts/svg?seed=Teacher&backgroundColor=fce4ec"
            alt="Teacher"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      </div>

      <div className="mt-8 flex min-h-[44px] items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-2 backdrop-blur-sm">
        {isAiSpeaking ? (
          <div className="tts-bars flex items-center gap-1">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        ) : (
          <span className="text-sm font-bold tracking-[0.18em] text-slate-300">
            {isRecording ? '正在倾听...' : isThinking ? '思考中...' : '期待你的提问'}
          </span>
        )}
      </div>

      <div className="mt-4 max-w-xs text-center text-xs leading-6 text-slate-500">
        按住下方麦克风可以直接提问，我会帮你分步骤讲解题目。
      </div>
    </div>
  );
}

function ChatList({
  history,
  isRecording,
  textMode,
  inputText,
  replaySpecificAnswer
}) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col">
      {history.map((msg) => {
        if (msg.role === 'error') {
          return (
            <div
              key={msg.id}
              className="mx-8 mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-center text-xs font-bold text-red-200"
            >
              {msg.text}
            </div>
          );
        }

        if (msg.role === 'user') {
          return (
            <div key={msg.id} className="mb-4 flex justify-end pl-12">
              <div className="user-bubble max-w-[90%] whitespace-pre-wrap rounded-[22px] rounded-tr-md px-5 py-3 text-[15px] font-medium leading-7 text-white">
                {msg.text}
              </div>
            </div>
          );
        }

        const aiText = normalizeAssistantText(msg.text || '');

        return (
          <div key={msg.id} className="mb-6 flex items-start gap-3">
            <div className="mt-1 h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-md">
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=Teacher&backgroundColor=fce4ec"
                className="h-full w-full object-cover"
                alt="AI"
              />
            </div>

            <div className="flex-1">
              <div className="assistant-bubble inline-block rounded-[22px] rounded-tl-md px-5 py-4">
                <div className="inline whitespace-pre-wrap text-[15px] font-medium leading-7 text-slate-100">
                  {aiText || (msg.isStreaming ? '思考中...' : '')}
                  {msg.isStreaming && (
                    <span className="ml-1 inline-block h-4 w-1.5 animate-pulse rounded-full bg-pink-400 align-middle" />
                  )}
                </div>

                {!msg.isStreaming && aiText && (
                  <button
                    type="button"
                    onClick={() => replaySpecificAnswer(msg.text)}
                    className="ml-3 mt-1 inline-flex items-center align-middle text-slate-400 transition-colors hover:text-pink-300 active:scale-90"
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
          <div className="user-bubble max-w-[90%] rounded-[22px] rounded-tr-md px-5 py-3 text-[15px] font-medium text-white opacity-90">
            <span className="animate-pulse">{inputText || '正在聆听...'}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function BottomControlBar({
  isAIReady,
  onOpenSettings,
  textMode,
  setTextMode,
  isRecording,
  isThinking,
  isAiSpeaking,
  inputText,
  setInputText,
  sendMessage,
  stopEverything,
  handleMicPointerDown,
  handleMicPointerUp,
  handleMicPointerCancel,
  showText,
  setShowText,
  currentLangObj
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3">
      <div className="glass-panel mx-auto w-full max-w-3xl rounded-[28px] px-4 py-3">
        {!isAIReady ? (
          <div className="flex h-20 items-center justify-center">
            <button
              type="button"
              onClick={onOpenSettings}
              className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-black text-white shadow-[0_10px_25px_rgba(236,72,153,.28)] active:scale-95"
            >
              打开 AI 设置
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <CircleIconButton
              onClick={() => setTextMode((value) => !value)}
              active={!textMode}
              title={textMode ? '切换语音输入' : '切换文字输入'}
              className="shrink-0"
            >
              {textMode ? <FaMicrophone size={17} /> : <FaKeyboard size={17} />}
            </CircleIconButton>

            <div className="flex-1">
              {!textMode ? (
                <div className="flex flex-col items-center justify-center">
                  <button
                    type="button"
                    onPointerDown={handleMicPointerDown}
                    onPointerUp={handleMicPointerUp}
                    onPointerCancel={handleMicPointerCancel}
                    onPointerLeave={handleMicPointerCancel}
                    onContextMenu={(e) => e.preventDefault()}
                    className={`touch-none flex h-20 w-20 items-center justify-center rounded-full text-white transition-all duration-300 ${
                      isRecording
                        ? 'animate-pulse-ring bg-pink-500'
                        : 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-[0_14px_35px_rgba(236,72,153,.28)] hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isRecording ? (
                      <FaPaperPlane className="animate-pulse text-3xl" />
                    ) : (
                      <FaMicrophone className="text-3xl" />
                    )}
                  </button>

                  <div className="mt-3 min-h-[18px] whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {isRecording ? (
                      <span className="text-pink-300">点击发送 · 静默自动发送</span>
                    ) : isThinking ? (
                      <span className="text-violet-300">思考中...</span>
                    ) : isAiSpeaking ? (
                      <div className="tts-bars flex gap-1">
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                    ) : (
                      `长按切换语言 · ${currentLangObj.flag} ${currentLangObj.name}`
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1.5 shadow-inner backdrop-blur-sm">
                  <input
                    type="text"
                    className="flex-1 bg-transparent px-4 py-2 text-sm font-medium text-white outline-none placeholder-slate-500"
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
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-[0_8px_20px_rgba(236,72,153,.28)] transition-transform active:scale-90"
                  >
                    <FaPaperPlane size={14} className="-ml-0.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="shrink-0">
              {isAiSpeaking || isRecording || isThinking ? (
                <CircleIconButton
                  onClick={stopEverything}
                  danger
                  title="停止"
                  className="h-12 w-12"
                >
                  <FaStop size={17} />
                </CircleIconButton>
              ) : (
                <CircleIconButton
                  onClick={() => setShowText((value) => !value)}
                  active={showText}
                  title={showText ? '隐藏字幕' : '显示字幕'}
                  className="h-12 w-12"
                >
                  {showText ? <FaClosedCaptioning size={18} /> : <FaCommentSlash size={18} />}
                </CircleIconButton>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
        updateSceneSettings(AI_SCENES.EXERCISE, scenePatch);
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
    if (open && !isAIReady) {
      setShowSettings(true);
    }
  }, [open, isAIReady]);

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
      <GlobalStyles />

      <div className="fixed inset-0 z-[2147483000] bg-black/60 backdrop-blur-sm" />

      <div className="fixed inset-0 z-[2147483001] isolate flex h-[100dvh] w-full flex-col overflow-hidden text-white">
        <div className="ai-dark-bg absolute inset-0" />

        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-[-10%] top-[-10%] h-[280px] w-[280px] rounded-full bg-pink-500/10 blur-3xl" />
          <div className="absolute right-[-10%] top-[10%] h-[260px] w-[260px] rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute bottom-[-5%] left-[20%] h-[220px] w-[220px] rounded-full bg-rose-500/10 blur-3xl" />
        </div>

        <HeaderBar
          title={title}
          onBack={() => {
            stopEverything();
            onClose?.();
          }}
          onOpenSettings={() => setShowSettings(true)}
          modelName={effectiveSettings?.model}
        />

        <div
          ref={scrollRef}
          className={`subtle-scroll relative z-10 flex-1 overflow-y-auto px-4 pb-44 pt-2 ${
            showLangPicker ? 'pointer-events-none select-none' : ''
          }`}
        >
          {!isAIReady ? (
            <SetupEmptyState onOpenSettings={() => setShowSettings(true)} />
          ) : !showText ? (
            <VoiceCenterState
              isAiSpeaking={isAiSpeaking}
              isRecording={isRecording}
              isThinking={isThinking}
            />
          ) : (
            <ChatList
              history={history}
              isRecording={isRecording}
              textMode={textMode}
              inputText={inputText}
              replaySpecificAnswer={replaySpecificAnswer}
            />
          )}
        </div>

        <BottomControlBar
          isAIReady={isAIReady}
          onOpenSettings={() => setShowSettings(true)}
          textMode={textMode}
          setTextMode={setTextMode}
          isRecording={isRecording}
          isThinking={isThinking}
          isAiSpeaking={isAiSpeaking}
          inputText={inputText}
          setInputText={setInputText}
          sendMessage={sendMessage}
          stopEverything={stopEverything}
          handleMicPointerDown={handleMicPointerDown}
          handleMicPointerUp={handleMicPointerUp}
          handleMicPointerCancel={handleMicPointerCancel}
          showText={showText}
          setShowText={setShowText}
          currentLangObj={currentLangObj}
        />

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
