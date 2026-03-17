'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { pinyin } from 'pinyin-pro'; // 引入拼音库
import {
  FaArrowLeft,
  FaPaperPlane,
  FaMicrophone,
  FaStop,
  FaKeyboard,
  FaClosedCaptioning,
  FaCommentSlash,
  FaVolumeUp,
  FaSlidersH,
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

    /* 浅蓝干净清新背景 */
    .ai-light-bg {
      background: #f0f7ff;
      background-image: 
        radial-gradient(circle at top left, rgba(59,130,246,0.06), transparent 50%),
        radial-gradient(circle at bottom right, rgba(99,102,241,0.06), transparent 50%);
    }

    /* 防止屏幕手机浏览器复制、长按选中等操作 */
    .prevent-browser-actions {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
    
    /* 允许输入框选中打字 */
    .allow-select {
      -webkit-user-select: auto;
      user-select: auto;
    }

    /* 语音头像朗读时的增强版动态效果 */
    @keyframes tts-speak {
      0% { transform: translateY(0px) scale(1); filter: drop-shadow(0 10px 15px rgba(99, 102, 241, 0.2)); }
      50% { transform: translateY(-8px) scale(1.12); filter: drop-shadow(0 20px 25px rgba(99, 102, 241, 0.4)); box-shadow: 0 0 35px rgba(99,102,241,0.35); }
      100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 10px 15px rgba(99, 102, 241, 0.2)); }
    }
    .animate-tts-speak { 
      animation: tts-speak 2s ease-in-out infinite; 
    }

    /* 滚动条美化 */
    .subtle-scroll::-webkit-scrollbar {
      width: 4px;
    }
    .subtle-scroll::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.1);
      border-radius: 999px;
    }
    .subtle-scroll::-webkit-scrollbar-track {
      background: transparent;
    }

    /* 拼音 Ruby 标签对齐修复 */
    ruby {
      ruby-align: center;
    }
  `}</style>
);

const SHARED_KEYS = [
  'providerId', 'apiUrl', 'apiKey', 'model', 'ttsApiUrl', 
  'ttsVoice', 'zhVoice', 'myVoice', 'ttsSpeed', 'ttsPitch', 
  'soundFx', 'vibration'
];

const SCENE_KEYS = [
  'assistantId', 'systemPrompt', 'temperature', 'showText', 'asrSilenceMs'
];

// 拼音渲染组件
const PinyinText = ({ text }) => {
  const result = pinyin(text, { type: 'all' });

  return (
    <div className="leading-[2.8] tracking-[0.2em] text-[15px] text-slate-800 break-words">
      {result.map((item, i) => {
        if (item.isZh) {
          return (
            <ruby key={i} className="mx-[3px]">
              {item.origin}
              <rt className="text-[10px] text-slate-400 font-normal prevent-browser-actions -translate-y-[2px] block text-center">
                {item.pinyin}
              </rt>
            </ruby>
          );
        }
        return <span key={i}>{item.origin}</span>;
      })}
    </div>
  );
};

// 重新调色的操作按钮
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
      className={`flex h-12 w-12 items-center justify-center rounded-full transition-all border active:scale-95 shadow-sm ${
        danger
          ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-100'
          : active
          ? 'bg-indigo-100 text-indigo-600 border-indigo-200 hover:bg-indigo-200'
          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
      } ${className}`}
    >
      {children}
    </button>
  );
}

function HeaderBar({ title, onBack, onOpenSettings, modelName }) {
  return (
    <div className="relative z-20 flex h-16 items-center justify-between px-4">
      <CircleIconButton onClick={onBack} title="返回" className="h-11 w-11 !border-transparent !bg-transparent !shadow-none hover:!bg-slate-100">
        <FaArrowLeft />
      </CircleIconButton>

      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-2 text-[15px] font-black tracking-[0.18em] text-slate-800">
          <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,.6)]" />
          {title}
        </div>
        <div className="mt-0.5 text-[11px] font-medium text-slate-400">
          语音讲题模式{modelName ? ` · ${modelName}` : ''}
        </div>
      </div>

      <CircleIconButton onClick={onOpenSettings} title="设置" className="h-11 w-11 !border-transparent !bg-transparent !shadow-none hover:!bg-slate-100">
        <FaSlidersH />
      </CircleIconButton>
    </div>
  );
}

function SetupEmptyState({ onOpenSettings }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 text-5xl">🤖</div>
      <div className="text-lg font-black text-slate-800">先完成 AI 设置</div>
      <div className="mt-2 max-w-sm text-sm font-medium leading-6 text-slate-500">
        需要先填写 API Key、接口地址和模型，才能开始自动讲题。
      </div>
      <button
        type="button"
        onClick={onOpenSettings}
        className="mt-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-[0_10px_25px_rgba(99,102,241,.3)] transition-transform active:scale-95"
      >
        去设置
      </button>
    </div>
  );
}

function VoiceCenterState({ isAiSpeaking, isRecording, isThinking }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <img
          src="https://audio.886.best/chinese-vocab-audio/%E5%9B%BE%E7%89%87/images.jpeg"
          alt="Teacher"
          className={`h-48 w-48 object-cover rounded-full border-4 border-white transition-all duration-300 shadow-xl ${
            isAiSpeaking ? 'animate-tts-speak' : ''
          }`}
        />
      </div>

      <div className="mt-12 flex min-h-[44px] items-center justify-center">
        <span className="text-sm font-bold tracking-[0.18em] text-slate-400">
          {isRecording ? '正在倾听...' : isThinking ? '思考中...' : '期待你的提问'}
        </span>
      </div>
      <div className="mt-2 max-w-xs text-center text-xs leading-6 text-slate-400">
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
  const [pinyinMsgs, setPinyinMsgs] = useState(new Set());

  const togglePinyin = (id) => {
    setPinyinMsgs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-2">
      {history.map((msg) => {
        if (msg.role === 'error') {
          return (
            <div key={msg.id} className="mx-8 mb-4 rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-400">
              {msg.text}
            </div>
          );
        }

        if (msg.role === 'user') {
          return (
            <div key={msg.id} className="mb-6 flex justify-end pl-12">
              <div className="whitespace-pre-wrap text-[15px] font-medium leading-7 text-slate-500">
                {msg.text}
              </div>
            </div>
          );
        }

        const aiText = normalizeAssistantText(msg.text || '');
        const showPinyin = pinyinMsgs.has(msg.id);

        return (
          <div key={msg.id} className="mb-8 flex flex-col items-start pr-8">
            <div className="w-full">
              {showPinyin && !msg.isStreaming && aiText ? (
                <PinyinText text={aiText} />
              ) : (
                <div className="inline whitespace-pre-wrap text-[15px] font-medium leading-7 text-slate-800 break-words">
                  {aiText || (msg.isStreaming ? '思考中...' : '')}
                  {msg.isStreaming && (
                    <span className="ml-1 inline-block h-4 w-1.5 animate-pulse rounded-full bg-indigo-400 align-middle" />
                  )}
                </div>
              )}

              {!msg.isStreaming && aiText && (
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => replaySpecificAnswer(msg.text)}
                    className="inline-flex items-center text-slate-300 transition-colors hover:text-indigo-500 active:scale-90"
                    title="重新朗读"
                  >
                    <FaVolumeUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePinyin(msg.id)}
                    className={`inline-flex items-center text-[12px] font-bold transition-colors active:scale-90 ${
                      showPinyin ? 'text-indigo-500' : 'text-slate-300 hover:text-indigo-500'
                    }`}
                    title="切换拼音"
                  >
                    拼
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* 录音时的用户占位 */}
      {isRecording && textMode === false && (
        <div className="mb-6 flex justify-end pl-12">
          <div className="text-[15px] font-medium text-slate-400 opacity-90">
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
    <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 bg-gradient-to-t from-[#f0f7ff] via-[#f0f7ff]/90 to-transparent">
      <div className="mx-auto w-full max-w-3xl px-2">
        {!isAIReady ? (
          <div className="flex h-20 items-center justify-center">
            <button
              type="button"
              onClick={onOpenSettings}
              className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-md active:scale-95"
            >
              打开 AI 设置
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            {/* 切换输入模式按钮 */}
            <div className="shrink-0 flex justify-center w-12">
              <CircleIconButton
                onClick={() => setTextMode((value) => !value)}
                active={!textMode}
                title={textMode ? '切换语音输入' : '切换文字输入'}
              >
                {textMode ? <FaMicrophone size={18} /> : <FaKeyboard size={18} />}
              </CircleIconButton>
            </div>

            <div className="flex-1 flex justify-center relative">
              {!textMode ? (
                // 放大版语音识别按钮区
                <div className="flex flex-col items-center justify-center">
                  <button
                    type="button"
                    onPointerDown={handleMicPointerDown}
                    onPointerUp={handleMicPointerUp}
                    onPointerCancel={handleMicPointerCancel}
                    onPointerLeave={handleMicPointerCancel}
                    onContextMenu={(e) => e.preventDefault()}
                    className={`touch-none flex h-28 w-28 items-center justify-center rounded-full text-white transition-all duration-300 shadow-xl ${
                      isRecording
                        ? 'bg-red-500 scale-95 shadow-red-500/50 animate-pulse'
                        : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:scale-105 active:scale-95 shadow-blue-500/40'
                    }`}
                  >
                    {isRecording ? (
                      <FaStop className="text-4xl" />
                    ) : (
                      <FaMicrophone className="text-5xl" />
                    )}
                  </button>
                  <div className="absolute -bottom-6 w-full text-center whitespace-nowrap text-[11px] font-bold text-slate-400">
                     {isRecording ? (
                      <span className="text-red-500">松开 / 静默自动发送</span>
                    ) : isThinking ? (
                      <span className="text-indigo-400">思考中...</span>
                    ) : isAiSpeaking ? (
                      <span className="text-indigo-400">正在讲话...</span>
                    ) : (
                      `长按切换语言 · ${currentLangObj?.flag || ''} ${currentLangObj?.name || ''}`
                    )}
                  </div>
                </div>
              ) : (
                // 键盘模式：输入框、发送按钮、字幕按钮紧凑排列
                <div className="flex w-full items-center rounded-full bg-white px-2 py-1.5 shadow-sm border border-slate-200">
                  <input
                    type="text"
                    className="allow-select flex-1 bg-transparent px-3 py-2 text-[15px] font-medium text-slate-700 outline-none placeholder-slate-400"
                    placeholder={isRecording ? '听你说...' : '输入消息...'}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.nativeEvent.isComposing) return; // 防止中文拼音回车误发
                      if (e.key === 'Enter' && inputText.trim()) {
                        e.preventDefault();
                        sendMessage(inputText);
                        setInputText('');
                      }
                    }}
                  />
                  <div className="flex items-center gap-1 shrink-0 pr-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (isRecording) stopEverything();
                        if (inputText.trim()) {
                          sendMessage(inputText);
                          setInputText('');
                        }
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm transition-transform active:scale-90"
                    >
                      <FaPaperPlane size={14} className="-ml-0.5" />
                    </button>
                    {/* 字幕按钮内聚到输入框右侧 */}
                    <button
                      type="button"
                      onClick={() => setShowText((value) => !value)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                        showText ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'
                      }`}
                      title={showText ? '隐藏字幕' : '显示字幕'}
                    >
                      {showText ? <FaClosedCaptioning size={18} /> : <FaCommentSlash size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 右侧占位或功能按钮：文本模式下隐藏以让出空间给输入框 */}
            {!textMode && (
              <div className="shrink-0 flex justify-center w-12">
                {isAiSpeaking || isRecording || isThinking ? (
                  <CircleIconButton onClick={stopEverything} danger title="停止">
                    <FaStop size={18} />
                  </CircleIconButton>
                ) : (
                  <CircleIconButton
                    onClick={() => setShowText((value) => !value)}
                    active={showText}
                    title={showText ? '隐藏字幕' : '显示字幕'}
                  >
                    {showText ? <FaClosedCaptioning size={18} /> : <FaCommentSlash size={18} />}
                  </CircleIconButton>
                )}
              </div>
            )}
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

      <div className="fixed inset-0 z-[2147483000] bg-black/40 backdrop-blur-sm" />

      {/* 注入 prevent-browser-actions 防止长按复制等行为 */}
      <div className="prevent-browser-actions fixed inset-0 z-[2147483001] isolate flex h-[100dvh] w-full flex-col overflow-hidden text-slate-800">
        <div className="ai-light-bg absolute inset-0" />

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
          // 增加 pb-56 给下方变大的麦克风按钮留足空间，防止遮挡聊天记录
          className={`subtle-scroll relative z-10 flex-1 overflow-y-auto px-4 pb-56 pt-2 ${
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
