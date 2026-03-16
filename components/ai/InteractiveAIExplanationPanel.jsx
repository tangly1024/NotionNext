'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  FaArrowLeft,
  FaPaperPlane,
  FaMicrophone,
  FaStop,
  FaKeyboard,
  FaVolumeUp,
  FaSlidersH
} from 'react-icons/fa';
import { pinyin } from 'pinyin-pro';
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

    /* 全局防复制，专门针对移动端 */
    .no-select {
      -webkit-touch-callout: none; /* 屏蔽 iOS 长按菜单 */
      -webkit-user-select: none;   /* Safari */
      user-select: none;           /* 标准语法 */
    }

    /* 保证输入框可以正常输入和选择 */
    .can-select {
      -webkit-user-select: text;
      user-select: text;
    }

    /* 录音时的麦克风呼吸效果 */
    @keyframes pulse-ring {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4); }
      70% { transform: scale(1.05); box-shadow: 0 0 0 25px rgba(236, 72, 153, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
    }
    .animate-pulse-ring { animation: pulse-ring 1.5s infinite; }
  `}</style>
);

const SHARED_KEYS = [
  'providerId', 'apiUrl', 'apiKey', 'model', 'ttsApiUrl',
  'ttsVoice', 'zhVoice', 'myVoice', 'ttsSpeed', 'ttsPitch', 'soundFx', 'vibration'
];
const SCENE_KEYS = ['assistantId', 'systemPrompt', 'temperature', 'showText', 'asrSilenceMs'];

// ==========================================
// 核心：逐字拼音对齐组件 (Ruby 效果)
// ==========================================
function PinyinText({ text, showPinyin, isStreaming }) {
  const tokens = useMemo(() => {
    if (!text) return [];
    // 1. 获取纯汉字的拼音数组 (剔除所有标点和外文)
    const pyArray = pinyin(text, { type: 'array', toneType: 'symbol', nonZh: 'removed' });
    let pyIndex = 0;
    const result = [];
    let currentNonZh = '';

    // 2. 遍历原字符串，精准一一映射
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const isZh = /[\u4e00-\u9fa5]/.test(char);
      
      if (isZh) {
        if (currentNonZh) {
          result.push({ text: currentNonZh, isZh: false });
          currentNonZh = '';
        }
        result.push({ text: char, isZh: true, py: pyArray[pyIndex++] || '' });
      } else {
        currentNonZh += char;
      }
    }
    if (currentNonZh) {
      result.push({ text: currentNonZh, isZh: false });
    }
    return result;
  }, [text]);

  return (
    <div className="flex flex-wrap items-end text-[18px] text-slate-800 font-medium leading-[1.6]">
      {tokens.map((t, idx) => (
        <div key={idx} className={`flex flex-col items-center justify-end ${t.isZh ? 'mx-[1px]' : ''}`}>
          {/* 拼音层：仅在汉字上方显示，且保持极小巧精致 */}
          {showPinyin && t.isZh && (
            <span className="text-[11.5px] leading-none text-pink-500 mb-0.5 font-sans font-normal tracking-tighter">
              {t.py}
            </span>
          )}
          {/* 文本层 */}
          <span className="leading-none whitespace-pre-wrap">{t.text}</span>
        </div>
      ))}
      {/* 流式输出的光标 */}
      {isStreaming && (
        <span className="ml-1 inline-block h-[18px] w-[3px] animate-pulse bg-pink-500 rounded-full" />
      )}
    </div>
  );
}

// ==========================================
// 顶部导航组件
// ==========================================
function HeaderBar({ title, onBack, onOpenSettings }) {
  return (
    <div className="relative z-20 flex h-[60px] items-center justify-between px-4 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <button
        type="button"
        onClick={onBack}
        className="flex h-10 w-10 items-center justify-center text-slate-500 hover:text-slate-800 transition-transform active:scale-90"
      >
        <FaArrowLeft size={18} />
      </button>
      <div className="text-[13px] font-black tracking-[0.15em] text-slate-800 uppercase">
        {title}
      </div>
      <button
        type="button"
        onClick={onOpenSettings}
        className="flex h-10 w-10 items-center justify-center text-slate-400 hover:text-slate-800 transition-transform active:scale-90"
      >
        <FaSlidersH size={18} />
      </button>
    </div>
  );
}

// ==========================================
// 对话列表组件 (纯文本流排版)
// ==========================================
function ChatList({ history, isRecording, textMode, inputText, replaySpecificAnswer }) {
  const [pinyinMap, setPinyinMap] = useState({});

  const togglePinyin = (id) => {
    setPinyinMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col pt-6 pb-4">
      {history.map((msg) => {
        if (msg.role === 'error') {
          return (
            <div key={msg.id} className="mb-6 text-left text-sm font-bold text-red-500 bg-red-50 p-3 rounded-xl">
              ⚠️ {msg.text}
            </div>
          );
        }

        // 1. 用户文本：极度淡化，浅色，靠左，无气泡
        if (msg.role === 'user') {
          return (
            <div key={msg.id} className="mb-5 w-full text-left pl-1 border-l-2 border-slate-200">
              <div className="text-[14px] font-medium leading-relaxed text-slate-400">
                {msg.text}
              </div>
            </div>
          );
        }

        // 2. AI 讲题：靠左对齐，深色大字，支持顶部悬浮拼音
        const aiText = normalizeAssistantText(msg.text || '');
        const showPinyin = pinyinMap[msg.id];

        return (
          <div key={msg.id} className="mb-10 w-full flex flex-col items-start">
            
            <PinyinText text={aiText} showPinyin={showPinyin} isStreaming={msg.isStreaming} />

            {/* 操作栏 (朗读 + 拼) */}
            {!msg.isStreaming && aiText && (
              <div className="flex items-center gap-4 mt-3 pl-1">
                <button
                  type="button"
                  onClick={() => replaySpecificAnswer(msg.text)}
                  className="flex items-center justify-center text-slate-300 hover:text-pink-500 transition-colors active:scale-90"
                  title="朗读"
                >
                  <FaVolumeUp size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => togglePinyin(msg.id)}
                  className={`flex items-center justify-center text-[12px] font-black px-2 py-0.5 rounded-md transition-colors active:scale-90 ${
                    showPinyin 
                      ? 'bg-pink-100 text-pink-500' 
                      : 'bg-slate-100 text-slate-400 hover:bg-pink-50 hover:text-pink-400'
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

      {/* 用户正在语音输入时的极简预览 */}
      {isRecording && textMode === false && inputText && (
        <div className="mb-5 w-full text-left pl-1 border-l-2 border-pink-200">
          <div className="text-[14px] font-medium leading-relaxed text-pink-400 animate-pulse">
            {inputText}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 全新底部操作台 (单层大输入框，极简手机布局)
// ==========================================
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
  handleMicPointerCancel
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent pt-12 pb-[max(16px,env(safe-area-inset-bottom))] px-4 pointer-events-none">
      <div className="mx-auto w-full max-w-lg pointer-events-auto">

        {/* 状态提示文案 */}
        <div className="absolute -top-6 left-0 right-0 flex justify-center pointer-events-none">
          {isRecording ? (
            <span className="text-xs font-bold tracking-widest text-pink-500 animate-pulse">正在聆听...</span>
          ) : isThinking ? (
            <span className="text-xs font-bold tracking-widest text-blue-400 animate-pulse">思考中...</span>
          ) : isAiSpeaking ? (
            <span className="text-xs font-bold tracking-widest text-slate-400">正在讲解</span>
          ) : (
            <span className="text-[10px] font-bold tracking-widest text-slate-300">
              {textMode ? '输入文字进行提问' : '按住麦克风说话'}
            </span>
          )}
        </div>

        {textMode ? (
          /* --- 文本模式：单层超级高大输入框 --- */
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-[28px] shadow-sm border border-slate-200">
            <button
              onClick={() => setTextMode(false)}
              className="flex shrink-0 h-[46px] w-[46px] items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors active:scale-95"
            >
              <FaMicrophone size={18} />
            </button>
            <input
              type="text"
              className="can-select flex-1 bg-transparent px-2 h-[46px] text-[16px] text-slate-800 outline-none placeholder-slate-300"
              placeholder="打字提问..."
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
              className={`flex shrink-0 h-[46px] w-[46px] items-center justify-center rounded-full transition-all active:scale-90 ${
                inputText.trim() ? 'bg-pink-500 text-white shadow-md hover:bg-pink-600' : 'bg-slate-100 text-slate-300'
              }`}
            >
              <FaPaperPlane size={16} className="-ml-1" />
            </button>
          </div>
        ) : (
          /* --- 语音模式：极其纯净的巨大麦克风 --- */
          <div className="flex items-center justify-between px-2 pt-2">
            <button
              onClick={() => setTextMode(true)}
              className="flex h-12 w-12 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition-colors active:scale-90"
            >
              <FaKeyboard size={24} />
            </button>

            <button
              onPointerDown={handleMicPointerDown}
              onPointerUp={handleMicPointerUp}
              onPointerCancel={handleMicPointerCancel}
              onPointerLeave={handleMicPointerCancel}
              onContextMenu={(e) => e.preventDefault()}
              className={`touch-none flex h-[84px] w-[84px] items-center justify-center rounded-full text-white transition-all duration-300 ${
                isRecording
                  ? 'bg-pink-500 animate-pulse-ring scale-95'
                  : isAiSpeaking || isThinking
                  ? 'bg-pink-300'
                  : 'bg-pink-500 shadow-[0_10px_30px_rgba(236,72,153,.35)] hover:scale-105 active:scale-95'
              }`}
            >
              {isAiSpeaking || isThinking ? (
                <FaStop className="text-3xl" onClick={(e) => { e.stopPropagation(); stopEverything(); }} />
              ) : (
                <FaMicrophone className="text-4xl" />
              )}
            </button>

            {/* 占位符，为了让麦克风完美居中 */}
            <div className="w-12"></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 主入口
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
    replaySpecificAnswer
  } = useAISession({
    open: sessionOpen,
    scene: AI_SCENES.EXERCISE,
    settings: effectiveSettings,
    initialPayload,
    bootstrapBuilder: buildExerciseBootstrapPrompt,
    defaultTextMode: false 
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
      <GlobalStyles />
      <div className="fixed inset-0 z-[2147483000] bg-slate-900/40 backdrop-blur-sm" />

      {/* no-select 屏蔽手机端长按复制菜单 */}
      <div className="no-select fixed inset-0 z-[2147483001] isolate flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-50 text-slate-800 font-sans">
        
        <HeaderBar
          title={title}
          onBack={() => { stopEverything(); onClose?.(); }}
          onOpenSettings={() => setShowSettings(true)}
        />

        {/* 核心滚动区：极度留白 pb-[220px] 防止被遮盖 */}
        <div
          ref={scrollRef}
          className={`relative z-10 flex-1 overflow-y-auto px-6 pt-4 pb-[220px] no-scrollbar scroll-smooth ${
            showLangPicker ? 'pointer-events-none' : ''
          }`}
        >
          {!isAIReady ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-400 pb-20">
              <span className="text-4xl mb-4">🛠️</span>
              <p className="text-sm font-bold">请点击右上角配置 AI 模型</p>
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
          />
        )}

        {/* 隐藏弹窗 */}
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
