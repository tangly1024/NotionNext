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

    /* 浅色干净背景 */
    .ai-light-bg {
      background: #f8fafc;
      background-image: 
        radial-gradient(circle at top right, rgba(244,114,182,0.03), transparent 40%),
        radial-gradient(circle at bottom left, rgba(168,85,247,0.03), transparent 40%);
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

    /* 语音头像朗读时的动态效果 */
    @keyframes tts-speak {
      0% { transform: translateY(0px) scale(1); filter: drop-shadow(0 10px 15px rgba(236, 72, 153, 0.1)); }
      50% { transform: translateY(-5px) scale(1.03); filter: drop-shadow(0 15px 25px rgba(236, 72, 153, 0.3)); }
      100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 10px 15px rgba(236, 72, 153, 0.1)); }
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

// 拼音渲染组件：解决偏移，增加间距和行高
const PinyinText = ({ text }) => {
  // 使用 type: 'all' 返回包含 isZh、origin、pinyin 的对象数组，准确处理多音字上下文
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
      className={`flex h-11 w-11 items-center justify-center rounded-full transition-all active:scale-95 ${
        danger
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : active
          ? 'bg-pink-100 text-pink-500 hover:bg-pink-200'
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
        <div className="flex items-center gap-2 text-[15px] font-black tracking-[0.18em] text-slate-800">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.5)]" />
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
      <div className="text-lg font-black text-slate-800">先完成 AI 设置</div>
      <div className="mt-2 max-w-sm text-sm font-medium leading-6 text-slate-500">
        需要先填写 API Key、接口地址和模型，才能开始自动讲题。
      </div>
      <button
        type="button"
        onClick={onOpenSettings}
        className="mt-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-3 text-sm font-black text-white shadow-[0_10px_25px_rgba(236,72,153,.25)] transition-transform active:scale-95"
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
          className={`h-48 w-48 object-cover rounded-xl transition-all duration-300 shadow-sm ${
            isAiSpeaking ? 'animate-tts-speak' : ''
          }`}
        />
      </div>

      <div className="mt-10 flex min-h-[44px] items-center justify-center">
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
  // 记录哪些消息开启了拼音显示
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

        // 用户文本：颜色较浅，无头像无气泡
        if (msg.role === 'user') {
          return (
            <div key={msg.id} className="mb-6 flex justify-end pl-12">
              <div className="whitespace-pre-wrap text-[15px] font-medium leading-7 text-slate-400">
                {msg.text}
              </div>
            </div>
          );
        }

        const aiText = normalizeAssistantText(msg.text || '');
        const showPinyin = pinyinMsgs.has(msg.id);

        // AI 文本：颜色较深，无头像无气泡
        return (
          <div key={msg.id} className="mb-8 flex flex-col items-start pr-8">
            <div className="w-full">
              {showPinyin && !msg.isStreaming && aiText ? (
                <PinyinText text={aiText} />
              ) : (
                <div className="inline whitespace-pre-wrap text-[15px] font-medium leading-7 text-slate-800 break-words">
                  {aiText || (msg.isStreaming ? '思考中...' : '')}
                  {msg.isStreaming && (
                    <span className="ml-1 inline-block h-4 w-1.5 animate-pulse rounded-full bg-pink-400 align-middle" />
                  )}
                </div>
              )}

              {/* 操作按钮区：播放和拼音切换 */}
              {!msg.isStreaming && aiText && (
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => replaySpecificAnswer(msg.text)}
                    className="inline-flex items-center text-slate-300 transition-colors hover:text-pink-400 active:scale-90"
                    title="重新朗读"
                  >
                    <FaVolumeUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePinyin(msg.id)}
                    className={`inline-flex items-center text-[12px] font-bold transition-colors active:scale-90 ${
                      showPinyin ? 'text-pink-400' : 'text-slate-300 hover:text-pink-400'
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
          <div className="text-[15px] font-medium text-slate-300 opacity-90">
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
    <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 bg-transparent">
      <div className="mx-auto w-full max-w-3xl px-2">
        {!isAIReady ? (
          <div className="flex h-20 items-center justify-center">
            <button
              type="button"
              onClick={onOpenSettings}
              className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-black text-white shadow-md active:scale-95"
            >
              打开 AI 设置
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* 切换输入模式按钮 */}
            <CircleIconButton
              onClick={() => setTextMode((value) => !value)}
              active={!textMode}
              title={textMode ? '切换语音输入' : '切换文字输入'}
              className="shrink-0 bg-white shadow-sm border border-slate-100"
            >
              {textMode ? <FaMicrophone size={16} /> : <FaKeyboard size={16} />}
            </CircleIconButton>

            <div className="flex-1">
              {!textMode ? (
                // 语音模式：只有麦克风按钮，无动态波浪
                <div className="flex flex-col items-center justify-center">
                  <button
                    type="button"
                    onPointerDown={handleMicPointerDown}
                    onPointerUp={handleMicPointerUp}
                    onPointerCancel={handleMicPointerCancel}
                    onPointerLeave={handleMicPointerCancel}
                    onContextMenu={(e) => e.preventDefault()}
                    className={`touch-none flex h-[72px] w-[72px] items-center justify-center rounded-full text-white transition-all duration-300 ${
                      isRecording
                        ? 'bg-pink-500 scale-95'
                        : 'bg-gradient-to-br from-pink-400 to-rose-500 shadow-md hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isRecording ? (
                      <FaPaperPlane className="text-2xl" />
                    ) : (
                      <FaMicrophone className="text-2xl" />
                    )}
                  </button>
                  <div className="mt-2 min-h-[16px] whitespace-nowrap text-[10px] font-bold text-slate-400">
                     {isRecording ? (
                      <span className="text-pink-400">松开/静默自动发送</span>
                    ) : isThinking ? (
                      <span>思考中...</span>
                    ) : isAiSpeaking ? (
                      <span>正在讲话...</span>
                    ) : (
                      `长按切换语言 · ${currentLangObj.flag} ${currentLangObj.name}`
                    )}
                  </div>
                </div>
              ) : (
                // 键盘模式：输入框、发送按钮、字幕按钮紧凑排列在中间
                <div className="flex items-center rounded-full bg-white px-2 py-1.5 shadow-sm border border-slate-100">
                  <input
                    type="text"
                    className="allow-select flex-1 bg-transparent px-3 py-2 text-sm font-medium text-slate-700 outline-none placeholder-slate-400"
                    placeholder={isRecording ? '听你说...' : '输入消息...'}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && inputText.trim()) {
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
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 text-white shadow-sm transition-transform active:scale-90"
                    >
                      <FaPaperPlane size={12} className="-ml-0.5" />
                    </button>
                    {/* 字幕按钮移到中间 */}
                    <button
                      type="button"
                      onClick={() => setShowText((value) => !value)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                        showText ? 'bg-slate-100 text-pink-500' : 'text-slate-400 hover:bg-slate-50'
                      }`}
                      title={showText ? '隐藏字幕' : '显示字幕'}
                    >
                      {showText ? <FaClosedCaptioning size={15} /> : <FaCommentSlash size={15} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 语音模式下，停止/字幕按钮 */}
            {!textMode && (
              <div className="shrink-0">
                {isAiSpeaking || isRecording || isThinking ? (
                  <CircleIconButton onClick={stopEverything} danger title="停止" className="bg-white shadow-sm border border-slate-100">
                    <FaStop size={16} />
                  </CircleIconButton>
                ) : (
                  <CircleIconButton
                    onClick={() => setShowText((value) => !value)}
                    active={showText}
                    title={showText ? '隐藏字幕' : '显示字幕'}
                    className="bg-white shadow-sm border border-slate-100"
                  >
                    {showText ? <FaClosedCaptioning size={16} /> : <FaCommentSlash size={16} />}
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

      <div className="fixed inset-0 z-[2147483000] bg-black/30 backdrop-blur-sm" />

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
