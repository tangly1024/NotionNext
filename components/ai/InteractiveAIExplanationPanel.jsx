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
import { pinyin } from 'pinyin-pro'; // 引入拼音库
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

    /* 录音时的麦克风呼吸效果 */
    @keyframes pulse-ring {
      0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.45); }
      70% { transform: scale(1.02); box-shadow: 0 0 0 24px rgba(236, 72, 153, 0); }
      100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
    }
    .animate-pulse-ring { animation: pulse-ring 1.35s infinite; }

    /* 高级深色科技背景 */
    .ai-dark-bg {
      background:
        radial-gradient(circle at top left, rgba(244,114,182,0.12), transparent 28%),
        radial-gradient(circle at top right, rgba(168,85,247,0.14), transparent 32%),
        radial-gradient(circle at bottom center, rgba(244,114,182,0.08), transparent 30%),
        linear-gradient(180deg, #0f0a16 0%, #15101f 45%, #120d1a 100%);
    }

    /* 底部控制台的玻璃质感 */
    .glass-panel {
      background: rgba(24, 18, 34, 0.68);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(255,255,255,0.07);
      box-shadow: 0 10px 35px rgba(0,0,0,.22);
    }

    .subtle-scroll::-webkit-scrollbar { width: 4px; }
    .subtle-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.10); border-radius: 999px; }
    .subtle-scroll::-webkit-scrollbar-track { background: transparent; }
  `}</style>
);

const SHARED_KEYS = [
  'providerId', 'apiUrl', 'apiKey', 'model', 'ttsApiUrl',
  'ttsVoice', 'zhVoice', 'myVoice', 'ttsSpeed', 'ttsPitch', 'soundFx', 'vibration'
];

const SCENE_KEYS = ['assistantId', 'systemPrompt', 'temperature', 'showText', 'asrSilenceMs'];

// ==========================================
// UI 组件区
// ==========================================

function CircleIconButton({ onClick, children, active = false, danger = false, className = '', title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-[42px] w-[42px] items-center justify-center rounded-full border transition-all active:scale-95 ${
        danger
          ? 'border-red-400/20 bg-red-400/10 text-red-300 hover:bg-red-400/15'
          : active
          ? 'border-pink-500/50 bg-[#e91e63] text-white shadow-[0_0_15px_rgba(233,30,99,0.5)]'
          : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'
      } ${className}`}
    >
      {children}
    </button>
  );
}

function HeaderBar({ title, onBack, onOpenSettings }) {
  return (
    <div className="relative z-20 flex h-16 items-center justify-between px-5 pt-2">
      <button
        type="button"
        onClick={onBack}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 backdrop-blur-md transition-transform active:scale-90"
      >
        <FaArrowLeft />
      </button>
      <div className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
        {title}
      </div>
      <button
        type="button"
        onClick={onOpenSettings}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 backdrop-blur-md transition-transform active:scale-90"
      >
        <FaSlidersH />
      </button>
    </div>
  );
}

function SetupEmptyState({ onOpenSettings }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 text-5xl">🤖</div>
      <div className="text-lg font-black text-white">先完成 AI 设置</div>
      <div className="mt-2 max-w-sm text-sm font-medium leading-6 text-slate-400">
        需要先填写 API Key 和 模型配置。
      </div>
      <button
        type="button"
        onClick={onOpenSettings}
        className="mt-6 rounded-full bg-[#e91e63] px-8 py-3 text-sm font-bold text-white shadow-[0_10px_25px_rgba(233,30,99,.4)] transition-transform active:scale-95"
      >
        去设置
      </button>
    </div>
  );
}

