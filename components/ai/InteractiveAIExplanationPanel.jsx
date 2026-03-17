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

    /* 防复制 (移动端长按优化) */
    .no-select {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
    .can-select {
      -webkit-user-select: text;
      user-select: text;
    }

    /* 语音录制时的麦克风呼吸 */
    @keyframes pulse-ring {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.5); }
      70% { transform: scale(1.05); box-shadow: 0 0 0 25px rgba(236, 72, 153, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
    }
    .animate-pulse-ring { animation: pulse-ring 1.5s infinite; }

    /* TTS 朗读时头像的波纹扩散 */
    @keyframes ripple-out {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    .animate-ripple-1 { animation: ripple-out 2s cubic-bezier(0.0, 0.2, 0.8, 1) infinite; }
    .animate-ripple-2 { animation: ripple-out 2s cubic-bezier(0.0, 0.2, 0.8, 1) infinite 0.6s; }

    /* 聊天区的高级底纹背景 */
    .chat-bg {
      background-color: #f8fafc;
      background-image: 
        linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
      background-size: 20px 20px;
    }
  `}</style>
);

const SHARED_KEYS = [
  'providerId', 'apiUrl', 'apiKey', 'model', 'ttsApiUrl',
  'ttsVoice', 'zhVoice', 'myVoice', 'ttsSpeed', 'ttsPitch', 'soundFx', 'vibration'
];
const SCENE_KEYS = ['assistantId', 'systemPrompt', 'temperature', 'showText', 'asrSilenceMs'];

// ======================================
// 1. 拼音逐字对齐组件 (完美修复表情、缅文丢失)
// ======================================
function PinyinText({ text, showPinyin, isStreaming }) {
  const tokens = useMemo(() => {
    if (!text) return [];
    
    // 获取仅汉字的拼音数组
    const pyArray = pinyin(text, { type: 'array', toneType: 'symbol', nonZh: 'removed' });
    let pyIndex = 0;
    const result = [];
    let currentNonZh = '';

    // 使用 Array.from 正确遍历包含 Emoji/缅文 的 Unicode 字符串
    const chars = Array.from(text);
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      // 判断是否为标准中文字符
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
    <div className="flex flex-wrap items-end text-[17px] text-slate-800 font-medium leading-loose">
      {tokens.map((t, idx) => (
        <div key={idx} className={`flex flex-col items-center justify-end ${t.isZh ? 'mx-[1px]' : ''}`}>
          {/* 拼音层 */}
          {showPinyin && t.isZh && (
            <span className="text-[11px] leading-none text-slate-400 mb-[3px] font-sans tracking-tighter">
              {t.py}
            </span>
          )}
          {/* 汉字/标点/表情层 */}
          <span className="leading-none whitespace-pre-wrap">{t.text}</span>
        </div>
      ))}
      {/* 思考光标 */}
      {isStreaming && (
        <span className="ml-1 inline-block h-[18px] w-[3px] animate-pulse bg-pink-500 rounded-full" />
      )}
    </div>
  );
}

// ======================================
// 2. 顶部导航
// ======================================
function HeaderBar({ title, onBack, onOpenSettings }) {
  return (
    <div className="flex-none flex h-[60px] items-center justify-between px-4 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm z-20">
      <button onClick={onBack} className="flex h-10 w-10 items-center justify-center text-slate-500 hover:text-slate-800 active:scale-90 transition-transform">
        <FaArrowLeft size={18} />
      </button>
      <div className="text-[15px] font-black tracking-wider text-slate-800">
        {title}
      </div>
      <button onClick={onOpenSettings} className="flex h-10 w-10 items-center justify-center text-slate-400 hover:text-slate-800 active:scale-90 transition-transform">
        <FaSlidersH size={18} />
      </button>
    </div>
  );
}

// ======================================
// 3. AI 美女头像 (字幕关闭时全屏居中显示)
// ======================================
function AIAvatarCenter({ isSpeaking, isRecording, isThinking }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center pb-20 chat-bg">
      <div className="relative flex items-center justify-center">
        {/* 动态光环 */}
        {isSpeaking && (
          <>
            <div className="absolute inset-0 rounded-full border border-pink-400/50 animate-ripple-1" />
            <div className="absolute inset-0 rounded-full border border-pink-400/30 animate-ripple-2" />
          </>
        )}
        {/* 极窄边框的头像 */}
        <div className="relative z-10 h-[110px] w-[110px] rounded-full overflow-hidden border border-slate-200/80 bg-white p-0.5 shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" 
            alt="AI Teacher" 
            className="h-full w-full object-cover rounded-full" 
          />
        </div>
      </div>
      
      {/* 状态提示 */}
      <div className="mt-8 px-6 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
        {isSpeaking ? (
          <span className="text-sm font-bold tracking-widest text-slate-500">正在讲解中...</span>
        ) : isThinking ? (
           <span className="text-sm font-bold tracking-widest text-blue-500 animate-pulse">思考中...</span>
        ) : isRecording ? (
           <span className="text-sm font-bold tracking-widest text-pink-500 animate-pulse">正在倾听...</span>
        ) : (
           <span className="text-sm font-bold tracking-widest text-slate-400">期待你的提问</span>
        )}
      </div>
    </div>
  );
}

// ======================================
// 4. 纯净聊天区 (字幕开启时显示，无头像无气泡)
// ======================================
function ChatList({ history, isRecording, textMode, inputText, replaySpecificAnswer, scrollRef }) {
  const [pinyinMap, setPinyinMap] = useState({});
  const togglePinyin = (id) => setPinyinMap((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 chat-bg no-scrollbar scroll-smooth">
      <div className="mx-auto flex w-full max-w-2xl flex-col pb-4">
        {history.map((msg) => {
          if (msg.role === 'error') {
            return <div key={msg.id} className="mb-6 text-left text-sm font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">⚠️ {msg.text}</div>;
          }

          // 用户文本：浅色，靠左，不覆盖底部面板
          if (msg.role === 'user') {
            return (
              <div key={msg.id} className="mb-6 w-full text-left pl-2">
                <div className="text-[14px] font-medium leading-relaxed text-slate-400 tracking-wide">
                  {msg.text}
                </div>
              </div>
            );
          }

          // AI 讲题文本
          const aiText = normalizeAssistantText(msg.text || '');
          const showPinyin = pinyinMap[msg.id];

          return (
            <div key={msg.id} className="mb-12 w-full flex flex-col items-start">
              <PinyinText text={aiText} showPinyin={showPinyin} isStreaming={msg.isStreaming} />
              
              {!msg.isStreaming && aiText && (
                <div className="flex items-center gap-4 mt-3 pl-1">
                  <button onClick={() => replaySpecificAnswer(msg.text)} className="text-slate-300 hover:text-pink-500 transition-colors p-1" title="朗读">
                    <FaVolumeUp size={18} />
                  </button>
                  <button onClick={() => togglePinyin(msg.id)} className={`text-[12px] font-black px-2 py-0.5 rounded transition-colors ${showPinyin ? 'bg-slate-200 text-slate-600' : 'bg-white border border-slate-200 text-slate-400 shadow-sm hover:text-pink-400 hover:border-pink-200'}`} title="拼音">
                    拼
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* 正在录音时的输入预览 */}
        {isRecording && textMode === false && inputText && (
          <div className="mb-6 w-full text-left pl-2">
            <div className="text-[14px] font-medium text-pink-400 animate-pulse tracking-wide">
              {inputText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ======================================
// 5. 底部操作台 (完美适配手机输入，不重叠)
// ======================================
function BottomControlBar({ textMode, setTextMode, isRecording, isThinking, isAiSpeaking, inputText, setInputText, sendMessage, stopEverything, handleMicPointerDown, handleMicPointerUp, handleMicPointerCancel, showText, setShowText }) {
  return (
    <div className="flex-none bg-white border-t border-slate-100 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
      <div className="mx-auto w-full max-w-lg flex items-center justify-between gap-3">
        
        {textMode ? (
          /* ----- 文本输入模式 ----- */
          <>
            <button onClick={() => setTextMode(false)} className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-90 transition-all">
              <FaMicrophone size={16} />
            </button>
            <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-full h-[44px] pl-4 pr-1.5 shadow-inner">
              <input
                type="text"
                className="can-select flex-1 bg-transparent text-[15px] text-slate-800 outline-none placeholder-slate-400 h-full"
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
                className={`flex shrink-0 h-8 w-8 items-center justify-center rounded-full transition-all active:scale-90 ${inputText.trim() ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-200 text-white'}`}
              >
                <FaPaperPlane size={12} className="-ml-0.5" />
              </button>
            </div>
          </>
        ) : (
          /* ----- 语音按钮模式 ----- */
          <>
            <button onClick={() => setTextMode(true)} className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-90 transition-all">
              <FaKeyboard size={18} />
            </button>
            <div className="flex-1 flex justify-center">
              <button
                onPointerDown={handleMicPointerDown}
                onPointerUp={handleMicPointerUp}
                onPointerCancel={handleMicPointerCancel}
                onPointerLeave={handleMicPointerCancel}
                onContextMenu={(e) => e.preventDefault()}
                className={`touch-none flex h-16 w-16 items-center justify-center rounded-full text-white transition-all duration-300 ${
                  isRecording
                    ? 'bg-pink-500 animate-pulse-ring scale-95'
                    : isAiSpeaking || isThinking
                    ? 'bg-pink-300'
                    : 'bg-pink-500 shadow-[0_8px_20px_rgba(236,72,153,.4)] hover:scale-105 active:scale-95'
                }`}
              >
                {isAiSpeaking || isThinking ? <FaStop size={24} onClick={(e) => { e.stopPropagation(); stopEverything(); }} /> : <FaMicrophone size={28} />}
              </button>
            </div>
          </>
        )}

        {/* 右侧：字幕开关按钮 */}
        <button onClick={() => setShowText(!showText)} className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-full transition-all active:scale-90 ${showText ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
          {showText ? <FaClosedCaptioning size={18} /> : <FaCommentSlash size={18} />}
        </button>

      </div>
    </div>
  );
}

