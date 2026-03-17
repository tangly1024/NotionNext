'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef, memo } from 'react';
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
  FaSlidersH,
} from 'react-icons/fa';
import { AI_SCENES, buildExerciseBootstrapPrompt } from './aiAssistants';
import { normalizeAssistantText } from './aiTextUtils';
import { useAISettings } from './useAISettings';
import { useAISession } from './useAISession';
import AISettingsModal from './AISettingsModal';
import RecognitionLanguagePicker from './RecognitionLanguagePicker';

const GlobalStyles = memo(() => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* 浅色干净背景 */
    .ai-light-bg {
      background: #f8fafc;
      background-image: 
        radial-gradient(circle at top right, rgba(244,114,182,0.04), transparent 50%),
        radial-gradient(circle at bottom left, rgba(168,85,247,0.04), transparent 50%);
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

    /* 语音头像更明显的朗读动态效果 */
    @keyframes tts-speak {
      0%, 100% { 
        transform: scale(1); 
        box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4); 
      }
      50% { 
        transform: scale(1.08); 
        box-shadow: 0 0 25px 12px rgba(236, 72, 153, 0.25); 
      }
    }
    .animate-tts-speak { 
      animation: tts-speak 1.5s ease-in-out infinite; 
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

    /* 完美的拼音 Ruby 标签排版 */
    ruby {
      ruby-align: center;
      ruby-position: over;
    }
    rt {
      font-weight: normal;
      text-align: center;
    }
  `}</style>
));

const SHARED_KEYS = [
  'providerId', 'apiUrl', 'apiKey', 'model', 'ttsApiUrl', 
  'ttsVoice', 'zhVoice', 'myVoice', 'ttsSpeed', 'ttsPitch', 
  'soundFx', 'vibration'
];

const SCENE_KEYS = [
  'assistantId', 'systemPrompt', 'temperature', 'showText', 'asrSilenceMs'
];

/**
 * 拼音渲染组件 (使用 memo 避免重复计算)
 */
const PinyinText = memo(({ text }) => {
  const result = useMemo(() => pinyin(text, { type: 'all' }), [text]);

  return (
    <div className="leading-[3] tracking-[0.1em] text-[18px] text-slate-800 break-words">
      {result.map((item, i) => {
        if (item.isZh) {
          return (
            <ruby key={i} className="mx-[2px]">
              {item.origin}
              <rt className="text-[11px] text-slate-500 prevent-browser-actions block">
                {item.pinyin}
              </rt>
            </ruby>
          );
        }
        return <span key={i}>{item.origin}</span>;
      })}
    </div>
  );
});

function CircleIconButton({
  onClick,
  children,
  active = false,
  danger = false,
  className = '',
  title,
  ariaLabel
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={ariaLabel || title}
      onClick={onClick}
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all active:scale-90 ${
        danger
          ? 'bg-red-50 text-red-500 hover:bg-red-100 shadow-sm border border-red-100'
          : active
          ? 'bg-white text-pink-500 hover:bg-pink-200 shadow-sm'
          : 'bg-white text-slate-500 hover:bg-slate-50 shadow-sm border border-slate-100'
      } ${className}`}
    >
      {children}
    </button>
  );
}

function HeaderBar({ title, onBack, onOpenSettings, modelName }) {
  return (
    <div className="relative z-20 flex h-16 items-center justify-between px-4">
      <CircleIconButton onClick={onBack} title="返回" className="!h-10 !w-10">
        <FaArrowLeft size={14} />
      </CircleIconButton>

      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-2 text-[15px] font-black tracking-[0.15em] text-slate-800">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.5)]" />
          {title}
        </div>
        <div className="mt-0.5 text-[11px] font-medium text-slate-400">
          语音讲题模式{modelName ? ` · ${modelName}` : ''}
        </div>
      </div>

      <CircleIconButton onClick={onOpenSettings} title="设置" className="!h-10 !w-10">
        <FaSlidersH size={14} />
      </CircleIconButton>
    </div>
  );
}