function ChatList({ history, isRecording, textMode, inputText, replaySpecificAnswer }) {
  // 用于记录哪些消息开启了拼音显示
  const [pinyinMap, setPinyinMap] = useState({});

  const togglePinyin = (id) => {
    setPinyinMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col pb-10 pt-4">
      {history.map((msg) => {
        // 报错信息
        if (msg.role === 'error') {
          return (
            <div key={msg.id} className="mb-6 text-left text-sm text-red-400">
              ⚠️ {msg.text}
            </div>
          );
        }

        // 1. 用户提问：靠左对齐，极简浅色无气泡
        if (msg.role === 'user') {
          return (
            <div key={msg.id} className="mb-6 w-full text-left">
              <div className="text-[15px] font-medium leading-relaxed text-white/30 tracking-wide">
                {msg.text}
              </div>
            </div>
          );
        }

        // 2. AI 回答：靠左对齐，主色调，无气泡，有操作按钮
        const aiText = normalizeAssistantText(msg.text || '');
        const showPinyin = pinyinMap[msg.id];

        return (
          <div key={msg.id} className="mb-10 w-full flex flex-col items-start">
            {/* 拼音层 (点击拼音按钮后展现) */}
            {showPinyin && !msg.isStreaming && aiText && (
              <div className="text-[15px] text-pink-300/80 font-mono tracking-widest mb-2 leading-relaxed opacity-90">
                {pinyin(aiText, { toneType: 'symbol' })}
              </div>
            )}
            
            {/* 汉字正文层 */}
            <div className="text-[17px] font-medium leading-[1.8] text-white/95 tracking-wide">
              {aiText || (msg.isStreaming ? '...' : '')}
              {msg.isStreaming && (
                <span className="ml-1 inline-block h-4 w-[2px] animate-pulse align-middle bg-pink-500" />
              )}
            </div>

            {/* 操作栏 (朗读 + 拼音) */}
            {!msg.isStreaming && aiText && (
              <div className="flex items-center gap-4 mt-3">
                <button
                  type="button"
                  onClick={() => replaySpecificAnswer(msg.text)}
                  className="flex items-center justify-center text-white/30 hover:text-pink-400 transition-colors active:scale-90"
                  title="朗读"
                >
                  <FaVolumeUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => togglePinyin(msg.id)}
                  className={`flex items-center justify-center text-[11px] font-bold px-1.5 py-0.5 rounded border transition-colors active:scale-90 ${
                    showPinyin 
                      ? 'border-pink-500/50 text-pink-400 bg-pink-500/10' 
                      : 'border-white/20 text-white/30 hover:border-pink-400/50 hover:text-pink-400'
                  }`}
                  title="显示/隐藏拼音"
                >
                  拼
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* 正在录音时，用户的实时输入占位 */}
      {isRecording && textMode === false && inputText && (
        <div className="mb-6 w-full text-left">
          <div className="text-[15px] font-medium leading-relaxed text-white/30 tracking-wide animate-pulse">
            {inputText}
          </div>
        </div>
      )}
    </div>
  );
}

function BottomControlBar({
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
  setShowText
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 pointer-events-none">
      <div className="glass-panel mx-auto w-full max-w-lg rounded-full px-3 py-3 pointer-events-auto">
        <div className="flex items-center justify-between gap-3">
          
          {/* 左侧：切换 键盘/语音 */}
          <CircleIconButton
            onClick={() => setTextMode(!textMode)}
            title={textMode ? '切换语音输入' : '切换文字输入'}
            className="shrink-0"
          >
            {textMode ? <FaMicrophone size={16} /> : <FaKeyboard size={16} />}
          </CircleIconButton>

          {/* 中间核心区域 */}
          <div className="flex-1 flex justify-center">
            {!textMode ? (
              // 语音模式：大圆按钮
              <button
                type="button"
                onPointerDown={handleMicPointerDown}
                onPointerUp={handleMicPointerUp}
                onPointerCancel={handleMicPointerCancel}
                onPointerLeave={handleMicPointerCancel}
                onContextMenu={(e) => e.preventDefault()}
                className={`touch-none flex h-[52px] w-[52px] items-center justify-center rounded-full text-white transition-all duration-300 ${
                  isRecording
                    ? 'animate-pulse-ring bg-[#e91e63]'
                    : isAiSpeaking || isThinking
                    ? 'bg-[#e91e63]/50'
                    : 'bg-[#e91e63] shadow-[0_4px_20px_rgba(233,30,99,.5)] hover:scale-105 active:scale-95'
                }`}
              >
                {isAiSpeaking || isThinking ? (
                  <FaStop className="text-xl drop-shadow-md" onClick={(e) => { e.stopPropagation(); stopEverything(); }} />
                ) : (
                  <FaMicrophone className="text-xl drop-shadow-md" />
                )}
              </button>
            ) : (
              // 文本模式：胶囊输入框
              <div className="flex h-[46px] w-full items-center rounded-full border border-white/5 bg-white/5 pl-4 pr-1.5 backdrop-blur-sm">
                <input
                  type="text"
                  className="flex-1 bg-transparent px-2 text-[14px] font-medium text-white outline-none placeholder-white/30"
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
                  type="button"
                  onClick={() => {
                    if (isRecording) stopEverything();
                    if (inputText.trim()) {
                      sendMessage(inputText);
                      setInputText('');
                    }
                  }}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all active:scale-90 ${
                    inputText.trim() ? 'bg-[#e91e63] text-white shadow-[0_0_15px_rgba(233,30,99,0.5)]' : 'bg-white/10 text-white/30'
                  }`}
                >
                  <FaPaperPlane size={13} className="-ml-0.5" />
                </button>
              </div>
            )}
          </div>

          {/* 右侧：字幕开关 */}
          <CircleIconButton
            onClick={() => setShowText(!showText)}
            active={showText}
            title={showText ? '隐藏字幕' : '显示字幕'}
            className="shrink-0"
          >
            {showText ? <FaClosedCaptioning size={16} /> : <FaCommentSlash size={16} />}
          </CircleIconButton>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// 主入口逻辑
// ==========================================

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
  // 为了保证底层如果没抛出 setShowText 也能正常运作，添加本地 fallback
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
    showText,
    setShowText,
    replaySpecificAnswer
  } = useAISession({
    open: sessionOpen,
    scene: AI_SCENES.EXERCISE,
    settings: effectiveSettings,
    initialPayload,
    bootstrapBuilder: buildExerciseBootstrapPrompt,
    defaultTextMode: false // 默认采用语音模式
  });

  const actualShowText = showText ?? localShowText;
  const toggleShowText = (val) => {
    if (setShowText) setShowText(val);
    else setLocalShowText(val);
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open && !isAIReady) setShowSettings(true);
  }, [open, isAIReady]);

  // 阻止底层页面滚动
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

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, inputText, isRecording]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <GlobalStyles />
      <div className="fixed inset-0 z-[2147483000] bg-black/80 backdrop-blur-xl" />

      <div className="fixed inset-0 z-[2147483001] isolate flex h-[100dvh] w-full flex-col overflow-hidden text-white">
        <div className="ai-dark-bg absolute inset-0 -z-10" />

        <HeaderBar
          title={title}
          onBack={() => { stopEverything(); onClose?.(); }}
          onOpenSettings={() => setShowSettings(true)}
        />

        <div
          ref={scrollRef}
          className={`subtle-scroll relative z-10 flex-1 overflow-y-auto px-6 pb-[120px] pt-4 ${
            showLangPicker ? 'pointer-events-none select-none' : ''
          }`}
        >
          {!isAIReady ? (
            <SetupEmptyState onOpenSettings={() => setShowSettings(true)} />
          ) : !actualShowText ? (
            // 当关闭字幕时，显示一个干净的提示页
            <div className="flex h-full flex-col items-center justify-center text-white/30">
              <FaCommentSlash size={40} className="mb-4 opacity-50" />
              <p className="text-sm tracking-widest">字幕已隐藏</p>
            </div>
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

        {isAIReady && (
          <BottomControlBar
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
            showText={actualShowText}
            setShowText={toggleShowText}
          />
        )}

        {/* 隐藏弹窗 */}
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