// ======================================
// 主组件
// ======================================
export default function InteractiveAIExplanationPanel({ open, title = 'AI 讲题老师', initialPayload = null, onClose, settings, updateSettings }) {
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

  const isAIReady = useMemo(() => Boolean(effectiveSettings?.apiKey && effectiveSettings?.apiUrl && effectiveSettings?.model), [effectiveSettings]);
  const sessionOpen = open && isAIReady;

  const { history, isThinking, isAiSpeaking, textMode, setTextMode, inputText, setInputText, isRecording, scrollRef, sendMessage, stopEverything, handleMicPointerDown, handleMicPointerUp, handleMicPointerCancel, replaySpecificAnswer, showText, setShowText } = useAISession({
    open: sessionOpen,
    scene: AI_SCENES.EXERCISE,
    settings: effectiveSettings,
    initialPayload,
    bootstrapBuilder: buildExerciseBootstrapPrompt,
    defaultTextMode: false 
  });

  const actualShowText = showText ?? localShowText;
  const toggleShowText = (val) => { if (setShowText) setShowText(val); else setLocalShowText(val); };

  useEffect(() => setMounted(true), []);
  useEffect(() => { if (open && !isAIReady) setShowSettings(true); }, [open, isAIReady]);

  // 禁止底层滚动穿透
  useEffect(() => {
    if (!open) return;
    const prevBody = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevBody; };
  }, [open]);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, inputText, isRecording]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <GlobalStyles />
      <div className="fixed inset-0 z-[2147483000] bg-slate-900/40 backdrop-blur-sm" />

      {/* 采用 Flex 纵向布局，绝对防重叠 */}
      <div className="no-select fixed inset-0 z-[2147483001] flex flex-col bg-white text-slate-800 font-sans h-[100dvh]">
        
        <HeaderBar title={title} onBack={() => { stopEverything(); onClose?.(); }} onOpenSettings={() => setShowSettings(true)} />

        {!isAIReady ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
             <span className="text-4xl mb-4">⚙️</span>
             <p className="text-sm font-bold">请点击右上角配置 AI 模型</p>
          </div>
        ) : actualShowText ? (
          // 字幕开启：显示纯净聊天流
          <ChatList history={history} isRecording={isRecording} textMode={textMode} inputText={inputText} replaySpecificAnswer={replaySpecificAnswer} scrollRef={scrollRef} />
        ) : (
          // 字幕关闭：全屏居中显示 AI 美女头像
          <AIAvatarCenter isSpeaking={isAiSpeaking} isRecording={isRecording} isThinking={isThinking} />
        )}

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
        <RecognitionLanguagePicker open={false} recLang={null} setRecLang={() => {}} onClose={() => {}} theme="light" />
        <AISettingsModal open={showSettings} settings={effectiveSettings} updateSettings={effectiveUpdateSettings} onClose={() => setShowSettings(false)} scene="exercise" />
      </div>
    </>,
    document.body
  );
                                          }