/**
 * 单条消息渲染组件 (使用 memo 优化长列表性能)
 */
const MessageItem = memo(({ msg, replaySpecificAnswer }) => {
  const [showPinyin, setShowPinyin] = useState(false);

  if (msg.role === 'error') {
    return (
      <div className="mx-8 mb-4 rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-400">
        {msg.text}
      </div>
    );
  }

  if (msg.role === 'user') {
    return (
      <div className="mb-6 flex justify-end pl-12">
        <div className="whitespace-pre-wrap text-[16px] font-medium leading-7 text-slate-400">
          {msg.text}
        </div>
      </div>
    );
  }

  const aiText = normalizeAssistantText(msg.text || '');

  return (
    <div className="mb-8 flex flex-col items-start pr-8">
      <div className="w-full">
        {showPinyin && !msg.isStreaming && aiText ? (
          <PinyinText text={aiText} />
        ) : (
          <div className="inline whitespace-pre-wrap text-[16px] font-medium leading-7 text-slate-800 break-words">
            {aiText || (msg.isStreaming ? '思考中...' : '')}
            {msg.isStreaming && (
              <span className="ml-1 inline-block h-4 w-1.5 animate-pulse rounded-full bg-pink-400 align-middle" />
            )}
          </div>
        )}

        {!msg.isStreaming && aiText && (
          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              onClick={() => replaySpecificAnswer(msg.text)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-pink-400 active:scale-90"
              aria-label="重新朗读"
              title="重新朗读"
            >
              <FaVolumeUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => setShowPinyin((prev) => !prev)}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold transition-colors active:scale-90 ${
                showPinyin ? 'bg-pink-50 text-pink-500' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-pink-400'
              }`}
              aria-label="切换拼音"
              title="切换拼音"
            >
              拼
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

function VoiceCenterState({ isAiSpeaking, isRecording, isThinking }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center pb-10">
      <div className="relative flex items-center justify-center p-4">
        <img
          src="https://audio.886.best/chinese-vocab-audio/%E5%9B%BE%E7%89%87/images.jpeg"
          alt="AI Teacher Avatar"
          className={`h-40 w-40 rounded-full object-cover transition-all duration-300 shadow-lg ${
            isAiSpeaking ? 'animate-tts-speak' : 'shadow-slate-200'
          }`}
        />
      </div>

      <div className="mt-8 flex min-h-[44px] items-center justify-center">
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
  currentLangObj,
  setShowLangPicker
}) {
  const textareaRef = useRef(null);
  const longPressTimerRef = useRef(null);

  // 自适应输入框高度
  const handleTextareaInput = (e) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // 处理麦克风长按逻辑
  const onMicPointerDown = (e) => {
    longPressTimerRef.current = setTimeout(() => {
      setShowLangPicker(true);
      longPressTimerRef.current = null;
    }, 600);
    handleMicPointerDown(e);
  };

  const onMicPointerUp = (e) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    handleMicPointerUp(e);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc] to-transparent">
      <div className="mx-auto w-full max-w-3xl px-1">
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
          <div className="flex items-end gap-3">
            {/* 左侧：输入模式切换 */}
            <CircleIconButton
              onClick={() => setTextMode((value) => !value)}
              active={!textMode}
              title={textMode ? '切换语音输入' : '切换文字输入'}
            >
              {textMode ? <FaMicrophone size={18} /> : <FaKeyboard size={18} />}
            </CircleIconButton>

            {/* 中间：输入区或大麦克风 */}
<div className="flex-1 flex justify-center">
  {!textMode ? (
    <div className="flex flex-col items-center justify-center pb-2">
      <button
        type="button"
        onPointerDown={onMicPointerDown}
        onPointerUp={onMicPointerUp}
        onPointerCancel={onMicPointerUp}
        onPointerLeave={onMicPointerUp}
        onContextMenu={(e) => e.preventDefault()}
        className={`touch-none flex h-[168px] w-[168px] items-center justify-center rounded-full text-white transition-all duration-300 ${
          isRecording
            ? 'bg-pink-500 scale-95 shadow-inner'
            : 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-xl hover:scale-105 active:scale-95'
        }`}
        aria-label="按住说话，长按切换语言"
      >
        {isRecording ? (
          <FaPaperPlane className="text-6xl" />
        ) : (
          <FaMicrophone className="text-6xl" />
        )}
      </button>

      <div className="mt-4 min-h-[20px] whitespace-nowrap text-[13px] font-bold text-slate-400">
        {isRecording ? (
          <span className="text-pink-500">松开/静默自动发送</span>
        ) : (
          `长按切换语言 · ${currentLangObj?.flag || ''} ${currentLangObj?.name || '未知语言'}`
        )}
      </div>
    </div>
  ) : (
    <div className="flex w-full items-end rounded-3xl border border-slate-200 bg-white p-1.5 shadow-sm transition-all focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100">
      <textarea
        ref={textareaRef}
        rows={1}
        className="allow-select no-scrollbar flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] font-medium text-slate-700 outline-none placeholder-slate-400"
        placeholder="输入消息..."
        value={inputText}
        onChange={handleTextareaInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (inputText.trim()) {
              sendMessage(inputText);
              setInputText('');
              resetTextareaHeight();
            }
          }
        }}
      />
    </div>
  )}
</div>
                  <button
                    type="button"
                    onClick={() => {
                      if (isRecording) stopEverything();
                      if (inputText.trim()) {
                        sendMessage(inputText);
                        setInputText('');
                        resetTextareaHeight();
                      }
                    }}
                    className="mb-1 mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white shadow-sm transition-transform active:scale-90"
                    aria-label="发送"
                  >
                    <FaPaperPlane size={13} className="-ml-0.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 右侧：停止 / 字幕开关 */}
            <div className="shrink-0 flex items-end pb-1">
              {isAiSpeaking || isRecording || isThinking ? (
                <CircleIconButton onClick={stopEverything} danger title="停止" ariaLabel="停止朗读或录音">
                  <FaStop size={18} />
                </CircleIconButton>
              ) : (
                <CircleIconButton
                  onClick={() => setShowText((value) => !value)}
                  active={showText}
                  title={showText ? '隐藏字幕' : '显示字幕'}
                  ariaLabel="切换字幕显示"
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

  const isAIReady = useMemo(() => Boolean(
    effectiveSettings?.apiKey && effectiveSettings?.apiUrl && effectiveSettings?.model
  ), [effectiveSettings]);

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
      <div className="fixed inset-0 z-[2147483000] bg-black/20 backdrop-blur-sm" />

      <div className="prevent-browser-actions fixed inset-0 z-[2147483001] isolate flex h-[100dvh] w-full flex-col overflow-hidden text-slate-800">
        <div className="ai-light-bg absolute inset-0" />

        <HeaderBar
          title={title}
          onBack={() => { stopEverything(); onClose?.(); }}
          onOpenSettings={() => setShowSettings(true)}
          modelName={effectiveSettings?.model}
        />

        <div
          ref={scrollRef}
          className={`subtle-scroll relative z-10 flex-1 overflow-y-auto px-4 pb-48 pt-2 ${
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
            <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-2">
              {history.map((msg) => (
                <MessageItem 
                  key={msg.id} 
                  msg={msg} 
                  replaySpecificAnswer={replaySpecificAnswer} 
                />
              ))}
              {isRecording && textMode === false && (
                <div className="mb-6 flex justify-end pl-12">
                  <div className="text-[16px] font-medium text-slate-300 opacity-90">
                    <span className="animate-pulse">{inputText || '正在聆听...'}</span>
                  </div>
                </div>
              )}
            </div>
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
          setShowLangPicker={setShowLangPicker}
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
