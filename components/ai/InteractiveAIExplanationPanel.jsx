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
  FaSlidersH,
  FaClosedCaptioning,
  FaCommentSlash
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
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* 移动端全局屏蔽长按复制、放大镜 */
    .no-select {
      -webkit-touch-callout: none; 
      -webkit-user-select: none;   
      user-select: none;           
    }
    /* 仅允许输入框内可选中文字 */
    .can-select {
      -webkit-user-select: text;
      user-select: text;
    }

    /* 语音大按钮的呼吸涟漪 */
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
// 1. 逐字拼音组件 (悬浮在汉字上方)
// ==========================================
function PinyinText({ text, showPinyin, isStreaming }) {
  const tokens = useMemo(() => {
    if (!text) return [];
    // 提取纯汉字的拼音数组，剔除所有标点和外文
    const pyArray = pinyin(text, { type: 'array', toneType: 'symbol', nonZh: 'removed' });
    let pyIndex = 0;
    const result = [];
    let currentNonZh = '';

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
    <div className="flex flex-wrap items-end text-[17px] text-slate-800 font-medium leading-[1.6]">
      {tokens.map((t, idx) => (
        <div key={idx} className={`flex flex-col items-center justify-end ${t.isZh ? 'mx-[0.5px]' : ''}`}>
          {/* 拼音层 (极简、细致) */}
          {showPinyin && t.isZh && (
            <span className="text-[11px] leading-none text-slate-500 mb-0.5 font-sans tracking-tighter">
              {t.py}
            </span>
          )}
          {/* 文本层 */}
          <span className="leading-none whitespace-pre-wrap">{t.text}</span>
        </div>
      ))}
      {/* 流式打字机光标 */}
      {isStreaming && (
        <span className="ml-1 inline-block h-[18px] w-[3px] animate-pulse bg-pink-500 rounded-full" />
      )}
    </div>
  );
}

// ==========================================
// 2. 顶部导航
// ==========================================
function HeaderBar({ title, onBack, onOpenSettings }) {
  return (
    <div className="relative z-20 flex h-[60px] items-center justify-between px-4 bg-[#f4f6f8]/90 backdrop-blur-md border-b border-slate-200/60">
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
// 3. 聊天流区 (无气泡纯文字)
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

        // --- 用户文本 (浅色，极简，靠左) ---
        if (msg.role === 'user') {
          return (
            <div key={msg.id} className="mb-5 w-full text-left pl-1">
              <div className="text-[14px] font-medium leading-relaxed text-slate-400 tracking-wide">
                {msg.text}
              </div>
            </div>
          );
        }

        // --- AI 文本 (深色，大字，支持拼音注音) ---
        const aiText = normalizeAssistantText(msg.text || '');
        const showPinyin = pinyinMap[msg.id];

        return (
          <div key={msg.id} className="mb-10 w-full flex flex-col items-start">
            
            <PinyinText text={aiText} showPinyin={showPinyin} isStreaming={msg.isStreaming} />

            {/* 操作栏 (朗读 + 拼) */}
            {!msg.isStreaming && aiText && (
              <div className="flex items-center gap-3 mt-3 pl-1">
                <button
                  type="button"
                  onClick={() => replaySpecificAnswer(msg.text)}
                  className="flex items-center justify-center text-slate-300 hover:text-pink-500 transition-colors active:scale-90 p-1"
                  title="朗读"
                >
                  <FaVolumeUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => togglePinyin(msg.id)}
                  className={`flex items-center justify-center text-[11px] font-black px-2 py-0.5 rounded-md transition-colors active:scale-90 ${
                    showPinyin 
                      ? 'bg-slate-200 text-slate-700' 
                      : 'bg-white border border-slate-200 text-slate-400 shadow-sm hover:text-slate-600'
                  }`}
                  title="注音"
                >
                  拼
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* 录音时用户的实时预览，使用很浅的粉色 */}
      {isRecording && textMode === false && inputText && (
        <div className="mb-5 w-full text-left pl-1">
          <div className="text-[14px] font-medium leading-relaxed text-pink-300 animate-pulse tracking-wide">
            {inputText}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. 全新底部操作台 (完美复刻图1、图2)
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
  handleMicPointerCancel,
  showText,
  setShowText
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#f4f6f8] via-[#f4f6f8]/95 to-transparent pt-12 pb-[max(20px,env(safe-area-inset-bottom))] px-4 pointer-events-none">
      <div className="mx-auto w-full max-w-lg pointer-events-auto">

        {/* 顶部中央微小状态提示 (思考中、讲话中) */}
        <div className="absolute -top-4 left-0 right-0 flex justify-center pointer-events-none">
          {isRecording ? (
            <span className="text-[11px] font-bold tracking-widest text-pink-500 animate-pulse">正在聆听...</span>
          ) : isThinking ? (
            <span className="text-[11px] font-bold tracking-widest text-blue-500 animate-pulse">思考中...</span>
          ) : isAiSpeaking ? (
            <span className="text-[11px] font-bold tracking-widest text-slate-400">正在讲解</span>
          ) : null}
        </div>

        {textMode ? (
          /* ================================
             图 2 模式：打字回复 (宽大胶囊)
          ================================= */
          <div className="flex items-center gap-3 w-full">
            {/* 左侧：极简小麦克风图标，无背景 */}
            <button
              onClick={() => setTextMode(false)}
              className="flex shrink-0 h-10 w-10 items-center justify-center text-slate-400 hover:text-slate-600 transition-colors active:scale-90"
            >
              <FaMicrophone size={18} />
            </button>

            {/* 中间：超高超大磨砂半透明胶囊 */}
            <div className="flex-1 flex items-center bg-slate-200/50 backdrop-blur-md rounded-full h-[52px] pl-5 pr-1.5 border border-slate-300/30">
              <input
                type="text"
                className="can-select flex-1 bg-transparent h-full text-[15px] font-medium text-slate-800 outline-none placeholder-slate-400"
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
              {/* 发送按钮内置于右侧 */}
              <button
                onClick={() => {
                  if (inputText.trim()) {
                    sendMessage(inputText);
                    setInputText('');
                  }
                }}
                className={`flex shrink-0 h-[40px] w-[40px] items-center justify-center rounded-full transition-all active:scale-90 ${
                  inputText.trim() ? 'bg-pink-500 text-white shadow-md' : 'bg-pink-500/80 text-white/90'
                }`}
              >
                <FaPaperPlane size={14} className="-ml-1" />
              </button>
            </div>

            {/* 右侧：CC 字幕按钮 */}
            <button
              onClick={() => setShowText(!showText)}
              className={`flex shrink-0 h-[42px] w-[42px] items-center justify-center rounded-full transition-all active:scale-90 ${
                showText ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-200/70 text-slate-500'
              }`}
            >
              {showText ? <FaClosedCaptioning size={18} /> : <FaCommentSlash size={18} />}
            </button>
          </div>
        ) : (
          /* ================================
             图 1 模式：语音大圆环 (等距三段)
          ================================= */
          <div className="flex items-center justify-between px-6 pt-2">
            {/* 左侧：键盘小圆按钮 */}
            <button
              onClick={() => setTextMode(true)}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-slate-200/70 text-slate-500 hover:bg-slate-300 transition-colors active:scale-90"
            >
              <FaKeyboard size={18} />
            </button>

            {/* 中间：发光超大麦克风 */}
            <button
              onPointerDown={handleMicPointerDown}
              onPointerUp={handleMicPointerUp}
              onPointerCancel={handleMicPointerCancel}
              onPointerLeave={handleMicPointerCancel}
              onContextMenu={(e) => e.preventDefault()}
              className={`touch-none flex h-[76px] w-[76px] items-center justify-center rounded-full text-white transition-all duration-300 ${
                isRecording
                  ? 'bg-pink-500 animate-pulse-ring scale-95'
                  : isAiSpeaking || isThinking
                  ? 'bg-pink-400/80'
                  : 'bg-pink-500 shadow-[0_10px_25px_rgba(236,72,153,.35)] hover:scale-105 active:scale-95'
              }`}
            >
              {isAiSpeaking || isThinking ? (
                <FaStop className="text-3xl" onClick={(e) => { e.stopPropagation(); stopEverything(); }} />
              ) : (
                <FaMicrophone className="text-3xl" />
              )}
            </button>

            {/* 右侧：CC 字幕按钮 */}
            <button
              onClick={() => setShowText(!showText)}
              className={`flex h-[42px] w-[42px] items-center justify-center rounded-full transition-all active:scale-90 ${
                showText ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-200/70 text-slate-500'
              }`}
            >
              {showText ? <FaClosedCaptioning size={18} /> : <FaCommentSlash size={18} />}
            </button>
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
  const toggleShowText = (val) => {
    if (setShowText) setShowText(val);
    else setLocalShowText(val);
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
      <GlobalStyles />
      <div className="fixed inset-0 z-[2147483000] bg-slate-900/40 backdrop-blur-sm" />

      {/* no-select 屏蔽手机端长按复制菜单，整体浅色背景 */}
      <div className="no-select fixed inset-0 z-[2147483001] isolate flex h-[100dvh] w-full flex-col overflow-hidden bg-[#f4f6f8] text-slate-800 font-sans">
        
        <HeaderBar
          title={title}
          onBack={() => { stopEverything(); onClose?.(); }}
          onOpenSettings={() => setShowSettings(true)}
        />

        {/* 核心滚动区：极度留白 pb-[240px] 防止被任何输入法及控制台遮盖 */}
        <div
          ref={scrollRef}
          className={`relative z-10 flex-1 overflow-y-auto px-6 pt-2 pb-[240px] no-scrollbar scroll-smooth ${
            showLangPicker ? 'pointer-events-none' : ''
          }`}
        >
          {!isAIReady ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-400 pb-20">
              <span className="text-4xl mb-4">⚙️</span>
              <p className="text-sm font-bold">请点击右上角配置 AI 模型</p>
            </div>
          ) : !actualShowText ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-300 pb-20">
              <FaCommentSlash size={36} className="mb-3 opacity-50" />
              <p className="text-xs tracking-widest uppercase font-bold">字幕已隐藏</p>
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

        {/* 底部控制台 */}
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
